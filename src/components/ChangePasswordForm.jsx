import { useState, useEffect } from "react";
import { updatePassword, getDashboardData } from "../auth";

export default function ChangePasswordForm() {
    const [formData, setFormData] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [hasPassword, setHasPassword] = useState(true); // Default true agar aman

    useEffect(() => {
        // Cek apakah user punya password (via API dashboard/profile)
        const checkUserPassword = async () => {
            try {
        const response = await getDashboardData(); 
        // Structure: { source: 'cache', data: { user: { has_password: ... } } }
        const userData = response.data?.user;
        
        if (userData && typeof userData.has_password !== 'undefined') {
            setHasPassword(userData.has_password);
        }
            } catch (err) {
                console.error("Gagal memuat data user", err);
            }
        };
        checkUserPassword();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            // Hapus current_password dari payload jika user belum punya password
            const payload = { ...formData };
            if (!hasPassword) {
                delete payload.current_password;
            }

            await updatePassword(payload);
            setMessage("Password berhasil diperbarui!");
            setFormData({
                current_password: "",
                password: "",
                password_confirmation: "",
            });
            // Setelah sukses set password, user sekarang punya password
            setHasPassword(true);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memperbarui password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                {hasPassword ? "Ganti Password" : "Buat Password Baru"}
            </h2>

            {message && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    {message}
                </div>
            )}

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {hasPassword && (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Password Saat Ini</label>
                        <input
                            type="password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleChange}
                            className="w-full border text-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Password Baru</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-2 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={8}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Konfirmasi Password Baru</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="w-full border p-2 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Menyimpan..." : "Simpan Password"}
                </button>
            </form>
        </div>
    );
}
