import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Input } from '../component/ui/Input';
import axios from 'axios';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Grab the token from the email link
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setStatus('loading');
    try {
      // Your Hono backend call
      await axios.post('/auth/reset-password', { 
        token, 
        password: data.password 
      });
      
      setStatus('success');
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus('error');
    }
  };

  // If someone tries to visit this page without a token, kick them out
  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-10 bg-white rounded-2xl shadow-xl">
        <p className="font-black text-red-500 uppercase">Invalid Reset Link</p>
        <Link to="/login" className="text-[10px] font-black uppercase text-slate-400 mt-4 block">Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 animate-fade-in">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-aventon-dark uppercase tracking-tighter mb-6">
          New Password
        </h2>

        {status === 'success' ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold border border-green-100 animate-bounce">
            Password Updated! Taking you to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input 
              label="New Password"
              type="password"
              {...register("password", { 
                required: "Required", 
                minLength: { value: 8, message: "Min 8 characters" } 
              })}
              error={errors.password?.message as string}
            />

            <Input 
              label="Confirm Password"
              type="password"
              {...register("confirmPassword", { 
                validate: (val) => val === watch('password') || "Passwords don't match" 
              })}
              error={errors.confirmPassword?.message as string}
            />

            {status === 'error' && (
              <p className="text-red-500 text-[10px] font-bold uppercase text-center">
                Link expired or invalid. Please try again.
              </p>
            )}

            <button 
              disabled={status === 'loading'}
              className="w-full bg-aventon-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-opacity-90"
            >
              {status === 'loading' ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};