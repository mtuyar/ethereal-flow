import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { getAiMotivation } from '../services/geminiService';
import { User, Task } from '../types';
import { Brain, Sparkles, Loader2 } from 'lucide-react';

interface AiMentorProps {
  user: User;
  tasks: Task[];
}

export const AiMentor: React.FC<AiMentorProps> = ({ user, tasks }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConsultOracle = async () => {
    setLoading(true);
    const completed = tasks.filter(t => t.completed && t.date === new Date().toISOString().split('T')[0]).length;
    const pending = tasks.filter(t => !t.completed && t.date === new Date().toISOString().split('T')[0]).length;
    
    // Simulating finding the most frequent category recently
    const recentHabit = 'Disiplin ve Süreklilik'; 

    const result = await getAiMotivation(user.name, completed, pending, recentHabit);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in min-h-[80vh] flex flex-col">
       <header>
        <h2 className="text-gray-400 text-sm tracking-widest uppercase mb-1">Yapay Zeka Rehberi</h2>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          The Oracle
        </h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        
        {/* The Oracle Eye/Button */}
        <div className="relative group cursor-pointer" onClick={!loading ? handleConsultOracle : undefined}>
          <div className={`
             absolute inset-0 bg-purple-600 rounded-full blur-3xl opacity-20 
             group-hover:opacity-40 transition-opacity duration-500
             ${loading ? 'animate-pulse' : ''}
          `}></div>
          <div className={`
             w-40 h-40 rounded-full bg-gradient-to-br from-gray-900 to-black border border-purple-500/30
             flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.2)]
             transition-all duration-500 transform group-hover:scale-105
             ${loading ? 'animate-spin-slow border-t-purple-400' : ''}
          `}>
             {loading ? <Loader2 className="text-purple-400 animate-spin" size={40} /> : <Brain className="text-purple-400" size={50} />}
          </div>
          <div className="absolute -bottom-10 left-0 right-0 text-center">
             <span className="text-xs uppercase tracking-[0.3em] text-purple-300">
               {loading ? 'Bağlantı Kuruluyor...' : 'Bilgeye Danış'}
             </span>
          </div>
        </div>

        {/* Advice Card */}
        {advice && (
          <div className="animate-fade-in-up w-full">
            <GlassCard className="relative border-purple-500/20 bg-purple-900/10">
               <Sparkles className="absolute top-4 right-4 text-purple-400" size={20} />
               <h3 className="text-purple-300 font-bold mb-4 text-lg">Günün Kehaneti</h3>
               <p className="text-lg italic text-white leading-relaxed font-light">
                 "{advice}"
               </p>
            </GlassCard>
          </div>
        )}

        {!advice && !loading && (
           <p className="text-gray-500 text-center max-w-xs text-sm leading-relaxed">
             Oracle, senin günlük verilerini analiz eder ve stoacı, fütüristik bir bakış açısıyla sana yol gösterir.
           </p>
        )}
      </div>
    </div>
  );
};
