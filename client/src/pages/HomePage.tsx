// import { Link } from 'react-router-dom';
// import { JobFeed } from '../features/jobs/components/JobFeed';
// import {HowItWorks} from '../component/ui/HowItWorks';
// import { CategoryFilter } from '../component/CategoryFilter';
// import { SearchBox } from '../component/ui/SearchBox';
// import { StatsBar } from '../component/ui/StatsBar';


// export const Hero = () => {

//   return (
//     <section className="bg-aventon-dark pt-32 pb-20 px-6 text-center mb-0 shadow-2xl">
//         <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
//           Find Your <span className="text-aventon-accent">A-Game</span>
//         </h1>
//         <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-12">
//           Nigeria's Premium Tech Talent Pipeline
//         </p>

//         <SearchBox />
//         <CategoryFilter />
      
//     </section>
//   );
// };

// export const HomePage = () => {
//   return (
//     <main>
//       <Hero />
//       <StatsBar/>
      

//       <section className="max-w-7xl mx-auto px-6 mb-20">
//         <div className="flex justify-between items-end mb-12">
//           <div>
//             <h2 className="text-3xl font-black text-aventon-dark uppercase tracking-tighter">
//               Latest Openings
//             </h2>
//             <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
//               Fresh opportunities updated daily
//             </p>
//           </div>
//           <Link to="/jobs" className="text-[10px] font-black uppercase border-b-2 border-aventon-dark pb-1 hover:text-aventon-accent hover:border-aventon-accent transition-colors">
//             View All Jobs
//           </Link>
//         </div>

//         {/* This is the component we fixed earlier! */}
//         <JobFeed limit={6} />
//       </section>
      

//          <HowItWorks/>

//       {/* 3. "Any other thing" - Call to Action */}
//       <section className="max-w-7xl mx-auto px-6 mb-32">
//         <div className="bg-slate-50 rounded-[40px] p-12 flex flex-col md:flex-row items-center justify-between border border-slate-100">
//           <div className="max-w-md text-center md:text-left mb-8 md:mb-0">
//             <h3 className="text-2xl font-black text-aventon-dark uppercase tracking-tighter mb-4">
//               Hiring for your team?
//             </h3>
//             <p className="text-slate-500 font-bold text-sm leading-relaxed">
//               Post your job listings and reach the top 1% of tech talent in Nigeria.
//             </p>
//           </div>
       
//           <Link to="/post-job" className="bg-white text-aventon-dark border-2 border-aventon-dark px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-aventon-dark hover:text-white transition-all shadow-sm">
//             Post a Job for Free
//           </Link>
//         </div>
//       </section>
//     </main>
//   );
// };


import { Link } from 'react-router-dom';
// import { JobFeed } from '../features/jobs/components/JobFeed';
import { HowItWorks } from '../component/ui/HowItWorks';
import { CategoryFilter } from '../component/CategoryFilter';
import { SearchBox } from '../component/ui/SearchBox';
import { StatsBar } from '../component/ui/StatsBar';
import { useJobs } from '../features/jobs/api/useJobs';
import { JobCard } from '../features/jobs/components/JobCard';

export const Hero = () => {
   
  
  return (
    <section className="bg-aventon-dark pt-32 pb-20 px-6 text-center mb-0 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow for premium feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none"></div>
        
        <h1 className="relative z-10 text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
          Find Your <span className="text-amber-400">A-Game</span>
        </h1>
        <p className="relative z-10 text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-12">
          Nigeria's Premium Tech Talent Pipeline
        </p>

        <div className="relative z-10">
          <SearchBox />
          <CategoryFilter />
        </div>
    </section>
  );
};

export const HomePage = () => {
  const { data: jobs, isLoading, isError } = useJobs();

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
    <main className="bg-[#F8FAFC]">
      <Hero />
      <StatsBar />

      <section className="max-w-7xl mx-auto px-6 mb-20 mt-16">
        {/* --- THE TWO COLUMN GRID START --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Main Feed (8 Cols) */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-black text-aventon-dark uppercase tracking-tighter">
                  Latest Openings
                </h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
                  Fresh opportunities updated daily
                </p>
              </div>
              <Link to="/jobs" className="text-[10px] font-black uppercase border-b-2 border-aventon-dark pb-1 hover:text-amber-500 hover:border-amber-500 transition-colors">
                View All Jobs
              </Link>
            </div>

            {/* Your fixed JobFeed with 1-column cards */}
            {/* <JobFeed limit={6} /> */}
             <div className="flex flex-col gap-6">
                            {jobsList.slice(0, 6).map((job: any) => (
                              <JobCard key={job.id} job={job} />
                            ))}
                          </div>
          </div>
          

          {/* RIGHT COLUMN: Home Sidebar (4 Cols) */}
          <aside className="lg:block lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              
              {/* Widget: Call to Action */}
              <div className="bg-aventon-dark p-8 rounded-[32px] shadow-2xl text-white">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-4">For Employers</h3>
                <p className="text-sm font-bold mb-6 leading-snug">
                  Hiring for your team? Post your listing to reach Nigeria's top 1%.
                </p>
                <Link to="/admin/post-job" className="block w-full text-center bg-white text-aventon-dark py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all">
                  Post a Job Now
                </Link>
                
              </div>

              {/* Widget: Insights (Matches the Results Page) */}
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Market Pulse</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Active Roles</span>
                    <span className="text-sm font-black text-aventon-dark">120+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">New Today</span>
                    <span className="text-sm font-black text-green-600">+12</span>
                  </div>
                </div>
              </div>

              {/* Tips Widget */}
              <div className="p-8 rounded-[32px] border-2 border-dashed border-slate-200">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Pro Tip</h3>
                <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                  "Featured jobs get 3x more views from top candidates. Consider highlighting your priority roles."
                </p>
              </div>

            </div>
          </aside>
        </div>
        {/* --- THE TWO COLUMN GRID END --- */}
      </section>

      <HowItWorks />

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="bg-white rounded-[40px] p-12 flex flex-col md:flex-row items-center justify-between border border-slate-100 shadow-sm">
          <div className="max-w-md text-center md:text-left mb-8 md:mb-0">
            <h3 className="text-2xl font-black text-aventon-dark uppercase tracking-tighter mb-4">
              Join the Network
            </h3>
            <p className="text-slate-500 font-bold text-sm leading-relaxed">
              Create an account to track your applications and save your favorite roles.
            </p>
          </div>
          <Link to="/register" className="bg-aventon-dark text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-400 hover:text-aventon-dark transition-all shadow-lg">
            Create Free Account
          </Link>
        </div>
      </section>
    </main>
  );
};