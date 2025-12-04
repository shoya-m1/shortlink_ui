import { useState, useEffect } from 'react';
import {
  DollarSign,
  AlertCircle,
  CheckCircle,
  Plus,
  RotateCcw,
  Trash2
} from 'lucide-react';
import {
  getAdRates,
  updateAdRates,
  deleteCountryRate,
  addCountryRate,
  addAdLevelColumn,
  deleteAdLevelColumn,
  getWithdrawalSettings,
  updateWithdrawalSettings,
  getBankFees,
  // getBankFees,
  updateBankFees,
  getReferralSettings,
  updateReferralSettings
} from './auth';

import WithdrawalSettingsForm from './components/WithdrawalSettingsForm';
import AdRatesForm from './components/AdRatesForm';
import BankFeesForm from './components/BankFeesForm';
import ReferralSettingsForm from './components/ReferralSettingsForm';

export default function AdRatesSettings() {
  // --- STATE TARIF IKLAN ---
  const [rates, setRates] = useState([]); // Array of rate objects

  // --- STATE WITHDRAWAL ---
  const [withdrawal, setWithdrawal] = useState({
    min_amount: '',
    max_amount: '',
    limit_count: '',
    limit_days: ''
  });

  // --- STATE BANK FEES ---
  const [bankFees, setBankFees] = useState({});

  // --- STATE REFERRAL ---
  const [referral, setReferral] = useState({ percentage: 10 });

  // --- UI STATES ---
  const [loading, setLoading] = useState(true);
  const [savingMap, setSavingMap] = useState({}); // Track saving state per country
  const [savingWithdrawal, setSavingWithdrawal] = useState(false);
  const [savingBankFees, setSavingBankFees] = useState(false);
  const [savingReferral, setSavingReferral] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ratesData, withdrawalData, bankFeesData, referralData] = await Promise.all([
        getAdRates(),
        getWithdrawalSettings(),
        getBankFees(),
        getReferralSettings()
      ]);

      // Set Data Rates (Array)
      setRates(ratesData);

      // Set Data Withdrawal
      const wdData = withdrawalData.value || withdrawalData;
      setWithdrawal({
        min_amount: wdData.min_amount !== undefined ? wdData.min_amount : '',
        max_amount: wdData.max_amount !== undefined ? wdData.max_amount : '',
        limit_count: wdData.limit_count !== undefined ? wdData.limit_count : '',
        limit_days: wdData.limit_days !== undefined ? wdData.limit_days : ''
      });

      // Set Data Bank Fees
      setBankFees(bankFeesData);

      // Set Data Referral
      setReferral({
        percentage: referralData.percentage !== undefined ? referralData.percentage : 10
      });

    } catch (error) {
      console.error("Failed to fetch settings:", error);
      showNotification('error', 'Gagal mengambil data pengaturan.');
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS TARIF IKLAN ---
  const handleRateChange = (country, key, value) => {
    const numValue = parseFloat(value);
    if (numValue < 0) return;

    setRates(prev => prev.map(r =>
      r.country === country
        ? { ...r, rates: { ...r.rates, [key]: value } }
        : r
    ));
  };

  const handleRateSubmit = async (e, country) => {
    e.preventDefault();
    setSavingMap(prev => ({ ...prev, [country]: true }));
    setNotification(null);

    const rateData = rates.find(r => r.country === country);
    if (!rateData) return;

    try {
      // Send the whole rate object (which includes nested rates)
      await updateAdRates(rateData);
      showNotification('success', `Tarif iklan untuk ${country} berhasil diperbarui!`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan.';
      showNotification('error', errorMessage);
    } finally {
      setSavingMap(prev => ({ ...prev, [country]: false }));
    }
  };

  const handleDeleteCountry = async (country) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus tarif untuk negara ${country}?`)) {
      return;
    }

    setLoading(true);
    setNotification(null);

    try {
      await deleteCountryRate(country);
      showNotification('success', `Tarif negara ${country} berhasil dihapus.`);
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menghapus negara.';
      showNotification('error', errorMessage);
      setLoading(false);
    }
  };

  const handleAddCountry = async () => {
    const country = window.prompt("Masukkan Kode Negara (contoh: ID, US, SG):");
    if (!country) return;

    const upperCountry = country.toUpperCase();
    // Cek duplikat client-side
    if (rates.some(r => r.country === upperCountry)) {
      alert("Negara tersebut sudah ada.");
      return;
    }

    setLoading(true);
    try {
      // Default values
      await addCountryRate({
        country: upperCountry,
        rates: { level_1: 0.05, level_2: 0.07, level_3: 0.10, level_4: 0.15 } // Default initial
      });
      showNotification('success', 'Negara baru berhasil ditambahkan.');
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menambahkan negara.';
      showNotification('error', errorMessage);
      setLoading(false);
    }
  };

  const handleAddLevel = async () => {
    if (!window.confirm("Tambahkan level baru untuk semua negara?")) return;

    setLoading(true);
    try {
      const res = await addAdLevelColumn();
      showNotification('success', res.message);
      fetchData();
    } catch (error) {
      showNotification('error', 'Gagal menambahkan level.');
      setLoading(false);
    }
  };

  const handleDeleteLevel = async () => {
    const levelKey = window.prompt("Masukkan Key Level yang akan dihapus (contoh: level_5):");
    if (!levelKey) return;

    if (!window.confirm(`Yakin ingin menghapus ${levelKey} dari SEMUA negara?`)) return;

    setLoading(true);
    try {
      const res = await deleteAdLevelColumn(levelKey);
      showNotification('success', res.message);
      fetchData();
    } catch (error) {
      showNotification('error', 'Gagal menghapus level.');
      setLoading(false);
    }
  };

  // --- HANDLERS WITHDRAWAL ---
  const handleWithdrawalChange = (key, value) => {
    setWithdrawal(prev => ({ ...prev, [key]: value }));
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    setSavingWithdrawal(true);
    setNotification(null);

    const minAmount = parseFloat(withdrawal.min_amount);
    if (isNaN(minAmount) || minAmount <= 0) {
      showNotification('error', 'Jumlah minimal harus valid (> 0).');
      setSavingWithdrawal(false);
      return;
    }

    try {
      await updateWithdrawalSettings({
        min_amount: minAmount,
        max_amount: withdrawal.max_amount,
        limit_count: withdrawal.limit_count,
        limit_days: withdrawal.limit_days
      });
      showNotification('success', 'Pengaturan penarikan berhasil diperbarui!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan.';
      showNotification('error', errorMessage);
    } finally {
      setSavingWithdrawal(false);
    }
  };

  // --- HANDLERS BANK FEES ---
  const handleBankFeeChange = (bankName, value) => {
    const numValue = parseFloat(value);
    if (numValue < 0) return;
    setBankFees(prev => ({ ...prev, [bankName]: value }));
  };

  const handleAddBankFee = () => {
    const bankName = window.prompt("Masukkan Nama Bank (contoh: BCA, MANDIRI, OVO):");
    if (!bankName) return;

    const upperBankName = bankName.toUpperCase();
    if (bankFees.hasOwnProperty(upperBankName)) {
      alert("Bank tersebut sudah ada.");
      return;
    }

    setBankFees(prev => ({ ...prev, [upperBankName]: 0 }));
  };

  const handleDeleteBankFee = (bankName) => {
    if (bankName === 'OTHERS') {
      alert("Bank 'OTHERS' tidak bisa dihapus karena digunakan sebagai default.");
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus biaya untuk ${bankName}?`)) {
      return;
    }

    setBankFees(prev => {
      const newFees = { ...prev };
      delete newFees[bankName];
      return newFees;
    });
  };

  const handleBankFeeSubmit = async (e) => {
    e.preventDefault();
    setSavingBankFees(true);
    setNotification(null);

    const payload = {};
    Object.keys(bankFees).forEach(key => {
      payload[key] = parseFloat(bankFees[key] || 0);
    });

    try {
      await updateBankFees(payload);
      showNotification('success', 'Biaya admin bank berhasil diperbarui!');
    } catch (error) {
      console.error("Error update bank fees:", error);
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan biaya admin.';
      showNotification('error', errorMessage);
    } finally {
      setSavingBankFees(false);
    }
  };

  // --- HANDLERS REFERRAL ---
  const handleReferralChange = (value) => {
    setReferral({ percentage: value });
  };

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    setSavingReferral(true);
    setNotification(null);

    const percentage = parseFloat(referral.percentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      showNotification('error', 'Persentase harus valid (0-100).');
      setSavingReferral(false);
      return;
    }

    try {
      await updateReferralSettings({ percentage });
      showNotification('success', 'Persentase referral berhasil diperbarui!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan.';
      showNotification('error', errorMessage);
    } finally {
      setSavingReferral(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse mt-10">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (<div key={i} className="h-32 bg-gray-200 rounded-lg"></div>))}
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-indigo-600" />
            Pengaturan Sistem
          </h1>
          <p className="mt-2 text-gray-600">
            Kelola variabel global aplikasi seperti tarif iklan, batas penarikan, dan biaya admin.
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`p-4 rounded-lg flex items-center gap-3 shadow-sm transition-all duration-300 ${notification.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            {notification.type === 'success'
              ? <CheckCircle className="w-5 h-5" />
              : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* --- FORM WITHDRAWAL --- */}
        <WithdrawalSettingsForm
          withdrawal={withdrawal}
          savingWithdrawal={savingWithdrawal}
          onChange={handleWithdrawalChange}
          onSubmit={handleWithdrawalSubmit}
        />

        {/* --- FORM BANK FEES --- */}
        <BankFeesForm
          fees={bankFees}
          saving={savingBankFees}
          onChange={handleBankFeeChange}
          onSubmit={handleBankFeeSubmit}
          onAdd={handleAddBankFee}       // <-- Added
          onDelete={handleDeleteBankFee} // <-- Added
        />

        {/* --- FORM REFERRAL --- */}
        <ReferralSettingsForm
          referral={referral}
          saving={savingReferral}
          onChange={handleReferralChange}
          onSubmit={handleReferralSubmit}
        />

        {/* --- FORM TARIF IKLAN (LIST NEGARA) --- */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800">Daftar Tarif per Negara</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reload
              </button>

              <button
                onClick={handleDeleteLevel}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Level
              </button>

              <button
                onClick={handleAddLevel}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Level
              </button>

              <button
                onClick={handleAddCountry}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Negara
              </button>
            </div>
          </div>

          {rates.map((rate) => (
            <AdRatesForm
              key={rate.country}
              country={rate.country}
              rates={rate.rates} // Pass nested rates
              saving={savingMap[rate.country] || false}
              onRateChange={handleRateChange}
              onSubmit={handleRateSubmit}
              onDelete={handleDeleteCountry}
            />
          ))}
        </div>

      </div>
    </section>
  );
}