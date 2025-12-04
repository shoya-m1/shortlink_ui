import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, MousePointer2, Eye, ChevronDown, Calendar } from 'lucide-react';

// Import service yang baru saja dibuat
import { 
  getSummaryEarnings, 
  getSummaryClicks, 
  // getSummaryViews 
} from '../auth'; // SESUAIKAN path ini dengan lokasi file service Anda

// --- Helper: Format Tanggal ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// --- Component: Dropdown ---
const TimeRangeDropdown = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { value: 'week', label: 'Minggu Ini' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'year', label: 'Tahun Ini' },
  ];

  const currentLabel = options.find(opt => opt.value === selected)?.label || 'Pilih';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors bg-gray-50 px-2 py-1 rounded-md border border-gray-200"
      >
        {currentLabel}
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 py-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                selected === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Component: Stat Card (Updated) ---
// Sekarang menerima props 'fetcher' (fungsi service) alih-alih 'endpoint' string
const StatCard = ({ title, fetcher, dataKey, icon: Icon, colorClass, formatter, defaultRange = 'month' }) => {
  const [range, setRange] = useState(defaultRange);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Panggil fungsi service yang dioper dari props
        const result = await fetcher(range);
        
        if (isMounted) {
          // Handle struktur response.data.data jika axios response membungkusnya, 
          // atau sesuaikan dengan return di service.
          // Asumsi dari kode controller: response -> { success: true, data: { ... } }
          setData(result.data || result); 
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Gagal');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, [fetcher, range]); 

  const value = data ? data[dataKey] : 0;
  const displayValue = formatter ? formatter(value) : value;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <TimeRangeDropdown selected={range} onChange={setRange} />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        
        {loading ? (
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
        ) : error ? (
          <span className="text-red-500 text-sm">{error}</span>
        ) : (
          <h3 className="text-2xl font-bold text-gray-900">{displayValue}</h3>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-400">
        <Calendar className="w-3 h-3 mr-1.5" />
        {loading ? (
          <div className="h-3 w-20 bg-gray-100 animate-pulse rounded"></div>
        ) : (
          <span>
            {formatDate(data?.from_date)} - {formatDate(data?.to_date)}
          </span>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* 1. Earnings Card */}
      <StatCard
        title="Total Pendapatan"
        fetcher={getSummaryEarnings} // Pass function service
        dataKey="total_earnings"
        icon={DollarSign}
        colorClass="bg-green-500"
        defaultRange="year" // Bisa set default range berbeda
        formatter={(val) => 
          new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
        }
      />

      {/* 2. Clicks Card */}
      <StatCard
        title="Total Klik"
        fetcher={getSummaryClicks}
        dataKey="total_clicks"
        icon={MousePointer2}
        colorClass="bg-blue-500"
        defaultRange="month"
        formatter={(val) => new Intl.NumberFormat('id-ID').format(val)}
      />

      {/* 3. Views Card */}
      <StatCard
        title="Valid Views"
        fetcher={getSummaryViews}
        dataKey="total_views"
        icon={Eye}
        colorClass="bg-purple-500"
        defaultRange="week"
        formatter={(val) => new Intl.NumberFormat('id-ID').format(val)}
      />

    </div>
  );
};

export default DashboardStats;