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
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log("Token saved to localStorage!");
      }
      // We only need the user info now. The browser has the token in a cookie!
      if (data.user) {
        setAuth(data.user); 
      }
    },
    onError: (error: any) => {
      console.error("Login Mutation Error:", error);
    }
  });
};