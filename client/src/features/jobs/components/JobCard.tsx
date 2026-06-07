
import { Link } from 'react-router-dom';
import {formatRecency} from '../../../utils/formatter'

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    salary: string;
    jobType: string;
    createdAt:string;
    isFeatured:boolean; // e.g., "Full-time", "Remote"
  };
}

export const JobCard = ({ job }: JobCardProps) => {
  const recency = formatRecency(job.createdAt);

  return (
    <div className={`
      relative bg-white p-8 rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group
      ${job.isFeatured 
        ? 'border-amber-400 bg-amber-50/20 shadow-amber-100' 
        : 'border-slate-100'}
    `}>
      
      {/* Featured Badge */}
      {job.isFeatured && (
        <div className="absolute -top-3 left-8 bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
          Featured
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs text-gray-500 font-medium">
        {recency}
        </span>
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