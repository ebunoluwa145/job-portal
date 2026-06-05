import { useSearchParams } from 'react-router-dom';
import { useCategories, type Category } from '../features/jobs/api/useCategory';
import { DynamicIcon } from './ui/DynamicIcon';

const iconMap: Record<string, string> = {
  frontend: 'Monitor',
  backend: 'Server',
  fullstack: 'Rocket',
  mobile: 'Smartphone',
  data: 'BarChart3',
  design: 'Palette',
  devops: 'Cloud',
  management: 'Briefcase',
  support: 'Wrench',
  marketing: 'Megaphone',
};

export const CategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: responseData, isLoading } = useCategories();
  
  const activeCategorySlug = searchParams.get('category');

  // 🟢 SAFELY EXTRACT ARRAY: Handles raw arrays or wrapped API envelopes ({ data: [...] })
  const categories: Category[] = Array.isArray(responseData) 
    ? responseData 
    : (responseData as any)?.data || [];

  const handleCategoryClick = (categorySlug?: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categorySlug) {
      newParams.set('category', categorySlug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  if (isLoading) return <div className="animate-pulse flex gap-3 justify-center text-xs font-bold text-slate-400 py-4 uppercase">Loading Filter Bar...</div>;

  // 🟢 Total calculation now works safely over the verified array extraction
  const totalJobs = categories.reduce((acc, cat) => acc + (Number(cat.count) || 0), 0);

  return (
    // 🟢 REDUCED WIDTH: Constrained max boundary width down from max-w-6xl to max-w-4xl
    <div className="w-full max-w-4xl mx-auto px-6 mb-8">
      
      {/* 🟢 REMOVED SCROLL: Changed overflow-x-auto to flex-wrap with a tight center alignment */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2 py-1">
        
        {/* "All" Positions Button */}
        <button
          onClick={() => handleCategoryClick()}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border select-none
            ${!activeCategorySlug 
              ? 'bg-amber-400 text-aventon-dark border-amber-400 shadow-sm font-extrabold' 
              : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
            }`}
        >
          All Positions
          <span className="ml-1.5 opacity-60">({totalJobs})</span>
        </button>

        {/* Dynamic Filter Categories */}
        {categories.map((cat: Category) => {
          const isSelected = activeCategorySlug === cat.slug;
          const lucideIconName = iconMap[cat.icon] || 'Briefcase';

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`group flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border select-none
                ${isSelected 
                  ? 'bg-aventon-dark text-white border-aventon-dark shadow-sm' 
                  : 'bg-white text-slate-400 border border-slate-200 hover:border-aventon-dark hover:text-aventon-dark'
                }`}
            >
              <DynamicIcon 
                name={lucideIconName} 
                size={12} 
                strokeWidth={2.5}
                className={isSelected ? 'text-amber-400' : 'text-slate-400 group-hover:text-aventon-dark'} 
              />
              
              <span>{cat.name}</span>

              {/* Dynamic Count Badge */}
              <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold transition-all
                ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-600'}`}>
                {cat.count || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};