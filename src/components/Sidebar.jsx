// src/components/Sidebar.jsx
import { useState, useEffect } from 'react';
import {
    LayoutGrid, Link, PlusCircle, Globe, BarChart2, Users,
    CreditCard, History, LogOut, UserCircle, ChevronDown,
    ChevronsLeft, ChevronsRight, Settings, Trophy
} from 'lucide-react';
import { NavLink } from 'react-router-dom'; // Gunakan NavLink untuk status aktif

// (Salin komponen MenuItem ke sini)
const MenuItem = ({ icon, text, to, isOpen, subItem = false }) => (
    <NavLink
        to={to || "#"}
        className={({ isActive }) => `group overflow-hidden flex items-center px-4 py-2.5 rounded-lg
      ${subItem ? 'text-sm' : ''}
      ${isActive ? 'bg-indigo-100 text-indigo-700 font-medium'
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
    </NavLink>
);

// (Salin komponen Sidebar ke sini)
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const [myLinksOpen, setMyLinksOpen] = useState(true);
    const [userRole, setUserRole] = useState('user');

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user && user.role) {
            setUserRole(user.role);
        }
    }, []);

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
                {/* Common Menu */}
                <MenuItem
                    icon={<LayoutGrid size={20} />}
                    text="Dashboard"
                    to={userRole === 'super_admin' ? "/super-admin/dashboard" : (userRole === 'admin' ? "/admindashboard" : "/dashboard")}
                    isOpen={isSidebarOpen}
                />

                {/* User Menu */}
                {userRole === 'user' && (
                    <>
                        <MenuItem
                            icon={<Link size={20} />}
                            text="New Link"
                            to="/createlink"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<BarChart2 size={20} />}
                            text="Analytics"
                            to="/analytics"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<Users size={20} />}
                            text="Referrals"
                            to="/referrals"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<CreditCard size={20} />}
                            text="Withdrawal"
                            to="/withdrawal"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            to="/history"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<Trophy size={20} />}
                            text="My Levels"
                            to="/levels"
                            isOpen={isSidebarOpen}
                        />
                    </>
                )}

                {/* Admin Menu */}
                {userRole === 'admin' && (
                    <>
                        <MenuItem
                            icon={<CreditCard size={20} />}
                            text="Withdrawals"
                            to="/adminwithdrawal"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<BarChart2 size={20} />}
                            text="Daily Stats"
                            to="/admin/withdrawal-stats"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<Link size={20} />}
                            text="Links"
                            to="/adminlinks"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<Users size={20} />}
                            text="Users"
                            to="/adminuserlist"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<Settings size={20} />}
                            text="Settings"
                            to="/adminsetingrates"
                            isOpen={isSidebarOpen}
                        />
                    </>
                )}

                {/* Super Admin Menu */}
                {userRole === 'super_admin' && (
                    <>
                        <MenuItem
                            icon={<Users size={20} />}
                            text="Manage Admins"
                            to="/super-admin/admins"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<History size={20} />}
                            text="Withdrawal Logs"
                            to="/super-admin/withdrawal-logs"
                            isOpen={isSidebarOpen}
                        />
                        {/* Super Admin can also access Admin features if needed, or keep them separate */}
                        <MenuItem
                            icon={<CreditCard size={20} />}
                            text="Withdrawals"
                            to="/adminwithdrawal"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<BarChart2 size={20} />}
                            text="Daily Stats"
                            to="/admin/withdrawal-stats"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<Link size={20} />}
                            text="Links"
                            to="/adminlinks"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<Users size={20} />}
                            text="Users"
                            to="/adminuserlist"
                            isOpen={isSidebarOpen}
                        />
                        <MenuItem
                            icon={<Settings size={20} />}
                            text="Settings"
                            to="/adminsetingrates"
                            isOpen={isSidebarOpen}
                        />
                    </>
                )}

                <MenuItem
                    icon={<Settings size={20} />}
                    text="Settings"
                    to="/settings"
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

export default Sidebar;