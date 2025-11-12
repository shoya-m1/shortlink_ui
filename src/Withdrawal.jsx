import { useEffect, useState } from "react";

export default function Withdrawal() {
  const [methods, setMethods] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
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

  const apiUrl = "http://localhost:8000/api"; // ganti sesuai backend kamu

  // 🔹 Fetch semua metode pembayaran
  const fetchPaymentMethods = async () => {
    const res = await fetch(`${apiUrl}/payment-methods`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMethods(data);
    console.log(data)
  };

  // 🔹 Fetch riwayat withdraw
  const fetchWithdrawals = async (pageNum = 1) => {
    const res = await fetch(`${apiUrl}/withdrawals?page=${pageNum}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setWithdrawals(data.payouts.data || [])
    // console.log(data)
    setPage(data.payouts.current_page);
    setLastPage(data.payouts.last_page);
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
    alert(data.message || "Payment method added!");
    setNewMethod({ method_type: "", account_name: "", account_number: "", bank_name: "" });
    fetchPaymentMethods();
  };

  // 🔹 Ajukan withdraw
  const handleWithdraw = async (e) => {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/withdrawals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        payment_method_id: selectedMethod,
      }),
    });
    const data = await res.json();
    if (data.error) alert(data.error);
    else alert(data.message);
    setAmount("");
    fetchWithdrawals();
  };

  // canceled witdrawal
  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Apakah kamu yakin ingin membatalkan penarikan ini?"
    );
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
        fetchWithdrawals(); // refresh list
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
        fetchWithdrawals(); // refresh list
      } else {
        alert(result.error || "Gagal menghapus withdrawal.");
      }
    } catch (err) {
      console.error("Error cancelling withdrawal:", err);
      alert("Terjadi kesalahan saat membatalkan withdrawal.");
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
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold mb-6">💸 Withdraw Dashboard</h1>

      {/* ============ SECTION 1: Add Payment Method ============ */}
      <section className="bg-black rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Add Payment Method</h2>
        <form onSubmit={handleAddMethod} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Type (bank, dana, paypal)"
            value={newMethod.method_type}
            onChange={(e) => setNewMethod({ ...newMethod, method_type: e.target.value })}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Account Name"
            value={newMethod.account_name}
            onChange={(e) => setNewMethod({ ...newMethod, account_name: e.target.value })}
            className="border rounded p-2"
          />
          <input
            type="text"
            placeholder="Account Number / Email"
            value={newMethod.account_number}
            onChange={(e) => setNewMethod({ ...newMethod, account_number: e.target.value })}
            className="border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Bank Name (optional)"
            value={newMethod.bank_name}
            onChange={(e) => setNewMethod({ ...newMethod, bank_name: e.target.value })}
            className="border rounded p-2"
          />
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
          >
            Add Method
          </button>
        </form>
      </section>

      {/* ============ SECTION 2: Withdraw Form ============ */}
      <section className="bg-black rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Withdraw Funds</h2>
        <form onSubmit={handleWithdraw} className="flex flex-col gap-4 md:flex-row md:items-center">
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            required
            className="border rounded p-2 flex-1"
          >
            <option value="">Select Payment Method</option>
            {methods.map((m) => (
              <option key={m.id} value={m.id}>
                {m.method_type.toUpperCase()} - {m.account_number}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded p-2 flex-1"
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Withdraw
          </button>
        </form>
      </section>

      {/* ============ SECTION 3: Payment Method List ============ */}
      <section className="bg-black rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Saved Payment Methods</h2>
        {methods.length === 0 ? (
          <p className="text-gray-500">No payment methods yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {methods.map((m) => (
              <li key={m.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{m.method_type.toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    {m.account_name} — {m.account_number}
                  </p>
                </div>
                {/* {m.is_default && <span className="text-green-600 text-sm">Default</span>} */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMethod(m)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-black rounded-xl p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-3">Edit Payment Method</h3>
            <form onSubmit={handleEditMethod}>
              <input
                value={editMethod.method_type}
                onChange={(e) => setEditMethod({ ...editMethod, method_type: e.target.value })}
                placeholder="Method Type"
                className="border p-2 w-full mb-2 rounded"
              />
              <input
                value={editMethod.account_name}
                onChange={(e) => setEditMethod({ ...editMethod, account_name: e.target.value })}
                placeholder="Account Name"
                className="border p-2 w-full mb-2 rounded"
              />
              <input
                value={editMethod.account_number}
                onChange={(e) => setEditMethod({ ...editMethod, account_number: e.target.value })}
                placeholder="Account Number"
                className="border p-2 w-full mb-2 rounded"
              />
              <input
                value={editMethod.bank_name}
                onChange={(e) => setEditMethod({ ...editMethod, bank_name: e.target.value })}
                placeholder="Bank Name"
                className="border p-2 w-full mb-2 rounded"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditMethod(null)}
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ============ SECTION 4: Withdraw History ============ */}
      <section className="bg-black rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Withdrawal History</h2>
        {withdrawals.length === 0 ? (
          <p className="text-gray-500">No withdrawal history yet.</p>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-sm text-gray-700">
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Payment Method</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b text-sm">
                    <td className="py-2 px-3">${parseFloat(w.amount).toFixed(2)}</td>
                    <td
                      className={`py-2 px-3 font-semibold ${w.status === "paid"
                        ? "text-green-600"
                        : w.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                        }`}
                    >
                      {w.status.toUpperCase()}
                    </td>
                    {w.payment_method?.method_type === null ?
                      <td className="py-2 px-3">Delete</td>
                      :
                      <td className="py-2 px-3">{w.payment_method?.method_type}</td>
                    }
                    <td className="py-2 px-3">
                      {new Date(w.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      {w.status === "pending" ? (
                        <button
                          onClick={() => handleCancel(w.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Batalkan
                        </button>
                      ) : (
                        <button
                          onClick={() => withdrawalDelete(w.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => fetchWithdrawals(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>Page {page} of {lastPage}</span>
              <button
                onClick={() => fetchWithdrawals(page + 1)}
                disabled={page === lastPage}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
