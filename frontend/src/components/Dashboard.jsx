import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "@/store/dashboardSlice";
import { fetchAdmissions } from "@/store/admissionSlice";
import { Card, CardContent } from "@/components/ui/card"
import {
    CreditCard,
    Mail,
    UserPlus,
    PlusCircle,
    FileText,
    CalendarCheck,
    Settings,
    Users,
    Rocket,
    Plus,
    MessageCircle
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TimeDisplay } from "@/components/TimeDisplay"
import { generateInvoice } from "@/utils/invoiceGenerator";

export default function Dashboard() {
    const [loginTime] = useState(new Date());
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: realData, loading } = useSelector((state) => state.dashboard);
    const { user } = useSelector((state) => state.auth);
    const { admissions } = useSelector((state) => state.admissions);

    const permissions = user?.permissions || {};
    const isAdmin = user?.isAdmin || user?.roles?.includes('ADMIN') || user?.role === 'ADMIN';

    const hasPermission = (label) => {
        if (isAdmin) return true;
        return permissions[label]?.view === true;
    };

    const data = realData || {
        wallet: { fees: 0, expense: 0, profit: 0, credits: 0 },
        stats: { admissions: 0, enquiries: 0, franchises: 0, courses: 0 },
        topCards: { franchiseAdmission: 0, remainingAdmission: 0, registeredToday: 0 },
        fees: { total: 0, pending: 0, paid: 0 },
        examRequests: { total: 0, pending: 0, approved: 0 },
        certificates: { total: 0, pending: 0, approved: 0 },
        enquiryStatus: { total: 0, pending: 0, today: 0 }
    };

    useEffect(() => {
        dispatch(fetchDashboardData());
        if (isAdmin || hasPermission('Students List')) {
            dispatch(fetchAdmissions());
        }
    }, [dispatch, isAdmin]);

    const walletChartData = [
        { name: 'Total Fees', value: data.wallet.fees },
        { name: 'Total Expense', value: data.wallet.expense },
        { name: 'Profit', value: data.wallet.profit },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* 0. Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] p-10 text-white shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.fullName || 'User'}</h1>
                        <p className="text-blue-100 text-lg">Here's what's happening with your institution today</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10">
                            <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Last Updated</p>
                            <span className="font-mono text-xl font-bold text-white">
                                {loginTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}
                            </span>
                        </div>
                        <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl border border-white/10"></div>
                    </div>
                </div>

                {/* Decorative background circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"></div>
            </div>

            {/* 0.5 Student Lookup Section */}
            <Card className="border-none shadow-sm rounded-xl bg-white">
                <CardContent className="p-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Student Details Lookup</h3>
                    <div className="relative">
                        <select 
                            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-4 focus:outline-gray-300 focus:ring-0 cursor-pointer"
                            onChange={(e) => {
                                if (e.target.value) {
                                    navigate(`/dashboard/students/list/edit/${e.target.value}`);
                                }
                            }}
                        >
                            <option value="">Select a student to view details...</option>
                            {admissions && admissions.map((student) => (
                                <option key={student.id} value={student.id} className="text-gray-900">
                                    {student.firstName} {student.surname} ({student.studentId})
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 0.8 Overview Statistics Header */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-sm"></div>
                <h2 className="text-2xl font-bold text-gray-800">Overview Statistics</h2>
            </div>

            {/* 0.9 New Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "TOTAL ADMISSIONS", count: data.stats.admissions, color: "from-[#6366f1] to-[#8b5cf6]" },
                    { label: "TOTAL ENQUIRIES", count: data.stats.enquiries, color: "from-[#10b981] to-[#34d399]", icon: MessageCircle },
                    { label: "TOTAL FRANCHISES", count: data.stats.franchises, color: "from-[#0d9488] to-[#2dd4bf]" },
                    { label: "TOTAL COURSES", count: data.stats.courses, color: "from-[#84cc16] to-[#a3e635]" }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-xl p-6 flex flex-col justify-between h-32 bg-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</h4>
                                <span className="text-4xl font-bold text-gray-800">{stat.count}</span>
                            </div>
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} shadow-sm flex items-center justify-center text-white`}>
                                {stat.icon && <stat.icon size={24} />}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 1. Top Colored Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Franchise Admission - Purple/Blue */}
                {hasPermission('Admissions') && (
                    <Link to="/dashboard/students/admissions" className="block transform hover:scale-[1.02] transition-all">
                        <Card className="bg-gradient-to-r from-[#5b4fcbe6] to-[#7c6fd8] border-none text-white shadow-lg overflow-hidden relative min-h-[180px]">
                            <div className="absolute top-0 right-0 p-10 opacity-10 transform scale-150 translate-x-4 -translate-y-4">
                                <UserPlus size={120} />
                            </div>
                            <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <UserPlus size={20} className="text-white" />
                                    </div>
                                    <span className="font-semibold text-lg">Franchise Admission</span>
                                </div>
                                <div>
                                    <h2 className="text-5xl font-bold mb-2">{data.topCards.franchiseAdmission}</h2>
                                    <p className="text-white/80 text-sm">Total admissions in franchises</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )}

                {/* Remaining Admission - Pink */}
                {hasPermission('Students List') && (
                    <Link to="/dashboard/students/list" className="block transform hover:scale-[1.02] transition-all">
                        <Card className="bg-gradient-to-r from-[#0d9488] to-[#0f766e] border-none text-white shadow-lg overflow-hidden relative min-h-[180px]">
                            <div className="absolute top-0 right-0 p-10 opacity-10 transform scale-150 rotate-12">
                                <FileText size={120} />
                            </div>
                            <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                <div className="mb-2">
                                    <span className="font-semibold text-lg">Remaining Admission</span>
                                </div>
                                <div>
                                    <h2 className="text-5xl font-bold mb-2">{data.topCards.remainingAdmission}</h2>
                                    <p className="text-white/80 text-sm">Pending applications</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )}

                {/* Registered Today - Cyan/Blue */}
                {hasPermission('Students List') && (
                    <Link to="/dashboard/students/list" className="block transform hover:scale-[1.02] transition-all">
                        <Card className="bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] border-none text-white shadow-lg overflow-hidden relative min-h-[180px]">
                            <div className="absolute top-0 right-0 p-8 opacity-10 transform scale-150">
                                <CalendarCheck size={120} />
                            </div>
                            <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                <div className="mb-2">
                                    <span className="font-semibold text-lg">Registered Today</span>
                                </div>
                                <div>
                                    <h2 className="text-5xl font-bold mb-2">{data.topCards.registeredToday}</h2>
                                    <p className="text-white/80 text-sm">Today's registrations</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )}
            </div>

            {/* 2. Quick Access Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#6366f1] rounded-md">
                        <Rocket size={16} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Quick Access</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: "New Admission", icon: UserPlus, color: "text-[#6366f1]", href: "/dashboard/students/admissions", perm: "Admissions" },
                        { label: "Add Course", icon: Plus, color: "text-gray-600", href: "/dashboard/courses", perm: "Courses" },
                        { label: "Fees Details", icon: FileText, color: "text-gray-600", href: "/dashboard/fees/upcoming", perm: "Upcoming Installments" },
                        { label: "Attendance", icon: CalendarCheck, color: "text-gray-600", href: "/dashboard/attendance/add", perm: "Add Attendance" },
                        { label: "Settings", icon: Settings, color: "text-[#8b5cf6]", href: "/dashboard/settings/general", perm: "Settings" },
                        { label: "Batches", icon: Users, color: "text-[#06b6d4]", href: "/dashboard/batches", perm: "Batches" },
                    ].filter(item => hasPermission(item.perm)).map((item, i) => (
                        <Link
                            key={i}
                            to={item.href}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 h-28 transform active:scale-95"
                        >
                            {item.icon === UserPlus ? (
                                <div className="flex relative">
                                    <UserPlus size={28} className={item.color} />
                                </div>
                            ) : (
                                <item.icon size={28} className={item.color} />
                            )}
                            <span className={`text-sm font-semibold ${item.color === 'text-gray-600' ? 'text-gray-600' : 'text-[#5d5fef]'}`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 3. Fees Overview & Summary (Bottom Section) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Fees Overview */}
                <Card className="lg:col-span-3 border-none shadow-sm rounded-xl overflow-hidden bg-white flex flex-col">
                    <div className="p-6 pb-2">
                        <h3 className="text-lg font-bold text-gray-800">Fees Overview</h3>
                    </div>
                    <CardContent className="flex-1 flex flex-col justify-end p-6">
                        <div className="flex-1 min-h-[200px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Paid', value: data.fees.paid || 0, color: '#22c55e' },
                                            { name: 'Pending', value: data.fees.pending || 0, color: '#f87171' }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {[
                                            { name: 'Paid', value: data.fees.paid || 0, color: '#22c55e' },
                                            { name: 'Pending', value: data.fees.pending || 0, color: '#f87171' }
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-8 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-3 bg-green-500 rounded-sm"></div>
                                <span className="text-sm text-gray-600 font-medium">Paid Fees</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-3 bg-red-400 rounded-sm"></div>
                                <span className="text-sm text-gray-600 font-medium">Pending Fees</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Fees Summary */}
                <Card className="lg:col-span-2 border-none shadow-sm rounded-xl overflow-hidden bg-white">
                    <div className="p-6 pb-2">
                        <h3 className="text-lg font-bold text-gray-800">Fees Summary</h3>
                    </div>
                    <CardContent className="p-6 pt-0">
                        <div className="mt-4 p-4 rounded-xl border-l-4 border-blue-500 bg-white shadow-sm mb-4">
                            <p className="text-gray-500 text-sm mb-1">Total Fees</p>
                            <h3 className="text-2xl font-bold text-blue-500">₹{data.fees.total.toLocaleString()}</h3>
                        </div>
                        <div className="p-4 rounded-xl border-l-4 border-red-500 bg-white shadow-sm mb-4">
                            <p className="text-gray-500 text-sm mb-1">Pending Fees</p>
                            <h3 className="text-2xl font-bold text-red-500">₹{data.fees.pending.toLocaleString()}</h3>
                        </div>
                        <div className="p-4 rounded-xl border-l-4 border-green-500 bg-white shadow-sm mb-4">
                            <p className="text-gray-500 text-sm mb-1">Paid Fees</p>
                            <h3 className="text-2xl font-bold text-green-500">₹{data.fees.paid.toLocaleString()}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>



            {/* 4. Exam Requests & Certificates Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Exam Requests */}
                {hasPermission('Exam Requests') && (
                    <Link to="/dashboard/exams/requests" className="block transform hover:scale-[1.01] transition-all">
                        <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white h-full">
                            <div className="p-6 pb-2">
                                <h3 className="text-lg font-bold text-gray-800">Exam Requests</h3>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-gray-500 text-sm mb-1">Total Requests</p>
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">{data.examRequests.total}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-amber-100/30 p-4 rounded-xl border-l-4 border-amber-300">
                                        <p className="text-gray-500 text-sm mb-1">Pending</p>
                                        <h4 className="text-2xl font-bold text-amber-600">{data.examRequests.pending}</h4>
                                    </div>
                                    <div className="bg-green-100/30 p-4 rounded-xl border-l-4 border-green-300">
                                        <p className="text-gray-500 text-sm mb-1">Approved</p>
                                        <h4 className="text-2xl font-bold text-green-600">{data.examRequests.approved}</h4>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )}

                {/* Certificates */}
                {hasPermission('Requested Certificates') && (
                    <Link to="/dashboard/certificates/requested" className="block transform hover:scale-[1.01] transition-all">
                        <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white h-full">
                            <div className="p-6 pb-2">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-purple-600">●</span> Certificates
                                </h3>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-gray-500 text-sm mb-1">Total Certificates</p>
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">{data.certificates.total}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-amber-100/30 p-4 rounded-xl border-l-4 border-amber-300">
                                        <p className="text-gray-500 text-sm mb-1">Pending</p>
                                        <h4 className="text-2xl font-bold text-amber-600">{data.certificates.pending}</h4>
                                    </div>
                                    <div className="bg-green-100/30 p-4 rounded-xl border-l-4 border-green-300">
                                        <p className="text-gray-500 text-sm mb-1">Approved</p>
                                        <h4 className="text-2xl font-bold text-green-600">{data.certificates.approved}</h4>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )}
            </div>

            {/* 5. Wallet & Enquiry Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Wallet Overview Component */}
                {hasPermission('Student Wallet') && (
                    <Card className="lg:col-span-3 border-none shadow-sm rounded-xl overflow-hidden bg-white">
                        <div className="p-6 pb-2">
                            <h3 className="text-lg font-bold text-gray-800">Wallet Overview</h3>
                        </div>
                        <CardContent className="p-6">
                            <div className="h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={walletChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" fill="#3b82f6" barSize={40} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-blue-50/50 p-4 rounded-xl text-center">
                                    <p className="text-gray-500 text-sm mb-1">Total Fees</p>
                                    <h4 className="text-2xl font-bold text-blue-600">₹{data.wallet.fees.toLocaleString()}</h4>
                                </div>
                                <div className="bg-red-50/50 p-4 rounded-xl text-center">
                                    <p className="text-gray-500 text-sm mb-1">Expense</p>
                                    <h4 className="text-2xl font-bold text-red-500">₹{data.wallet.expense.toLocaleString()}</h4>
                                </div>
                                <div className="bg-green-50/50 p-4 rounded-xl text-center">
                                    <p className="text-gray-500 text-sm mb-1">Profit</p>
                                    <h4 className="text-2xl font-bold text-green-500">₹{data.wallet.profit.toLocaleString()}</h4>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Right Column Components */}
                <div className={`${hasPermission('Student Wallet') ? 'lg:col-span-2' : 'lg:col-span-5'} space-y-6`}>
                    {/* Total Enquiry */}
                    {hasPermission('Student Enquiries') && (
                        <Card className="border-none shadow-sm rounded-xl overflow-hidden relative bg-white">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                            <CardContent className="p-6 flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 font-medium mb-2">Total Enquiry</p>
                                    <h3 className="text-4xl font-bold text-blue-600">{data.enquiryStatus.total}</h3>
                                </div>
                                <div className="p-2 bg-blue-50 rounded-full text-blue-400">
                                    <Mail size={24} />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        {/* Pending */}
                        {hasPermission('Student Enquiries') && (
                            <Card className="border-none shadow-sm rounded-xl overflow-hidden relative bg-white">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
                                <CardContent className="p-6">
                                    <p className="text-gray-500 font-medium mb-2 text-sm">Pending</p>
                                    <h3 className="text-3xl font-bold text-amber-500">{data.enquiryStatus.pending}</h3>
                                </CardContent>
                            </Card>
                        )}

                        {/* Today */}
                        {hasPermission('Student Enquiries') && (
                            <Card className="border-none shadow-sm rounded-xl overflow-hidden relative bg-white">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-400"></div>
                                <CardContent className="p-6">
                                    <p className="text-gray-500 font-medium mb-2 text-sm">Today</p>
                                    <h3 className="text-3xl font-bold text-cyan-500">{data.enquiryStatus.today}</h3>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Franchise Wallet */}
                    {isAdmin && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <CreditCard size={20} className="text-purple-900" /> Franchise Wallet
                            </h3>
                            <div className="bg-green-100/50 p-6 rounded-xl border-none shadow-sm h-32 flex flex-col justify-center">
                                <p className="text-gray-500 font-medium mb-1">Credits</p>
                                <h3 className="text-3xl font-bold text-green-700">₹{data.wallet.credits.toLocaleString()}</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}






