import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Layouts
import { AdminLayout } from '../component/layout/AdminLayout';
import { PublicLayout } from '../component/layout/PublicLayout'; // Create this!

// Pages
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { JobFeedPage } from '../pages/JobFeedPage';
import { JobDetailsPage } from '../pages/JobDetailPage';
import { CreateJobPage } from '../pages/CreateJobPage';
import { HomePage } from '../pages/HomePage';
import { AdminPage } from '../pages/AdminPage';

export const AppRouter = () => {
  const { user } = useAuthStore();

  return (
    <Routes>
      {/* 🟢 PUBLIC GROUP: Everything with the Top NAVBAR */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/job" element={<JobFeedPage />} />
        <Route path="/job/:id" element={<JobDetailsPage />} />
        
        {/* Auth Pages (Redirect if logged in) */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* 🔴 ADMIN/EMPLOYER GROUP: Everything with the SIDEBAR */}
      <Route 
        path="/admin" 
        element={
          (user?.role === 'admin' || user?.role === 'employee') 
            ? <AdminLayout /> 
            : <Navigate to="/login" replace />
        }
      >
        {/* Default /admin page */}
        <Route index element={<AdminPage />} /> 
        
        {/* We move Create Job here so it has the Sidebar */}
        <Route path="post-job" element={<CreateJobPage />} />
        
        {/* Placeholder for future features */}
        {/* <Route path="users" element={<UserManagement />} /> */}
      </Route>

      {/* 🔵 FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};