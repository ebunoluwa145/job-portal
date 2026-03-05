
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    salary: string;
    jobType: string; // e.g., "Full-time", "Remote"
  };
}

export const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-green-50 transition-colors">
          {/* Placeholder for Logo - You can use R2 here later */}
          <div className="w-10 h-10 bg-aventon-dark rounded-xl flex items-center justify-center text-white font-black text-lg">
            {job.company.charAt(0)}
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
          {job.jobType || 'Full-time'}
        </span>
      </div>

      <h3 className="text-xl font-black text-aventon-dark uppercase tracking-tighter leading-tight mb-1">
        {job.title}
      </h3>
      <p className="text-slate-500 font-bold text-sm mb-6">{job.company}</p>

      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-md">
          <span className="text-[10px] font-black uppercase">{job.location}</span>
        </div>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500 font-bold text-[10px] uppercase">₦{job.salary}</span>
      </div>

      <Link 
        to={`/job/${job.id}`}
        className="block w-full text-center bg-slate-50 text-aventon-dark py-4 rounded-xl font-black uppercase tracking-widest text-[10px] group-hover:bg-aventon-dark group-hover:text-white transition-all"
      >
        View Details
      </Link>
    </div>
  );
};