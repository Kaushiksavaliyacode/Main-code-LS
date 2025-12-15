import React from 'react';
import { Settings2, Calculator } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/25 ring-1 ring-black/5">
            <Calculator size={22} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Material Calc</h1>
              <span className="px-2 py-0.5 bg-blue-50 text-[11px] font-black text-[#2563EB] rounded border border-blue-100 uppercase tracking-wider">Pro</span>
            </div>
            <p className="text-xs text-slate-600 font-bold leading-none mt-1.5">Industrial Sizing Utility</p>
          </div>
        </div>
        
        <button className="p-2.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-xl transition-colors">
          <Settings2 size={22} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
};