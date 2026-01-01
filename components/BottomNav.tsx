import React from 'react';
import { PageRoute, Theme } from '../types';
import { Home, Users, BarChart2, Brain, PenTool } from 'lucide-react';

interface BottomNavProps {
  activePage: PageRoute;
  setPage: (page: PageRoute) => void;
  theme: Theme;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, setPage, theme }) => {
  const isDark = theme === 'dark';

  const navItems: { id: PageRoute; icon: React.ReactNode }[] = [
    { id: 'dashboard', icon: <Home size={22} /> },
    { id: 'social', icon: <Users size={22} /> },
    { id: 'oracle', icon: <Brain size={22} /> },
    { id: 'stats', icon: <BarChart2 size={22} /> },
    { id: 'journal', icon: <PenTool size={22} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-6 pt-4 px-6 pointer-events-none">
      <div className={`
        mx-auto max-w-lg backdrop-blur-xl border rounded-3xl shadow-sm pointer-events-auto flex justify-between items-center py-4 px-6 transition-all duration-500
        ${isDark 
          ? 'bg-black/80 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]' 
          : 'bg-white/90 border-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)]'}
      `}>
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`
                relative flex items-center justify-center transition-all duration-300
                ${isActive && isDark ? 'text-white scale-110' : ''}
                ${isActive && !isDark ? 'text-black scale-110' : ''}
                ${!isActive && isDark ? 'text-zinc-600 hover:text-zinc-400' : ''}
                ${!isActive && !isDark ? 'text-zinc-400 hover:text-zinc-600' : ''}
              `}
            >
              {item.icon}
              {isActive && (
                <span className={`absolute -bottom-3 w-1 h-1 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`}></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
