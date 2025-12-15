import React, { useState, useEffect, useCallback } from 'react';
import { AppState, MaterialParams, RowConfig, RowType } from '../types';
import { DEFAULT_CURRENT, ROW_CONFIGS } from '../constants';
import { LongPressCell } from './LongPressCell';
import { Visualization } from './Visualization';
import { ArrowRight, RefreshCw, Ruler, Activity, Gauge, Zap, Scale, Info } from 'lucide-react';

// Helper to map icons to row IDs
const getIconForRow = (id: string) => {
  switch (id) {
    case 'sizer': return <Ruler size={18} strokeWidth={2.5} />;
    case 'micron': return <Activity size={18} strokeWidth={2.5} />;
    case 'rpm': return <Gauge size={18} strokeWidth={2.5} />;
    case 'ls3': return <Zap size={18} strokeWidth={2.5} />;
    case 'weight': return <Scale size={18} strokeWidth={2.5} />;
    default: return <Info size={18} strokeWidth={2.5} />;
  }
};

export const Calculator: React.FC = () => {
  const [state, setState] = useState<AppState>({
    current: { ...DEFAULT_CURRENT },
    set: {},
    isCustomLS3: false,
  });

  const [results, setResults] = useState({
    ls3: '',
    weight: '',
  });

  const handleCurrentUpdate = (key: keyof MaterialParams, value: number) => {
    setState((prev) => {
      const newState = {
        ...prev,
        current: { ...prev.current, [key]: value },
      };
      if (key === 'ls3') {
        newState.isCustomLS3 = true;
      }
      return newState;
    });
  };

  const handleSetUpdate = (key: keyof MaterialParams, value: string) => {
    const numValue = parseFloat(value);
    setState((prev) => ({
      ...prev,
      set: { ...prev.set, [key]: isNaN(numValue) ? undefined : numValue },
      isCustomLS3: false 
    }));
  };

  const calculate = useCallback(() => {
    const { current, set, isCustomLS3 } = state;
    const setSizer = set.sizer || 0;
    const setMicron = set.micron || 0;
    const setRPM = set.rpm || 0;

    if (setSizer <= 0 || setMicron <= 0 || current.rpm <= 0) {
      setResults({ ls3: '', weight: '-' });
      return;
    }

    const weight = setSizer * 0.00280 * 1 * setMicron;
    let finalLS3 = 0;
    
    if (isCustomLS3 && current.ls3 > 0) {
      finalLS3 = (current.ls3 / current.rpm) * setRPM;
    } else {
      const baseLS = 21470400000 / setSizer / setMicron / current.rpm;
      finalLS3 = baseLS * (setRPM / current.rpm);
    }

    setResults({
      ls3: finalLS3.toFixed(2),
      weight: weight.toFixed(4),
    });
  }, [state]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const resetAll = () => {
    setState({
        current: { ...DEFAULT_CURRENT },
        set: {},
        isCustomLS3: false
    });
  };

  // Group rows for UI
  const inputRows = ROW_CONFIGS.filter(r => r.type === RowType.INPUT);
  const outputRows = ROW_CONFIGS.filter(r => r.type !== RowType.INPUT);

  const renderRow = (row: RowConfig, isOutput: boolean = false) => {
    const isCalculated = row.type === RowType.CALCULATED_INPUT;
    const hasValue = state.set[row.id] !== undefined || (isCalculated && results[row.id as 'ls3'|'weight']);
    
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
                        value={row.id === 'weight' ? 0 : state.current[row.id]} 
                        unit={row.unit}
                        onUpdate={(val) => handleCurrentUpdate(row.id, val)}
                        isEditable={row.id !== 'weight'}
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
                            ${results[row.id as 'ls3' | 'weight'] 
                                ? 'bg-white border-[#2563EB]/30 shadow-sm' 
                                : 'bg-slate-100/50 border-transparent text-slate-300'}
                        `}>
                            {results[row.id as 'ls3' | 'weight'] ? (
                                <>
                                    <span className="text-xl font-black text-[#2563EB] leading-none tracking-tight">
                                        {row.id === 'ls3' ? results.ls3 : results.weight}
                                    </span>
                                    {/* Small label for context */}
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
                            {/* Floating Label for Set */}
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
        {/* Row Separator */}
        <div className="absolute bottom-0 left-16 right-6 h-[1px] bg-slate-100"></div>
      </div>
    );
  };

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 pb-24 mt-6">
      
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 px-6 py-5 bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-widest font-extrabold text-slate-500">
            <div className="col-span-4 sm:col-span-3 pl-2">Parameter</div>
            <div className="col-span-4 sm:col-span-4 text-right pr-4">Machine Preset</div>
            <div className="hidden sm:block sm:col-span-1"></div>
            <div className="col-span-4 sm:col-span-4 text-center">Target Value</div>
        </div>

        {/* Input Rows */}
        <div className="flex flex-col">
            {inputRows.map(row => renderRow(row))}
        </div>

        {/* Separator / Divider */}
        <div className="bg-slate-50 p-4 flex justify-center items-center gap-6 border-y border-slate-100">
            <div className="h-[2px] bg-slate-200 w-full max-w-[120px] rounded-full"></div>
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400">Results</span>
            <div className="h-[2px] bg-slate-200 w-full max-w-[120px] rounded-full"></div>
        </div>

        {/* Output Rows */}
        <div className="flex flex-col">
            {outputRows.map(row => renderRow(row, true))}
        </div>
        
        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-1 text-center sm:text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Instructions
                </span>
                <span className="text-sm text-slate-600 font-bold">
                    Long press "Machine Preset" values to edit defaults.
                </span>
            </div>
            <button 
                onClick={resetAll}
                className="group flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-[#2563EB] hover:border-[#2563EB]/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all active:scale-95"
            >
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" strokeWidth={3} /> 
                RESET CALCULATION
            </button>
        </div>
      </div>

      <Visualization 
        current={state.current} 
        set={state.set} 
        computedLS3={results.ls3} 
        computedWeight={results.weight}
      />

    </main>
  );
};