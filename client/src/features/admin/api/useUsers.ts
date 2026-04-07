// src/api/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUsers = () => {
    const queryClient = useQueryClient();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

    // Fetch all users
    const query = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/api/users`, {
                withCredentials: true
            });
            // Matching your .data.data pattern
            return response.data.data || [];
        }
    });

    // Example Mutation: Ban/Delete User
    const deleteUserMutation = useMutation({
        mutationFn: async (userId: number) => {
            return await axios.delete(`${API_URL}/api/users/${userId}`, {
                withCredentials: true
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