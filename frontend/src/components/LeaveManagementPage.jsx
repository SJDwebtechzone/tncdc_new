import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Plus,
    CalendarX,
    Search,
    X,
    Save,
    Clock,
    Trash2,
    Calendar,
    Loader2
} from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeaves, createLeave, removeLeave } from '@/store/attendanceSlice';
import { fetchAdmissions } from '@/store/admissionSlice';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function LeaveManagementPage() {
    const { leaves, loading } = useSelector((state) => state.attendance);
    const admissions = useSelector((state) => state.admissions?.admissions || []);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchLeaves());
        dispatch(fetchAdmissions());
    }, [dispatch]);

    const [formData, setFormData] = useState({
        studentName: '',
        studentEmail: '',
        startDate: '',
        endDate: '',
        reason: '',
        type: 'Sick Leave'
    });

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await dispatch(createLeave(formData)).unwrap();
            toast.success('Leave application submitted successfully');
            setIsModalOpen(false);
            setFormData({ studentName: '', studentEmail: '', startDate: '', endDate: '', reason: '', type: 'Sick Leave' });
        } catch (err) {
            toast.error(err.message || 'Failed to submit leave');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this leave record?')) {
            try {
                await dispatch(removeLeave(id)).unwrap();
                toast.success('Leave record deleted');
            } catch (err) {
                toast.error('Failed to delete leave');
            }
        }
    };

    const handleStudentChange = (e) => {
        const studentId = e.target.value;
        const selectedStudent = admissions.find(s => s.id.toString() === studentId);
        if (selectedStudent) {
            setFormData({
                ...formData,
                studentName: `${selectedStudent.firstName} ${selectedStudent.surname}`,
                studentEmail: selectedStudent.email
            });
        } else {
            setFormData({
                ...formData,
                studentName: '',
                studentEmail: ''
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Banner - Dark Theme matching image */}
            <div className="bg-[#1e293b] p-8 rounded-sm text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-md">
                        <CalendarX size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Leave Management</h2>
                        <p className="text-gray-400 text-sm mt-0.5">View and manage leave requests</p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#1e3a8a] hover:bg-[#1a365d] text-white px-8 h-12 rounded-sm flex items-center gap-2 border-none transition-all active:scale-95 shadow-lg uppercase text-[11px] font-black tracking-widest"
                >
                    <Plus size={20} strokeWidth={3} />
                    Add Leave
                </Button>
            </div>

            {/* Add Leave Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4">
                    <div className="bg-white w-full max-w-md rounded-sm shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        {/* Modal Header - Dark */}
                        <div className="bg-[#1e293b] flex items-center justify-between p-4 px-6 text-white text-xs font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2">
                                <Plus size={16} strokeWidth={3} /> Add New Leave
                            </span>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-8 space-y-6 font-sans">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                                    Select Student <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    className="w-full h-12 rounded-sm border border-gray-200 px-4 text-xs font-bold focus:ring-1 focus:ring-blue-600 outline-none bg-white text-gray-600 appearance-none cursor-pointer"
                                    onChange={handleStudentChange}
                                >
                                    <option value="">Choose a student...</option>
                                    {admissions.map((student) => (
                                        <option key={student.id} value={student.id}>
                                            {student.firstName} {student.surname}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">From Date</label>
                                    <Input
                                        type="date"
                                        required
                                        className="h-12 rounded-sm border-gray-200 font-bold focus:ring-1 text-xs"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">To Date</label>
                                    <Input
                                        type="date"
                                        required
                                        className="h-12 rounded-sm border-gray-200 font-bold focus:ring-1 text-xs"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Reason</label>
                                <textarea
                                    placeholder="Enter reason..."
                                    required
                                    className="w-full h-24 rounded-sm border border-gray-200 p-4 text-xs font-bold focus:ring-1 focus:ring-blue-600 outline-none bg-white resize-none"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 h-12 rounded-sm text-[10px] font-black uppercase tracking-widest border-none p-0"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-[#1e463a] hover:bg-[#153229] text-white h-12 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 p-0"
                                >
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table Area matching User Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden font-sans">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#1e293b] hover:bg-[#1e293b] border-none">
                                <TableHead className="w-[60px] font-black text-white text-[10px] uppercase py-5 px-6">#</TableHead>
                                <TableHead className="font-black text-white text-[10px] uppercase py-5">STUDENT NAME</TableHead>
                                <TableHead className="font-black text-white text-[10px] uppercase py-5">FROM DATE</TableHead>
                                <TableHead className="font-black text-white text-[10px] uppercase py-5">TO DATE</TableHead>
                                <TableHead className="font-black text-white text-[10px] uppercase py-5">REASON</TableHead>
                                <TableHead className="w-[60px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaves.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-32 text-center text-gray-400 italic">
                                        No leave records found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leaves.map((l, index) => (
                                    <TableRow key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <TableCell className="px-6 py-5 text-xs text-gray-500 font-medium">{index + 1}</TableCell>
                                        <TableCell className="py-5">
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-gray-800 text-sm tracking-tight">{l.studentName}</p>
                                                <p className="text-[11px] text-gray-400 font-medium">{l.studentEmail}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5 text-xs text-gray-600 font-medium uppercase tracking-tight">{l.startDate}</TableCell>
                                        <TableCell className="py-5 text-xs text-gray-600 font-medium uppercase tracking-tight">{l.endDate}</TableCell>
                                        <TableCell className="py-5 text-xs text-gray-600 font-medium">{l.reason}</TableCell>
                                        <TableCell className="text-center py-5">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-300 hover:text-red-600 hover:bg-transparent"
                                                onClick={() => handleDelete(l.id)}
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
    );
}






