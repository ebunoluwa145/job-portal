import { useMutation } from '@tanstack/react-query';
import { client } from '../../../lib/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  // return useMutation({
  //   mutationFn: (data: any) => 
  //     client('/auth/register', {
  //       method: 'POST',
  //       body: JSON.stringify(data),
  //     }),
  //   onSuccess: (response) => {
  //     // Automatically log the user in after registration
  //     if (response.user && response.token) {
  //       setAuth(response.user, response.token); // Store user and token in auth store
  //       navigate('/'); // Redirect to job feed
  //     }
  //   },
  //   onError: (error: any) => {
  //     console.error('Registration Error:', error.message);
  //   }
  // });

  return useMutation({
    mutationFn: (data: any) => 
      client('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (response) => {
      // 1. Debug: See exactly what the server sent back
      console.log('Registration Response:', response);

      // 2. Ensure your backend returns these specific keys
      const user = response.user || response.data?.user;
      const token = response.token || response.data?.token;

      if (user && token) {
        // 3. Update the store (this saves to localStorage in our new setup)
        setAuth(user, token);
        
        // 4. Use replace: true to prevent user from "going back" into the register form
        navigate('/', { replace: true }); 
      } else {
        console.warn('Registration succeeded but user or token was missing in response');
      }
    },
    onError: (error: any) => {
      // Using a generic message if error.message is undefined
      console.error('Registration Error:', error.message || 'Registration failed');
    }
  });

};