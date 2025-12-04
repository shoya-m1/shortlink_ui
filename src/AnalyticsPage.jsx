import React, { useEffect, useState } from "react";
import {
    getSummaryEarnings,
    getSummaryClicks,
    getSummaryReferrals,
    getSummaryCpm,
    getAnalyticsData,
    getTopCountries,
    getTopReferrers
} from "./auth";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { DollarSign, MousePointer, Users, TrendingUp, Calendar, Filter } from "lucide-react";

const AnalyticsPage = () => {
    const [range, setRange] = useState("month"); // week, month, year, lifetime
    const [loading, setLoading] = useState(true);

    // Summary Data
    const [earnings, setEarnings] = useState(0);
    const [clicks, setClicks] = useState(0);
    const [referrals, setReferrals] = useState(0);
    const [cpm, setCpm] = useState(0);

    // Chart Data
    const [chartData, setChartData] = useState([]);
    const [chartMetric, setChartMetric] = useState("earnings"); // earnings, clicks, valid_clicks

    // Top Data
    const [topCountries, setTopCountries] = useState([]);
    const [topReferrers, setTopReferrers] = useState([]);

    useEffect(() => {
        fetchData();
    }, [range, chartMetric]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Summaries
            const [earnRes, clickRes, refRes, cpmRes] = await Promise.all([
                getSummaryEarnings(range),
                getSummaryClicks(range),
                getSummaryReferrals(range),
                getSummaryCpm(range)
            ]);

            setEarnings(earnRes.data.total_earnings);
            setClicks(clickRes.data.total_clicks);
            setReferrals(refRes.data.referral_count);
            setCpm(cpmRes.data.average_cpm);

            // Fetch Chart
            // Determine groupBy based on range
            let groupBy = 'day';
            if (range === 'year' || range === 'lifetime') groupBy = 'month';
            if (range === 'today' || range === 'yesterday') groupBy = 'hour'; // API might default to day if not handled, but let's stick to day for now

            const chartRes = await getAnalyticsData(chartMetric, groupBy, range);
            setChartData(chartRes.data.points);

            // Fetch Top Data
            const countryRes = await getTopCountries(range);
            setTopCountries(countryRes.data.items);

            const referrerRes = await getTopReferrers(range);
            setTopReferrers(referrerRes.data.items);

        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val) => `$${Number(val).toFixed(4)}`;
    const formatNumber = (val) => Number(val).toLocaleString();

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" />
                    Analytics Dashboard
                </h1>

                <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
                    {['week', 'month', 'year', 'lifetime'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${range === r
                                ? "bg-indigo-600 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Total Earnings"
                    value={formatCurrency(earnings)}
                    icon={<DollarSign className="w-6 h-6 text-green-600" />}
                    bg="bg-green-50"
                    border="border-green-200"
                />
                <SummaryCard
                    title="Valid Clicks"
                    value={formatNumber(clicks)}
                    icon={<MousePointer className="w-6 h-6 text-blue-600" />}
                    bg="bg-blue-50"
                    border="border-blue-200"
                />
                <SummaryCard
                    title="Avg. CPM"
                    value={`$${cpm}`}
                    icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
                    bg="bg-purple-50"
                    border="border-purple-200"
                />
                <SummaryCard
                    title="New Referrals"
                    value={referrals}
                    icon={<Users className="w-6 h-6 text-orange-600" />}
                    bg="bg-orange-50"
                    border="border-orange-200"
                />
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Analytics Overview</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setChartMetric('earnings')}
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${chartMetric === 'earnings' ? 'bg-green-100 text-green-700 border-green-300' : 'text-gray-500 border-gray-200'}`}
                        >
                            Earnings
                        </button>
                        <button
                            onClick={() => setChartMetric('valid_clicks')}
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${chartMetric === 'valid_clicks' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'text-gray-500 border-gray-200'}`}
                        >
                            Valid Clicks
                        </button>
                    </div>
                </div>

                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartMetric === 'earnings' ? '#10B981' : '#3B82F6'} stopOpacity={0.1} />
                                    <stop offset="95%" stopColor={chartMetric === 'earnings' ? '#10B981' : '#3B82F6'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={chartMetric === 'earnings' ? '#10B981' : '#3B82F6'}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Data Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Countries */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Countries</h3>
                    <div className="space-y-4">
                        {topCountries.length > 0 ? topCountries.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-mono text-sm w-4">{idx + 1}</span>
                                    <img
                                        src={`https://flagcdn.com/w20/${item.country_code.toLowerCase()}.png`}
                                        alt={item.country_name}
                                        className="w-5 h-auto rounded-sm shadow-sm"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                    <span className="text-sm font-medium text-gray-700">{item.country_name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-gray-900">{formatNumber(item.views)}</span>
                                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-gray-400 py-8">No data available</div>
                        )}
                    </div>
                </div>

                {/* Top Referrers */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Referrers</h3>
                    <div className="space-y-4">
                        {topReferrers.length > 0 ? topReferrers.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-mono text-sm w-4">{idx + 1}</span>
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{item.referrer_label}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-gray-900">{formatNumber(item.views)}</span>
                                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-gray-400 py-8">No data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ title, value, icon, bg, border }) => (
    <div className={`p-6 rounded-xl border ${bg} ${border} transition-all hover:shadow-md`}>
        <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                {icon}
            </div>
        </div>
        <div className="text-gray-500 text-sm font-medium mb-1">{title}</div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
);

export default AnalyticsPage;
