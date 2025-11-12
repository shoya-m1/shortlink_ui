import { useState, useEffect } from "react";

export default function CreateLink({ token }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [aliasError, setAliasError] = useState("");
  const [alias, setAlias] = useState("");
  const [checkingAlias, setCheckingAlias] = useState(false);
  const [aliasStatus, setAliasStatus] = useState(null);
  // const [checking, setChecking] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adLevel, setAdLevel] = useState(1);
  const [links, setLinks] = useState([]); // ✅ List link milik user
  const [editing, setEditing] = useState(null); // id link yang sedang diedit

  // === Pagination dan Search ===
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;


  // 🔎 Cek alias ke backend (real-time)
  useEffect(() => {
    if (!alias || alias.length < 3) {
      setAliasStatus(null);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setCheckingAlias(true);
        const res = await fetch(`http://127.0.0.1:8000/api/check-alias/${alias}`);
        const data = await res.json();
        setAliasStatus(data.exists ? "taken" : "available");
      } catch (error) {
        console.error("Error checking alias:", error);
      } finally {
        setCheckingAlias(false);
      }
    }, 700); // debounce 700ms

    return () => clearTimeout(delay);
  }, [alias]);

  // ==========================
  // Fetch semua link user
  // ==========================
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const token = sessionStorage.getItem("auth_token");
      const res = await fetch("http://127.0.0.1:8000/api/links", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      console.log(data)
      setLinks(data.data);
    } catch (err) {
      console.error("Gagal memuat links:", err);
    }
  };


  // ==========================
  // Create Link
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortLink("");
    setLoading(true);
    const token = sessionStorage.getItem("auth_token");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          original_url: originalUrl,
          title: title || null,
          password: password || null,
          expired_at: expiresAt || null,
          alias: alias || null,
          ad_level: adLevel,
        }),
      });

      if (!res.ok) throw new Error("Gagal membuat short link");

      const data = await res.json();
      setShortLink(data.short_url);
      fetchLinks(); // refresh list
      setOriginalUrl("");
      setTitle("");
      setPassword("");
      setExpiresAt("");
      setAlias("");
      setAdLevel(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Update Link
  // ==========================
  const handleUpdate = async (link) => {
    const token = sessionStorage.getItem("auth_token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/links/${link.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: link.title,
          password: link.password,
          expired_at: link.expired_at,
          ad_level: link.ad_level,
        }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui link");

      await res.json();
      alert("✅ Link berhasil diperbarui");
      setEditing(null);
      fetchLinks();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan perubahan");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-black shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-6 text-white text-center">
        Buat Shortlink Baru 🔗
      </h2>

      {/* Form Create */}
      <form onSubmit={handleSubmit} className="space-y-5 text-white bg-black p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1">
            Original URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            required
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://contoh.com/artikel..."
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Judul</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Expired</label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Custom Alias (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alias Custom (Opsional)
          </label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value.toLowerCase())}
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


        <div>
          <label className="block text-sm font-medium mb-1">Level Iklan</label>
          <select
            value={adLevel}
            onChange={(e) => setAdLevel(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          >
            {[1, 2, 3, 4, 5].map((lvl) => (
              <option key={lvl} value={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Membuat Link..." : "Buat Shortlink"}
        </button>

        {shortLink && (
          <p className="text-center text-green-600 mt-3">
            ✅ Link berhasil dibuat: <a href={shortLink}>{shortLink}</a>
          </p>
        )}
      </form>

      {/* Daftar Link */}
      <div className="mt-8 bg-black rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Daftar Link Anda 🔗</h3>
        {links.length === 0 ? (
          <p className="text-gray-500">Belum ada link.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2 border">Judul</th>
                <th className="p-2 border">Alias</th>
                <th className="p-2 border">Level</th>
                <th className="p-2 border">Expired</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id} className="border-t">
                  <td className="p-2 border">
                    {editing === link.id ? (
                      <input
                        value={link.title || ""}
                        onChange={(e) =>
                          setLinks((prev) =>
                            prev.map((l) =>
                              l.id === link.id ? { ...l, title: e.target.value } : l
                            )
                          )
                        }
                        className="border px-2 py-1 w-full"
                      />
                    ) : (
                      link.title || "-"
                    )}
                  </td>
                  <td className="p-2 border">{link.code}</td>
                  <td className="p-2 border">
                    {editing === link.id ? (
                      <select
                        value={link.ad_level}
                        onChange={(e) =>
                          setLinks((prev) =>
                            prev.map((l) =>
                              l.id === link.id
                                ? { ...l, ad_level: Number(e.target.value) }
                                : l
                            )
                          )
                        }
                        className="border rounded px-2 py-1"
                      >
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    ) : (
                      `Level ${link.ad_level}`
                    )}
                  </td>
                  <td className="p-2 border">
                    {editing === link.id ? (
                      <input
                        type="date"
                        value={link.expired_at ? link.expired_at.split("T")[0] : ""}
                        onChange={(e) =>
                          setLinks((prev) =>
                            prev.map((l) =>
                              l.id === link.id
                                ? { ...l, expired_at: e.target.value }
                                : l
                            )
                          )
                        }
                        className="border px-2 py-1 w-full"
                      />
                    ) : (
                      link.expired_at?.split("T")[0] || "-"
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    {editing === link.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(link)}
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditing(link.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}