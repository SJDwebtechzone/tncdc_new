import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, RotateCw, Wallet, Bell, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSelector, useDispatch } from 'react-redux';
import { fetchUpcomingInstallments } from '@/store/feeSlice';

export default function UpcomingInstallmentsPage() {
    const dispatch = useDispatch();
    const { upcomingInstallments, loading } = useSelector((state) => state.fees);

    useEffect(() => {
        dispatch(fetchUpcomingInstallments());
    }, [dispatch]);

    // Calculate total amount
    const totalAmount = upcomingInstallments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    if (loading && upcomingInstallments.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-medium text-gray-800">Upcoming Installments</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Actions */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    {/* Summary Card style */}
                    <div className="flex items-center gap-4 bg-white border border-blue-100 p-3 rounded-xl shadow-sm min-w-[300px]">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-semibold">Total Upcoming Amount</div>
                            <div className="text-lg font-bold text-gray-800">₹{totalAmount.toFixed(2)}</div>
                        </div>
                    </div>

                    <Button className="bg-[#14532d] hover:bg-[#14532d]/90 text-white gap-2 h-9 text-sm">
                        <Download size={14} /> Export
                    </Button>
                </div>

                {/* Filters */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-6 gap-3 bg-gray-50/30 border-b border-gray-100">
                    <div className="md:col-span-2 relative">
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg h-9 px-3 text-sm text-gray-500">
                            <span className="mr-2">📅</span> 2026-02-03 - 2026-03-03
                        </div>
                    </div>
                    <select className="h-9 rounded-lg border border-gray-200 text-sm bg-white px-3 text-gray-600 focus:outline-none">
                        <option>All Batches</option>
                    </select>
                    <div className="relative">
                        <input className="w-full pl-8 h-9 rounded-lg border border-gray-200 text-sm focus:outline-none" placeholder="Search by Student" />
                        <span className="absolute left-2.5 top-2.5 text-gray-400">👤</span>
                    </div>
                    <div className="relative">
                        <input className="w-full pl-8 h-9 rounded-lg border border-gray-200 text-sm focus:outline-none" placeholder="Search by Roll No" />
                        <span className="absolute left-2.5 top-2.5 text-gray-400">🔢</span>
                    </div>
                    <div className="flex gap-2">
                        <Button className="flex-1 bg-[#dc2626] hover:bg-red-700 text-white h-9 text-xs gap-1">
                            <Filter size={12} /> Filter
                        </Button>
                        <Button variant="outline" className="flex-1 text-orange-400 border-orange-200 h-9 text-xs gap-1">
                            <RotateCw size={12} /> Reset
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-100/50">
                            <TableRow>
                                <TableHead className="w-[50px] font-bold text-gray-700 text-xs uppercase">Installment No.</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase">Course Name</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase">Student Name</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase">Roll Number</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase">Amount</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase">Due Date</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase">Late Fee</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase">Frequency</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase">Send Reminder</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {upcomingInstallments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="h-32 text-center text-gray-500">
                                        No upcoming installments.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                upcomingInstallments.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50 border-b border-gray-100">
                                        <TableCell className="text-blue-600 font-medium align-top">{index + 1}</TableCell>
                                        <TableCell className="text-gray-600 text-sm align-top">{item.courseName}</TableCell>
                                        <TableCell className="text-gray-800 text-sm font-medium align-top">{item.studentName}</TableCell>
                                        <TableCell className="text-gray-500 text-sm align-top">{item.rollNumber}</TableCell>
                                        <TableCell className="align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-gray-800">₹{item.amount}</span>
                                                <button className="bg-white border border-gray-300 text-gray-700 text-[10px] px-2 py-0.5 rounded-full w-fit hover:bg-gray-50">
                                                    ₹ Pay Now
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <div className="flex flex-col">
                                                <span className="text-gray-800 text-xs font-semibold">{item.dueDate}</span>
                                                {/* Logic for overdue warning could be added here */}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 text-sm align-top">₹{item.lateFee || 0}</TableCell>
                                        <TableCell className="align-top">
                                            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px]">{item.frequency || 'Monthly'}</span>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Button size="sm" className="bg-[#dc2626] hover:bg-red-700 text-white h-7 w-8 p-0 rounded-lg">
                                                <Bell size={14} />
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
    )
}






