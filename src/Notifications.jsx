import { useEffect, useState } from "react";
import { pusher } from "./pusherClient";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Notifications({ userId }) {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Ambil notifikasi dari API (awal)
        fetch(`http://127.0.0.1:8000/api/notifications/${userId}`)
            .then((res) => res.json())
            .then((data) => setNotifications(data.notifications));

        // Dengarkan event baru
        const channel = pusher.subscribe(`user.${userId}`);
        channel.bind("new-notification", function (data) {
            setNotifications((prev) => [data, ...prev]); // prepend notifikasi baru
        });

        return () => {
            pusher.unsubscribe(`user.${userId}`);
        };
    }, [userId]);

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            >
                <Bell className="text-white" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-xs px-2 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl overflow-hidden z-50"
                    >
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Tidak ada notifikasi</div>
                        ) : (
                            notifications.map((n, i) => (
                                <div
                                    key={i}
                                    className="p-4 border-b hover:bg-gray-50 transition duration-150"
                                >
                                    <p className="font-semibold">{n.title}</p>
                                    <p className="text-sm text-gray-600">{n.message}</p>
                                    <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {/* {showDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl overflow-hidden z-50">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Tidak ada notifikasi</div>
                    ) : (
                        notifications.map((n, i) => (
                            <div
                                key={i}
                                className="p-4 border-b hover:bg-gray-50 transition duration-150"
                            >
                                <p className="font-semibold">{n.title}</p>
                                <p className="text-sm text-gray-600">{n.message}</p>
                                <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
                            </div>
                        ))
                    )}
                </div>
            )} */}
        </div>
    );
}
