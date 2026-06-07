import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'; // 🟢 IMPORT THIS
import { useAuthStore } from './store/useAuthStore';
import { AppRouter } from './app/AppRouter';

export const App = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialLoading = useAuthStore((state) => state.isInitialLoading);

  useEffect(() => {
    initialize(); // 🟢 Check for user session on mount
  }, [initialize]);

  // Wait until the token validation network request finishes
  if (isInitialLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-xs text-gray-500 font-medium">Securing session...</p>
        </div>
      </div>
    );
  }

  // 🟢 Wrap AppRouter in BrowserRouter so `<Routes>` works perfectly!
  return (
    <BrowserRouter>
      <div className="antialiased font-sans">
        <AppRouter />
      </div>
    </BrowserRouter>
  );
};