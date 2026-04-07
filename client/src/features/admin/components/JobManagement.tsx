import { useManageJobs } from '../api/useManageJobs';
import { useAuthStore } from '../../../store/useAuthStore';
// import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const JobManagement = () => {
    const { user } = useAuthStore();
    const { jobs, isLoading, deleteJob, isDeleting } = useManageJobs();

    if (isLoading) return <div className="p-10 text-center animate-pulse">Scanning database...</div>;

    // const [search, setSearch] = useState("");

    // const filteredJobs = jobs?.filter((j: { title: string; company: string }) => 
    //     j.title.toLowerCase().includes(search.toLowerCase()) || 
    //     j.company.toLowerCase().includes(search.toLowerCase())
    // );
    // 1. Get the URL parameters (removes the need for local useState)
    const [searchParams] = useSearchParams();

    // 2. Assign 'search' the value from the URL (or an empty string if none exists)
    const search = searchParams.get('search') || "";

    // 3. Your filter logic remains exactly the same and uses the 'search' variable above
    const filteredJobs = jobs?.filter((j: { title: string; company: string }) => 
        j.title.toLowerCase().includes(search.toLowerCase()) || 
        j.company.toLowerCase().includes(search.toLowerCase())
    );

    return (
        
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-[10px] font-black uppercase text-slate-400">
                        <th className="p-4">Role Details</th>
                        <th className="p-4">Category</th>
                        {user?.role === 'admin' && <th className="p-4">Employer</th>}
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredJobs?.map((job:any) => (
                        <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-slate-900">{job.title}</div>
                                <div className="text-xs text-slate-500">{job.company} • {job.location}</div>
                            </td>
                            <td className="p-4">
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold uppercase">
                                    {job.category}
                                </span>
                            </td>
                            {user?.role === 'admin' && (
                                <td className="p-4 text-sm text-slate-600">
                                    {job.author?.name || 'Unknown'}
                                </td>
                            )}
                            <td className="p-4 text-right space-x-3">
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