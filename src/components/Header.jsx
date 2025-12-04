// src/components/Header.jsx
import {
    Menu, Wallet, DollarSign, Target, Languages, Sun, Bell
} from 'lucide-react';
import Notification from '../Notifications';


// (Salin komponen HeaderStat ke sini)
const HeaderStat = ({ icon, title, value, styles }) => (
    <div className={`hidden pe-5 ${styles} md:flex md:flex-col`}>
        <p className="text-sm text-gray-500">{title}</p>
        <div className='flex space-x-3 mt-2 items-center'>
            <span className="rounded-full">{icon}</span>
            <p className="font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

// (Salin komponen Header ke sini)
const Header = ({ toggleSidebar }) => (
    <header className="flex items-center justify-between px-2 md:px-6 sticky top-0 z-10 backdrop-blur-sm">
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
                />
            </div>

            {/* Sisi Kanan Header: Kontrol Pengguna */}
            <div className="flex items-center space-x-4 md:space-x-6">
                <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100">
                    <Sun size={20} />
                    {/* <Moon size={20} /> */}
                </button>
                <button className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100">
                    {/* <Bell size={20} /> */}
                    <Notification />
                    {/* Notifikasi dot */}
                    {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span> */}
                </button>
            </div>
        </div>

    </header>
);

export default Header;