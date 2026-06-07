// import { useParams, useNavigate } from 'react-router-dom';
// import { useUsers } from '../features/admin/api/useUsers';
// import { useState } from 'react';
// import { useChangePassword } from '../features/auth/api/useChangePassword'; 
// import { useForm } from 'react-hook-form';


// interface ChangePasswordInputs {
//     currentPassword:  string;
//     newPassword:      string;
//     confirmPassword:  string;
// }// Ensure this hook has a get-by-id feature

// export const UserDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const { users } = useUsers(); 


    
//     const [isChangingPassword, setIsChangingPassword] = useState(false);
//     // Find the specific user from the list (or fetch from a specific hook)
//     const user = users?.find((u: any) => u.id === Number(id));

//    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ChangePasswordInputs>();
//     const { mutate: changePassword, isPending: isSavingPassword, error: apiError, isSuccess: passwordUpdated } = useChangePassword();
//     const newPassword = watch('newPassword');

//     if (!user) return <div className="p-10 text-center font-black text-slate-400">USER NOT FOUND</div>;

//     const onPasswordSubmit = (data: ChangePasswordInputs) => {
//         changePassword({
//             currentPassword: data.currentPassword,
//             newPassword: data.newPassword
//         }, {
//             onSuccess: (res) => {
//                 if (res.success) {
//                     reset();
//                     setTimeout(() => setIsChangingPassword(false), 2000);
//                 }
//             }
//         });
//     };

//     const serverErrorMessage = (apiError as any)?.response?.data?.message;
//         <div className="max-w-4xl mx-auto p-6">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-8">
//                 <div>
//                     <button 
//                         onClick={() => navigate(-1)}
//                         className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors"
//                     >
//                         ← Back to Directory
//                     </button>
//                     <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight">
//                         User Control Panel
//                     </h1>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Profile Card */}
//                 <div className="md:col-span-1 space-y-6">
//                     <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
//                         <div className="h-20 w-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-black text-slate-300">
//                             {user.name?.charAt(0) || 'U'}
//                         </div>
//                         <h2 className="font-bold text-slate-900 leading-tight">{user.name}</h2>
//                         <p className="text-xs text-slate-500 mb-4">{user.email}</p>
//                         <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-black uppercase rounded">
//                             {user.role}
//                         </span>
//                     </div>
//                 </div>

//                 {/* Settings Form */}
//                 <div className="md:col-span-2">
//                     <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
//                         <div className="bg-slate-50 border-b border-slate-200 p-4">
//                             <h3 className="text-[10px] font-black uppercase text-slate-500">Account Settings</h3>
//                         </div>
                        
//                         <div className="p-6 space-y-6">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Full Name</label>
//                                     <input 
//                                         type="text" 
//                                         defaultValue={user.name}
//                                         className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Phone Number</label>
//                                     <input 
//                                         type="text" 
//                                         defaultValue={user.number || 'N/A'}
//                                         className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">User Privilege Role</label>
//                                 <select className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-black uppercase focus:outline-none focus:border-indigo-500">
//                                     <option value="user" selected={user.role === 'user'}>Standard User</option>
//                                     <option value="admin" selected={user.role === 'admin'}>Administrator</option>
//                                 </select>
//                             </div>

//                             <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
//                                <button 
//                                     type="button"
//                                     onClick={() => setIsChangingPassword(!isChangingPassword)}
//                                     className={`px-4 py-2 border rounded text-[10px] font-black uppercase transition-all ${isChangingPassword ? 'border-red-200 text-red-600 bg-red-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
//                                 >
//                                     {isChangingPassword ? 'Cancel Change' : 'Change Password'}
//                                 </button>
//                                 <button className="px-4 py-2 bg-indigo-600 text-white rounded text-[10px] font-black uppercase hover:bg-indigo-700">
//                                     Update Account
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };




import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '../features/admin/api/useUsers';
import { useState } from 'react';
import { useChangePassword } from '../features/auth/api/useChangePassword'; 
import { useForm } from 'react-hook-form';

interface ChangePasswordInputs {
    currentPassword:  string;
    newPassword:      string;
    confirmPassword:  string;
}

export const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { users } = useUsers(); 
    
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const user = users?.find((u: any) => u.id === Number(id));

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ChangePasswordInputs>();
    const { mutate: changePassword, isPending: isSavingPassword, error: apiError, isSuccess: passwordUpdated } = useChangePassword();
    const newPassword = watch('newPassword');

    if (!user) return <div className="p-10 text-center font-black text-slate-400">USER NOT FOUND</div>;

    const onPasswordSubmit = (data: ChangePasswordInputs) => {
        changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        }, {
            onSuccess: (res) => {
                if (res.success) {
                    reset();
                    setTimeout(() => setIsChangingPassword(false), 2000);
                }
            }
        });
    };

    const serverErrorMessage = (apiError as any)?.response?.data?.message;

    // 🟢 Fixed: Added the missing return statement here to render the JSX correctly
    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        ← Back to Directory
                    </button>
                    <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight mt-1">
                        User Control Panels
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
                        <div className="h-20 w-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-black text-slate-300">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <h2 className="font-bold text-slate-900 leading-tight">{user.name}</h2>
                        <p className="text-xs text-slate-500 mb-4">{user.email}</p>
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-black uppercase rounded">
                            {user.role}
                        </span>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 p-4">
                            <h3 className="text-[10px] font-black uppercase text-slate-500">Account Settings</h3>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue={user.name}
                                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Phone Number</label>
                                    <input 
                                        type="text" 
                                        defaultValue={user.number || 'N/A'}
                                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">User Privilege Role</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-black uppercase focus:outline-none focus:border-indigo-500">
                                    <option value="user" selected={user.role === 'user'}>Standard User</option>
                                    <option value="admin" selected={user.role === 'admin'}>Administrator</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                               <button 
                                    type="button"
                                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                                    className={`px-4 py-2 border rounded text-[10px] font-black uppercase transition-all ${isChangingPassword ? 'border-red-200 text-red-600 bg-red-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {isChangingPassword ? 'Cancel Change' : 'Change Password'}
                                </button>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded text-[10px] font-black uppercase hover:bg-indigo-700">
                                    Update Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 🟢 Added: The secure change password card inputs matching your styling guidelines */}
                    {isChangingPassword && (
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200">
                            <div className="bg-slate-50 border-b border-slate-200 p-4">
                                <h3 className="text-[10px] font-black uppercase text-slate-500">Update Credentials</h3>
                            </div>
                            <form onSubmit={handleSubmit(onPasswordSubmit)} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Current Password</label>
                                    <input 
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("currentPassword", { required: "Current password is required" })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                    />
                                    {(errors.currentPassword || serverErrorMessage) && (
                                        <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">
                                            {errors.currentPassword?.message || serverErrorMessage}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">New Password</label>
                                        <input 
                                            type="password"
                                            placeholder="••••••••"
                                            {...register("newPassword", { 
                                                required: "New password is required",
                                                minLength: { value: 6, message: "Minimum 6 characters required" }
                                            })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                        {errors.newPassword && (
                                            <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.newPassword.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Confirm New Password</label>
                                        <input 
                                            type="password"
                                            placeholder="••••••••"
                                            {...register("confirmPassword", { 
                                                required: "Please confirm your password",
                                                validate: val => val === newPassword || "Passwords do not match"
                                            })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                </div>

                                {passwordUpdated && (
                                    <div className="bg-green-50 text-green-700 text-[10px] font-black uppercase p-3 rounded border border-green-200">
                                        ✅ Password changed successfully!
                                    </div>
                                )}

                                <div className="pt-2 flex justify-end">
                                    <button 
                                        type="submit"
                                        disabled={isSavingPassword}
                                        className="px-4 py-2 bg-slate-900 text-white rounded text-[10px] font-black uppercase hover:bg-slate-800 disabled:opacity-50"
                                    >
                                        {isSavingPassword ? 'Saving...' : 'Save New Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};