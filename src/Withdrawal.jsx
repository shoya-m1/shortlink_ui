import { useEffect, useState } from "react";

export default function Withdrawal() {
  const [methods, setMethods] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk form
  const [amount, setAmount] = useState("");
  const [selectedMethodId, setSelectedMethodId] = useState(""); // Ganti nama biar jelas

  // State data dari backend
  const [minWithdrawal, setMinWithdrawal] = useState(1);
  const [maxWithdrawal, setMaxWithdrawal] = useState(0);
  const [limitCount, setLimitCount] = useState(0);
  const [limitDays, setLimitDays] = useState(1);
  const [userBalance, setUserBalance] = useState(0);

  const [newMethod, setNewMethod] = useState({
    method_type: "",
    account_name: "",
    account_number: "",
    bank_name: "",
  });
  const [editMethod, setEditMethod] = useState(null);

  const token = sessionStorage.getItem("auth_token");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const apiUrl = "http://localhost:8000/api";

  // --- HELPER UNTUK MENGHITUNG FEE ---
  const getSelectedMethodFee = () => {
    const method = methods.find(m => m.id == selectedMethodId);
    return method ? parseFloat(method.fee || 0) : 0;
  };

  const calculateTotalDeduction = () => {
    const val = parseFloat(amount);
    if (isNaN(val)) return 0;
    return val + getSelectedMethodFee();
  };

  // 🔹 Fetch semua metode pembayaran
  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch(`${apiUrl}/payment-methods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMethods(data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  // 🔹 Fetch riwayat withdraw + Data Minimal & Saldo
  const fetchWithdrawals = async (pageNum = 1) => {
    try {
      const res = await fetch(`${apiUrl}/withdrawals?page=${pageNum}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // Jika respons dari Laravel paginate(), data ada di `data` atau `data.data` tergantung controller
      // Asumsi dari kode Anda sebelumnya: data.payouts.data
      const payoutData = data.payouts || data;
      console.log(payoutData)

      setWithdrawals(payoutData.data || []);
      setPage(payoutData.current_page || 1);
      setLastPage(payoutData.last_page || 1);

      // Ambil saldo terbaru (penting agar validasi akurat)
      if (data.balance !== undefined) setUserBalance(parseFloat(data.balance));
      // Ambil settingan minimal wd (jika dikirim backend)
      if (data.min_withdrawal !== undefined) setMinWithdrawal(parseFloat(data.min_withdrawal));
      if (data.max_withdrawal !== undefined) setMaxWithdrawal(parseFloat(data.max_withdrawal));
      if (data.limit_count !== undefined) setLimitCount(parseInt(data.limit_count));
      if (data.limit_days !== undefined) setLimitDays(parseInt(data.limit_days));

    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    }
  };

  // 🔹 Tambah metode pembayaran baru
  const handleAddMethod = async (e) => {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/payment-methods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(newMethod),
    });
    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Payment method added!");
      setNewMethod({ method_type: "", account_name: "", account_number: "", bank_name: "" });
      fetchPaymentMethods();
    } else {
      alert(data.message || "Failed to add method.");
    }
  };

  // 🔹 Ajukan withdraw (UPDATE VALIDASI FEE)
  const handleWithdraw = async (e) => {
    e.preventDefault();

    const reqAmount = parseFloat(amount);
    const fee = getSelectedMethodFee();
    const totalDeduction = reqAmount + fee;

    // 1. Validasi Minimal
    if (reqAmount < minWithdrawal) {
      alert(`Minimal penarikan adalah Rp ${minWithdrawal.toLocaleString()}`);
      return;
    }

    // 2. Validasi Saldo (Nominal + Fee)
    if (totalDeduction > userBalance) {
      alert(`Saldo tidak cukup untuk biaya admin.\nSaldo: ${userBalance}\nTotal Dibutuhkan: ${totalDeduction} (Request: ${reqAmount} + Fee: ${fee})`);
      return;
    }

    const res = await fetch(`${apiUrl}/withdrawals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: reqAmount,
        payment_method_id: selectedMethodId,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      // Tampilkan pesan error detail dari backend jika ada
      const msg = data.errors?.balance?.[0] || data.message || data.error;
      alert(msg);
    } else {
      alert(`Sukses! Penarikan Rp ${reqAmount.toLocaleString()} sedang diproses.`);
      setAmount("");
      fetchWithdrawals();
    }
  };


  // canceled witdrawal
  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Apakah kamu yakin ingin membatalkan penarikan ini?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(`${apiUrl}/withdrawals/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message || "Withdrawal berhasil dibatalkan.");
        fetchWithdrawals();
      } else {
        alert(result.error || "Gagal membatalkan withdrawal.");
      }
    } catch (err) {
      console.error("Error cancelling withdrawal:", err);
      alert("Terjadi kesalahan saat membatalkan withdrawal.");
    }
  };

  // withdrawal Delete
  const withdrawalDelete = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/withdrawals/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message || "Withdrawal berhasil di hapus.");
        fetchWithdrawals();
      } else {
        alert(result.error || "Gagal menghapus withdrawal.");
      }
    } catch (err) {
      console.error("Error deleting withdrawal:", err);
      alert("Terjadi kesalahan saat menghapus withdrawal.");
    }
  };

  // edit method 
  const handleEditMethod = async (e) => {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/payment-methods/${editMethod.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editMethod),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Payment method updated successfully!");
      setEditMethod(null);
      fetchPaymentMethods();
    } else {
      alert(data.message || "Failed to update payment method.");
    }
  };

  // 🔹 Delete method
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this method?")) return;
    const res = await fetch(`${apiUrl}/payment-methods/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      alert("Payment method deleted.");
      fetchPaymentMethods();
    } else {
      alert("Failed to delete.");
    }
  };


  useEffect(() => {
    Promise.all([fetchPaymentMethods(), fetchWithdrawals()]).then(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 bg-gray-50 min-h-screen text-gray-800">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">💸 Withdraw Dashboard</h1>

        <div className="bg-white px-4 py-2 rounded shadow border border-gray-200">
          <span className="text-gray-500 text-sm">Saldo Anda:</span>
          <div className="font-bold text-xl text-green-600">
            Rp {userBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ============ SECTION 2: Withdraw Form (UPDATE UI) ============ */}
      <section className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Tarik Dana</h2>
          <div className="text-sm text-gray-500 space-y-1 mt-1">
            <p>Minimal penarikan: <span className="font-bold text-gray-800">Rp {minWithdrawal.toLocaleString()}</span></p>
            {maxWithdrawal > 0 && (
              <p>Maksimal penarikan: <span className="font-bold text-gray-800">Rp {maxWithdrawal.toLocaleString()}</span></p>
            )}
            {limitCount > 0 && (
              <p>Batas frekuensi: <span className="font-bold text-gray-800">{limitCount} kali</span> setiap <span className="font-bold text-gray-800">{limitDays} hari</span></p>
            )}
          </div>
        </div>

        <form onSubmit={handleWithdraw} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom Kiri: Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
              <select
                value={selectedMethodId}
                onChange={(e) => setSelectedMethodId(e.target.value)}
                required
                className="border rounded p-2 w-full bg-gray-50 focus:bg-white transition-colors"
              >
                <option value="">Pilih Metode</option>
                {methods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.bank_name ? m.bank_name : m.method_type.toUpperCase()} - {m.account_number} ({m.account_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nominal Penarikan (Rp)</label>
              <input
                type="number"
                step="100"
                placeholder={`Min: ${minWithdrawal}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border rounded p-2 w-full"
                required
              />
            </div>
          </div>

          {/* Kolom Kanan: Rincian Biaya (SUMMARY BOX) */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col justify-center space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Rincian Transaksi</h3>

            <div className="flex justify-between text-sm">
              <span>Nominal Diterima:</span>
              <span className="font-medium">Rp {amount ? parseFloat(amount).toLocaleString() : 0}</span>
            </div>

            <div className="flex justify-between text-sm text-red-600">
              <span>Biaya Admin ({selectedMethodId ? 'Ada' : '-'}):</span>
              <span className="font-medium">+ Rp {getSelectedMethodFee().toLocaleString()}</span>
            </div>

            <div className="border-t border-gray-300 my-1 pt-2 flex justify-between text-base font-bold text-gray-900">
              <span>Total Potong Saldo:</span>
              <span>Rp {calculateTotalDeduction().toLocaleString()}</span>
            </div>

            <button
              type="submit"
              disabled={!selectedMethodId || !amount}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              Ajukan Penarikan
            </button>
          </div>
        </form>
      </section>

      {/* ============ SECTION 1: Add Payment Method ============ */}
      <section className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Tambah Metode Pembayaran</h2>
        <form onSubmit={handleAddMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={newMethod.method_type}
            onChange={(e) => setNewMethod({ ...newMethod, method_type: e.target.value })}
            className="border rounded p-2"
            required
          >
            <option value="">Pilih Tipe</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="ewallet">E-Wallet</option>
          </select>

          <input
            type="text"
            placeholder="Nama Bank (BCA, BRI, DANA, dll)"
            value={newMethod.bank_name}
            onChange={(e) => setNewMethod({ ...newMethod, bank_name: e.target.value })}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Nama Pemilik Rekening"
            value={newMethod.account_name}
            onChange={(e) => setNewMethod({ ...newMethod, account_name: e.target.value })}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Nomor Rekening"
            value={newMethod.account_number}
            onChange={(e) => setNewMethod({ ...newMethod, account_number: e.target.value })}
            className="border rounded p-2"
            required
          />

          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-600 text-white rounded p-2 hover:bg-blue-700 font-medium"
          >
            Simpan Metode
          </button>
        </form>
      </section>

      {/* ============ SECTION 3: Payment Method List ============ */}
      <section className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Saved Payment Methods</h2>
        {methods.length === 0 ? (
          <p className="text-gray-500 italic">No payment methods yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {methods.map((m) => (
              <li key={m.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{m.method_type.toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    {m.account_name} — {m.account_number} {m.bank_name ? `(${m.bank_name})` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMethod(m)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 🔹 Modal edit */}
      {editMethod && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Edit Payment Method</h3>
            <form onSubmit={handleEditMethod} className="space-y-3">
              <input
                value={editMethod.method_type}
                onChange={(e) => setEditMethod({ ...editMethod, method_type: e.target.value })}
                placeholder="Method Type"
                className="border p-2 w-full rounded"
              />
              <input
                value={editMethod.account_name}
                onChange={(e) => setEditMethod({ ...editMethod, account_name: e.target.value })}
                placeholder="Account Name"
                className="border p-2 w-full rounded"
              />
              <input
                value={editMethod.account_number}
                onChange={(e) => setEditMethod({ ...editMethod, account_number: e.target.value })}
                placeholder="Account Number"
                className="border p-2 w-full rounded"
              />
              <input
                value={editMethod.bank_name}
                onChange={(e) => setEditMethod({ ...editMethod, bank_name: e.target.value })}
                placeholder="Bank Name"
                className="border p-2 w-full rounded"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditMethod(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ SECTION 4: Withdraw History ============ */}
      <section className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Withdrawal History</h2>
        {withdrawals.length === 0 ? (
          <p className="text-gray-500 italic">No withdrawal history yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-sm text-gray-700 bg-gray-50">
                  <th className="py-3 px-4">Transactions id</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b text-sm hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{w.transaction_id}</td>
                    <td className="py-3 px-4 font-medium">${parseFloat(w.amount).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${w.status === "paid" ? "bg-green-100 text-green-700" :
                        w.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                        {w.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {w.payment_method ? (
                        <span>{w.payment_method.method_type} <span className="text-gray-500 text-xs">({w.payment_method.account_number})</span></span>
                      ) : (
                        <span className="text-red-400 italic">Deleted Method</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(w.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {w.status !== "approved" && (
                        <>
                          {w.status === "pending" ? (
                            <button
                              onClick={() => handleCancel(w.id)}
                              className="text-red-600 hover:text-red-800 hover:underline"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              onClick={() => withdrawalDelete(w.id)}
                              className="text-gray-500 hover:text-gray-700 hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => fetchWithdrawals(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                Prev
              </button>
              <span className="px-2 py-1">Page {page} of {lastPage}</span>
              <button
                onClick={() => fetchWithdrawals(page + 1)}
                disabled={page === lastPage}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}