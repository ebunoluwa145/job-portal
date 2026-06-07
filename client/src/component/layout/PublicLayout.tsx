import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-aventon-light font-sans text-slate-900">
      <Navbar />
      <main className="w-full flex flex-col">
        <Outlet /> {/* This is where Home, Login, and Jobs will appear */}
      </main>
    </div>
  );
};