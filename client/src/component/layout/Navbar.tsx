import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-aventon-dark text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="text-2xl font-black tracking-tighter hover:text-aventon-accent transition-colors">
          AVENTON<span className="text-aventon-accent">JOBS</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
          <Link to="/job" className="hover:text-aventon-accent transition-colors">Find Jobs</Link>

          {user ? (
            <>
              {/* Employer / Admin specific links */}
              {(user.role === 'employee' || user.role === 'admin') && (
                <Link 
                  to="/post-job" 
                  className="bg-aventon-accent px-4 py-2 rounded-lg hover:bg-white hover:text-aventon-dark transition-all"
                >
                  + Post Vacancy
                </Link>
              )}

              {user.role === 'admin' && (
                <Link to="/admin" className="text-yellow-400 hover:text-white transition-colors underline decoration-2 underline-offset-4">
                  Admin Panel
                </Link>
              )}

              <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                <span className="text-white/60 lowercase italic">@{user.name.split(' ')[0]}</span>
                <button 
                  onClick={logout}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="hover:text-aventon-accent transition-colors">Sign In</Link>
              <Link 
                to="/register" 
                className="bg-white text-aventon-dark px-5 py-2.5 rounded-xl font-black hover:bg-aventon-light transition-all shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};