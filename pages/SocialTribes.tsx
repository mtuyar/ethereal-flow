import React, { useState } from 'react';
import { Group, User, Theme } from '../types';
import { Users, Plus, ArrowRight, Copy, Trophy, Target, MessageSquare, ChevronLeft, Shield, Hash } from 'lucide-react';

interface SocialTribesProps {
  groups: Group[];
  currentUser: User;
  theme: Theme;
  onCreateGroup: (name: string, desc: string) => void;
  onJoinGroup: (code: string) => void;
}

type ViewMode = 'list' | 'create' | 'join' | 'room';

export const SocialTribes: React.FC<SocialTribesProps> = ({ groups, currentUser, theme, onCreateGroup, onJoinGroup }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  
  // Create Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  
  // Join Form State
  const [joinCode, setJoinCode] = useState('');

  const isDark = theme === 'dark';
  const textPrimary = isDark ? 'text-white' : 'text-stone-800';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-stone-500';
  const bgCard = isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-[#FFFBF0] border-amber-100/50 shadow-sm';
  const accentColor = isDark ? 'bg-white text-black' : 'bg-stone-800 text-amber-50';

  const handleEnterRoom = (group: Group) => {
    setSelectedGroup(group);
    setViewMode('room');
  };

  const handleBack = () => {
    setSelectedGroup(null);
    setViewMode('list');
  };

  const submitCreate = () => {
    if(newName.trim()) {
      onCreateGroup(newName, newDesc);
      setViewMode('list');
      setNewName(''); setNewDesc('');
    }
  };

  // --- RENDER: LIST VIEW ---
  if (viewMode === 'list') {
    return (
      <div className="space-y-6 pb-24 animate-fade-in pt-4">
        {/* Header Actions */}
        <header className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className={`${textSecondary} text-xs font-semibold uppercase tracking-widest mb-1`}>Sosyal</h2>
              <h1 className={`text-3xl font-light ${textPrimary}`}>Ortak Yörünge</h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('join')}
                className={`p-3 rounded-full border transition-all ${isDark ? 'border-zinc-700 text-zinc-400 hover:text-white' : 'border-amber-200 text-stone-500 hover:text-stone-800'}`}
              >
                <Hash size={20} />
              </button>
              <button 
                onClick={() => setViewMode('create')}
                className={`p-3 rounded-full transition-all shadow-lg active:scale-95 ${accentColor}`}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Groups Grid */}
        <div className="space-y-4">
          {groups.length === 0 ? (
            <div className={`p-8 rounded-3xl border border-dashed text-center ${isDark ? 'border-zinc-800 text-zinc-600' : 'border-amber-200 text-stone-400'}`}>
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>Henüz bir kabilenin parçası değilsin.</p>
              <p className="text-xs mt-2">Kendi kabileni kur veya bir koda katıl.</p>
            </div>
          ) : (
            groups.map(group => (
              <div 
                key={group.id} 
                onClick={() => handleEnterRoom(group)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${bgCard}`}
              >
                <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-xl font-medium ${textPrimary}`}>{group.name}</h4>
                    <div className={`px-2 py-1 rounded-lg border text-xs flex items-center gap-1 ${isDark ? 'border-zinc-800 bg-zinc-900/50 text-zinc-400' : 'border-amber-100 bg-amber-50 text-stone-500'}`}>
                      <Users size={12} /> {group.members.length}
                    </div>
                </div>
                
                <p className={`text-sm mb-4 line-clamp-2 font-light ${textSecondary}`}>
                  {group.description || 'Açıklama yok.'}
                </p>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center -space-x-2">
                      {group.members.slice(0, 4).map((m, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-sm ${isDark ? 'bg-zinc-800 border-black text-white' : 'bg-amber-100 border-white text-stone-800'}`}>
                            {m.name.substring(0,1)}
                        </div>
                      ))}
                      {group.members.length > 4 && (
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] ${isDark ? 'bg-zinc-900 border-black text-zinc-500' : 'bg-stone-100 border-white text-stone-500'}`}>
                          +{group.members.length - 4}
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-medium flex items-center gap-1 ${textSecondary}`}>
                      Giriş Yap <ArrowRight size={14} />
                    </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: CREATE VIEW ---
  if (viewMode === 'create') {
    return (
      <div className="space-y-6 pb-24 animate-fade-in pt-4">
        <header className="flex items-center gap-4">
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-stone-200'}`}>
            <ChevronLeft size={24} className={textPrimary} />
          </button>
          <h1 className={`text-2xl font-light ${textPrimary}`}>Kabile Kur</h1>
        </header>

        <div className={`p-6 rounded-3xl border space-y-4 ${bgCard}`}>
           <div>
             <label className={`text-xs font-bold uppercase tracking-widest ml-1 mb-2 block ${textSecondary}`}>Kabile İsmi</label>
             <input 
               value={newName}
               onChange={e => setNewName(e.target.value)}
               placeholder="Örn: Sabah Savaşçıları"
               className={`w-full bg-transparent border-b py-2 text-lg outline-none ${isDark ? 'border-zinc-700 placeholder-zinc-700 text-white' : 'border-stone-300 placeholder-stone-300 text-stone-800'}`}
             />
           </div>
           <div>
             <label className={`text-xs font-bold uppercase tracking-widest ml-1 mb-2 block ${textSecondary}`}>Amaç / Motto</label>
             <input 
               value={newDesc}
               onChange={e => setNewDesc(e.target.value)}
               placeholder="Örn: Her sabah 6'da uyanıp dünyayı ele geçiriyoruz."
               className={`w-full bg-transparent border-b py-2 text-sm outline-none ${isDark ? 'border-zinc-700 placeholder-zinc-700 text-white' : 'border-stone-300 placeholder-stone-300 text-stone-800'}`}
             />
           </div>
           
           <div className="pt-4 flex gap-3">
             <button onClick={() => setViewMode('list')} className={`flex-1 py-3 rounded-xl font-medium text-sm ${isDark ? 'bg-zinc-800 text-white' : 'bg-stone-200 text-stone-600'}`}>İptal</button>
             <button onClick={submitCreate} className={`flex-1 py-3 rounded-xl font-medium text-sm shadow-md ${accentColor}`}>Oluştur</button>
           </div>
        </div>
      </div>
    );
  }

  // --- RENDER: JOIN VIEW ---
  if (viewMode === 'join') {
     return (
      <div className="space-y-6 pb-24 animate-fade-in pt-4">
        <header className="flex items-center gap-4">
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-stone-200'}`}>
            <ChevronLeft size={24} className={textPrimary} />
          </button>
          <h1 className={`text-2xl font-light ${textPrimary}`}>Kabileye Katıl</h1>
        </header>
        
        <div className={`p-8 rounded-3xl border flex flex-col items-center text-center space-y-6 ${bgCard}`}>
           <Shield size={48} className={isDark ? 'text-zinc-700' : 'text-stone-300'} strokeWidth={1} />
           <p className={`text-sm ${textSecondary}`}>Arkadaşından aldığın davet kodunu aşağıya gir.</p>
           
           <input 
             value={joinCode}
             onChange={e => setJoinCode(e.target.value.toUpperCase())}
             placeholder="KOD-123"
             className={`w-full text-center text-3xl font-mono bg-transparent border-b-2 py-2 outline-none uppercase tracking-widest ${isDark ? 'border-zinc-700 text-white placeholder-zinc-800' : 'border-stone-300 text-stone-800 placeholder-stone-200'}`}
           />

           <button onClick={() => { onJoinGroup(joinCode); setViewMode('list'); }} className={`w-full py-4 rounded-xl font-bold tracking-wider shadow-lg ${accentColor}`}>
             KATIL
           </button>
        </div>
      </div>
     )
  }

  // --- RENDER: ROOM VIEW ---
  if (viewMode === 'room' && selectedGroup) {
    // Sort members by score
    const sortedMembers = [...selectedGroup.members].sort((a, b) => (selectedGroup.scores[b.id] || 0) - (selectedGroup.scores[a.id] || 0));

    return (
      <div className="space-y-6 pb-24 animate-fade-in pt-4">
        {/* Navbar */}
        <header className="flex items-center gap-2">
          <button onClick={handleBack} className={`p-2 -ml-2 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-stone-200'}`}>
            <ChevronLeft size={24} className={textPrimary} />
          </button>
          <div className="flex-1">
             <h1 className={`text-xl font-bold truncate ${textPrimary}`}>{selectedGroup.name}</h1>
             <div className="flex items-center gap-2">
               <span className={`text-[10px] px-2 py-0.5 rounded border ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-stone-100 border-stone-200 text-stone-500'}`}>
                 KOD: {selectedGroup.code}
               </span>
             </div>
          </div>
          <button className={textSecondary}><Copy size={18} /></button>
        </header>

        {/* Top 3 Podium (Visual) */}
        {sortedMembers.length > 0 && (
          <div className="flex justify-center items-end gap-4 py-4">
             {/* 2nd Place */}
             {sortedMembers[1] && (
               <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full border-2 border-slate-300 flex items-center justify-center font-bold text-sm mb-2 bg-slate-100 text-slate-600 shadow-sm`}>
                    {sortedMembers[1].name.substring(0,1)}
                  </div>
                  <div className={`h-16 w-12 rounded-t-lg bg-gradient-to-t from-slate-300 to-slate-200 opacity-50`}></div>
               </div>
             )}
             {/* 1st Place */}
             {sortedMembers[0] && (
               <div className="flex flex-col items-center">
                  <Trophy className="text-yellow-500 mb-1" size={16} />
                  <div className={`w-16 h-16 rounded-full border-2 border-yellow-400 flex items-center justify-center font-bold text-xl mb-2 bg-yellow-100 text-yellow-700 shadow-lg`}>
                    {sortedMembers[0].name.substring(0,1)}
                  </div>
                  <div className={`h-24 w-16 rounded-t-lg bg-gradient-to-t from-yellow-400 to-yellow-200 opacity-80`}></div>
               </div>
             )}
             {/* 3rd Place */}
             {sortedMembers[2] && (
               <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full border-2 border-amber-600 flex items-center justify-center font-bold text-sm mb-2 bg-amber-100 text-amber-800 shadow-sm`}>
                    {sortedMembers[2].name.substring(0,1)}
                  </div>
                  <div className={`h-12 w-12 rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 opacity-50`}></div>
               </div>
             )}
          </div>
        )}

        {/* Full Leaderboard */}
        <div className={`rounded-3xl border overflow-hidden ${bgCard}`}>
           <div className={`px-4 py-3 border-b text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-amber-100 bg-stone-50 text-stone-500'}`}>
             <Trophy size={14} /> Liderlik Tablosu
           </div>
           {sortedMembers.map((member, idx) => (
             <div key={member.id} className={`flex items-center p-4 border-b last:border-0 ${isDark ? 'border-zinc-800' : 'border-amber-100/50'}`}>
                <span className={`w-6 font-mono font-bold ${idx < 3 ? 'text-yellow-500' : textSecondary}`}>{idx + 1}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${isDark ? 'bg-zinc-800 text-white' : 'bg-stone-200 text-stone-700'}`}>
                  {member.name.substring(0,1)}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${textPrimary}`}>{member.name} {member.id === currentUser.id && '(Sen)'}</div>
                </div>
                <div className={`font-mono font-bold ${textPrimary}`}>{selectedGroup.scores[member.id] || 0} XP</div>
             </div>
           ))}
        </div>

        {/* Common Habits */}
        <div className={`rounded-3xl border overflow-hidden ${bgCard}`}>
           <div className={`px-4 py-3 border-b text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-amber-100 bg-stone-50 text-stone-500'}`}>
             <Target size={14} /> Ortak Hedefler
           </div>
           {selectedGroup.tasks.map((task, i) => (
             <div key={i} className={`p-4 border-b last:border-0 flex justify-between items-center ${isDark ? 'border-zinc-800' : 'border-amber-100/50'}`}>
                <span className={textPrimary}>{task}</span>
                <button className={`text-xs px-3 py-1 rounded-full border ${isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-stone-200 hover:bg-stone-100 text-stone-500'}`}>
                  Ben Yaptım
                </button>
             </div>
           ))}
        </div>
        
        {/* Activity Feed */}
         <div className="space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${textSecondary} px-2`}>Kabile Duvarı</h3>
            {selectedGroup.activities?.map((log) => (
               <div key={log.id} className={`flex gap-3 text-sm p-3 rounded-2xl ${isDark ? 'bg-zinc-900/40' : 'bg-white/60'}`}>
                  <div className={`mt-0.5 min-w-[24px] h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-stone-200 text-stone-600'}`}>
                    {log.userName.substring(0,1)}
                  </div>
                  <div>
                    <span className={`font-bold mr-1 ${textPrimary}`}>{log.userName}</span>
                    <span className={textSecondary}>{log.action}</span>
                    <div className={`text-[10px] mt-0.5 ${textSecondary}`}>{log.timestamp}</div>
                  </div>
               </div>
            ))}
         </div>

      </div>
    );
  }

  return null;
};
