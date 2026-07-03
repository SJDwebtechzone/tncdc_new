import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RotateCcw, ArrowLeft, DollarSign, Calculator, Search, Trash2, CheckCircle2, Loader2, Info, Lock, CalendarDays, ChevronRight, Download } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '@/store/userSlice';
import { fetchTeachers } from '@/store/websiteSlice';
import { fetchStaffSalaries, calculateSalaryPreview, saveStaffSalary, deleteStaffSalary, resetPreview } from '@/store/staffSalarySlice';
import { toast } from 'react-hot-toast';
import { generatePayslip } from '@/utils/payslipGenerator';

export default function StaffSalaryPage() {
    const dispatch = useDispatch();
    const [view, setView] = useState('list'); // 'list', 'add', 'details'
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const { users } = useSelector((state) => state.users);
    const { teachers } = useSelector((state) => state.website);
    const { records, preview, status, error } = useSelector((state) => state.staffSalary);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = months[new Date().getMonth()];

    const [filters, setFilters] = useState({
        month: currentMonth,
        year: currentYear
    });

    const [formData, setFormData] = useState({
        staffId: '', // user_ID or teacher_ID
        month: currentMonth,
        year: currentYear,
        status: 'Paid'
    });

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchTeachers());
        dispatch(fetchStaffSalaries(filters));
    }, [dispatch]);

    // Handle preview calculation when staff/month/year changes
    useEffect(() => {
        if (view === 'add' && formData.staffId && formData.month && formData.year) {
            const [type, id] = formData.staffId.split('_');
            const params = {
                month: formData.month,
                year: formData.year,
                ...(type === 'user' ? { userId: id } : { teacherId: id })
            };
            dispatch(calculateSalaryPreview(params));
        } else {
            dispatch(resetPreview());
        }
    }, [view, formData.staffId, formData.month, formData.year]);

    const handleGenerateSalary = async (e) => {
        e.preventDefault();
        if (!preview) {
            toast.error("Please ensure staff and period are selected");
            return;
        }

        const [type, id] = formData.staffId.split('_');
        const payload = {
            userId: type === 'user' ? id : null,
            teacherId: type === 'teacher' ? id : null,
            month: formData.month,
            year: formData.year,
            basicSalary: preview.basicSalary,
            grossSalary: preview.grossSalary,
            deductions: preview.deductions,
            netSalary: preview.netSalary,
            totalDays: preview.daysInMonth,
            presentCount: preview.presentCount,
            absentCount: preview.absentCount,
            halfDayCount: preview.halfDayCount,
            lateCount: preview.lateCount,
            calculatedDays: preview.calculatedDays,
            status: formData.status
        };

        try {
            await dispatch(saveStaffSalary(payload)).unwrap();
            toast.success("Salary record generated successfully");
            setView('list');
            dispatch(fetchStaffSalaries(filters));
        } catch (err) {
            toast.error(err);
        }
    };

    const handleDeleteSalary = async (id) => {
        if (!window.confirm("Are you sure you want to delete this salary record?")) return;
        try {
            await dispatch(deleteStaffSalary(id)).unwrap();
            toast.success("Salary record deleted successfully");
        } catch (err) {
            toast.error(err);
        }
    };

    const handleLockAndGenerate = async () => {
        if (!selectedRecord) {
            toast.error("No record selected");
            return;
        }
        try {
            await generatePayslip(selectedRecord);
            setIsLocked(true);
            toast.success("Payslip generated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate payslip");
        }
    };

    if (view === 'add') {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                            <Calculator className="text-blue-600" size={24} />
                            Payroll Generation
                        </h1>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Attendance-based salary calculation</p>
                    </div>
                    <Button
                        onClick={() => {
                            setView('list');
                            dispatch(resetPreview());
                        }}
                        variant="outline"
                        className="bg-white border-gray-200 text-gray-700 px-6 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-all font-bold text-xs uppercase"
                    >
                        <ArrowLeft size={16} />
                        Back to Records
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <form onSubmit={handleGenerateSalary} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Select Staff / Trainer <span className="text-red-500">*</span></label>
                                        <select 
                                            className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50/50 text-gray-700 font-medium transition-all"
                                            value={formData.staffId}
                                            onChange={(e) => setFormData({...formData, staffId: e.target.value})}
                                            required
                                        >
                                            <option value="">Choose Staff...</option>
                                            <optgroup label="Staff">
                                                {users?.map(u => (
                                                    <option key={`u_${u.id}`} value={`user_${u.id}`}>{u.fullName} ({u.employeeId})</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Trainers">
                                                {teachers?.map(t => (
                                                    <option key={`t_${t.id}`} value={`teacher_${t.id}`}>{t.name} (Trainer)</option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Month <span className="text-red-500">*</span></label>
                                            <select 
                                                className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50/50 text-gray-700 font-medium transition-all"
                                                value={formData.month}
                                                onChange={(e) => setFormData({...formData, month: e.target.value})}
                                            >
                                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Year <span className="text-red-500">*</span></label>
                                            <select 
                                                className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50/50 text-gray-700 font-medium transition-all"
                                                value={formData.year}
                                                onChange={(e) => setFormData({...formData, year: e.target.value})}
                                            >
                                                <option>2026</option>
                                                <option>2025</option>
                                            </select>
                                        </div>
                                    </div>

                                    {preview && (
                                        <>
                                            {preview.grossSalary === 0 && (
                                                <div className="md:col-span-2 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-700 text-xs font-bold uppercase tracking-wide">
                                                    <Info size={16} />
                                                    Basic salary is not set for this staff member. Please update it in Staff Management.
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Gross Salary (₹)</label>
                                                <div className="h-12 rounded-xl border border-gray-200 px-4 flex items-center bg-gray-50/50 text-sm font-bold text-gray-700">
                                                    ₹ {preview.grossSalary.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Deductions (₹)</label>
                                                <div className="h-12 rounded-xl border border-gray-200 px-4 flex items-center bg-red-50/50 text-sm font-bold text-red-600 border-red-100">
                                                    - ₹ {preview.deductions.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1 text-blue-600">Net Payable Amount (₹)</label>
                                                <div className="h-14 rounded-xl border-2 border-blue-500 px-6 flex items-center justify-between bg-blue-50/30 text-lg font-black text-blue-700">
                                                    <span>Payable Salary</span>
                                                    <span>₹ {preview.netSalary.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 pt-6">
                                    <Button type="submit" disabled={!preview} className="bg-[#0f172a] hover:bg-black text-white px-10 h-12 rounded-xl transition-all font-bold uppercase text-[10px] tracking-widest shadow-lg disabled:opacity-50">
                                        <DollarSign size={16} className="mr-2" />
                                        Confirm & Process Payment
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-6 text-white shadow-xl">
                            <h3 className="font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2 opacity-80">
                                <Info size={16} />
                                Attendance Audit
                            </h3>
                            {preview ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                                        <span className="text-xs font-semibold opacity-70">Total Days</span>
                                        <span className="font-bold">{preview.daysInMonth}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20 text-center">
                                            <p className="text-[10px] uppercase font-bold text-green-400 mb-1">Present</p>
                                            <p className="text-xl font-black">{preview.presentCount}</p>
                                        </div>
                                        <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center">
                                            <p className="text-[10px] uppercase font-bold text-red-400 mb-1">Absent</p>
                                            <p className="text-xl font-black">{preview.absentCount}</p>
                                        </div>
                                        <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20 text-center">
                                            <p className="text-[10px] uppercase font-bold text-yellow-400 mb-1">Half Days</p>
                                            <p className="text-xl font-black">{preview.halfDayCount}</p>
                                        </div>
                                        <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-center">
                                            <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">Late</p>
                                            <p className="text-xl font-black">{preview.lateCount}</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/10">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="opacity-70">Calculated Work Days</span>
                                            <span className="font-bold text-blue-400">{preview.calculatedDays} Days</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center space-y-4">
                                    <Calculator size={40} className="mx-auto opacity-20" />
                                    <p className="text-xs opacity-40 font-bold uppercase tracking-widest text-wrap">Select staff to see attendance analysis</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'details' && selectedRecord) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                             Salary Details - {selectedRecord.month} {selectedRecord.year}
                        </h1>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest ml-1">Official Payroll Statement</p>
                    </div>
                    <Button
                        onClick={() => {
                            setView('list');
                            setSelectedRecord(null);
                        }}
                        variant="outline"
                        className="bg-white border-gray-200 text-gray-700 px-6 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:bg-orange-50/50 hover:text-orange-700 transition-all font-bold text-xs uppercase"
                    >
                        <ArrowLeft size={16} />
                        Back to List
                    </Button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 space-y-10">
                        {/* Staff Info Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Staff Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee Name</label>
                                    <p className="text-sm font-black text-gray-800">{selectedRecord.staffName}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Staff Type</label>
                                    <p className="text-sm font-black text-blue-600 italic">{selectedRecord.staffType}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pay Period</label>
                                    <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">{selectedRecord.month} {selectedRecord.year}</p>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Summary Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Attendance Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 scale-[0.98] origin-left">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-gray-50/50 border border-gray-100 p-3 rounded-xl">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">Total Working Days</span>
                                        <span className="text-sm font-black text-gray-800">{selectedRecord.totalDays}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-emerald-50/30 border border-emerald-100 p-3 rounded-xl">
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-tight">Present Days</span>
                                        <span className="text-sm font-black text-emerald-700">{selectedRecord.presentCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-rose-50/30 border border-rose-100 p-3 rounded-xl">
                                        <span className="text-xs font-bold text-rose-600 uppercase tracking-tight">Absent Days</span>
                                        <span className="text-sm font-black text-rose-700">{selectedRecord.absentCount}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-amber-50/30 border border-amber-100 p-3 rounded-xl">
                                        <span className="text-xs font-bold text-amber-600 uppercase tracking-tight">Half Days</span>
                                        <span className="text-sm font-black text-amber-700">{selectedRecord.halfDayCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-blue-50/30 border border-blue-100 p-3 rounded-xl">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-tight">Late Comings</span>
                                        <span className="text-sm font-black text-blue-700">{selectedRecord.lateCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#0f172a]/5 border border-[#0f172a]/10 p-3 rounded-xl shadow-inner">
                                        <span className="text-xs font-bold text-[#0f172a] uppercase tracking-tight">Calculated Work Days</span>
                                        <span className="text-sm font-black text-[#0f172a]">{selectedRecord.calculatedDays}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Salary Breakdown Table */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Salary Breakdown</h3>
                            <div className="w-full max-w-2xl ml-auto border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                <Table>
                                    <TableBody>
                                        <TableRow className="hover:bg-transparent border-b border-gray-100">
                                            <TableCell className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-6">Gross Salary</TableCell>
                                            <TableCell className="text-right text-sm font-black text-gray-800 pr-8">₹ {selectedRecord.grossSalary?.toLocaleString()}</TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent border-b border-gray-100 bg-rose-50/10">
                                            <TableCell className="text-xs font-bold text-rose-500 uppercase tracking-widest pl-6">Deductions</TableCell>
                                            <TableCell className="text-right text-sm font-bold text-rose-600 pr-8">- ₹ {selectedRecord.deductions?.toLocaleString()}</TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent bg-blue-50/10">
                                            <TableCell className="text-xs font-black text-blue-600 uppercase tracking-widest pl-6 underline underline-offset-4 decoration-2">Net Salary</TableCell>
                                            <TableCell className="text-right text-[1.4rem] font-[900] text-blue-800 pr-8 tracking-tighter">₹ {selectedRecord.netSalary?.toLocaleString()}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Generation Information */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Generation Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                        <div className="h-8 w-8 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center text-[10px] font-black">SA</div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-gray-400 uppercase block tracking-widest">Generated By</label>
                                        <p className="text-xs font-black text-gray-700 uppercase italic">Super Admin</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                        <CalendarDays size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-gray-400 uppercase block tracking-widest">Generated On</label>
                                        <p className="text-xs font-black text-gray-600 tabular-nums">
                                            {new Date(selectedRecord.createdAt).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Block */}
                    <div className="p-8 bg-gray-50/50 border-t border-gray-100 space-y-4">
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-700 text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <Info size={16} />
                            Note: Locking this salary will prevent any further changes and generate the final payslip.
                        </div>
                        <div className="flex gap-4">
                            {!isLocked ? (
                                <Button 
                                    onClick={handleLockAndGenerate}
                                    className="bg-[#0f172a] hover:bg-black text-white px-10 h-14 rounded-xl transition-all font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200"
                                >
                                    <Lock size={18} className="mr-2" />
                                    Lock Salary & Generate Payslip
                                </Button>
                            ) : (
                                <Button 
                                    onClick={() => generatePayslip(selectedRecord)}
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white px-10 h-14 rounded-xl transition-all font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-200"
                                >
                                    <CheckCircle2 size={18} className="mr-2" />
                                    Download Payslip Again
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Payroll Management</h1>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Listing generated salary records</p>
                </div>
                <Button
                    onClick={() => setView('add')}
                    className="bg-[#0f172a] hover:bg-black text-white px-8 py-2.5 rounded-xl flex items-center gap-2 border-none shadow-lg transition-all active:scale-95 font-bold text-xs uppercase tracking-widest"
                >
                    <Plus size={18} />
                    Generate Salary
                </Button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="w-[200px] space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Month</label>
                        <select 
                            value={filters.month}
                            onChange={(e) => setFilters({...filters, month: e.target.value})}
                            className="w-full h-11 rounded-xl border border-gray-200 px-4 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50/50 font-bold text-gray-600 transition-all cursor-pointer"
                        >
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="w-[120px] space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Year</label>
                        <select 
                            value={filters.year}
                            onChange={(e) => setFilters({...filters, year: e.target.value})}
                            className="w-full h-11 rounded-xl border border-gray-200 px-4 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-gray-50/50 font-bold text-gray-600 transition-all cursor-pointer"
                        >
                            <option>2026</option>
                            <option>2025</option>
                        </select>
                    </div>
                    <Button 
                        onClick={() => dispatch(fetchStaffSalaries(filters))}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-blue-100"
                    >
                        <Search size={16} className="mr-2" />
                        Apply Filter
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            const reset = { month: currentMonth, year: currentYear };
                            setFilters(reset);
                            dispatch(fetchStaffSalaries(reset));
                        }}
                        className="text-gray-500 border-gray-200 hover:bg-gray-50 h-11 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                    >
                        <RotateCcw size={16} />
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
                                <TableHead className="font-bold text-gray-400 text-[10px] uppercase py-5 px-6 border-r border-gray-50 w-[60px] text-center">#</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[10px] uppercase py-5 px-4 border-r border-gray-50">Staff / Trainer Name</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[10px] uppercase py-5 px-4 border-r border-gray-50 text-center">Period</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[10px] uppercase py-5 px-4 border-r border-gray-50 text-right">Gross (₹)</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[10px] uppercase py-5 px-4 border-r border-gray-50 text-right">Deductions</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[10px] uppercase py-5 px-4 border-r border-gray-50 text-right">Net Salary</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[10px] uppercase py-5 px-4 border-r border-gray-50 text-center">Status</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[10px] uppercase py-5 px-4 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {status === 'loading' ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-20 text-center">
                                        <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
                                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Fetching payroll data...</p>
                                    </TableCell>
                                </TableRow>
                            ) : status === 'failed' ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-20 text-center">
                                        <Info size={32} className="text-red-500 mx-auto mb-4" />
                                        <p className="text-red-400 font-bold uppercase text-[10px] tracking-widest">Error loading payroll data</p>
                                    </TableCell>
                                </TableRow>
                            ) : records?.length > 0 ? (
                                records.map((record, index) => (
                                    <TableRow key={record.id} className="hover:bg-blue-50/30 transition-colors uppercase text-[10px] font-bold">
                                        <TableCell className="text-center font-bold text-gray-400 border-r border-gray-50">{index + 1}</TableCell>
                                        <TableCell className="border-r border-gray-50 text-blue-900">
                                            {record.staffName}
                                            <span className={`ml-2 text-[8px] px-1 rounded-sm ${record.staffType === 'Trainer' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                                {record.staffType}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center border-r border-gray-50 text-gray-500">{record.month} {record.year}</TableCell>
                                        <TableCell className="text-right border-r border-gray-50 font-bold text-gray-700">₹ {record.grossSalary.toLocaleString()}</TableCell>
                                        <TableCell className="text-right border-r border-gray-50 text-red-500">- ₹ {record.deductions.toLocaleString()}</TableCell>
                                        <TableCell className="text-right border-r border-gray-50 text-blue-700 font-black">₹ {record.netSalary.toLocaleString()}</TableCell>
                                        <TableCell className="text-center border-r border-gray-50">
                                            <span className={`px-3 py-1 rounded-full text-[9px] ${record.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {record.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    onClick={() => {
                                                        setSelectedRecord(record);
                                                        setView('details');
                                                    }}
                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Calculator size={14} />
                                                </Button>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    onClick={() => handleDeleteSalary(record.id)}
                                                    className="h-8 w-8 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                        <DollarSign size={40} className="mx-auto mb-4 opacity-10" />
                                        No payroll records found for this period
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
