import { useState, useEffect } from "react";
import { getLoginHistory } from "../auth";
import { Monitor, Smartphone, Globe } from "lucide-react";

export default function LoginHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getLoginHistory();
                setHistory(data);
            } catch (err) {
                console.error("Failed to load login history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getIcon = (device) => {
        if (device && device.toLowerCase().includes("mobile")) return <Smartphone className="w-5 h-5 text-blue-500" />;
        return <Monitor className="w-5 h-5 text-gray-500" />;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-600" />
                Login History
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b text-gray-600 text-sm">
                            <th className="p-3">Device / Browser</th>
                            <th className="p-3">IP Address</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : history.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">No login history found.</td>
                            </tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 flex items-center gap-3">
                                        {getIcon(item.device)}
                                        <div>
                                            <div className="font-medium text-gray-800">{item.platform}</div>
                                            <div className="text-xs text-gray-500">{item.browser}</div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-gray-700 font-mono text-sm">{item.ip_address}</td>
                                    <td className="p-3 text-gray-700">{item.location || "Unknown"}</td>
                                    <td className="p-3 text-gray-500 text-sm">
                                        {new Date(item.login_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
