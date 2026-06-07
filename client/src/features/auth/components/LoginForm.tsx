import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../api/useLogin';
import { Button } from '../../../component/ui/Button';
import { Input } from '../../../component/ui/Input';

// Define the shape for TypeScript
interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  
  // React Hook Form initialization
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        // Redirect to home/job feed after successful login
        navigate('/');
      },
    });
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-aventon-dark uppercase tracking-tighter">
          Welcome Back
        </h2>
        <p className="text-slate-500 text-sm">Login to manage your job listings</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* API Error Message */}
        {loginMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg text-center">
            {loginMutation.error?.message || "Invalid email or password"}
          </div>
        )}

        <Input 
          label="Email Address"
          type="email"
          placeholder="ebun@example.com"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          error={errors.email?.message}
        />

        <div className="space-y-1">
          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
            error={errors.password?.message}
          />
          <div className="flex justify-end px-1">
            <Link 
              to="/forgot-password" 
              className="text-[10px] font-bold text-aventon-dark hover:text-aventon-accent uppercase tracking-wider"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button 
          type="submit" 
          isLoading={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Authenticating...' : 'Sign In'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        New to Aventon? {' '}
        <Link to="/register" className="text-aventon-dark font-black hover:underline decoration-2 underline-offset-4">
          Create Account
        </Link>
      </p>
    </div>
  );
};