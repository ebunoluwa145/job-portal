import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// export const useJobs = () => {
//   return useQuery({
//     queryKey: ['jobs'],
//     queryFn: async () => {
//       // Point this to your Hono backend
//       const { data } = await axios.get('http://localhost:8787/api/jobs');
//       return data.success ? data.jobs : [];
//     },
//     staleTime: 1000 * 60 * 5, // Cache for 5 minutes to save bandwidth
//   });
// };

// useJobs.ts
export const useJobs = ( category?:string, search?:string) => {
  return useQuery({
    queryKey: ['jobs', category, search], // Include filters in the query key for caching
    // queryFn: async () => {
    //     const url = category ? `http://localhost:8787/api/jobs?category=${category}` : 'http://localhost:8787/api/jobs';
    //     

    queryFn: async () => {
      // 3. Use URLSearchParams to build a clean URL
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const queryString = params.toString();
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'; // Fallback to localhost if env variable is missing
      const url = `${API_URL}/jobs${queryString ? `?${queryString}` : ''}`;
      
      console.log("Fetching from:", url);
      const response = await axios.get(url);
      
      // DEBUG: Add this to see exactly what is killing the app
      console.log("Axios Response Data:", response.data.data);
      
      return response.data.data || [];; // This MUST be the array from your backend
    },
  });
};