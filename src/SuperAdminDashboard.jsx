import React, { useEffect, useState } from 'react';
import { Users, Shield, Activity } from 'lucide-react';
import { getAdminOverviewData } from './auth';

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAdmins: 0, // Placeholder, backend needs to provide this if needed
        activeUsers: 0
    });

    useEffect(() => {
        // Reuse admin overview for now, or create specific endpoint
        getAdminOverviewData().then(data => {
            setStats({
                totalUsers: data.total_users,
                totalAdmins: 0,
                activeUsers: data.active_users_24h
            });
        }).catch(err => console.error(err));
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">System Status</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">Active</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <Activity className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Security Level</p>
                            <p className="text-2xl font-bold text-indigo-600 mt-1">High</p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <Shield className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Welcome, Super Admin</h2>
                <p className="text-gray-600">
                    You have full access to manage the system, including creating and managing other administrators.
                    Use the sidebar to navigate to the Admin Management section.
                </p>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
