// import { useState, useEffect } from 'react';
// import { useManageJobs } from '../api/useManageJobs';
// import { useAuthStore } from '../../../store/useAuthStore';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { X, Calendar, CreditCard, RefreshCw } from 'lucide-react'; 

// export const JobManagement = () => {
//     const { user } = useAuthStore();
//     const { jobs, isLoading, deleteJob, isDeleting, updateJobStatus } = useManageJobs(user?.role || 'employee'); 
//     const [previewJob, setPreviewJob] = useState<any | null>(null);

//     const [searchParams] = useSearchParams();
//     const search = searchParams.get('search') || "";

//     const filteredJobs = jobs?.filter((j: any) => {
//         const title = j.title?.toLowerCase() || "";
//         const company = j.company?.toLowerCase() || "";
//         const term = search.toLowerCase();
//         return title.includes(term) || company.includes(term);
//     });

//     useEffect(() => {
//         if (previewJob) {
//             const updatedJob = jobs?.find((j: any) => (j.id || j._id) === (previewJob.id || previewJob._id));
//             if (updatedJob) setPreviewJob(updatedJob);
//         }
//     }, [jobs, previewJob]);

//     if (isLoading) return <div className="p-10 text-center font-black uppercase text-slate-400 animate-pulse">Scanning Database...</div>;

//     return (
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative">
//             <table className="w-full text-left">
//                 <thead className="bg-slate-50 border-b border-slate-200">
//                     <tr className="text-[10px] font-black uppercase text-slate-400">
//                         <th className="p-4">Role Details</th>
//                         <th className="p-4">System Status</th>
//                         <th className="p-4">Payments & Expiry</th>
//                         {user?.role === 'admin' && <th className="p-4">Employer</th>}
//                         <th className="p-4 text-right">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                     {filteredJobs?.map((job: any) => (
//                         <RowWrapper 
//                             key={job.id || job._id} 
//                             job={job} 
//                             user={user} 
//                             isDeleting={isDeleting} 
//                             deleteJob={deleteJob} 
//                             updateJobStatus={updateJobStatus} 
//                             setPreviewJob={setPreviewJob} 
//                         />
//                     ))}
//                 </tbody>
//             </table>

//             {/* MODAL OVERLAY */}
//             {previewJob && (
//                 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
//                         <div className="p-8 border-b border-slate-100 bg-slate-50/50">
//                             <div className="flex justify-between items-start">
//                                 <div>
//                                     <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase px-2 py-1 rounded mb-2 inline-block">
//                                         {previewJob.jobType || 'Full-time'}
//                                     </span>
//                                     <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
//                                         {previewJob.title}
//                                     </h2>
//                                     <p className="text-indigo-600 font-bold uppercase text-sm mt-1">{previewJob.company}</p>
//                                 </div>
//                                 <button onClick={() => setPreviewJob(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
//                                     <X size={20} className="text-slate-400" />
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
//                             <div className="md:col-span-2 space-y-6">
//                                 <div>
//                                     <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Job Description</h4>
//                                     <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
//                                         {previewJob.description}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="bg-slate-50 p-6 rounded-xl space-y-6 border border-slate-100">
//                                 <div>
//                                     <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Location</h4>
//                                     <p className="text-sm font-bold text-slate-900">{previewJob.location}</p>
//                                 </div>
//                                 <div>
//                                     <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Salary</h4>
//                                     <p className="text-sm font-bold text-slate-900">{previewJob.salaryRange || 'N/A'}</p>
//                                 </div>
//                                 <div>
//                                     <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Status Parameters</h4>
//                                     <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${
//                                         previewJob.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
//                                     }`}>
//                                         {previewJob.status === 'active' ? 'Active' : 'Pending'}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
//                             {previewJob.status !== 'active' && user?.role === 'admin' && (
//                                 <>
//                                     <button 
//                                         onClick={() => { 
//                                             updateJobStatus({ 
//                                                 id: previewJob.id || previewJob._id, 
//                                                 updates: { status: 'active' } 
//                                             }); 
//                                             setPreviewJob(null); 
//                                         }}
//                                         className="flex-[2] bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
//                                     >
//                                         Approve & Set Active
//                                     </button>
//                                 </>
//                             )}
//                             <button onClick={() => setPreviewJob(null)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
//                                 Dismiss
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// const RowWrapper = ({ job, user, isDeleting, deleteJob, updateJobStatus, setPreviewJob }: any) => {
//     const navigate = useNavigate();

//     // 1. Core Expiration Check
//     const isExpired = job.featuredUntil && new Date(job.featuredUntil) < new Date();
    
//     // 2. Strict Primitive Base Determinations
//     const hasPaidRecord = job.paymentStatus === 'paid' || job.paymentStatus === '1' || job.paymentStatus === 1 || job.paymentStatus === true;

//     // 3. Compute Clean Payment Status String to show users/admin
//     let paymentLabel = 'Unpaid';
//     if (hasPaidRecord) {
//         paymentLabel = isExpired ? 'Expired' : 'Paid';
//     }

//     // 4. Normalized cleanly matching status fallback conditions (active / pending)
//     const currentSystemStatus = job.status === 'active' ? 'active' : 'pending';

//     const handleToggleClick = () => {
//         // Safe database conversion value tracking
//         const nextDatabaseValue = hasPaidRecord ? 0 : 1;

//         updateJobStatus({ 
//             id: job.id || job._id,
//             updates: { 
//                 status: currentSystemStatus, // Maintain current active/pending designation state intact
//                 paymentStatus: nextDatabaseValue,
//                 isFeatured: nextDatabaseValue,
//                 featuredUntil: nextDatabaseValue === 0 ? null : job.featuredUntil 
//             } 
//         } as any);
//     };

//     const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const value = e.target.value;
//         if (!value) return;

//         let targetDate = new Date();
//         if (value === '10min') targetDate = new Date(Date.now() + 10 * 60 * 1000);
//         else if (value === '1m') targetDate.setMonth(targetDate.getMonth() + 1);
//         else if (value === '3m') targetDate.setMonth(targetDate.getMonth() + 3);
//         else if (value === '6m') targetDate.setMonth(targetDate.getMonth() + 6);

//         updateJobStatus({
//             id: job.id || job._id,
//             updates: {
//                 paymentStatus: 1, 
//                 isFeatured: 1,
//                 status: 'active', // Dropdowns automatically flip system to active layout status
//                 featuredUntil: targetDate.toISOString()
//             }
//         } as any);

//         e.target.value = "";
//         e.target.blur(); 
//     };

//     const formatExpiration = (isoString: string) => {
//         if (!isoString) return '';
//         const date = new Date(isoString);
//         return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
//     };

//     const SHOW_MANUAL_OVERRIDE = user?.role === 'admin';

//     return (
//         <tr className="hover:bg-slate-50/50 transition-colors">
//             {/* COLUMN 1: Details */}
//             <td className="p-4">
//                 <div className="font-bold text-slate-900 leading-tight">{job.title}</div>
//                 <div className="text-[10px] text-slate-500 font-medium uppercase">{job.company}</div>
//             </td>

//             {/* COLUMN 2: System Status (Active / Pending Only) */}
//             <td className="p-4 align-middle">
//                 <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tight ${
//                     currentSystemStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
//                 }`}>
//                     {currentSystemStatus}
//                 </span>
//             </td>
            
//             {/* COLUMN 3: Payments & Expiry combined layout workspace */}
//             <td className="p-4 align-middle">
//                 <div className="flex flex-col gap-1">
//                     {SHOW_MANUAL_OVERRIDE ? (
//                         <div className="flex items-center gap-3">
//                             <button
//                                 type="button"
//                                 onClick={handleToggleClick}
//                                 className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
//                                     paymentLabel === 'Paid' ? 'bg-green-500' : paymentLabel === 'Expired' ? 'bg-rose-500' : 'bg-slate-200'
//                                 }`}
//                             >
//                                 <span
//                                     className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//                                         paymentLabel === 'Paid' ? 'translate-x-4' : 'translate-x-0'
//                                     }`}
//                                 />
//                             </button>
//                             <span className={`text-[10px] font-black uppercase tracking-wider ${
//                                 paymentLabel === 'Paid' ? 'text-green-600' : paymentLabel === 'Expired' ? 'text-rose-600' : 'text-slate-400'
//                             }`}>
//                                 {paymentLabel}
//                             </span>
//                         </div>
//                     ) : (
//                         <div className="flex items-center gap-3">
//                             <span className={`text-[10px] font-black uppercase tracking-wider ${
//                                 paymentLabel === 'Paid' ? 'text-green-600' : paymentLabel === 'Expired' ? 'text-rose-600' : 'text-amber-500'
//                             }`}>
//                                 {paymentLabel}
//                             </span>

//                             {paymentLabel !== 'Paid' && (
//                                 <button
//                                     onClick={() => {
//                                         const resolvedJobId = String(job.id || job._id || '');
//                                         const resolvedEmail = String(user?.email || job.author?.email || job.companyEmail || 'employer@hiring.com');
//                                         const resolvedTitle = String(job.title || 'Premium Job Listing');

//                                         if (!resolvedJobId || resolvedJobId === 'undefined') {
//                                             alert("Cannot navigate to checkout: Database record ID is missing.");
//                                             return;
//                                         }
//                                         // 🛑 SAFETY GATE: Intercept if the job hasn't been approved/activated by an admin yet
//                                         if (currentSystemStatus !== 'active') {
//                                             alert(`"${resolvedTitle}" is currently under review. You can proceed to checkout once an administrator approves and activates your listing.`);
//                                             return; 
//                                         }

//                                         navigate('/checkout', {
//                                             state: { 
//                                                 jobId: resolvedJobId, 
//                                                 email: resolvedEmail, 
//                                                 title: resolvedTitle,
//                                                 duration: isExpired ? 'renew_1m' : 'standard_1m'
//                                             }
//                                         });
//                                     }}
//                                     className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1 text-white transition-all ${
//                                         paymentLabel === 'Expired' 
//                                           ? 'bg-amber-500 hover:bg-amber-600 shadow-sm shadow-amber-100' 
//                                           : 'bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-100'
//                                         }`}
//                                 >
//                                     {paymentLabel === 'Expired' ? <RefreshCw size={10} /> : <CreditCard size={10} />}
//                                     {paymentLabel === 'Expired' ? 'Renew' : 'Pay'}
//                                 </button>
//                             )}
//                         </div>
//                     )}

//                     {/* Nest the until/expiry date details right under the payment text/toggle wrapper */}
//                     {hasPaidRecord && job.featuredUntil && (
//                         <span className={`text-[9px] font-medium flex items-center gap-1 ${isExpired ? 'text-red-400' : 'text-slate-400'}`}>
//                             <Calendar size={10} /> {isExpired ? 'Expired on' : 'Until'} {formatExpiration(job.featuredUntil)}
//                         </span>
//                     )}
//                 </div>
//             </td>

//             {user?.role === 'admin' && <td className="p-4 text-xs">{job.author?.name || 'Admin'}</td>}

//             {/* COLUMN 5: Action Options */}
//             <td className="p-4 text-right align-middle">
//                 <div className="flex items-center justify-end gap-3">
//                     {user?.role === 'admin' && (
//                         <select 
//                             onChange={handleDurationChange}
//                             value="" 
//                             className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-black uppercase text-slate-500 cursor-pointer tracking-wider focus:outline-none focus:border-indigo-500"
//                         >
//                             <option value="" disabled>+ Set Duration</option>
//                             <option value="10min">⚡ 10 Minutes (Test)</option>
//                             <option value="1m">📅 1 Month</option>
//                             <option value="3m">📅 3 Months</option>
//                             <option value="6m">📅 6 Months</option>
//                         </select>
//                     )}

//                     <button onClick={() => setPreviewJob(job)} className="text-indigo-600 text-xs font-black hover:underline">
//                         VIEW
//                     </button>

//                     {user?.role === 'admin' && currentSystemStatus === 'pending' && (
//                         <>
//                             <button 
//                                 onClick={() => updateJobStatus({ id: job.id || job._id, updates: { status: 'active' } })}
//                                 className="text-green-600 text-xs font-black hover:underline"
//                             >
//                                 ACTIVATE
//                             </button>
//                         </>
//                     )}
                    
//                     <button 
//                         onClick={() => deleteJob(job.id || job._id)}
//                         disabled={isDeleting}
//                         className="text-red-500 text-xs font-black hover:underline disabled:opacity-30"
//                     >
//                         {isDeleting ? '...' : 'DELETE'}
//                     </button>
//                 </div>
//             </td>
//         </tr>
//     );
// };



import { useState, useEffect } from 'react';
import { useManageJobs } from '../api/useManageJobs';
import { useAuthStore } from '../../../store/useAuthStore';
import { useSearchParams} from 'react-router-dom';
import { X } from 'lucide-react'; // Kept only X for modal closing

export const JobManagement = () => {
    const { user } = useAuthStore();
    const { jobs, isLoading, deleteJob, isDeleting, updateJobStatus } = useManageJobs(user?.role || 'employee'); 
    const [previewJob, setPreviewJob] = useState<any | null>(null);

    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || "";

    const filteredJobs = jobs?.filter((j: any) => {
        const title = j.title?.toLowerCase() || "";
        const company = j.company?.toLowerCase() || "";
        const term = search.toLowerCase();
        return title.includes(term) || company.includes(term);
    });

    useEffect(() => {
        if (previewJob) {
            const updatedJob = jobs?.find((j: any) => (j.id || j._id) === (previewJob.id || previewJob._id));
            if (updatedJob) setPreviewJob(updatedJob);
        }
    }, [jobs, previewJob]);

    if (isLoading) return <div className="p-10 text-center font-black uppercase text-slate-400 animate-pulse">Scanning Database...</div>;

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-[10px] font-black uppercase text-slate-400">
                        <th className="p-4">Role Details</th>
                        <th className="p-4">System Status</th>
                        {/* Hidden temporarily: Payments & Expiry */}
                        {user?.role === 'admin' && <th className="p-4">Employer</th>}
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredJobs?.map((job: any) => (
                        <RowWrapper 
                            key={job.id || job._id} 
                            job={job} 
                            user={user} 
                            isDeleting={isDeleting} 
                            deleteJob={deleteJob} 
                            updateJobStatus={updateJobStatus} 
                            setPreviewJob={setPreviewJob} 
                        />
                    ))}
                </tbody>
            </table>

            {/* MODAL OVERLAY */}
            {previewJob && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase px-2 py-1 rounded mb-2 inline-block">
                                        {previewJob.jobType || 'Full-time'}
                                    </span>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                                        {previewJob.title}
                                    </h2>
                                    <p className="text-indigo-600 font-bold uppercase text-sm mt-1">{previewJob.company}</p>
                                </div>
                                <button onClick={() => setPreviewJob(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Job Description</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                        {previewJob.description}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-xl space-y-6 border border-slate-100">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Location</h4>
                                    <p className="text-sm font-bold text-slate-900">{previewJob.location}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Salary</h4>
                                    <p className="text-sm font-bold text-slate-900">{previewJob.salaryRange || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Status Parameters</h4>
                                    <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${
                                        previewJob.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {previewJob.status === 'active' ? 'Active' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
                            {previewJob.status !== 'active' && user?.role === 'admin' && (
                                <button 
                                    onClick={() => { 
                                        updateJobStatus({ 
                                            id: previewJob.id || previewJob._id, 
                                            updates: { status: 'active' } 
                                        }); 
                                        setPreviewJob(null); 
                                    }}
                                    className="flex-[2] bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
                                >
                                    Approve & Set Active
                                </button>
                            )}
                            <button onClick={() => setPreviewJob(null)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RowWrapper = ({ job, user, isDeleting, deleteJob, updateJobStatus, setPreviewJob }: any) => {
    // Keep active calculation running to avoid JSX crashes
    const currentSystemStatus = job.status === 'active' ? 'active' : 'pending';

    const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (!value) return;

        let targetDate = new Date();
        if (value === '10min') targetDate = new Date(Date.now() + 10 * 60 * 1000);
        else if (value === '1m') targetDate.setMonth(targetDate.getMonth() + 1);
        else if (value === '3m') targetDate.setMonth(targetDate.getMonth() + 3);
        else if (value === '6m') targetDate.setMonth(targetDate.getMonth() + 6);

        updateJobStatus({
            id: job.id || job._id,
            updates: {
                paymentStatus: 1, 
                isFeatured: 1,
                status: 'active',
                featuredUntil: targetDate.toISOString()
            }
        } as any);

        e.target.value = "";
        e.target.blur(); 
    };

    /* =========================================================================
       PAUSED PAYMENT LOGIC WORKSPACE (Ready to be uncommented later)
       -------------------------------------------------------------------------
       const isExpired = job.featuredUntil && new Date(job.featuredUntil) < new Date();
       const hasPaidRecord = job.paymentStatus === 'paid' || job.paymentStatus === '1' || job.paymentStatus === 1 || job.paymentStatus === true;
       let paymentLabel = 'Unpaid';
       if (hasPaidRecord) { paymentLabel = isExpired ? 'Expired' : 'Paid'; }

       const handleToggleClick = () => {
           const nextDatabaseValue = hasPaidRecord ? 0 : 1;
           updateJobStatus({ 
               id: job.id || job._id,
               updates: { 
                   status: currentSystemStatus,
                   paymentStatus: nextDatabaseValue,
                   isFeatured: nextDatabaseValue,
                   featuredUntil: nextDatabaseValue === 0 ? null : job.featuredUntil 
               } 
           } as any);
       };
       ========================================================================= */

    return (
        <tr className="hover:bg-slate-50/50 transition-colors">
            {/* COLUMN 1: Details */}
            <td className="p-4">
                <div className="font-bold text-slate-900 leading-tight">{job.title}</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase">{job.company}</div>
            </td>

            {/* COLUMN 2: System Status */}
            <td className="p-4 align-middle">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tight ${
                    currentSystemStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                    {currentSystemStatus}
                </span>
            </td>
            
            {/* COLUMN 3: Employer (Only matches headers perfectly now) */}
            {user?.role === 'admin' && <td className="p-4 text-xs">{job.author?.name || 'Admin'}</td>}

            {/* COLUMN 4: Action Options */}
            <td className="p-4 text-right align-middle">
                <div className="flex items-center justify-end gap-3">
                    {user?.role === 'admin' && (
                        <select 
                            onChange={handleDurationChange}
                            value="" 
                            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-black uppercase text-slate-500 cursor-pointer tracking-wider focus:outline-none focus:border-indigo-500"
                        >
                            <option value="" disabled>+ Set Duration</option>
                            <option value="10min">⚡ 10 Minutes (Test)</option>
                            <option value="1m">📅 1 Month</option>
                            <option value="3m">📅 3 Months</option>
                            <option value="6m">📅 6 Months</option>
                        </select>
                    )}

                    <button onClick={() => setPreviewJob(job)} className="text-indigo-600 text-xs font-black hover:underline">
                        VIEW
                    </button>

                    {user?.role === 'admin' && currentSystemStatus === 'pending' && (
                        <button 
                            onClick={() => updateJobStatus({ id: job.id || job._id, updates: { status: 'active' } })}
                            className="text-green-600 text-xs font-black hover:underline"
                        >
                            ACTIVATE
                        </button>
                    )}
                    
                    <button 
                        onClick={() => deleteJob(job.id || job._id)}
                        disabled={isDeleting}
                        className="text-red-500 text-xs font-black hover:underline disabled:opacity-30"
                    >
                        {isDeleting ? '...' : 'DELETE'}
                    </button>
                </div>
            </td>
        </tr>
    );
};