import { useNavigate } from 'react-router-dom';
import { useUsers } from '../api/useUsers';
import { useAuthStore } from '../../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const UserManagement = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuthStore(); 
    
    // 🟢 1. STRICT ADMIN CHECK: Only enable hook if role is admin
    const isAdmin = authUser?.role === 'admin';

    // Ensure your useUsers hook in useUsers.ts spreads ...options into useQuery!
    const { users, isLoading: adminLoading, deleteUser, isDeleting } = useUsers({
        enabled: isAdmin 
    });

    // 🟢 2. FETCH FRESH PROFILE: This ensures phone number and email show up correctly
    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['my-profile', authUser?.id],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
            const res = await axios.get(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data.data;
        },
        enabled: !!authUser // Run this for both Admin and User to have fresh details
    });

    // Handle loading states based on who is viewing
    const isLoading = isAdmin ? adminLoading : profileLoading;

    if (isLoading) return (
        <div className="p-10 text-center font-black uppercase text-slate-400 animate-pulse">
            Accessing Account Data...
        </div>
    );

    // --- 1. ADMIN VIEW: Full Directory ---
    if (isAdmin) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-[10px] font-black uppercase text-slate-400">
                            <th className="p-4">User Information</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {/* 🟢 3. DEFENSIVE MAPPING: users?.map prevents the crash */}
                        {users?.map((user: any) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-slate-900 leading-tight">{user.name || 'Anonymous'}</div>
                                    <div className="text-[10px] text-slate-500 uppercase">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-3">
                                    <button onClick={() => navigate(`/admin/users/${user.id}`)} className="text-indigo-600 text-xs font-black hover:underline">
                                        EDIT
                                    </button>
                                    <button 
                                        onClick={() => confirm(`Delete ${user.email}?`) && deleteUser(user.id)}
                                        disabled={isDeleting}
                                        className="text-red-500 text-xs font-black hover:underline disabled:opacity-30"
                                    >
                                        DELETE
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // --- 2. USER VIEW: Personal Profile Settings ---
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-4">
                    <h3 className="text-[10px] font-black uppercase text-slate-500">My Account Settings</h3>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                        <div className="h-12 w-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xl">
                            {profile?.name?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{profile?.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase">{profile?.role}</p>
                            <p className="text-[10px] text-slate-500">{profile?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Full Name</label>
                            <input type="text" defaultValue={profile?.name} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Phone Number</label>
                            {/* 🟢 Using profile?.number ensures the value shows up */}
                            <input type="text" defaultValue={profile?.number} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button className="px-6 py-2 bg-slate-900 text-white rounded text-[10px] font-black uppercase hover:bg-indigo-600 transition-all">
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};