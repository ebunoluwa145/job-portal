// import { useAuthStore } from '../store/useAuthStore';

// const BASE_URL = 'http://localhost:8787/api';

// export const client = async (endpoint: string, options: RequestInit = {}) => {
//   const { token } = useAuthStore.getState();

//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     ...options.headers,
//   };

//   const config: RequestInit = {
//     ...options,
//     headers,
//   };

//   const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
//   // TanStack Query needs us to throw the error manually for Fetch
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.error || 'Something went wrong');
//   }

//   return response.json();
// };



// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

// export const client = async (endpoint: string, options: RequestInit = {}) => {
  
  
//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//     ...options.headers,
//   };

//   const config: RequestInit = {
//     ...options,
//     headers,
//     // 2. CRUCIAL: This must be INSIDE the config object.
//     // This tells the browser to include the 'token' cookie automatically.
//     credentials: 'include', 
//   };

//   const response = await fetch(`${BASE_URL}${endpoint}`, config);

//   if (!response.ok) {
//     // 3. Handle the "Unexpected end of JSON" error by checking text first
//     const text = await response.text();
//     const errorData = text ? JSON.parse(text) : {};
//     throw new Error(errorData.error || errorData.message || 'Something went wrong');
//   }

//   // 4. Safely parse the JSON for successful responses
//   const text = await response.text();
//   return text ? JSON.parse(text) : {};
// };


const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

export const client = async (endpoint: string, options: RequestInit = {}) => {
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // Required for Cross-Domain Cookies (Staging/Production)
    credentials: 'include', 
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // 1. Read the body ONCE here
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  // 2. Now check if the request was successful
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Something went wrong');
    console.error('API Error:', {
      endpoint,
      status: response.status,
      response: data,
    });
  }

  // 3. Return the data we already parsed
  return data;
};