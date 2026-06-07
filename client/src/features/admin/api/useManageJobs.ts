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
  
  // Base URL matching your Hono setup
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

  // 1. Fetching Logic (Kept intact: admins get all jobs, employees get their listings)
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
      
      // ✅ FIXED: Both admins and employers write to the same target route path /api/jobs/:id
      const res = await api.put(`${API_URL}/jobs/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate lists to trigger UI refreshes instantly
      queryClient.invalidateQueries({ queryKey: ['manage-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });

  // 3. Delete Logic
  const deleteMutation = useMutation<any, Error, number>({
    mutationFn: async (id) => {
      const token = localStorage.getItem('token');
      
      // ✅ FIXED: Standardized target route path to remove the unmapped /admin pathing block
      const res = await api.delete(`${API_URL}/jobs/${id}`, {
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