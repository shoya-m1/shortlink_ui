// WithdrawalSettingsForm.jsx
import { Save, Loader2, Wallet } from 'lucide-react';

export default function WithdrawalSettingsForm({
  withdrawal,
  savingWithdrawal,
  onChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100 bg-emerald-50/50">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-600" />
          Pengaturan Penarikan (Withdrawal)
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Atur batas minimal saldo agar user bisa melakukan penarikan.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Minimal Penarikan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimal Penarikan ($)
          </label>
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 font-bold">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0.1"
              required
              value={withdrawal.min_amount}
              onChange={(e) => onChange('min_amount', e.target.value)}
              className="block w-full pl-8 pr-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Contoh: 5.00"
            />
          </div>
        </div>

        {/* Maksimal Penarikan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maksimal Penarikan ($) <span className="text-gray-400 font-normal">(0 = Unlimited)</span>
          </label>
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 font-bold">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={withdrawal.max_amount}
              onChange={(e) => onChange('max_amount', e.target.value)}
              className="block w-full pl-8 pr-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Limit Frekuensi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batas Frekuensi (Kali) <span className="text-gray-400 font-normal">(0 = Unlimited)</span>
            </label>
            <input
              type="number"
              min="0"
              value={withdrawal.limit_count}
              onChange={(e) => onChange('limit_count', e.target.value)}
              className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Contoh: 2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dalam Periode (Hari)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={withdrawal.limit_days}
                onChange={(e) => onChange('limit_days', e.target.value)}
                className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Contoh: 1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">Hari</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          type="submit"
          disabled={savingWithdrawal}
          className={`flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all ${savingWithdrawal ? 'opacity-75 cursor-not-allowed' : ''
            }`}
        >
          {savingWithdrawal ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savingWithdrawal ? 'Menyimpan...' : 'Simpan Penarikan'}
        </button>
      </div>
    </form>
  );
}
