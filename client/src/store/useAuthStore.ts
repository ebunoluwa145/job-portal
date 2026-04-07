import { create } from 'zustand';

// useAuthStore.ts
interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  setAuth: (user: any) => void; // Removed the 'token' argument
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  setAuth: (user) => set({ 
    user, 
    isAuthenticated: true 
    // No more localStorage.setItem('token', ...)!
  }),

  logout: () => {
    // We'll handle the cookie deletion on the backend
    set({ user: null, isAuthenticated: false });
  },
}));