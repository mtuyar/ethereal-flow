export interface User {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: 'health' | 'learning' | 'work' | 'mindfulness';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  date: string; // ISO string YYYY-MM-DD
  time?: string; // HH:mm format
  frequency: 'once' | 'daily' | 'weekly' | 'custom';
  selectedDays?: number[]; // 0=Sunday, 1=Monday etc. for 'custom' or 'weekly'
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  code: string; // Invite code
  members: User[];
  tasks: string[]; 
  scores: Record<string, number>; 
  activities?: ActivityLog[];
}

export interface MoodEntry {
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'awful';
  note: string;
}

// Removed 'focus' from routes
export type PageRoute = 'dashboard' | 'social' | 'stats' | 'oracle' | 'journal';

export type Theme = 'dark' | 'light';
