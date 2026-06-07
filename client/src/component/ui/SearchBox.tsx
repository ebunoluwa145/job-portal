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
    const [locationTerm, setLocationTerm] = useState('');   
    const navigate = useNavigate();
    const location = useLocation(); // <--- Add this to know where we are

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        const term = searchTerm.trim();
        const jobLocation = locationTerm.trim();

        // Use the current searchParams as a base
        const newParams = new URLSearchParams(searchParams);

        // Handle Keyword: Set if exists, otherwise remove
        if (term) newParams.set('search', term);
        else newParams.delete('search');

        // Handle Location: Set if exists, otherwise remove
        if (jobLocation) newParams.set('location', jobLocation);
        else newParams.delete('location');

        // Path detection (Double-check if your route is /job or /jobs)
        const isJobPage = location.pathname.startsWith('/job');

        if (isJobPage) {
            setSearchParams(newParams);
        } else {
            const queryString = newParams.toString();
            // Using /job to stay consistent with your likely AppRouter path
            navigate(`/job${queryString ? `?${queryString}` : ''}`);
        }
    };
    return (
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-10">
            <div className="bg-white p-2 rounded-3xl flex flex-col md:flex-row gap-2 shadow-xl border border-white/10">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Job Title (e.g. React Developer)" 
                    className="flex-1 px-6 py-4 outline-none text-slate-800 font-bold placeholder:text-slate-300 uppercase text-xs tracking-widest"
                />
                <input 
                    type="text"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    placeholder="Job location (e.g. Lagos)" 
                    className="flex-1 px-6 py-4 outline-none text-slate-800 font-bold placeholder:text-slate-300 uppercase text-xs tracking-widest"
                />
                
                <button type="submit" className="bg-aventon-dark text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-aventon-accent transition-all">
                    Search Jobs
                </button>
            </div>
        </form>
    );
};