import { useMutation } from '@tanstack/react-query';
import axios from 'axios'; // Or use your custom api instance

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      // Replace with your actual Hono endpoint URL
      const response = await axios.post('http://localhost:8787/api/auth/forgot-password', { email });
      return response.data;
    }
  });
};