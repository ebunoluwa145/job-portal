import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobData: any) => {
      // This route must be protected in Hono to get the employeeId from the JWT
      const { data } = await axios.post('http://localhost:8787/api/jobs/create', jobData, {
        withCredentials: true // To send your JWT cookie
      });
      return data;
    },
    onSuccess: () => {
      // Refresh the feed automatically after posting
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
};