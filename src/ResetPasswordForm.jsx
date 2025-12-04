import React, { useState, useEffect } from 'react';
// Import useNavigate untuk navigasi
import { useSearchParams, useNavigate } from 'react-router-dom';


const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function ResetPasswordForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Hook untuk navigasi

    const token = searchParams.get('token');
    const urlEmail = searchParams.get('email');

    const [email, setEmail] = useState(urlEmail || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token || !urlEmail) {
            setStatusMessage({
                text: 'Tautan reset tidak valid atau hilang. Silakan minta tautan baru.',
                type: 'error'
            });
        }
    }, [token, urlEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage({ text: '', type: '' });

        if (password !== passwordConfirmation) {
            setStatusMessage({ text: 'Konfirmasi password tidak cocok.', type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMessage({ text: data.status + '. Mengarahkan ke Login...', type: 'success' });

                // Gunakan navigate() untuk pindah ke /login setelah 3 detik
                setTimeout(() => {
                    navigate('/login'); // Asumsi rute login Anda adalah /login
                }, 3000);

            } else {
                let errorText = data.message || 'Gagal mengatur ulang password.';
                if (data.errors) {
                    errorText = Object.values(data.errors).flat().join(' | ');
                }
                setStatusMessage({ text: errorText, type: 'error' });
            }
        } catch (error) {
            setStatusMessage({ text: 'Terjadi kesalahan jaringan.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // Tampilan jika token tidak valid
    if (!token || !urlEmail) {
        return (
            <div className="max-w-md w-full mx-auto p-8 bg-red-50 rounded-xl shadow-2xl text-center">
                <h2 className="text-2xl font-bold mb-4 text-red-700">Tautan Tidak Valid</h2>
                <p className="text-red-600 mb-6">{statusMessage.text}</p>
                <button
                    onClick={() => navigate('/login')} // Asumsi rute login Anda adalah /login
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-4"
                >
                    Kembali ke Halaman Login
                </button>
            </div>
        );
    }

    // Tampilan formulir reset password
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Atur Ulang Password</h2>

                {statusMessage.text && (
                    <div
                        className={`p-3 mb-4 rounded-lg text-sm ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        role="alert"
                    >
                        {statusMessage.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email (Tidak dapat diubah)
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password Baru
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !token}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400"
                    >
                        {isLoading ? 'Memproses...' : 'Atur Ulang Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};
