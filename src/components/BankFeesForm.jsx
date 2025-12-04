import { Wallet, Save, Loader2, AlertCircle, Trash2, Plus } from 'lucide-react';

export default function BankFeesForm({ fees, saving, onChange, onSubmit, onAdd, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Wallet className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Biaya Admin Bank</h2>
          <p className="text-sm text-gray-500">
            Atur potongan biaya admin untuk setiap jenis bank/e-wallet (Rupiah).
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(fees).map((bankName) => (
            <div key={bankName} className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between items-center">
                <span>{bankName === 'OTHERS' ? 'Bank Lainnya (Default)' : `Bank ${bankName}`}</span>
                {bankName !== 'OTHERS' && (
                  <button
                    type="button"
                    onClick={() => onDelete(bankName)}
                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Hapus Bank"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">Rp</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={fees[bankName]}
                  onChange={(e) => onChange(bankName, e.target.value)}
                  className="pl-10 block w-full text-gray-700 rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2.5 transition-all duration-200"
                  placeholder="0"
                />
              </div>
            </div>
          ))}
          
          {/* Tombol Tambah Bank */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={onAdd}
              className="w-full h-[42px] border-2 border-dashed border-purple-200 rounded-lg text-purple-600 font-medium hover:bg-purple-50 hover:border-purple-300 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tambah Bank
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            Pastikan nama bank sesuai. "OTHERS" digunakan jika user memilih bank yang tidak terdaftar di sini. 
            Biaya ini akan ditambahkan ke total saldo yang dipotong dari user.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}