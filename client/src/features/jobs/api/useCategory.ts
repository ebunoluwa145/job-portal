import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Note: the URL depends on your router prefix (e.g., /api/jobs/categories)
      const { data } = await axios.get('http://localhost:8787/api/jobs/categories');
      return data.data || [];
    },
  });
};