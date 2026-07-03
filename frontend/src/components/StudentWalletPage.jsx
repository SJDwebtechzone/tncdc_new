import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Search,
    ArrowLeft,
    Plus,
    Minus,
    X,
    History as HistoryIcon,
    Users,
    MapPin,
    Phone,
    Mail,
    Filter,
    ArrowUpRight,
    Wallet
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateStudent } from '@/store/studentSlice';

export default function StudentWalletPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const students = useSelector((state) => state.students.students || []);

    const [view, setView] = useState('list'); // 'list' or 'manage'
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeductModalOpen, setIsDeductModalOpen] = useState(false);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const totalBalance = students.reduce((sum, student) => sum + (Number(student.walletBalance) || 0), 0);

    const handleManageWallet = (student) => {
        setSelectedStudent(student);
        setView('manage');
    };

    const handleAddAmount = () => {
        if (!amount || isNaN(amount)) return;
        const newBalance = (Number(selectedStudent.walletBalance) || 0) + Number(amount);
        const updatedStudent = { ...selectedStudent, walletBalance: newBalance };

        // In a real app, we'd add to a transaction history array too
        dispatch(updateStudent(updatedStudent));
        setSelectedStudent(updatedStudent);
        closeModals();
    };

    const handleDeductAmount = () => {
        if (!amount || isNaN(amount)) return;
        const currentBalance = Number(selectedStudent.walletBalance) || 0;
        const newBalance = currentBalance - Number(amount);
        const updatedStudent = { ...selectedStudent, walletBalance: newBalance };

        dispatch(updateStudent(updatedStudent));
        setSelectedStudent(updatedStudent);
        closeModals();
    };

    const closeModals = () => {
        setIsAddModalOpen(false);
        setIsDeductModalOpen(false);
        setAmount('');
        setDescription('');
    };

    // List View
    if (view === 'list') {
        return (
            <div className="space-y-6 animate-in fade-in duration-500 font-sans">
                {/* Search Header */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="relative w-full">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Search by name, email, or mobile"
                                    className="pl-4 h-11 bg-white border-gray-100 w-full rounded-sm"
                                />
                            </div>
                            <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white px-8 h-11 rounded-sm font-bold uppercase tracking-wider text-xs">
                                <Search size={16} className="mr-2" /> Search
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Total Balance Hero Banner */}
                <div className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-sm p-12 text-center text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold opacity-90 mb-4 tracking-tight">Total Wallet Balance</h2>
                        <div className="text-6xl font-black mb-4">₹{totalBalance.toFixed(2)}</div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-80">Across all students</p>
                    </div>
                    {/* Decorative Background Pattern */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>
                </div>

                <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">Student Wallets</h2>
                        <div className="flex gap-3">
                            <Button
                                className="bg-[#52525b] hover:bg-gray-600 text-white text-[11px] font-bold h-9 px-6 rounded-sm uppercase tracking-wider transition-all"
                                onClick={() => navigate('/dashboard/fees/wallet/transactions')}
                            >
                                <HistoryIcon size={14} className="mr-2" />
                                All Transactions
                            </Button>
                            <Button
                                className="bg-[#b9875a] hover:bg-[#a6764a] text-white text-[11px] font-bold h-9 px-6 rounded-sm uppercase tracking-wider transition-all"
                                onClick={() => navigate('/dashboard/students/list')}
                            >
                                <ArrowLeft size={14} className="mr-2" />
                                Back to Students
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[300px]">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                                    <TableHead className="w-[60px] font-bold text-gray-800 text-[11px] uppercase tracking-wider pl-6 border-r border-gray-100">#</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase tracking-wider border-r border-gray-100">Student Details</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase tracking-wider border-r border-gray-100">Contact</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase tracking-wider border-r border-gray-100">Location</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase tracking-wider border-r border-gray-100 text-center">Wallet Balance</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase tracking-wider border-r border-gray-100 text-center">Status</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase tracking-wider text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-48 text-center text-gray-400 italic">
                                            No student records available.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    students.map((student, index) => (
                                        <TableRow key={student.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                                            <TableCell className="text-gray-500 font-bold pl-6 text-xs">{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="py-2">
                                                    <div className="font-bold text-gray-800 text-sm tracking-tight capitalize">{student.name}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {student.id}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-[11px] space-y-0.5">
                                                    <div className="text-gray-700 font-medium">{student.mobile}</div>
                                                    <div className="text-gray-400">{student.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-gray-600 text-xs font-medium">{student.location || '-'}</div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="py-1 px-3 rounded-lg inline-block text-center border border-green-100 bg-green-50/30">
                                                    <div className="font-black text-green-600 text-sm">₹{Number(student.walletBalance || 0).toFixed(2)}</div>
                                                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Current Balance</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest">Active</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    onClick={() => handleManageWallet(student)}
                                                    className="bg-[#1e3a8a] hover:bg-blue-900 text-white h-9 px-6 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-md border-none"
                                                >
                                                    Manage Wallet
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Showing {students.length} student(s)</span>
                        <span className="text-gray-300">Total Active Students: {students.length}</span>
                    </div>
                </div>
            </div>
        );
    }

    // Manage Wallet View
    if (view === 'manage' && selectedStudent) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 font-sans pb-10">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => setView('list')}
                        className="bg-[#b9875a] hover:bg-[#a6764a] text-white rounded-sm px-6 h-10 text-[11px] font-bold uppercase tracking-widest shadow-md transition-all flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Wallets
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left side: Student Info & History */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Student Info Card */}
                        <div className="bg-white p-10 rounded-sm shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:justify-between gap-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 w-full md:w-auto">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-[#1e3a8a] border-4 border-white shadow-lg shrink-0">
                                    <Users size={40} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-4 text-center md:text-left">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-800 tracking-tight capitalize">{selectedStudent.name}</h2>
                                        <p className="text-[#a855f7] font-bold text-[11px] uppercase tracking-[0.2em] mt-1">Institutional Student Profile</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <Phone size={14} className="text-[#1e3a8a]" />
                                            <span className="font-bold">Mobile:</span> {selectedStudent.mobile}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <Mail size={14} className="text-[#1e3a8a]" />
                                            <span className="font-bold">Email:</span> {selectedStudent.email}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <MapPin size={14} className="text-[#1e3a8a]" />
                                            <span className="font-bold">Location:</span> {selectedStudent.location || 'Not Set'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Balance Card - INTEGRATED */}
                            <div className="bg-[#2ecc71] text-white p-8 rounded-[1.5rem] shadow-xl text-center md:min-w-[280px] relative overflow-hidden animate-in zoom-in group/card">
                                <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-90 mb-2">Current Wallet Balance</p>
                                    <p className="text-4xl font-black">₹{Number(selectedStudent.walletBalance || 0).toFixed(2)}</p>
                                </div>
                                <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none group-hover/card:scale-110 transition-transform duration-500">
                                    <Wallet size={48} />
                                </div>
                            </div>
                        </div>

                        {/* Transaction History Section */}
                        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                        <HistoryIcon size={18} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Transaction History</h3>
                                </div>
                                <Button variant="outline" className="h-9 px-4 rounded-sm border-gray-200 text-gray-400 hover:text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                                    <Filter size={14} className="mr-2" />
                                    Filters
                                </Button>
                            </div>

                            <div className="p-10">
                                {/* Mock Transactions to match screenshot */}
                                <div className="space-y-8 relative pl-6 border-l-2 border-gray-50">
                                    <div className="relative pb-8 border-b border-gray-50">
                                        <div className="absolute -left-8 top-0 bg-green-500 text-white rounded-full p-1 border-4 border-white shadow-md">
                                            <Plus size={10} strokeWidth={4} />
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-green-600 font-black text-lg">+₹100.00</span>
                                                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border border-gray-200">Credit</span>
                                                    <span className="bg-[#f0fdf4] text-[#16a34a] px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border border-[#bbf7d0]">Manual add</span>
                                                </div>
                                                <p className="text-xs text-gray-800 font-medium">Fee</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">28 Jan 2026, 02:51 PM | By: SivaSankar</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Balance After</p>
                                                <p className="text-sm font-black text-gray-700 font-mono">₹100.00</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center py-10 opacity-30">
                                        <div className="bg-gray-50 p-6 rounded-full border border-gray-100 mb-4">
                                            <HistoryIcon size={32} className="text-gray-400" />
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">End of transaction history</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Quick Actions & Referrals */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Quick Actions Card */}
                        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                            <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-[0.2em] mb-8 border-b border-gray-50 pb-4">Quick Actions</h3>
                            <div className="space-y-4">
                                <Button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="w-full bg-[#1e463a] hover:bg-[#153229] text-white h-12 rounded-sm text-[11px] font-bold uppercase tracking-widest shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none"
                                >
                                    <Plus size={18} />
                                    Add Amount
                                </Button>
                                <Button
                                    onClick={() => setIsDeductModalOpen(true)}
                                    className="w-full bg-[#f1c40f] hover:bg-[#d4ac0d] text-gray-800 h-12 rounded-sm text-[11px] font-bold uppercase tracking-widest shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none"
                                >
                                    <Minus size={18} />
                                    Deduct Amount
                                </Button>
                            </div>
                        </div>

                        {/* Recent Referrals Card */}
                        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 min-h-[300px]">
                            <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-[0.2em] mb-8 border-b border-gray-50 pb-4">Recent Referrals</h3>
                            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 opacity-40">
                                <div className="p-4 bg-gray-50 rounded-full">
                                    <Users size={24} className="text-gray-400" />
                                </div>
                                <p className="text-[11px] font-medium text-gray-400 italic">No referrals found yet.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Amount Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[4px] p-6">
                        <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative animate-in zoom-in duration-300 overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Add Amount to Wallet</h2>
                                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Amount (₹)</label>
                                    <Input
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="h-12 border-gray-200 text-lg font-mono focus:ring-1 focus:ring-indigo-500 transition-all rounded-sm"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Reason for adding amount.."
                                        className="w-full h-32 p-4 border border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all font-sans"
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-4 pt-4">
                                    <Button
                                        onClick={closeModals}
                                        className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-10 h-11 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none shadow-md active:scale-95 transition-all w-40 p-0"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleAddAmount}
                                        className="bg-[#1e463a] hover:bg-[#153229] text-white px-10 h-11 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none shadow-md active:scale-95 transition-all w-48 p-0"
                                    >
                                        Add Amount
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Deduct Amount Modal */}
                {isDeductModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[4px] p-6">
                        <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative animate-in zoom-in duration-300 overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Deduct Amount from Wallet</h2>
                                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Current Balance Banner - UNIQUE TO DEDUCT MODAL AS PER SCREENSHOT */}
                            <div className="bg-[#f1c40f] mx-5 mt-5 p-4 rounded-sm flex items-center justify-between shadow-sm">
                                <span className="text-gray-700 font-black text-[11px] uppercase tracking-widest">Current Balance:</span>
                                <span className="text-gray-800 font-mono font-bold">₹{Number(selectedStudent.walletBalance || 0).toFixed(2)}</span>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Amount (₹)</label>
                                    <Input
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="h-12 border-gray-200 text-lg font-mono focus:ring-1 focus:ring-yellow-500 transition-all rounded-sm"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Reason for deducting amount.."
                                        className="w-full h-32 p-4 border border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-yellow-500 outline-none resize-none transition-all font-sans"
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-4 pt-4">
                                    <Button
                                        onClick={closeModals}
                                        className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-10 h-11 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none shadow-md active:scale-95 transition-all w-40 p-0"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleDeductAmount}
                                        className="bg-[#f1c40f] hover:bg-[#d4ac0d] text-gray-800 px-10 h-11 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none shadow-md active:scale-95 transition-all w-48 p-0"
                                    >
                                        Deduct Amount
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null; // Fallback
}






