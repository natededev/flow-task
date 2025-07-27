import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Project } from '@/types';

// Client-side state (UI state, preferences, etc.)
interface ClientState {
  // Auth state (persisted)
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state (not persisted)
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // App state
  currentProject: Project | null;
  
  // Actions
  setAuth: (user: User) => void;
  clearAuth: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCurrentProject: (project: Project | null) => void;
}

export const useClientStore = create<ClientState>()(
  persist(
    (set) => ({
      // Auth state
      user: null,
      isAuthenticated: false,
      
      // UI state
      sidebarOpen: true,
      theme: 'system',
      
      // App state
      currentProject: null,
      
      // Actions
      setAuth: (user: User) => set({ user, isAuthenticated: true }),
      clearAuth: () => set({ user: null, isAuthenticated: false, currentProject: null }),
      setSidebarOpen: (sidebarOpen: boolean) => set({ sidebarOpen }),
      setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),
      setCurrentProject: (currentProject: Project | null) => set({ currentProject }),
    }),
    {
      name: 'client-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
    }
  )
);
