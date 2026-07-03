import { LogOut, Sparkles, User as UserIcon, Bell, X, Check, ExternalLink } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "@/store/authSlice"
import { BASE_URL } from '@/config';
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import axios from "axios"

export function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch unread count every 30 seconds
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/notifications/unread-count`);
            setUnreadCount(res.data.count || 0);
        } catch (err) { /* silent */ }
    };

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/notifications`);
            setNotifications(res.data || []);
        } catch (err) { /* silent */ }
    };

    const toggleDropdown = () => {
        if (!showDropdown) {
            fetchNotifications();
        }
        setShowDropdown(!showDropdown);
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`${BASE_URL}/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { /* silent */ }
    };

    const markAllRead = async () => {
        try {
            await axios.put(`${BASE_URL}/api/notifications/mark-all-read`);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) { /* silent */ }
    };

    const handleNotificationClick = (notif) => {
        setIsRead(notif.id);
        setShowDropdown(false);
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const setIsRead = async (id) => {
        try {
            await axios.put(`${BASE_URL}/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { /* silent */ }
    };

    const timeAgo = (date) => {
        const now = new Date();
        const diff = Math.floor((now - new Date(date)) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white sticky top-0 z-40 px-8 flex items-center justify-between ml-64 border-b border-gray-100">
            <div className="flex items-center gap-2">
                <h1 className="font-medium text-gray-800 text-xl flex items-center gap-2">
                    Achieve More! <Sparkles className="text-orange-400 fill-orange-400" size={18} />
                </h1>
            </div>

            <div className="flex items-center gap-6">
                {/* Notification Bell */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Bell size={20} className="text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-[380px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                            {/* Dropdown Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllRead}
                                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <Check size={12} /> Mark all read
                                        </button>
                                    )}
                                    <button onClick={() => setShowDropdown(false)} className="text-gray-400 hover:text-gray-600">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Notification List */}
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <Bell size={32} className="mx-auto text-gray-200 mb-3" />
                                        <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <Link
                                            key={notif.id}
                                            to={notif.link || '#'}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-blue-50/50 transition-colors ${
                                                !notif.isRead ? 'bg-blue-50/30' : ''
                                            }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                                                !notif.isRead ? 'bg-blue-500' : 'bg-transparent'
                                            }`} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs leading-snug ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[10px] text-gray-400 font-medium">{timeAgo(notif.createdAt)}</span>
                                                    {notif.link && (
                                                        <span className="text-[10px] text-blue-500 font-bold flex items-center gap-0.5">
                                                            View <ExternalLink size={8} />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-900 leading-none">{user?.fullName || 'User'}</span>
                        <span className="text-[10px] text-gray-400 font-medium mt-1">Admin Panel</span>
                    </div>
                    {user?.profilePhoto ? (
                        <img 
                            src={`${BASE_URL}${user.profilePhoto}`} 
                            alt="User Profile" 
                            className="h-10 w-10 rounded-full object-cover border-2 border-blue-50"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shadow-sm">
                            <UserIcon size={20} />
                        </div>
                    )}
                </div>

                <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="bg-gray-100 border-none text-gray-700 hover:bg-gray-200 gap-2 rounded-lg" asChild>
                        <Link to="/dashboard/profile">
                            <UserIcon size={16} />
                            <span>Profile</span>
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-100 border-none text-gray-700 hover:bg-gray-200 gap-2 rounded-lg"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        <span>Log out</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
