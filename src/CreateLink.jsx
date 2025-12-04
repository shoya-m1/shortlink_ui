import { useState, useEffect } from "react";
import { massShortenLink } from "./auth";

export default function CreateLink({ token }) {
  const [mode, setMode] = useState('single'); // 'single' | 'mass'
  const [massUrls, setMassUrls] = useState("");
  const [massResults, setMassResults] = useState([]);

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

  const handleMassSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMassResults([]);
    setError("");

    try {
      const data = await massShortenLink(massUrls, adLevel);
      setMassResults(data.results);
      fetchLinks(); // refresh list
    } catch (err) {
      console.error(err);
      setError("Gagal memproses mass shrinker.");
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

      {/* Tab Switcher */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setMode('single')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'single' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Single Link
          </button>
          <button
            onClick={() => setMode('mass')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'mass' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Mass Shrinker
          </button>
        </div>
      </div>

      {/* Form Create */}
      <form onSubmit={mode === 'single' ? handleSubmit : handleMassSubmit} className="space-y-5 text-white bg-black p-4 rounded-lg">

        {mode === 'single' ? (
          <>
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
                className="w-full border rounded px-3 py-2 bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Judul</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Expired</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Custom Alias (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Alias Custom (Opsional)
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value.toLowerCase())}
                placeholder="contoh: promo-oktober"
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-white"
              />
              {checkingAlias ? (
                <p className="text-sm text-gray-500 mt-1">🔍 Memeriksa ketersediaan...</p>
              ) : aliasStatus === "available" ? (
                <p className="text-sm text-green-500 mt-1">✅ Alias tersedia!</p>
              ) : aliasStatus === "taken" ? (
                <p className="text-sm text-red-500 mt-1">❌ Alias sudah dipakai</p>
              ) : null}
            </div>
          </>
        ) : (
          // MASS SHRINKER UI
          <div>
            <label className="block text-sm font-medium mb-1">
              Paste Links (Max 20 URLs, satu per baris) <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={10}
              value={massUrls}
              onChange={(e) => setMassUrls(e.target.value)}
              placeholder={`https://link1.com\nhttps://link2.com\nhttps://link3.com`}
              className="w-full border rounded px-3 py-2 bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm"
            ></textarea>
            <p className="text-xs text-gray-400 mt-1">Hanya URL valid yang akan diproses.</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Level Iklan</label>
          <select
            value={adLevel}
            onChange={(e) => setAdLevel(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 bg-gray-900 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {loading ? "Memproses..." : (mode === 'single' ? "Buat Shortlink" : "Mass Shorten")}
        </button>

        {/* RESULT SINGLE */}
        {mode === 'single' && shortLink && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-green-900">
            <p className="text-center text-green-400 font-medium">
              ✅ Link berhasil dibuat!
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <a href={shortLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all">{shortLink}</a>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(shortLink)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* RESULT MASS */}
        {mode === 'mass' && massResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-white">Hasil Mass Shrinker</h3>
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-800">
                  <tr>
                    <th className="px-4 py-3">Original URL</th>
                    <th className="px-4 py-3">Short URL</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {massResults.map((res, idx) => (
                    <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-4 py-3 truncate max-w-[200px]" title={res.original_url}>
                        {res.original_url}
                      </td>
                      <td className="px-4 py-3">
                        {res.error ? (
                          <span className="text-red-500">{res.error}</span>
                        ) : (
                          <a href={res.short_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                            {res.short_url}
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!res.error && (
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(res.short_url)}
                            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white"
                          >
                            Copy
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={() => {
                const allLinks = massResults.filter(r => !r.error).map(r => r.short_url).join('\n');
                navigator.clipboard.writeText(allLinks);
                alert('Semua link berhasil disalin!');
              }}
              className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm"
            >
              Copy All Shortlinks
            </button>
          </div>
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