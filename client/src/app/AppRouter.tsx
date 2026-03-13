import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { useAuthStore } from '../store/useAuthStore';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { JobFeedPage } from '../pages/JobFeedPage';
import { JobDetailsPage } from '../pages/JobDetailPage';
import { CreateJobPage } from '../pages/CreateJobPage';
import { HomePage } from '../pages/HomePage';

export const AppRouter = () => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage/>} />
        <Route path="/job" element={<JobFeedPage />} />
      <Route path="/job/:id" element={<JobDetailsPage />} />
      
      {/* Auth Pages (Redirect to home if already logged in) */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      

      <Route 
        path="/post-job" 
        element={
          isAuthenticated && user?.role === 'employee' ? (
            <CreateJobPage />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Admin/Employer Protected Pages */}
      <Route 
        path="/admin" 
        element={user?.role === 'admin' ? <div className="p-10">Admin Dashboard</div> : <Navigate to="/" />} 
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};