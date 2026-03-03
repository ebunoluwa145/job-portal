import { useMutation } from '@tanstack/react-query';
import { client } from '../../../lib/api';
import { useAuthStore } from '../../../store/useAuthStore';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: any) => 
      client('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      if (data.user && data.token) {
        setAuth(data.user, data.token);
      }
    },
  });
};