import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { MoodEntry } from '../types';
import { Smile, Meh, Frown, Save } from 'lucide-react';

export const Journal: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (selectedMood) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setNote('');
      setSelectedMood(null);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
       <header>
        <h2 className="text-gray-400 text-sm tracking-widest uppercase mb-1">İçsel Yankı</h2>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-red-400">
          Günlük Yansıma
        </h1>
      </header>

      <GlassCard>
        <h3 className="text-white text-lg font-bold mb-4">Bugün nasılsın?</h3>
        <div className="flex justify-between mb-6">
          {(['great', 'good', 'neutral', 'bad', 'awful'] as const).map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-xl transition-all
                ${selectedMood === mood ? 'bg-white/20 scale-110 ring-2 ring-white/50' : 'opacity-60 hover:opacity-100'}
              `}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl
                ${mood === 'great' ? 'bg-green-500' : 
                  mood === 'good' ? 'bg-blue-500' :
                  mood === 'neutral' ? 'bg-gray-500' :
                  mood === 'bad' ? 'bg-orange-500' : 'bg-red-500'}
              `}>
                 {mood === 'great' && '🤩'}
                 {mood === 'good' && '🙂'}
                 {mood === 'neutral' && '😐'}
                 {mood === 'bad' && '😔'}
                 {mood === 'awful' && '😫'}
              </div>
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Bugünden kendine ne not bırakmak istersin? (İsteğe bağlı)"
          className="w-full h-32 bg-black/20 rounded-xl p-4 text-white placeholder-gray-500 border border-white/5 outline-none focus:border-white/20 resize-none mb-4"
        />

        <button
          onClick={handleSave}
          disabled={!selectedMood}
          className={`
            w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
            ${!selectedMood 
               ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
               : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-[1.02] shadow-lg'}
          `}
        >
          {saved ? 'Kaydedildi!' : <><Save size={18}/> Yansımayı Kaydet</>}
        </button>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4">
         <GlassCard className="opacity-70">
            <div className="flex justify-between items-start">
               <div>
                 <span className="text-xs text-gray-400">Dün</span>
                 <p className="text-white mt-1 italic">"Zor bir gündü ama görevleri tamamlamak iyi hissettirdi."</p>
               </div>
               <span className="text-2xl">🙂</span>
            </div>
         </GlassCard>
      </div>
    </div>
  );
};
