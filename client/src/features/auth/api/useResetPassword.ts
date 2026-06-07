import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

interface ResetPasswordPayload {
  token: string;
  newPassword:  string;
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const response = await axios.post(`${API_BASE}/auth/reset-password`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Password updated successfully:', data);
    },
    onError: (error: any) => {
      console.error('❌ Reset Password Error:', error.response?.data?.message || error.message);
    }
  });
};