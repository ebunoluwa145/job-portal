// import { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";


// export const SearchBox = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchParams, setSearchParams] = useSearchParams();
//      const navigate = useNavigate();

//      const handleSearch = (e: React.FormEvent) => {
//   e.preventDefault(); // This stops the "Hard Reload"
  
//   const newParams = new URLSearchParams(searchParams);
  
//   if (searchTerm.trim()) {
//     newParams.set('search', searchTerm.trim());
//   } else {
//     newParams.delete('search');
//   }
  
//   // This updates the URL without reloading the page!
//   setSearchParams(newParams);
// };

//     return (
//         <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
//         {/* Search Bar Container */}
//         <div className="bg-white p-2 rounded-3xl flex flex-col md:flex-row gap-2 shadow-xl border border-white/10">
//           <input 
//             type="text"
//             name="search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Job Title (e.g. React Developer)" 
//             className="flex-1 px-6 py-4 outline-none text-slate-800 font-bold placeholder:text-slate-300 uppercase text-xs tracking-widest"
//           />
//          {/* <div className="w-px h-8 bg-slate-100 hidden md:block self-center" />  
//         <input  
//             type="text" 
//             name="search"
//              value={searchTerm}
//              onChange={(e) => setSearchTerm(e.target.value)}
//              placeholder="Location (e.g. Lagos)" 
//         className="flex-1 px-6 py-4 outline-none text-slate-800 font-bold placeholder:text-slate-300 uppercase text-xs tracking-widest"
//           /> */}
//           <button type = "submit" className="bg-aventon-dark text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-aventon-accent transition-all">
//             Search Jobs
//           </button>
//         </div>
//       </form>
//     );
// }



import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

export const SearchBox = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation(); // <--- Add this to know where we are

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        const term = searchTerm.trim();
        
        // 1. Check if we are already on the jobs page
        const isJobPage = location.pathname.startsWith('/jobs');

        if (isJobPage) {
            // INSTANT UPDATE (No reload, stays on page)
            const newParams = new URLSearchParams(searchParams);
            if (term) newParams.set('search', term);
            else newParams.delete('search');
            setSearchParams(newParams);
        } else {
            // REDIRECT (Jumps from Home to Jobs)
            const path = term ? `/job?search=${encodeURIComponent(term)}` : '/jobs';
            navigate(path);
        }
    };

    return (
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white p-2 rounded-3xl flex flex-col md:flex-row gap-2 shadow-xl border border-white/10">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Job Title (e.g. React Developer)" 
                    className="flex-1 px-6 py-4 outline-none text-slate-800 font-bold placeholder:text-slate-300 uppercase text-xs tracking-widest"
                />
                <button type="submit" className="bg-aventon-dark text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-aventon-accent transition-all">
                    Search Jobs
                </button>
            </div>
        </form>
    );
};