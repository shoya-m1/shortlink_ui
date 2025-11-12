import { useEffect, useState } from "react";
import { getAdminWithdrawals, updateWithdrawalStatus } from "./auth";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState({});
  const [error, setError] = useState("");

  // 🔹 Pagination states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({ last_page: 1 });

  // 🔹 Ambil data withdrawal (pakai paginasi)
  const fetchWithdrawals = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminWithdrawals(page, perPage);
      console.log(data);
      // Backend diharapkan return format: { data: [...], last_page: n, ... }
      setWithdrawals(data.data);
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
  }, [page, perPage]);

  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await updateWithdrawalStatus(id, status, notes[id] || "");

      // Update data di state tanpa reload seluruh halaman
      setWithdrawals((prev) =>
        prev.map((w) => (w.id === id ? res.withdrawal : w))
      );

      alert(`Status withdrawal berhasil diubah menjadi "${status}"`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan saat memperbarui status.");
    }
  };

  // 🔹 Loading & error handling
  if (loading && withdrawals.length === 0)
    return <div className="p-6">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Manajemen Withdrawal</h1>

      {/* 🔹 Filter jumlah data per halaman */}
      <div className="flex justify-between mb-3 items-center">
        <div>
          <label className="mr-2 font-medium">Tampilkan:</label>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>{loading && <span>Loading...</span>}</div>
      </div>

      {/* 🔹 Tabel data withdrawal */}
      <div className="overflow-x-auto bg-black shadow-lg rounded-xl">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Jumlah</th>
              <th className="p-3 border">Atas Nama</th>
              <th className="p-3 border">Metode Pembayaran</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Catatan Admin</th>
              <th className="p-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              withdrawals.map((w, i) => (
                <tr key={w.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 border">
                    {(page - 1) * perPage + i + 1}
                  </td>
                  <td className="p-3 border">{w.user?.name || "—"}</td>
                  <td className="p-3 border">{w.amount}</td>
                  <td className="p-3 border">
                    {w.payment_method?.account_name || "—"}
                  </td>
                  <td className="p-3 border">
                    {`${w.payment_method?.method_type || "-"} - ${
                      w.payment_method?.account_number || "-"
                    }`}
                  </td>
                  <td className="p-3 border text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        w.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : w.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : w.status === "paid"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <textarea
                      placeholder="Tulis catatan..."
                      className="border rounded-md w-full p-2 text-sm"
                      value={notes[w.id] || w.notes || ""}
                      onChange={(e) => handleNoteChange(w.id, e.target.value)}
                    />
                  </td>
                  <td className="p-3 border text-center">
                    {w.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(w.id, "approved")
                          }
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(w.id, "rejected")
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {w.status === "approved" && (
                      <button
                        onClick={() => handleUpdateStatus(w.id, "paid")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Tandai Sudah Dibayar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination Navigasi */}
      <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ← Prev
        </button>

        {Array.from({ length: pagination.last_page || 1 }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, pagination.last_page || 1))
          }
          disabled={page === pagination.last_page}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
