import { Link } from 'react-router-dom';
import { JobFeed } from '../features/jobs/components/JobFeed';
import {HowItWorks} from '../component/ui/HowItWorks';
import { CategoryFilter } from '../component/CategoryFilter';
import { SearchBox } from '../component/ui/SearchBox';
import { StatsBar } from '../component/ui/StatsBar';


export const Hero = () => {

  return (
    <section className="bg-aventon-dark pt-32 pb-20 px-6 text-center mb-0 shadow-2xl">
        <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
          Find Your <span className="text-aventon-accent">A-Game</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-12">
          Nigeria's Premium Tech Talent Pipeline
        </p>

        <SearchBox />
        <CategoryFilter />
      
    </section>
  );
};

export const HomePage = () => {
  return (
    <main>
      <Hero />
      <StatsBar/>
      

      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-aventon-dark uppercase tracking-tighter">
              Latest Openings
            </h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
              Fresh opportunities updated daily
            </p>
          </div>
          <Link to="/jobs" className="text-[10px] font-black uppercase border-b-2 border-aventon-dark pb-1 hover:text-aventon-accent hover:border-aventon-accent transition-colors">
            View All Jobs
          </Link>
        </div>

        {/* This is the component we fixed earlier! */}
        <JobFeed limit={6} />
      </section>
      

         <HowItWorks/>

      {/* 3. "Any other thing" - Call to Action */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="bg-slate-50 rounded-[40px] p-12 flex flex-col md:flex-row items-center justify-between border border-slate-100">
          <div className="max-w-md text-center md:text-left mb-8 md:mb-0">
            <h3 className="text-2xl font-black text-aventon-dark uppercase tracking-tighter mb-4">
              Hiring for your team?
            </h3>
            <p className="text-slate-500 font-bold text-sm leading-relaxed">
              Post your job listings and reach the top 1% of tech talent in Nigeria.
            </p>
          </div>
       
          <Link to="/post-job" className="bg-white text-aventon-dark border-2 border-aventon-dark px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-aventon-dark hover:text-white transition-all shadow-sm">
            Post a Job for Free
          </Link>
        </div>
      </section>
    </main>
  );
};