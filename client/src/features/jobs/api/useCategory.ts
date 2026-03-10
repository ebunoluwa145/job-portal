import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Note: the URL depends on your router prefix (e.g., /api/jobs/categories)
      const API_URL = import.meta.env.VITE_API_URL ;
      const { data } = await axios.get(`${API_URL}/api/jobs/categories`);
      return data.data || [];
    },
  });
};