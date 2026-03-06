import { useJobs } from '../api/useJobs';
import { JobCard } from './JobCard';
import { useSearchParams } from 'react-router-dom';

export const JobFeed = ({ limit }: { limit?: number }) => {
    const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || undefined;

  const { data: jobs, isLoading } = useJobs(category);

  if (isLoading) return <div className="p-10 text-center uppercase font-black text-slate-400">Loading...</div>;

  // The "Squeeze": Pull the array from the {success, data} object we found earlier
  const jobsList = Array.isArray(jobs) ? jobs : (jobs as any)?.data || [];

  // If a limit is passed, only show that many
  const displayedJobs = limit ? jobsList.slice(0, limit) : jobsList;

  if (displayedJobs.length === 0) {
    return <div className="p-10 text-center uppercase font-black text-slate-400">No Jobs Found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayedJobs.map((job: any) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};