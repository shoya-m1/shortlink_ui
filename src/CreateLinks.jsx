import { useState, useEffect, useRef } from 'react';

// --- Komponen Ikon (SVG dari Lucide/Feather Icons) ---
// Saya sertakan semua ikon yang dibutuhkan di sini agar file tetap tunggal.

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>;
const PlusSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><line x1="12" x2="12" y1="8" y2="16"></line><line x1="8" x2="16" y1="12" y2="12"></line></svg>;
const UnlockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>;
const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M12 8v4l2 2"></path></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>;
const ChevronDownIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"></path></svg>;
const MoreVerticalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46V19l4 2v-8.54L22 3"></polygon></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;


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
        isExpanded: false
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
    },
];

// Custom Dropdown Hook
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

export default function CreateLinks() {
    const [activeLink, setActiveLink] = useState('My links');
    const [myLinksOpen, setMyLinksOpen] = useState(true);
    const [links, setLinks] = useState(initialLinks);
    const { ref: sortDropdownRef, isOpen: isSortOpen, setIsOpen: setIsSortOpen } = useDropdown();

    const toggleLinkExpand = (id) => {
        setLinks(links.map(link =>
            link.id === id ? { ...link, isExpanded: !link.isExpanded } : link
        ));
    };

    const NavItem = ({ icon, label, hasSub, isSub, isActive, onClick }) => (
        <a href="#" onClick={onClick} className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${isActive ? 'bg-[#4f46e5] text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'} ${isSub ? 'pl-10' : ''}`}>
            <div className="flex items-center gap-4">
                {icon}
                <span>{label}</span>
            </div>
            {hasSub && <ChevronDownIcon className={`transition-transform duration-300 ${myLinksOpen ? 'rotate-180' : ''}`} />}
        </a>
    );

    return (
        <div className="bg-[#1a1c2e] text-white min-h-screen font-sans flex">
            {/* --- Sidebar --- */}
            <aside className="w-72 bg-[#24263a] p-6 flex-shrink-0 flex flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-10">Shortenlinks</h1>
                    <nav className="space-y-2">
                        <NavItem icon={<HomeIcon />} label="Dashboard" isActive={activeLink === 'Dashboard'} onClick={() => setActiveLink('Dashboard')} />
                        <NavItem icon={<LinkIcon />} label="My links" hasSub isActive={activeLink === 'My links'} onClick={() => { setActiveLink('My links'); setMyLinksOpen(!myLinksOpen); }} />
                        {myLinksOpen && (
                            <div className="flex flex-col space-y-2">
                                <NavItem icon={<PlusSquareIcon />} label="New link" isSub isActive={activeLink === 'New link'} onClick={() => setActiveLink('New link')} />
                                <NavItem icon={<UnlockIcon />} label="Subs4unlock.id" isSub isActive={activeLink === 'Subs4unlock.id'} onClick={() => setActiveLink('Subs4unlock.id')} />
                            </div>
                        )}
                        <NavItem icon={<BarChartIcon />} label="Analytics" isActive={activeLink === 'Analytics'} onClick={() => setActiveLink('Analytics')} />
                        <NavItem icon={<UsersIcon />} label="Referral" isActive={activeLink === 'Referral'} onClick={() => setActiveLink('Referral')} />
                        <NavItem icon={<DollarSignIcon />} label="Withdrawal" isActive={activeLink === 'Withdrawal'} onClick={() => setActiveLink('Withdrawal')} />
                        <NavItem icon={<HistoryIcon />} label="History" isActive={activeLink === 'History'} onClick={() => setActiveLink('History')} />
                    </nav>
                </div>
                <div className="space-y-4">
                     <NavItem icon={<LogOutIcon />} label="Log Out" />
                     <div className="w-12 h-12 bg-gray-500 rounded-full"></div>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-4 bg-[#24263a] p-4 rounded-xl">
                            <div className="bg-[#343750] p-2 rounded-lg"><DollarSignIcon /></div>
                            <div>
                                <p className="text-sm text-gray-400">Balance</p>
                                <p className="font-bold text-lg">$80,210</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4 bg-[#24263a] p-4 rounded-xl">
                            <div className="bg-[#343750] p-2 rounded-lg"><DollarSignIcon /></div>
                            <div>
                                <p className="text-sm text-gray-400">Payout</p>
                                <p className="font-bold text-lg">$10,000</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4 bg-[#24263a] p-4 rounded-xl">
                            <div className="bg-[#343750] p-2 rounded-lg"><DollarSignIcon /></div>
                            <div>
                                <p className="text-sm text-gray-400">CPC</p>
                                <p className="font-bold text-lg">$1,000</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-gray-400">
                        <button className="hover:text-white"><SunIcon /></button>
                        <button className="hover:text-white"><BellIcon /></button>
                    </div>
                </header>

                <div className="bg-[#24263a] p-8 rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Create Shortlink</h2>
                        <button className="text-sm bg-[#343750] px-4 py-2 rounded-lg hover:bg-gray-600">+ Advanced Options</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Poste your url here..." className="bg-[#343750] p-4 rounded-lg border-none focus:ring-2 focus:ring-[#4f46e5] outline-none" />
                        <input type="text" placeholder="Enter alias..." className="bg-[#343750] p-4 rounded-lg border-none focus:ring-2 focus:ring-[#4f46e5] outline-none" />
                        <input type="text" placeholder="Enter password link..." className="bg-[#343750] p-4 rounded-lg border-none focus:ring-2 focus:ring-[#4f46e5] outline-none" />
                        <div className="relative">
                            <input type="text" placeholder="Enter expired date..." className="w-full bg-[#343750] p-4 rounded-lg border-none focus:ring-2 focus:ring-[#4f46e5] outline-none" />
                            <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <button className="w-full bg-[#4f46e5] flex items-center justify-center gap-2 p-4 rounded-lg font-semibold hover:bg-indigo-700 transition">
                        <span>Generate Shortlink</span> <LinkIcon />
                    </button>
                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <div className="flex items-center justify-between bg-[#1a1c2e] p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                                <LinkIcon className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Your Link</p>
                                    <p className="font-semibold">short.link/baik112</p>
                                </div>
                            </div>
                            <button className="p-2 bg-[#343750] rounded-md hover:bg-gray-600"><CopyIcon /></button>
                        </div>
                        <div className="flex items-center justify-between bg-[#1a1c2e] p-3 rounded-lg">
                             <div className="flex items-center gap-3">
                                <TargetIcon className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Destination Link</p>
                                    <p className="font-semibold">short.link/baik112</p>
                                </div>
                            </div>
                            <button className="p-2 bg-[#343750] rounded-md hover:bg-gray-600"><CopyIcon /></button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative w-1/3">
                            <input type="text" placeholder="Search..." className="w-full bg-[#24263a] p-3 pl-10 rounded-lg border-none focus:ring-2 focus:ring-[#4f46e5] outline-none" />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div ref={sortDropdownRef} className="relative">
                                <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 bg-[#24263a] p-3 rounded-lg hover:bg-gray-700">
                                    <span>Newest</span>
                                    <ChevronDownIcon className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isSortOpen && (
                                     <div className="absolute top-full right-0 mt-2 w-40 bg-[#343750] rounded-lg shadow-lg z-10">
                                         <a href="#" className="block px-4 py-2 hover:bg-gray-600 rounded-t-lg">Newest</a>
                                         <a href="#" className="block px-4 py-2 hover:bg-gray-600">Oldest</a>
                                         <a href="#" className="block px-4 py-2 hover:bg-gray-600 rounded-b-lg">By Click</a>
                                     </div>
                                )}
                            </div>
                            <button className="flex items-center gap-2 bg-[#24263a] p-3 rounded-lg hover:bg-gray-700">
                                <FilterIcon />
                                <span>Filter</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {links.map(link => (
                            <div key={link.id} className="bg-[#24263a] rounded-xl p-4 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-[#343750] rounded-lg"><LinkIcon /></div>
                                        <div>
                                            <p className="text-xs text-gray-400">{link.date}</p>
                                            <p className="font-semibold text-lg">{link.shortLink}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-gray-400">
                                        {link.isProtected && <LockIcon />}
                                        <div className="w-5 h-5 border-2 border-gray-500 rounded-full"></div>
                                        <button className="hover:text-white"><MoreVerticalIcon /></button>
                                        <button onClick={() => toggleLinkExpand(link.id)}>
                                            <ChevronDownIcon className={`transition-transform duration-300 ${link.isExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                                {link.isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-x-8 gap-y-4">
                                        <div className="flex items-start gap-3">
                                            <MapPinIcon className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-400">Destination Link</p>
                                                <p className="font-medium">{link.destinationLink}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                             <TrendingUpIcon className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-400">Total Click</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{link.totalClick}</p>
                                                    <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">+30%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <ClockIcon className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-400">Date Expired</p>
                                                <p className="font-medium">{link.dateExpired}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                             <CheckCircleIcon className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-400">Valid Click</p>
                                                 <div className="flex items-center gap-2">
                                                    <p className="font-medium">{link.validClick}</p>
                                                     <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">+30%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
                    <div className="flex justify-center gap-6">
                        <a href="#" className="hover:text-white">Terms Of Services</a>
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">About</a>
                        <a href="#" className="hover:text-white">Contact</a>
                        <a href="#" className="hover:text-white">Report Abuse</a>
                    </div>
                </footer>
            </main>
        </div>
    );
}

