import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, MaterialParams, RowConfig, RowType, FormulaConfig } from '../types';
import { DEFAULT_CURRENT, DEFAULT_FORMULA_CONFIG, ROW_CONFIGS } from '../constants';
import { LongPressCell } from './LongPressCell';
import { SettingsModal } from './SettingsModal';
import { ArrowRight, RefreshCw, Ruler, Activity, Gauge, Zap, Disc, CircleDashed, Info, Cloud, CloudOff } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Helper to map icons to row IDs
const getIconForRow = (id: string) => {
  switch (id) {
    case 'size': return <Ruler size={18} strokeWidth={2.5} />;
    case 'micron': return <Activity size={18} strokeWidth={2.5} />;
    case 'tu1': return <CircleDashed size={18} strokeWidth={2.5} />;
    case 'tu2': return <Disc size={18} strokeWidth={2.5} />;
    case 'tu3': return <Zap size={18} strokeWidth={2.5} />;
    case 'rpm': return <Gauge size={18} strokeWidth={2.5} />;
    default: return <Info size={18} strokeWidth={2.5} />;
  }
};

interface CalculatorProps {
  showSettings: boolean;
  onCloseSettings: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ showSettings, onCloseSettings }) => {
  const [state, setState] = useState<AppState>({
    current: { ...DEFAULT_CURRENT },
    set: {},
    formulaConfig: { ...DEFAULT_FORMULA_CONFIG },
    isCustomCalc: false,
  });

  const [results, setResults] = useState<Record<string, string>>({
    tu1: '',
    tu2: '',
    tu3: '',
  });

  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'offline'>('idle');
  const isFirstLoad = useRef(true);

  // Load data from Firebase on mount
  useEffect(() => {
    const loadData = async () => {
      if (!db) {
        setSyncStatus('offline');
        return;
      }
      try {
        const docRef = doc(db, "settings", "presets");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Extract current params and formula config if exists
          const currentParams = data.current as MaterialParams || DEFAULT_CURRENT;
          const configParams = data.formulaConfig as FormulaConfig || DEFAULT_FORMULA_CONFIG;

          setState(prev => ({ 
            ...prev, 
            current: { ...DEFAULT_CURRENT, ...currentParams },
            formulaConfig: { ...DEFAULT_FORMULA_CONFIG, ...configParams }
          }));
          console.log("Data loaded from Firebase");
        }
      } catch (error) {
        console.error("Error loading from Firebase:", error);
        setSyncStatus('error');
      } finally {
        isFirstLoad.current = false;
      }
    };
    loadData();
  }, []);

  // Save data to Firebase when 'current' or 'formulaConfig' changes
  useEffect(() => {
    if (isFirstLoad.current) return;
    if (!db) return;

    const saveData = async () => {
      setSyncStatus('saving');
      try {
        await setDoc(doc(db, "settings", "presets"), {
            current: state.current,
            formulaConfig: state.formulaConfig
        });
        setSyncStatus('saved');
        setTimeout(() => setSyncStatus('idle'), 2000);
      } catch (error) {
        console.error("Error saving to Firebase:", error);
        setSyncStatus('error');
      }
    };

    const timer = setTimeout(saveData, 1000); 
    return () => clearTimeout(timer);
  }, [state.current, state.formulaConfig]);

  const handleCurrentUpdate = (key: keyof MaterialParams, value: number) => {
    setState((prev) => {
      const newState = {
        ...prev,
        current: { ...prev.current, [key]: value },
      };
      if (key === 'tu3') {
        newState.isCustomCalc = true;
      }
      return newState;
    });
  };

  const handleSetUpdate = (key: keyof MaterialParams, value: string) => {
    const numValue = parseFloat(value);
    setState((prev) => ({
      ...prev,
      set: { ...prev.set, [key]: isNaN(numValue) ? undefined : numValue },
      isCustomCalc: false 
    }));
  };

  const handleFormulaSave = (newConfig: FormulaConfig) => {
    setState(prev => ({ ...prev, formulaConfig: newConfig }));
  };

  const calculate = useCallback(() => {
    const { current, set, formulaConfig } = state;
    
    const setSize = set.size || 0;
    const setMicron = set.micron || 0;
    const setRPM = set.rpm || 0;

    if (setSize <= 0 || setMicron <= 0 || current.rpm <= 0) {
      setResults({ tu1: '', tu2: '', tu3: '' });
      return;
    }

    // Formula for TU3: 
    // (Current Size * Current Micron * Current TU3 * Set RPM) / (Set Size * Set Micron * Current RPM)
    const numerator = current.size * current.micron * current.tu3 * setRPM;
    const denominator = setSize * setMicron * current.rpm;
    
    const finalTU3 = numerator / denominator;

    // Formula for TU2: Set TU3 + Offset (Default +70)
    const finalTU2 = finalTU3 + formulaConfig.tu2Offset;

    // Formula for TU1: Set TU2 + Offset (Default -100)
    const finalTU1 = finalTU2 + formulaConfig.tu1Offset;

    setResults({
      tu3: finalTU3.toFixed(2),
      tu2: finalTU2.toFixed(2),
      tu1: finalTU1.toFixed(2),
    });
  }, [state]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const resetAll = () => {
    setState(prev => ({
        ...prev,
        current: { ...DEFAULT_CURRENT },
        set: {},
        isCustomCalc: false
    }));
  };

  const inputRows = ROW_CONFIGS.filter(r => r.type === RowType.INPUT);
  const outputRows = ROW_CONFIGS.filter(r => r.type !== RowType.INPUT);

  const renderRow = (row: RowConfig, isOutput: boolean = false) => {
    const isCalculated = row.type === RowType.CALCULATED_INPUT;
    const resultValue = results[row.id];
    const hasValue = state.set[row.id] !== undefined || (isCalculated && resultValue);
    
    return (
      <div key={row.id} className="group relative">
        <div className={`grid grid-cols-12 items-center gap-4 py-5 px-6 transition-colors ${isOutput ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
            
            {/* Label Section */}
            <div className="col-span-4 sm:col-span-3 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isOutput ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-[#2563EB] group-hover:shadow-md group-hover:shadow-blue-100'} transition-all duration-300`}>
                    {getIconForRow(row.id as string)}
                </div>
                <div className="flex flex-col">
                    <span className={`text-sm font-bold ${isOutput ? 'text-[#2563EB]' : 'text-slate-800'}`}>{row.label}</span>
                    {row.unit && <span className="text-[10px] text-slate-500 font-bold">{row.unit}</span>}
                </div>
            </div>

            {/* Current Value */}
            <div className="col-span-4 sm:col-span-4">
                <div className="w-full">
                    <LongPressCell 
                        value={state.current[row.id]} 
                        unit={row.unit}
                        onUpdate={(val) => handleCurrentUpdate(row.id, val)}
                        isEditable={true}
                    />
                </div>
            </div>

            {/* Arrow & Input Section */}
            <div className="col-span-4 sm:col-span-5 flex items-center gap-2">
                <div className="hidden sm:flex text-slate-300">
                    <ArrowRight size={20} strokeWidth={2.5} />
                </div>
                <div className="w-full relative">
                    {isCalculated ? (
                        <div className={`
                            w-full h-14 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-300
                            ${resultValue 
                                ? 'bg-white border-[#2563EB]/30 shadow-sm' 
                                : 'bg-slate-100/50 border-transparent text-slate-300'}
                        `}>
                            {resultValue ? (
                                <>
                                    <span className="text-xl font-black text-[#2563EB] leading-none tracking-tight">
                                        {resultValue}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#2563EB]/70 mt-1">Calculated</span>
                                </>
                            ) : (
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Auto</span>
                            )}
                        </div>
                    ) : (
                        <div className="relative group/input">
                            <input
                                type="number"
                                placeholder="-"
                                step={row.step}
                                value={state.set[row.id] || ''}
                                onChange={(e) => handleSetUpdate(row.id, e.target.value)}
                                className={`
                                    w-full h-14 text-center text-xl font-black text-slate-900 rounded-xl border-2 outline-none transition-all placeholder:text-slate-300
                                    ${hasValue 
                                        ? 'bg-white border-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,0.1)]' 
                                        : 'bg-white border-slate-200 focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.15)]'}
                                `}
                            />
                            {!hasValue && (
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none group-focus-within/input:opacity-0 transition-opacity">
                                    INPUT
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="absolute bottom-0 left-16 right-6 h-[1px] bg-slate-100"></div>
      </div>
    );
  };

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 pb-24 mt-6">
      <SettingsModal 
        isOpen={showSettings}
        onClose={onCloseSettings}
        config={state.formulaConfig}
        onSave={handleFormulaSave}
      />
      
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
        <div className="grid grid-cols-12 px-6 py-5 bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-widest font-extrabold text-slate-500 relative">
            <div className="col-span-4 sm:col-span-3 pl-2">Parameter</div>
            <div className="col-span-4 sm:col-span-4 text-right pr-4 flex items-center justify-end gap-2">
              Current
              {syncStatus !== 'offline' && (
                <div title={syncStatus === 'saving' ? "Saving..." : syncStatus === 'saved' ? "Saved" : "Cloud Sync"}>
                   {syncStatus === 'saving' ? (
                     <RefreshCw size={12} className="animate-spin text-[#2563EB]" />
                   ) : syncStatus === 'error' ? (
                     <CloudOff size={12} className="text-red-500" />
                   ) : (
                     <Cloud size={12} className={syncStatus === 'saved' ? "text-[#2563EB]" : "text-slate-300"} />
                   )}
                </div>
              )}
            </div>
            <div className="hidden sm:block sm:col-span-1"></div>
            <div className="col-span-4 sm:col-span-4 text-center">Set</div>
        </div>

        <div className="flex flex-col">
            {inputRows.map(row => renderRow(row))}
        </div>

        <div className="bg-slate-50 p-4 flex justify-center items-center gap-6 border-y border-slate-100">
            <div className="h-[2px] bg-slate-200 w-full max-w-[120px] rounded-full"></div>
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400">Results</span>
            <div className="h-[2px] bg-slate-200 w-full max-w-[120px] rounded-full"></div>
        </div>

        <div className="flex flex-col">
            {outputRows.map(row => renderRow(row, true))}
        </div>
        
        <div className="bg-slate-50 px-6 py-5 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-4">
            <button 
                onClick={resetAll}
                className="group flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-[#2563EB] hover:border-[#2563EB]/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all active:scale-95"
            >
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" strokeWidth={3} /> 
                RESET CALCULATION
            </button>
        </div>
      </div>
    </main>
  );
};