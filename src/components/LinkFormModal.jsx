import { useState, useEffect } from "react";

export default function LinkFormModal({ link, onClose, onSaved }) {
    const [checkingAlias, setCheckingAlias] = useState(false);
    const [aliasStatus, setAliasStatus] = useState(null);
    const [form, setForm] = useState({
        id: link?.id || null,
        original_url: link?.original_url || "",
        title: link?.title || "",
        password: link?.password || "",
        expired_at: link.expired_at ? link.expired_at.split("T")[0].split(" ")[0] : "",
        alias: link?.code || "",
        ad_level: link?.ad_level || 1,
    });

    const originalAlias = link?.code || null;

    // useEffect(() => {
    //     if (link) {
    //         setForm({
    //             original_url: link.original_url || "",
    //             title: link.title || "",
    //             password: link.password || "",
    //             expired_at: link.expired_at ? link.expired_at.split("T")[0].split(" ")[0] : "", // dukung format "YYYY-MM-DD HH:MM:SS"
    //             alias: link.code || "",
    //             ad_level: link.ad_level || 1,
    //         });
    //     }
    // }, [link]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 🔎 Cek alias ke backend (real-time)
    useEffect(() => {
        // Jika alias kosong atau sama seperti alias aslinya (tidak berubah)
        if (!form.alias || form.alias.length < 3 || form.alias === originalAlias) {
            setAliasStatus(null);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                setCheckingAlias(true);
                const res = await fetch(`http://127.0.0.1:8000/api/check-alias/${form.alias}`);
                const data = await res.json();
                setAliasStatus(data.exists ? "taken" : "available");
            } catch (error) {
                console.error("Error checking alias:", error);
            } finally {
                setCheckingAlias(false);
            }
        }, 700);

        return () => clearTimeout(delay);
    }, [form.alias, originalAlias]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("auth_token");

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/links/${link.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal memperbarui link.");

            alert("✅ Link berhasil diperbarui!");
            onSaved(data.link);
            onClose();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-black rounded-xl shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-semibold">✏️ Edit Link</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Original URL */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Original URL</label>
                        <input
                            type="url"
                            name="original_url"
                            value={form.original_url}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="https://contoh.com/artikel..."
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Judul</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Judul link (opsional)"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="text"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Proteksi dengan password (opsional)"
                        />
                    </div>

                    {/* Alias */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alias Custom (Opsional)
                        </label>
                        <input
                            type="text"
                            value={form.alias}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    alias: e.target.value.toLowerCase(),
                                })}
                            placeholder="contoh: promo-oktober"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                        {checkingAlias ? (
                            <p className="text-sm text-gray-500 mt-1">🔍 Memeriksa ketersediaan...</p>
                        ) : aliasStatus === "available" ? (
                            <p className="text-sm text-green-600 mt-1">✅ Alias tersedia!</p>
                        ) : aliasStatus === "taken" ? (
                            <p className="text-sm text-red-600 mt-1">❌ Alias sudah dipakai</p>
                        ) : null}
                    </div>

                    {/* Expiration Date */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Tanggal Kedaluwarsa</label>
                        <input
                            type="date"
                            name="expired_at"
                            value={form.expired_at}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Ad Level */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Level Iklan</label>
                        <select
                            name="ad_level"
                            value={form.ad_level}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="1">Level 1 — (Rp 0.05 / klik)</option>
                            <option value="2">Level 2 — (Rp 0.07 / klik)</option>
                            <option value="3">Level 3 — (Rp 0.10 / klik)</option>
                            <option value="4">Level 4 — (Rp 0.15 / klik)</option>
                            <option value="5">Level 5 — (Rp 0.20 / klik)</option>
                        </select>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
