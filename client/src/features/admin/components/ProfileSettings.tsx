import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { useUsers } from '../api/useUsers'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useChangePassword } from '../../auth/api/useChangePassword'; // Adjust this path to your mutation hook

export const ProfileSettings = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const { user: authUser } = useAuthStore(); 
    
    // Toggle state to open/close the password form section
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Form states for password changes
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localValidationError, setLocalValidationError] = useState('');

    const { users, isLoading } = useUsers({ enabled: !!id }); 
    
    const nameRef = useRef<HTMLInputElement>(null);
    const numberRef = useRef<HTMLInputElement>(null);
    const roleRef = useRef<HTMLSelectElement>(null);

    const user = id 
        ? users?.find((u: any) => u.id === Number(id)) 
        : authUser;

    // Change Password Mutation Hook
    const { 
        mutate: changePassword, 
        isPending: isSavingPassword, 
        error: apiPasswordError, 
        isSuccess: passwordUpdated 
    } = useChangePassword();

    const updateMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            const token = localStorage.getItem('token');
            const url = id 
                ? `${import.meta.env.VITE_API_URL}/users/${id}` 
                : `${import.meta.env.VITE_API_URL}/users/me`;
            
            return await axios.patch(url, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            alert("Account updated successfully!");
        }
    });

    if (id && isLoading) return <div className="p-10 text-center font-black text-slate-400">LOADING...</div>;
    if (!user) return <div className="p-10 text-center font-black text-slate-400">USER NOT FOUND</div>;

    const isSelf = !id || String(id) === String(authUser?.id);
    const isAdmin = authUser?.role === 'admin';

    // Handler to execute password change
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalValidationError('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setLocalValidationError('All password fields are required.');
            return;
        }

        if (newPassword.length < 6) {
            setLocalValidationError('New password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setLocalValidationError('Passwords do not match.');
            return;
        }

        changePassword({ currentPassword, newPassword }, {
            onSuccess: (res) => {
                if (res.success) {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setTimeout(() => setIsChangingPassword(false), 2000);
                }
            }
        });
    };

    const serverPasswordError = (apiPasswordError as any)?.response?.data?.message;

    return (
        <div className="max-w-4xl mx-auto p-6" key={user.id}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        ← {id ? 'Back to Directory' : 'Back to Dashboard'}
                    </button>
                    <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight mt-1">
                        {isSelf ? 'My Account Settings' : 'User Control Panel'}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Information Block */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
                        <div className="h-20 w-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-black text-slate-300">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <h2 className="font-bold text-slate-900 leading-tight">{user.name}</h2>
                        <p className="text-xs text-slate-500 mb-4">{user.email}</p>
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-black uppercase rounded">
                            {user.role === 'employee' ? 'Employer' : user.role}
                        </span>
                    </div>
                </div>

                {/* Forms Layout Area */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 p-4">
                            <h3 className="text-[10px] font-black uppercase text-slate-500">Account Settings</h3>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Full Name</label>
                                    <input 
                                        ref={nameRef}
                                        type="text" 
                                        defaultValue={user.name}
                                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Phone Number</label>
                                    <input 
                                        ref={numberRef}
                                        type="text" 
                                        defaultValue={user.number || ''}
                                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {isAdmin && !isSelf && (
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">User Privilege Role</label>
                                    <select 
                                        ref={roleRef}
                                        defaultValue={user.role} 
                                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-black uppercase focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="user">Standard User</option>
                                        <option value="employee">Employer</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                {/* 🟢 Connected Toggle Trigger */}
                                <button 
                                    type="button"
                                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                                    className={`px-4 py-2 border rounded text-[10px] font-black uppercase transition-all ${isChangingPassword ? 'border-red-200 text-red-600 bg-red-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {isChangingPassword ? 'Cancel Change' : 'Reset Password'}
                                </button>
                                <button 
                                    onClick={() => updateMutation.mutate({
                                        name: nameRef.current?.value,
                                        number: numberRef.current?.value,
                                        ...(isAdmin && !isSelf && { role: roleRef.current?.value })
                                    })}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded text-[10px] font-black uppercase hover:bg-indigo-700"
                                >
                                    {updateMutation.isPending ? 'Updating...' : 'Update Account'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 🟢 Slide down Password Section Block */}
                    {isChangingPassword && (
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-fade-in">
                            <div className="bg-slate-50 border-b border-slate-200 p-4">
                                <h3 className="text-[10px] font-black uppercase text-slate-500">Security Credentials</h3>
                            </div>
                            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Current Password</label>
                                    <input 
                                        type="password"
                                        placeholder="••••••••"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">New Password</label>
                                        <input 
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Confirm New Password</label>
                                        <input 
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Handle Errors cleanly */}
                                {(localValidationError || serverPasswordError) && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">
                                        {localValidationError || serverPasswordError}
                                    </p>
                                )}

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