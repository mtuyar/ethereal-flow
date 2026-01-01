import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Play, Pause, RefreshCw } from 'lucide-react';

export const FocusZone: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound here ideally
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in flex flex-col items-center justify-center min-h-[70vh]">
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] transition-all duration-1000 ${isActive ? 'scale-110 opacity-30' : 'scale-100 opacity-20'}`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] transition-all duration-1000 ${isActive ? 'scale-125 opacity-30' : 'scale-100 opacity-20'}`}></div>
       </div>

       <header className="text-center mb-8">
        <h2 className="text-gray-400 text-sm tracking-widest uppercase mb-1">Zihinsel Berraklık</h2>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-400">
          Zen Modu
        </h1>
      </header>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => switchMode('focus')}
          className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${mode === 'focus' ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}
        >
          Odak
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${mode === 'break' ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}
        >
          Mola
        </button>
      </div>

      {/* Timer Circle */}
      <div className="relative w-72 h-72 flex items-center justify-center">
         <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
           <circle cx="144" cy="144" r="130" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
           <circle 
             cx="144" cy="144" r="130" fill="transparent" stroke={mode === 'focus' ? '#22d3ee' : '#a855f7'} strokeWidth="8" 
             strokeDasharray={2 * Math.PI * 130}
             strokeDashoffset={2 * Math.PI * 130 * (1 - timeLeft / (mode === 'focus' ? 1500 : 300))}
             className="transition-all duration-1000 ease-linear"
             strokeLinecap="round"
           />
         </svg>
         <div className="text-6xl font-mono font-bold text-white tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
           {formatTime(timeLeft)}
         </div>
      </div>

      <div className="flex gap-6 mt-8">
        <button 
          onClick={toggleTimer}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          {isActive ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-16 h-16 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <RefreshCw size={24} />
        </button>
      </div>
    </div>
  );
};
