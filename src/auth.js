import api from './api';

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
      // avatar: response.data.user.avatar || null,
      // ❌ JANGAN simpan password, balance, tokens, dll
    };

    sessionStorage.setItem('id', JSON.stringify(response.data.user.id));
  }

  return response;
}

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
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
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

// ✅ Tambahkan dua fungsi baru berikut:
export async function getOverviewData() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/dashboard/overview", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getTrendsData() {
    const token = sessionStorage.getItem('auth_token');
    const response = await api.get("/api/dashboard/trends", {
        headers: { Authorization: `Bearer ${token}` },
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

// export async function getAdminWithdrawal(page = 1, perPage = 10) {
//     const token = sessionStorage.getItem('auth_token');
//     const response = await api.get(`/api/admin/withdrawals?page=${page}&per_page=${perPage}`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
// }

export async function getAdminWithdrawal(page = 1, perPage = 10) {
  const token = sessionStorage.getItem("auth_token");
  const res = await fetch(`http://localhost:8000/api/admin/withdrawals?page=${page}&per_page=${perPage}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Gagal memuat data link");
  return await res.json();
}

// ===== auth.js =====

// GET: semua withdrawal
export async function getAdminWithdrawals() {
    const token = sessionStorage.getItem('auth_token');
    const res = await fetch("http://localhost:8000/api/admin/withdrawals", {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Gagal memuat data withdrawal");
    return await res.json();
}

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
export async function getAdminLinks(page = 1, perPage = 10) {
  const token = sessionStorage.getItem("auth_token");
  const res = await fetch(`http://localhost:8000/api/admin/links?page=${page}&per_page=${perPage}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Gagal memuat data link");
  return await res.json();
}


// PUT: update status dan/atau komentar link
export async function updateAdminLink(id, status, admin_comment = "") {
    const token = sessionStorage.getItem("auth_token");
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
