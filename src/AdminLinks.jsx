import { useEffect, useState } from "react";
import {
  getAdminLinks,
  updateAdminLink,
  deleteAdminLink,
} from "./auth";

export default function AdminLinksPage() {
  const [links, setLinks] = useState([]);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State untuk pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({ last_page: 1 });

  // Ambil data link dari server
  const loadLinks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminLinks(page, perPage);
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
  }, [page, perPage]);

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
      const updated = await updateAdminLink(id, data.status, data.admin_comment);
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

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manajemen Link Pengguna</h1>

      {/* Filter jumlah data per halaman */}
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

      {/* Tabel data */}
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-900">
            <tr>
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">User</th>
              <th className="border px-3 py-2">URL</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Komentar Admin</th>
              <th className="border px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link, i) => {
              const edit = editData[link.id] || {};
              const statusValue = edit.status ?? link.status;
              const commentValue =
                edit.admin_comment ?? link.admin_comment ?? "";

              return (
                <tr key={link.id}>
                  <td className="border px-3 py-2">
                    {(page - 1) * perPage + i + 1}
                  </td>
                  <td className="border px-3 py-2">
                    {link.user?.name || "-"}
                  </td>
                  <td className="border px-3 py-2 break-all">
                    {link.original_url || link.title}
                  </td>
                  <td className="border px-3 py-2">
                    <select
                      value={statusValue}
                      onChange={(e) =>
                        handleEditChange(link.id, "status", e.target.value)
                      }
                      className="border p-1 rounded"
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </td>
                  <td className="border px-3 py-2">
                    <textarea
                      rows="2"
                      className="border p-1 w-full rounded"
                      value={commentValue}
                      onChange={(e) =>
                        handleEditChange(
                          link.id,
                          "admin_comment",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => handleSave(link.id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Pagination Navigasi */}
      <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ← Prev
        </button>

        {Array.from({ length: pagination.last_page }, (_, i) => (
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
            setPage((p) => Math.min(p + 1, pagination.last_page))
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
