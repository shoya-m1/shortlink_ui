import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChartCard({ title, labels, data, color = "rgba(59,130,246,1)" }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        fill: false,
        borderColor: color,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 w-full">
      <h3 className="text-gray-700 text-sm font-medium mb-2">{title}</h3>
      <Line data={chartData} />
    </div>
  );
}
