import { useMutation } from '@tanstack/react-query';
import { client } from '../../../lib/api';
import { useAuthStore } from '../../../store/useAuthStore';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: any) => {
      // The logic must be async to handle the 'client' response
      const response = await client('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        // Make sure your 'client' wrapper includes credentials
      });
      return response; 
    },
    onSuccess: (data) => {
      // 1. Debug: Check what the server actually sent
      console.log("Login Response Data:", data);

      // 2. Extract user and token (handling potential nesting)
      const user = data.user || data.data?.user;
      const token = data.token || data.data?.token;

      if (user && token) {
        // 3. 🟢 THE FIX: Pass the user and the specific token string
        // Our store handles the localStorage.setItem('token') internally now
        setAuth(user, token);
        console.log("Login successful, store updated.");
      } else {
        console.warn("Login response missing user or token:", data);
      }
    },
    onError: (error: any) => {
      console.error("Login Mutation Error:", error.message || error);
    }
  });
};