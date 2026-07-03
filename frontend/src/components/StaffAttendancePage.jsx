import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, RotateCcw, ArrowLeft, Info, Calendar, Search, Filter, CheckCircle2, X, Trash2, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '@/store/userSlice';
import { fetchTeachers } from '@/store/websiteSlice';
import { fetchStaffAttendance, markIndividualAttendance, markBulkAttendance, deleteAttendanceRecord } from '@/store/staffAttendanceSlice';
import { toast } from 'react-hot-toast';

export default function StaffAttendancePage() {
    const dispatch = useDispatch();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());

    const [view, setView] = useState('list'); // 'list', 'mark', 'bulk'
    const { users } = useSelector((state) => state.users);
    const { teachers } = useSelector((state) => state.website);
    const { records, status } = useSelector((state) => state.staffAttendance);

    const [filters, setFilters] = useState({
        userId: 'All Active Staff',
        teacherId: '',
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear().toString()
    });

    const [individualData, setIndividualData] = useState({
        staffId: '', // Combined ID: 'user_1' or 'teacher_1'
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
        remarks: ''
    });

    const [bulkDate, setBulkDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchTeachers());
        const monthIndex = months.indexOf(filters.month) + 1;
        const monthPadded = monthIndex.toString().padStart(2, '0');
        dispatch(fetchStaffAttendance({ ...filters, month: monthPadded }));
    }, [dispatch]);

    const bulkData = React.useMemo(() => {
        const staffList = (users || []).filter(u => u.status).map(u => ({
            userId: u.id,
            fullName: u.fullName,
            department: u.department,
            designation: u.designation,
            staffType: 'Staff',
            status: 'Present',
            remarks: ''
        }));
        
        const teacherList = (teachers || []).map(t => ({
            userId: t.id,
            fullName: t.name,
            department: 'Academics',
            designation: t.designation || 'Trainer',
            staffType: 'Trainer',
            status: 'Present',
            remarks: ''
        }));

        return [...staffList, ...teacherList];
    }, [users, teachers]);

    // We still need a local state if we want to change statuses in the bulk view BEFORE submitting
    const [bulkAttendance, setBulkAttendance] = useState([]);

    useEffect(() => {
        if (view === 'bulk') {
            setBulkAttendance(bulkData);
        }
    }, [view, bulkData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        const monthIndex = months.indexOf(filters.month) + 1;
        const monthPadded = monthIndex.toString().padStart(2, '0');
        
        let filterPayload = { ...filters, month: monthPadded };
        
        if (filters.userId && filters.userId.toString().startsWith('t_')) {
            filterPayload.teacherId = filters.userId.split('_')[1];
            filterPayload.userId = null;
        } else if (filters.userId === 'All Active Staff') {
            filterPayload.userId = null;
            filterPayload.teacherId = null;
        }

        dispatch(fetchStaffAttendance(filterPayload));
    };

    const handleResetFilters = () => {
        const reset = {
            userId: 'All Active Staff',
            month: new Date().toLocaleString('default', { month: 'long' }),
            year: new Date().getFullYear().toString()
        };
        setFilters(reset);
        const monthIndex = months.indexOf(reset.month) + 1;
        const monthPadded = monthIndex.toString().padStart(2, '0');
        dispatch(fetchStaffAttendance({ ...reset, month: monthPadded }));
    };

    const handleIndividualSubmit = async (e) => {
        e.preventDefault();
        if (!individualData.staffId) {
            toast.error("Please select a staff member");
            return;
        }
        
        const [type, id] = individualData.staffId.split('_');
        const payload = {
            date: individualData.date,
            status: individualData.status,
            remarks: individualData.remarks,
            ...(type === 'user' ? { userId: id } : { teacherId: id })
        };

        try {
            await dispatch(markIndividualAttendance(payload)).unwrap();
            toast.success("Attendance marked successfully");
            setView('list');
            const monthIndex = months.indexOf(filters.month) + 1;
            const monthPadded = monthIndex.toString().padStart(2, '0');
            dispatch(fetchStaffAttendance({ ...filters, month: monthPadded }));
        } catch (err) {
            toast.error(err);
        }
    };

    const handleBulkStatusChange = (userId, status) => {
        setBulkAttendance(prev => prev.map(item => item.userId === userId ? { ...item, status } : item));
    };

    const handleBulkRemarksChange = (userId, remarks) => {
        setBulkAttendance(prev => prev.map(item => item.userId === userId ? { ...item, remarks } : item));
    };

    const handleBulkSubmit = async () => {
        if (!bulkDate) {
            toast.error("Please select a date");
            return;
        }
        try {
            await dispatch(markBulkAttendance({ date: bulkDate, attendanceData: bulkAttendance })).unwrap();
            toast.success("Bulk attendance marked successfully");
            setView('list');
            dispatch(fetchStaffAttendance(filters));
        } catch (err) {
            toast.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            await dispatch(deleteAttendanceRecord(id));
            toast.success("Record deleted");
        }
    };


    if (view === 'bulk') {
        return (
            <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-10">
                <div className="bg-[#1e463a] p-8 rounded-sm text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full flex items-center justify-center">
                            <Users size={24} strokeWidth={3} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Mark Bulk Staff Attendance</h1>
                            <p className="text-green-100 text-[11px] font-medium opacity-90 uppercase tracking-widest mt-1">Manage attendance for all staff members efficiently</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setView('list')}
                        className="bg-white hover:bg-gray-100 text-gray-800 px-6 h-9 rounded-sm flex items-center gap-2 border-none font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all"
                    >
                        <ArrowLeft size={16} />
                        Back to List
                    </Button>
                </div>

                <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-10 space-y-8">
                    <div className="flex flex-col md:flex-row items-end gap-6 pb-8 border-b border-gray-50">
                        <div className="w-full max-sm mb-4 md:mb-0 md:max-w-sm space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block ml-1">Attendance Date <span className="text-red-500">*</span></label>
                            <Input
                                type="date"
                                value={bulkDate}
                                onChange={(e) => setBulkDate(e.target.value)}
                                className="h-11 rounded-sm border-gray-200 bg-white text-sm focus:ring-1 focus:ring-[#1e463a] transition-all"
                            />
                        </div>
                        <div className="flex-1 bg-gray-600/90 text-white px-6 py-4 rounded-sm flex items-center gap-3 text-xs shadow-md">
                            <Info size={18} className="text-green-300" />
                            <p className="leading-relaxed"><span className="font-extrabold uppercase tracking-widest mr-2">Note:</span> Mark attendance for all active staff members for the selected date.</p>
                        </div>
                    </div>

                    <div className="border border-gray-100 rounded-sm overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-[#f8fafc]">
                                <TableRow className="hover:bg-[#f8fafc] border-b border-gray-200">
                                    <TableHead className="w-[60px] font-bold text-gray-700 text-[11px] uppercase py-5 px-6 border-r border-gray-100 text-center">#</TableHead>
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 border-r border-gray-100">Staff Name</TableHead>
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 border-r border-gray-100">Department</TableHead>
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 border-r border-gray-100 text-center">Status <span className="text-red-500">*</span></TableHead>
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 text-center">Remarks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bulkAttendance.length > 0 ? (
                                    bulkAttendance.map((staff, idx) => (
                                        <TableRow key={staff.userId} className="border-b border-gray-50 uppercase text-[11px] font-medium">
                                            <TableCell className="text-center border-r border-gray-50">{idx + 1}</TableCell>
                                            <TableCell className="border-r border-gray-50 font-bold text-blue-900">
                                                {staff.fullName}
                                                <span className={`ml-2 text-[8px] px-1 rounded-sm ${staff.staffType === 'Trainer' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                                    {staff.staffType}
                                                </span>
                                            </TableCell>
                                            <TableCell className="border-r border-gray-50">{staff.department}</TableCell>
                                            <TableCell className="border-r border-gray-50">
                                                <select 
                                                    value={staff.status} 
                                                    onChange={(e) => handleBulkStatusChange(staff.userId, e.target.value)}
                                                    className={`w-full h-8 rounded-sm border px-2 text-[10px] outline-none transition-all cursor-pointer font-bold ${
                                                        staff.status === 'Present' ? 'border-green-200 text-green-600 bg-green-50' : 
                                                        staff.status === 'Absent' ? 'border-red-200 text-red-600 bg-red-50' : 
                                                        'border-orange-200 text-orange-600 bg-orange-50'
                                                    }`}
                                                >
                                                    <option>Present</option>
                                                    <option>Absent</option>
                                                    <option>Late</option>
                                                    <option>Half Day</option>
                                                </select>
                                            </TableCell>
                                            <TableCell>
                                                <Input 
                                                    placeholder="Remarks..." 
                                                    value={staff.remarks}
                                                    onChange={(e) => handleBulkRemarksChange(staff.userId, e.target.value)}
                                                    className="h-8 text-[10px] rounded-sm border-gray-100 italic"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-20 text-center">
                                            <Loader2 size={32} className="animate-spin text-gray-200 mx-auto mb-4" />
                                            <p className="text-gray-400 font-bold uppercase text-[10px]">Loading staff members...</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6">
                        <Button
                            onClick={handleBulkSubmit}
                            className="bg-[#1e463a] hover:bg-[#153229] text-white px-10 h-10 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none transition-all shadow-md active:scale-95"
                        >
                            Save Bulk Attendance
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'mark') {
        return (
            <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-10">
                <div className="bg-[#0f172a] p-8 rounded-sm text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full flex items-center justify-center">
                            <Plus size={24} strokeWidth={3} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Mark Individual Staff Attendance</h1>
                            <p className="text-gray-400 text-[11px] font-medium opacity-90 uppercase tracking-widest mt-1">Record daily attendance for a specific staff member</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setView('list')}
                        className="bg-white hover:bg-gray-100 text-gray-800 px-6 h-9 rounded-sm flex items-center gap-2 border-none font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all"
                    >
                        <ArrowLeft size={16} />
                        Back to List
                    </Button>
                </div>

                <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-10 font-sans">
                    <form onSubmit={handleIndividualSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            <div className="space-y-2 focus-within:text-[#1e3a8a] transition-colors">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block ml-1">Attendance Date <span className="text-red-500">*</span></label>
                                <Input
                                    type="date"
                                    value={individualData.date}
                                    onChange={(e) => setIndividualData({...individualData, date: e.target.value})}
                                    className="h-11 rounded-sm border-gray-200 bg-white text-sm focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2 focus-within:text-[#1e3a8a] transition-colors">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block ml-1">Select Staff Member <span className="text-red-500">*</span></label>
                                <select 
                                    className="w-full h-11 rounded-sm border border-gray-200 px-4 text-sm focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-700 font-sans transition-all cursor-pointer"
                                    value={individualData.staffId}
                                    onChange={(e) => setIndividualData({...individualData, staffId: e.target.value})}
                                    required
                                >
                                    <option value="">Select Member</option>
                                    <optgroup label="Staff">
                                        {users.filter(u => u.status).map(u => (
                                            <option key={`user_${u.id}`} value={`user_${u.id}`}>{u.fullName} ({u.employeeId})</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Trainers">
                                        {teachers.map(t => (
                                            <option key={`teacher_${t.id}`} value={`teacher_${t.id}`}>{t.name} (Trainer)</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div className="space-y-2 focus-within:text-[#1e3a8a] transition-colors">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block ml-1">Attendance Status <span className="text-red-500">*</span></label>
                                <select 
                                    className="w-full h-11 rounded-sm border border-gray-200 px-4 text-sm focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-700 font-sans transition-all cursor-pointer"
                                    value={individualData.status}
                                    onChange={(e) => setIndividualData({...individualData, status: e.target.value})}
                                    required
                                >
                                    <option>Present</option>
                                    <option>Absent</option>
                                    <option>Late</option>
                                    <option>Half Day</option>
                                </select>
                            </div>

                            <div className="space-y-2 focus-within:text-[#1e3a8a] transition-colors">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block ml-1">Remarks</label>
                                <Input
                                    placeholder="Any additional notes or reason"
                                    value={individualData.remarks}
                                    onChange={(e) => setIndividualData({...individualData, remarks: e.target.value})}
                                    className="h-11 rounded-sm border-gray-200 bg-white text-sm focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-8 border-t border-gray-50 font-sans">
                            <Button
                                type="submit"
                                className="bg-[#1e3a8a] hover:bg-[#152e6e] text-white px-10 h-10 rounded-sm text-[11px] font-bold flex items-center gap-2 shadow-md border-none uppercase tracking-widest transition-all active:scale-95"
                            >
                                <Plus size={16} strokeWidth={3} />
                                Mark Attendance
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setView('list')}
                                className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-10 h-10 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none transition-all shadow-md active:scale-95 flex items-center justify-center p-0"
                            >
                                <X size={16} className="mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight uppercase">Staff Attendance Records</h1>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setView('mark')}
                        className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 h-11 rounded-sm flex items-center gap-2 border-none transition-all active:scale-95 shadow-md uppercase text-xs font-bold tracking-widest"
                    >
                        <Plus size={18} />
                        Mark Attendance
                    </Button>
                    <Button
                        onClick={() => setView('bulk')}
                        className="bg-[#1e463a] hover:bg-[#153229] text-white px-6 h-11 rounded-sm flex items-center gap-2 border-none transition-all active:scale-95 shadow-md uppercase text-xs font-bold tracking-widest"
                    >
                        <Users size={18} />
                        Mark Bulk Attendance
                    </Button>
                </div>
            </div>

            <div className="bg-[#f8fafc] p-8 rounded-sm shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8 text-[#1e3a8a] font-bold border-b border-gray-100 pb-4 uppercase tracking-[0.1em] text-sm">
                    <Filter size={18} />
                    <span>Attendance Filters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    <div className="md:col-span-3 space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Staff Member</label>
                        <select 
                            name="userId"
                            value={filters.userId}
                            onChange={handleFilterChange}
                            className="w-full h-11 rounded-sm border border-gray-200 px-4 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white transition-all cursor-pointer"
                        >
                            <option value="All Active Staff">All Active Staff</option>
                            <optgroup label="Staff">
                                {users.map(u => (
                                    <option key={`u_${u.id}`} value={u.id}>{u.fullName}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Trainers">
                                {teachers.map(t => (
                                    <option key={`t_${t.id}`} value={`t_${t.id}`}>[Trainer] {t.name}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>
                    <div className="md:col-span-3 space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Month</label>
                        <select 
                            name="month"
                            value={filters.month}
                            onChange={handleFilterChange}
                            className="w-full h-11 rounded-sm border border-gray-200 px-4 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white transition-all cursor-pointer uppercase"
                        >
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Year</label>
                        <select 
                            name="year"
                            value={filters.year}
                            onChange={handleFilterChange}
                            className="w-full h-11 rounded-sm border border-gray-200 px-4 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white transition-all cursor-pointer"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <Button onClick={handleApplyFilters} className="w-full bg-[#1e3a8a] hover:bg-[#1a365d] text-white h-11 rounded-sm font-bold transition-all active:scale-95 shadow-md uppercase text-xs tracking-widest border-none p-0 flex items-center justify-center gap-2">
                            <Search size={16} />
                            Filter
                        </Button>
                    </div>
                    <div className="md:col-span-2">
                        <Button onClick={handleResetFilters} variant="outline" className="w-full border-orange-100 text-[#b9875a] hover:bg-orange-50 bg-orange-50/10 h-11 rounded-sm flex items-center gap-2 transition-all active:scale-95 font-bold uppercase text-xs tracking-widest p-0 justify-center">
                            <RotateCcw size={16} />
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#0f172a] p-5 flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs">
                    <div className="bg-white/10 p-2 rounded-lg">
                        <Calendar size={18} />
                    </div>
                    <span>Attendance Log Records</span>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-200">
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 px-6 tracking-wider border-r border-gray-100 text-center w-16">#</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 px-6 tracking-wider border-r border-gray-100">Staff Name</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 px-6 tracking-wider border-r border-gray-100 text-center">Attendance Date</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 px-6 tracking-wider border-r border-gray-100 text-center">Status</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 px-6 tracking-wider border-r border-gray-100">Remarks</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 px-6 tracking-wider border-r border-gray-100 text-center">Marked By</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 px-6 tracking-wider border-r border-gray-100 text-center">Locked</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 text-center tracking-wider">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {status === 'loading' ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-40 text-center">
                                        <Loader2 size={32} className="animate-spin text-blue-900 mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : records.length > 0 ? (
                                records.map((record, index) => (
                                    <TableRow key={record.id} className="hover:bg-gray-50/50 uppercase text-[10px] font-bold">
                                        <TableCell className="text-center font-bold text-gray-400 border-r border-gray-50">{index + 1}</TableCell>
                                        <TableCell className="border-r border-gray-50 text-blue-900">
                                            {record.staffName}
                                            <span className="text-[9px] text-gray-400 ml-2 font-medium opacity-70">[{record.staffType}]</span>
                                        </TableCell>
                                        <TableCell className="text-center border-r border-gray-50 text-gray-500">{record.date}</TableCell>
                                        <TableCell className="text-center border-r border-gray-50">
                                            <span className={`px-3 py-1 rounded-full text-[9px] ${
                                                record.status === 'Present' ? 'bg-green-100 text-green-700' : 
                                                record.status === 'Absent' ? 'bg-red-100 text-red-700' : 
                                                'bg-orange-100 text-orange-700'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="border-r border-gray-50 text-gray-400 italic font-medium lowercase first-letter:uppercase">{record.remarks || '---'}</TableCell>
                                        <TableCell className="text-center border-r border-gray-50 text-gray-400">ADMIN</TableCell>
                                        <TableCell className="text-center border-r border-gray-50">
                                            <div className="flex justify-center">
                                                <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                                                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                onClick={() => handleDelete(record.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-40 text-center">
                                        <div className="flex flex-col items-center justify-center gap-6">
                                            <div className="bg-gray-50 p-6 rounded-3xl">
                                                <Calendar size={64} className="text-gray-200" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No attendance records found</p>
                                                <p className="text-[11px] text-gray-300 font-medium italic">Attendance logs for the selected period will appear here.</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="p-5 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Total records in view: {records.length}</p>
                </div>
            </div>
        </div>
    );
}
