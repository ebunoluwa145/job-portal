
// import { useSearchParams } from 'react-router-dom';
// import { useCategories } from '../features/jobs/api/useCategory';



// export const CategoryFilter = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const { data: categories, isLoading } = useCategories();
//   const activeCategory = searchParams.get('category');

//   const handleCategoryClick = (category?: string) => {
//     const newParams = new URLSearchParams(searchParams);
//     if (category) {
//       newParams.set('category', category);
//     } else {
//       newParams.delete('category');
//     }
//     setSearchParams(newParams);
//   };

//   if (isLoading) return <div className="animate-pulse">Loading categories...</div>;
// const totalJobs = categories?.reduce((acc, cat) => acc + cat.count, 0) || 0;
//   return (
    
//     <div className="flex flex-wrap items-center justify-center gap-3 mb-10 pb-2">
//       {/* "All" Button */}
//       <button
//         onClick={() => handleCategoryClick()}
//         className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
//           !activeCategory ? 'bg-aventon-accent text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'
//         }`}
//       >
//         All Positions
//         <span className="ml-2 opacity-50">({totalJobs})</span>
//       </button>

//       {/* Dynamic Categories with Counts */}
//       {categories?.map((cat: { name: string; count: number }) => (
//         <button
//           key={cat.name}
//           onClick={() => handleCategoryClick(cat.name)}
//           className={`group flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
//             activeCategory === cat.name 
//               ? 'bg-aventon-dark text-white shadow-lg scale-105' 
//               : 'bg-white text-slate-400 border border-slate-200 hover:border-aventon-dark'
//           }`}
//         >
//           {cat.name}
//           {/* This is the Count Badge */}
//           <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${
//             activeCategory === cat.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
//           }`}>
//             {cat.count}
//           </span>
//         </button>
//       ))}
//     </div>
//   );
// };


import { useSearchParams } from 'react-router-dom';
import { useCategories, type Category } from '../features/jobs/api/useCategory';
import { DynamicIcon } from './ui/DynamicIcon'; // Import the helper we made earlier

export const CategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories, isLoading } = useCategories();
  const activeCategory = searchParams.get('category');

  const handleCategoryClick = (categoryName?: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryName) {
      newParams.set('category', categoryName);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  if (isLoading) return <div className="animate-pulse flex gap-3 justify-center">Loading...</div>;

  const totalJobs = categories?.reduce((acc, cat) => acc + cat.count, 0) || 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-10 pb-2">
      {/* "All" Button */}
      <button
        onClick={() => handleCategoryClick()}
        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
          !activeCategory ? 'bg-aventon-accent text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'
        }`}
      >
        All Positions
        <span className="ml-2 opacity-50">({totalJobs})</span>
      </button>

      {/* Dynamic Categories with Icons */}
      {categories?.map((cat: Category) => (
        <button
          key={cat.id}
          onClick={() => handleCategoryClick(cat.name)}
          className={`group flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            activeCategory === cat.name 
              ? 'bg-aventon-dark text-white shadow-lg scale-105' 
              : 'bg-white text-slate-400 border border-slate-200 hover:border-aventon-dark hover:text-aventon-dark'
          }`}
        >
          {/* 🟢 THE ICON ADDITION */}
          <DynamicIcon 
            name={cat.icon} 
            size={14} 
            strokeWidth={2.5}
            className={activeCategory === cat.name ? 'text-white' : 'text-slate-400 group-hover:text-aventon-accent'} 
          />
          
          {cat.name}

          {/* Count Badge */}
          <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${
            activeCategory === cat.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            {cat.count}
          </span>
        </button>
      ))}
    </div>
  );
};