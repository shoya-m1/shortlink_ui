import { useState, useEffect } from "react";

export default function PwHendler({ code }) {
  const [loading, setLoading] = useState(true);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [showAds, setShowAds] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [token, setToken] = useState(null);

  // 🔹 Ambil token dari backend
  

  // 🔹 Fungsi untuk validasi link
  const handleContinue = async (passwordInput = null) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/links/${code}/continue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: currentToken,
          ...(passwordInput && { password: passwordInput }),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");

      if (data.requires_password) {
        setRequiresPassword(true);
        return;
      }

      if (data.original_url) {
        setRedirectUrl(data.original_url);
        startCountdownBeforeRedirect(data.original_url);
        return;
      }

      setError("Respons tidak valid dari server");
    } catch (err) {
      setError(err.message || "Gagal memproses permintaan");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Countdown sebelum redirect
  const startCountdownBeforeRedirect = (url) => {
    setShowAds(true);
    let counter = 5;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
      counter--;
      if (counter <= 0) {
        clearInterval(timer);
        window.location.href = url;
      }
    }, 1000);
  };

  // 🔹 Submit password
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!token) return setError("Token tidak ditemukan");
    await handleContinue(token, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      {loading && <p className="text-gray-600">Memuat...</p>}
      {error && <p className="text-red-500 bg-red-100 px-3 py-2 rounded-md">{error}</p>}

      {!loading && requiresPassword && (
        <form
          onSubmit={handleSubmitPassword}
          className="flex flex-col gap-3 p-6 bg-white shadow-lg rounded-xl"
        >
          <h2 className="text-lg font-semibold text-gray-700">
            Link ini dilindungi password 🔒
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded-md"
            placeholder="Masukkan password"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Lanjutkan
          </button>
        </form>
      )}
{/* 
      {!loading && showAds && (
        <div className="p-6 bg-white shadow-md rounded-xl text-center">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Iklan sedang ditampilkan...
          </h2>
          <p className="text-gray-600 mb-4">
            Kamu akan diarahkan dalam {countdown} detik ⏳
          </p>
          <div className="flex justify-center gap-3">
            <img src="https://via.placeholder.com/150x100?text=Ads+1" alt="Ads 1" />
            <img src="https://via.placeholder.com/150x100?text=Ads+2" alt="Ads 2" />
          </div>
        </div>
      )} */}
    </div>
  );
}
