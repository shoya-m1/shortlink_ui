import React, { useState, useEffect } from 'react';
import { getTopCountries, getTopReferrers } from '../auth';
import { Globe, Link2, ChevronDown, MapPin, ArrowUpRight } from 'lucide-react';

// Sub-component untuk Bar Item agar kode lebih rapi
const StatProgressItem = ({ label, subLabel, value, percentage, icon, colorClass }) => {
    return (
        <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2">
            {/* Icon Section */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-500">
                
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-end mb-1">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 truncate">{label}</h4>
                        {subLabel && <p className="text-xs text-gray-400">{subLabel}</p>}
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-bold text-gray-800">
                            {new Intl.NumberFormat('id-ID').format(value)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                    </div>
                </div>

                {/* Bar Width Section */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                        className={`h-2 rounded-full ${colorClass}`} 
                        style={{ width: `${percentage}%`, transition: 'width 1s ease-in-out' }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

const AnalyticsDetails = () => {
    const [range, setRange] = useState('month');
    const [countries, setCountries] = useState([]);
    const [referrers, setReferrers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch kedua endpoint secara paralel
                const [resCountries, resReferrers] = await Promise.all([
                    getTopCountries(range),
                    getTopReferrers(range)
                ]);

                if (isMounted) {
                    if (resCountries.success) setCountries(resCountries.data.items);
                    if (resReferrers.success) setReferrers(resReferrers.data.items);
                }
            } catch (error) {
                console.error("Failed to load details", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, [range]);

    // Helper untuk menampilkan Flag Icon dari API eksternal (FlagCDN)
    const getFlagUrl = (code) => {
        if (!code || code === 'Unknown') return null;
        return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
    };

    // Skeleton Loading UI
    const LoadingSkeleton = () => (
        <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            
            {/* Header & Filter */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Detail Trafik</h2>
                
                <div className="relative">
                    <select 
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                    >
                        <option value="week">Minggu Ini</option>
                        <option value="month">Bulan Ini</option>
                        <option value="year">Tahun Ini</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* --- CARD 1: TOP COUNTRIES --- */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <h3 className="font-semibold text-gray-800">Top Negara</h3>
                    </div>
                    
                    {loading ? <LoadingSkeleton /> : (
                        <div className="space-y-1">
                            {countries.length > 0 ? countries.map((item, idx) => (
                                <StatProgressItem 
                                    key={idx}
                                    label={item.country_name}
                                    value={item.views}
                                    percentage={item.percentage}
                                    colorClass="bg-blue-500"
                                    icon={
                                         <img 
                                                src={getFlagUrl(item.country_code)} 
                                                alt={item.country_code} 
                                                className="w-6 h-4 object-cover rounded-sm shadow-sm"
                                            />
                                    }
                                />
                            )) : (
                                <p className="text-center text-gray-400 py-8 text-sm">Belum ada data trafik.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* --- CARD 2: TOP REFERRERS --- */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                        <Link2 className="w-5 h-5 text-green-500" />
                        <h3 className="font-semibold text-gray-800">Sumber Trafik</h3>
                    </div>

                    {loading ? <LoadingSkeleton /> : (
                        <div className="space-y-1">
                            {referrers.length > 0 ? referrers.map((item, idx) => (
                                <StatProgressItem 
                                    key={idx}
                                    label={item.referrer_label}
                                    subLabel={item.referrer_key !== 'direct' ? item.referrer_key : null}
                                    value={item.views}
                                    percentage={item.percentage}
                                    colorClass="bg-green-500"
                                    icon={<ArrowUpRight className="w-5 h-5 text-gray-400" />}
                                />
                            )) : (
                                <p className="text-center text-gray-400 py-8 text-sm">Belum ada data referrer.</p>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AnalyticsDetails;