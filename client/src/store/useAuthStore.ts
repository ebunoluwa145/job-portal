// import { create } from 'zustand';
// import { client } from '../lib/api'; // 🟢 Use your custom fetch client

// interface AuthState {
//   user: any | null;
//   isAuthenticated: boolean;
//   isInitialLoading: boolean; 
//   initialize: () => Promise<void>;
//   setAuth: (user: any, token: string) => void; 
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   isAuthenticated: false,
//   isInitialLoading: true, // 🟢 Keep this true to show "Loading..." on refresh

//   initialize: async () => {
//     const token = localStorage.getItem('token');
    
//     // If no token exists, we are definitely logged out.
//     if (!token || token === "undefined" || token === "null") {
//       set({ isInitialLoading: false, isAuthenticated: false });
//       return;
//     }

//     try {
//       // Use your existing client to check the session
//       // Since your client now attaches the token automatically, this will work
//       const userData = await client('/users/me');
      
//       set({ 
//         user: userData, 
//         isAuthenticated: true, 
//         isInitialLoading: false 
//       });
//     } catch (error) {
//       console.error("Session rehydration failed:", error);
//       localStorage.removeItem('token');
//       set({ user: null, isAuthenticated: false, isInitialLoading: false });
//     }
//   },

//   setAuth: (user, token) => {
//     // 🟢 Save the token to localStorage so it's there for the next refresh
//     if (token) {
//       localStorage.setItem('token', token);
//     }
//     set({ user, isAuthenticated: true, isInitialLoading: false });
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//     set({ user: null, isAuthenticated: false });
//   }
// }));


import { create } from 'zustand';
import axios from 'axios';
import { queryClient } from '../lib/queryClient'; // 🟢 Import the shared QueryClient

// 1. Define and EXPORT the User type so hooks can use it too
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  // ... any other fields from your JSON
}

// 2. Define the Store structure
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  initialize: () => Promise<void>;
  setAuth: (user: User, token: string) => void; 
  logout: () => void;
}

// 3. Create the store with the AuthState type
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialLoading: true,

  initialize: async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    set({ user: null, isAuthenticated: false, isInitialLoading: false }); // 🟢 Ensure it's NULL
    return;
  }

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    set({ user: res.data.data, isAuthenticated: true, isInitialLoading: false });
  } catch (error) {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false, isInitialLoading: false }); // 🟢 Force clear
  }
},

  setAuth: (user: User, token: string) => {
    localStorage.setItem('token', token);
    set({ user, isAuthenticated: true, isInitialLoading: false });
  },

  logout: () => {
  localStorage.removeItem('token');
  queryClient.clear(); // 🟢 This wipes the cache so no "ghost" data remains
  set({ user: null, isAuthenticated: false });
}
}));