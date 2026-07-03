import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card"
import {
    User,
    Wallet,
    BookOpen,
    GraduationCap,
    Award,
    CalendarCheck,
    Share2,
    Clock,
    ChevronRight,
    TrendingUp
} from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function StudentDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [currentTime] = useState(new Date());

    // Mock data for student dashboard
    const studentData = {
        coursesCount: 3,
        attendanceRate: 92,
        walletBalance: 250,
        referralCount: 5,
        recentResults: [
            { subject: "Mathematics", score: 85, date: "2026-03-20" },
            { subject: "Science", score: 92, date: "2026-03-15" }
        ],
        upcomingClasses: [
            { subject: "Physics", time: "10:00 AM", instructor: "Dr. Smith" },
            { subject: "English", time: "02:00 PM", instructor: "Prof. Jane" }
        ]
    };

    const attendanceData = [
        { name: 'Present', value: studentData.attendanceRate, color: '#10b981' },
        { name: 'Absent', value: 100 - studentData.attendanceRate, color: '#f1f5f9' }
    ];

    return (
        <div className="space-y-8 pb-10 font-sans">
            {/* 1. Welcome Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1e1b4b] to-[#312e81] p-10 text-white shadow-2xl border border-white/10">
                <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-[#a5b4fc]">
                            <TrendingUp size={14} />
                            Student Dashboard
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-1">Howdy, {user?.fullName?.split(' ')[0] || 'Scholar'}! 👋</h1>
                        <p className="text-[#a5b4fc] text-lg font-medium">Ready to continue your learning journey today?</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20 shadow-inner">
                            <p className="text-[10px] text-[#a5b4fc] font-black uppercase tracking-widest mb-1 opacity-80">Local Time</p>
                            <span className="font-mono text-2xl font-black text-white tabular-nums">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </span>
                        </div>
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] flex items-center justify-center border-2 border-white/20 shadow-lg">
                            <GraduationCap size={32} />
                        </div>
                    </div>
                </div>

                {/* Decorative background glass elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
            </div>

            {/* 2. Key Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "My Wallet", value: `₹${studentData.walletBalance}`, icon: Wallet, color: "from-[#ef4444] to-[#f43f5e]", href: "/dashboard/wallet" },
                    { label: "Attendance", value: `${studentData.attendanceRate}%`, icon: CalendarCheck, color: "from-[#10b981] to-[#059669]", href: "/dashboard/attendance" },
                    { label: "My Courses", value: studentData.coursesCount, icon: BookOpen, color: "from-[#3b82f6] to-[#2563eb]", href: "/dashboard/my-courses" },
                    { label: "Referrals", value: studentData.referralCount, icon: Share2, color: "from-[#8b5cf6] to-[#7c3aed]", href: "/dashboard/referral" }
                ].map((stat, i) => (
                    <Link key={i} to={stat.href} className="group">
                        <Card className="border-none shadow-sm rounded-3xl p-6 h-36 bg-white overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg shadow-indigo-100`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{stat.label}</h4>
                                    <span className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{stat.value}</span>
                                </div>
                            </div>
                            <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                <ChevronRight size={24} className="text-gray-300" />
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 3. Left Column: Upcoming & Progress */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Attendance Analysis Card */}
                    <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Attendance Summary</h3>
                                <p className="text-gray-400 text-sm font-medium">Monthly consistency overview</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="relative h-48 w-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={attendanceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={80}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {attendanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-gray-900">{studentData.attendanceRate}%</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Present</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-4 w-full">
                                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-10 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Present Days</p>
                                            <p className="font-black text-gray-900">24 Days</p>
                                        </div>
                                    </div>
                                    <span className="text-green-600 font-black text-sm">+2%</span>
                                </div>
                                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-10 bg-red-400 rounded-full"></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Absent Days</p>
                                            <p className="font-black text-gray-900">2 Days</p>
                                        </div>
                                    </div>
                                    <span className="text-gray-400 font-black text-sm">Stable</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Recent Exam Results */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Performance</h3>
                            <Link to="/dashboard/test-results" className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">View All</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {studentData.recentResults.map((result, i) => (
                                <Card key={i} className="border-none shadow-sm rounded-[1.5rem] bg-white p-6 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                                            <Award size={20} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-gray-900">{result.score}%</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exam Score</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-800 text-lg mb-1">{result.subject}</h4>
                                        <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
                                            <Clock size={12} /> {result.date}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Right Column: Profile & Upcoming */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Quick Profile Bio */}
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white p-8 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
                        <div className="relative z-10">
                            <div className="mx-auto w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden mb-4 bg-gray-100">
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <User size={48} />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-1 capitalize">{user?.fullName || 'Full Name'}</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 px-4 truncate">{user?.email}</p>
                            
                            <Link to="/dashboard/profile" className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                                Edit Profile
                            </Link>
                        </div>
                    </Card>

                    {/* Upcoming Classes */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight px-2">Next Sessions</h3>
                        <div className="space-y-4">
                            {studentData.upcomingClasses.map((item, i) => (
                                <div key={i} className="flex gap-4 p-5 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 hover:border-blue-100 transition-all">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex flex-col items-center justify-center text-blue-600 shrink-0">
                                        <span className="text-[10px] font-black uppercase leading-none mb-1">Live</span>
                                        <Clock size={20} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-gray-900 truncate mb-0.5">{item.subject}</h4>
                                        <p className="text-xs text-gray-500 font-medium truncate mb-2">{item.instructor}</p>
                                        <div className="inline-flex py-1 px-3 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black tracking-widest uppercase">
                                            {item.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

