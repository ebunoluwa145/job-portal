// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

// // export const useCategories = () => {
// //   return useQuery({
// //     queryKey: ['categories'],
// //     queryFn: async () => {
// //       // Note: the URL depends on your router prefix (e.g., /api/jobs/categories)
// //       const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'; // Fallback to localhost if env variable is missing
// //       const response = await axios.get(`${API_URL}/jobs/categories`);
// //       console.log("Fetched categories:", response.data.data);
// //       return response.data.data || [];
// //     },
// //   });
// // };

// export const useCategories = () => {
//   return useQuery({
//     queryKey: ['categories'],
//     queryFn: async () => {
//       const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
//       const response = await axios.get(`${API_URL}/jobs/categories`);
      
//       // LOG THIS: If you see {success: true, data: Array}, 
//       // then you MUST return response.data.data
//       console.log("Raw API Response:", response.data); 
      
//       const result = response.data.data;
      
//       // FINAL SAFETY CHECK: If result is somehow not an array, return empty array
//       return Array.isArray(result) ? result : [];
//     },
//   });
// };

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