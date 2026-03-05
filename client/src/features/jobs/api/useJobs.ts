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
export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8787/api/jobs');
      
      // DEBUG: Add this to see exactly what is killing the app
      console.log("Axios Response Data:", response.data.data);
      
      return response.data.data || [];; // This MUST be the array from your backend
    },
  });
};