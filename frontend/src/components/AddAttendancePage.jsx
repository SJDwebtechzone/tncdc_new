import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Clock, 
    Search, 
    Calendar, 
    User, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    Save, 
    Loader2,
    Monitor,
    Users,
    LogIn,
    LogOut
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSelector, useDispatch } from 'react-redux';
import { fetchBatches } from '@/store/batchSlice';
import { fetchStudentAttendance, submitStudentAttendance } from '@/store/attendanceSlice';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { BASE_URL } from '@/config';

export default function AddAttendancePage() {
    const dispatch = useDispatch();
    const { batches } = useSelector((state) => state.batches);
    const { studentAttendanceRecords, loading } = useSelector((state) => state.attendance);
    
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        dispatch(fetchBatches());
    }, [dispatch]);

    // Update local state when records are fetched from backend
    useEffect(() => {
        if (studentAttendanceRecords) {
            const initialData = studentAttendanceRecords.map(record => ({
                admissionId: record.id,
                studentName: `${record.firstName} ${record.surname}`,
                studentEmail: record.email,
                studentImage: record.enquiry?.profileImage,
                course: record.courseName,
                status: record.attendance?.status || 'Present',
                punchIn: record.attendance?.punchIn || '08:15 AM',
                punchOut: record.attendance?.punchOut || '10:00 AM',
                remarks: record.attendance?.remarks || '',
                attendanceId: record.attendance?.id || null
            }));
            setAttendanceData(initialData);
        }
    }, [studentAttendanceRecords]);

    const handleShow = async () => {
        if (!selectedBatch) {
            toast.error('Please select a batch');
            return;
        }
        try {
            await dispatch(fetchStudentAttendance({ batch: selectedBatch, date: selectedDate })).unwrap();
            setHasFetched(true);
        } catch (err) {
            toast.error('Failed to load students');
        }
    };

    const handleStatusChange = (admissionId, newStatus) => {
        setAttendanceData(prev => prev.map(item => 
            item.admissionId === admissionId ? { ...item, status: newStatus } : item
        ));
    };

    const handleTimeChange = (admissionId, field, value) => {
        setAttendanceData(prev => prev.map(item => 
            item.admissionId === admissionId ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                date: selectedDate,
                batch: selectedBatch,
                attendanceData: attendanceData.map(item => ({
                    admissionId: item.admissionId,
                    status: item.status,
                    punchIn: item.punchIn,
                    punchOut: item.punchOut,
                    remarks: item.remarks,
                    attendanceId: item.attendanceId
                }))
            };
            await dispatch(submitStudentAttendance(payload)).unwrap();
            toast.success('Attendance submitted successfully');
        } catch (err) {
            toast.error('Failed to submit attendance');
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold text-gray-800 font-sans tracking-tight uppercase">Student Attendance</h1>

            {/* Header Banner - Premium Dark Theme */}
            <div className="bg-[#1e293b] p-8 rounded-sm text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-md">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Mark Attendance</h2>
                        <p className="text-gray-400 text-sm mt-0.5">Select a batch and date to record student attendance</p>
                    </div>
                </div>
            </div>

            {/* Selection Selection Selection Card */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 font-sans">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                    <div className="md:col-span-4 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Select Batch</label>
                        <select 
                            className="w-full h-12 rounded-sm border border-gray-200 px-4 text-xs font-bold focus:ring-1 focus:ring-blue-600 outline-none bg-white text-gray-600 appearance-none cursor-pointer shadow-sm"
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                        >
                            <option value="">Choose a batch...</option>
                            {batches.map(batch => (
                                <option key={batch.id} value={batch.name}>{batch.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-4 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Select Date</label>
                        <div className="relative">
                            <Input 
                                type="date" 
                                className="h-12 rounded-sm border-gray-200 font-bold focus:ring-1 text-xs px-4 shadow-sm" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="md:col-span-4">
                        <Button 
                            onClick={handleShow}
                            disabled={loading}
                            className="w-full bg-[#1e3a8a] hover:bg-[#1a365d] text-white h-12 rounded-sm flex items-center justify-center gap-2 shadow-md font-black uppercase text-[11px] tracking-widest transition-all active:scale-95"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} strokeWidth={3} />}
                            Show
                        </Button>
                    </div>
                </div>
            </div>

            {hasFetched && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <Users size={20} className="text-gray-400" />
                            <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">Student List ({attendanceData.length})</h3>
                        </div>
                        <p className="text-[11px] font-bold text-gray-400 italic">Date: {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>

                    {/* Attendance Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden font-sans">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#1e293b] hover:bg-[#1e293b] border-none">
                                        <TableHead className="w-[60px] font-black text-white text-[10px] uppercase py-5 px-6">#</TableHead>
                                        <TableHead className="font-black text-white text-[10px] uppercase py-5">STUDENT NAME</TableHead>
                                        <TableHead className="font-black text-white text-[10px] uppercase py-5 text-center">STUDENT IMAGE</TableHead>
                                        <TableHead className="font-black text-white text-[10px] uppercase py-5">COURSE</TableHead>
                                        <TableHead className="font-black text-white text-[10px] uppercase py-5">PUNCH IN</TableHead>
                                        <TableHead className="font-black text-white text-[10px] uppercase py-5">PUNCH OUT</TableHead>
                                        <TableHead className="font-black text-white text-[10px] uppercase py-5">STATUS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendanceData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 text-gray-300">
                                                    <Users size={48} />
                                                    <p className="font-bold uppercase text-xs tracking-widest">No students found in this batch</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        attendanceData.map((student, index) => (
                                            <TableRow key={student.admissionId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <TableCell className="px-6 py-8 text-xs text-gray-500 font-bold">{index + 1}</TableCell>
                                                <TableCell className="py-8">
                                                    <div className="space-y-0.5">
                                                        <p className="font-bold text-gray-800 text-sm tracking-tight">{student.studentName}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium">{student.studentEmail}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-8 text-center">
                                                    <div className="flex justify-center">
                                                        <div className="w-16 h-20 rounded-md overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                                                            {student.studentImage ? (
                                                                <img src={student.studentImage.startsWith('http') ? student.studentImage : `${BASE_URL}${student.studentImage}`} alt="Student" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                                    <User size={24} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-8">
                                                    <p className="text-[11px] font-bold text-gray-500 line-clamp-2 max-w-[200px] uppercase">{student.course}</p>
                                                </TableCell>
                                                <TableCell className="py-8">
                                                    <div className="relative group">
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 group-focus-within:text-green-600 transition-colors">
                                                            <LogIn size={16} />
                                                        </div>
                                                        <input 
                                                            type="text"
                                                            className="w-36 h-10 pl-10 pr-10 rounded-sm border border-gray-100 bg-gray-50/30 text-xs font-bold focus:ring-1 focus:ring-green-500 outline-none transition-all shadow-sm"
                                                            value={student.punchIn}
                                                            onChange={(e) => handleTimeChange(student.admissionId, 'punchIn', e.target.value)}
                                                        />
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                                                            <Clock size={16} />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-8">
                                                    <div className="relative group">
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 group-focus-within:text-orange-600 transition-colors">
                                                            <LogOut size={16} />
                                                        </div>
                                                        <input 
                                                            type="text"
                                                            className="w-36 h-10 pl-10 pr-10 rounded-sm border border-gray-100 bg-gray-50/30 text-xs font-bold focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-sm"
                                                            value={student.punchOut}
                                                            onChange={(e) => handleTimeChange(student.admissionId, 'punchOut', e.target.value)}
                                                        />
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                                                            <Clock size={16} />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-8">
                                                    <div className="grid grid-cols-2 gap-2 w-48">
                                                        <button 
                                                            onClick={() => handleStatusChange(student.admissionId, 'Present')}
                                                            className={cn(
                                                                "flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                                                                student.status === 'Present' 
                                                                ? "bg-green-50 text-green-600 border-green-200 shadow-sm" 
                                                                : "bg-transparent text-gray-400 border-gray-100 hover:bg-gray-50"
                                                            )}
                                                        >
                                                            <CheckCircle2 size={14} className={student.status === 'Present' ? "scale-110" : "opacity-30"} />
                                                            Present
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusChange(student.admissionId, 'Absent')}
                                                            className={cn(
                                                                "flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                                                                student.status === 'Absent' 
                                                                ? "bg-red-50 text-red-600 border-red-200 shadow-sm" 
                                                                : "bg-transparent text-gray-400 border-gray-100 hover:bg-gray-50"
                                                            )}
                                                        >
                                                            <XCircle size={14} className={student.status === 'Absent' ? "scale-110" : "opacity-30"} />
                                                            Absent
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusChange(student.admissionId, 'Leave')}
                                                            className={cn(
                                                                "col-span-2 flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                                                                student.status === 'Leave' 
                                                                ? "bg-yellow-50 text-yellow-600 border-yellow-200 shadow-sm" 
                                                                : "bg-transparent text-gray-400 border-gray-100 hover:bg-gray-50"
                                                            )}
                                                        >
                                                            <AlertCircle size={14} className={student.status === 'Leave' ? "scale-110" : "opacity-30"} />
                                                            Leave Record
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    {attendanceData.length > 0 && (
                        <div className="flex justify-end pt-4">
                            <Button 
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#1e463a] hover:bg-[#153229] text-white px-10 h-12 rounded-sm flex items-center gap-3 shadow-xl font-black uppercase text-[11px] tracking-widest transition-all active:scale-95"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} strokeWidth={3} />}
                                Submit Attendance
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
