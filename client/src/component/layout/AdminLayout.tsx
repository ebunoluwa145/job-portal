
// import { Link, Outlet } from 'react-router-dom';
// import { useAuthStore } from '../../store/useAuthStore';

// export const AdminLayout = () => {
//     const { user } = useAuthStore();

//     return (
//         <div className="flex min-h-screen bg-slate-50">
//             {/* Sidebar */}
//             <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
//                 <div className="mb-10">
//                     <h2 className="text-xl font-black text-aventon-dark tracking-tighter uppercase">Aventon Pro</h2>
//                 </div>

//              {/* <nav className="flex-1 space-y-2">
//                     <Link to="/manage-jobs" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg">
//                         Manage Jobs
//                     </Link>
                    
//                     {/* Admin Only Links 
//                     {user?.role === 'admin' && (
//                         <>
//                             <Link to="/admin/users" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg">
//                                 All Users
//                             </Link>
//                             <Link to="/admin/stats" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg">
//                                 Platform Stats
//                             </Link>
//                         </>
//                     )}
//                 </nav> */}

//                 <nav className="flex-1 space-y-2">
//     {/* Use /admin/manage-jobs to match the nested route */}
//     <Link to="/admin/manage-jobs" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
//         Manage Jobs
//     </Link>
    
//     {/* Add the Create Job link here so it's easy to find */}
//     <Link to="/admin/post-job" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
//         Post a Job
//     </Link>
    
//     {user?.role === 'admin' && (
//         <>
//             <Link to="/admin/users" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
//                 All Users
//             </Link>
//         </>
//     )}
// </nav>

//                 <div className="border-t pt-4">
//                     <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">Back to Main Site</Link>
//                 </div>
//             </aside>

//             {/* Content Area */}
//             <main className="flex-1 overflow-y-auto">
//                 <Outlet /> {/* This is where ManageJobsPage will render */}
//             </main>
//         </div>
//     );
// };


import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminLayout = () => {
    const { user } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 flex-col md:flex-row">
            {/* MOBILE HEADER (Only visible on small screens) */}
            <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50">
                <h2 className="text-xl font-black text-aventon-dark tracking-tighter uppercase">Aventon Pro</h2>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-slate-100 rounded-lg">
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* SIDEBAR */}
            <aside className={`
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 transition-transform duration-300
                fixed md:static inset-y-0 left-0 z-40
                w-64 bg-white border-r border-slate-200 p-6 flex flex-col
            `}>
                <div className="hidden md:block mb-10">
                    <h2 className="text-xl font-black text-aventon-dark tracking-tighter uppercase">
                        Aventon<span className="text-amber-500">.</span>Pro
                    </h2>
                </div>

                <nav className="flex-1 space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Navigation</p>
                    
                    <Link to="/admin/manage-jobs" 
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-amber-600 rounded-xl transition-all">
                        Manage Jobs
                    </Link>
                    
                    <Link to="/admin/post-job" 
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-amber-600 rounded-xl transition-all">
                        Post a Job
                    </Link>
                    
                    {user?.role === 'admin' && (
                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Admin Only</p>
                            <Link to="/admin/users" 
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
                                All Users
                            </Link>
                        </div>
                    )}
                </nav>

                <div className="border-t border-slate-100 pt-6">
                    <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-aventon-dark transition-colors">
                        ← Exit Dashboard
                    </Link>
                </div>
            </aside>

            {/* OVERLAY for mobile */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Content Area */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <div className="p-4 md:p-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};