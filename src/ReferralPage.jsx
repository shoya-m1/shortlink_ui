import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { getReferralStats } from './auth';

export default function ReferralPage() {
    const [stats, setStats] = useState({
        total_invited: 0,
        total_earnings: 0,
        referral_code: '',
        referral_link: ''
    });
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getReferralStats();
            setStats(data.stats);
            setReferrals(data.referrals.data);
        } catch (error) {
            console.error("Failed to fetch referral data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(stats.referral_link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-6 max-w-6xl mx-auto animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header & Referral Link */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Sistem Referral</h1>
                    <p className="text-gray-500 mb-6">Undang teman dan dapatkan komisi dari setiap penarikan mereka.</p>

                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <ExternalLink className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Link Referral Anda</p>
                                <p className="text-sm font-semibold text-gray-900 break-all">{stats.referral_link}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all w-full sm:w-auto justify-center ${copied
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                        >
                            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Tersalin!' : 'Salin Link'}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Earnings */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-green-100 rounded-xl text-green-600">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Komisi</p>
                            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_earnings)}</h3>
                        </div>
                    </div>

                    {/* Total Invited */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Teman Diundang</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.total_invited} User</h3>
                        </div>
                    </div>
                </div>

                {/* Referral List Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Daftar Teman</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">No</th>
                                    <th className="px-6 py-4">Username</th>
                                    <th className="px-6 py-4">Tanggal Gabung</th>
                                    <th className="px-6 py-4 text-right">Komisi Didapat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {referrals.length > 0 ? (
                                    referrals.map((user, index) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4">{formatDate(user.created_at)}</td>
                                            <td className="px-6 py-4 text-right font-medium text-green-600">
                                                {formatCurrency(user.earnings || 0)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            Belum ada teman yang diundang.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
