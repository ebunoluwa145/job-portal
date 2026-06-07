// // // src/api/useUsers.ts
// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import axios from 'axios';

// // export const useUsers = () => {
// //     const queryClient = useQueryClient();
// //     const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

// //     // Fetch all users
// //     const query = useQuery({
// //         queryKey: ['users'],
// //         queryFn: async () => {
// //             const response = await axios.get(`${API_URL}/users`, {
// //                 withCredentials: true
// //             });
// //             // Matching your .data.data pattern
// //             return response.data.data || [];
// //         }
// //     });

// //     // Example Mutation: Ban/Delete User
// //     const deleteUserMutation = useMutation({
// //         mutationFn: async (userId: number) => {
// //             return await axios.delete(`${API_URL}/api/users/${userId}`, {
// //                 withCredentials: true
// //             });
// //         },
// //         onSuccess: () => {
// //             queryClient.invalidateQueries({ queryKey: ['users'] });
// //         }
// //     });

// //     return {
// //         users: query.data,
// //         isLoading: query.isLoading,
// //         deleteUser: deleteUserMutation.mutate,
// //         isDeleting: deleteUserMutation.isPending
// //     };
// // };



// // src/api/useUsers.ts
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';

// export const useUsers = () => {
//     const queryClient = useQueryClient();
//     const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

//     // Fetch all users
//     const query = useQuery({
//         queryKey: ['users'],
//         queryFn: async () => {
//             // 1. Get the token from LocalStorage
//             const token = localStorage.getItem('token');
            
//             const response = await axios.get(`${API_URL}/users`, {
//                 headers: {
//                     // 2. Attach the token here
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             return response.data.data || [];
//         }
//         ...options,
//     });

//     // Example Mutation: Delete User
//     const deleteUserMutation = useMutation({
//         mutationFn: async (userId: number) => {
//             const token = localStorage.getItem('token');
//             return await axios.delete(`${API_URL}/users/${userId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['users'] });
//         }
//     });

//     return {
//         users: query.data,
//         isLoading: query.isLoading,
//         deleteUser: deleteUserMutation.mutate,
//         isDeleting: deleteUserMutation.isPending
//     };
// };


// src/api/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// 🟢 STEP 1: Add 'options' as an argument so you can pass { enabled: ... }
export const useUsers = (options: any = {}) => {
    const queryClient = useQueryClient();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

    // Fetch all users
    const query = useQuery<any[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            
            // Note: Added /api prefix to match your backend routes
            const response = await axios.get(`${API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data || [];
        },
        // 🟢 STEP 2: Spread the options here so 'enabled' actually works
        ...options, 
    });

    // Example Mutation: Delete User
    const deleteUserMutation = useMutation({
        mutationFn: async (userId: number) => {
            const token = localStorage.getItem('token');
            return await axios.delete(`${API_URL}/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });

    return {
        users: query.data,
        isLoading: query.isLoading,
        deleteUser: deleteUserMutation.mutate,
        isDeleting: deleteUserMutation.isPending
    };
};