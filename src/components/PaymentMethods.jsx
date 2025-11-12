import { useState } from 'react';

export default function PaymentMethods({ methods, onAdd, onDelete }) {
  const [newMethod, setNewMethod] = useState({
    method_type: 'bank_transfer',
    account_name: '',
    account_number: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMethod.account_name || !newMethod.account_number) {
      alert('Nama dan Nomor Akun wajib diisi!');
      return;
    }
    onAdd(newMethod);
    setNewMethod({ method_type: 'bank_transfer', account_name: '', account_number: '' });
  };

  return (
    <div className="bg-black p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Metode Pembayaran</h2>
      <ul className="divide-y divide-gray-200">
        {methods.length > 0 ? (
          methods.map((method) => (
            <li key={method.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-700">{method.account_name}</p>
                <p className="text-sm text-gray-500">{method.account_number} ({method.method_type})</p>
              </div>
              <button
                onClick={() => onDelete(method.id)}
                className="bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500 py-3">Anda belum memiliki metode pembayaran.</p>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-t pt-4">Tambah Metode Baru</h3>
        <input
          type="text"
          placeholder="Nama Pemilik Akun"
          value={newMethod.account_name}
          onChange={(e) => setNewMethod({ ...newMethod, account_name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Nomor Rekening / Akun"
          value={newMethod.account_number}
          onChange={(e) => setNewMethod({ ...newMethod, account_number: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          Tambah Metode
        </button>
      </form>
    </div>
  );
}