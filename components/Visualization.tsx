import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { MaterialParams } from '../types';

interface VisualizationProps {
  current: MaterialParams;
  set: Partial<MaterialParams>;
  computedLS3: string;
  computedWeight: string;
}

export const Visualization: React.FC<VisualizationProps> = ({ current, set, computedLS3 }) => {
  const data = [
    {
      name: 'RPM',
      Current: current.rpm,
      Set: set.rpm || 0,
    },
    {
      name: 'Sizer',
      Current: current.sizer,
      Set: set.sizer || 0,
    },
    {
        name: 'LS3',
        Current: current.ls3,
        Set: parseFloat(computedLS3) || 0,
    }
  ];

  // Only show if we have some set values
  if (!set.rpm && !set.sizer) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 p-3 border border-slate-800 shadow-2xl rounded-lg text-xs text-white">
          <p className="font-bold text-slate-300 mb-2 border-b border-slate-700 pb-1">{label}</p>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-2.5 h-2.5 rounded bg-slate-500" />
            <span className="text-slate-400 font-medium">Current:</span>
            <span className="font-mono font-bold text-white ml-auto">{payload[0].value}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded bg-[#2563EB]" />
            <span className="text-slate-400 font-medium">Set:</span>
            <span className="font-mono font-bold text-[#3b82f6] ml-auto">{payload[1].value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-3">
            <span className="w-1.5 h-5 bg-[#2563EB] rounded-full"></span>
            Parameter Comparison
        </h3>
        <div className="flex gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div> Current
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></div> Set
            </div>
        </div>
      </div>
      
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }} barGap={6}>
            <CartesianGrid horizontal={false} stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                width={70} 
                tick={{fontSize: 13, fill: '#475569', fontWeight: 700}} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
            <Bar dataKey="Current" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={16} animationDuration={1000} />
            <Bar dataKey="Set" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={16} animationDuration={1000}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Set > entry.Current ? '#2563EB' : '#f59e0b'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};