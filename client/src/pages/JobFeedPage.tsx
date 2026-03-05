
// import { useJobs } from '../features/jobs/api/useJobs';
// import { JobCard } from '../features/jobs/components/JobCard';
// import { useParams} from 'react-router-dom';

// export const JobFeedPage = () => {
//   const { id } = useParams();
//   const { data: jobs } = useJobs();
//   const job = jobs?.find((j: any) => j.id === Number(id));

//   if (!job) return <div className="p-20 text-center font-black uppercase text-slate-400">Job Not Found</div>;

//   return (
//     <div className="max-w-4xl mx-auto py-20 px-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//   {jobs?.map((job: any) => (
//     <JobCard key={job.id} job={job} /> // <-- This is where the Card lives!
//   ))}
// </div>
//     </div>
//   );
// };

import { useJobs } from '../features/jobs/api/useJobs';
import { JobCard } from '../features/jobs/components/JobCard';

export const JobFeedPage = () => {
  const { data: jobs, isLoading, isError } = useJobs();

  console.log("DATA TYPE:", typeof jobs);
  console.log("IS ARRAY?:", Array.isArray(jobs));
  console.log("ACTUAL DATA:", jobs);

  if (isLoading) return <div className="p-20 text-center font-black uppercase text-slate-400">Loading Jobs...</div>;
  
  if (isError) return <div className="p-20 text-center font-black uppercase text-red-400">Error fetching jobs</div>;

  if (!jobs || jobs.length === 0) {
    return <div className="p-20 text-center font-black uppercase text-slate-400">No Jobs Found</div>;
  }

  const jobsList = Array.isArray(jobs) 
    ? jobs 
    : (jobs && typeof jobs === 'object' && 'data' in jobs) 
      ? (jobs as any).data 
      : [];

  if (jobsList.length === 0) {
    return <div className="p-20 text-center font-black uppercase text-slate-400">No Jobs Found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-10">Available Positions</h1>
      
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {jobsList.map((job: any) => (
    <JobCard key={job.id} job={job} />
  ))}
</div>
    </div>
  );
};