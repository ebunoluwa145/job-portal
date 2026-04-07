
import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminLayout = () => {
    const { user } = useAuthStore();

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                <div className="mb-10">
                    <h2 className="text-xl font-black text-aventon-dark tracking-tighter uppercase">Aventon Pro</h2>
                </div>

             {/* <nav className="flex-1 space-y-2">
                    <Link to="/manage-jobs" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg">
                        Manage Jobs
                    </Link>
                    
                    {/* Admin Only Links 
                    {user?.role === 'admin' && (
                        <>
                            <Link to="/admin/users" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg">
                                All Users
                            </Link>
                            <Link to="/admin/stats" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg">
                                Platform Stats
                            </Link>
                        </>
                    )}
                </nav> */}

                <nav className="flex-1 space-y-2">
    {/* Use /admin/manage-jobs to match the nested route */}
    <Link to="/admin/manage-jobs" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
        Manage Jobs
    </Link>
    
    {/* Add the Create Job link here so it's easy to find */}
    <Link to="/admin/post-job" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
        Post a Job
    </Link>
    
    {user?.role === 'admin' && (
        <>
            <Link to="/admin/users" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                All Users
            </Link>
        </>
    )}
</nav>

                <div className="border-t pt-4">
                    <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">Back to Main Site</Link>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto">
                <Outlet /> {/* This is where ManageJobsPage will render */}
            </main>
        </div>
    );
};