import React, { useState, useEffect } from 'react';

export default function WithdrawalForm({ paymentMethods, onSubmit }) {
  const [request, setRequest] = useState({
    amount: '',
    payment_method_id: '',
  });

  useEffect(() => {
    // Set default payment method jika ada
    if (paymentMethods.length > 0) {
      setRequest(prev => ({ ...prev, payment_method_id: paymentMethods[0].id }));
    }
  }, [paymentMethods]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!request.amount || !request.payment_method_id) {
      alert('Jumlah dan metode pembayaran wajib diisi!');
      return;
    }
    onSubmit(request);
    setRequest({ ...request, amount: '' });
  };

  const hasMethods = paymentMethods.length > 0;

  return (
    <div className="bg-black p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Ajukan Penarikan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Jumlah Penarikan"
          value={request.amount}
          onChange={(e) => setRequest({ ...request, amount: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          required
          disabled={!hasMethods}
        />
        <select
          value={request.payment_method_id}
          onChange={(e) => setRequest({ ...request, payment_method_id: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={!hasMethods}
        >
          {hasMethods ? (
            paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.account_name} - {method.account_number}
              </option>
            ))
          ) : (
            <option>-- Tambah metode pembayaran dulu --</option>
          )}
        </select>
        <button type="submit" disabled={!hasMethods} className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
          Kirim Permintaan
        </button>
      </form>
    </div>
  );
}