import { useForm } from 'react-hook-form';
import { useRegister } from '../api/useRegister';
import { Button } from '../../../component/ui/Button';
import { Input } from '../../../component/ui/Input';
import { Link, useNavigate } from 'react-router-dom';

// Define the shape of our data
interface RegisterFormData {
    name: string;
    email: string;
    number: string;
    role: 'user' | 'employee';
    password: string;
    confirmPassword: string;
}

export const RegisterForm = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
    const registerMutation = useRegister();
    const navigate = useNavigate();

    // The 'watch' function lets us compare password and confirmPassword
    const password = watch("password");

    const onSubmit = (data: RegisterFormData) => {
        // Remove confirmPassword before sending to the backend
        console.log("Registering with:", data)
        const { confirmPassword, ...payload } = data;
        
        registerMutation.mutate(payload, {
            onSuccess: () => {
                navigate('/');
            },
        });
    };

    return (
        <div className="card bg-white p-8 shadow-xl animate-fade-in max-w-lg w-full">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-aventon-dark uppercase tracking-tighter">Create Account</h1>
                <p className="text-gray-500 text-sm">Join Aventon to post or find jobs</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Full Name"
                    {...register("name", { required: "Name is required" })}
                    error={errors.name?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email"
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        error={errors.email?.message}
                    />
                    <Input
                        label="Phone Number"
                        type="tel"
                        {...register("number", { required: "Phone number is required" })}
                        error={errors.number?.message}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-700 uppercase px-1">Register As</label>
                    <select 
                        {...register("role")}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm"
                    >
                        <option value="user">Job Seeker</option>
                        <option value="employee">Employer</option>
                    </select>
                </div>

                <Input
                    label="Password"
                    type="password"
                    {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                    error={errors.password?.message}
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    {...register("confirmPassword", { 
                        required: "Please confirm your password",
                        validate: (value) => value === password || "Passwords do not match"
                    })}
                    error={errors.confirmPassword?.message}
                />

                <Button type="submit" isLoading={registerMutation.isPending}>
                    Register Now
                </Button>

                {registerMutation.isError && (
                    <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                        {registerMutation.error?.message || "Registration failed"}
                    </p>
                )}
            </form>

            <p className="text-center mt-6 text-sm text-gray-600">
                Already have an account? <Link to="/login" className="text-aventon-dark font-bold hover:underline">Sign In</Link>
            </p>
        </div>
    );
};