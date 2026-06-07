// import React from 'react';
// import ReactDOM from 'react-dom/client'; // Notice the '/client'
// import { BrowserRouter } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import {App}from './App';
// import './index.css'; // Ensure your Tailwind/CSS is imported

// const queryClient = new QueryClient();

// // The '!' tells TypeScript that 'root' definitely exists in your index.html
// const rootElement = document.getElementById('root')!;
// const root = ReactDOM.createRoot(rootElement);

// root.render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </QueryClientProvider>
//   </React.StrictMode>
// );

import {QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import {App }from './App';
import {queryClient} from './lib/queryClient';
import './index.css'; // Ensure your Tailwind/CSS is imported

// 🟢 Initialize OUTSIDE the component


ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    {/* Optional: Helpful for debugging your auth/job fetches */}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);