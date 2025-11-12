import { useEffect, useState } from "react";
import LinkFormModal from "./components/LinkFormModal";

export default function LinksPage() {
    const [links, setLinks] = useState([]);
    const [selectedLink, setSelectedLink] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [perPage, setPerPage] = useState(10);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [status, setStatus] = useState("");

    const fetchLinks = async (page = 1) => {
        const params = new URLSearchParams({
            page,
            per_page: perPage,
            search,
            filter,
            status,
        });

        const res = await fetch(`http://127.0.0.1:8000/api/links?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
            },
        });
        const data = await res.json();
        setLinks(data.data);
        // console.log(data)
        setPagination(data);
    };

    useEffect(() => {
        fetchLinks();
    }, [perPage, filter, status]);

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
            } else {
                console.error("Gagal memperbarui status:", data);
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

    return (
        <div className="p-5 mb-5 bg-black h-screen w-screen text-white">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold">Daftar Shortlink Anda</h2>
                <button
                    onClick={handleNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    + Tambah Link
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 mb-4">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Cari link..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-2 rounded-md border border-gray-700 bg-gray-900 text-white"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 px-3 py-2 rounded-md"
                    >
                        Cari
                    </button>
                </form>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border rounded-md px-2 py-1 bg-gray-900 text-white"
                >
                    <option value="">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="disabled">Nonaktif</option>
                </select>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded-md px-2 py-1 bg-gray-900 text-white"
                >
                    <option value="">Urutkan: Terbaru</option>
                    <option value="top_links">Top Links (Views)</option>
                    <option value="top_earned">Top Earned</option>
                </select>

                <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="border rounded-md px-2 py-1 bg-gray-900 text-white"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                </select>
            </div>

            {/* Tabel */}
            <table className="w-full border-collapse border border-gray-700">
                <thead>
                    <tr className="bg-gray-800 text-left">
                        <th className="border p-2">Alias</th>
                        <th className="border p-2">Judul</th>
                        <th className="border p-2">URL Asli</th>
                        <th className="border p-2">Views</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {links.map((link) => (
                        <tr key={link.id}>
                            <td className="border p-2">{link.code}</td>
                            <td className="border p-2">{link.title}</td>
                            <td className="border p-2 text-blue-400">{link.original_url}</td>
                            <td className="border p-2 text-center">{link.total_views ?? 0}</td>
                            <td className="px-4 py-2 text-center">
                                <button
                                    onClick={() => handleToggleStatus(link.id)}
                                    className={`px-3 py-1 rounded-full text-white ${link.status === "active" ? "bg-green-500" : "bg-gray-400"
                                        }`}
                                >
                                    {link.status === "active" ? "Aktif" : "Nonaktif"}
                                </button>
                            </td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleEdit(link)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    {links.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center p-4 text-gray-500">
                                Belum ada data.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 📄 Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="flex justify-center py-7 w-screen gap-2">
                    {[...Array(pagination.last_page)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => fetchLinks(i + 1)}
                            className={`px-3 py-1 rounded-md ${pagination.current_page === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-700 hover:bg-gray-600"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

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