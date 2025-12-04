import React, { useState, useEffect } from 'react';
import {
    getAdminUsers,
    banAdminUser,
    unbanAdminUser,
    getRegistrationSettings, // <-- Import Baru
    updateRegistrationSettings // <-- Import Baru
} from './auth';
import { Layout, Search, Ban, CheckCircle, Loader } from 'lucide-react';
import RegistrationSettingsForm from './components/RegistrationSettingsForm'; // <-- Import Component Baru

export default function AdminUserTest() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // --- STATE REGISTRATION (BARU) ---
    const [registration, setRegistration] = useState({ enabled: true, message: '' });
    const [savingRegistration, setSavingRegistration] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const [usersData, registrationData] = await Promise.all([
                getAdminUsers(page, 10, search),
                getRegistrationSettings()
            ]);

            setUsers(usersData.data);
            setTotalPages(usersData.last_page);
            setRegistration(registrationData);

        } catch (error) {
            console.error("Failed to fetch data", error);
            alert("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const handleBan = async (id) => {
        if (!confirm("Are you sure you want to ban this user?")) return;
        try {
            await banAdminUser(id);
            alert("User banned successfully");
            fetchUsers();
        } catch (error) {
            console.error("Failed to ban user", error);
            alert("Failed to ban user");
        }
    };

    const handleUnban = async (id) => {
        if (!confirm("Are you sure you want to unban this user?")) return;
        try {
            await unbanAdminUser(id);
            alert("User unbanned successfully");
            fetchUsers();
        } catch (error) {
            console.error("Failed to unban user", error);
            alert("Failed to unban user");
        }
    };

    // --- HANDLERS REGISTRATION (BARU) ---
    const handleRegistrationChange = (field, value) => {
        setRegistration(prev => ({ ...prev, [field]: value }));
    };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        setSavingRegistration(true);
        try {
            await updateRegistrationSettings(registration);
            alert("Registration settings updated successfully!");
        } catch (error) {
            console.error("Error update registration settings:", error);
            alert("Failed to update registration settings");
        } finally {
            setSavingRegistration(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl bg-white mx-auto">
            <h1 className="text-2xl font-bold mb-6 flex text-gray-700 items-center gap-2">
                <Layout className="w-6 text-gray-700 h-6" /> Admin User Management Test
            </h1>

            {/* --- FORM REGISTRATION (BARU) --- */}
            <div className="mb-8">
                <RegistrationSettingsForm
                    settings={registration}
                    saving={savingRegistration}
                    onChange={handleRegistrationChange}
                    onSubmit={handleRegistrationSubmit}
                />
            </div>

            {/* Search Bar */}
            <div className="mb-6 flex text-gray-700 gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 text-gray-700 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader className="w-6 h-6 animate-spin text-blue-500" />
                                        <span className="ml-2">Loading users...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No users found.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className={user.is_banned ? "bg-red-50" : ""}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {user.is_banned ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                Banned
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {user.is_banned ? (
                                            <button
                                                onClick={() => handleUnban(user.id)}
                                                className="text-green-600 hover:text-green-900 flex items-center gap-1"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Unban
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleBan(user.id)}
                                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                disabled={user.role === 'admin'} // Prevent banning admins in UI (backend also protects)
                                            >
                                                <Ban className="w-4 h-4" /> Ban
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-600">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
