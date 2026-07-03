import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Palmtree,
    Plus,
    Search,
    Filter,
    RotateCcw,
    Calendar,
    CalendarCheck,
    Clock,
    X,
    CheckCircle2,
    Trash2,
    ArrowLeft,
    Info,
    Layout
} from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { addHoliday, deleteHoliday } from '@/store/attendanceSlice';

export default function HolidaysPage() {
    const holidays = useSelector((state) => state.attendance.holidays || []);
    const dispatch = useDispatch();
    const [view, setView] = useState('list'); // 'list' or 'add'

    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Active',
        isRecurring: false
    });

    const handleCreate = (e) => {
        e.preventDefault();
        dispatch(addHoliday(formData));
        setView('list');
        setFormData({ title: '', type: '', description: '', startDate: '', endDate: '', status: 'Active', isRecurring: false });
    };

    const stats = [
        { label: "TOTAL HOLIDAYS", value: holidays.length, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-500" },
        { label: "ACTIVE", value: holidays.filter(h => h.status === 'Active').length, icon: CalendarCheck, color: "text-green-500", bg: "bg-green-50", border: "border-green-500" },
        { label: "CURRENT", value: "0", icon: Clock, color: "text-red-500", bg: "bg-red-50", border: "border-red-500" },
        { label: "UPCOMING", value: "0", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-500" },
    ];

    if (view === 'add') {
        return (
            <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-10">
                {/* Header Banner */}
                <div className="bg-[#6366f1] p-8 rounded-sm text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full flex items-center justify-center">
                            <Plus size={24} strokeWidth={3} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Add New Holiday</h1>
                            <p className="text-blue-100 text-[11px] font-medium opacity-90 uppercase tracking-widest mt-1 text-xs">Create a new holiday entry for your institution calendar</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setView('list')}
                        className="bg-white hover:bg-gray-100 text-gray-800 px-6 h-9 rounded-sm flex items-center gap-2 border-none font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all"
                    >
                        <ArrowLeft size={16} />
                        Back to Holidays
                    </Button>
                </div>

                <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-10 space-y-12">
                    <form onSubmit={handleCreate} className="space-y-12">
                        {/* Basic Information Section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 text-gray-800 border-b border-gray-50 pb-4">
                                <div className="p-1.5 bg-[#1e3a8a]/10 rounded-full text-[#1e3a8a]">
                                    <Info size={16} />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-wider">Basic Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                        Holiday Title <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        required
                                        placeholder="Enter holiday title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                        Holiday Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-500 transition-all cursor-pointer font-sans"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="National">National</option>
                                        <option value="Government">Government</option>
                                        <option value="Regional">Regional</option>
                                        <option value="Institute">Institute</option>
                                        <option value="Optional">Optional</option>
                                    </select>
                                    <p className="text-[10px] text-gray-400 font-medium italic mt-1 leading-relaxed">
                                        National: Government declared holidays | Regional: State/Local holidays | Institute: Internal holidays | Optional: Flexible holidays
                                    </p>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                        Description
                                    </label>
                                    <textarea
                                        className="w-full h-24 rounded-sm border border-gray-200 p-4 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none resize-none bg-white transition-all shadow-sm font-sans"
                                        placeholder="Brief description about the holiday"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Date Information Section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 text-gray-800 border-b border-gray-50 pb-4">
                                <div className="p-1.5 bg-[#1e3a8a]/10 rounded-full text-[#1e3a8a]">
                                    <Calendar size={16} />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-wider">Date Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            required
                                            type="text"
                                            placeholder="dd-mm-yyyy"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all pr-10"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <Calendar size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                        End Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            required
                                            type="text"
                                            placeholder="dd-mm-yyyy"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all pr-10"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <Calendar size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Display Information Section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 text-gray-800 border-b border-gray-50 pb-4">
                                <div className="p-1.5 bg-[#1e3a8a]/10 rounded-full text-[#1e3a8a]">
                                    <Layout size={16} />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-wider">Display Settings</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="w-full h-10 rounded-sm border border-gray-200 px-4 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-600 transition-all cursor-pointer font-sans"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Recurring Settings Section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 text-gray-800 border-b border-gray-50 pb-4">
                                <div className="p-1.5 bg-[#1e3a8a]/10 rounded-full text-[#1e3a8a]">
                                    <RotateCcw size={16} />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-wider">Recurring Settings</h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="recurring"
                                    className="w-4 h-4 rounded border-gray-300 text-[#1e3a8a] accent-[#1e3a8a] cursor-pointer"
                                    checked={formData.isRecurring}
                                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                                />
                                <label htmlFor="recurring" className="text-xs font-bold text-gray-600 cursor-pointer">This is a recurring holiday</label>
                            </div>
                        </section>

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
                            <Button
                                type="button"
                                onClick={() => setView('list')}
                                className="bg-[#059669] hover:bg-[#047857] text-white px-10 h-10 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none transition-all shadow-md active:scale-95 flex items-center justify-center p-0"
                            >
                                <X size={16} className="mr-2" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#1e3a8a] hover:bg-[#152e6e] text-white px-10 h-10 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none transition-all shadow-md active:scale-95 flex items-center justify-center p-0"
                            >
                                <CheckCircle2 size={16} className="mr-2" />
                                Create Holiday
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-sans">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] p-8 rounded-sm text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                        <Palmtree size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight uppercase">Holiday Management</h1>
                        <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest mt-1 opacity-90">Manage institutional holidays, events, and special occasions</p>
                    </div>
                </div>
                <Button
                    onClick={() => setView('add')}
                    className="bg-[#1e463a] hover:bg-[#163028] text-white px-8 h-12 rounded-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 border-none font-bold uppercase tracking-widest text-xs"
                >
                    <Plus size={18} />
                    Add New Holiday
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className={`absolute top-0 left-0 w-1 h-full ${stat.border.replace('border-', 'bg-')}`}></div>
                        <div className="flex flex-col">
                            <div className={`${stat.bg} ${stat.color} p-2 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em]">{stat.label}</span>
                            <span className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
                {/* Main Content */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Filters & Search */}
                    <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8 text-[#1e3a8a] font-bold border-b border-gray-50 pb-4 uppercase tracking-[0.1em] text-sm">
                            <Filter size={18} />
                            <span>Filters & Quick Search</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Holiday Type</label>
                                <select className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white transition-all cursor-pointer">
                                    <option>All Types</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status</label>
                                <select className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white transition-all cursor-pointer">
                                    <option>All Status</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Year</label>
                                <select className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white transition-all cursor-pointer">
                                    <option>All Years</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Search Keywords</label>
                                <Input placeholder="Title, description..." className="h-10 rounded-sm italic border-gray-200" />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <Button className="bg-[#1e3a8a] hover:bg-[#1a365d] text-white min-w-[140px] h-10 rounded-sm font-bold uppercase tracking-widest text-xs transition-all active:scale-95 shadow-md border-none p-0">
                                <Search size={16} className="mr-2" />
                                Apply Filters
                            </Button>
                            <Button variant="outline" className="border-emerald-100 text-[#059669] hover:bg-emerald-50 min-w-[120px] h-10 rounded-sm font-bold uppercase tracking-widest text-xs transition-all active:scale-95 bg-emerald-50/10 p-0">
                                <RotateCcw size={16} className="mr-2" />
                                Reset
                            </Button>
                        </div>
                    </div>

                    {/* Holidays List */}
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] p-5 flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Calendar size={18} />
                            </div>
                            <span>Registered Holidays List</span>
                        </div>
                        <div className="overflow-x-auto min-h-[300px]">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-200">
                                        <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 px-6 tracking-wider border-r border-gray-100">Holiday Details</TableHead>
                                        <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 text-center">Date Range</TableHead>
                                        <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 text-center">Type</TableHead>
                                        <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 text-center">Status</TableHead>
                                        <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 text-center tracking-wider">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {holidays.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-24 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400 gap-6">
                                                    <div className="bg-gray-50 p-6 rounded-3xl">
                                                        <Calendar size={48} className="text-gray-300" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">No Holidays Found</h3>
                                                        <p className="text-[11px] font-medium italic">Start building your institution calendar by adding holidays.</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        holidays.map((h) => (
                                            <TableRow key={h.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm tracking-tight">{h.title}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium italic overflow-hidden text-ellipsis whitespace-nowrap max-w-xs mt-0.5">{h.description || 'No description provided'}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-bold text-gray-600 text-[11px]">
                                                    <span className="bg-gray-100 px-3 py-1 rounded-sm border border-gray-200">
                                                        {h.startDate} <span className="text-gray-400 px-2 font-normal">→</span> {h.endDate}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="bg-[#dcf0fb] text-[#0284c7] px-3 py-1 rounded-sm text-[10px] font-bold border border-[#bae6fd] uppercase tracking-widest">
                                                        {h.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`px-3 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-widest ${h.status === 'Active' ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]' : 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]'
                                                        }`}>
                                                        {h.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8 p-0"
                                                        onClick={() => dispatch(deleteHoliday(h.id))}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 min-h-[400px]">
                        <div className="flex items-center gap-3 mb-8 font-bold text-gray-800 border-b border-gray-50 pb-4 text-xs uppercase tracking-widest">
                            <Clock size={16} className="text-[#6366f1]" />
                            <span>Upcoming Holidays</span>
                        </div>
                        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 gap-4">
                            <div className="bg-gray-50 p-4 rounded-full">
                                <Calendar size={28} className="text-gray-200" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 opacity-70">No upcoming events</p>
                                <p className="text-[10px] italic">Check back later for updates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}






