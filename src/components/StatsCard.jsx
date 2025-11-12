export default function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col justify-between w-full text-center">
      <h3 className="text-gray-500 text-sm uppercase">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
