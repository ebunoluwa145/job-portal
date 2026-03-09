// import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

// const categories = ["Frontend", "Backend", "Mobile", "Product", "DevOps"];

// export const CategoryFilter = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const currentCategory = searchParams.get('category');

//   const handleCategoryClick = (cat: string) => {
//     if (location.pathname === '/') {
//       // If on Home, JUMP to the jobs page with the filter
//       navigate(`/job?category=${cat}`);
//     } else {
//       // If already on /jobs, just UPDATE the filter in place
//       setSearchParams({ category: cat });
//     }
//   };

//   return (
//     <section className="max-w-7xl mx-auto px-6 mb-12 flex flex-wrap justify-center gap-3">
//       {categories.map((cat) => (
//         <button 
//           key={cat}
//           onClick={() => handleCategoryClick(cat)} // Use the new handler
//           className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${
//             currentCategory === cat 
//               ? 'bg-aventon-dark text-white border-aventon-dark' 
//               : 'bg-white text-slate-400 border-slate-100 hover:border-aventon-dark'
//           }`}
//         >
//           {cat}
//         </button>
//       ))}
      
//       {currentCategory && (
//         <button 
//           onClick={() => setSearchParams({})}
//           className="text-[10px] font-black uppercase text-red-500 hover:underline"
//         >
//           Clear
//         </button>
//       )}
//     </section>
//   );
// };



import { useSearchParams } from 'react-router-dom';
import { useCategories } from '../features/jobs/api/useCategory';

export const CategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories, isLoading } = useCategories();
  
  // Get the current active category from the URL
  const activeCategory = searchParams.get('category');

  const handleCategoryClick = (category?: string) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    
    // Always reset to page 1 if you have pagination
    setSearchParams(newParams);
  };

  if (isLoading) {
    return (
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-24 bg-slate-100 animate-pulse rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-10 pb-2">
      {/* "All" Button */}
      <button
        onClick={() => handleCategoryClick()}
        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
          !activeCategory 
            ? 'bg-aventon-dark text-white shadow-lg scale-105' 
            : 'bg-white text-slate-400 border border-slate-200 hover:border-aventon-dark hover:text-aventon-dark'
        }`}
      >
        All Positions
      </button>

      {/* Dynamic Database Categories */}
      {categories?.map((cat: string) => (
        <button
          key={cat}
          onClick={() => handleCategoryClick(cat)}
          className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
            activeCategory === cat 
              ? 'bg-aventon-dark text-white shadow-lg scale-105' 
              : 'bg-white text-slate-400 border border-slate-200 hover:border-aventon-dark hover:text-aventon-dark'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};