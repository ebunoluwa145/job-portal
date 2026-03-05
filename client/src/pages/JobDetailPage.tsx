import { useParams, Link } from 'react-router-dom';
import { useJobs } from '../features/jobs/api/useJobs';

// export const JobDetailsPage = () => {
//   const { id } = useParams();
//   const { data: jobs } = useJobs();
  
//   // Find the specific job from the cache
//   const job = jobs?.find((j: any) => j.id === Number(id));

//   if (!job) return <div>Job not found</div>;

//   return (
//     <div className="max-w-3xl mx-auto py-20 px-4">
//       <Link to="/job" className="text-[10px] font-black uppercase text-slate-400 hover:text-aventon-dark mb-8 block">
//         ← Back to all jobs
//       </Link>
      
//       <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100">
//         <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-[10px] font-black uppercase">
//           {job.location}
//         </span>
//         <h1 className="text-4xl font-black text-aventon-dark uppercase tracking-tighter mt-4">
//           {job.title}
//         </h1>
//         <p className="text-xl font-bold text-slate-600 mt-2">{job.company_name}</p>
        
//         <div className="my-10 h-px bg-slate-100" />
        
//         <div className="prose prose-slate max-w-none">
//           <h4 className="uppercase text-[10px] font-black text-slate-400 tracking-widest mb-4">Description</h4>
//           <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
//             {job.description}
//           </p>
//         </div>

//         <button className="w-full bg-aventon-dark text-white py-5 rounded-2xl font-black uppercase tracking-widest mt-12 shadow-lg hover:scale-[1.02] transition-transform">
//           Apply Now
//         </button>
//       </div>
//     </div>
//   );
// };


export const JobDetailsPage = () => {
  const { id } = useParams();
  const { data: jobs, isLoading } = useJobs(); // Your hook calling getById

  if (isLoading) return <div className="p-20 text-center">Loading...</div>;
   const job = jobs?.find((j: any) => j.id === Number(id));
  if (!job) return <div className="p-20 text-center">Job not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
        <Link to="/job" className="text-[10px] font-black uppercase text-slate-400 hover:text-aventon-dark mb-8 block">
          ← Back to all jobs
        </Link>
        {/* 1. Header Section */}
        <header className="mb-12 border-b border-slate-100 pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
            <h1 className="text-4xl font-black text-aventon-dark uppercase tracking-tighter mb-4">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500 uppercase tracking-wide">
              <span>{job.company}</span>
              <span className="text-slate-300">•</span>
              <span>{job.location}</span>
              <span className="text-slate-300">•</span>
              <span className="text-green-600">₦{job.salary}</span>
            </div>
          </div>
          <button className="bg-aventon-dark text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-aventon-accent transition-all">
            Apply For This Position
          </button>
        </div>
      </header>

      {/* 2. Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Description */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-black text-aventon-dark uppercase tracking-wider mb-4">
              Job Description
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4">
              {/* Use whitespace-pre-wrap to preserve formatting from your DB */}
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-black text-aventon-dark uppercase tracking-wider mb-4 text-sm">
              Job Overview
            </h3>
            <ul className="space-y-4">
              <li className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Posted By</span>
                <span className="text-aventon-dark font-black">{job.author?.name}</span>
              </li>
              <li className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Category</span>
                <span className="text-aventon-dark font-black">{job.category}</span>
              </li>
              <li className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Type</span>
                <span className="text-aventon-dark font-black">{job.jobType}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};