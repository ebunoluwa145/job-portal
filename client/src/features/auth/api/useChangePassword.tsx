import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

interface ChangePasswordPayload {
  currentPassword:  string;
  newPassword:      string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${API_BASE}/auth/change-password`, payload, {
        headers: { 
          // 🟢 Pass the token so your Hono authMiddleware can decode who you are
          Authorization: `Bearer ${token}` 
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Account password modified successfully:', data);
    },
    onError: (error: any) => {
      console.error('❌ Change Password Error:', error.response?.data?.message || error.message);
    }
  });
};