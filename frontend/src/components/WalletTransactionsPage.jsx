import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft,
    ArrowUp,
    ArrowDown,
    FileText,
    Users,
    Search,
    RotateCcw,
    Calendar
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function WalletTransactionsPage() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">All Wallet Transactions</h1>
                <Button
                    className="bg-[#d97706] hover:bg-amber-600 text-white text-sm gap-2"
                    onClick={() => navigate('/dashboard/fees/wallet')}
                >
                    <ArrowLeft size={16} /> Back to Wallets
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Credit */}
                <div className="bg-[#6366f1] p-6 rounded-lg shadow-sm text-white flex flex-col justify-between h-32 relative overflow-hidden">
                    <div className="flex items-start gap-4 z-10">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <ArrowUp size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase opacity-90">TOTAL CREDIT</div>
                            <div className="text-[10px] opacity-75">Money Added</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold z-10">₹100.00</div>
                    {/* Decorative element could be added here */}
                </div>

                {/* Total Debit */}
                <div className="bg-[#f97316] p-6 rounded-lg shadow-sm text-white flex flex-col justify-between h-32 relative overflow-hidden">
                    <div className="flex items-start gap-4 z-10">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <ArrowDown size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase opacity-90">TOTAL DEBIT</div>
                            <div className="text-[10px] opacity-75">Money Deducted</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold z-10">₹0.00</div>
                </div>

                {/* Transactions */}
                <div className="bg-[#4f46e5] p-6 rounded-lg shadow-sm text-white flex flex-col justify-between h-32 relative overflow-hidden">
                    <div className="flex items-start gap-4 z-10">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase opacity-90">TRANSACTIONS</div>
                            <div className="text-[10px] opacity-75">Total Operations</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold z-10">1</div>
                </div>

                {/* Students */}
                <div className="bg-[#06b6d4] p-6 rounded-lg shadow-sm text-white flex flex-col justify-between h-32 relative overflow-hidden">
                    <div className="flex items-start gap-4 z-10">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Users size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase opacity-90">STUDENTS</div>
                            <div className="text-[10px] opacity-75">Total Students</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold z-10">1</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Student</label>
                        <select className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 bg-white">
                            <option>All Students</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Type</label>
                        <select className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 bg-white">
                            <option>All Types</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Source</label>
                        <select className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 bg-white">
                            <option>All Sources</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">From Date</label>
                        <div className="relative">
                            <input type="date" className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-400" />
                            {/* <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} /> */}
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">To Date</label>
                            <input type="date" className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-400" />
                        </div>
                        <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white h-10 w-12">
                            <Search size={18} />
                        </Button>
                    </div>
                </div>
                <Button className="bg-[#b45309] hover:bg-[#b45309]/90 text-white gap-2 h-9 text-xs">
                    <RotateCcw size={14} /> Reset Filters
                </Button>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Transaction History</h2>
                    <span className="bg-[#1e3a8a] text-white text-xs px-2 py-0.5 rounded font-medium">1 transactions</span>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-white border-b border-gray-100 hover:bg-transparent">
                                <TableHead className="font-bold text-gray-800 text-xs uppercase w-[50px]">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Transaction ID</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Student</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Type</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Amount</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Description</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Source</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Balance After</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Created By</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="border-b border-gray-50 hover:bg-gray-50">
                                <TableCell className="text-blue-600 font-medium text-xs">1</TableCell>
                                <TableCell className="text-gray-400 text-xs uppercase">TXN-1769592068-8806</TableCell>
                                <TableCell className="text-gray-600 text-xs">Sathish S/O Mani Kanna</TableCell>
                                <TableCell>
                                    <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                                        <ArrowUp size={12} strokeWidth={3} /> Credit
                                    </span>
                                </TableCell>
                                <TableCell className="text-gray-800 font-bold text-xs">+₹100.00</TableCell>
                                <TableCell className="text-gray-600 text-xs">fee</TableCell>
                                <TableCell className="text-gray-600 text-xs">Manual add</TableCell>
                                <TableCell className="text-gray-800 font-bold text-xs">₹100.00</TableCell>
                                <TableCell className="text-blue-500 text-xs">SivaSankar</TableCell>
                                <TableCell>
                                    <div className="text-xs text-gray-600">28 Jan 2026</div>
                                    <div className="text-[10px] text-gray-400">02:51 PM</div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}






