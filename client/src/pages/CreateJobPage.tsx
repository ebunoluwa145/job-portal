import { useForm } from 'react-hook-form';
import { Input } from '../component/ui/Input';
import { useCreateJob } from '../features/jobs/api/useCreateJob';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../features/jobs/api/useCategory';



interface JobFormValues {
  title: string;
  company: string;
  location: string;
  salary?: string;
  categoryId: string;
  jobType: string;
  link?: string;
  description: string;
  isFeatured?:boolean
}

export const CreateJobPage = () => {
    
  const { register, handleSubmit, formState: { errors } } = useForm<JobFormValues>();
  const { mutate, isPending } = useCreateJob();
  const navigate = useNavigate();
  const { data: categories } = useCategories();

  const onSubmit = (data: JobFormValues) => {
    mutate(data, {
      onSuccess: () => navigate('/'), // Send them to the feed after posting
    });
  };

  console.log("Categories from server:", categories);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-10 rounded-3xl shadow-xl border border-slate-50">
        <h2 className="text-3xl font-black text-aventon-dark uppercase tracking-tighter mb-8">Post New Vacancy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Job Title" {...register("title", { required: "Title is required" })} error={errors.title?.message} />
          <Input label="Company Name" {...register("company", { required: "Company is required" })} error={errors.company?.message} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Location (City/State)" {...register("location", { required: "Location is required" })} error={errors.location?.message} />
          <Input label="Salary (Optional)" placeholder="e.g. 200,000" {...register("salary")} />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Category" placeholder="e.g. Tech, Health" {...register("category", { required: "Category is required" })} error={errors.category?.message} />
          <Input label="Job Type" placeholder="Full-time / Remote" {...register("jobType", { required: "Job Type is required" })} error={errors.jobType?.message} />
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Category Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Category</label>
          <select 
            {...register("categoryId", { required: "Please select a category" })}
            className="border rounded-md p-2 bg-white"
          >
            <option value="">Select Category</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id} className='text-black bg-white'>
                  {cat.name}
                </option>
              ))}
          </select>
          {errors.categoryId && <span className="text-red-500 text-xs">{errors.categoryId.message}</span>}
        </div>
        <Input 
          label="Job Type" 
          placeholder="Full-time / Remote" 
          {...register("jobType", { required: "Job Type is required" })} 
          error={errors.jobType?.message} 
        />
        </div>

        <Input label="Application Link (Optional)" placeholder="https://..." {...register("link")} />

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Detailed Description</label>
          <textarea 
            {...register("description", { required: "Description is required" })}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-medium focus:border-aventon-dark outline-none"
          />
          {errors.description && <span className="text-red-500 text-[10px] font-bold uppercase">{errors.description.message as string}</span>}
        </div>
        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border-2 border-amber-100 mb-4 transition-all hover:border-amber-200">
        <div className="flex items-center h-5">
          <input
            id="isFeatured"
            type="checkbox"
            {...register("isFeatured")}
            className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 cursor-pointer accent-amber-500"
          />
        </div>
        <div className="ml-2">
          <label htmlFor="isFeatured" className="text-[11px] font-black uppercase tracking-widest text-amber-900 cursor-pointer">
            Feature this vacancy
          </label>
        </div>
      </div>

        <button 
          disabled={isPending}
          className="w-full bg-aventon-dark text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg disabled:opacity-50"
        >
          {isPending ? 'Publishing...' : 'List Job Now'}
        </button>
      </form>
    </div>
  );
};