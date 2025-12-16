import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw } from 'lucide-react';
import { FormulaConfig } from '../types';
import { DEFAULT_FORMULA_CONFIG } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FormulaConfig;
  onSave: (newConfig: FormulaConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<FormulaConfig>(config);

  useEffect(() => {
    if (isOpen) {
      setLocalConfig(config);
    }
  }, [isOpen, config]);

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  const handleReset = () => {
    setLocalConfig(DEFAULT_FORMULA_CONFIG);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Formula Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            
            {/* TU2 Formula */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Take Up 2 Calculation
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400">TU2 = TU3 +</span>
                <input 
                  type="number" 
                  value={localConfig.tu2Offset}
                  onChange={(e) => setLocalConfig(prev => ({...prev, tu2Offset: parseFloat(e.target.value) || 0}))}
                  className="flex-1 h-10 px-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 font-bold focus:border-[#2563EB] outline-none transition-colors text-center"
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400 font-medium">
                Standard: TU3 + 70
              </p>
            </div>

            {/* TU1 Formula */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Take Up 1 Calculation
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400">TU1 = TU2 +</span>
                <input 
                  type="number" 
                  value={localConfig.tu1Offset}
                  onChange={(e) => setLocalConfig(prev => ({...prev, tu1Offset: parseFloat(e.target.value) || 0}))}
                  className="flex-1 h-10 px-3 bg-white border-2 border-slate-200 rounded-lg text-slate-900 font-bold focus:border-[#2563EB] outline-none transition-colors text-center"
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400 font-medium">
                Standard: TU2 - 100
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            <RefreshCw size={14} /> Reset Default
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};