import { useEffect, useState } from "react";
import { getAdminWithdrawals, updateWithdrawalStatus } from "./auth";
import { Search, Filter, RefreshCw } from "lucide-react";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState({});
  const [error, setError] = useState("");

  // 🔹 Filter & Search States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔹 Pagination states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({ last_page: 1 });

  // 🔹 Helper Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  // Efek debounce untuk search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 2000);
    return () => clearTimeout(handler);
  }, [search]);

  // Efek reset halaman saat filter status berubah
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);


  // 🔹 Ambil data withdrawal
  const fetchWithdrawals = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminWithdrawals(page, perPage, statusFilter, debouncedSearch);

      setWithdrawals(data.data || []);
      setPagination(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data withdrawal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [page, perPage, statusFilter, debouncedSearch]);

  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Yakin ingin mengubah status menjadi "${status}"?`)) return;

    try {
      const res = await updateWithdrawalStatus(id, status, notes[id] || "");
      // Update optimistic UI
      setWithdrawals((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: status } : w))
      );
      fetchWithdrawals();
      alert(`Status berhasil diubah menjadi "${status}"`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan saat memperbarui status.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📊 Manajemen Withdrawal
        </h1>

        {/* Tombol Refresh */}
        <button
          onClick={fetchWithdrawals}
          className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors border shadow-sm"
          title="Refresh Data"
        >
          <RefreshCw size={18} className={loading ? "animate-spin text-blue-600" : "text-gray-600"} />
        </button>
      </div>

      {/* 🔹 FILTER & SEARCH BAR SECTION */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">

        {/* Search Input */}
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-700" />
          </div>
          <input
            type="text"
            placeholder="Cari ID Transaksi, User, atau Rekening..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 block w-full text-gray-700 rounded-lg border-gray-300 bg-gray-50 border focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-all"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          {/* Filter Status */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 text-gray-700 pr-8 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="pending">🟡 Pending</option>
              <option value="approved">🟢 Approved</option>
              <option value="paid">🔵 Paid</option>
              <option value="rejected">🔴 Rejected</option>
            </select>
          </div>

          {/* Limit Per Page */}
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="block rounded-lg text-gray-700 border-gray-300 bg-gray-50 border focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm cursor-pointer"
          >
            <option value={5}>5 Baris</option>
            <option value={10}>10 Baris</option>
            <option value={25}>25 Baris</option>
            <option value={50}>50 Baris</option>
          </select>
        </div>
      </div>

      {/* 🔹 Tabel Data */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="p-4 border-b">ID Transaksi</th>
              <th className="p-4 border-b">User</th>
              <th className="p-4 border-b">Wajib Transfer</th>
              <th className="p-4 border-b">Biaya Admin</th>
              <th className="p-4 border-b">Info Bank</th>
              <th className="p-4 border-b text-center">Status</th>
              <th className="p-4 border-b">Catatan Admin</th>
              <th className="p-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="8" className="p-10 text-center text-gray-500">Sedang memuat data...</td></tr>
            ) : withdrawals.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-10 text-center text-gray-500 italic">
                  Tidak ada data yang sesuai filter.
                </td>
              </tr>
            ) : (
              withdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 align-top">
                    <div className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit mb-1 border border-blue-100">
                      {w.transaction_id || `TRX-${w.id}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(w.created_at)}
                    </div>
                  </td>

                  <td className="p-4 align-top font-medium text-gray-700">
                    <div className="font-semibold">{w.user?.name || "Unknown User"}</div>
                    <div className="text-xs text-gray-500">{w.user?.email}</div>
                  </td>

                  <td className="p-4 font-medium text-gray-900 align-top">
                    <div className="text-base font-bold">{formatRupiah(w.amount)}</div>
                    <div className="text-xs text-gray-500 mt-1 bg-gray-100 px-1 py-0.5 rounded inline-block">
                      Total Potong: {formatRupiah(parseFloat(w.amount) + parseFloat(w.fee || 0))}
                    </div>
                  </td>

                  <td className="p-4 text-red-600 font-medium align-top">
                    {parseFloat(w.fee) > 0 ? `+ ${formatRupiah(w.fee)}` : <span className="text-green-600">Gratis</span>}
                  </td>

                  <td className="p-4 align-top">
                    <div className="font-bold text-gray-800">
                      {w.payment_method?.bank_name || w.payment_method?.method_type?.toUpperCase()}
                    </div>
                    <div className="text-gray-600 font-mono text-xs mt-1">
                      {w.payment_method?.account_number || "-"}
                    </div>
                    <div className="text-xs text-gray-500 uppercase mt-0.5">
                      A.N {w.payment_method?.account_name || "-"}
                    </div>
                  </td>

                  <td className="p-4 text-center align-top">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${w.status === "pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : w.status === "approved"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : w.status === "paid"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                      {w.status}
                    </span>
                  </td>

                  <td className="p-4 align-top">
                    <textarea
                      placeholder="Catatan transfer..."
                      className="border border-gray-300 rounded-lg w-full p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50 focus:bg-white transition-all"
                      rows={2}
                      value={notes[w.id] !== undefined ? notes[w.id] : (w.notes || "")}
                      onChange={(e) => handleNoteChange(w.id, e.target.value)}
                    />
                  </td>

                  <td className="p-4 align-top">
                    <div className="flex flex-col gap-2">
                      {w.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(w.id, "approved")}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-1"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(w.id, "rejected")}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-1"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                      {w.status === "approved" && (
                        (() => {
                          const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
                          const isLocked = w.processed_by && w.processed_by !== currentUser.id;

                          return isLocked ? (
                            <div className="text-center">
                              <span className="text-xs text-gray-500 italic block mb-1">
                                Diproses oleh admin lain
                              </span>
                              <button
                                disabled
                                className="bg-gray-300 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium cursor-not-allowed flex items-center justify-center gap-1 w-full"
                                title="Hanya admin yang menyetujui yang bisa memproses pembayaran ini"
                              >
                                🔒 Locked
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(w.id, "paid")}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-1 w-full"
                            >
                              💸 Paid
                            </button>
                          );
                        })()
                      )}
                      {w.status === "paid" && (
                        <span className="text-xs text-gray-400 text-center italic py-2">Selesai</span>
                      )}
                      {w.status === "rejected" && (
                        <span className="text-xs text-gray-400 text-center italic py-2">Ditolak</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination Navigasi */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          ← Prev
        </button>

        <span className="text-sm text-gray-600 px-2 bg-white border rounded-lg py-1.5 shadow-sm">
          Halaman <span className="font-bold text-gray-900">{page}</span> dari {pagination.last_page || 1}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, pagination.last_page || 1))}
          disabled={page === (pagination.last_page || 1)}
          className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Next →
        </button>
      </div>
    </div>
  );
}