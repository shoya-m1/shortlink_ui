import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom'; 

// Update Import: Menggunakan Named Imports sesuai perubahan di service
import { 
  getAllNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from './auth';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Menggunakan fungsi baru yang di-import
      const [listData, countData] = await Promise.all([
        getAllNotifications(),
        getUnreadCount()
      ]);
      
      setNotifications(listData.data || []); 
      setUnreadCount(countData);
    } catch (error) {
      console.error("Gagal memuat notifikasi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'danger': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  };

  const handleMarkRead = async (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read_at: new Date().toISOString() } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
    // Panggil fungsi service baru
    await markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    setUnreadCount(0);
    // Panggil fungsi service baru
    await markAllAsRead();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    // Panggil fungsi service baru
    await deleteNotification(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right transform transition-all">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-800">Notifikasi</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">Memuat...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center text-gray-400">
                <Bell className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">Belum ada notifikasi</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.map((notif) => {
                  const content = notif.data; 
                  const isUnread = !notif.read_at;

                  return (
                    <li 
                      key={notif.id}
                      onClick={() => isUnread && handleMarkRead(notif.id)}
                      className={`group relative p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        isUnread ? 'bg-indigo-50/40' : 'bg-white'
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="mt-1 flex-shrink-0">
                          {getIcon(content.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm font-medium ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
                              {content.title}
                            </p>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                              {formatTime(notif.created_at)}
                            </span>
                          </div>
                          <p className={`text-sm mt-0.5 line-clamp-2 ${isUnread ? 'text-gray-800' : 'text-gray-500'}`}>
                            {content.message}
                          </p>
                          {content.action_url && (
                            <Link 
                              to={content.action_url} 
                              className="inline-block mt-2 text-xs font-medium text-indigo-600 hover:underline"
                            >
                              Lihat Detail →
                            </Link>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleDelete(notif.id, e)}
                          className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {isUnread && (
                        <span className="absolute left-0 top-4 h-2 w-2 rounded-r-full bg-indigo-600"></span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 text-center">
            <Link to="/notifications" className="text-xs font-medium text-gray-500 hover:text-gray-800">
              Lihat Semua Riwayat
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}