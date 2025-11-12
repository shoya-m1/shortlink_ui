import { useEffect, useState } from "react";
import { getAdminOverviewData, getAdminTrendsData } from "./auth";
import StatCard from "./components/StatsCard";
import ChartCard from "./components/ChartCard";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("auth_token"); // ambil token dari login

  useEffect(() => {
    async function fetchData() {
      try {
        const overviewData = await getAdminOverviewData(token);
        const trendData = await getAdminTrendsData(token);
        console.log(trendData)
        setOverview(overviewData);
        setTrends(trendData);
      } catch (err) {
        setError("Gagal memuat data dashboard.");
      }
    }
    fetchData();
  }, [token]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!overview || !trends) return <div className="p-6 text-gray-600">Memuat data...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Pengguna" value={overview.total_users} />
        <StatCard title="Aktif" value={overview.active_users} />
        <StatCard title="Total Link" value={overview.total_links} />
        <StatCard title="Klik" value={overview.total_clicks} />
        <StatCard title="Withdraw Pending" value={overview.pending_withdrawals} />
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Pertumbuhan Pengguna"
          labels={trends.user_growth.map((x) => x.month)}
          data={trends.user_growth.map((x) => x.count)}
          color="rgba(59,130,246,1)"
        />
        <ChartCard
          title="Volume Transaksi"
          labels={trends.transaction_volume.map((x) => x.month)}
          data={trends.transaction_volume.map((x) => x.amount)}
          color="rgba(16,185,129,1)"
        />
      </div>
    </div>
  );
}
