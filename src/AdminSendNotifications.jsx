import React, { useState, useEffect } from 'react';
import { Send, Users, User, Megaphone, AlertCircle, CheckCircle, Loader2, Settings } from 'lucide-react';
import { sendNotification, getNotificationSettings, updateNotificationSettings } from './auth';

export default function SendNotification() {
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

    // State Settings
    const [showSettings, setShowSettings] = useState(false);
    const [defaultExpiry, setDefaultExpiry] = useState(30);
    const [savingSettings, setSavingSettings] = useState(false);

    // State Form
    const [target, setTarget] = useState('all'); // 'all' atau 'specific'
    const [userId, setUserId] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        url: '',
        is_permanent: true,
        expires_in_days: 14
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getNotificationSettings();
            setDefaultExpiry(data.expiry_days);
        } catch (error) {
            console.error("Gagal memuat setting:", error);
        }
    };

    const handleSaveSettings = async () => {
        setSavingSettings(true);
        try {
            await updateNotificationSettings({ expiry_days: defaultExpiry });
            setFeedback({ type: 'success', message: 'Pengaturan default berhasil disimpan.' });
            setShowSettings(false);
        } catch (error) {
            setFeedback({ type: 'error', message: 'Gagal menyimpan pengaturan.' });
        } finally {
            setSavingSettings(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        // Siapkan payload
        const payload = {
            ...formData,
            // Jika target 'specific', kirim user_id. Jika 'all', kirim null.
            user_id: target === 'specific' ? userId : null
        };

        try {
            await sendNotification(payload);

            setFeedback({ type: 'success', message: 'Notifikasi berhasil dikirim ke penerima!' });

            // Reset form jika sukses
            setFormData({
                title: '',
                message: '',
                type: 'info',
                url: '',
                is_permanent: true,
                expires_in_days: 14
            });
            setUserId('');

        } catch (error) {
            console.error("Gagal mengirim:", error);
            const msg = error.response?.data?.message || 'Terjadi kesalahan saat mengirim notifikasi.';
            setFeedback({ type: 'error', message: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen min-w-screen bg-white py-10">
            <div className="max-w-3xl mx-auto p-6 bg-white">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Megaphone className="w-7 h-7 text-indigo-600" />
                            Kirim Notifikasi
                        </h1>
                        <p className="text-gray-500 mt-1">Kirim pesan penting atau pengumuman kepada pengguna aplikasi.</p>
                    </div>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        title="Pengaturan Notifikasi Otomatis"
                    >
                        <Settings className="w-6 h-6" />
                    </button>
                </div>

                {/* Feedback Alert */}
                {feedback && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-medium">{feedback.message}</span>
                    </div>
                )}

                {/* Settings Panel */}
                {showSettings && (
                    <div className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Pengaturan Notifikasi Otomatis
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Atur berapa lama notifikasi sistem (Withdrawal, Ban Link, dll) akan bertahan sebelum dihapus otomatis.
                        </p>
                        <div className="flex items-end gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Default Masa Berlaku (Hari)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={defaultExpiry}
                                    onChange={(e) => setDefaultExpiry(e.target.value)}
                                    className="w-full p-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button
                                onClick={handleSaveSettings}
                                disabled={savingSettings}
                                className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-70"
                            >
                                {savingSettings ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                    <div className="p-6 space-y-6">

                        {/* 1. Target Penerima */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Target Penerima</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setTarget('all')}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${target === 'all'
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <Users className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-semibold text-sm">Semua Pengguna</div>
                                        <div className="text-xs opacity-75">Broadcast massal</div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTarget('specific')}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${target === 'specific'
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-semibold text-sm">Pengguna Spesifik</div>
                                        <div className="text-xs opacity-75">Kirim ke ID tertentu</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Input User ID (Hanya muncul jika specific) */}
                        {target === 'specific' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID Pengguna</label>
                                <input
                                    type="number"
                                    required={target === 'specific'}
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="Masukkan ID User (contoh: 5)"
                                    className="w-full p-2.5 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        )}

                        <div className="border-t border-gray-100 my-4"></div>

                        {/* 2. Detail Pesan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Judul */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Notifikasi</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Contoh: Bonus Akhir Tahun"
                                    className="w-full p-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Tipe / Warna */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Pesan</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="info">Info (Biru)</option>
                                    <option value="success">Success (Hijau)</option>
                                    <option value="warning">Warning (Kuning)</option>
                                    <option value="danger">Danger (Merah)</option>
                                </select>
                            </div>

                            {/* Pesan */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Isi Pesan</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="3"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tulis pesan lengkap di sini..."
                                    className="w-full p-2.5 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                ></textarea>
                            </div>

                            {/* URL Action (Opsional) */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link Tujuan <span className="text-gray-400 font-normal">(Opsional)</span>
                                </label>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full p-2.5 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">User akan diarahkan ke link ini jika mengklik tombol "Lihat Detail".</p>
                            </div>

                            {/* Expiration Controls */}
                            <div className="col-span-2 border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="checkbox"
                                        id="is_permanent"
                                        name="is_permanent"
                                        checked={formData.is_permanent}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="is_permanent" className="text-sm font-medium text-gray-700 select-none">
                                        Notifikasi Permanen (Tidak ada kadaluarsa)
                                    </label>
                                </div>

                                {!formData.is_permanent && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Masa Berlaku (Hari)</label>
                                        <input
                                            type="number"
                                            name="expires_in_days"
                                            min="1"
                                            value={formData.expires_in_days}
                                            onChange={handleChange}
                                            className="w-full md:w-1/2 p-2.5 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Notifikasi akan hilang otomatis setelah {formData.expires_in_days} hari.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Kirim Notifikasi
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </section>

    );
}