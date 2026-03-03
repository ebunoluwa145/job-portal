import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { useAuthStore } from '../store/useAuthStore';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';

export const AppRouter = () => {
  const { user } = useAuthStore();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<div className="p-10 text-aventon-dark font-black">FEED COMING SOON</div>} />
      
      {/* Auth Pages (Redirect to home if already logged in) */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Admin/Employer Protected Pages */}
      <Route 
        path="/admin" 
        element={user?.role === 'admin' ? <div className="p-10">Admin Dashboard</div> : <Navigate to="/" />} 
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};