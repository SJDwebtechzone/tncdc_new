import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '@/store/authSlice';
import { fetchCategories, fetchCourses } from '@/store/courseSlice';
import { fetchTopPerformers, fetchTeachers } from '@/store/websiteSlice';
import { fetchStudentDashboard, fetchCourseResources } from '@/store/studentDashboardSlice';
import { BASE_URL } from '@/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { 
    Home, 
    BookOpen, 
    CalendarCheck, 
    MonitorPlay, 
    Bell, 
    Search, 
    Menu, 
    ChevronRight,
    Star,
    Clock,
    User,
    Wallet,
    X,
    ThumbsUp,
    Eye,
    Check,
    GraduationCap,
    Target,
    Trophy,
    MessageCircle,
    Smartphone,
    HelpCircle,
    ShieldCheck,
    Phone,
    LogOut,
    LogIn,
    IndianRupee,
    TrendingUp,
    PlayCircle,
    FileText,
    BarChart3,
    CreditCard,
    CheckCircle2,
    QrCode,
    LayoutGrid,
    ChevronDown,
    Layout
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import StudentPwaLogin from './StudentPwaLogin';

export default function StudentMobileHub() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const messages = useSelector(state => state.website?.siteSettings?.marqueeEntries || []);
    const categories = useSelector(state => state.courses?.categories || []);
    const performers = useSelector(state => state.website?.performers || []);
    const teachers = useSelector(state => state.website?.teachers || []);
    const mobileBanners = useSelector(state => state.website?.mobileBanners || []);
    const { enrolledCourses, summary: dashSummary, resources, loading: dashLoading } = useSelector(state => state.studentDashboard);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Check if the current user is a student (Admin should be treated as Guest in PWA)
    const isStudent = user && (
        user.role?.toUpperCase() === 'STUDENT' || 
        user.roles?.some(r => r.toUpperCase() === 'STUDENT') || 
        user.studentId || 
        user.admissionNo
    );
    const pwaUser = isStudent ? user : null;

    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isPwaLoginVisible, setIsPwaLoginVisible] = useState(false);
    const [activeCourseIdx, setActiveCourseIdx] = useState(0);
    const [isCourseListOpen, setIsCourseListOpen] = useState(false);

    const handleProtectedClick = (e, path) => {
        // If not authenticated as a student, treat as guest for the PWA features
        const isGuest = !pwaUser;
        
        if (isGuest) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            // Show the Oops! modal which then leads to premium login
            setIsLoginModalOpen(true);
        } else {
            navigate(path);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        setIsMenuOpen(false);
        navigate('/pwa');
    };

    const studyItems = [
        { label: 'All Courses', path: '/dashboard/all-courses', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Online Classes', path: '/dashboard/online-courses', icon: MonitorPlay, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { label: 'My Attendance', path: '/dashboard/attendance', icon: CalendarCheck, color: 'text-green-500', bg: 'bg-green-50' },
    ];

    const accountItems = [
        { label: 'My Profile', path: '/dashboard/profile', icon: User, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Referral Hub', path: '/dashboard/referral', icon: Target, color: 'text-pink-500', bg: 'bg-pink-50' },
        { label: 'My Wallet', path: '/dashboard/wallet', icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-50' },
    ];

    const supportItems = [
        { label: 'Help Support', path: '/dashboard/help-support', icon: HelpCircle, color: 'text-cyan-500', bg: 'bg-cyan-50' },
        { label: 'Privacy Policy', path: '/privacy-policy', icon: ShieldCheck, color: 'text-slate-500', bg: 'bg-slate-50' },
        { label: 'Contact Us', path: '/contact', icon: Phone, color: 'text-emerald-500', bg: 'bg-emerald-50' }
    ];

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchTopPerformers());
        dispatch(fetchTeachers());
        dispatch(fetchCourses());
        
        // Fetch student dashboard data if authenticated
        if (user?.email) {
            dispatch(fetchStudentDashboard(user.email));
        }
        
        const hour = currentTime.getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Night');

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, [currentTime, dispatch, pwaUser?.email]);

    // Fetch course resources when enrolled courses load
    useEffect(() => {
        if (enrolledCourses?.length > 0) {
            enrolledCourses.forEach(c => {
                if (c.courseName && !resources[c.courseName]) {
                    dispatch(fetchCourseResources(c.courseName));
                }
            });
        }
    }, [enrolledCourses, dispatch, resources]);

    const courses = useSelector(state => state.courses?.courses || []);
    const recommendedCourses = courses.filter(c => c.isRecommended || c.isPopular);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-indigo-100">
            {/* 1. Header Section */}
            <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div 
                        className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm cursor-pointer"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu size={20} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{greeting} 👋</p>
                        <h2 className="text-gray-900 font-black text-base tracking-tight">{pwaUser?.fullName || 'Guest'}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 overflow-hidden">
                        {(pwaUser?.profilePhoto || pwaUser?.avatarUrl) ? (
                            <img 
                                src={(pwaUser?.profilePhoto || pwaUser?.avatarUrl).startsWith('http') ? (pwaUser?.profilePhoto || pwaUser?.avatarUrl) : `${BASE_URL}${pwaUser?.profilePhoto || pwaUser?.avatarUrl}`} 
                                alt="User" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                </div>
            </div>

            {/* PWA Text Scroll / Marquee */}
            {messages && messages.length > 0 && (
                <div className="overflow-hidden whitespace-nowrap w-full py-2.5 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white z-20 relative shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] border-b border-indigo-500/20">
                    <div className="marquee-gradient-content flex gap-10 font-bold text-[11px] tracking-widest uppercase text-white" style={{ textShadow: "none" }}>
                        {messages.map((msg, index) => (
                            <span key={index} className="whitespace-nowrap flex items-center gap-2.5 hover:text-pink-200 transition-colors cursor-default">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
                                {msg}
                            </span>
                        ))}
                        {messages.map((msg, index) => (
                            <span key={`dup-${index}`} className="whitespace-nowrap flex items-center gap-2.5 hover:text-pink-200 transition-colors cursor-default">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
                                {msg}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. Guest Welcome / Login CTA */}
            {!pwaUser && (
                <div className="px-6 mt-6">
                    <div className="bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                        {/* Background Decorations */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-8">
                                <div className="max-w-[70%]">
                                    <h3 className="text-2xl font-black mb-2 leading-tight tracking-tight text-white">Unlock Your Potential!</h3>
                                    <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-90">Sign in to track your progress or install our mobile app for a seamless learning experience.</p>
                                </div>
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center shadow-lg">
                                    <Smartphone size={32} strokeWidth={1.5} />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => setIsPwaLoginVisible(true)}
                                    className="flex-1 bg-white text-indigo-600 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <User size={16} strokeWidth={3} />
                                    Sign In Now
                                </button>
                                <button 
                                    onClick={() => window.dispatchEvent(new CustomEvent('trigger-pwa-install'))}
                                    className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Smartphone size={16} />
                                    Install App
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Mobile Banners Carousel */}
            {mobileBanners && mobileBanners.length > 0 && (
                <div className="px-6 mt-6 pb-4">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={16}
                        slidesPerView={1}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        className="rounded-[2rem] shadow-xl shadow-indigo-100"
                    >
                        {mobileBanners
                            .filter(banner => banner.status === true)
                            .sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0))
                            .map((banner, idx) => (
                                <SwiperSlide key={idx}>
                                    <div 
                                        onClick={(e) => {
                                            if (banner.type === 'course' && banner.link) {
                                                handleProtectedClick(e, banner.link);
                                            } else if (banner.type === 'external link' && banner.link) {
                                                window.open(banner.link.startsWith('http') ? banner.link : `https://${banner.link}`, '_blank');
                                            }
                                        }}
                                        className={`relative w-full rounded-[2rem] overflow-hidden group cursor-pointer flex items-center justify-center ${!banner.image ? 'h-44 bg-gray-900' : 'bg-transparent'}`}
                                    >
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                        {banner.image ? (
                                            <img 
                                                src={banner.image.startsWith('http') || banner.image.startsWith('data:') ? banner.image : `${BASE_URL}${banner.image}`} 
                                                alt={banner.title} 
                                                className="w-full h-auto block group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="relative z-10 p-8 flex flex-col justify-center h-full text-white w-full">
                                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mb-3 border border-white/20 shadow-sm">{banner.type === 'course' ? 'Featured Course' : 'Promotion'}</span>
                                                <h3 className="text-2xl font-black mb-2 leading-tight drop-shadow-md">{banner.title}</h3>
                                            </div>
                                        )}
                                        {/* Decorative Circles only if no image */}
                                        {!banner.image && (
                                            <>
                                                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
                                                <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-indigo-400/10 blur-2xl group-hover:bg-indigo-400/20 transition-all duration-700"></div>
                                            </>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            )}

            {/* ═══ STUDENT DASHBOARD HUB (Authenticated Only) ═══ */}
            {pwaUser && enrolledCourses && enrolledCourses.length > 0 && (
                <div className="mt-6 px-4 space-y-4">
                    {/* Course Selection Accordion */}
                    <div className="bg-[#003d73] rounded-xl overflow-hidden shadow-lg border border-white/10">
                        <button 
                            onClick={() => setIsCourseListOpen(!isCourseListOpen)}
                            className="w-full px-4 py-3 flex items-center justify-between text-white"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-1.5 bg-white/10 rounded-lg">
                                    <GraduationCap size={18} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-tight truncate">
                                    {enrolledCourses[activeCourseIdx]?.courseName}
                                    {enrolledCourses[activeCourseIdx]?.batch && ` (${enrolledCourses[activeCourseIdx].batch})`}
                                </span>
                            </div>
                            <ChevronDown size={18} className={`shrink-0 transition-transform ${isCourseListOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                            {isCourseListOpen && enrolledCourses.length > 1 && (
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden bg-[#002d5a] border-t border-white/5"
                                >
                                    {enrolledCourses.map((c, idx) => (
                                        idx !== activeCourseIdx && (
                                            <button 
                                                key={idx}
                                                onClick={() => {
                                                    setActiveCourseIdx(idx);
                                                    setIsCourseListOpen(false);
                                                }}
                                                className="w-full px-4 py-3 text-left text-white/80 text-[9px] font-bold uppercase tracking-wide hover:bg-white/10 border-b border-white/5 last:border-0"
                                            >
                                                {c.courseName}
                                            </button>
                                        )
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Dashboard Grid Layout (Exactly matching mockup) */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* 1. Fees Card (Left, Tall) */}
                        <div className="bg-gradient-to-br from-[#f27121] via-[#e94057] to-[#8a2387] rounded-[2rem] p-5 text-white shadow-xl relative overflow-hidden flex flex-col min-h-[190px]">
                            <div className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                <LayoutGrid size={22} />
                            </div>
                            
                            <div className="mt-12 space-y-2 flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase tracking-widest opacity-90">Amount</span>
                                    <span className="text-[11px] font-black">: ₹{(enrolledCourses[activeCourseIdx]?.fees?.totalFee || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase tracking-widest opacity-90">Paid</span>
                                    <span className="text-[11px] font-black">: ₹{(enrolledCourses[activeCourseIdx]?.fees?.totalPaid || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase tracking-widest opacity-90">Balance</span>
                                    <span className="text-[11px] font-black">: ₹{(enrolledCourses[activeCourseIdx]?.fees?.balanceDue || 0).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* View Fees Pill Button */}
                            <Link 
                                to={`/dashboard/courses/${enrolledCourses[activeCourseIdx]?.courseId || enrolledCourses[activeCourseIdx]?._id}`}
                                className="mt-4 bg-white text-[#e94057] py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                            >
                                <Eye size={14} /> View Fees
                            </Link>
                        </div>

                        {/* Right Stack (QR & Attendance %) */}
                        <div className="flex flex-col gap-3">
                            {/* Attendance QR */}
                            <Link 
                                to="/dashboard/attendance-qr"
                                className="flex-1 bg-gradient-to-r from-[#9c27b0] to-[#e91e63] rounded-[1.5rem] p-4 text-white shadow-lg flex flex-col justify-center min-h-[90px] relative group overflow-hidden"
                            >
                                <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg w-fit mb-2">
                                    <QrCode size={18} />
                                </div>
                                <h4 className="text-[13px] font-black tracking-tight leading-none mb-1">Attendance QR</h4>
                                <p className="text-[8px] font-bold opacity-80 uppercase tracking-widest">Mark attendance</p>
                            </Link>

                            {/* Attendance % */}
                            <Link 
                                to="/dashboard/attendance"
                                className="flex-1 bg-gradient-to-r from-[#f44336] to-[#ff9800] rounded-[1.5rem] p-4 text-white shadow-lg flex flex-col justify-center min-h-[90px] relative group overflow-hidden"
                            >
                                <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg w-fit mb-1">
                                    <CalendarCheck size={20} />
                                </div>
                                <h4 className="text-[16px] font-black tracking-tight leading-none mb-1">{enrolledCourses[activeCourseIdx]?.attendance?.percentage || '0.00'}%</h4>
                                <p className="text-[8px] font-bold opacity-80 uppercase tracking-widest">Attendance</p>
                            </Link>
                        </div>

                        {/* Bottom Row (Videos & Notes) */}
                        {/* Videos Card */}
                        <Link 
                            to={`/dashboard/courses/${enrolledCourses[activeCourseIdx]?.courseId || enrolledCourses[activeCourseIdx]?._id}?tab=resources`}
                            className="bg-gradient-to-br from-[#1a4cd2] to-[#2471e0] rounded-[2rem] p-5 text-white shadow-lg relative overflow-hidden group min-h-[110px] flex flex-col justify-center"
                        >
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl w-fit mb-3">
                                <MonitorPlay size={24} />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-2xl font-black leading-none mb-1">{resources[enrolledCourses[activeCourseIdx]?.courseName]?.videos?.length || 0}</h4>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Videos</p>
                            </div>
                        </Link>

                        {/* Notes Card */}
                        <Link 
                            to={`/dashboard/courses/${enrolledCourses[activeCourseIdx]?.courseId || enrolledCourses[activeCourseIdx]?._id}?tab=resources`}
                            className="bg-gradient-to-br from-[#e91e63] to-[#fb464a] rounded-[2rem] p-5 text-white shadow-lg relative overflow-hidden group min-h-[110px] flex flex-col justify-center"
                        >
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl w-fit mb-3">
                                <BookOpen size={24} />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-2xl font-black leading-none mb-1">{resources[enrolledCourses[activeCourseIdx]?.courseName]?.notes?.length || 0}</h4>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Notes</p>
                            </div>
                        </Link>
                    </div>

                    {/* Referral Banner */}
                    <Link 
                        to="/dashboard/referral"
                        className="block mt-2"
                    >
                        <div className="bg-gradient-to-r from-[#ff9800] via-[#ffc107] to-[#ff9800] rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group flex items-center justify-between border-4 border-white/20">
                            {/* Sparkles Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            
                            <div className="relative z-10">
                                <div className="bg-white/20 backdrop-blur-md border border-white/40 px-2 py-0.5 rounded-full w-fit mb-2 flex items-center gap-1.5 animate-bounce">
                                    <Star size={8} className="fill-white" />
                                    <span className="text-[7px] font-black uppercase tracking-tighter">Hot Deal!</span>
                                </div>
                                <h3 className="text-xl font-black leading-tight tracking-tight text-white mb-1">Earn Per<br/>Referral</h3>
                                <p className="text-white/90 text-[9px] font-bold">Unlimited rewards await!</p>
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-[#ffc107] group-hover:scale-110 transition-transform">
                                    <span className="text-[#ff9800] text-[16px] font-black leading-none">₹100</span>
                                    <span className="text-[#ff9800] text-[7px] font-black uppercase tracking-tighter mt-0.5 border-t border-[#ff9800]/20 pt-0.5">Bonus</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {/* 3. Categories Section */}
            <div className="mt-8">
                <div className="px-6 flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Categories</h3>
                    <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">See all</button>
                </div>
                <div className="grid grid-cols-2 gap-3 px-6 pb-4">
                    {categories.filter(c => c.status !== false).slice(0, 6).map((cat) => (
                        <div 
                            key={cat.id} 
                            onClick={(e) => handleProtectedClick(e, '/dashboard/all-courses')}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-sm border border-gray-100/50 hover:border-indigo-100 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                            <div className="shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center text-xl shadow-sm border border-gray-50 bg-gray-50/50 overflow-hidden">
                                {cat.iconUrl && cat.iconUrl !== 'null' ? (
                                    <img src={cat.iconUrl.startsWith('http') ? cat.iconUrl : `${BASE_URL}${cat.iconUrl}`} alt={cat.name} className="w-8 h-8 object-contain" />
                                ) : (
                                    <BookOpen className="text-indigo-400" size={20} />
                                )}
                            </div>
                            <span className="text-xs font-bold text-gray-700 leading-tight pr-2 line-clamp-2">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Top Performers Section */}
            {performers && performers.length > 0 && (
                <div className="mt-8">
                    <div className="px-6 flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Our Top Achievers</h3>
                            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Recognition of Excellence</p>
                        </div>
                        <div 
                            onClick={(e) => handleProtectedClick(e, '/top-performer')}
                            className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline cursor-pointer"
                        >
                            View All
                        </div>
                    </div>
                    <div className="flex overflow-x-auto gap-4 px-6 pb-6 no-scrollbar snap-x snap-mandatory">
                        {performers.map((student) => (
                            <div key={student.id} className="w-48 shrink-0 snap-start">
                                <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100/50 flex flex-col items-center text-center relative overflow-hidden group active:scale-95 transition-transform">
                                    {/* Subtle Gradient Background */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-10 -mt-10 opacity-60"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 mb-4 shadow-lg mx-auto">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                                <img 
                                                    src={student.image ? (student.image.startsWith('http') || student.image.startsWith('data:') ? student.image : `${BASE_URL}${student.image}`) : "https://images.unsplash.com/photo-1544717297-fa15739a5447?w=200&q=80"} 
                                                    alt={student.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                        </div>
                                        <h4 className="text-sm font-black text-gray-900 line-clamp-1 truncate w-full">{student.name}</h4>
                                        <div className="mt-1.5 inline-flex items-center gap-1 bg-indigo-50 px-3 py-0.5 rounded-full">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter line-clamp-1">{student.course || "Excellence"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute top-3 right-3 text-yellow-400">
                                        <Star size={14} className="fill-yellow-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. Recommended Section */}
            <div className="mt-6">
                <div className="px-6 flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Recommended for You</h3>
                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Top Rated Courses</p>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard/all-courses')}
                        className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline"
                    >
                        See all
                    </button>
                </div>
                <div className="flex overflow-x-auto gap-6 px-6 pb-6 no-scrollbar snap-x snap-mandatory">
                    {recommendedCourses.length > 0 ? recommendedCourses.map((course) => (
                        <div key={course.id} className="w-80 shrink-0 snap-start">
                            <div 
                                onClick={() => navigate(`/courses/${course.id || course._id}`)}
                                className="bg-white rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 flex flex-col relative group active:scale-[0.98] transition-all cursor-pointer"
                            >
                                {/* Top Image Area */}
                                <div className="h-48 relative overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                                    <img 
                                        src={course.imageUrl ? (course.imageUrl.startsWith('http') || course.imageUrl.startsWith('data:') ? course.imageUrl : `${BASE_URL}${course.imageUrl}`) : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80'} 
                                        alt={course.title} 
                                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-xl" 
                                    />
                                    
                                    {/* Category Badge */}
                                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[9px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                                        {course.category?.name || 'Development'}
                                    </div>

                                    {/* Star Rating Badge */}
                                    <div className="absolute bottom-5 right-5 bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                        {course.rating || '4.5'}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 pt-5">
                                    <h4 className="font-black text-gray-900 text-xl mb-1 line-clamp-1">{course.title}</h4>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">{course.courseCode || 'SJFS-9028'}</p>
                                    
                                    {/* Stats Row */}
                                    <div className="flex items-center gap-5 mb-5 opacity-80">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <ThumbsUp size={14} className="text-pink-500" />
                                            {course.likes || '0'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <Eye size={14} className="text-blue-500" />
                                            {course.views || '0'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <BookOpen size={14} className="text-emerald-500" />
                                            {course.totalLectures || '2'}
                                        </div>
                                    </div>

                                    {/* Description Excerpt */}
                                    <p className="text-gray-400 text-[11px] font-bold leading-relaxed line-clamp-2 mb-6">
                                        {course.description || "Comprehensive learning path with industry-expert guidance and hands-on projects."}
                                    </p>

                                    {/* Footer: Price & Enroll Button */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex flex-col">
                                            {course.mrp > course.price && (
                                                <span className="text-[10px] font-black text-gray-300 line-through tracking-tighter">₹{course.mrp}</span>
                                            )}
                                            <span className="text-2xl font-black text-[#5d5fef] leading-none">₹{course.price || 'Free'}</span>
                                        </div>
                                        
                                        <button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200 transition-all">
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="w-full text-center py-10">
                            <p className="text-gray-400 text-xs italic">No recommended courses available yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 6. Our Team Section */}
            {teachers && teachers.length > 0 && (
                <div className="mt-8 mb-12">
                    <div className="px-6 flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Our Expert Team</h3>
                            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Meet Your Mentors</p>
                        </div>
                    </div>
                    <div className="flex overflow-x-auto gap-8 px-6 pb-4 no-scrollbar snap-x snap-mandatory">
                        {teachers.filter(t => t.status !== false).map((teacher) => (
                            <div key={teacher.id} className="w-32 shrink-0 snap-start flex flex-col items-center group">
                                <div className="relative mb-3">
                                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-100 to-indigo-100 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-500 shadow-sm">
                                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white">
                                            <img 
                                                src={teacher.image ? (teacher.image.startsWith('http') || teacher.image.startsWith('data:') ? teacher.image : `${BASE_URL}${teacher.image}`) : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"} 
                                                alt={teacher.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        </div>
                                    </div>
                                    {/* Verification Badge */}
                                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
                                        <div className="bg-blue-500 text-white p-0.5 rounded-full">
                                            <Check size={8} strokeWidth={4} />
                                        </div>
                                    </div>
                                </div>
                                <h4 className="text-xs font-black text-gray-900 text-center line-clamp-1 truncate w-full">{teacher.name}</h4>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 text-center line-clamp-1">{teacher.designation || "Faculty"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 6. Quick Stats / Attendance (Only for Users) */}
            {pwaUser && (
                <div className="px-6 mt-8">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm flex items-center justify-between border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-inner">
                                <CalendarCheck size={24} />
                            </div>
                            <div>
                                <h4 className="text-gray-900 font-black text-sm">Attendance Analysis</h4>
                                <p className="text-green-600 text-[10px] font-black uppercase tracking-widest">92% Overall Stability</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-300" />
                    </div>
                </div>
            )}

            {/* Login Required Modal */}
            <AnimatePresence>
                {isLoginModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] flex items-center justify-center p-6"
                    >
                        <div 
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsLoginModalOpen(false)}
                        ></div>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-50 rounded-full -ml-16 -mb-16 opacity-50 blur-2xl"></div>
                            
                            <div className="p-8 pb-10 flex flex-col items-center text-center relative z-10">
                                {/* Icon Wrapper */}
                                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 mb-6 rotate-12 transition-transform hover:rotate-0 duration-500">
                                    <GraduationCap size={48} strokeWidth={1.5} />
                                </div>
                                
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Oops!</h3>
                                <p className="text-lg font-black text-gray-900/80 mb-8 tracking-tight">Sign in to unlock!</p>
                                
                                {/* Value List */}
                                <div className="w-full space-y-4 mb-10 text-left">
                                    {[
                                        { icon: <BookOpen size={16} className="text-blue-500" />, text: "Access all courses & materials" },
                                        { icon: <Target size={16} className="text-pink-500" />, text: "Track your learning progress" },
                                        { icon: <Trophy size={16} className="text-yellow-500" />, text: "Take exams & earn certificates" },
                                        { icon: <MessageCircle size={16} className="text-indigo-500" />, text: "Join student community" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                                {item.icon}
                                            </div>
                                            <span className="text-xs font-bold text-gray-600">{item.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => {
                                        setIsLoginModalOpen(false);
                                        setIsPwaLoginVisible(true);
                                    }}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-200 active:scale-95 transition-all mb-4"
                                >
                                    Sign In Now
                                </button>

                                <button 
                                    onClick={() => setIsLoginModalOpen(false)}
                                    className="text-gray-400 text-sm font-black uppercase tracking-widest hover:text-indigo-600 transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar Menu Overlay */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-[100] transition-opacity duration-300"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar Menu */}
            <div 
                className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[110] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] rounded-r-[3rem] overflow-hidden`}
            >
                {/* 1. Header Area with Brand/User Background */}
                <div className="relative p-8 pb-10 bg-gradient-to-br from-indigo-900 to-blue-900 overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="bg-white p-3 rounded-2xl shadow-lg w-fit">
                            <img src="/assets/tncdc_logo.jpg" alt="TNCDC Logo" className="h-8 object-contain" />
                        </div>
                        <button 
                            onClick={() => setIsMenuOpen(false)} 
                            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mt-8 relative z-10">
                        <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Student Portal</p>
                        <h2 className="text-white text-xl font-black tracking-tight">{pwaUser?.fullName || 'Guest User'}</h2>
                    </div>
                </div>

                {/* 2. Menu Items Container */}
                <div className="flex-1 overflow-y-auto px-6 no-scrollbar py-8 bg-white rounded-tr-[3rem] -mt-6 relative z-20">
                    <div className="space-y-8">
                        {/* Section: Academic */}
                        <div>
                            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Study Explorer</p>
                            <div className="space-y-1">
                                {studyItems.map((item, index) => (
                                    <div 
                                        key={index} 
                                        onClick={(e) => { setIsMenuOpen(false); handleProtectedClick(e, item.path); }}
                                        className="flex items-center gap-4 p-4 rounded-2xl group hover:bg-gray-50 transition-all cursor-pointer active:scale-95"
                                    >
                                        <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                            <item.icon size={22} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                        <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section: My Account */}
                        <div>
                            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">My Account</p>
                            <div className="space-y-1">
                                {accountItems.map((item, index) => (
                                    <div 
                                        key={index} 
                                        onClick={(e) => { setIsMenuOpen(false); handleProtectedClick(e, item.path); }}
                                        className="flex items-center gap-4 p-4 rounded-2xl group hover:bg-gray-50 transition-all cursor-pointer active:scale-95"
                                    >
                                        <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                            <item.icon size={22} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                        <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section: Support */}
                        <div>
                            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Help & Info</p>
                            <div className="space-y-1">
                                {supportItems.map((item, index) => (
                                    <div 
                                        key={index} 
                                        onClick={(e) => { setIsMenuOpen(false); handleProtectedClick(e, item.path); }}
                                        className="flex items-center gap-4 p-4 rounded-2xl group hover:bg-gray-50 transition-all cursor-pointer active:scale-95"
                                    >
                                        <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                            <item.icon size={22} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                        <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom Action: LogOut/LogIn */}
                    <div className="mt-12 px-2">
                        {pwaUser ? (
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-3 p-5 rounded-3xl bg-red-50 text-red-600 font-black uppercase tracking-widest text-[11px] hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm shadow-red-100"
                            >
                                <LogOut size={18} /> Log Out Account
                            </button>
                        ) : (
                            <button 
                                onClick={() => { setIsMenuOpen(false); setIsPwaLoginVisible(true); }}
                                className="w-full flex items-center justify-center gap-3 p-5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest text-[11px] hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-indigo-100"
                            >
                                <LogIn size={18} /> Sign In to Portal
                            </button>
                        )}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Version 2.0.4 • TNCDC Mobile Hub</p>
                    </div>
                </div>
            </div>



            {/* 6. Bottom Navigation Bar */}
            <div className="fixed bottom-6 left-6 right-6 z-50">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 h-18 rounded-[2rem] shadow-2xl flex items-center justify-around px-4 relative">
                    <Link to="/dashboard" className="flex flex-col items-center gap-1 text-indigo-600">
                        <Home size={22} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Home</span>
                    </Link>
                    <div 
                        onClick={(e) => handleProtectedClick(e, '/dashboard/all-courses')}
                        className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                        <BookOpen size={22} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Courses</span>
                    </div>
                    
                    {/* Centered Action Button */}
                    <div className="relative -top-6">
                        <div 
                            onClick={(e) => handleProtectedClick(e, '/dashboard')}
                            className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200 border-4 border-[#F8FAFC] active:scale-95 transition-transform cursor-pointer"
                        >
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                                <GraduationCap size={24} strokeWidth={3} />
                            </div>
                        </div>
                    </div>

                    <div 
                        onClick={(e) => handleProtectedClick(e, '/dashboard/attendance')}
                        className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                        <CalendarCheck size={22} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Attendance</span>
                    </div>
                    <div 
                        onClick={(e) => handleProtectedClick(e, '/dashboard/online-courses')}
                        className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                        <MonitorPlay size={22} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Lectures</span>
                    </div>
                </div>
            </div>
            <Styles />
            
            {/* Native PWA Login Overlay */}
            <AnimatePresence>
                {isPwaLoginVisible && (
                    <StudentPwaLogin 
                        onBack={() => setIsPwaLoginVisible(false)}
                        onSuccess={() => {
                            setIsPwaLoginVisible(false);
                            // After success, stay in PWA Hub which will now show the authenticated view
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Custom CSS for hidden scrollbar (tailwind JIT should handle no-scrollbar but just in case)
const Styles = () => (
    <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `}} />
);
