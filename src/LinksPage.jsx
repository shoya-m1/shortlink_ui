import { useEffect, useState } from "react";
import LinkFormModal from "./components/LinkFormModal";
import {
    Search, Filter, Calendar, Link as LinkIcon,
    Eye, DollarSign, BarChart2, Lock, Globe,
    MoreHorizontal, Trash2, Edit2, Copy, CheckCircle, XCircle, Power
} from "lucide-react";

export default function LinksPage() {
    const [links, setLinks] = useState([]);
    const [selectedLink, setSelectedLink] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Filters & Pagination
    const [perPage, setPerPage] = useState(10);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [status, setStatus] = useState("");
    const [expiredDate, setExpiredDate] = useState("");

    const fetchLinks = async (page = 1) => {
        const params = new URLSearchParams({
            page,
            per_page: perPage,
            search,
            filter,
            status,
            expired_date: expiredDate,
        });

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/links?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
                },
            });
            const data = await res.json();
            setLinks(data.data);
            setPagination(data);
        } catch (error) {
            console.error("Failed to fetch links:", error);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, [perPage, filter, status, expiredDate]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLinks();
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/links/${id}/toggle-status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                setLinks((prevLinks) =>
                    prevLinks.map((l) =>
                        l.id === id ? { ...l, status: data.status } : l
                    )
                );
            }
        } catch (error) {
            console.error("Error toggle status:", error);
        }
    };

    const handleEdit = (link) => {
        setSelectedLink(link);
        setShowModal(true);
    };

    const handleNew = () => {
        setSelectedLink(null);
        setShowModal(true);
    };

    const handleSaved = () => {
        setShowModal(false);
        fetchLinks();
    };

    // Helper: Calculate CPM
    const calculateCPM = (earned, views) => {
        if (!views || views === 0) return "0.00";
        return ((earned / views) * 1000).toFixed(2);
    };

    // Helper: Format Date
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-20">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Link Management</h1>
                        <p className="text-gray-500 text-sm">Kelola semua shortlink Anda di sini.</p>
                    </div>
                    <button
                        onClick={handleNew}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                    >
                        <LinkIcon className="w-4 h-4" />
                        Buat Link Baru
                    </button>
                </div>

                {/* Filters Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari judul, alias, atau URL..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all"
                        />
                    </form>

                    {/* Filters Group */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 pr-8"
                            >
                                <option value="">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="disabled">Nonaktif</option>
                            </select>
                            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Sort Filter */}
                        <div className="relative">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 pr-8"
                            >
                                <option value="">Terbaru</option>
                                <option value="top_links">Top Views</option>
                                <option value="top_valid">Top Valid Clicks</option>
                                <option value="top_earned">Top Earning</option>
                                <option value="expired">Sudah Expired</option>
                            </select>
                            <BarChart2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Date Filter */}
                        <div className="relative">
                            <input
                                type="date"
                                value={expiredDate}
                                onChange={(e) => setExpiredDate(e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            />
                        </div>
                    </div>
                </div>

                {/* Link Cards List */}
                <div className="space-y-4">
                    {links.map((link) => (
                        <div key={link.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                            {/* Card Header */}
                            <div className="px-6 py-4 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg">
                                        <LinkIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{link.title || "Untitled Link"}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                            <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">/{link.code}</span>
                                            <span>•</span>
                                            <span>{formatDate(link.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Status Badge (Static) */}
                                    <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${link.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {link.status === 'active' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                        {link.status === 'active' ? 'Active' : 'Disabled'}
                                    </div>

                                    <div className="h-4 w-px bg-gray-300 mx-1"></div>

                                    {/* Action Buttons */}
                                    <button
                                        onClick={() => handleToggleStatus(link.id)}
                                        className={`p-2 rounded-lg transition-all ${link.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                        title={link.status === 'active' ? "Disable Link" : "Enable Link"}
                                    >
                                        <Power className="w-4 h-4" />
                                    </button>

                                    <button onClick={() => handleEdit(link)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Ban Alert */}
                            {link.is_banned && (
                                <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex items-start gap-3">
                                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-bold text-red-800">Link ini telah diblokir oleh Admin</h4>
                                        <p className="text-sm text-red-700 mt-1">
                                            <span className="font-semibold">Alasan:</span> {link.ban_reason || "Tidak ada alasan spesifik."}
                                        </p>
                                        {link.admin_comment && (
                                            <p className="text-xs text-red-600 mt-2 bg-red-100/50 p-2 rounded border border-red-200">
                                                <span className="font-semibold">Catatan Admin:</span> {link.admin_comment}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Card Body */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Destination */}
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5" /> Destination Link
                                    </p>
                                    <a href={link.original_url} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline truncate block max-w-[200px]" title={link.original_url}>
                                        {link.original_url}
                                    </a>
                                </div>

                                {/* Expired */}
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Date Expired
                                    </p>
                                    <p className="text-sm text-gray-900">{formatDate(link.expired_at)}</p>
                                </div>

                                {/* Password */}
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                        <Lock className="w-3.5 h-3.5" /> Password
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="password"
                                            value={link.password || ""}
                                            readOnly
                                            className="text-sm bg-gray-50 border-none p-0 w-24 text-gray-500 focus:ring-0"
                                            placeholder="None"
                                        />
                                    </div>
                                </div>

                                {/* Ads Level */}
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                        <BarChart2 className="w-3.5 h-3.5" /> Ads Level
                                    </p>
                                    <p className="text-sm font-semibold text-purple-600">Level {link.ad_level || 1}</p>
                                </div>

                                {/* Stats Row 2 */}
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                        <CheckCircle className="w-3.5 h-3.5" /> Valid Views
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">{link.valid_views || 0}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5" /> Total Earning
                                    </p>
                                    <p className="text-lg font-bold text-green-600">${parseFloat(link.total_earned || 0).toFixed(4)}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                        <BarChart2 className="w-3.5 h-3.5" /> Total Clicks
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">{link.total_views || 0}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5" /> Average CPM
                                    </p>
                                    <p className="text-lg font-bold text-blue-600">${calculateCPM(link.total_earned, link.total_views)}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {links.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <LinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">Belum ada link</h3>
                            <p className="text-gray-500">Buat link pertama Anda untuk mulai mendapatkan penghasilan.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {[...Array(pagination.last_page)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => fetchLinks(i + 1)}
                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${pagination.current_page === i + 1 ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <LinkFormModal
                    link={selectedLink}
                    onClose={() => setShowModal(false)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}