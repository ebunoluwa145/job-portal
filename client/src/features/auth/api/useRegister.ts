import { useMutation } from '@tanstack/react-query';
import { client } from '../../../lib/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: any) => 
      client('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (response) => {
      // Automatically log the user in after registration
      if (response.user && response.token) {
        setAuth(response.user, response.token);
        navigate('/'); // Redirect to job feed
      }
    },
    onError: (error: any) => {
      console.error('Registration Error:', error.message);
    }
  });
};