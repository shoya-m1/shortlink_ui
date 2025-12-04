import { useEffect, useState } from "react";
import {
  getAdminLinks,
  updateAdminLink,
  deleteAdminLink,
  bulkBanLinks
} from "./auth";
import {
  Search, Filter, Calendar, Link as LinkIcon,
  Eye, DollarSign, BarChart2, Lock, Globe,
  MoreHorizontal, Trash2, Edit2, Copy, CheckCircle, XCircle, Power, User, AlertTriangle
} from "lucide-react";

export default function AdminLinksPage() {
  const [links, setLinks] = useState([]);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State untuk pagination & filters
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({ last_page: 1 });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // "" (all), "1" (banned), "0" (active)
  const [sortBy, setSortBy] = useState("newest"); // newest, views, valid_views, earned

  // State untuk Bulk Ban
  const [showBulkBanModal, setShowBulkBanModal] = useState(false);
  const [bulkBanData, setBulkBanData] = useState({
    keyword: "",
    field: "original_url",
    ban_reason: "",
    admin_comment: ""
  });
  const [bulkBanPreview, setBulkBanPreview] = useState(null); // null = belum preview, number = jumlah link

  // Ambil data link dari server
  const loadLinks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminLinks(page, perPage, search, filterStatus, sortBy);
      setLinks(data.data);
      console.log(data)
      setPagination(data);
    } catch (err) {
      setError(err.message || "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, [page, perPage, search, filterStatus, sortBy]);

  // Ubah data input lokal
  const handleEditChange = (id, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Simpan perubahan ke server
  const handleSave = async (id) => {
    const data = editData[id];
    if (!data) return;

    try {
      // Kirim is_banned, ban_reason, admin_comment
      const updated = await updateAdminLink(id, {
        is_banned: data.is_banned,
        ban_reason: data.ban_reason,
        admin_comment: data.admin_comment
      });

      setLinks((prev) =>
        prev.map((l) => (l.id === id ? updated.link : l))
      );
      setEditData((prev) => ({ ...prev, [id]: undefined }));
      alert("Link berhasil diperbarui!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Hapus data
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus link ini?")) return;
    try {
      await deleteAdminLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      alert("Link berhasil dihapus!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Handler Bulk Ban Preview
  const handleBulkBanPreview = async () => {
    try {
      const res = await bulkBanLinks({ ...bulkBanData, dry_run: true });
      setBulkBanPreview(res.count);
      if (res.count === 0) alert("Tidak ditemukan link aktif dengan kata kunci tersebut.");
    } catch (err) {
      alert(err.message);
    }
  };

  // Handler Bulk Ban Execute
  const handleBulkBanExecute = async () => {
    if (!confirm(`Yakin ingin mem-ban ${bulkBanPreview} link ini?`)) return;
    try {
      const res = await bulkBanLinks({ ...bulkBanData, dry_run: false });
      alert(res.message);
      setShowBulkBanModal(false);
      setBulkBanPreview(null);
      setBulkBanData({ keyword: "", field: "original_url", ban_reason: "", admin_comment: "" });
      loadLinks(); // Refresh list
    } catch (err) {
      alert(err.message);
    }
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
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Link Pengguna</h1>
          <p className="text-gray-500 text-sm">Pantau dan kelola link yang dibuat oleh pengguna.</p>
        </div>

        {/* Filter jumlah data per halaman */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Tampilkan:</label>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari judul, kode, URL, atau user..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full text-gray-700 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 pr-8"
            >
              <option value="">Semua Status</option>
              <option value="1">Banned Only</option>
              <option value="0">Active Only</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 pr-8"
            >
              <option value="newest">Terbaru</option>
              <option value="views">Total Views Tertinggi</option>
              <option value="valid_views">Valid Views Tertinggi</option>
              <option value="earned">Pendapatan Tertinggi</option>
            </select>
            <BarChart2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Bulk Ban Button */}
        <button
          onClick={() => setShowBulkBanModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <AlertTriangle className="w-4 h-4" />
          Ban Masal
        </button>
      </div>

      {/* Bulk Ban Modal */}
      {showBulkBanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Ban Link Masal
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cari Berdasarkan</label>
                <select
                  value={bulkBanData.field}
                  onChange={(e) => setBulkBanData({ ...bulkBanData, field: e.target.value })}
                  className="w-full text-gray-700 border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                >
                  <option value="original_url">URL Tujuan (Original URL)</option>
                  <option value="title">Judul Link</option>
                  <option value="code">Kode Link (Short Code)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kata Kunci (Keyword)</label>
                <input
                  type="text"
                  value={bulkBanData.keyword}
                  onChange={(e) => setBulkBanData({ ...bulkBanData, keyword: e.target.value })}
                  className="w-full text-gray-700 border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                  placeholder="Contoh: judi, porn, scam..."
                />
                <p className="text-xs text-gray-500 mt-1">Sistem akan mencari link yang <b>mengandung</b> kata ini.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Ban</label>
                <input
                  type="text"
                  value={bulkBanData.ban_reason}
                  onChange={(e) => setBulkBanData({ ...bulkBanData, ban_reason: e.target.value })}
                  className="w-full text-gray-700 border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                  placeholder="Contoh: Melanggar ToS (Konten Ilegal)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Admin (Opsional)</label>
                <textarea
                  value={bulkBanData.admin_comment}
                  onChange={(e) => setBulkBanData({ ...bulkBanData, admin_comment: e.target.value })}
                  className="w-full text-gray-700 border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                  rows="2"
                  placeholder="Catatan internal..."
                />
              </div>

              {/* Preview Result */}
              {bulkBanPreview !== null && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800">
                  Ditemukan <b>{bulkBanPreview}</b> link aktif yang cocok.
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowBulkBanModal(false);
                  setBulkBanPreview(null);
                  setBulkBanData({ keyword: "", field: "original_url", ban_reason: "", admin_comment: "" });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Batal
              </button>

              {bulkBanPreview === null ? (
                <button
                  onClick={handleBulkBanPreview}
                  disabled={!bulkBanData.keyword || !bulkBanData.ban_reason}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cek Jumlah
                </button>
              ) : (
                <button
                  onClick={handleBulkBanExecute}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Eksekusi Ban ({bulkBanPreview})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && <div className="text-center py-4">Loading data...</div>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Card List */}
      <div className="space-y-4">
        {links.map((link) => {
          const edit = editData[link.id] || {};
          // Fix: Convert boolean true/false to 1/0 for select value
          const isBannedValue = (edit.is_banned ?? link.is_banned) ? 1 : 0;
          const reasonValue = edit.ban_reason ?? link.ban_reason ?? "";
          const commentValue = edit.admin_comment ?? link.admin_comment ?? "";
          const hasChanges = editData[link.id] !== undefined;

          return (
            <div key={link.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${isBannedValue ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-200 hover:shadow-md'}`}>
              {/* Card Header */}
              <div className={`px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${isBannedValue ? 'bg-red-50/50 border-red-100' : 'bg-gray-50/50 border-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${isBannedValue ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {link.title || "Untitled Link"}
                      <span className="font-mono text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">/{link.code}</span>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {link.user?.name || "Guest"}
                      </span>
                      <span>•</span>
                      <span>{formatDate(link.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* User Status Badge (Disabled by User) */}
                  {link.status !== 'active' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1">
                      <Power className="w-3 h-3" /> Disabled by User
                    </span>
                  )}

                  {/* Ban Status Selector */}
                  <div className="relative">
                    <select
                      value={isBannedValue}
                      onChange={(e) =>
                        handleEditChange(link.id, "is_banned", Number(e.target.value))
                      }
                      className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold border focus:ring-2 focus:ring-offset-1 cursor-pointer ${isBannedValue
                        ? 'bg-red-100 text-red-700 border-red-200 focus:ring-red-500'
                        : 'bg-green-100 text-green-700 border-green-200 focus:ring-green-500'
                        }`}
                    >
                      <option value={0}>Active (Safe)</option>
                      <option value={1}>BANNED</option>
                    </select>
                    <AlertTriangle className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isBannedValue ? 'text-red-500' : 'text-green-500'}`} />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Column 1: Link Info & Stats */}
                  <div className="space-y-4 lg:col-span-2">
                    {/* Destination */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" /> Destination Link
                      </p>
                      <a href={link.original_url} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline truncate block w-full" title={link.original_url}>
                        {link.original_url}
                      </a>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Total Clicks</p>
                        <p className="text-lg font-bold text-gray-900">{link.total_views || 0}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <p className="text-xs text-green-600 mb-1">Valid Views</p>
                        <p className="text-lg font-bold text-green-700">{link.valid_views || 0}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 mb-1">Total Earned</p>
                        <p className="text-lg font-bold text-blue-700">${parseFloat(link.total_earned || 0).toFixed(4)}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <p className="text-xs text-purple-600 mb-1">CPM</p>
                        <p className="text-lg font-bold text-purple-700">${calculateCPM(link.total_earned, link.total_views)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Admin Controls */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Admin Controls</h4>

                    {/* Ban Reason (Only if Banned) */}
                    {isBannedValue === 1 && (
                      <div>
                        <label className="text-xs font-medium text-red-700 mb-1 block">Alasan Ban</label>
                        <input
                          type="text"
                          className="w-full text-gray-700 text-sm border-red-300 rounded-md focus:ring-red-500 focus:border-red-500 bg-white"
                          placeholder="Contoh: Spam, Phishing..."
                          value={reasonValue}
                          onChange={(e) =>
                            handleEditChange(link.id, "ban_reason", e.target.value)
                          }
                        />
                      </div>
                    )}

                    {/* Admin Comment */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Komentar Admin (Internal/Notif)</label>
                      <textarea
                        rows="2"
                        className="w-full text-gray-700 text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Catatan untuk user atau internal..."
                        value={commentValue}
                        onChange={(e) =>
                          handleEditChange(link.id, "admin_comment", e.target.value)
                        }
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleSave(link.id)}
                        disabled={!hasChanges}
                        className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-colors ${hasChanges
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        {hasChanges ? 'Simpan Perubahan' : 'Tidak ada perubahan'}
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors"
                        title="Hapus Link Permanen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Navigasi */}
      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        <div className="flex gap-1">
          {Array.from({ length: pagination.last_page }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === i + 1
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, pagination.last_page))
          }
          disabled={page === pagination.last_page}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
