import React, { useEffect, useState } from 'react';
import { ShieldAlert, Trash2, ExternalLink, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import { getAdminReports, deleteAdminReport } from './auth';

export default function AdminReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchReports();
    }, [page]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const data = await getAdminReports({ page });
            setReports(data.data);
            setPagination(data);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus laporan ini?")) return;
        try {
            await deleteAdminReport(id);
            setReports(reports.filter(r => r.id !== id));
        } catch (error) {
            alert("Gagal menghapus laporan.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-20">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <ShieldAlert className="w-7 h-7 text-red-600" />
                            Laporan Penyalahgunaan
                        </h1>
                        <p className="text-gray-500 text-sm">Daftar laporan link bermasalah dari pengguna publik.</p>
                    </div>
                    <button
                        onClick={fetchReports}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Alasan</th>
                                    <th className="px-6 py-4">Link URL</th>
                                    <th className="px-6 py-4">Pelapor</th>
                                    <th className="px-6 py-4">Status Link</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : reports.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            Belum ada laporan masuk.
                                        </td>
                                    </tr>
                                ) : (
                                    reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(report.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                    ${report.reason === 'scam' ? 'bg-red-100 text-red-800' :
                                                        report.reason === 'malware' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {report.reason}
                                                </span>
                                                {report.details && (
                                                    <p className="text-xs text-gray-500 mt-1 truncate max-w-xs" title={report.details}>
                                                        "{report.details}"
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 max-w-xs">
                                                    <a href={report.link_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline truncate block" title={report.link_url}>
                                                        {report.link_url}
                                                    </a>
                                                    <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-900 font-medium">{report.email || 'Anonim'}</div>
                                                <div className="text-xs text-gray-400 font-mono">{report.ip_address}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {report.link ? (
                                                    report.link.is_banned ? (
                                                        <span className="text-red-600 font-bold text-xs flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3" /> BANNED
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-600 font-medium text-xs">Aktif</span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Link tidak ditemukan di sistem</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(report.id)}
                                                    className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Hapus Laporan"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-2">
                            {[...Array(pagination.last_page)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
