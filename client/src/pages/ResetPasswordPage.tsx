import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams} from 'react-router-dom';
import { Input } from '../component/ui/Input';
import { useResetPassword } from '../features/auth/api/useResetPassword';

interface ResetForm {
  token: string;
  password:  string;
  confirmPassword:  string;
}

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  
  // Automatically grabs ?token=xyz from the URL bar if it's there
  const defaultToken = searchParams.get('token') || '';

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetForm>({
    defaultValues: { token: defaultToken }
  });

  const { mutate, isPending, error } = useResetPassword();
  const newPassword = watch('password');

  const onSubmit = (data: ResetForm) => {
  mutate({
    token: data.token,
    newPassword: data.password // 🟢 Map form field 'password' to backend parameter 'newPassword'
  }, {
    onSuccess: (res) => {
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    }
  });
};

  const apiError = (error as any)?.response?.data?.message;

  return (
    <div className="max-w-md mx-auto mt-20 animate-fade-in px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-aventon-dark uppercase tracking-tighter mb-2">
          New Password
        </h2>

        {!success ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-slate-500 text-sm mb-6">
              Paste your authorization token below along with your new password credentials.
            </p>

            <Input 
              label="Reset Token"
              type="text"
              placeholder="Paste token from wrangler tail logs"
              {...register("token", { required: "Token is required" })}
              error={errors.token?.message || apiError}
            />

            <Input 
              label="New Password"
              type="password"
              placeholder="••••••••"
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 6, message: "Must be at least 6 characters" }
              })}
              error={errors.password?.message}
            />

            <Input 
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword", { 
                required: "Please confirm your password",
                validate: value => value === newPassword || "Passwords do not match"
              })}
              error={errors.confirmPassword?.message}
            />

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-aventon-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-opacity-90"
            >
              {isPending ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-bold border border-green-100">
              Password updated successfully! Redirecting to login...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};