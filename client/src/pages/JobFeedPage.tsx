
// // import { useJobs } from '../features/jobs/api/useJobs';
// // import { JobCard } from '../features/jobs/components/JobCard';
// // import { useParams} from 'react-router-dom';

// // export const JobFeedPage = () => {
// //   const { id } = useParams();
// //   const { data: jobs } = useJobs();
// //   const job = jobs?.find((j: any) => j.id === Number(id));

// //   if (!job) return <div className="p-20 text-center font-black uppercase text-slate-400">Job Not Found</div>;

// //   return (
// //     <div className="max-w-4xl mx-auto py-20 px-6">
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //   {jobs?.map((job: any) => (
// //     <JobCard key={job.id} job={job} /> // <-- This is where the Card lives!
// //   ))}
// // </div>
// //     </div>
// //   );
// // };


// import { useSearchParams } from 'react-router-dom';
// import { useJobs } from '../features/jobs/api/useJobs';
// import { JobCard } from '../features/jobs/components/JobCard';
// import { SearchBox } from '../component/ui/SearchBox';

// export const JobFeedPage = () => {
//     const [searchParams] = useSearchParams(); // 2. Grab the search params
//   const category = searchParams.get('category') || undefined; // 3. Extract the category (or set to undefined if not present)
//   const search = searchParams.get('search') || undefined; // 4. Extract the search term (or set to undefined if not present)
//   const { data: jobs, isLoading, isError } = useJobs(category, search);

//   console.log("DATA TYPE:", typeof jobs);
//   console.log("IS ARRAY?:", Array.isArray(jobs));
//   console.log("ACTUAL DATA:", jobs);

//   if (isLoading) return <div className="p-20 text-center font-black uppercase text-slate-400">Loading Jobs...</div>;
  
//   if (isError) return <div className="p-20 text-center font-black uppercase text-red-400">Error fetching jobs</div>;

//   if (!jobs || jobs.length === 0) {
//     return <div className="p-20 text-center font-black uppercase text-slate-400">No Jobs Found</div>;
//   }

//   const jobsList = Array.isArray(jobs) 
//     ? jobs 
//     : (jobs && typeof jobs === 'object' && 'data' in jobs) 
//       ? (jobs as any).data 
//       : [];

//   if (jobsList.length === 0) {
//     return <div className="p-20 text-center font-black uppercase text-slate-400">No Jobs Found</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto py-20 px-6">
//       <h1 className="text-3xl font-black uppercase tracking-tighter mb-10">Available Positions</h1>
//       <SearchBox />
      
//      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//   {jobsList.map((job: any) => (
//     <JobCard key={job.id} job={job} />
//   ))}
// </div>
//     </div>
//   );
// };

import { useSearchParams } from 'react-router-dom';
import { useJobs } from '../features/jobs/api/useJobs';
import { JobCard } from '../features/jobs/components/JobCard';
import { SearchBox } from '../component/ui/SearchBox';

export const JobFeedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  
  const { data: jobs, isLoading, isError } = useJobs(category, search);

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
    <main className="min-h-screen bg-slate-50/50 pb-24">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-100 pt-16 pb-12 mb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {/* <p className="text-[10px] font-black uppercase tracking-[0.3em] text-aventon-accent mb-2">
                {category || 'All Categories'}
              </p> */}
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-aventon-dark">
                {search ? `Results for: ${search}` : 'jobs'}
              </h1>
            </div>
            
            <div className="w-full md:w-1/3">
              <SearchBox />
            </div>
          </div>
        </div>
      </header>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-6">
        {jobsList.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-slate-200 rounded-[40px]">
            <p className="font-black uppercase tracking-widest text-slate-400 mb-4">No positions found</p>
            <button 
              onClick={() => setSearchParams({})}
              className="text-[10px] font-black uppercase border-b-2 border-aventon-dark pb-1"
            >
              View all jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobsList.map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};