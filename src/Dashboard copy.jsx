import React, { useState } from 'react';
import {
  LayoutGrid,
  Link,
  PlusCircle,
  Globe,
  BarChart2,
  Users,
  CreditCard,
  History,
  LogOut,
  UserCircle,
  Menu,
  Wallet,
  DollarSign,
  Target,
  Languages,
  Sun,
  Bell,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  Copy,
  MessageCircle,
  ChevronsLeft, // Ditambahkan
  ChevronsRight, // Ditambahkan
} from 'lucide-react';

/*
  Komponen Utama Aplikasi Dashboard
  Ini adalah komponen induk yang mengatur state untuk sidebar
  (terbuka atau tertutup) dan menatanya dengan konten utama.
*/
export default function App() {
  // State diubah ke false agar default-nya tersembunyi di mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fungsi untuk mengubah state sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      {/* Kirimkan fungsi toggleSidebar ke Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Konten Utama (Header + Main) */}
      <MainContentArea toggleSidebar={toggleSidebar} />

      {/* Overlay (HANYA UNTUK MOBILE) */}
      {/* Muncul saat sidebar terbuka & di layar kecil (lg:hidden) */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}

/*
  Komponen Sidebar
  Menampilkan navigasi utama. Lebarnya berubah berdasarkan
  prop `isSidebarOpen` DAN ukuran layar.
*/
// Terima prop toggleSidebar
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [myLinksOpen, setMyLinksOpen] = useState(true);

  return (
    <aside
      className={`flex flex-col relative overflow-visible
        ${/* Mobile Styles: fixed, off-screen by default, w-64 */ ''}
        fixed top-0 left-0 z-30 w-64 bg-white shadow-lg transition-all duration-300 ease-in-out h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}

        ${/* Desktop Styles (lg:): static, in-flow, width based on state */ ''}
        lg:static lg:z-auto lg:translate-x-0 lg:sticky lg:top-0
        ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b px-4">
        {/* Logo Teks saat terbuka */}
        <h1
          className={`text-2xl font-bold text-indigo-600 whitespace-nowrap overflow-hidden ${
            isSidebarOpen ? 'block' : 'hidden'
          } ${
            !isSidebarOpen && 'lg:hidden' // Sembunyikan di desktop saat diciutkan
          }`}
        >
          Shortenlinks
        </h1>
        {/* Logo Ikon saat tertutup */}
        <div
          className={`text-indigo-600 ${
            isSidebarOpen ? 'hidden' : 'block'
          } ${
            !isSidebarOpen && 'lg:block' // Tampilkan di desktop saat diciutkan
          }`}
        >
          <Link size={30} />
        </div>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        <MenuItem
          icon={<LayoutGrid size={20} />}
          text="Dashboard"
          active
          isOpen={isSidebarOpen}
        />

        {/* Item Menu dengan Submenu */}
        <div>
          <button
            onClick={() => setMyLinksOpen(!myLinksOpen)}
            className={`flex items-center justify-between w-full px-4 py-2.5 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 ${
              !isSidebarOpen ? 'justify-center' : ''
            }`}
          >
            <div className={`flex items-center space-x-3`}>
              <Link size={20} />
              {isSidebarOpen && <span className="font-medium">My Links</span>}
            </div>
            {isSidebarOpen && (
              <ChevronDown
                size={16}
                className={`transform transition-transform ${
                  myLinksOpen ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>
          {/* Submenu */}
          {myLinksOpen && isSidebarOpen && (
            <div className="mt-1 ml-8 space-y-1">
              <MenuItem
                icon={<PlusCircle size={18} />}
                text="New Link"
                isOpen={isSidebarOpen}
                subItem
              />
              <MenuItem
                icon={<Globe size={18} />}
                text="Subdomain.id"
                isOpen={isSidebarOpen}
                subItem
              />
            </div>
          )}
        </div>

        <MenuItem
          icon={<BarChart2 size={20} />}
          text="Analytics"
          isOpen={isSidebarOpen}
        />
        <MenuItem
          icon={<Users size={20} />}
          text="Referral"
          isOpen={isSidebarOpen}
        />
        <MenuItem
          icon={<CreditCard size={20} />}
          text="Withdrawal"
          isOpen={isSidebarOpen}
        />
        <MenuItem
          icon={<History size={20} />}
          text="History"
          isOpen={isSidebarOpen}
        />

        {/* Tombol Toggle Sidebar (HANYA DESKTOP) */}
        <div className="hidden lg:flex items-center justify-center pt-4 mt-4 border-t border-gray-200">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 rounded-full hover:bg-indigo-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            title={isSidebarOpen ? 'Perkecil sidebar' : 'Perluas sidebar'}
          >
            {isSidebarOpen ? (
              <ChevronsLeft size={20} />
            ) : (
              <ChevronsRight size={20} />
            )}
          </button>
        </div>
      </nav>

      {/* Bagian Bawah Sidebar (Footer) */}
      <div className="px-3 py-6 border-t">
        <MenuItem
          icon={<LogOut size={20} />}
          text="Log Out"
          isOpen={isSidebarOpen}
        />
        <div
          className={`flex items-center ${
            isSidebarOpen
              ? 'justify-start space-x-3 p-2 mt-4'
              : 'justify-center p-2 mt-4'
          } `}
        >
          <UserCircle
            size={isSidebarOpen ? 32 : 36}
            className="text-gray-500"
          />
          {isSidebarOpen && (
            <div>
              <p className="text-sm font-medium text-gray-800">User</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

/*
  Komponen Item Menu 
  Item yang dapat digunakan kembali untuk navigasi sidebar.
*/
const MenuItem = ({ icon, text, active, isOpen, subItem = false }) => (
  <a
    href="#"
    className={`group overflow-visible flex items-center px-4 py-2.5 rounded-lg
      ${subItem ? 'text-sm' : ''}
      ${active ? 'bg-indigo-100 text-indigo-700 font-medium'
               : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}
      ${!isOpen ? 'justify-center' : 'space-x-3'}
      transition-all duration-200`}
    aria-label={!isOpen ? text : undefined}
  >
    <span className="text-center">{icon}</span>

    {isOpen && <span className={subItem ? '' : 'font-medium'}>{text}</span>}

    {!isOpen && (
     <span
        className="
          hidden group-hover:block
          absolute left-full tops-1/2 -translates-y-1/2 ml-2
          whitespace-nowrap rounded-md bg-red-800 px-2 py-1 text-xs text-white shadow-lg
          z-[99] pointer-events-none
        "
      >
        {text}
      </span>
    )}
  </a>
);



/*
  Komponen Area Konten Utama
  Membungkus Header, DashboardGrid, dan Footer.
*/
const MainContentArea = ({ toggleSidebar }) => {
  return (
    // flex-1 membuat konten ini mengambil sisa ruang
    // Di mobile, sidebar fixed, jadi ini mengambil 100% width
    // Di desktop, sidebar static, jadi ini mengambil sisa ruang (width - sidebar)
    <div className="flex-1 flex flex-col h-screen overflow-y-auto ">
      {/* Header Utama */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Konten Dashboard */}
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <DashboardGrid />
      </main>

      {/* Footer Dashboard */}
      <DashboardFooter />
    </div>
  );
};

/*
  Komponen Header
  Berisi tombol hamburger, statistik cepat, dan ikon pengguna.
*/
const Header = ({ toggleSidebar }) => (
  <header className="flex items-center justify-between h-20 px-6 md:px-8 lg:px-10 bg-white border-b sticky top-0 z-10">
    {/* Sisi Kiri Header: Tombol Menu dan Statistik */}
    <div className="flex items-center space-x-4">
      {/* Tombol Hamburger Menu */}
      {/* Tambahkan 'lg:hidden' agar hilang di desktop */}
      <button
        onClick={toggleSidebar}
        className="p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Statistik Cepat (hanya tampil di layar medium ke atas) */}
      <HeaderStat
        icon={<Wallet size={20} className="text-blue-500" />}
        title="Balance"
        value="$80,210"
      />
      <HeaderStat
        icon={<DollarSign size={20} className="text-green-500" />}
        title="Payout"
        value="$10,000"
      />
      <HeaderStat
        icon={<Target size={20} className="text-red-500" />}
        title="CPC"
        value="$1,000"
      />
    </div>

    {/* Sisi Kanan Header: Kontrol Pengguna */}
    <div className="flex items-center space-x-4 md:space-x-6">
      <button className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
        <Languages size={20} />
        <span className="hidden sm:block font-medium">en</span>
      </button>
      <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100">
        <Sun size={20} />
        {/* <Moon size={20} /> */}
      </button>
      <button className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100">
        <Bell size={20} />
        {/* Notifikasi dot */}
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
    </div>
  </header>
);

/*
  Komponen Statistik Header
  Menampilkan ikon, judul, dan nilai untuk item di header.
*/
const HeaderStat = ({ icon, title, value }) => (
  <div className="items-center hidden space-x-2 md:flex">
    <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

/*
  Komponen Grid Dashboard
  Tata letak utama untuk semua kartu (cards) konten.
*/
const DashboardGrid = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {/* Kartu Statistik 1 */}
    <StatCard
      title="Total Earnings"
      value="$68,982"
      change="+30%"
      changeType="positive"
      period="Compared to last week"
      linkText="Revenue Reports"
    />
    
    {/* Kartu Statistik 2 */}
    <StatCard
      title="Total Clicks"
      value="25K ++"
      change="+30%"
      changeType="negative" // Sesuai gambar, ini berwarna merah
      period="Today"
      linkText="Arrange Reports"
      icon={<ArrowDownLeft size={16} />}
    />

    {/* Kartu Valid Clicks (dengan Donut Chart) */}
    <div className="p-6 bg-white rounded-2xl shadow-sm lg:col-span-2 xl:col-span-1">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Valid Clicks</h3>
        <button className="flex items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200">
          <PlusCircle size={14} className="mr-1" />
          New link
        </button>
      </div>
      <div className="flex items-end justify-between mt-4">
        <div>
          <p className="text-3xl font-bold text-gray-900">25K ++</p>
          <p className="flex flex-wrap items-center mt-1 text-sm text-green-500">
            <span className="flex items-center px-2 py-0.5 bg-green-100 rounded-full">
              <ChevronUp size={12} /> +30%
            </span>
            <span className="ml-2 text-gray-500">You closed out last week</span>
          </p>
        </div>
        {/* Mock Donut Chart */}
        <div className="flex items-center justify-center w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#f3f4f6" // Latar belakang lingkaran
              strokeWidth="3.5"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831"
              fill="none"
              stroke="#4f46e5" // Foreground (progress)
              strokeWidth="3.5"
              strokeDasharray="90, 100" // 90%
              strokeLinecap="round"
            />
            <text
              x="18"
              y="20.5"
              textAnchor="middle"
              className="text-lg font-bold fill-gray-900"
            >
              90%
            </text>
          </svg>
        </div>
      </div>
      <a href="#" className="block mt-2 text-sm font-medium text-gray-500">
        Target Clicks Achieved
      </a>
    </div>

    {/* Kartu Click Analytics (Line Chart) */}
    <ClickAnalyticsCard />

    {/* Kartu Top Performing Links */}
    <TopPerformingLinksCard />

    {/* Kartu Top Earning */}
    <div className="p-6 bg-white rounded-2xl shadow-sm lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Top Earning</h3>
        <DropdownButton text="All Time" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <EarningStat title="Top Month" value="February" period="All Time" />
        <EarningStat title="Top Year" value="2025" period="All Time" />
        <EarningStat title="Top Clicks" value="30K ++" period="All Time" />
      </div>
    </div>

    {/* Kartu Referral */}
    <ReferralCard />
  </div>
);

/*
  Komponen Kartu Statistik
  Kartu generik untuk menampilkan statistik (cth: Total Earnings).
*/
const StatCard = ({
  title,
  value,
  change,
  changeType,
  period,
  linkText,
  icon,
}) => (
  <div className="p-6 bg-white rounded-2xl shadow-sm">
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    <div className="flex flex-wrap items-center justify-between mt-4">
      <p
        className={`flex items-center text-sm ${
          changeType === 'positive' ? 'text-green-500' : 'text-red-500'
        }`}
      >
        <span
          className={`flex items-center px-2 py-0.5 ${
            changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'
          } rounded-full`}
        >
          {icon || <ArrowUpRight size={16} />} {change}
        </span>
      </p>
      <span className="mt-1 text-sm text-gray-500 sm:mt-0">{period}</span>
    </div>
    <a
      href="#"
      className="block mt-4 text-sm font-medium text-indigo-600 hover:underline"
    >
      {linkText} &rarr;
    </a>
  </div>
);

/*
  Komponen Kartu Click Analytics (Mock Chart)
*/
const ClickAnalyticsCard = () => (
  <div className="p-6 bg-white rounded-2xl shadow-sm lg:col-span-3 xl:col-span-2">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Click Analytics</h3>
      <div className="flex items-center space-x-2">
        <DropdownButton text="Monthly" />
        <button className="p-1 text-gray-500 rounded hover:bg-gray-100">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
    {/* Mock Line Chart dengan SVG */}
    <div className="w-full h-64">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gradien untuk area di bawah garis */}
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Garis Grid Y-axis */}
        <line
          x1="0"
          y1="20"
          x2="300"
          y2="20"
          stroke="#f3f4f6"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="40"
          x2="300"
          y2="40"
          stroke="#f3f4f6"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="60"
          x2="300"
          y2="60"
          stroke="#f3f4f6"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="80"
          x2="300"
          y2="80"
          stroke="#f3f4f6"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="100"
          x2="300"
          y2="100"
          stroke="#e5e7eb"
          strokeWidth="0.5"
        />
        {/* Garis Data (Path) */}
        <path
          d="M 0 60 L 40 50 L 80 70 L 120 60 L 160 50 L 200 65 L 240 40 L 280 20 L 300 30"
          fill="url(#chartGradient)"
          stroke="#4f46e5"
          strokeWidth="2"
        />
        {/* Titik data (Opsional) */}
        <circle cx="280" cy="20" r="2" fill="#4f46e5" />
        <circle cx="300" cy="30" r="2" fill="#4f46e5" />
        
        {/* Label X-Axis */}
        <text x="20" y="112" textAnchor="middle" className="text-[6px] fill-gray-500">January</text>
        <text x="60" y="112" textAnchor="middle" className="text-[6px] fill-gray-500">February</text>
        <text x="100" y="112" textAnchor="middle" className="text-[6px] fill-gray-500">March</text>
        <text x="140" y="112" textAnchor="middle" className="text-[6px] fill-gray-500">April</text>
        <text x="180" y="112" textAnchor="middle" className="text-[6px] fill-gray-500">May</text>
        <text x="220" y="112" textAnchor="middle" className="text-[6px] fill-gray-500">June</text>
        <text x="260" y="112" textAnchor="middle" className="text-[6px] fill-gray-500">July</text>
      </svg>
    </div>
  </div>
);

/*
  Komponen Kartu Top Performing Links
*/
const TopPerformingLinksCard = () => (
  <div className="p-6 bg-white rounded-2xl shadow-sm lg:col-span-3 xl:col-span-2">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Top Performing Links
      </h3>
      <DropdownButton text="Latest" />
    </div>
    <div className="space-y-4">
      <LinkItem
        iconBg="bg-green-100"
        iconColor="text-green-600"
        link="short.link/iau12"
        stats="5.1K Views / $22.95 / $1 CPM"
      />
      <LinkItem
        iconBg="bg-red-100"
        iconColor="text-red-600"
        link="short.link/mULyOn0"
      />
      <LinkItem
        iconBg="bg-green-100"
        iconColor="text-green-600"
        link="short.link/w1W0k12"
      />
      <LinkItem
        iconBg="bg-green-100"
        iconColor="text-green-600"
        link="short.link/gatot"
      />
    </div>
  </div>
);

/*
  Komponen Item Link
  Satu baris di dalam kartu Top Performing Links.
*/
const LinkItem = ({ iconBg, iconColor, link, stats }) => (
  <div className="flex flex-wrap items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-full ${iconBg}`}>
        <Link size={16} className={iconColor} />
      </div>
      <div>
        <p className="font-medium text-gray-800">{link}</p>
        {stats && <p className="text-sm text-gray-500">{stats}</p>}
      </div>
    </div>
    <div className="flex items-center space-x-2 text-gray-500 mt-2 sm:mt-0">
      <button className="p-1 rounded hover:bg-gray-100">
        <MessageCircle size={18} />
      </button>
      <button className="p-1 rounded hover:bg-gray-100">
        <Copy size={18} />
      </button>
      <button className="p-1 rounded hover:bg-gray-100">
        <MoreVertical size={18} />
      </button>
    </div>
  </div>
);

/*
  Komponen Earning Stat
  Kartu kecil di dalam "Top Earning".
*/
const EarningStat = ({ title, value, period }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    <p className="mt-1 text-xs text-gray-400">{period}</p>
  </div>
);

/*
  Komponen Kartu Referral
*/
const ReferralCard = () => (
  <div className="p-6 bg-white rounded-2xl shadow-sm lg:col-span-2 xl:col-span-1">
    <h3 className="text-lg font-semibold text-gray-800">Referral</h3>
    <div className="flex items-center justify-between p-4 my-4 bg-indigo-50 rounded-lg">
      <div>
        <p className="text-sm text-gray-500">Your referral</p>
        <p className="font-semibold text-indigo-700">m45RUsd1</p>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-1 text-indigo-600 rounded hover:bg-indigo-100"><Users size={20} /></button>
        <button className="p-1 text-indigo-600 rounded hover:bg-indigo-100"><Copy size={20} /></button>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex space-x-2">
        {/* Ikon sosial media - menggunakan SVG inline sederhana untuk WhatsApp */}
        <button className="p-2 text-white bg-green-500 rounded-full hover:bg-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.0-5.525 4.479-10 10.001-10 2.725 0 5.291 1.056 7.276 3.041 1.983 1.984 3.039 4.551 3.04 7.276-.0 5.525-4.479 10-10.001 10-2.098 0-4.143-.547-5.946-1.587l-6.163 1.687zM5.448 19.169l.341.202c1.628.973 3.493 1.502 5.398 1.502 4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8c0 2.066.782 3.98 2.092 5.48.299.345.419.78.341 1.21l-.55 1.996 2.046-.532.396-.103z" /></svg>
        </button>
        {/* Facebook */}
        <button className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.294h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
        </button>
        {/* Instagram */}
        <button className="p-2 text-white bg-pink-500 rounded-full hover:bg-pink-600">
         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.227-1.669 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.148-3.227 1.669-4.771 4.919 4.919 1.266-.058 1.646.07 4.85.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.058 1.281-.072 1.689-.072 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.44-.645 1.44-1.44s-.645-1.44-1.44-1.44z" /></svg>
        </button>
      </div>
      <button className="p-1 text-gray-500 rounded hover:bg-gray-100">
        <MoreVertical size={20} />
      </button>
    </div>
    <div className="flex items-center justify-between p-4 mt-4 bg-gray-50 rounded-lg">
      <div>
        <p className="text-sm text-gray-500">Users</p>
        <p className="text-2xl font-bold text-gray-900">20</p>
      </div>
      <a
        href="#"
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        All Details &rarr;
      </a>
    </div>
  </div>
);

/*
  Komponen Tombol Dropdown
  Tombol sederhana dengan teks dan ikon chevron.
*/
const DropdownButton = ({ text }) => (
  <button className="flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200">
    {text}
    <ChevronDown size={16} className="ml-1" />
  </button>
);

/*
  Komponen Footer Dashboard
  Tautan di bagian bawah halaman.
*/
const DashboardFooter = () => (
  <footer className="flex flex-col items-center justify-between px-6 py-4 border-t bg-white md:flex-row md:px-8 lg:px-10">
    <div className="flex flex-wrap justify-center space-x-4 text-sm text-gray-500">
      <a href="#" className="hover:underline">
        Terms Of Services
      </a>
      <a href="#" className="hover:underline">
        Privacy Policy
      </a>
      <a href="#" className="hover:underline">
        About
      </a>
      <a href="#" className="hover:underline">
        Contact
      </a>
      <a href="#" className="hover:underline">
        Report Abuse
      </a>
    </div>
    <div className="flex mt-4 space-x-3 text-gray-500 md:mt-0">
      <a
        href="#"
        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
      >
        <MessageCircle size={16} />
      </a>
      <a
        href="#"
        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
      >
        <Copy size={16} />
      </a>
      <a
        href="#"
        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
      >
        <MoreVertical size={16} />
      </a>
    </div>
  </footer>
);