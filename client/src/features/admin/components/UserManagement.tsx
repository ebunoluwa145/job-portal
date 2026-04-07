// src/features/admin/UserManagement.tsx
import { useUsers } from '../api/useUsers';

export const UserManagement = () => {
    const { users, isLoading, deleteUser } = useUsers();

    if (isLoading) return <div className="p-10 text-center">Loading users...</div>;

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                {/* ... table headers ... */}
                <tbody>
                    {users?.map((user: any) => (
                        <tr key={user.id}>
                            <td className="p-4">{user.name} ({user.email})</td>
                            <td className="p-4">{user.role}</td>
                            <td className="p-4 text-right">
                                <button onClick={() => deleteUser(user.id)}>BAN</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};