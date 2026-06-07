import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 🟢 Define the shape of your Category based on your new DB schema
export interface Category {
  id: number;
  name: string;
  icon: string;
  slug: string;
  count: number;
}

export const useCategories = () => {
  return useQuery<Category[]>({ // 🟢 Tell React Query to expect an array of Categories
    queryKey: ['categories'],
    queryFn: async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      const response = await axios.get(`${API_URL}/jobs/categories`);
      
      console.log("Raw API Response:", response.data); 
      
      const result = response.data.data;
      
      return Array.isArray(result) ? result : [];
    },
    // 🟢 Optional: Keep the data fresh for 5 minutes
    staleTime: 1000 * 60 * 5, 
  });
};