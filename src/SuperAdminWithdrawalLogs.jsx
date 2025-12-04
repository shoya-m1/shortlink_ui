import React, { useState, useEffect } from 'react';
import { getWithdrawalLogs } from './auth';
import { Clock, CheckCircle, XCircle, User } from 'lucide-react';

const SuperAdminWithdrawalLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            const data = await getWithdrawalLogs(page);
            setLogs(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                total: data.total
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full flex items-center w-fit"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
            case 'rejected':
                return <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full flex items-center w-fit"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
            case 'paid':
                return <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full flex items-center w-fit"><CheckCircle className="w-3 h-3 mr-1" /> Paid</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Withdrawal Processing Logs</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Transaction ID</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Processed By</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-4 text-center">No logs found</td></tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(log.updated_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-medium text-sm">{log.transaction_id}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{log.user?.name}</td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">
                                        ${parseFloat(log.amount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(log.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-gray-700">
                                            <User className="w-4 h-4 mr-2 text-indigo-500" />
                                            <span className="font-medium">{log.processed_by?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 ml-6">{log.processed_by?.email}</div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {!loading && logs.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                        <button
                            disabled={pagination.current_page === 1}
                            onClick={() => fetchLogs(pagination.current_page - 1)}
                            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <button
                            disabled={pagination.current_page === pagination.last_page}
                            onClick={() => fetchLogs(pagination.current_page + 1)}
                            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminWithdrawalLogs;
