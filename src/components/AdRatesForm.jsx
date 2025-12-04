// AdRatesForm.jsx
import { Save, RotateCcw, TrendingUp, Loader2, Trash2, Globe } from 'lucide-react';

export default function AdRatesForm({
  country,
  rates,
  saving,
  onRateChange,
  onSubmit,
  onDelete,
}) {
  // Extract levels dynamically from rates object
  // rates is like { level_1: 0.05, level_2: 0.07, ... }
  const levels = Object.keys(rates || {})
    .filter(key => key.startsWith('level_'))
    .map(key => parseInt(key.replace('level_', '')))
    .sort((a, b) => a - b);

  return (
    <form
      onSubmit={(e) => onSubmit(e, country)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b border-gray-100 bg-indigo-50/50">
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {country === 'GLOBAL' ? <Globe className="w-5 h-5 text-indigo-600" /> : <span className="text-xl">flag</span>}
            Tarif Iklan: {country}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Atur CPC untuk {levels.length} level iklan di negara {country}.
          </p>
        </div>
        <div className="hidden md:flex items-center justify-end gap-2 text-sm font-medium text-indigo-600">
          Simulasi CPM (1000 Klik)
        </div>
      </div>

      <div className="p-6 space-y-4">
        {levels.map((level) => (
          <div
            key={level}
            className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200"
          >
            <div className="md:col-span-3 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm
                  ${level % 4 === 1 ? 'bg-blue-400' : ''} 
                  ${level % 4 === 2 ? 'bg-blue-500' : ''}
                  ${level % 4 === 3 ? 'bg-indigo-500' : ''} 
                  ${level % 4 === 0 ? 'bg-indigo-600' : ''}
                `}
              >
                {level}
              </div>
              <span className="font-bold text-gray-700">Level {level}</span>
            </div>

            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-semibold">$</span>
              </div>
              <input
                type="number"
                step="0.00001"
                min="0"
                value={rates[`level_${level}`]}
                onChange={(e) => onRateChange(country, `level_${level}`, e.target.value)}
                className="block w-full pl-8 pr-12 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xs">/ klik</span>
              </div>
            </div>

            <div className="md:col-span-4 flex items-center justify-end gap-3">
              <span className="md:hidden text-sm text-gray-500 mr-2">
                CPM:
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded border border-green-100 font-mono text-sm font-bold">
                $ {(parseFloat(rates[`level_${level}`] || 0) * 1000).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        {country !== 'GLOBAL' && (
          <button
            type="button"
            onClick={() => onDelete(country)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Negara
          </button>
        )}

        <div className="flex-1"></div>

        <button
          type="submit"
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-all ${saving ? 'opacity-75 cursor-not-allowed' : 'shadow-sm'
            }`}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Menyimpan...' : 'Simpan Tarif'}
        </button>
      </div>
    </form>
  );
}
