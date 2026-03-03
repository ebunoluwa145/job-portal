import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = 'http://localhost:8787/api';

export const client = async (endpoint: string, options: RequestInit = {}) => {
  const { token } = useAuthStore.getState();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // TanStack Query needs us to throw the error manually for Fetch
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
};