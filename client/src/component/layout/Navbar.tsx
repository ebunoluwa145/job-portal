
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuthStore } from '../../store/useAuthStore';

// export const Navbar = () => {
//   const { user, logout } = useAuthStore();
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
//         {/* LOGO */}
//         <Link to="/" className="text-2xl font-black tracking-tighter text-aventon-dark uppercase">
//           AVENTON<span className="text-amber-500">JOBS</span>
//         </Link>

//         {/* --- DESKTOP VIEW (Visible on lg and above) --- */}
//         <div className="hidden lg:flex items-center gap-8">
//           <Link to="/job" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-aventon-dark transition-colors">
//             Find Jobs
//           </Link>

//           {user ? (
//             <div className="flex items-center gap-6">
//               {/* Employer / Admin links */}
//               {(user.role === 'employee' || user.role === 'admin') && (
//                 <Link 
//                   to="/admin/post-job" 
//                   className="bg-aventon-dark px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-400 hover:text-aventon-dark transition-all shadow-md"
//                 >
//                   + Post Vacancy
//                 </Link>
//               )}

//               {user.role === 'admin' && (
//                 <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-aventon-dark">
//                   Admin
//                 </Link>
//               )}

//               <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
//                 <span className="text-slate-400 text-[10px] font-bold uppercase italic tracking-tighter">
//                    @{user.name.split(' ')[0]}
//                 </span>
//                 <button 
//                   onClick={logout}
//                   className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 transition-colors"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center gap-6">
//               <Link to="/login" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-aventon-dark">
//                 Sign In
//               </Link>
//               <Link 
//                 to="/register" 
//                 className="bg-aventon-dark text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 hover:text-aventon-dark transition-all shadow-lg"
//               >
//                 Get Started
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* --- MOBILE TOGGLE BUTTON --- */}
//         <button 
//           onClick={() => setIsOpen(!isOpen)}
//           className="lg:hidden p-2 text-aventon-dark"
//         >
//           {isOpen ? (
//              <span className="text-xl font-bold">✕</span>
//           ) : (
//             <div className="space-y-1.5">
//               <div className="w-6 h-0.5 bg-aventon-dark"></div>
//               <div className="w-6 h-0.5 bg-aventon-dark"></div>
//               <div className="w-4 h-0.5 bg-aventon-dark"></div>
//             </div>
//           )}
//         </button>
//       </div>

//       {/* --- MOBILE MENU (Dropdown) --- */}
//       {isOpen && (
//         <div className="lg:hidden bg-white border-b border-slate-100 px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
//           <Link to="/job" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase tracking-widest text-aventon-dark">Find Jobs</Link>
          
//           {user ? (
//             <>
//               {(user.role === 'employee' || user.role === 'admin') && (
//                 <Link to="/admin/post-job" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase text-amber-500">+ Post Vacancy</Link>
//               )}
//               <hr className="border-slate-100" />
//               <div className="flex justify-between items-center">
//                 <span className="text-xs font-bold text-slate-400">@{user.name}</span>
//                 <button onClick={logout} className="text-xs font-black uppercase text-red-500 underline">Logout</button>
//               </div>
//             </>
//           ) : (
//             <>
//               <Link to="/login" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase text-aventon-dark">Sign In</Link>
//               <Link to="/register" onClick={() => setIsOpen(false)} className="bg-aventon-dark text-white text-center py-4 rounded-xl text-sm font-black uppercase tracking-widest">Get Started</Link>
//             </>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };


import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-aventon-dark uppercase">
          AVENTON<span className="text-amber-500">JOBS</span>
        </Link>

        {/* --- DESKTOP VIEW --- */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/job" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-aventon-dark transition-colors">
            Find Jobs
          </Link>

          {user ? (
            <div className="flex items-center gap-6">
              {/* Conditional Post Vacancy Button */}
              {(user.role === 'employee' || user.role === 'admin') && (
                <Link 
                  to="/admin/post-job" 
                  className="bg-aventon-dark px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-400 hover:text-aventon-dark transition-all shadow-md"
                >
                  + Post Vacancy
                </Link>
              )}

              {/* 🟢 PROFILE DROPDOWN */}
              <div className="relative border-l border-slate-200 pl-6" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 group"
                >
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-aventon-dark leading-none">
                       {user?.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">
                      {user.role === 'employee' ? 'Employer' : user.role}
                    </p>
                  </div>
                  <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center border-2 border-transparent group-hover:border-amber-400 transition-all overflow-hidden">
                     <span className="font-black text-aventon-dark text-xs">{user?.name?.charAt(0) || 'U'}</span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-slate-50 mb-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Account</p>
                        <p className="text-[11px] font-bold text-aventon-dark truncate">{user.email}</p>
                    </div>
                    
                    
                      <Link 
                        to="/admin/admin-edit" 
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2.5 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 hover:text-amber-600"
                      >
                        Job Dashboard
                      </Link>
                    
                    
                    <Link 
                      to={`/profile`} 
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2.5 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 hover:text-amber-600"
                    >
                      My Profile Settings
                    </Link>

                    <hr className="my-1 border-slate-50" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-aventon-dark">
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-aventon-dark text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 hover:text-aventon-dark transition-all shadow-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2">
          {isMobileOpen ? <span className="text-xl font-bold">✕</span> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-aventon-dark"></div><div className="w-6 h-0.5 bg-aventon-dark"></div><div className="w-4 h-0.5 bg-aventon-dark"></div></div>}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-6 py-8 flex flex-col gap-6">
          <Link to="/job" onClick={() => setIsMobileOpen(false)} className="text-sm font-black uppercase text-aventon-dark">Find Jobs</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsMobileOpen(false)} className="text-sm font-black uppercase text-slate-600">My Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMobileOpen(false)} className="text-sm font-black uppercase text-slate-600">Admin Dashboard</Link>
              )}
              {(user.role === 'employee' || user.role === 'admin') && (
                <Link to="/admin/post-job" onClick={() => setIsMobileOpen(false)} className="text-sm font-black uppercase text-amber-500">+ Post Vacancy</Link>
              )}
              <button onClick={handleLogout} className="text-left text-sm font-black uppercase text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileOpen(false)} className="text-sm font-black uppercase text-aventon-dark">Sign In</Link>
              <Link to="/register" onClick={() => setIsMobileOpen(false)} className="bg-aventon-dark text-white text-center py-4 rounded-xl text-sm font-black uppercase">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};