import React, { useState } from 'react';
import { AlertTriangle, Send, CheckCircle, ShieldAlert, Info } from 'lucide-react';
import { submitReport } from './auth';

export default function ReportAbuse() {
    const [formData, setFormData] = useState({
        url: '',
        reason: 'scam',
        email: '',
        details: ''
    });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        try {
            await submitReport(formData);
            setFeedback({
                type: 'success',
                message: 'Laporan Anda telah diterima. Terima kasih telah membantu menjaga keamanan platform kami.'
            });
            setFormData({ url: '', reason: 'scam', email: '', details: '' });
        } catch (error) {
            const msg = error.response?.data?.message || 'Gagal mengirim laporan. Silakan coba lagi.';
            // Handle rate limit specific message
            if (error.response?.status === 429) {
                setFeedback({ type: 'error', message: 'Terlalu banyak percobaan. Silakan coba lagi besok.' });
            } else {
                setFeedback({ type: 'error', message: msg });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-red-100 p-3 rounded-full">
                        <ShieldAlert className="w-10 h-10 text-red-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Laporkan Penyalahgunaan
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Bantu kami memberantas link berbahaya, scam, atau konten ilegal.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">

                    {feedback && (
                        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                            <span className="text-sm font-medium">{feedback.message}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                URL Link yang Dilaporkan <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    id="url"
                                    name="url"
                                    type="url"
                                    required
                                    value={formData.url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/xyz"
                                    className="appearance-none text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                Alasan Pelaporan <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <select
                                    id="reason"
                                    name="reason"
                                    required
                                    value={formData.reason}
                                    onChange={handleChange}
                                    className="block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                >
                                    <option value="scam">Scam / Phishing / Penipuan</option>
                                    <option value="spam">Spam / Iklan Mengganggu</option>
                                    <option value="malware">Malware / Virus</option>
                                    <option value="adult">Konten Dewasa / Ilegal</option>
                                    <option value="copyright">Pelanggaran Hak Cipta</option>
                                    <option value="other">Lainnya</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Anda (Opsional)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    className="appearance-none text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Kami mungkin menghubungi Anda untuk info lebih lanjut.</p>
                        </div>

                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                                Detail Tambahan (Opsional)
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="details"
                                    name="details"
                                    rows="3"
                                    value={formData.details}
                                    onChange={handleChange}
                                    placeholder="Jelaskan kenapa link ini berbahaya..."
                                    className="appearance-none text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Mengirim...' : 'Kirim Laporan'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500 flex items-center gap-1">
                                    <Info className="w-4 h-4" /> Privasi Terjaga
                                </span>
                            </div>
                        </div>
                        <div className="mt-2 text-center text-xs text-gray-500">
                            IP Address Anda akan dicatat untuk mencegah spam.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
