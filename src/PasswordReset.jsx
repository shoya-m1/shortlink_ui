import React, { useState, useEffect } from 'react';
// Import useNavigate untuk navigasi
import { useSearchParams, useNavigate } from 'react-router-dom';

// PASTIKAN ANDA MENGGANTI INI DENGAN URL API LARAVEL ANDA
const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * ===================================================================
 * Komponen Internal 1: ForgotPasswordForm
 * ===================================================================
 */
const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Hook untuk navigasi

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage({ text: '', type: '' });

        try {
            const response = await fetch(`${API_BASE_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (response.ok) {
                setStatusMessage({ text: data.status, type: 'success' });
            } else {
                const errorText = data.email ? data.email[0] : (data.message || 'Permintaan gagal.');
                setStatusMessage({ text: errorText, type: 'error' });
            }
        } catch (error) {
            setStatusMessage({ text: 'Terjadi kesalahan jaringan.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Lupa Password</h2>
                <p className="text-center text-gray-600 mb-6">
                    Masukkan email Anda, kami akan mengirimkan tautan reset.
                </p>

                {statusMessage.text && (
                    <div
                        className={`p-3 mb-4 rounded-lg text-sm ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        role="alert"
                    >
                        {statusMessage.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Alamat Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 text-gray-600 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="contoh@domain.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400"
                    >
                        {isLoading ? 'Memproses...' : 'Kirim Tautan Reset'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    {/* Gunakan navigate() untuk kembali ke login */}
                    <button
                        onClick={() => navigate('/login')} // Asumsi rute login Anda adalah /login
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Kembali ke Halaman Login
                    </button>
                </div>
            </div>
        </div>

    );
};

/**
 * ===================================================================
 * Komponen Internal 2: ResetPasswordForm
 * ===================================================================
 */


/**
 * ===================================================================
 * Komponen UTAMA (Router Mini)
 * Ini adalah komponen yang akan Anda impor
 * ===================================================================
 */
// const PasswordReset = () => {
//     // Cek URL untuk 'token' dan 'email'
//     const [searchParams] = useSearchParams();
//     const token = searchParams.get('token');
//     const email = searchParams.get('email');

//     // Tampilkan <ResetPasswordForm> jika ada token DAN email
//     // Jika tidak, tampilkan <ForgotPasswordForm>
//     const content = (token && email) ? <ResetPasswordForm /> : <ForgotPasswordForm />;

//     return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
//             {content}
//         </div>
//     );
// };

// Tambahkan default export agar import Anda berhasil
export default PasswordReset;