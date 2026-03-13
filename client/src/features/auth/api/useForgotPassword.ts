import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// 1. Define the base URL dynamically
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      // 2. Use the dynamic API_BASE instead of hardcoded localhost
      const response = await axios.post(`${API_BASE}/auth/forgot-password`, { 
        email 
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Reset link sent successfully:', data);
    },
    onError: (error: any) => {
      console.error('❌ Forgot Password Error:', error.response?.data?.message || error.message);
    }
  });
};