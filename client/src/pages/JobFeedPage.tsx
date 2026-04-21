

import { useSearchParams } from 'react-router-dom';
import { useJobs } from '../features/jobs/api/useJobs';
import { JobCard } from '../features/jobs/components/JobCard';
import { SearchBox } from '../component/ui/SearchBox';

export const JobFeedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const location = searchParams.get('location') || undefined;

  
  const { data: jobs, isLoading, isError } = useJobs(category, search, location);

  // Data Extraction Logic
  const jobsList = Array.isArray(jobs) 
    ? jobs 
    : (jobs && typeof jobs === 'object' && 'data' in jobs) 
      ? (jobs as any).data 
      : [];

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-sm font-black uppercase tracking-widest text-slate-400">
        Loading Pipeline...
      </div>
    </div>
  );
  
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm font-black uppercase tracking-widest text-red-500">
        Error Connecting to API
      </div>
    </div>
  );

  return (
    // <main className="min-h-screen bg-slate-50/50 pb-24">
    //   {/* Header Section */}
    //   <header className="bg-white border-b border-slate-100 pt-16 pb-12 mb-12">
    //     <div className="max-w-7xl mx-auto px-6">
    //       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    //         <div>
    //           {/* <p className="text-[10px] font-black uppercase tracking-[0.3em] text-aventon-accent mb-2">
    //             {category || 'All Categories'}
    //           </p> */}
    //           <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-aventon-dark">
    //             {search || location ? `Results for: ${search || ''} ${location ? `in ${location}` : ''}` : 'jobs'}
    //           </h1>
           
    //         </div>
            
    //         <div className="w-full md:w-1/3">
    //           <SearchBox />
    //         </div>
    //       </div>
    //     </div>
    //   </header>

    //   {/* Grid Section */}
    //   <section className="max-w-7xl mx-auto px-6">
    //     {jobsList.length === 0 ? (
    //       <div className="py-32 text-center border-2 border-dashed border-slate-200 rounded-[40px]">
    //         <p className="font-black uppercase tracking-widest text-slate-400 mb-4">No positions found</p>
    //         <button 
    //           onClick={() => setSearchParams({})}
    //           className="text-[10px] font-black uppercase border-b-2 border-aventon-dark pb-1"
    //         >
    //           View all jobs
    //         </button>
    //       </div>
    //     ) : (
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //         {jobsList.map((job: any) => (
    //           <JobCard key={job.id} job={job} />
    //         ))}
    //       </div>
    //     )}
    //   </section>
    // </main>
    <main className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* --- HEADER SECTION --- */}
      <header className="bg-white border-b border-slate-100 pt-16 pb-12 mb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-aventon-dark leading-none">
                {search || location 
                  ? `Results: ${search || ''} ${location ? `in ${location}` : ''}` 
                  : 'Available Roles'}
              </h1>
              <div className="h-1.5 w-20 bg-amber-400 mt-4"></div>
            </div>
            
            <div className="w-full md:w-1/3">
              <SearchBox />
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* COLUMN 1: Job Listings (Left - 8 Cols) */}
          <div className="lg:col-span-8">
            {jobsList.length === 0 ? (
              <div className="py-32 text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-white/50">
                <p className="font-black uppercase tracking-widest text-slate-400 mb-4">No positions found</p>
                <button 
                  onClick={() => setSearchParams({})}
                  className="text-[10px] font-black uppercase border-b-2 border-aventon-dark pb-1 hover:text-amber-500 hover:border-amber-500 transition-colors"
                >
                  Clear Filters & View all jobs
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {jobsList.map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>

          {/* COLUMN 2: Contextual Sidebar (Right - 4 Cols) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              
              {/* Widget 1: Discovery / Trending */}
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                  Quick Discovery
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Engineering', 'Design', 'Product', 'Sales'].map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setSearchParams({ category: cat.toLowerCase() })}
                      className="px-4 py-2 bg-slate-50 hover:bg-aventon-dark hover:text-white transition-all rounded-xl text-[10px] font-bold text-slate-600 border border-slate-100 uppercase"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Widget 2: Notification Setup */}
              <div className="bg-aventon-dark p-8 rounded-[32px] shadow-2xl relative overflow-hidden text-white">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2">
                  Job Alerts
                </h3>
                <p className="text-sm font-bold mb-6 leading-snug">
                  Get new matching roles sent to your inbox daily.
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                  <button className="w-full bg-amber-400 text-aventon-dark py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-colors">
                    Activate Alerts
                  </button>
                </div>
              </div>

              {/* Widget 3: Salary Benchmarking */}
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                  Market Insights
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Average Pay</span>
                      <span className="text-lg font-black text-aventon-dark tracking-tighter">₦350k<span className="text-[10px] text-slate-400 uppercase ml-1">/mo</span></span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[65%]"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">
                    Based on market data for current vacancies.
                  </p>
                </div>
              </div>

            </div>
          </aside>
          
        </div>
      </section>
    </main>
  );
};