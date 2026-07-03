import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, RotateCcw, Filter, FolderOpen, PhoneOff, User, Phone, Calendar, MessageSquare, AlertTriangle, CheckCircle2, Clock, MoreVertical, Eye, FileText, CalendarClock, X } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { addFollowUp, fetchAllFollowUps, saveEnquiryFollowUp, fetchEnquiries } from '@/store/studentSlice';
import { fetchUsers } from '@/store/userSlice';
import StudentEnquiryView from './StudentEnquiryView';

export default function EnquiriesFollowUpsPage() {
    const navigate = useNavigate();
    const followUps = useSelector((state) => state.students.followUps || []);
    const enquiries = useSelector((state) => state.students.enquiries || []); // Use enquiries for selection
    const users = useSelector((state) => state.users.users || []);
    const dispatch = useDispatch();
    const [viewEnquiry, setViewEnquiry] = useState(null);
    
    // Quick Follow-up Modal State
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [selectedEnquiryForFollowUp, setSelectedEnquiryForFollowUp] = useState(null);
    const [followUpModalForm, setFollowUpModalForm] = useState({
        status: 'Interested',
        remarks: '',
        nextDate: ''
    });

    // Reschedule Modal State
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedEnquiryForReschedule, setSelectedEnquiryForReschedule] = useState(null);
    const [rescheduleDate, setRescheduleDate] = useState('');

    React.useEffect(() => {
        dispatch(fetchAllFollowUps());
        dispatch(fetchEnquiries());
        dispatch(fetchUsers());
    }, [dispatch]);

    const [filters, setFilters] = useState({
        type: 'All Follow ups', // Overdue, Due Today, Upcoming
        status: 'All Status',
        employee: 'All Employees',
        startDate: '',
        endDate: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        type: 'All Follow ups',
        status: 'All Status',
        employee: 'All Employees',
        startDate: '',
        endDate: ''
    });

    const [formData, setFormData] = useState({
        studentId: '',
        status: 'Interested',
        remarks: '',
        nextDate: ''
    });

    const handleAddFollowUp = () => {
        if (!formData.studentId) {
            alert("Please select a student first.");
            return;
        }
        dispatch(saveEnquiryFollowUp({
            enquiryId: formData.studentId,
            data: {
                followUpDate: new Date().toISOString(),
                nextFollowUpDate: formData.nextDate,
                studentResponse: formData.status,
                conversationDetails: formData.remarks
            }
        })).then(() => {
            dispatch(fetchAllFollowUps());
            setFormData({ studentId: '', status: 'Interested', remarks: '', nextDate: '' });
        });
    };
    const handleView = (enquiry) => {
        setViewEnquiry(enquiry);
    };

    const handleOpenFollowUpModal = (enquiry) => {
        setSelectedEnquiryForFollowUp(enquiry);
        setFollowUpModalForm({
            status: 'Interested',
            remarks: '',
            nextDate: ''
        });
        setIsFollowUpModalOpen(true);
    };

    const handleSaveFollowUpModal = () => {
        if (!selectedEnquiryForFollowUp) return;
        
        dispatch(saveEnquiryFollowUp({
            enquiryId: selectedEnquiryForFollowUp.id,
            data: {
                followUpDate: new Date().toISOString(),
                nextFollowUpDate: followUpModalForm.nextDate,
                studentResponse: followUpModalForm.status,
                conversationDetails: followUpModalForm.remarks
            }
        })).then(() => {
            dispatch(fetchAllFollowUps());
            setIsFollowUpModalOpen(false);
            setSelectedEnquiryForFollowUp(null);
        });
    };

    const handleOpenRescheduleModal = (enquiry) => {
        setSelectedEnquiryForReschedule(enquiry);
        setRescheduleDate(enquiry.nextFollowUpDate || '');
        setIsRescheduleModalOpen(true);
    };

    const handleReschedule = () => {
        if (!selectedEnquiryForReschedule || !rescheduleDate) return;

        dispatch(saveEnquiryFollowUp({
            enquiryId: selectedEnquiryForReschedule.id,
            data: {
                followUpDate: new Date().toISOString(),
                nextFollowUpDate: rescheduleDate,
                studentResponse: selectedEnquiryForReschedule.studentResponse || 'Callback',
                conversationDetails: 'Follow-up rescheduled'
            }
        })).then(() => {
            dispatch(fetchAllFollowUps());
            setIsRescheduleModalOpen(false);
            setSelectedEnquiryForReschedule(null);
        });
    };

    const handleFilter = () => {
        setAppliedFilters({ ...filters });
    };

    // 1. Group by Enquiry to show only the latest follow-up per student
    const groupedFollowUps = React.useMemo(() => {
        const groups = {};
        followUps.forEach(f => {
            const eid = f.enquiryId;
            if (!groups[eid] || new Date(f.followUpDate) > new Date(groups[eid].followUpDate)) {
                groups[eid] = f;
            }
        });
        return Object.values(groups).sort((a, b) => new Date(b.followUpDate) - new Date(a.followUpDate));
    }, [followUps]);

    // 2. Filter the GROUPED list
    const filteredFollowUps = React.useMemo(() => {
        return groupedFollowUps.filter(item => {
            // Timeframe Filter
            if (appliedFilters.type !== 'All Follow ups') {
                const nextDate = item.nextFollowUpDate ? new Date(item.nextFollowUpDate) : null;
                const todayStr = new Date().toDateString();
                const nextDateStr = nextDate ? nextDate.toDateString() : '';
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                if (appliedFilters.type === 'Overdue') {
                    if (!nextDate || nextDate >= today) return false;
                } else if (appliedFilters.type === 'Due Today') {
                    if (nextDateStr !== todayStr) return false;
                } else if (appliedFilters.type === 'Upcoming') {
                    if (!nextDate || nextDate < tomorrow) return false;
                } else if (appliedFilters.type === 'Completed Today') {
                    if (new Date(item.followUpDate).toDateString() !== todayStr) return false;
                }
            }

            // Status Filter
            if (appliedFilters.status !== 'All Status') {
                if (item.studentResponse !== appliedFilters.status) return false;
            }

            // Employee Filter
            if (appliedFilters.employee !== 'All Employees') {
                if (item.enquiry?.assignedTo !== appliedFilters.employee) return false;
            }

            // Date Range Filter
            if (appliedFilters.startDate) {
                const start = new Date(appliedFilters.startDate);
                start.setHours(0, 0, 0, 0);
                if (!item.nextFollowUpDate || new Date(item.nextFollowUpDate) < start) return false;
            }
            if (appliedFilters.endDate) {
                const end = new Date(appliedFilters.endDate);
                end.setHours(23, 59, 59, 999);
                if (!item.nextFollowUpDate || new Date(item.nextFollowUpDate) > end) return false;
            }

            return true;
        });
    }, [groupedFollowUps, appliedFilters]);

    // 3. Stats based on UNIQUE enquiries from the full history
    const stats = React.useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        // For counts, we group by student first to get the latest status
        const latestByStudent = {};
        followUps.forEach(f => {
            const eid = f.enquiryId;
            if (!latestByStudent[eid] || new Date(f.followUpDate) > new Date(latestByStudent[eid].followUpDate)) {
                latestByStudent[eid] = f;
            }
        });
        const currentStates = Object.values(latestByStudent);

        return {
            overdue: currentStates.filter(f => f.nextFollowUpDate && new Date(f.nextFollowUpDate) < today).length,
            dueToday: currentStates.filter(f => f.nextFollowUpDate && new Date(f.nextFollowUpDate).toDateString() === today.toDateString()).length,
            upcoming: currentStates.filter(f => f.nextFollowUpDate && new Date(f.nextFollowUpDate) >= tomorrow && new Date(f.nextFollowUpDate) <= nextWeek).length,
            completedToday: currentStates.filter(f => new Date(f.followUpDate).toDateString() === today.toDateString()).length
        };
    }, [followUps]);

    if (viewEnquiry) {
        return <StudentEnquiryView enquiry={viewEnquiry} onBack={() => setViewEnquiry(null)} />;
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Overdue Follow-ups", count: stats.overdue, bg: "bg-[#dc2626]" }, // Red
                    { label: "Due Today", count: stats.dueToday, bg: "bg-[#eab308]" }, // Yellow
                    { label: "Upcoming This Week", count: stats.upcoming, bg: "bg-[#7c3aed]" }, // Purple
                    { label: "Completed Today", count: stats.completedToday, bg: "bg-[#16a34a]" }, // Green
                ].map((stat, idx) => (
                    <div key={idx} className={`${stat.bg} text-white p-4 rounded-lg flex flex-col items-center justify-center h-24 shadow-md`}>
                        <div className="text-3xl font-bold">{stat.count}</div>
                        <div className="text-sm font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Add Follow-up */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gray-800 rounded-full p-0.5">
                        <Plus size={12} className="text-white" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-700">Quick Add Follow-up</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-3">
                        <select
                            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 bg-white"
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        >
                            <option value="">Select Student</option>
                            {enquiries.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.surname}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <div className="relative">
                            <input type="text" className="w-full h-10 rounded-lg border border-gray-200 px-3 text-xs text-gray-500" value={new Date().toLocaleString()} readOnly />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <select
                            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 bg-white"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Interested">Interested</option>
                            <option value="Not Interested">Not Interested</option>
                            <option value="Callback">Callback</option>
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <Input
                            className="h-10 w-full text-xs"
                            placeholder="Remarks"
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <input
                            type="datetime-local"
                            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-400"
                            value={formData.nextDate}
                            onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                            onClick={(e) => e.target.showPicker()}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <Button onClick={handleAddFollowUp} className="bg-[#065f46] hover:bg-[#065f46]/90 text-white gap-2 text-xs">
                        <Plus size={14} /> Add Follow-up
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-2">
                    <select 
                        className="w-full h-10 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 bg-white"
                        value={filters.type}
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                    >
                        <option>All Follow ups</option>
                        <option>Overdue</option>
                        <option>Due Today</option>
                        <option>Upcoming</option>
                        <option>Completed Today</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <select 
                        className="w-full h-10 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 bg-white"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                        <option>All Status</option>
                        <option>Interested</option>
                        <option>Not Interested</option>
                        <option>Call Back Later</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <select 
                        className="w-full h-10 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 bg-white"
                        value={filters.employee}
                        onChange={(e) => setFilters({...filters, employee: e.target.value})}
                    >
                        <option>All Employees</option>
                        {users.map(u => <option key={u.id} value={u.fullName}>{u.fullName}</option>)}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <input 
                        type="date" 
                        className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-400" 
                        value={filters.startDate}
                        onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                        onClick={(e) => e.target.showPicker()}
                    />
                </div>
                <div className="md:col-span-2">
                    <input 
                        type="date" 
                        className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-400" 
                        value={filters.endDate}
                        onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                        onClick={(e) => e.target.showPicker()}
                    />
                </div>
                <div className="md:col-span-2">
                    <Button onClick={handleFilter} className="w-full bg-[#1e3a8a] text-white h-10 text-xs">
                        Filter
                    </Button>
                </div>
            </div>

            {/* Header & Export */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-600 flex items-center gap-2">
                        <span className="text-gray-600">⋮≡</span> Follow-ups
                    </h2>
                    <span className="bg-[#1e3a8a] text-white text-xs px-2 py-0.5 rounded font-medium">{filteredFollowUps.length}</span>
                </div>
                <Button className="bg-[#065f46] hover:bg-[#065f46]/90 text-white gap-2 text-xs">
                    <div className="rotate-180"><StartIcon /></div> Export
                </Button>
            </div>

            {/* Follow-ups List - Card View */}
            {filteredFollowUps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                    <div className="relative">
                        <PhoneOff size={48} className="mb-4 text-gray-400 opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 mb-1">No follow-ups found</h3>
                    <p className="text-xs text-gray-400">Try adjusting your filters or add a new follow-up.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredFollowUps.map((item) => {
                        const isOverdue = item.nextFollowUpDate && new Date(item.nextFollowUpDate) < new Date();
                        const isToday = item.nextFollowUpDate && new Date(item.nextFollowUpDate).toDateString() === new Date().toDateString();
                        
                        let borderColor = 'border-l-gray-300';
                        if (isOverdue) borderColor = 'border-l-red-500';
                        else if (isToday) borderColor = 'border-l-yellow-500';
                        else borderColor = 'border-l-green-500';

                        return (
                            <div key={item.id} className={`bg-white rounded-lg shadow-sm border border-gray-100 border-l-[6px] ${borderColor} p-5 relative transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    {/* Left Content: Student Info */}
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                                            <div className="bg-gray-800 text-white rounded p-1 text-[8px] font-bold">TN</div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-gray-900 text-base leading-none">
                                                    {item.enquiry?.firstName} {item.enquiry?.surname}
                                                </h3>
                                                <div className="flex gap-1.5 translate-y-[-1px]">
                                                    <span className="bg-[#14532d] text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Converted</span>
                                                    <span className="bg-[#4b5563] text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Website</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-2">
                                                <Phone size={13} className="text-[#1e3a8a]" />
                                                <span className="font-medium">{item.enquiry?.mobile}</span>
                                            </div>

                                            <div className="mt-4 space-y-2.5">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-bold text-gray-800 shrink-0">Last Follow-up:</span>
                                                    <span className="text-gray-700 font-medium">{new Date(item.followUpDate).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ml-1 ${
                                                        item.studentResponse === 'Interested' ? 'bg-[#14532d] text-white' :
                                                        item.studentResponse === 'Call Back Later' ? 'bg-[#eab308] text-white' :
                                                        'bg-[#dc2626] text-white'
                                                    }`}>
                                                        {item.studentResponse === 'Call Back Later' ? 'Call back later' : item.studentResponse}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm leading-tight">
                                                    <span className="font-bold text-gray-800 shrink-0">Remarks:</span>
                                                    <span className="text-gray-600 font-medium">{item.conversationDetails || 'No remarks provided'}</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-bold text-gray-800 shrink-0">Next Follow-up:</span>
                                                    <span className={`font-bold flex items-center gap-1.5 ${isOverdue ? 'text-[#dc2626]' : 'text-gray-900'}`}>
                                                        {item.nextFollowUpDate ? new Date(item.nextFollowUpDate).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not scheduled'}
                                                        {isOverdue && <AlertTriangle size={15} className="text-red-500" />}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Content: Actions */}
                                    <div className="flex flex-wrap items-center gap-2 self-center md:self-start mt-2">
                                        <Button onClick={() => handleView(item.enquiry)} variant="outline" className="h-9 px-4 border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50 text-[11px] font-bold gap-1.5 rounded-md">
                                            <Eye size={14} /> View
                                        </Button>
                                         <Button onClick={() => handleOpenFollowUpModal(item.enquiry)} variant="outline" className="h-9 px-4 border-[#334155] text-[#334155] hover:bg-gray-50 text-[11px] font-bold rounded-md">
                                             Follow-up
                                         </Button>
                                         <Button 
                                            onClick={() => navigate(`/dashboard/students/admissions/add?enquiryId=${item.enquiryId}`)}
                                            className="h-9 px-4 bg-[#14532d] hover:bg-[#14532d]/90 text-white text-[11px] font-bold rounded-md"
                                         >
                                             Convert
                                         </Button>
                                         <Button onClick={() => handleOpenRescheduleModal(item.enquiry)} variant="outline" className="h-9 px-2 border-[#334155] text-[#334155] hover:bg-gray-50 text-[11px] font-bold rounded-md">
                                             <CalendarClock size={14} />
                                         </Button>
                                    </div>
                                </div>

                                <div className="absolute bottom-5 right-5 flex items-center gap-2 text-xs text-gray-500 font-medium">
                                    <User size={13} className="text-gray-400" />
                                    <span>by {item.enquiry?.assignedTo || 'Unassigned'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Quick Follow-up Modal */}
            {isFollowUpModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-lg shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold text-gray-800">Quick Follow-up</h2>
                            <button onClick={() => setIsFollowUpModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {/* Banner */}
                            <div className="bg-gray-500 text-white p-3 rounded flex items-center gap-3 text-sm">
                                <User size={16} />
                                <span>Adding follow-up for selected student</span>
                            </div>

                            {/* Status */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700">Follow-up Status *</label>
                                <select 
                                    className="w-full h-10 rounded border border-gray-200 px-3 text-sm bg-white"
                                    value={followUpModalForm.status}
                                    onChange={(e) => setFollowUpModalForm({...followUpModalForm, status: e.target.value})}
                                >
                                    <option value="Interested">Interested</option>
                                    <option value="Not Interested">Not Interested</option>
                                    <option value="Call Back Later">Call Back Later</option>
                                </select>
                            </div>

                            {/* Remarks */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700">Remarks *</label>
                                <textarea 
                                    className="w-full h-24 rounded border border-gray-200 p-3 text-sm resize-none"
                                    placeholder="Enter conversation details"
                                    value={followUpModalForm.remarks}
                                    onChange={(e) => setFollowUpModalForm({...followUpModalForm, remarks: e.target.value})}
                                />
                            </div>

                            {/* Next Date */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700">Next Follow-up Date</label>
                                <input 
                                    type="datetime-local" 
                                    className="w-full h-10 rounded border border-gray-200 px-3 text-sm"
                                    value={followUpModalForm.nextDate}
                                    onChange={(e) => setFollowUpModalForm({...followUpModalForm, nextDate: e.target.value})}
                                    onClick={(e) => e.target.showPicker()}
                                />
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex justify-center gap-4 pt-2">
                                <Button 
                                    onClick={() => setIsFollowUpModalOpen(false)}
                                    className="bg-[#c27c44] hover:bg-[#a66a3a] text-white font-bold h-10 px-8 rounded-md"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleSaveFollowUpModal}
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white font-bold h-10 px-8 rounded-md"
                                >
                                    Add Follow-up
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Follow-up Modal */}
            {isRescheduleModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-lg shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold text-gray-800">Reschedule Follow-up</h2>
                            <button onClick={() => setIsRescheduleModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">New Follow-up Date *</label>
                                <input 
                                    type="datetime-local" 
                                    className="w-full h-11 rounded border border-gray-200 px-4 text-sm focus:ring-1 focus:ring-yellow-400 outline-none"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    onClick={(e) => e.target.showPicker()}
                                />
                            </div>

                            <div className="flex justify-center gap-4 pt-2 pb-2">
                                <Button 
                                    onClick={() => setIsRescheduleModalOpen(false)}
                                    className="bg-[#c27c44] hover:bg-[#a66a3a] text-white font-bold h-11 px-10 rounded-md shadow-sm transition-all"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleReschedule}
                                    className="bg-[#eab308] hover:bg-[#ca8a04] text-white font-bold h-11 px-10 rounded-md shadow-sm transition-all"
                                >
                                    Reschedule
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function StartIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
    )
}






