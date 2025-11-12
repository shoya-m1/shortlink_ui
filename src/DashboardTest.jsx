import { useState, useEffect } from 'react';

import Notifications from "./Notifications";

import {
    getDashboardData, logoutUser, getOverviewData,
    getTrendsData
} from "./auth";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";



// --- MOCK API & HELPERS ---
// This section simulates your API calls and router.
// In your actual app, you would remove this and import your real functions.

// const MOCK_API_DATA = {
//   "dashboard": { "source": "cache", "data": { "summary": { "balance": 1000, "payout": 0, "cpc": 0.05 }, "stats": { "total_earnings": { "value": 0.25, "change_percentage": 100, "change_trend": "up", "period": "weekly" }, "total_clicks": { "value": 13, "change_percentage": -55.56, "change_trend": "down", "period": "daily" }, "valid_clicks": { "value": 10, "change_percentage": -33.33, "target_achieved": 0.03 } } } },
//   "overview": { "source": "redis", "data": { "summary": { "balance": 1000, "payout": 0, "cpc": 0.05 }, "stats": { "total_earnings": { "value": 0.25, "change_percentage": 0, "change_trend": "up", "period": "weekly" }, "total_clicks": { "value": 13, "change_percentage": 0, "change_trend": "neutral", "period": "weekly" }, "valid_clicks": { "value": 10, "change_percentage": 0, "target_achieved": 76.92307692307693 } }, "top_links": [ { "short_url": "http://localhost:8000/links/t0qe2OD", "views": 39, "earnings": 0.15, "cpm": 3.85 }, { "short_url": "http://localhost:8000/links/nQZGXLf", "views": 6, "earnings": 0.05, "cpm": 8.33 }, { "short_url": "http://localhost:8000/links/LWPA5oz", "views": 46, "earnings": 0.05, "cpm": 1.09 }, { "short_url": "http://localhost:8000/links/702Ll3R", "views": 0, "earnings": 0, "cpm": 0 } ], "top_earning": { "top_month": "October", "top_year": 2025, "top_clicks": 13 }, "referral": { "code": "QBGMNJZY", "users": 1, "referral_links": [ { "platform": "whatsapp", "url": "https://wa.me/?text=Join+using+QBGMNJZY" }, { "platform": "facebook", "url": "https://facebook.com/share?code=QBGMNJZY" }, { "platform": "instagram", "url": "https://instagram.com/share?code=QBGMNJZY" }, { "platform": "telegram", "url": "https://t.me/share/url?url=https%3A%2F%2Fshortenlinks.com%2Fref%2FQBGMNJZY" } ] }, "links": [ { "code": "702Ll3R", "total_views": 0, "unique_views": 0, "earned": 0 } ] } },
//   "trends": { "source": "redis", "data": { "period": "weekly", "link": null, "trends": [ { "date": "2025-10-14", "earnings": 0.2, "clicks": 9, "valid_clicks": 6 }, { "date": "2025-10-15", "earnings": 0.05, "clicks": 4, "valid_clicks": 4 } ] } }
// };

// const getDashboardData = () => new Promise(resolve => setTimeout(() => resolve(MOCK_API_DATA.dashboard), 500));
// const getOverviewData = () => new Promise(resolve => setTimeout(() => resolve(MOCK_API_DATA.overview), 500));
// const getTrendsData = () => new Promise(resolve => setTimeout(() => resolve(MOCK_API_DATA.trends), 500));
// const useNavigate = () => (path) => console.log(`Navigating to ${path}`);

// --- Helper Functions ---
const formatCurrency = (amount) => `$${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatNumber = (num) => (num || 0).toLocaleString('en-US');
const formatPercentage = (num) => `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
const getShortUrlCode = (url) => url.split('/').pop();


// --- Icon Components (unchanged) ---
const LogoIcon = () => (<svg height="32" width="32" viewBox="0 0 24 24" className="text-purple-600" fill="currentColor"><path d="M13.9 19.4a1 1 0 0 1-1.4 0l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 1.4L9.6 12l4.3 4.3a1 1 0 0 1 0 1.4z" /><path d="M10.1 4.6a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L14.4 12 10.1 7.7a1 1 0 0 1 0-1.4z" /></svg>);
const DashboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>);
const LinkIcon = ({ ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" /></svg>);
const AnalyticsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>);
const ReferralIcon = ({ ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>);
const WithdrawalIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" /></svg>);
const HistoryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M12 8v4l2 2" /></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>);
const SunIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>);
const BellIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>);
const ChevronDownIcon = ({ ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6" /></svg>);
const MoreVerticalIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>);


// --- Reusable UI Components (modified for dynamic props) ---
const SidebarItem = ({ icon, text, active, hasSubmenu, submenuOpen, onClick }) => (
    <li className={`rounded-md text-sm ${active ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
        <button onClick={onClick} className="w-full flex items-center justify-between py-2.5 px-4">
            <div className="flex items-center">
                {icon}
                <span className="ml-3">{text}</span>
            </div>
            {hasSubmenu && <ChevronDownIcon className={`transform transition-transform duration-200 ${submenuOpen ? 'rotate-180' : ''}`} />}
        </button>
    </li>
);

const SubmenuItem = ({ text }) => (<li><a href="#" className="block py-2 px-4 pl-11 text-sm text-gray-600 hover:bg-gray-100 rounded-md">{text}</a></li>);

const StatCard = ({ title, value, change, changeTrend, comparisonText, reportsLinkText }) => {
    const isPositive = changeTrend === 'up';
    const trendColor = isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
            <div>
                <h3 className="text-gray-500 text-sm">{title}</h3>
                <p className="text-3xl font-bold my-2">{value}</p>
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

const CircularProgress = ({ percentage }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-32 h-32">
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



// --- Main App Component ---
export default function App() {
    const [data, setData] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [myLinksOpen, setMyLinksOpen] = useState(true);
    const [userId, setUserId] = useState(null)
    // const navigate = useNavigate();

    useEffect(() => {
        async function fetchAll() {
            try {
                const [dashboard, overview, trends] = await Promise.all([
                    getDashboardData(),
                    getOverviewData(),
                    getTrendsData(),
                ]);
                setData({ dashboard, overview, trends });
                // console.log(data)
            } catch (err) {
                console.error(err);
                // Assuming err.response.status is available in a real scenario
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            }
        }
        fetchAll();
    }, []);

    useEffect(() => {
        const id = sessionStorage.getItem("id");
        setUserId(id);
    }, []);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-xl font-semibold text-gray-600">Loading Dashboard...</p>
            </div>
        );
    }

    const summary = data.dashboard.data.summary;
    const stats = data.dashboard.data.stats;
    const overview = data.overview.data;
    const trends = data.trends.data.trends;
    console.log(stats)
    console.log(overview)
    console.log(trends)

    // Process trends data for the chart
    const chartLabels = trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short' }));
    const chartDataPoints = trends.map(t => t.clicks);
    const maxClickValue = Math.max(...chartDataPoints, 1); // Avoid division by zero
    const svgPath = chartDataPoints.map((point, index) => {
        const x = (index / (chartDataPoints.length - 1)) * 500;
        const y = 180 - (point / maxClickValue) * 160; // Scale points within the viewbox
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');

    return (
        <div className="bg-slate-50 min-h-screen flex text-gray-800">
            {/* <!-- Sidebar --> */}
            <aside className={`bg-white w-64 min-h-screen flex-col border-r border-gray-200 fixed lg:static lg:translate-x-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out z-20`}>
                <div className="px-6 py-5 flex items-center"><LogoIcon /><h1 className="text-xl font-bold ml-2">Shortenlinks</h1></div>
                <nav className="flex-1 px-4 space-y-2">
                    <ul>
                        <SidebarItem icon={<DashboardIcon />} text="Dashboard" />
                        <SidebarItem icon={<LinkIcon />} text="My links" active={true} hasSubmenu={true} submenuOpen={myLinksOpen} onClick={() => setMyLinksOpen(!myLinksOpen)} />
                        {myLinksOpen && (<ul className="pl-4"><SubmenuItem text="New link" /><SubmenuItem text="Subse4unlock.id" /></ul>)}
                        <SidebarItem icon={<AnalyticsIcon />} text="Analytics" />
                        <SidebarItem icon={<ReferralIcon />} text="Referral" />
                        <SidebarItem icon={<WithdrawalIcon />} text="Withdrawal" />
                        <SidebarItem icon={<HistoryIcon />} text="History" />
                    </ul>
                </nav>
                <div className="px-4 py-4 mt-auto"><button className="w-full flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"><LogoutIcon /><span className="ml-3">Log Out</span></button><div className="w-10 h-10 rounded-full bg-gray-200 mt-4 ml-4"></div></div>
            </aside>

            {isMenuOpen && <div className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden" onClick={() => setIsMenuOpen(false)}></div>}

            <main className="flex-1">
                <header className="bg-white border-b border-gray-200 p-4 xl:p-6 flex justify-between items-center">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex items-center space-x-2"><div className="p-2 bg-gray-100 rounded-full">💰</div><div><p className="text-xs text-gray-500">Balance</p><p className="font-bold">{formatCurrency(summary.balance)}</p></div></div>
                        <div className="flex items-center space-x-2"><div className="p-2 bg-gray-100 rounded-full">💸</div><div><p className="text-xs text-gray-500">Payout</p><p className="font-bold">{formatCurrency(summary.payout)}</p></div></div>
                        <div className="flex items-center space-x-2"><div className="p-2 bg-gray-100 rounded-full">📈</div><div><p className="text-xs text-gray-500">CPC</p><p className="font-bold">{formatCurrency(summary.cpc)}</p></div></div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center"><span className="font-semibold">EN</span><ChevronDownIcon className="ml-1 h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100"><SunIcon />
                        </button>
                        <Notifications userId={userId} />
                        <button className="p-2 rounded-full hover:bg-gray-100 relative"><BellIcon /><span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-purple-600"></span>
                        </button>
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <StatCard title="Total Earnings" value={formatCurrency(stats.total_earnings.value)} change={stats.total_earnings.change_percentage} changeTrend={stats.total_earnings.change_trend} comparisonText={`Compared to last ${stats.total_earnings.period}`} reportsLinkText="Revenue Reports" />
                        <StatCard title="Total Clicks" value={formatNumber(stats.total_clicks.value)} change={stats.total_clicks.change_percentage} changeTrend={stats.total_clicks.change_trend} comparisonText={`Compared to last ${stats.total_clicks.period}`} reportsLinkText="Arrange Reports" />
                        <div className="bg-white p-6 rounded-2xl border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-gray-500 text-sm">Valid Clicks</h3>
                                    <p className="text-3xl font-bold my-2">{formatNumber(stats.valid_clicks.value)} <span className={`text-xs px-2 py-0.5 rounded-full ${stats.valid_clicks.change_percentage >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{formatPercentage(stats.valid_clicks.change_percentage)}</span></p>
                                    <p className="text-xs text-gray-500">You closed out last week</p>
                                </div>
                                <button className="text-sm bg-purple-600 text-white font-semibold py-1.5 px-3 rounded-lg hover:bg-purple-700">+ New link</button>
                            </div>
                            <div className="flex items-end justify-between mt-2">
                                <a href="#" className="text-purple-600 text-sm font-semibold">All Details →</a>
                                <div className="text-center">
                                    <CircularProgress percentage={overview.stats.valid_clicks.target_achieved} />
                                    <p className="text-xs text-gray-500 mt-1">Target Clicks Achieved</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Click Analytics</h3><div className="flex items-center space-x-2"><button className="text-sm text-gray-600">Monthly <ChevronDownIcon className="inline h-4 w-4" /></button><button className="text-gray-400">☰</button></div></div>
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

                        <div className="bg-white p-6 rounded-2xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Top Performing Links</h3><button className="text-sm text-gray-600">Latest <ChevronDownIcon className="inline h-4 w-4" /></button></div>
                            <div className="space-y-4">
                                {overview.top_links.map((link, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-green-100`}><LinkIcon className="text-green-500" /></div>
                                        <div className="ml-3 flex-1">
                                            <p className="font-semibold text-sm">short.link/{getShortUrlCode(link.short_url)}</p>
                                            <p className="text-xs text-gray-500">{`${formatNumber(link.views)} Views / ${formatCurrency(link.earnings)} / ${formatCurrency(link.cpm)} CPM`}</p>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-400"><MoreVerticalIcon /></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Top Earning</h3><button className="text-sm text-gray-600">All Time <ChevronDownIcon className="inline h-4 w-4" /></button></div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl"><p className="text-sm text-gray-500">Top Month</p><p className="text-2xl font-bold my-1 text-purple-600">{overview.top_earning.top_month}</p><p className="text-xs text-gray-500">All Time</p></div>
                                <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl"><p className="text-sm text-gray-500">Top Year</p><p className="text-2xl font-bold my-1 text-purple-600">{overview.top_earning.top_year}</p><p className="text-xs text-gray-500">All Time</p></div>
                                <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl"><p className="text-sm text-gray-500">Top Clicks</p><p className="text-2xl font-bold my-1 text-purple-600">{formatNumber(overview.top_earning.top_clicks)}</p><p className="text-xs text-gray-500">All Time</p></div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Referral</h3><div className="flex items-center"><p className="font-bold text-lg mr-2">{overview.referral.users}</p><p className="text-sm text-gray-500">Users</p></div></div>
                            <div className="bg-slate-50 border border-gray-200 p-3 rounded-xl flex items-center justify-between">
                                <div className="flex items-center"><ReferralIcon className="text-gray-500" /><p className="ml-2 font-mono text-sm">{overview.referral.code}</p></div>
                                <button className="p-2 rounded-lg bg-white shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg></button>
                            </div>
                            <div className="flex items-center justify-between mt-4"><div className="flex space-x-2"><button className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">W</button><button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">F</button><button className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center">I</button><button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><MoreVerticalIcon className="w-5 h-5" /></button></div><a href="#" className="text-purple-600 text-sm font-semibold">All Details →</a></div>
                        </div>
                    </div>

                    <footer className="text-center md:flex justify-between items-center text-sm text-gray-500 pt-4">
                        <div className="flex space-x-4 justify-center md:justify-start"><a href="#" className="hover:text-purple-600">Terms Of Service</a><a href="#" className="hover:text-purple-600">Privacy Policy</a><a href="#" className="hover:text-purple-600">About</a><a href="#" className="hover:text-purple-600">Contact</a><a href="#" className="hover:text-purple-600">Report Abuse</a></div>
                        <div className="flex space-x-4 justify-center md:justify-start mt-4 md:mt-0"><a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">S</a><a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">T</a><a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">D</a></div>
                    </footer>
                </div>
            </main>
        </div>
    );
}

