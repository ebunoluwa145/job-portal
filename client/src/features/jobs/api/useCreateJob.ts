import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobData: any) => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      
      const token = localStorage.getItem('token');

  const { data } = await axios.post(`${API_URL}/jobs/create`, jobData, {
    headers: {
      // 🟢 2. This is what the server is waiting for!
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
      return data;
    },
    onSuccess: () => {
      // 🟢 3. Invalidate the 'jobs' query so the UI shows the new job immediately
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    // onError: (error: any) => {
    //   console.error("Post Job Error:", error.response?.data || error.message);
    // }
    onError: (error: any) => {
      console.error("--- POST JOB ERROR ---");
      console.error("Status:", error.response?.status); // Should be 401
      console.error("Server Message:", error.response?.data); // 🟢 THIS IS THE KEY
      console.error("Full Error:", error);
    }
  });
};