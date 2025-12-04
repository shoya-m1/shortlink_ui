import api from './api';

const API_URL = "http://localhost:8000/api";

// ... existing code ...

// ✅ Register (endpoint sama, tapi sekarang pakai Breeze controller)
export async function loginUser(formData) {
    const response = await api.post("/api/login", formData);

    console.log(response);

    if (response.data.token) {
        // ✅ Simpan token
        sessionStorage.setItem('auth_token', response.data.token);

        // ✅ Filter data user (double safety)
        const safeUser = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role, // ✅ Store role
            // avatar: response.data.user.avatar || null,
            // ❌ JANGAN simpan password, balance, tokens, dll
        };

        sessionStorage.setItem('id', JSON.stringify(response.data.user.id));
        sessionStorage.setItem('user', JSON.stringify(safeUser)); // ✅ Store user object
    }

    return response;
}

// ... existing code ...

// --- Super Admin Services ---

export async function getAdmins() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get('/api/super-admin/admins', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function createAdmin(data) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.post('/api/super-admin/admins', data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function updateAdmin(id, data) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.put(`/api/super-admin/admins/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function deleteAdmin(id) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.delete(`/api/super-admin/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getWithdrawalLogs(page = 1, perPage = 10) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get(`/api/super-admin/withdrawal-logs?page=${page}&per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}


const getAuthHeaders = () => {
    const token = sessionStorage.getItem("auth_token");
    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export async function registerUser(formData) {
    const response = await api.post("/api/register", formData);

    if (response.data.token) {
        sessionStorage.setItem('auth_token', response.data.token);

        // ✅ Filter data
        const safeUser = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            // avatar: response.data.user.avatar || null,
        };

        sessionStorage.setItem('user', JSON.stringify(safeUser));
    }

    return response;
}

// ✅ Logout (endpoint sama)
export async function logoutUser() {
    try {
        await api.post("/api/logout");
    } finally {
        // tokens are stored in sessionStorage elsewhere in this file,
        // use the same storage to avoid inconsistencies that can cause 401s
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user');
    }
}

// ✅ BONUS: Password reset (gratis dari Breeze!)
export async function forgotPassword(email) {
    return await api.post("/api/forgot-password", { email });
}

export async function resetPassword(data) {
    // data: { token, email, password, password_confirmation }
    return await api.post("/api/reset-password", data);
}

// ✅ Change Password (Authenticated)
export async function updatePassword(data) {
    // data: { current_password, password, password_confirmation }
    const token = sessionStorage.getItem('auth_token');
    const response = await api.put("/api/user/password", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function updateProfile(data) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.put("/api/user/profile", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getLoginHistory() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/user/login-history", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// ✅ BONUS: Email verification (gratis dari Breeze!)
export async function resendVerificationEmail() {
    return await api.post("/api/email/verification-notification");
}

export async function getDashboardData() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/user/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getUserLevels() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/user/levels", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// ✅ Tambahkan dua fungsi baru berikut:
export async function getOverviewData(period = 'weekly') {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get(`/api/dashboard/overview?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getTrendsData(period = 'weekly') {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get(`/api/dashboard/trends?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// 1. Service untuk Earnings
export async function getSummaryEarnings(range = 'month') {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get(`/api/analytics/summary/earnings?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// 2. Service untuk Clicks (Valid Clicks)
export async function getSummaryClicks(range = 'month') {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get(`/api/analytics/summary/clicks?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// 3. Service untuk Referrals
export async function getSummaryReferrals(range = 'month') {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get(`/api/analytics/summary/referrals?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// 4. Service untuk CPM
export async function getSummaryCpm(range = 'month') {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get(`/api/analytics/summary/cpm?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// ... import api instance ...

export async function getAnalyticsData(metric = 'clicks', groupBy = 'day', range = 'month') {
    const token = sessionStorage.getItem('auth_token');
    // Mengirim parameter via query string
    const response = await api.get(`/api/analytics/chart`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            metric: metric,
            group_by: groupBy,
            range: range
        }
    });
    return response.data;
}

// Service untuk Top Countries
export async function getTopCountries(range = 'month') {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get(`/api/analytics/top-countries`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { range, limit: 5 } // Limit 5 agar pas di UI card
    });
    return response.data;
}

// Service untuk Top Referrers
export async function getTopReferrers(range = 'month') {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get(`/api/analytics/top-referrers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { range, limit: 5 }
    });
    return response.data;
}

export async function getAdminOverviewData() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/admin/dashboard/overview", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getAdminTrendsData() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/admin/dashboard/trends", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// Mengambil semua data level
export async function getAdminLevels() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/admin/levels", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// Update data level (misal: ubah persentase bonus atau min earning)
export async function updateAdminLevel(id, data) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.put(`/api/admin/levels/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// export async function getAdminWithdrawal(page = 1, perPage = 10) {
//     const token = sessionStorage.getItem('auth_token');
//     const response = await api.get(`/api/admin/withdrawals?page=${page}&per_page=${perPage}`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
// }

export async function getAdminWithdrawals(page = 1, perPage = 10, status = "", search = "") {
    const params = new URLSearchParams({
        page: page,
        per_page: perPage,
    });

    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const response = await fetch(`${API_URL}/admin/withdrawals?${params.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Gagal mengambil data withdrawal");
    }

    return response.json();
}

// ===== auth.js =====

// GET: semua withdrawal
// export async function getAdminWithdrawal() {
//     const token = sessionStorage.getItem('auth_token');
//     const res = await fetch("http://localhost:8000/api/admin/withdrawals", {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//         },
//     });

//     if (!res.ok) throw new Error("Gagal memuat data withdrawal");
//     return await res.json();
// }

// PUT: update status withdrawal
export async function updateWithdrawalStatus(id, status, notes = "") {
    const token = sessionStorage.getItem('auth_token');
    const res = await fetch(`http://localhost:8000/api/admin/withdrawals/${id}/status`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal memperbarui status");
    }

    return await res.json();
}

export async function getDataLinksByAdmin() {
    const token = sessionStorage.getItem('auth_token');
    const res = await fetch("http://localhost:8000/api/admin/links", {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Gagal mengambil data link");
    return await res.json();
}


export async function updateLinksByAdmin(id, status, admin_comment = "") {
    const token = sessionStorage.getItem('auth_token');
    const res = await fetch(`http://localhost:8000/api/admin/links/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, admin_comment }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal memperbarui link");
    }

    return await res.json();
}

export async function deleteLinksByAdmin(id) {
    const token = sessionStorage.getItem('auth_token');
    const res = await fetch(`http://localhost:8000/api/admin/links/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal menghapus data link");
    }

    return await res.json();
}

// GET: semua link milik user (akses admin)
// GET: semua link milik user (akses admin)
export async function getAdminLinks(page = 1, perPage = 10, search = "", isBanned = "", sortBy = "newest") {
    const token = sessionStorage.getItem("auth_token");
    const params = new URLSearchParams({
        page,
        per_page: perPage,
        sort_by: sortBy
    });
    if (search) params.append('search', search);
    if (isBanned !== "") params.append('is_banned', isBanned);

    const res = await fetch(`http://localhost:8000/api/admin/links?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Gagal memuat data link");
    return await res.json();
}


// PUT: update status dan/atau komentar link
export async function updateAdminLink(id, data) {
    const token = sessionStorage.getItem("auth_token");
    const res = await fetch(`http://localhost:8000/api/admin/links/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal memperbarui link");
    }

    return await res.json();
}

// DELETE: hapus link
export async function deleteAdminLink(id) {
    const token = sessionStorage.getItem("auth_token");
    const res = await fetch(`http://localhost:8000/api/admin/links/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal menghapus link");
    }

    return await res.json();
}

// POST: Bulk Ban Links
export async function bulkBanLinks(data) {
    const token = sessionStorage.getItem("auth_token");
    const res = await fetch(`http://localhost:8000/api/admin/links/bulk-ban`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal melakukan bulk ban");
    }

    return await res.json();
}

export async function getAdRates() {
    const token = sessionStorage.getItem('auth_token');
    // Panggil endpoint: GET /api/admin/settings/ad-rates
    const response = await api.get("/api/admin/settings/ad-rates", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

/**
 * Mengupdate data tarif iklan (CPC) per negara
 * @param {Object} data - { country, level_1, level_2, level_3, level_4 }
 */
export async function updateAdRates(data) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.put("/api/admin/settings/ad-rates", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

/**
 * Menghapus tarif negara
 * DELETE /api/admin/settings/ad-rates/{country}
 */
export async function deleteCountryRate(country) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.delete(`/api/admin/settings/ad-rates/${country}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

/**
 * Menambahkan tarif negara baru
 * POST /api/admin/settings/ad-rates
 */
export async function addCountryRate(data) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.post("/api/admin/settings/ad-rates", data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

/**
 * Menambahkan Level Iklan Baru (Global)
 * POST /api/admin/settings/ad-rates/level
 */
export async function addAdLevelColumn() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.post("/api/admin/settings/ad-rates/level", {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

/**
 * Menghapus Level Iklan (Global)
 * DELETE /api/admin/settings/ad-rates/level/{key}
 */
export async function deleteAdLevelColumn(key) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.delete(`/api/admin/settings/ad-rates/level/${key}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export async function getReferralSettings() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/admin/settings/referral", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function updateReferralSettings(data) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.put("/api/admin/settings/referral", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getReferralStats() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/referrals", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getDailyWithdrawalStats(startDate, endDate) {
    const token = sessionStorage.getItem('auth_token');
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await api.get("/api/admin/withdrawals/daily-stats", {
        headers: { Authorization: `Bearer ${token}` },
        params
    });
    return response.data;
}

export async function getWithdrawalSettings() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/admin/settings/withdrawal", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function updateWithdrawalSettings(payload) {
    const token = sessionStorage.getItem('auth_token');
    // Payload: { min_amount: 5.0 }
    const response = await api.put("/api/admin/settings/withdrawal",
        payload,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
}

export async function getBankFees() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/admin/settings/bank-fees", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

/**
 * Mengupdate daftar biaya admin
 * PUT /api/admin/settings/bank-fees
 * Payload: { fees: { "BCA": 6000, "JAGO": 0 } }
 */
export async function updateBankFees(payload) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.put("/api/admin/settings/bank-fees",
        { fees: payload },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
}

export async function getRegistrationSettings() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/admin/settings/registration", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function updateRegistrationSettings(payload) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.put("/api/admin/settings/registration",
        payload,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
}

export async function getNotificationSettings() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/admin/settings/notification", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function updateNotificationSettings(data) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.put("/api/admin/settings/notification", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// ===== Report Abuse Functions =====
export async function submitReport(data) {
    const response = await api.post("/api/report", data);
    return response.data;
}

export async function getAdminReports(params = {}) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });
    return response.data;
}

export async function deleteAdminReport(id) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.delete(`/api/admin/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}
// ===== Notification Functions =====

export async function getAllNotifications() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getUnreadCount() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get('/api/notifications/unread', {
        headers: { Authorization: `Bearer ${token}` },
    });
    // Mengembalikan value spesifik agar komponen tidak perlu parsing lagi
    return response.data.unread_count;
}

export async function markAsRead(id) {
    const token = sessionStorage.getItem('auth_token');
    // Parameter kedua axios.post adalah body, kita isi {} kosong
    const response = await api.post(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function markAllAsRead() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.post('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function deleteNotification(id) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}
// --- TAMBAHAN BARU: Fungsi Admin untuk Mengirim Notifikasi ---
export async function sendNotification(payload) {
    const token = sessionStorage.getItem('auth_token');
    // Payload berisi: { title, message, type, url, user_id (opsional) }
    const response = await api.post('/api/admin/notify', payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// --- Admin User Management ---

export async function getAdminUsers(page = 1, perPage = 10, search = "", isBanned = "") {
    const token = sessionStorage.getItem('auth_token');
    const params = new URLSearchParams({
        page,
        per_page: perPage,
    });
    if (search) params.append('search', search);
    if (isBanned !== "") params.append('is_banned', isBanned);

    const response = await api.get(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getAdminUser(id) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function updateAdminUser(id, data) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.put(`/api/admin/users/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function banAdminUser(id) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.patch(`/api/admin/users/${id}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function unbanAdminUser(id) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.patch(`/api/admin/users/${id}/unban`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// --- Dashboard Messages Services ---

// User: Get active messages
export async function getDashboardMessages() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get('/api/dashboard/messages', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// Admin: Get all messages
export async function getAdminDashboardMessages() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get('/api/admin/dashboard-messages', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// Admin: Create message
export async function createDashboardMessage(data) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.post('/api/admin/dashboard-messages', data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// Admin: Update message
export async function updateDashboardMessage(id, data) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.put(`/api/admin/dashboard-messages/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// Admin: Delete message
export async function deleteDashboardMessage(id) {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.delete(`/api/admin/dashboard-messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

// --- Mass Shrinker ---
export const massShortenLink = async (urls, adLevel) => {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.post(`/api/links/mass`, { urls, ad_level: adLevel }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};