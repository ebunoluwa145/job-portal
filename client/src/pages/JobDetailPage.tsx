import { useParams, Link } from 'react-router-dom';
import { useJobs } from '../features/jobs/api/useJobs';
import { useCategories } from '../features/jobs/api/useCategory';

export const JobDetailsPage = () => {
  const { id } = useParams();
  const { data: jobs, isLoading } = useJobs();
  const { data: categories } = useCategories();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-pulse font-black uppercase tracking-widest text-slate-400">Loading Role Details...</div>
    </div>
  );

  const job = jobs?.find((j: any) => j.id === Number(id));
  const category = categories?.find((c: any) => c.id === job?.categoryId);
  if (!job) return <div className="p-20 text-center font-black uppercase text-red-500">Job not found</div>;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* --- PREMIUM HEADER SECTION --- */}
      <header className="bg-white border-b border-slate-100 pt-16 pb-12 mb-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/jobs" className="inline-flex items-center text-[10px] font-black uppercase text-slate-400 hover:text-amber-500 mb-8 transition-colors">
            <span className="mr-2">←</span> Back to Talent Pipeline
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {category?.name || 'General'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Ref: #00{job.id}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-aventon-dark uppercase tracking-tighter leading-none mb-6">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-wide">
                <span className="flex items-center"><span className="text-amber-500 mr-2">@</span>{job.company}</span>
                <span className="flex items-center"><span className="text-amber-500 mr-2">loc.</span>{job.location}</span>
                <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black tracking-widest">
                  ₦{job.salary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- CONTENT GRID --- */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Description (Left - 8 Cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white p-10 md:p-16 rounded-[40px] border border-slate-100 shadow-sm">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">
                Detailed Description
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="whitespace-pre-wrap text-slate-600 text-lg leading-relaxed font-medium">
                  {job.description}
                </p>
              </div>
              
              <div className="mt-16 pt-12 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Posted by</p>
                  <p className="font-bold text-aventon-dark uppercase">{job.author?.name || 'Aventon Admin'}</p>
                </div>
                <button className="text-[10px] font-black uppercase border-b-2 border-aventon-dark pb-1">Report Listing</button>
              </div>
            </div>
          </div>

          {/* Sidebar Actions (Right - 4 Cols) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              
              {/* Primary Action Card */}
              <div className="bg-aventon-dark p-8 rounded-[32px] shadow-2xl text-white overflow-hidden relative">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full"></div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-4">Application</h3>
                <p className="text-sm font-bold mb-8 leading-snug">
                  Interested in this role? Submit your application through our secure pipeline.
                </p>
                <Link to={job.link || '#'} target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-amber-400 text-aventon-dark py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg transform hover:-translate-y-1">
                    Apply Now
                  </button>
                </Link>
              </div>

              {/* Quick Info Stats */}
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Quick Overview</h3>
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Employment</span>
                    <span className="text-xs font-bold text-aventon-dark uppercase">{job.jobType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Category</span>
                    <span className="text-xs font-bold text-aventon-dark uppercase">{category?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Currency</span>
                    <span className="text-xs font-bold text-aventon-dark uppercase">NGN (₦)</span>
                  </div>
                </div>
              </div>

            </div>
          </aside>
          
        </div>
      </section>
    </main>
  );
};