import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

const categories = ["Frontend", "Backend", "Mobile", "Product", "DevOps"];

export const CategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentCategory = searchParams.get('category');

  const handleCategoryClick = (cat: string) => {
    if (location.pathname === '/') {
      // If on Home, JUMP to the jobs page with the filter
      navigate(`/job?category=${cat}`);
    } else {
      // If already on /jobs, just UPDATE the filter in place
      setSearchParams({ category: cat });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 mb-12 flex flex-wrap justify-center gap-3">
      {categories.map((cat) => (
        <button 
          key={cat}
          onClick={() => handleCategoryClick(cat)} // Use the new handler
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${
            currentCategory === cat 
              ? 'bg-aventon-dark text-white border-aventon-dark' 
              : 'bg-white text-slate-400 border-slate-100 hover:border-aventon-dark'
          }`}
        >
          {cat}
        </button>
      ))}
      
      {currentCategory && (
        <button 
          onClick={() => setSearchParams({})}
          className="text-[10px] font-black uppercase text-red-500 hover:underline"
        >
          Clear
        </button>
      )}
    </section>
  );
};