// import { Link } from 'react-router-dom';
// import { useAuthStore } from '../../store/useAuthStore';

// export const Navbar = () => {
//   const { user, logout } = useAuthStore();

//   return (
//     <nav className="bg-aventon-light text-aventon-dark shadow-lg sticky top-0 z-50">
//       <div className="container mx-auto px-6 h-20 flex items-center justify-between">
//         {/* Logo Section */}
//         <Link to="/" className="text-2xl font-black tracking-tighter text-aventon-dark transition-colors">
//           AVENTON<span className="text-aventon-dark">JOBS</span>
//         </Link>

//         {/* Navigation Links */}
//         <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
//           <Link to="/job" className="text-aventon-darkhover:text-aventon-light transition-colors">Find Jobs</Link>

//           {user ? (
//             <>
//               {/* Employer / Admin specific links */}
//               {(user.role === 'employee' || user.role === 'admin') && (
//                 <Link 
//                   to="/admin/post-job" 
//                   className="bg-aventon-dark px-4 py-2 rounded-lg hover:bg-amber-400 text-aventon-light hover:text-aventon-dark transition-all"
//                 >
//                   + Post Vacancy
//                 </Link>
//               )}

//               {user.role === 'admin' && (
//                 <Link to="/admin" className="text-yellow-400 hover:text-white transition-colors underline decoration-2 underline-offset-4">
//                   Admin Panel
//                 </Link>
//               )}

//               <div className="flex items-center gap-4 border-l border-white/20 pl-6">
//                 <span className="text-white/60 lowercase italic">@{user.name.split(' ')[0]}</span>
//                 <button 
//                   onClick={logout}
//                   className="hover:text-red-400 transition-colors cursor-pointer"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center gap-6">
//               <Link to="/login" className="hover:text-aventon-accent transition-colors">Sign In</Link>
//               <Link 
//                 to="/register" 
//                 className="bg-aventon-dark text-aventon-light px-5 py-2.5 rounded-xl font-black hover:bg-aventon-accent transition-all shadow-md"
//               >
//                 Get Started
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-aventon-dark uppercase">
          AVENTON<span className="text-amber-500">JOBS</span>
        </Link>

        {/* --- DESKTOP VIEW (Visible on lg and above) --- */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/job" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-aventon-dark transition-colors">
            Find Jobs
          </Link>

          {user ? (
            <div className="flex items-center gap-6">
              {/* Employer / Admin links */}
              {(user.role === 'employee' || user.role === 'admin') && (
                <Link 
                  to="/admin/post-job" 
                  className="bg-aventon-dark px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-400 hover:text-aventon-dark transition-all shadow-md"
                >
                  + Post Vacancy
                </Link>
              )}

              {user.role === 'admin' && (
                <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-aventon-dark">
                  Admin
                </Link>
              )}

              <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                <span className="text-slate-400 text-[10px] font-bold uppercase italic tracking-tighter">
                   @{user.name.split(' ')[0]}
                </span>
                <button 
                  onClick={logout}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
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

        {/* --- MOBILE TOGGLE BUTTON --- */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-aventon-dark"
        >
          {isOpen ? (
             <span className="text-xl font-bold">✕</span>
          ) : (
            <div className="space-y-1.5">
              <div className="w-6 h-0.5 bg-aventon-dark"></div>
              <div className="w-6 h-0.5 bg-aventon-dark"></div>
              <div className="w-4 h-0.5 bg-aventon-dark"></div>
            </div>
          )}
        </button>
      </div>

      {/* --- MOBILE MENU (Dropdown) --- */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link to="/job" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase tracking-widest text-aventon-dark">Find Jobs</Link>
          
          {user ? (
            <>
              {(user.role === 'employee' || user.role === 'admin') && (
                <Link to="/admin/post-job" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase text-amber-500">+ Post Vacancy</Link>
              )}
              <hr className="border-slate-100" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">@{user.name}</span>
                <button onClick={logout} className="text-xs font-black uppercase text-red-500 underline">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase text-aventon-dark">Sign In</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="bg-aventon-dark text-white text-center py-4 rounded-xl text-sm font-black uppercase tracking-widest">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};