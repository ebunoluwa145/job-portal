import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Input } from '../component/ui/Input'; // Adjust path if needed
import { useForgotPassword } from '../features/auth/api/useForgotPassword';

interface ForgotForm {
  email: string;
}

export const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>();
  const { mutate, isPending, isError, error } = useForgotPassword();


const onSubmit = (data: ForgotForm) => {
    console.log("🚀 onSubmit triggered with:", data);
    
    // CALL THE BACKEND HERE
    mutate(data.email, {
      onSuccess: (response) => {
        console.log("✅ Backend responded:", response);
        setSent(true);
      },
      onError: (err) => {
        console.error("❌ API Error:", err);
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20 animate-fade-in">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-aventon-dark uppercase tracking-tighter mb-2">
          Reset Password
        </h2>
        
        {!sent ? (
          <>
            <p className="text-slate-500 text-sm mb-8">
              Enter your email and we'll send you a link to get back into your account.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input 
                label="Email Address"
                type="email"
                placeholder="ebun@example.com"
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })}
                error={errors.email?.message || (error as any)?.response?.data?.message}
              />

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-aventon-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50"
            >
                {isPending ? 'Sending...' : 'Send Reset Link'}
            </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-bold border border-green-100">
              Link Sent! Check your email to continue.
            </div>
            <Link to="/login" className="text-aventon-dark font-black text-[10px] uppercase hover:underline">
              Back to Login
            </Link>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <Link to="/login" className="text-slate-400 font-bold text-[10px] uppercase hover:text-aventon-dark transition-colors">
            Remembered? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};