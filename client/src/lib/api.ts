const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

export const client = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token'); // 🟢 Always get fresh token from storage
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // 🟢 Attach header
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Something went wrong');
  }

  return data;
};