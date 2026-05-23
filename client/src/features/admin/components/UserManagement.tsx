// // Inside JobManagement.tsx
// export const JobManagement = () => {
//     const { user } = useAuthStore();
//     const { jobs, isLoading, deleteJob, isDeleting, updateJobStatus } = useManageJobs(); // Add your update hook
//     const [searchParams] = useSearchParams();
//     const search = searchParams.get('search') || "";

//     const filteredJobs = jobs?.filter((j: any) => 
//         j.title.toLowerCase().includes(search.toLowerCase()) || 
//         j.company.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//             <table className="w-full text-left">
//                 <thead className="bg-slate-50 border-b border-slate-200">
//                     <tr className="text-[10px] font-black uppercase text-slate-400">
//                         <th className="p-4">Role Details</th>
//                         <th className="p-4">Status & Priority</th> {/* New Column */}
//                         <th className="p-4">Payment</th>           {/* New Column */}
//                         {user?.role === 'admin' && <th className="p-4">Employer</th>}
//                         <th className="p-4 text-right">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                     {filteredJobs?.map((job: any) => (
//                         <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
//                             <td className="p-4">
//                                 <div className="font-bold text-slate-900 leading-tight">{job.title}</div>
//                                 <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">
//                                     {job.company} • {job.jobType}
//                                 </div>
//                             </td>
                            
//                             {/* NEW: STATUS & FEATURED COLUMN */}
//                             <td className="p-4">
//                                 <div className="flex items-center gap-2">
//                                     <StatusBadge status={job.status} />
//                                     {job.isFeatured && (
//                                         <span className="text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
//                                             Featured
//                                         </span>
//                                     )}
//                                 </div>
//                             </td>

//                             {/* NEW: PAYMENT COLUMN */}
//                             <td className="p-4">
//                                 <div className={`text-[10px] font-black uppercase ${job.paymentStatus ? 'text-green-600' : 'text-slate-300'}`}>
//                                     {job.paymentStatus ? '● Paid' : '○ Unpaid'}
//                                 </div>
//                             </td>

//                             {user?.role === 'admin' && (
//                                 <td className="p-4 text-xs font-medium text-slate-600">
//                                     {job.author?.name || 'External'}
//                                 </td>
//                             )}

//                             <td className="p-4 text-right space-x-3">
//                                 {/* The "Master Control" Button could be a dropdown or a direct Approve button */}
//                                 {job.status === 'pending' && (
//                                     <button 
//                                         onClick={() => updateJobStatus(job.id, { status: 'active' })}
//                                         className="text-green-600 text-xs font-black hover:underline"
//                                     >
//                                         APPROVE
//                                     </button>
//                                 )}
//                                 <button className="text-indigo-600 text-xs font-black hover:underline">EDIT</button>
//                                 <button 
//                                     onClick={() => deleteJob(job.id)}
//                                     disabled={isDeleting}
//                                     className="text-red-500 text-xs font-black hover:underline disabled:opacity-30"
//                                 >
//                                     {isDeleting ? '...' : 'DELETE'}
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };