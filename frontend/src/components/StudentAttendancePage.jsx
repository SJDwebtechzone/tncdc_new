import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchStudentDashboard } from '@/store/studentDashboardSlice';
import {
    ArrowLeft, RefreshCw, PieChart, ChevronLeft, ChevronRight,
    Home, BookOpen, GraduationCap, CalendarCheck, MonitorPlay, Award, ChevronDown, ChevronUp
} from 'lucide-react';
import { PieChart as RechartPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isWeekend, isBefore, isAfter, startOfDay } from 'date-fns';

const STATUS_COLORS = {
    'present': '#4CAF50', 'absent': '#F44336', 'leave': '#FF9800', 'leaves': '#FF9800',
    'holiday': '#9C27B0', 'late': '#2196F3', 'half day': '#00BCD4', 'halfday': '#00BCD4', 'excused': '#607D8B',
};
const STATUS_LABELS = {
    'present': 'Present', 'absent': 'Absent', 'leave': 'Leave', 'leaves': 'Leave',
    'holiday': 'Holiday', 'late': 'Late', 'half day': 'Half Day', 'halfday': 'Half Day', 'excused': 'Excused',
};

export default function StudentAttendancePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { enrolledCourses, loading } = useSelector(state => state.studentDashboard);
    const [selectedCourseIdx, setSelectedCourseIdx] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        if (user?.email && enrolledCourses.length === 0) dispatch(fetchStudentDashboard(user.email));
    }, [dispatch, user, enrolledCourses.length]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        if (user?.email) await dispatch(fetchStudentDashboard(user.email));
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const course = enrolledCourses[selectedCourseIdx] || null;
    const rawRecords = course?.attendance?.records || [];
    const admissionDate = course?.admissionDate ? startOfDay(new Date(course.admissionDate)) : null;
    const today = startOfDay(new Date());

    // Build record dictionary from actual data
    const recordDict = useMemo(() => {
        const dict = {};
        rawRecords.forEach(r => {
            if (r.date) dict[format(new Date(r.date), 'yyyy-MM-dd')] = (r.status || '').trim().toLowerCase();
        });
        return dict;
    }, [rawRecords]);

    // Compute effective status: unmarked past weekdays after admission = absent
    const getEffectiveStatus = (day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        if (recordDict[dateStr]) return recordDict[dateStr];
        // If day is a past weekday after admission date and before today, mark absent
        if (admissionDate && !isWeekend(day) && !isAfter(day, today) && !isBefore(day, admissionDate)) {
            return 'absent';
        }
        return null;
    };

    // Calculate stats using effective status (including auto-absent)
    const stats = useMemo(() => {
        const counts = {};
        if (!admissionDate) return { counts, total: 0 };
        const allDays = eachDayOfInterval({ start: admissionDate, end: today });
        allDays.forEach(day => {
            const status = getEffectiveStatus(day);
            if (!status) return;
            const label = STATUS_LABELS[status] || status.charAt(0).toUpperCase() + status.slice(1);
            const color = STATUS_COLORS[status] || '#78909C';
            if (!counts[label]) counts[label] = { count: 0, color };
            counts[label].count++;
        });
        const total = Object.values(counts).reduce((s, v) => s + v.count, 0);
        return { counts, total };
    }, [admissionDate, today, recordDict]);

    // Calendar
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const firstDayOfWeek = getDay(monthStart);
    const paddingDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const getDayStyle = (day) => {
        const status = getEffectiveStatus(day);
        if (status === 'present') return { bg: 'bg-[#4CAF50]', text: 'text-white' };
        if (status === 'absent') return { bg: 'bg-[#F44336]', text: 'text-white' };
        if (status === 'leave' || status === 'leaves') return { bg: 'bg-[#FF9800]', text: 'text-white' };
        if (status === 'holiday') return { bg: 'bg-[#9C27B0]', text: 'text-white' };
        if (status === 'late') return { bg: 'bg-[#2196F3]', text: 'text-white' };
        if (status === 'half day' || status === 'halfday') return { bg: 'bg-[#00BCD4]', text: 'text-white' };
        if (status) return { bg: 'bg-[#607D8B]', text: 'text-white' };
        if (isWeekend(day)) return { bg: 'border-2 border-[#F44336]', text: 'text-[#F44336]' };
        return { bg: 'bg-gray-100', text: 'text-gray-400' };
    };

    const presentCount = stats.counts['Present']?.count || 0;
    const absentCount = stats.counts['Absent']?.count || 0;
    const leavesCount = stats.counts['Leave']?.count || 0;
    const holidayCount = stats.counts['Holiday']?.count || 0;

    // Analytics data
    const pieData = Object.entries(stats.counts).filter(([, v]) => v.count > 0).map(([name, v]) => ({ name, value: v.count, color: v.color }));
    const workingDays = stats.total - holidayCount;
    const attendancePct = workingDays > 0 ? ((presentCount / workingDays) * 100).toFixed(1) : '0.0';

    // Monthly bar chart (last 6 months)
    const monthlyData = useMemo(() => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const m = subMonths(new Date(), i);
            const mStart = startOfMonth(m);
            const mEnd = endOfMonth(m);
            const mDays = eachDayOfInterval({ start: mStart, end: isBefore(mEnd, today) ? mEnd : today });
            let mP = 0, mA = 0, mL = 0, mH = 0;
            mDays.forEach(d => {
                const s = getEffectiveStatus(d);
                if (s === 'present') mP++;
                else if (s === 'absent') mA++;
                else if (s === 'leave' || s === 'leaves') mL++;
                else if (s === 'holiday') mH++;
            });
            data.push({ month: format(m, 'MMM'), Present: mP, Absent: mA, Leave: mL, Holiday: mH });
        }
        return data;
    }, [recordDict, admissionDate]);

    // Weekend count this year
    const weekendCount = useMemo(() => {
        const yearStart = new Date(new Date().getFullYear(), 0, 1);
        return eachDayOfInterval({ start: yearStart, end: today }).filter(isWeekend).length;
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 relative selection:bg-indigo-100 flex flex-col">
            {/* Top Header */}
            <div className="bg-[#673AB7] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
                <button onClick={() => navigate('/pwa')} className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-[15px] font-bold tracking-wide">Attendance Calendar</h1>
                <button onClick={handleRefresh} className={`p-2 -mr-2 rounded-full hover:bg-white/10 active:scale-95 transition-all ${isRefreshing ? 'animate-spin' : ''}`}>
                    <RefreshCw size={18} />
                </button>
            </div>

            <div className="flex-1 px-4 pt-6 space-y-6">
                {/* Course Selection */}
                <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 font-medium px-1">Course Name:</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF9800]"><Award size={18} /></div>
                        <select value={selectedCourseIdx} onChange={(e) => setSelectedCourseIdx(Number(e.target.value))}
                            className="w-full bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-xl h-11 pl-10 pr-10 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#673AB7]/20">
                            {enrolledCourses.length > 0 ? enrolledCourses.map((c, i) => (
                                <option key={i} value={i}>{c.courseName}</option>
                            )) : <option value={0}>No courses found</option>}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    </div>
                </div>

                {/* Date Range & Analytics Toggle */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white border border-gray-200 rounded-xl h-10 px-3 flex items-center gap-2 shadow-sm text-[10px] text-gray-600 font-medium">
                        <CalendarCheck size={14} className="text-gray-400" />
                        <span>From: 1/1/{currentMonth.getFullYear()}</span>
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-xl h-10 px-3 flex items-center gap-2 shadow-sm text-[10px] text-gray-600 font-medium">
                        <CalendarCheck size={14} className="text-gray-400" />
                        <span>To: {format(new Date(), 'd/M/yyyy')}</span>
                    </div>
                    <button onClick={() => setShowChart(prev => !prev)}
                        className={`w-10 h-10 shrink-0 border rounded-xl flex items-center justify-center shadow-sm transition-colors active:scale-95 ${showChart ? 'bg-[#673AB7] border-[#673AB7] text-white' : 'bg-white border-gray-200 text-[#FF9800] hover:bg-gray-50'}`}>
                        {showChart ? <ChevronUp size={18} /> : <PieChart size={18} />}
                    </button>
                </div>

                {/* Inline Analytics Section */}
                {showChart && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Attendance % Hero */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-[#673AB7]/20 bg-[#673AB7]/5">
                                <span className="text-xl font-black text-[#673AB7]">{attendancePct}%</span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Overall Attendance</p>
                        </div>
                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                                <p className="text-lg font-black text-gray-800">{stats.total}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wide">Total Days</p>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                                <p className="text-lg font-black text-gray-800">{workingDays}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wide">Working Days</p>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
                                <p className="text-lg font-black text-gray-800">{weekendCount}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wide">Weekends</p>
                            </div>
                        </div>
                        {/* Pie Chart */}
                        {pieData.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Status Distribution</p>
                                <div className="h-52 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartPie>
                                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" strokeWidth={2} stroke="#fff">
                                                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgb(0 0 0 / 0.12)', fontSize: '12px' }} formatter={(v, n) => [`${v} days`, n]} />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '700' }} />
                                        </RechartPie>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                        {/* Status Breakdown */}
                        <div className="space-y-2">
                            {pieData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-xs font-bold text-gray-700">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-gray-800">{item.value}</span>
                                        <span className="text-[10px] font-bold text-gray-400 w-12 text-right">{((item.value / stats.total) * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Monthly Bar Chart */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Monthly Trend (Last 6 Months)</p>
                            <div className="h-44 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData} barGap={2} barSize={10}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgb(0 0 0 / 0.12)', fontSize: '11px' }} />
                                        <Bar dataKey="Present" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Absent" fill="#F44336" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Leave" fill="#FF9800" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Holiday" fill="#9C27B0" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#4CAF50] rounded-xl p-3 text-white relative overflow-hidden shadow-sm">
                        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/20 rounded-full blur-md"></div>
                        <p className="text-[10px] font-bold uppercase tracking-wide opacity-90 mb-1">Present</p>
                        <p className="text-2xl font-black">{presentCount}</p>
                    </div>
                    <div className="bg-[#F44336] rounded-xl p-3 text-white relative overflow-hidden shadow-sm">
                        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/20 rounded-full blur-md"></div>
                        <p className="text-[10px] font-bold uppercase tracking-wide opacity-90 mb-1">Absent</p>
                        <p className="text-2xl font-black">{absentCount}</p>
                    </div>
                    <div className="bg-[#FF9800] rounded-xl p-3 text-white relative overflow-hidden shadow-sm">
                        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/20 rounded-full blur-md"></div>
                        <p className="text-[10px] font-bold uppercase tracking-wide opacity-90 mb-1">Leaves</p>
                        <p className="text-2xl font-black">{leavesCount}</p>
                    </div>
                    <div className="bg-[#9C27B0] rounded-xl p-3 text-white relative overflow-hidden shadow-sm">
                        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/20 rounded-full blur-md"></div>
                        <p className="text-[10px] font-bold uppercase tracking-wide opacity-90 mb-1">Holiday</p>
                        <p className="text-2xl font-black">{holidayCount}</p>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <h3 className="text-sm font-bold text-gray-800 tracking-wide">{format(currentMonth, 'MMMM yyyy')}</h3>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                            <ChevronRight size={20} className="text-gray-600" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-4 text-center">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className={`text-[10px] font-bold ${day === 'Sat' || day === 'Sun' ? 'text-[#F44336]' : 'text-gray-500'}`}>{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center">
                        {Array.from({ length: paddingDays }).map((_, i) => <div key={`p-${i}`} className="h-8"></div>)}
                        {daysInMonth.map((day, i) => {
                            const style = getDayStyle(day);
                            return (
                                <div key={i} className="flex justify-center items-center h-8">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${style.bg} ${style.text}`}>{format(day, 'd')}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2">
                        {[{ c: 'bg-[#4CAF50]', l: 'Present' }, { c: 'bg-[#F44336]', l: 'Absent' }, { c: 'bg-[#FF9800]', l: 'Leaves' }, { c: 'bg-[#9C27B0]', l: 'Holiday' }, { c: 'border border-[#F44336]', l: 'Weekend' }].map(x => (
                            <div key={x.l} className="flex items-center gap-1.5">
                                <div className={`w-2.5 h-2.5 rounded-full ${x.c}`}></div>
                                <span className="text-[9px] font-medium text-gray-600 uppercase tracking-wide">{x.l}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-6 left-6 right-6 z-50">
                <div className="bg-white/90 backdrop-blur-xl border border-white h-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-around px-2 relative">
                    <Link to="/pwa" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#673AB7] transition-colors w-14">
                        <Home size={20} strokeWidth={2.5} /><span className="text-[8px] font-bold uppercase tracking-wide">Home</span>
                    </Link>
                    <Link to="/dashboard/all-courses" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#673AB7] transition-colors w-14">
                        <BookOpen size={20} strokeWidth={2.5} /><span className="text-[8px] font-bold uppercase tracking-wide">Courses</span>
                    </Link>
                    <div className="relative -top-6 w-14 flex justify-center">
                        <Link to="/dashboard" className="w-14 h-14 rounded-full bg-[#673AB7] flex items-center justify-center text-white shadow-lg shadow-[#673AB7]/30 border-4 border-[#F8FAFC] active:scale-95 transition-transform">
                            <GraduationCap size={22} strokeWidth={2.5} />
                        </Link>
                    </div>
                    <Link to="/dashboard/attendance" className="flex flex-col items-center gap-1 text-[#673AB7] w-14">
                        <CalendarCheck size={20} strokeWidth={2.5} /><span className="text-[8px] font-bold uppercase tracking-wide">Attendance</span>
                    </Link>
                    <Link to="/dashboard/online-courses" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#673AB7] transition-colors w-14">
                        <MonitorPlay size={20} strokeWidth={2.5} /><span className="text-[8px] font-bold uppercase tracking-wide">Lectures</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
