import React from 'react';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function WithdrawalHistory({ withdrawals }) {
  return (
    <div className="bg-black p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Riwayat Penarikan</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {withdrawals.length > 0 ? (
              withdrawals.map((wd) => (
                <tr key={wd.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(wd.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rp {Number(wd.amount).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[wd.status] || ''}`}>
                      {wd.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Belum ada riwayat penarikan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}