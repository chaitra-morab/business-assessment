import React, { useState, useEffect } from 'react';
import { Edit, Trash2, User } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

const UsersTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data.users || []))
            .catch(() => setError('Failed to fetch users'));
    }, []);

    const refreshUsers = async () => {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data.users || []);
    };

    const handleEdit = (user: User) => {
        setEditUser(user);
        setEditForm({ name: user.name, email: user.email });
        setShowEditModal(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;
        setLoading(true);
        await fetch('/api/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editUser.id, name: editForm.name, email: editForm.email })
        });
        setLoading(false);
        setShowEditModal(false);
        setEditUser(null);
        await refreshUsers();
    };

    const handleDelete = async (user: User) => {
        if (!window.confirm(`Delete user ${user.name}?`)) return;
        setLoading(true);
        await fetch(`/api/users?id=${user.id}`, { method: 'DELETE' });
        setLoading(false);
        await refreshUsers();
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6">User Management</h2>
            <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-4 p-3 border border-gray-300 rounded-lg w-full max-w-md focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                    <strong>Error:</strong> {error}
                </div>
            )}
            <div className="overflow-x-auto rounded-xl shadow-inner">
                <table className="w-full whitespace-nowrap bg-white rounded-xl">
                    <thead className="bg-blue-700 text-white">
                        <tr>
                            <th className="p-4 text-left font-semibold text-sm uppercase rounded-tl-xl">ID</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase">Name</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase">Email</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase">Created At</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase rounded-tr-xl">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150">
                                    <td className="p-4">{user.id}</td>
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{
                                        new Date(user.created_at).toLocaleString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit', hour12: true,
                                            timeZone: 'Asia/Kolkata'
                                        })
                                    }</td>
                                    <td className="p-4">
                                        <button
                                            className="bg-green-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-600 mr-2 flex items-center gap-1"
                                            onClick={() => handleEdit(user)}
                                        >
                                            <Edit size={16} /> Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 flex items-center gap-1"
                                            onClick={() => handleDelete(user)}
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
                        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setShowEditModal(false)}>
                            <Trash2 size={20} />
                        </button>
                        <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2"><User size={22}/> Edit User</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-all duration-200 mt-2"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersTable; 