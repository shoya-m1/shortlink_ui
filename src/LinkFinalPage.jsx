import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle, ExternalLink, Clock } from 'lucide-react';

export default function LinkFinalPage() {
    const [status, setStatus] = useState('idle'); // idle, processing, success, error, password_required
    const [message, setMessage] = useState('');
    const [originalUrl, setOriginalUrl] = useState('');
    const [password, setPassword] = useState('');
    const [shortId, setShortId] = useState(null);
    const [token, setToken] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        const id = sessionStorage.getItem("shortlink");
        const storedToken = sessionStorage.getItem("link_token");
        const pwRequired = sessionStorage.getItem("link_pw_required");

        if (!id || !storedToken) {
            setStatus('error');
            setMessage('Sesi tidak valid atau kadaluarsa. Silakan ulangi dari awal.');
            return;
        }

        setShortId(id);
        setToken(storedToken);

        if (pwRequired) {
            setStatus('password_required');
        } else {
            // Auto process if no password needed
            // processLink(id, storedToken); 
            // Optional: User must click button manually
            setStatus('ready');
        }
    }, []);

    const processLink = async (id, currentToken, pw = null) => {
        setStatus('processing');
        setMessage('Memvalidasi link...');

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/links/${id}/continue`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${currentToken}`,
                },
                body: JSON.stringify({
                    token: currentToken,
                    ...(pw && { password: pw })
                }),
            });

            const result = await res.json();

            if (res.status === 429) {
                setStatus('error');
                // Extract remaining time from message if possible, or default
                const waitTime = result.remaining || 5;
                setRemainingTime(waitTime);
                setMessage(`Terlalu cepat! Mohon tunggu ${Math.ceil(waitTime)} detik lagi.`);
                return;
            }

            if (!res.ok) {
                throw new Error(result.error || 'Terjadi kesalahan saat memproses link.');
            }

            // SUCCESS
            setStatus('success');
            setOriginalUrl(result.original_url);
            setMessage('Link berhasil divalidasi!');

            // Open Ad URL if exists
            if (result.ad_url) {
                window.open(result.ad_url, '_blank');
            }

            // Auto redirect to original URL after short delay
            setTimeout(() => {
                window.location.href = result.original_url;
            }, 2000);

        } catch (error) {
            setStatus('error');
            setMessage(error.message);
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        processLink(shortId, token, password);
    };

    const handleManualContinue = () => {
        processLink(shortId, token);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-blue-600 p-3 rounded-full shadow-lg">
                        <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Verifikasi Link
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Langkah terakhir sebelum menuju link tujuan.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">

                    {/* STATUS: READY */}
                    {status === 'ready' && (
                        <div className="text-center">
                            <p className="mb-6 text-gray-700">Link Anda sudah siap. Klik tombol di bawah untuk melanjutkan.</p>
                            <button
                                onClick={handleManualContinue}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
                            >
                                Lanjutkan ke Link <ExternalLink className="ml-2 w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* STATUS: PASSWORD REQUIRED */}
                    {status === 'password_required' && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Link ini dilindungi Password 🔒
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        required
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                        placeholder="Masukkan Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Buka Link
                            </button>
                        </form>
                    )}

                    {/* STATUS: PROCESSING */}
                    {status === 'processing' && (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 animate-pulse">{message}</p>
                        </div>
                    )}

                    {/* STATUS: SUCCESS */}
                    {status === 'success' && (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <ShieldCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Berhasil!</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Mengalihkan Anda ke tujuan...
                                </p>
                                <p className="text-xs text-gray-400 mt-2 break-all">{originalUrl}</p>
                            </div>
                        </div>
                    )}

                    {/* STATUS: ERROR */}
                    {status === 'error' && (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Gagal Membuka Link</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-red-500 font-medium">
                                    {message}
                                </p>
                                {remainingTime > 0 && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>Silakan coba lagi nanti.</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
