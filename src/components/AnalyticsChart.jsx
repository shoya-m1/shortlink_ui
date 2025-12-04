import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { getAnalyticsData } from '../auth'; // Pastikan path sesuai
import { BarChart3, DollarSign, MousePointer2, ChevronDown } from 'lucide-react';

const AnalyticsChart = () => {
    // State untuk Metric (Klik vs Pendapatan)
    const [metric, setMetric] = useState('clicks'); 

    // State untuk Range Waktu (Dropdown: 'week' | 'month' | 'year')
    // Ini yang akan mengontrol parameter range & group_by ke API
    const [timeRange, setTimeRange] = useState('week'); 
    
    // State Data & Loading
    const [chartData, setChartData] = useState({ series: [], categories: [] });
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    // Mapping konfigurasi berdasarkan pilihan Dropdown
    const rangeConfig = {
        week: {
            label: 'Minggu Ini',
            apiRange: 'week',   // Parameter 'range' ke API
            apiGroup: 'day',    // Parameter 'group_by' ke API
            xLabelFormat: 'dd MMM' // Format tanggal di chart (opsional untuk tooltip)
        },
        month: {
            label: 'Bulan Ini',
            apiRange: 'month',
            apiGroup: 'week',
            xLabelFormat: 'Week W' 
        },
        year: {
            label: 'Tahun Ini',
            apiRange: 'year',
            apiGroup: 'month',
            xLabelFormat: 'MMM' 
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Ambil konfigurasi parameter berdasarkan dropdown
                const config = rangeConfig[timeRange];

                // Panggil API dengan parameter dinamis
                const res = await getAnalyticsData(metric, config.apiGroup, config.apiRange);
                
                if (isMounted && res.success) {
                    const points = res.data.points;

                    setChartData({
                        series: [{
                            name: metric === 'earnings' ? 'Pendapatan' : 'Klik',
                            data: points.map(p => p.value)
                        }],
                        // Label diambil dari respons API ('label' field)
                        categories: points.map(p => p.label) 
                    });
                    setTotal(res.data.total);
                }
            } catch (error) {
                console.error("Gagal memuat grafik", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, [metric, timeRange]); // Re-fetch saat metric atau dropdown berubah

    // --- Konfigurasi ApexCharts ---
    const options = {
        chart: {
            type: 'area',
            height: 350,
            fontFamily: 'Inter, sans-serif',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        colors: [metric === 'earnings' ? '#10B981' : '#3B82F6'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        xaxis: {
            categories: chartData.categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: '#9CA3AF', fontSize: '12px' },
                // Membatasi jumlah label agar tidak menumpuk jika data banyak
                formatter: (value) => value
            },
            tooltip: { enabled: false } // Matikan tooltip default di sumbu X agar lebih bersih
        },
        yaxis: {
            labels: {
                style: { colors: '#9CA3AF', fontSize: '12px' },
                formatter: (value) => {
                    if (metric === 'earnings') return `$${value}`; // Format Ringkas Y-Axis
                    return value.toFixed(0);
                }
            }
        },
        grid: {
            borderColor: '#F3F4F6',
            strokeDashArray: 4,
            yaxis: { lines: { show: true } },
            xaxis: { lines: { show: false } } 
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (value) => {
                    if (metric === 'earnings') 
                        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
                    return `${value} Klik`;
                }
            },
            x: {
                show: true // Tampilkan label kategori saat hover
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
            
            {/* --- Header: Judul, Total, & Kontrol --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        Analitik Kinerja
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Total {metric === 'earnings' ? 'Pendapatan' : 'Klik'} ({rangeConfig[timeRange].label}): 
                        <span className="font-bold text-gray-900 ml-1">
                            {metric === 'earnings' 
                                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)
                                : new Intl.NumberFormat('id-ID').format(total)
                            }
                        </span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Toggle Metric: Klik vs Pendapatan */}
                    <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setMetric('clicks')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                                metric === 'clicks' 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <MousePointer2 className="w-3.5 h-3.5" /> Klik
                        </button>
                        <button
                            onClick={() => setMetric('earnings')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                                metric === 'earnings' 
                                ? 'bg-white text-green-600 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <DollarSign className="w-3.5 h-3.5" /> Uang
                        </button>
                    </div>

                    {/* Dropdown Periode Waktu */}
                    <div className="relative">
                        <select 
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer shadow-sm"
                        >
                            <option value="week">Minggu Ini (Harian)</option>
                            <option value="month">Bulan Ini (Mingguan)</option>
                            <option value="year">Tahun Ini (Bulanan)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <ChevronDown className="h-3.5 w-3.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Chart Area --- */}
            <div className="relative min-h-[350px]">
                {loading ? (
                    // Loading Skeleton
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-white z-10">
                        <div className="w-full h-full bg-gray-50 animate-pulse rounded-lg flex items-end justify-between p-4 gap-2">
                            {[...Array(rangeConfig[timeRange].apiGroup === 'day' ? 7 : 12)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="bg-gray-200 rounded-t" 
                                    style={{ width: '8%', height: `${Math.random() * 60 + 20}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Chart 
                        options={options} 
                        series={chartData.series} 
                        type="area" 
                        height={350} 
                    />
                )}
            </div>
        </div>
    );
};

export default AnalyticsChart;