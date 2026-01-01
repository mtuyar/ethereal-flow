import React from 'react';
import { Theme } from '../../types';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  theme?: Theme;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverEffect = true,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden
        backdrop-blur-md border
        rounded-2xl p-5
        transition-all duration-200 ease-out
        ${isDark 
          ? 'bg-zinc-900/60 border-white/5 text-white' 
          : 'bg-white/70 border-zinc-200 text-zinc-800 shadow-sm'}
        
        ${hoverEffect && isDark ? 'hover:bg-zinc-800/60' : ''}
        ${hoverEffect && !isDark ? 'hover:bg-white hover:shadow-md' : ''}
        
        ${className}
      `}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
