import { create } from 'zustand';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'employee' | 'admin';
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   setAuth: (user: User, token: string) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       setAuth: (user, token) => set({ user, token }),
//       logout: () => set({ user: null, token: null }),
//     }),
//     {
//       name: 'aventon-auth-storage',
//     }
//   )
// );

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