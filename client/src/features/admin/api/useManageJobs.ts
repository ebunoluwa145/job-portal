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

  // 1. Fetching Logic
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['manage-jobs', userRole],
    queryFn: async () => {
      const endpoint = userRole === 'admin' ? '/admin/jobs' : '/jobs/my-listings';
      const res = await api.get(endpoint);
      // Returns the array directly (adjust if your API wraps it in res.data.data)
      return Array.isArray(res.data) ? res.data : res.data.data;
    }
  });

  // 2. Update Logic (Master Control)
  const updateMutation = useMutation<any, Error, { id: number; updates: any }>({
    mutationFn: async ({ id, updates }) => {
      const endpoint = userRole === 'admin' ? `/admin/jobs/${id}` : `/jobs/${id}`;
      const res = await api.patch(endpoint, updates);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manage-jobs'] });
    }
  });

  // 3. Delete Logic
  const deleteMutation = useMutation<any, Error, number>({
    mutationFn: async (id) => {
      const endpoint = userRole === 'admin' ? `/admin/jobs/${id}` : `/jobs/${id}`;
      const res = await api.delete(endpoint);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manage-jobs'] });
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