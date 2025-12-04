import { useState, useEffect } from 'react';
import {
  Link,
  Users,
  ChevronDown,
  Copy,
  Info, AlertTriangle, CheckCircle, XCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { getOverviewData, getTrendsData, getDashboardMessages } from './auth'; // Import from auth.js

const ChevronDownIcon = ({ ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6" /></svg>);

const formatCurrency = (amount) => `$${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
const formatPercentage = (num) => `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
const formatNumber = (num) => (num || 0).toLocaleString('en-US');

export default function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Overview Data using service
        const overviewRes = await getOverviewData('weekly');
        setDashboardData(overviewRes.data);

        // Fetch Chart Data (Weekly) using service
        const chartRes = await getTrendsData('weekly');
        setChartData(chartRes.data.trends);

        // Fetch Dashboard Messages
        const msgRes = await getDashboardMessages();
        setMessages(msgRes.data);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="p-8 text-center text-red-500">Failed to load data.</div>;
  }

  const { summary, stats, top_links, referral } = dashboardData;

  return (
    <div className="grid grid-cols-1 gap-3 grid-cols-4 lg:grid-cols-7">

      {/* Dashboard Messages Carousel */}
      {messages.length > 0 && (
        <div className="col-span-4 lg:col-span-7 mb-2">
          <MessageCarousel messages={messages} />
        </div>
      )}

      <StatCard
        title="Total Earnings"
        value={formatCurrency(stats.total_earnings.value)}
        change={stats.total_earnings.change_percentage}
        changeTrend={stats.total_earnings.change_trend}
        comparisonText={`Compared to last week`}
      />

      <StatCard
        title="Total Click"
        value={formatNumber(stats.total_clicks.value)}
        change={stats.total_clicks.change_percentage}
        changeTrend={stats.total_clicks.change_trend}
        comparisonText={`Compared to last week`}
      />

      <div className="bg-white shadow-sm p-6 col-span-4 md:col-span-2 lg:col-span-3 xl:col-span-3 rounded-2xl border border-gray-200">
        <div className="flex justify-between items-start">
          <h3 className="text-gray-500 text-sm">Valid Clicks</h3>
          {/* <button className="text-sm bg-purple-600 text-white font-semibold py-1.5 px-3 me-3 rounded-lg hover:bg-purple-700">+ New link</button> */}
        </div>
        <div className="flex items-start justify-between mt-4">
          <div className=''>
            <p className="text-3xl text-purple-800 font-bold my-2">{formatNumber(stats.valid_clicks.value)}</p>
            <p className="text-xs text-gray-500">Valid clicks this week</p>
          </div>
          <div>
            <CircularProgress percentage={stats.valid_clicks.target_achieved} />
            <p className="text-xs text-gray-500 mt-1">Efficiency</p>
          </div>
        </div>
      </div>


      <ClickAnalyticsCard data={chartData} />

      <TopPerformingLinksCard links={top_links} />

      <ReferralCard referral={referral} />
    </div>
  );
}

const MessageCarousel = ({ messages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 5000); // Auto slide every 5 seconds
    return () => clearInterval(interval);
  }, [messages.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const currentMessage = messages[currentIndex];

  const getTypeStyles = (type) => {
    switch (type) {
      case 'latest': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: <Info size={20} className="text-blue-600" /> };
      case 'warning': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: <AlertTriangle size={20} className="text-yellow-600" /> };
      case 'event': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: <CheckCircle size={20} className="text-green-600" /> };
      case 'important': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: <XCircle size={20} className="text-red-600" /> };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', icon: <Info size={20} /> };
    }
  };

  const styles = getTypeStyles(currentMessage.type);

  return (
    <div className={`relative rounded-2xl border ${styles.border} ${styles.bg} p-4 transition-colors duration-300`}>
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">{styles.icon}</div>
        <div className="flex-1">
          <h3 className={`font-semibold ${styles.text}`}>{currentMessage.title}</h3>
          <p className={`text-sm mt-1 ${styles.text} opacity-90`}>{currentMessage.content}</p>
          {currentMessage.link && (
            <a href={currentMessage.link} target="_blank" rel="noopener noreferrer" className={`text-sm mt-2 inline-block font-medium underline ${styles.text}`}>
              Check it out &rarr;
            </a>
          )}
        </div>
      </div>

      {messages.length > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 right-2 flex flex-col gap-1 opacity-50 hover:opacity-100 transition-opacity">
          <button onClick={prevSlide} className="p-1 hover:bg-black/5 rounded-full"><ChevronLeft size={16} /></button>
          <button onClick={nextSlide} className="p-1 hover:bg-black/5 rounded-full"><ChevronRight size={16} /></button>
        </div>
      )}

      {messages.length > 1 && (
        <div className="absolute bottom-2 right-4 flex gap-1">
          {messages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-gray-600 w-3' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, change, changeTrend, comparisonText }) => {
  const isPositive = changeTrend === 'up';
  const trendColor = isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  return (
    <div className="bg-white shadow-sm col-span-4 md:col-span-1 lg:col-span-2 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="text-gray-500 text-md">{title}</h3>
        <p className="text-3xl mt-8 text-purple-800 font-bold my-2">{value}</p>
        <div className="flex flex-wrap items-center text-xs">
          <span className={`px-2 py-0.5 rounded-full ${trendColor}`}>
            {formatPercentage(change)}
          </span>
          <span className="ml-2 text-gray-500">{comparisonText}</span>
        </div>
      </div>
    </div>
  );
};

const ClickAnalyticsCard = ({ data }) => {
  // Format date for XAxis if needed, or rely on data.label from API if available
  // The API returns 'date' (YYYY-MM-DD) and 'label' (formatted). Let's use 'label' if available, or format 'date'.

  return (
    <div className="col-span-4 bg-white p-4 md:p-6 rounded-2xl border border-gray-200">
      <div className="flex md:justify-between justify-center text-gray-600 items-center mb-4">
        <h3 className="font-bold text-lg ">Weekly Statistics</h3>
      </div>
      <div className="h-64 w-full flex">
        <ResponsiveContainer >
          <LineChart className="-ms-3 md:ms-0" data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" /> {/* Use 'label' from API which is formatted */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="earnings" stroke="#10b981" name="Earnings ($)" />
            <Line type="monotone" dataKey="clicks" stroke="#3b82f6" name="Clicks" />
            <Line type="monotone" dataKey="valid_clicks" stroke="#f59e0b" name="Valid Clicks" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

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


const TopPerformingLinksCard = ({ links }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleLinkExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm col-span-4 lg:col-span-4 xl:col-span-4">
      <div className="flex items-center md:justify-between justify-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Top 10 Links (Valid Clicks)
        </h3>
      </div>

      <div className="">
        {links.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No links found.</p>
        ) : (
          links.map(link => (
            <LinkItem
              key={link.id}
              link={link}
              isExpanded={expandedId === link.id}
              toggleLinkExpand={toggleLinkExpand}
            />
          ))
        )}
      </div>
    </div>
  );
};

const LinkItem = ({ link, isExpanded, toggleLinkExpand }) => {
  return (
    <div className="rounded-xl px-1 md:px-4 py-3 transition-all duration-300 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between">
        {/* Bagian kiri: ikon & info */}
        <div className="flex items-center gap-4">
          <Link size={20} className="bg-green-500 w-8 h-8 p-2 rounded-full text-white" />

          <div>
            <p className="text-xs text-gray-400">{link.created_at}</p>
            <p className="font-medium text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-42 md:max-w-92 lg:max-w-42 xl:max-w-62">
              <a href={link.short_url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">
                {link.short_url}
              </a>
            </p>

          </div>
        </div>

        {/* Bagian kanan: tombol & ikon */}
        <div className="flex items-center gap-3 text-gray-400">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500 font-bold">{formatNumber(link.valid_views)} Valid Clicks</p>
          </div>
          <button onClick={() => toggleLinkExpand(link.id)}>
            <ChevronDownIcon
              className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>
      </div>

      {/* Animasi dropdown pakai AnimatePresence */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="mt-2 ms-13 flex flex-wrap gap-4 text-gray-500 text-sm"
          >
            <p><strong>Total Views:</strong> {formatNumber(link.views)}</p>
            <p><strong>Earnings:</strong> {formatCurrency(link.earnings)}</p>
            <p><strong>CPM:</strong> {formatCurrency(link.cpm)}</p>
            <p className="text-xs text-gray-400 truncate max-w-full">Dest: {link.original_url}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReferralCard = ({ referral }) => (
  <div className="p-6 bg-white rounded-2xl shadow-sm col-span-4 lg:col-span-3">
    <div className='flex justify-between px-7'>
      <h3 className="text-lg font-semibold text-gray-800">Referral</h3>
      <p className="font-bold text-gray-700">Total Users</p>
    </div>


    <div className='grid items-center grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
      <div className="flex lg:col-span-2 items-center justify-between p-4 my-4 inset-shadow-sm inset-shadow-gray-300/50 rounded-lg">
        <Users className='text-gray-800' size={20} />
        <div className="overflow-hidden">
          <p className="text-sm text-gray-500">Your Code</p>
          <p className="font-semibold text-indigo-700 truncate">{referral.code}</p>
        </div>
        <button onClick={() => navigator.clipboard.writeText(referral.code)} className="hover:text-purple-600">
          <Copy size={20} />
        </button>
      </div>
      <div className='lg:col-span-1 rounded-lg inset-shadow-sm text-center inset-shadow-gray-300/50'>
        <p className="text-2xl font-bold text-gray-900 p-5">{formatNumber(referral.users)}</p>
      </div>
    </div>
  </div>
);