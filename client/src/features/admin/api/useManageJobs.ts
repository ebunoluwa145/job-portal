import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'axios'; // Adjust this path to your axios instance

interface ManageJobsReturn {
    jobs: any[] | undefined;
    isLoading: boolean;
    updateJobStatus: (variables: { id: number; updates: any }) => void;
    isUpdating: boolean;
    deleteJob: (id: number) => void;
    isDeleting: boolean;
}

export const useManageJobs = (userRole: string): ManageJobsReturn => {
  const queryClient = useQueryClient();
  
  // 🟢 FIXED: Ensure base URL includes the standard /api prefix matching your Hono setup
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

  // 1. Fetching Logic
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['manage-jobs', userRole],
    queryFn: async () => {
      const endpoint = userRole === 'admin' ? '/admin/jobs' : '/jobs/my-listings';
      const fullUrl = `${API_URL}${endpoint}`;

      const token = localStorage.getItem('token'); 

      const res = await api.get(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      
      return res.data?.data || [];
    },
  });

  // 2. Update Logic (Master Control)
  const updateMutation = useMutation<any, Error, { id: number; updates: any }>({
    mutationFn: async ({ id, updates }) => {
      const token = localStorage.getItem('token');
      const endpoint = userRole === 'admin' ? '/admin/jobs' : '/jobs';
      
      // 🟢 FIXED 1: Changed from api.patch to api.put to match your Hono route constraint
      // 🟢 FIXED 2: Correct URL resolution targets http://localhost:8787/api/jobs/6
      const res = await api.put(`${API_URL}${endpoint}/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate both lists to trigger UI refreshes instantly
      queryClient.invalidateQueries({ queryKey: ['manage-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });

  // 3. Delete Logic
  const deleteMutation = useMutation<any, Error, number>({
    mutationFn: async (id) => {
      const token = localStorage.getItem('token');
      const endpoint = userRole === 'admin' ? '/admin/jobs' : '/jobs';
      
      const res = await api.delete(`${API_URL}${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data?.data || [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manage-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
     
  return {
    jobs,
    isLoading,
    updateJobStatus: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteJob: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
};