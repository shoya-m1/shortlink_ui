import React, { useState, useEffect } from 'react';
import { getDailyWithdrawalStats } from './auth';
import { Calendar, DollarSign, RefreshCw } from 'lucide-react';

export default function DailyWithdrawalStats() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await getDailyWithdrawalStats(startDate, endDate);
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch daily stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: 'long',
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    📅 Laporan Pembayaran Harian
                </h1>

                <button
                    onClick={fetchStats}
                    className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors border shadow-sm"
                    title="Refresh Data"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin text-blue-600" : "text-gray-600"} />
                </button>
            </div>

            {/* Filter Date */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Dari Tanggal</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border text-gray-700 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sampai Tanggal</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border text-gray-700 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <button
                    onClick={fetchStats}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm h-[38px]"
                >
                    Terapkan Filter
                </button>
            </div>

            {/* Table Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4 text-center">Total Transaksi</th>
                                <th className="px-6 py-4 text-right">Total Dibayarkan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="3" className="p-8 text-center text-gray-500">Memuat data...</td></tr>
                            ) : stats.length > 0 ? (
                                stats.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {formatDate(item.date)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                                                {item.total_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-green-600">
                                            {formatRupiah(item.total_amount)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="p-8 text-center text-gray-500 italic">Tidak ada data pembayaran pada periode ini.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
