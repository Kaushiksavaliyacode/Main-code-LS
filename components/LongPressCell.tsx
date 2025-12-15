import React, { useState, useRef, useEffect } from 'react';
import { Lock, Edit3, Check } from 'lucide-react';
import { LONG_PRESS_DURATION } from '../constants';

interface LongPressCellProps {
  value: number;
  unit: string;
  onUpdate: (value: number) => void;
  isEditable?: boolean;
}

export const LongPressCell: React.FC<LongPressCellProps> = ({ value, unit, onUpdate, isEditable = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const [progress, setProgress] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const startPress = () => {
    if (!isEditable || isEditing) return;

    setIsPressed(true);
    let elapsed = 0;
    const interval = 16; // ~60fps
    
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    progressIntervalRef.current = setInterval(() => {
      elapsed += interval;
      const p = Math.min((elapsed / LONG_PRESS_DURATION) * 100, 100);
      setProgress(p);
    }, interval);

    timerRef.current = setTimeout(() => {
      setIsEditing(true);
      resetPress();
      // Focus after render
      setTimeout(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
      }, 50);
    }, LONG_PRESS_DURATION);
  };

  const resetPress = () => {
    setIsPressed(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(0);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    const num = parseFloat(inputValue);
    if (!isNaN(num) && num >= 0) {
      onUpdate(num);
    } else {
      setInputValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFinishEditing();
    if (e.key === 'Escape') {
        setInputValue(value.toString());
        setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="relative w-full h-14">
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleFinishEditing}
          onKeyDown={handleKeyDown}
          className="w-full h-full px-4 text-right text-xl font-black text-slate-900 bg-white border-2 border-[#2563EB] rounded-xl shadow-sm outline-none transition-all"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563EB]">
            <Check size={18} strokeWidth={3} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-14 flex items-center justify-end px-4 rounded-xl border-2 transition-all duration-200 select-none touch-none cursor-pointer overflow-hidden group
      ${isPressed ? 'bg-blue-50 border-blue-200 scale-[0.98]' : 'bg-slate-50 border-slate-100 hover:border-blue-100 hover:bg-blue-50/30'}
      `}
      onMouseDown={startPress}
      onMouseUp={resetPress}
      onMouseLeave={resetPress}
      onTouchStart={startPress}
      onTouchEnd={resetPress}
      onTouchCancel={resetPress}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Background Progress Fill */}
      <div 
        className="absolute bottom-0 left-0 top-0 bg-[#2563EB]/10 transition-all duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
      
      <div className="flex items-baseline gap-1.5 relative z-10">
        <span className={`text-xl font-bold tracking-tight transition-colors ${isPressed ? 'text-[#2563EB]' : 'text-slate-800'}`}>
            {value}
        </span>
        {unit && (
            <span className={`text-xs font-bold uppercase tracking-wide ${isPressed ? 'text-[#2563EB]/80' : 'text-slate-400'}`}>
                {unit}
            </span>
        )}
      </div>

      {isEditable && (
         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             {isPressed ? <Edit3 size={16} className="animate-pulse text-[#2563EB]" strokeWidth={2.5} /> : <Lock size={14} strokeWidth={2.5} />}
         </div>
      )}
    </div>
  );
};