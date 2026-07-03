import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Briefcase,
    CalendarX,
    Check,
    RotateCcw,
    Save,
    Settings,
    Wrench,
    CheckCircle2
} from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { updateWeekOff, fetchWeekOffDays, saveWeekOffDays } from '@/store/attendanceSlice';
import { toast } from 'react-hot-toast';

const DAYS_OF_WEEK = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function WeekOffDaysPage() {
    const selectedHolidays = useSelector((state) => state.attendance.weekOffDays || ['Saturday', 'Sunday']);
    const loading = useSelector((state) => state.attendance.loading);
    const dispatch = useDispatch();
    const [tempHolidays, setTempHolidays] = useState(selectedHolidays);

    // Fetch config on mount
    useEffect(() => {
        dispatch(fetchWeekOffDays());
    }, [dispatch]);

    // Synchronize local state with Redux when Redux state changes
    useEffect(() => {
        setTempHolidays(selectedHolidays);
    }, [selectedHolidays]);

    const toggleHoliday = (day) => {
        if (tempHolidays.includes(day)) {
            setTempHolidays(tempHolidays.filter(d => d !== day));
        } else {
            setTempHolidays([...tempHolidays, day]);
        }
    };

    const handleSave = async () => {
        try {
            await dispatch(saveWeekOffDays(tempHolidays)).unwrap();
            toast.success('Week off configuration saved successfully!');
        } catch (error) {
            toast.error(error || 'Failed to save configuration');
        }
    };

    const handleReset = () => {
        setTempHolidays(['Saturday', 'Sunday']);
        toast.success('Reset to default (Sat-Sun)');
    };

    const setAllWorking = () => {
        setTempHolidays([]);
        toast.success('All days set as working days');
    };
    
    const setAllHolidays = () => {
        setTempHolidays(DAYS_OF_WEEK);
        toast.success('All days set as holidays');
    };

    const toggleAll = () => {
        if (tempHolidays.length === DAYS_OF_WEEK.length) {
            setTempHolidays([]);
        } else {
            setTempHolidays(DAYS_OF_WEEK);
        }
    };

    const workingDaysCount = DAYS_OF_WEEK.length - tempHolidays.length;
    const holidayDaysCount = tempHolidays.length;

    return (
        <div className="space-y-6 font-sans">
            {/* Top Banner */}
            <div className="bg-[#6366f1] p-6 rounded-xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Week Off Management</h1>
                        <p className="text-white/80 text-sm">Configure weekly holidays and working days for your institution</p>
                    </div>
                </div>
                <Button 
                    onClick={toggleAll}
                    className="bg-white/90 hover:bg-white text-gray-800 rounded-lg px-6 flex items-center gap-2 font-bold text-xs"
                >
                    <Check size={18} />
                    Toggle All
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Stats and Selection */}
                <div className="flex-1 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col border-l-4 border-l-green-500">
                            <div className="bg-green-100 text-green-600 p-2 rounded-lg w-fit mb-4">
                                <Briefcase size={20} />
                            </div>
                            <span className="text-3xl font-bold text-gray-800">{workingDaysCount}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Working Days</span>
                            <span className="text-[10px] text-gray-400 mt-1">{Math.round((workingDaysCount / 7) * 100)}% of week</span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col border-l-4 border-l-red-500">
                            <div className="bg-red-100 text-red-600 p-2 rounded-lg w-fit mb-4">
                                <CalendarX size={20} />
                            </div>
                            <span className="text-3xl font-bold text-gray-800">{holidayDaysCount}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Holiday Days</span>
                            <span className="text-[10px] text-gray-400 mt-1">{Math.round((holidayDaysCount / 7) * 100)}% of week</span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col border-l-4 border-l-blue-500">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg w-fit mb-4">
                                <Calendar size={20} />
                            </div>
                            <span className="text-3xl font-bold text-gray-800">7</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Days</span>
                            <span className="text-[10px] text-gray-400 mt-1">Full week</span>
                        </div>
                    </div>

                    {/* Day Selection Cards */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar size={18} className="text-gray-800" />
                            <h2 className="text-lg font-bold text-gray-800">Select Holiday Days</h2>
                        </div>
                        <p className="text-gray-400 text-xs mb-8">Click on days to toggle between working day and holiday. Selected days will be marked as holidays.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {DAYS_OF_WEEK.map((day) => {
                                const isHoliday = tempHolidays.includes(day);
                                return (
                                    <div
                                        key={day}
                                        onClick={() => toggleHoliday(day)}
                                        className={`relative p-8 rounded-2xl cursor-pointer transition-all border-none ${isHoliday ? 'bg-[#e74c3c] text-white shadow-lg' : 'bg-[#2ecc71] text-white shadow-lg'
                                            }`}
                                    >
                                        <div className="absolute top-4 right-4 bg-white/20 p-0.5 rounded border border-white/40">
                                            {isHoliday ? <Check size={14} className="text-white" /> : <div className="w-3.5 h-3.5"></div>}
                                        </div>
                                        <div className="flex flex-col items-center text-center gap-3">
                                            <div className="p-3 bg-white/20 rounded-2xl">
                                                {isHoliday ? <CalendarX size={24} /> : <Briefcase size={24} />}
                                            </div>
                                            <span className="text-sm font-bold uppercase tracking-wider">{day}</span>
                                            <span className="text-[10px] opacity-80 uppercase font-bold tracking-widest">
                                                {isHoliday ? 'Holiday' : 'Working Day'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <Wrench size={18} className="text-gray-800" />
                            <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg px-6 py-2.5 h-10 text-xs font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={16} />
                                {loading ? 'Saving...' : 'Save Configuration'}
                            </Button>
                            <Button
                                onClick={handleReset}
                                disabled={loading}
                                className="bg-[#b9875a] hover:bg-[#a6764a] text-white rounded-lg px-6 py-2.5 h-10 text-xs font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                            >
                                <RotateCcw size={16} />
                                Reset to Default
                            </Button>
                            <Button
                                onClick={setAllWorking}
                                disabled={loading}
                                className="bg-[#2c3e50] hover:bg-[#1a252f] text-white rounded-lg px-6 py-2.5 h-10 text-xs font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                            >
                                <Briefcase size={16} />
                                All Working
                            </Button>
                            <Button
                                onClick={setAllHolidays}
                                disabled={loading}
                                className="bg-[#c0392b] hover:bg-[#a93226] text-white rounded-lg px-6 py-2.5 h-10 text-xs font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                            >
                                <CalendarX size={16} />
                                All Holidays
                            </Button>
                        </div>
                        <p className="mt-6 text-[10px] text-gray-400 flex items-center gap-2 italic">
                            <CheckCircle2 size={14} className="text-gray-300" />
                            Changes will be applied immediately after saving. Default: Saturday-Sunday as holidays.
                        </p>
                    </div>
                </div>

                {/* Right Sidebar: Current Config */}
                <div className="w-full lg:w-80">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                        <div className="flex items-center gap-3 mb-8">
                            <Settings size={18} className="text-gray-800" />
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Current Configuration</h2>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Briefcase size={14} className="text-green-500" />
                                    Working Days
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS_OF_WEEK.filter(d => !tempHolidays.includes(d)).map(day => (
                                        <span key={day} className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[10px] font-bold">
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <CalendarX size={14} className="text-red-500" />
                                    Holiday Days
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {tempHolidays.map(day => (
                                        <span key={day} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-bold">
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}






