import React, { useState, useEffect } from 'react';
// Pastikan path ini sesuai dengan lokasi file service Anda
import { getAdminLevels, updateAdminLevel } from './auth'; 
import { Edit2, Save, X, TrendingUp, DollarSign, Award } from 'lucide-react';

export default function LevelManager() {
    const [levels, setLevels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLevel, setEditingLevel] = useState(null);
    const [notification, setNotification] = useState(null);

    // --- Fetch Data ---
    const fetchLevels = async () => {
        setIsLoading(true);
        try {
            // Memanggil fungsi dari service yang Anda buat
            const data = await getAdminLevels();
            
            // Validasi format data (jaga-jaga jika backend membungkus dalam object 'data')
            const levelsData = Array.isArray(data) ? data : (data.data || []);
            setLevels(levelsData);
        } catch (error) {
            console.error("Gagal mengambil data level:", error);
            showNotification("Gagal memuat data level. Pastikan backend berjalan.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, []);

    // --- Format Currency (IDR) ---
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    // --- Handle Edit Action (Buka Modal) ---
    const handleEditClick = (level) => {
        setEditingLevel({ ...level }); // Copy object agar state utama aman saat mengetik
        setIsModalOpen(true);
    };

    // --- Handle Input Change di Modal ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingLevel(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // --- Handle Save / Submit ---
    const handleSave = async (e) => {
        e.preventDefault();
        
        // Validasi Sederhana
        if (!editingLevel.name || editingLevel.min_total_earnings < 0 || editingLevel.bonus_percentage < 0) {
            showNotification("Data tidak valid. Cek kembali input Anda.", "error");
            return;
        }

        try {
            // Memanggil fungsi update dari service Anda
            // Pastikan format data sesuai dengan yang diharapkan controller Laravel
            await updateAdminLevel(editingLevel.id, {
                name: editingLevel.name,
                min_total_earnings: Number(editingLevel.min_total_earnings), // Pastikan dikirim sebagai number
                bonus_percentage: Number(editingLevel.bonus_percentage)     // Pastikan dikirim sebagai number
            });

            showNotification("Level berhasil diperbarui!", "success");
            setIsModalOpen(false);
            
            // Refresh data tabel untuk memastikan sinkronisasi dengan database
            fetchLevels(); 
        } catch (error) {
            console.error("Update failed:", error);
            const errMsg = error.response?.data?.message || "Gagal memperbarui level.";
            showNotification(errMsg, "error");
        }
    };

    // --- Notification Helper ---
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Award className="w-8 h-8 text-blue-600" />
                    Manajemen Level Pengguna
                </h1>
                <p className="text-gray-500 mt-1">Atur batasan pendapatan dan bonus CPM untuk setiap tingkatan pengguna.</p>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 text-white transition-all transform ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    <div className="flex items-center gap-2">
                        {notification.type === 'success' ? <TrendingUp className="w-5 h-5"/> : <X className="w-5 h-5"/>}
                        {notification.message}
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                /* Table Card */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4 font-semibold">Nama Level</th>
                                    <th className="px-6 py-4 font-semibold">Syarat Pendapatan (Min)</th>
                                    <th className="px-6 py-4 font-semibold">Bonus CPM</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {levels.length > 0 ? (
                                    levels.map((level) => (
                                        <tr key={level.id} className="hover:bg-blue-50 transition-colors duration-150 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg font-bold text-xs shadow-sm">
                                                        LVL {level.id}
                                                    </div>
                                                    <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                                        {level.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-mono">
                                                {formatRupiah(level.min_total_earnings)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    <TrendingUp className="w-3 h-3 mr-1" />
                                                    +{level.bonus_percentage}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleEditClick(level)}
                                                    className="text-gray-400 hover:text-white hover:bg-blue-600 p-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                                                    title="Edit Level"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">
                                            <div className="flex flex-col items-center gap-2">
                                                <Award className="w-10 h-10 text-gray-300" />
                                                <p>Belum ada data level.</p>
                                                <p className="text-xs">Pastikan Anda sudah menjalankan seeder database.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Modal Overlay */}
            {isModalOpen && editingLevel && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        
                        {/* Modal Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Edit2 className="w-4 h-4 text-gray-500" />
                                Edit {editingLevel.name}
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSave} className="p-6  space-y-4">
                            
                            {/* Input: Nama Level */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Level</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingLevel.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Contoh: Gold Member"
                                    required
                                />
                            </div>

                            {/* Input: Min Earnings */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Minimal Pendapatan (Total Earned)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="min_total_earnings"
                                        value={editingLevel.min_total_earnings}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Preview: {formatRupiah(editingLevel.min_total_earnings)}
                                </p>
                            </div>

                            {/* Input: Bonus Percentage */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Bonus CPM (%)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <TrendingUp className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="bonus_percentage"
                                        step="0.1"
                                        value={editingLevel.bonus_percentage}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="5.0"
                                        min="0"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Masukkan angka saja (misal: 5 untuk 5%).</p>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}