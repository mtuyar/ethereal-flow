import React, { useState, useEffect } from 'react';
import { User, Task, Group, PageRoute, Theme } from './types';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { SocialTribes } from './pages/SocialTribes';
import { Analytics } from './pages/Analytics';
import { AiMentor } from './pages/AiMentor';
import { Journal } from './pages/Journal';
import { GlassCard } from './components/ui/GlassCard';
import { Sun, Moon } from 'lucide-react';

// Dummy Initial Data
const CURRENT_USER: User = { id: 'u1', name: 'Alperen', avatar: '', xp: 650, level: 7 };

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageRoute>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [userNameInput, setUserNameInput] = useState('');
  const [theme, setTheme] = useState<Theme>('dark');
  
  // State for Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('ef_tasks');
    if (saved) return JSON.parse(saved);
    const today = new Date().toISOString().split('T')[0];
    return [
      { id: '1', title: 'Erken Uyan (06:00)', category: 'health', priority: 'high', completed: true, date: today, frequency: 'daily' },
      { id: '2', title: 'React Çalış', category: 'work', priority: 'medium', completed: false, date: today, frequency: 'daily' },
    ];
  });

  // State for Groups
  const [groups, setGroups] = useState<Group[]>(() => {
    const savedGroups = localStorage.getItem('ef_groups');
    if (savedGroups) return JSON.parse(savedGroups);
    return [
      {
        id: 'g1',
        name: 'Sabah Savaşçıları',
        description: 'Erken uyanıp günü kazananların buluşma noktası.',
        code: 'SABAH-88',
        members: [
          { id: 'u1', name: 'Alperen', avatar: '', xp: 650, level: 7 },
          { id: 'u2', name: 'Ayşe', avatar: '', xp: 720, level: 8 },
          { id: 'u3', name: 'Mehmet', avatar: '', xp: 400, level: 4 },
        ],
        tasks: ['06:00 Uyanış', '10 Sayfa Kitap', 'Soğuk Duş'],
        scores: { 'u1': 850, 'u2': 920, 'u3': 450 },
        activities: [
          { id: 'a1', userId: 'u2', userName: 'Ayşe', action: '06:00 Uyanış tamamlandı', timestamp: '06:05' },
          { id: 'a2', userId: 'u1', userName: 'Alperen', action: '10 Sayfa Kitap okundu', timestamp: '06:30' }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ef_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ef_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    const savedUser = localStorage.getItem('ef_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = () => {
    if (userNameInput.trim()) {
      const newUser = { ...CURRENT_USER, name: userNameInput };
      setUser(newUser);
      localStorage.setItem('ef_user', JSON.stringify(newUser));
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
         return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const editTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Group Handlers
  const handleCreateGroup = (name: string, desc: string) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      description: desc,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      members: [user!],
      tasks: [],
      scores: { [user!.id]: user!.xp },
      activities: [{ id: Date.now().toString(), userId: user!.id, userName: user!.name, action: 'Kabile kuruldu', timestamp: 'Şimdi' }]
    };
    setGroups([...groups, newGroup]);
  };

  const handleJoinGroup = (code: string) => {
    // In a real app, this would check backend. Here we simulate.
    alert("Demo modunda kod ile katılım simülasyonu: Başarılı!");
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-black to-black"></div>
        <div className="relative z-10 w-full max-w-sm space-y-8 animate-fade-in-up">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-2">
              Ethereal Flow
            </h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase">Geleceğin Kişisel Gelişim Ekosistemi</p>
          </div>

          <GlassCard className="space-y-6 !p-8 border-t border-white/20">
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase font-bold ml-1">İsim / Kod Adı</label>
              <input 
                type="text" 
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                placeholder="Örn: Alperen"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <button 
              onClick={handleLogin}
              className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Yörüngeye Gir
            </button>
          </GlassCard>
        </div>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-700 ease-in-out ${isDark ? 'bg-black text-white' : 'bg-[#FAFAFA] text-zinc-800'}`}>
       
       {/* Global Background */}
       <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
          {isDark ? (
            <>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black"></div>
              <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
            </>
          ) : (
            <>
               {/* Warm, Paper-like Light Mode Background */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FFFCF5] via-[#FFFAF0] to-[#FFF0E6]"></div>
              <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
            </>
          )}
       </div>

       {/* Theme Toggle */}
       <button 
         onClick={toggleTheme}
         className={`fixed top-6 right-6 z-50 p-2.5 rounded-full shadow-sm backdrop-blur-xl border transition-all hover:scale-105
           ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-[#FFFBF0] border-orange-100 text-amber-900 hover:text-amber-700 shadow-md'}
         `}
       >
         {isDark ? <Sun size={18} /> : <Moon size={18} />}
       </button>

       <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col p-6">
          <div className="flex-1">
            {activePage === 'dashboard' && (
              <Dashboard 
                tasks={tasks} 
                user={user}
                toggleTask={toggleTask} 
                addTask={addTask} 
                editTask={editTask}
                deleteTask={deleteTask}
                theme={theme}
              />
            )}
            {activePage === 'social' && (
              <SocialTribes 
                groups={groups} 
                currentUser={user} 
                theme={theme} 
                onCreateGroup={handleCreateGroup}
                onJoinGroup={handleJoinGroup}
              />
            )}
            {activePage === 'stats' && <Analytics tasks={tasks} theme={theme} />}
            {activePage === 'oracle' && <AiMentor user={user} tasks={tasks} />}
            {activePage === 'journal' && <Journal />}
          </div>
       </div>

       <BottomNav activePage={activePage} setPage={setActivePage} theme={theme} />
    </div>
  );
};

export default App;
