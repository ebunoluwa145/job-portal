import React from 'react';
import { type Category } from '../api/useCategory';
import { DynamicIcon } from'../../../component/ui/DynamicIcon'; // Adjust path based on your folder structure

// Safe mapper to resolve database string tokens to official Lucide component exports
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

interface CategoryGridProps {
  categories: Category[];
  activeCategory: string | null; // This should receive the active slug from your state/URL
  onSelectCategory: (slug: string | null) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-16">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-aventon-dark uppercase tracking-tighter">
          Browse by Specialization
        </h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
          Click a block to filter jobs across the pipeline
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories?.map((category) => {
          // Compare active selection using the unique URL slug strings cleanly
          const isSelected = activeCategory === category.slug;
          const lucideIconName = iconMap[category.icon] || 'Briefcase';

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(isSelected ? null : category.slug)}
              className={`flex flex-col items-start p-6 rounded-3xl border text-left transition-all duration-200 cursor-pointer group relative overflow-hidden h-44
                ${isSelected 
                  ? 'border-amber-400 bg-aventon-dark text-white shadow-lg' 
                  : 'border-slate-200/80 bg-white text-aventon-dark hover:border-aventon-dark hover:shadow-sm'
                }`}
            >
              {/* Top Row Layout: Dynamic Icon Wrapper + Count Badge */}
              <div className="flex justify-between items-center w-full mb-4">
                <div className={`p-3 rounded-2xl transition-colors duration-200
                  ${isSelected ? 'bg-white/10 text-amber-400' : 'bg-slate-50 text-slate-700 group-hover:bg-amber-50 group-hover:text-amber-500'}`}
                >
                  <DynamicIcon name={lucideIconName} size={22} strokeWidth={2.5} />
                </div>
                
                {/* 🟢 THE COUNT PILL BADGE */}
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full transition-all duration-200
                  ${isSelected ? 'bg-amber-400 text-aventon-dark' : 'bg-slate-100 text-slate-500 group-hover:bg-aventon-dark group-hover:text-white'}`}
                >
                  {category.count || 0} {category.count === 1 ? 'Job' : 'Jobs'}
                </span>
              </div>

              {/* Category Display Name */}
              <span className="text-xs font-black uppercase tracking-tight leading-snug line-clamp-2 mb-1">
                {category.name}
              </span>

              {/* Bottom Decorative Navigation Context */}
              <span className={`text-[9px] font-bold uppercase tracking-wider mt-auto
                ${isSelected ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-600'}`}
              >
                {isSelected ? 'Active Filter' : 'Explore →'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};