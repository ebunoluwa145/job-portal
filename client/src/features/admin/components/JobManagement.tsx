import { useManageJobs } from '../api/useManageJobs';
import { useAuthStore } from '../../../store/useAuthStore';
import { useSearchParams } from 'react-router-dom';

export const JobManagement = () => {
    const { user } = useAuthStore();
    const { jobs, isLoading, deleteJob, isDeleting, updateJobStatus } = useManageJobs(user?.role || 'employee'); 
    
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || "";

    const filteredJobs = jobs?.filter((j: any) => 
        j.title.toLowerCase().includes(search.toLowerCase()) || 
        j.company.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="p-10 text-center font-black uppercase text-slate-400 animate-pulse">Scanning Database...</div>;

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-[10px] font-black uppercase text-slate-400">
                        <th className="p-4">Role Details</th>
                        <th className="p-4">Status & Priority</th>
                        <th className="p-4">Payment</th>
                        {user?.role === 'admin' && <th className="p-4">Employer</th>}
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredJobs?.map((job: any) => (
                        <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-slate-900 leading-tight">{job.title}</div>
                                <div className="text-[10px] text-slate-500 font-medium uppercase">{job.company}</div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={job.status} />
                                    {job.isFeatured && <span className="text-amber-500 text-[10px]">★</span>}
                                </div>
                            </td>
                            <td className="p-4">
                                <span className={`text-[10px] font-black uppercase ${job.paymentStatus ? 'text-green-600' : 'text-slate-300'}`}>
                                    {job.paymentStatus ? 'Paid' : 'Unpaid'}
                                </span>
                            </td>
                            {user?.role === 'admin' && <td className="p-4 text-xs">{job.author?.name || 'Admin'}</td>}
                            <td className="p-4 text-right space-x-3">
                                {user?.role === 'admin' && job.status === 'pending' && (
                                    <button 
                                        onClick={() => updateJobStatus({ id: job.id, updates: { status: 'active' } })}
                                        className="text-green-600 text-xs font-black hover:underline"
                                    >
                                        APPROVE
                                    </button>
                                )}
                                <button className="text-indigo-600 text-xs font-black hover:underline">EDIT</button>
                                <button 
                                    onClick={() => deleteJob(job.id)}
                                    disabled={isDeleting}
                                    className="text-red-500 text-xs font-black hover:underline disabled:opacity-30"
                                >
                                    {isDeleting ? '...' : 'DELETE'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Helper Component (Put this at the bottom or in a separate file)
const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        active: 'bg-green-100 text-green-700',
        pending: 'bg-amber-100 text-amber-700',
        rejected: 'bg-red-100 text-red-700',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${styles[status] || 'bg-slate-100'}`}>
            {status}
        </span>
    );
};