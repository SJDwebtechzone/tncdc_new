import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ChartBar,
    Download,
    Filter,
    RotateCcw,
    Search,
    Calendar,
    X,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchBatches } from '@/store/batchSlice';
import { fetchAdmissions } from '@/store/admissionSlice';
import { fetchStudentAttendanceReport } from '@/store/attendanceSlice';
import { cn } from '@/lib/utils';

export default function AttendanceReportPage() {
    const dispatch = useDispatch();
    const { batches } = useSelector((state) => state.batches);
    const { admissions } = useSelector((state) => state.admissions);
    const { studentAttendanceReport, loading } = useSelector((state) => state.attendance);

    const [filters, setFilters] = useState({
        batch: '',
        admissionId: '',
        status: '',
        fromDate: '',
        toDate: ''
    });

    useEffect(() => {
        dispatch(fetchBatches());
        dispatch(fetchAdmissions());
        // Load some initial report today?
        dispatch(fetchStudentAttendanceReport({}));
    }, [dispatch]);

    const handleApplyFilters = () => {
        dispatch(fetchStudentAttendanceReport(filters));
    };

    const handleReset = () => {
        const resetFilters = {
            batch: '',
            admissionId: '',
            status: '',
            fromDate: '',
            toDate: ''
        };
        setFilters(resetFilters);
        dispatch(fetchStudentAttendanceReport(resetFilters));
    };

    const exportToCSV = () => {
        if (studentAttendanceReport.length === 0) return;
        
        const headers = ["Date", "Student ID", "Student Name", "Course", "Batch", "Punch In", "Punch Out", "Status"];
        const rows = studentAttendanceReport.map(r => [
            r.date,
            r.admission?.studentId,
            `${r.admission?.firstName} ${r.admission?.surname}`,
            r.admission?.courseName,
            r.batch,
            r.punchIn,
            r.punchOut,
            r.status
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 font-sans tracking-tight uppercase">Attendance Report</h1>

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden font-sans">
                {/* Card Header */}
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f8fafc]">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#1e3a8a] p-3 rounded-md text-white shadow-md">
                            <ChartBar size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">Attendance Records</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Filter and analyze student presence</p>
                        </div>
                    </div>
                    <Button 
                        onClick={exportToCSV}
                        disabled={studentAttendanceReport.length === 0}
                        className="bg-[#0f4c3a] hover:bg-[#0a3a2c] text-white px-8 h-11 rounded-sm flex items-center gap-2 border-none font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-md disabled:opacity-50"
                    >
                        <Download size={16} strokeWidth={3} />
                        Export Data
                    </Button>
                </div>

                {/* Filters Content */}
                <div className="p-8 space-y-8 bg-white/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Batch</label>
                            <select 
                                className="w-full h-11 rounded-sm border border-gray-200 px-4 text-xs font-bold focus:ring-1 focus:ring-blue-600 outline-none bg-white transition-all shadow-sm"
                                value={filters.batch}
                                onChange={(e) => setFilters({...filters, batch: e.target.value})}
                            >
                                <option value="">All Batches</option>
                                {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Student</label>
                            <select 
                                className="w-full h-11 rounded-sm border border-gray-200 px-4 text-xs font-bold focus:ring-1 focus:ring-blue-600 outline-none bg-white transition-all shadow-sm"
                                value={filters.admissionId}
                                onChange={(e) => setFilters({...filters, admissionId: e.target.value})}
                            >
                                <option value="">All Students</option>
                                {admissions.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.surname}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Status</label>
                            <select 
                                className="w-full h-11 rounded-sm border border-gray-200 px-4 text-xs font-bold focus:ring-1 focus:ring-blue-600 outline-none bg-white transition-all shadow-sm"
                                value={filters.status}
                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                            >
                                <option value="">All Status</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Leave">Leave</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">From Date</label>
                            <Input 
                                type="date" 
                                className="h-11 rounded-sm border-gray-200 bg-white font-bold text-xs px-4 shadow-sm" 
                                value={filters.fromDate}
                                onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">To Date</label>
                            <Input 
                                type="date" 
                                className="h-11 rounded-sm border-gray-200 bg-white font-bold text-xs px-4 shadow-sm" 
                                value={filters.toDate}
                                onChange={(e) => setFilters({...filters, toDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button 
                            onClick={handleApplyFilters}
                            disabled={loading}
                            className="bg-[#1e3a8a] hover:bg-[#1a365d] text-white px-10 h-11 rounded-sm flex items-center gap-2 shadow-lg font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Filter size={16} strokeWidth={3} />}
                            Apply Filters
                        </Button>
                        <Button 
                            onClick={handleReset}
                            variant="outline" 
                            className="text-orange-600 border-orange-200 hover:bg-orange-50 bg-orange-50/10 px-8 h-11 rounded-sm flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"
                        >
                            <RotateCcw size={16} strokeWidth={3} />
                            Reset
                        </Button>
                    </div>

                    {/* Table Area */}
                    <div className="mt-12 border border-gray-100 rounded-sm overflow-hidden bg-white shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#1e293b] hover:bg-[#1e293b] border-none">
                                    <TableHead className="font-black text-white text-[10px] uppercase py-5 px-6">Date</TableHead>
                                    <TableHead className="font-black text-white text-[10px] uppercase py-5">Student Details</TableHead>
                                    <TableHead className="font-black text-white text-[10px] uppercase py-5">Course / Batch</TableHead>
                                    <TableHead className="font-black text-white text-[10px] uppercase py-5">Punch In/Out</TableHead>
                                    <TableHead className="font-black text-white text-[10px] uppercase py-5 text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentAttendanceReport.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 opacity-30">
                                                <Calendar size={64} />
                                                <div className="space-y-1">
                                                    <h3 className="text-sm font-black uppercase tracking-widest">No Attendance Data</h3>
                                                    <p className="text-[10px] max-w-sm italic">Records will appear here after filtering.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    studentAttendanceReport.map((record) => (
                                        <TableRow key={record.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <TableCell className="px-6 py-6 font-bold text-gray-600 text-xs text-nowrap">
                                                {new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-gray-800 text-sm tracking-tight">{record.admission?.firstName} {record.admission?.surname}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{record.admission?.studentId}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-tight truncate max-w-[150px]">{record.admission?.courseName}</p>
                                                    <p className="text-[10px] text-blue-500 font-bold uppercase">{record.batch || 'General'}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded-sm border border-green-100">{record.punchIn || '--:--'}</span>
                                                    <span className="text-gray-300">→</span>
                                                    <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-sm border border-orange-100">{record.punchOut || '--:--'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 text-center">
                                                <span className={cn(
                                                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-solid inline-flex items-center gap-2",
                                                    record.status === 'Present' ? "bg-green-50 text-green-700 border-green-100" :
                                                    record.status === 'Absent' ? "bg-red-50 text-red-700 border-red-100" :
                                                    "bg-yellow-50 text-yellow-700 border-yellow-100"
                                                )}>
                                                    {record.status === 'Present' ? <CheckCircle2 size={12} /> : 
                                                     record.status === 'Absent' ? <XCircle size={12} /> : 
                                                     <AlertCircle size={12} />}
                                                    {record.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
