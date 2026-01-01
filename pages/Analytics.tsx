import React from 'react';
import { Task, Theme } from '../types';
import { ResponsiveContainer, BarChart, Bar, Cell, Tooltip } from 'recharts';

interface AnalyticsProps {
  tasks: Task[];
  theme: Theme;
}

export const Analytics: React.FC<AnalyticsProps> = ({ tasks, theme }) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const cardClass = isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-zinc-100 shadow-sm';

  const categoryData = [
    { name: 'Sağlık', value: 12 },
    { name: 'İş', value: 24 },
    { name: 'Ruh', value: 8 },
    { name: 'Gelişim', value: 15 },
  ];

  return (
    <div className="space-y-8 pb-24 animate-fade-in pt-4">
      <header>
        <h2 className={`${textSecondary} text-xs font-semibold uppercase tracking-widest mb-1`}>Veri Akışı</h2>
        <h1 className={`text-3xl font-light ${textPrimary}`}>İstatistikler</h1>
      </header>

      {/* Hero Metric */}
      <div className={`p-6 rounded-3xl border ${cardClass} flex flex-col items-center text-center space-y-2`}>
         <span className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Toplam Tamamlanan</span>
         <span className={`text-6xl font-light tracking-tighter ${textPrimary}`}>42</span>
         <span className="text-emerald-500 text-xs font-medium flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
            +12% Geçen Haftaya Göre
         </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className={`p-5 rounded-3xl border ${cardClass} flex flex-col justify-between h-32`}>
            <span className={`text-xs font-bold uppercase ${textSecondary}`}>Günlük Seri</span>
            <span className={`text-4xl font-light ${textPrimary}`}>5 Gün</span>
         </div>
         <div className={`p-5 rounded-3xl border ${cardClass} flex flex-col justify-between h-32`}>
             <span className={`text-xs font-bold uppercase ${textSecondary}`}>Verimlilik</span>
             <span className={`text-4xl font-light ${textPrimary}`}>%84</span>
         </div>
      </div>

      {/* Minimalist Chart */}
      <div className={`p-6 rounded-3xl border ${cardClass} h-64`}>
         <div className="flex justify-between items-center mb-4">
           <h3 className={`text-sm font-bold ${textPrimary}`}>Kategori Dağılımı</h3>
         </div>
         <ResponsiveContainer width="100%" height="80%">
             <BarChart data={categoryData}>
                <Tooltip 
                  cursor={{fill: 'transparent'}} 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#18181b' : '#fff', 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    color: isDark ? '#fff' : '#000'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={40}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={isDark ? '#3f3f46' : '#e4e4e7'} className="hover:opacity-80 transition-opacity" />
                  ))}
                </Bar>
             </BarChart>
         </ResponsiveContainer>
         <div className="flex justify-between px-2 mt-2">
            {categoryData.map((d, i) => (
               <span key={i} className={`text-[10px] ${textSecondary}`}>{d.name}</span>
            ))}
         </div>
      </div>
    </div>
  );
};
