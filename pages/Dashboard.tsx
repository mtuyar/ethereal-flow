import React, { useState, useEffect } from 'react';
import { Task, User, Theme } from '../types';
import { Check, Plus, Trash2, X, Clock, Edit2, Repeat, CalendarDays, Calendar } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  user: User;
  toggleTask: (id: string) => void;
  addTask: (task: Task) => void;
  editTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  theme: Theme;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, user, toggleTask, addTask, editTask, deleteTask, theme }) => {
  // Main State
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<Task['category']>('work');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [frequency, setFrequency] = useState<Task['frequency']>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  // Reset Form
  const resetForm = () => {
    setTitle(''); setTime(''); setCategory('work'); setPriority('medium'); setFrequency('daily'); setSelectedDays([]);
    setEditingTask(null);
  };

  // Open Edit
  const handleEditOpen = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setTime(task.time || '');
    setCategory(task.category);
    setPriority(task.priority);
    setFrequency(task.frequency);
    setSelectedDays(task.selectedDays || []);
    setIsModalOpen(true);
  };

  // Save (Add or Update)
  const handleSave = () => {
    if (!title.trim()) return;

    const taskData: Task = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      title,
      category,
      priority,
      completed: editingTask ? editingTask.completed : false,
      date: editingTask ? editingTask.date : new Date().toISOString().split('T')[0],
      time: time || undefined,
      frequency,
      selectedDays: frequency === 'custom' ? selectedDays : undefined
    };

    if (editingTask) {
      editTask(taskData);
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  // Filter Logic
  const todayStr = selectedDate.toISOString().split('T')[0];
  const dayIndex = selectedDate.getDay(); // 0-6 Sun-Sat

  const displayedTasks = tasks.filter(t => {
    if (t.frequency === 'once') return t.date === todayStr;
    if (t.frequency === 'daily') return true;
    if (t.frequency === 'custom' && t.selectedDays) {
       return t.selectedDays.includes(dayIndex);
    }
    return false; 
  });

  const completedCount = displayedTasks.filter(t => t.completed).length;

  const isDark = theme === 'dark';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-800';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const cardClass = isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-zinc-200 shadow-sm';

  const getWeekDays = () => {
    const days = [];
    for (let i = -2; i <= 2; i++) {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);
      days.push(new Date(d));
    }
    return days;
  };

  const getPriorityColor = (p: Task['priority']) => {
    if (p === 'high') return 'bg-red-500';
    if (p === 'medium') return 'bg-amber-400';
    return 'bg-emerald-500';
  };

  return (
    <>
      {/* --- SCROLLABLE CONTENT --- */}
      {/* We keep the animation here, but move the fixed button OUTSIDE this div */}
      <div className="space-y-8 pb-32 animate-fade-in relative pt-4">
        
        {/* HEADER */}
        <header className="flex flex-col gap-1">
          <h2 className={`${textSecondary} text-xs font-semibold uppercase tracking-widest`}>
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <div className="flex justify-between items-end">
             <h1 className={`text-3xl font-light ${textPrimary}`}>
               Merhaba, <span className="font-semibold">{user.name}</span>
             </h1>
             <div className={`text-xs px-3 py-1 rounded-full border font-medium ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500 bg-white'}`}>
               {completedCount}/{displayedTasks.length}
             </div>
          </div>
        </header>

        {/* MINIMAL CALENDAR */}
        <div className="flex justify-between items-center py-2">
          {getWeekDays().map((date, idx) => {
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = dateStr === todayStr;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`
                  flex flex-col items-center justify-center w-12 h-16 rounded-2xl transition-all duration-300
                  ${isSelected 
                    ? (isDark ? 'bg-white text-black' : 'bg-black text-white shadow-lg shadow-black/20') 
                    : (isDark ? 'text-zinc-600 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')}
                `}
              >
                <span className="text-[10px] font-bold uppercase">{date.toLocaleDateString('tr-TR', { weekday: 'short' })}</span>
                <span className="text-xl font-medium">{date.getDate()}</span>
                {isToday && !isSelected && <div className={`w-1 h-1 rounded-full mt-1 ${isDark ? 'bg-zinc-500' : 'bg-zinc-400'}`}></div>}
              </button>
            );
          })}
        </div>

        {/* TASK LIST */}
        <div className="space-y-3">
          {displayedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
               <Calendar className={`mb-2 ${textSecondary}`} size={32} strokeWidth={1.5} />
               <p className={`text-sm ${textSecondary} font-light`}>Plan boş.</p>
            </div>
          ) : (
            displayedTasks.map(task => (
              <div 
                key={task.id} 
                className={`
                  group flex items-center p-4 rounded-2xl border transition-all duration-200
                  ${cardClass}
                  ${task.completed ? 'opacity-50' : 'opacity-100'}
                `}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`
                    w-6 h-6 rounded-full border flex items-center justify-center transition-all mr-4
                    ${task.completed 
                      ? (isDark ? 'bg-white border-white text-black' : 'bg-black border-black text-white') 
                      : (isDark ? 'border-zinc-600 hover:border-zinc-400' : 'border-zinc-300 hover:border-zinc-500')}
                  `}
                >
                  {task.completed && <Check size={14} />}
                </button>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleEditOpen(task)}>
                  <div className="flex items-center gap-2 mb-0.5">
                     <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}></div>
                     {task.frequency === 'daily' && <Repeat size={10} className={textSecondary} />}
                     {task.frequency === 'custom' && <CalendarDays size={10} className={textSecondary} />}
                  </div>
                  <span className={`text-base font-medium truncate ${task.completed ? 'line-through' : ''} ${textPrimary}`}>
                    {task.title}
                  </span>
                  {task.time && (
                      <div className={`text-[10px] flex items-center gap-1 mt-0.5 ${textSecondary}`}>
                        <Clock size={10} /> {task.time}
                      </div>
                  )}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEditOpen(task)}
                    className={`p-2 rounded-lg ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className={`p-2 rounded-lg ${isDark ? 'text-zinc-500 hover:text-red-400' : 'text-zinc-400 hover:text-red-500'}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- FIXED FAB (OUTSIDE ANIMATED DIV) --- */}
      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className={`
            w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95
            ${isDark ? 'bg-white text-black' : 'bg-black text-white shadow-xl'}
          `}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
           
           <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fade-in-up border ${isDark ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white text-zinc-900 border-zinc-100'}`}>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-medium">{editingTask ? 'Görevi Düzenle' : 'Yeni Görev'}</h3>
                 <button onClick={() => setIsModalOpen(false)}><X size={20} className={textSecondary} /></button>
              </div>

              <div className="space-y-5">
                 <input 
                   autoFocus
                   type="text"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   placeholder="Ne yapacaksın?"
                   className={`w-full p-0 bg-transparent text-xl font-light outline-none border-b py-2 ${isDark ? 'border-zinc-700 placeholder-zinc-600' : 'border-zinc-200 placeholder-zinc-300'}`}
                 />

                 <div className="flex gap-4">
                    <div className="flex-1">
                      <label className={`text-[10px] uppercase font-bold mb-1 block ${textSecondary}`}>Sıklık</label>
                      <select 
                        value={frequency} 
                        onChange={(e) => setFrequency(e.target.value as any)}
                        className={`w-full bg-transparent border-b py-1 outline-none text-sm ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}
                      >
                         <option value="once">Tek Seferlik</option>
                         <option value="daily">Her Gün</option>
                         <option value="custom">Belirli Günler</option>
                      </select>
                    </div>
                    <div>
                      <label className={`text-[10px] uppercase font-bold mb-1 block ${textSecondary}`}>Saat</label>
                      <input 
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={`bg-transparent outline-none text-sm border-b py-1 ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}
                      />
                    </div>
                 </div>

                 {frequency === 'custom' && (
                   <div className="flex justify-between gap-1">
                     {['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'].map((d, idx) => {
                       const isActive = selectedDays.includes(idx);
                       return (
                         <button
                           key={idx}
                           onClick={() => {
                              setSelectedDays(prev => isActive ? prev.filter(i => i !== idx) : [...prev, idx]);
                           }}
                           className={`w-8 h-8 rounded-full text-xs font-bold transition-all border
                             ${isActive 
                               ? (isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black') 
                               : (isDark ? 'text-zinc-600 border-zinc-800' : 'text-zinc-400 border-zinc-200')}
                           `}
                         >
                           {d}
                         </button>
                       )
                     })}
                   </div>
                 )}

                 <div className="flex gap-2 pt-2">
                    {(['low', 'medium', 'high'] as const).map(p => (
                       <button
                         key={p}
                         onClick={() => setPriority(p)}
                         className={`w-4 h-4 rounded-full transition-all ${priority === p ? 'ring-2 ring-offset-2 ring-offset-transparent scale-110 ' + getPriorityColor(p) : 'bg-zinc-500/30'}`}
                       />
                    ))}
                    <span className={`text-xs ml-2 self-center ${textSecondary}`}>
                       {priority === 'high' ? 'Yüksek' : priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                 </div>

                 <button 
                   onClick={handleSave}
                   className={`w-full py-3.5 mt-2 rounded-xl font-medium text-sm transition-all active:scale-95 shadow-lg ${isDark ? 'bg-white text-black' : 'bg-black text-white shadow-zinc-300'}`}
                 >
                   {editingTask ? 'Güncelle' : 'Ekle'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};
