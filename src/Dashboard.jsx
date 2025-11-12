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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const ChevronDownIcon = ({ ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6" /></svg>);
const ChevronDownIcons = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"></path></svg>;
const MoreVerticalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>;


const formatCurrency = (amount) => `$${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatPercentage = (num) => `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
const formatNumber = (num) => (num || 0).toLocaleString('en-US');

const trends = [
  {
    clicks: 14,
    date: "2025-11-05",
    earnings: 2.5,
    valid_clicks: 12
  },
  {
    clicks: 10,
    date: "2025-11-06",
    earnings: 1.5,
    valid_clicks: 7
  },
  {
    clicks: 5,
    date: "2025-11-07",
    earnings: 0.5,
    valid_clicks: 2
  }

]

const initialLinks = [
  {
    id: 1,
    date: '11 Oct 2025, 8:25 PM',
    shortLink: 'short.link/w1W0K12',
    isProtected: false,
    destinationLink: 'https://preline.co/examples/html/hero-sections.html',
    dateExpired: '11 Oct 2025, 8:25 PM',
    totalClick: '2.1K',
    validClick: '2.1K',
    isExpanded: false,
    cpm: 1.45,
    earnings: 3.5,
    views: 169,
  },
  {
    id: 2,
    date: '10 Oct 2025, 8:20 AM',
    shortLink: 'short.link/wongirengjembuten635',
    isProtected: true,
    destinationLink: 'https://preline.co/examples/html/hero-sections.html',
    dateExpired: '11 Oct 2025, 8:25 PM',
    totalClick: '3.5K',
    validClick: '3.2K',
    isExpanded: true,
    cpm: 1,
    earnings: 2,
    views: 100,
  },
];

const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { ref, isOpen, setIsOpen };
};

const chartLabels = trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short' }));

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
    <div className="flex min-h-screen bg-slate-50 font-sans">
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
      className={`flex flex-col lg:relative
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
          className={`text-2xl font-bold text-indigo-600 whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'block' : 'hidden'
            } ${!isSidebarOpen && 'lg:hidden' // Sembunyikan di desktop saat diciutkan
            }`}
        >
          Shortenlinks
        </h1>
        {/* Logo Ikon saat tertutup */}
        <div
          className={`text-indigo-600 ${isSidebarOpen ? 'hidden' : 'block'
            } ${!isSidebarOpen && 'lg:block' // Tampilkan di desktop saat diciutkan
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
        <MenuItem
          icon={<Link size={20} />}
          text="New Link"
          isOpen={isSidebarOpen}
        />
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
      </nav>

      {/* Tombol Toggle Sidebar (HANYA DESKTOP) */}
      <div className="hidden lg:flex items-center justify-start ps-4 mt-4 border-t border-gray-200">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 p-3 rounded-full hover:bg-indigo-100 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          title={isSidebarOpen ? 'Perkecil sidebar' : 'Perluas sidebar'}
        >
          {isSidebarOpen ? (
            <ChevronsLeft size={20} />
          ) : (
            <ChevronsRight size={20} />
          )}
        </button>
      </div>
      {/* Bagian Bawah Sidebar (Footer) */}
      <div className="px-3 py-6 border-t">
        <MenuItem
          icon={<LogOut size={20} />}
          text="Log Out"
          isOpen={isSidebarOpen}
        />
        <div
          className={`flex items-center ${isSidebarOpen
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
    className={`group overflow-hidden flex items-center px-4 py-2.5 rounded-lg
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
          absolute left-full tops-1/2 -translates-y-1/2 ml-3
          whitespace-nowrap rounded-md bg-white px-2 py-2 text-base text-gray-900 shadow-lg
          z-[99] pointer-events-none

          before:content-[''] before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2
          before:border-y-18 before:border-y-transparent
          before:border-r-14 before:border-r-white
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
      <main className="flex-1 p-6 md:p-8 lg:px-10 lg:py-4">
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
  <header className="flex items-center justify-between md:px-8 lg:px-10 sticky top-0 z-10 backdrop-blur-sm">
    {/* Sisi Kiri Header: Tombol Menu dan Statistik */}
    <div className='bg-red-500 px-6 py-5 flex w-full mt-4 items-center bg-white justify-between order-2 border-gray-200 shadow-sm rounded-xl'>
      <div className="flex items-center space-x-6">
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
          styles="border-r-2 border-gray-300"
        />
        <HeaderStat
          icon={<DollarSign size={20} className="text-green-500" />}
          title="Payout"
          value="$10,000"
          styles="border-r-2 border-gray-300"
        />
        <HeaderStat
          icon={<Target size={20} className="text-red-500" />}
          title="CPC"
          value="$1,000"
          styles=""
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
    </div>

  </header>
);

/*
  Komponen Statistik Header
  Menampilkan ikon, judul, dan nilai untuk item di header.
*/
const HeaderStat = ({ icon, title, value, styles }) => (
  <div className={`hidden pe-5 ${styles} md:flex md:flex-col`}>
    <p className="text-sm text-gray-500">{title}</p>
    <div className='flex space-x-3 mt-2 items-center'>
      <span className="rounded-full">{icon}</span>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const StatCard = ({ title, value, change, changeTrend, comparisonText, reportsLinkText }) => {
  const isPositive = changeTrend === 'up';
  const trendColor = isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  return (
    <div className="bg-white shadow-sm lg:col-span-3 xl:col-span-2 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="text-gray-500 text-md">{title}</h3>
        <p className="text-3xl mt-8 text-purple-800 font-bold my-2">{value}</p>
        <div className="flex items-center text-xs">
          <span className={`px-2 py-0.5 rounded-full ${trendColor}`}>
            {formatPercentage(change)}
          </span>
          <span className="ml-2 text-gray-500">{comparisonText}</span>
        </div>
      </div>
      <a href="#" className="text-purple-600 text-sm font-semibold mt-4">{reportsLinkText} →</a>
    </div>
  );
};

/*
  Komponen Grid Dashboard
  Tata letak utama untuk semua kartu (cards) konten.
*/
const DashboardGrid = () => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
    {/* // <div className=""> */}

    {/* Kartu Statistik 1 */}
    <StatCard
      title="Total Earnings"
      value={formatCurrency(20.000)}
      change={80}
      changeTrend={"up"}
      comparisonText={`Compared to last daily`}
      reportsLinkText="Revenue Reports"
    />

    {/* Kartu Statistik 2 */}
    <StatCard
      title="Total Click"
      value={formatNumber(20000)}
      change={80}
      changeTrend={"up"}
      comparisonText={`Compared to last daily`}
      reportsLinkText="Revenue Reports"
    />

    {/* Kartu Valid Clicks (dengan Donut Chart) */}
    <div className="bg-white shadow-sm p-6 lg:col-span-3 xl:col-span-3 rounded-2xl border border-gray-200">
      <div className="flex justify-between items-start">
        <h3 className="text-gray-500 text-sm">Valid Clicks</h3>
        <button className="text-sm bg-purple-600 text-white font-semibold py-1.5 px-3 rounded-lg hover:bg-purple-700">+ New link</button>
      </div>
      <div className="flex items-start justify-between mt-4">
        <div className=''>
          <p className="text-3xl text-purple-800 font-bold my-2">{formatNumber(90)} <span className={`text-xs px-2 py-0.5 rounded-full ${80 >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{formatPercentage(90)}</span></p>
          <p className="text-xs text-gray-500">You closed out last week</p>
        </div>
        <CircularProgress percentage={90} />
      </div>
      <div className='flex w-full justify-between'>
        <a href="#" className="text-purple-600 text-sm font-semibold">All Details →</a>
        <p className="text-xs text-gray-500 mt-1">Target Clicks Achieved</p>
      </div>
    </div>


    {/* Kartu Click Analytics (Line Chart) */}
    <ClickAnalyticsCard />

    {/* Kartu Top Performing Links */}
    <TopPerformingLinksCard />

    {/* Kartu Top Earning */}
    <div className="p-6 bg-white rounded-2xl shadow-sm lg:col-span-4">
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
// const StatCard = ({
//   title,
//   value,
//   change,
//   changeType,
//   period,
//   linkText,
//   icon,
// }) => (
//   <div className="p-6 bg-white rounded-2xl shadow-sm">
//     <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//     <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
//     <div className="flex flex-wrap items-center justify-between mt-4">
//       <p
//         className={`flex items-center text-sm ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'
//           }`}
//       >
//         <span
//           className={`flex items-center px-2 py-0.5 ${changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'
//             } rounded-full`}
//         >
//           {icon || <ArrowUpRight size={16} />} {change}
//         </span>
//       </p>
//       <span className="mt-1 text-sm text-gray-500 sm:mt-0">{period}</span>
//     </div>
//     <a
//       href="#"
//       className="block mt-4 text-sm font-medium text-indigo-600 hover:underline"
//     >
//       {linkText} &rarr;
//     </a>
//   </div>
// );

/*
  Komponen Kartu Click Analytics (Mock Chart)
*/
const ClickAnalyticsCard = () => (
  <div className="lg:col-span-3 xl:col-span-4 bg-white p-6 rounded-2xl border border-gray-200">
    <div className="flex justify-between text-gray-600 items-center mb-4"><h3 className="font-bold text-lg">Click Analytics</h3><div className="flex items-center space-x-2"><button className="text-sm text-gray-600">Monthly <ChevronDownIcon className="inline h-4 w-4" /></button><button className="text-gray-400">☰</button></div></div>
    <div className="h-64 flex">
      {/* <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                                      <line x1="0" y1="180" x2="500" y2="180" stroke="#e5e7eb" strokeWidth="1" /><line x1="0" y1="140" x2="500" y2="140" stroke="#e5e7eb" strokeWidth="1" /><line x1="0" y1="100" x2="500" y2="100" stroke="#e5e7eb" strokeWidth="1" /><line x1="0" y1="60" x2="500" y2="60" stroke="#e5e7eb" strokeWidth="1" /><line x1="0" y1="20" x2="500" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                                      <path d={svgPath} fill="none" stroke="#8b5cf6" strokeWidth="2" />
                                      <path d={`${svgPath} L 500 180 L 0 180 Z`} fill="url(#gradient)" />
                                      <defs><linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></linearGradient></defs>
                                  </svg> */}
      <ResponsiveContainer>
        <LineChart data={trends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="earnings" stroke="#10b981" name="Earnings ($)" />
          <Line type="monotone" dataKey="clicks" stroke="#3b82f6" name="Clicks" />
          <Line type="monotone" dataKey="valid_clicks" stroke="#f59e0b" name="Valid Clicks" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
      {chartLabels.map((label, i) => <span key={`${label}-${i}`}>{label}</span>)}
    </div>
  </div>
);

const CircularProgress = ({ percentage }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-30 h-30">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
        <circle className="text-purple-600" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease 0s', transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-purple-700">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

/*
  Komponen Kartu Top Performing Links
*/
const TopPerformingLinksCard = () => {
  const [links, setLinks] = useState(initialLinks);
  // kalau belum dipakai, hapus saja baris berikut atau pakai sesuai kebutuhan:
  // const { ref: sortDropdownRef, isOpen: isSortOpen, setIsOpen: setIsSortOpen } = useDropdown();

  const toggleLinkExpand = (id) => {
    setLinks(prev =>
      prev.map(link =>
        link.id === id ? { ...link, isExpanded: !link.isExpanded } : link
      )
    );
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm lg:col-span-3 xl:col-span-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Top Performing Links
        </h3>
        <DropdownButton text="Latest" />
      </div>

      <div className="">
        {links.map(link => (
          <LinkItem
            key={link.id}
            link={link}
            toggleLinkExpand={toggleLinkExpand}
          />
        ))}
      </div>
    </div>
  );
};

/*
  Komponen Item Link
  Satu baris di dalam kartu Top Performing Links.
*/
// const LinkItem = ({  }) => {

//   return (
//     <div className="flex flex-wrap items-center justify-between">
//       <div className="flex items-center space-x-3">
//         <div className={`p-2 rounded-full ${iconBg}`}>
//           <Link size={16} className={iconColor} />
//         </div>
//         <div>
//           <p className="font-medium text-gray-800">{link}</p>
//           {stats && <p className="text-sm text-gray-500">{stats}</p>}
//         </div>
//       </div>
//       <div className="flex items-center space-x-2 text-gray-500 mt-2 sm:mt-0">
//         <button className="p-1 rounded hover:bg-gray-100">
//           <MessageCircle size={18} />
//         </button>
//         <button className="p-1 rounded hover:bg-gray-100">
//           <Copy size={18} />
//         </button>
//         <button className="p-1 rounded hover:bg-gray-100">
//           <MoreVertical size={18} />
//         </button>
//       </div>
//     </div>
//   )

// };

const LinkItem = ({ link, toggleLinkExpand }) => {
  return (
    <div className="rounded-xl px-4 py-3 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Bagian kiri: ikon & info */}
        <div className="flex items-center gap-4">
          <Link size={20} className="bg-green-500 w-8 h-8 p-2 rounded-full text-white" />

          <div>
            <p className="text-xs text-gray-400">{link.date}</p>
            <p className="font-medium text-gray-500 overflow-hidden text-ellipsis">
              {link.shortLink}
            </p>
          </div>
        </div>

        {/* Bagian kanan: tombol & ikon */}
        <div className="flex items-center gap-3 text-gray-400">
          <MessageCircle />
          <button className="hover:text-white">
            <MoreVerticalIcon />
          </button>

          {/* Tombol dropdown */}
          <button onClick={() => toggleLinkExpand(link.id)}>
            <ChevronDownIcon
              className={`transition-transform duration-300 ${link.isExpanded ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>
      </div>

      {/* Animasi dropdown pakai AnimatePresence */}
      <AnimatePresence>
        {link.isExpanded && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="mt-2 ms-13 flex gap-1 text-gray-500 border-b pb-5 border-gray-300 overflow-hidden"
          >
            <p>{link.views} views / </p>
            <p>$ {link.earnings} / </p>
            <p>$ {link.cpm} CPM</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


/*
  Komponen Earning Stat
  Kartu kecil di dalam "Top Earning".
*/
const EarningStat = ({ title, value, period }) => (
  <div className="p-6 rounded-lg inset-shadow-sm inset-shadow-gray-300/50">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="mt-4 text-purple-900 text-2xl font-bold text-gray-900">{value}</p>
    <p className="mt-1 text-xs text-gray-400">{period}</p>
  </div>
);

/*
  Komponen Kartu Referral
*/
const ReferralCard = () => (
  <div className="p-6 bg-white rounded-2xl shadow-sm lg:col-span-2 xl:col-span-3">
    <div className='flex justify-between px-7'>
      <h3 className="text-lg font-semibold text-gray-800">Referral</h3>
      <p className="font-bold text-gray-700">Users</p>
    </div>


    <div className='grid items-center grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
      <div className="flex lg:col-span-2 items-center justify-between p-4 my-4 inset-shadow-sm inset-shadow-gray-300/50 rounded-lg">
        <Users className='text-gray-800' size={20} />
        <div>
          <p className="text-sm text-gray-500">Your referral</p>
          <p className="font-semibold text-indigo-700">m45RUsd1</p>
        </div>
        <Copy className='text-gray-800' size={20} />
      </div>
      <div className='lg:col-span-1 rounded-lg inset-shadow-sm text-center inset-shadow-gray-300/50'>
        <p className="text-2xl font-bold text-gray-900 p-5">20</p>
      </div>
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
    {/* <div className="flex mt-4 space-x-3 text-gray-500 md:mt-0">
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
    </div> */}
  </footer>
);