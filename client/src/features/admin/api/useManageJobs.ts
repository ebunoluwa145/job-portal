import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useManageJobs = () => {
  const queryClient = useQueryClient(); // This is the "manager"
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

  // 1. Fetching logic (Admins get all, Employers get theirs)
  const query = useQuery({
    queryKey: ['manageable-jobs'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/jobs/manageable`, {
        withCredentials: true 
      });
      return response.data.data || [];
    },
  });

  // 2. Deletion logic
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await axios.delete(`${API_URL}/api/jobs/${id}`, {
        withCredentials: true
      });
    },
    onSuccess: () => {
      // THIS IS THE KEY: It tells the 'manageable-jobs' query above 
      // to run again so the deleted job disappears from the table.
      queryClient.invalidateQueries({ queryKey: ['manageable-jobs'] });
    },
  });

  return {
    jobs: query.data,
    isLoading: query.isLoading,
    deleteJob: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
};