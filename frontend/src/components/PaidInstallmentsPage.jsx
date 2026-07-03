import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, RotateCw, Wallet, FolderOpen, Loader2, FileText } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchPaidInstallments } from '@/store/feeSlice';
import { generateInvoice } from '@/utils/invoiceGenerator';

export default function PaidInstallmentsPage() {
    const dispatch = useDispatch();
    const { paidInstallments, loading } = useSelector((state) => state.fees);

    useEffect(() => {
        dispatch(fetchPaidInstallments());
    }, [dispatch]);

    // Calculate total paid amount
    const totalPaid = paidInstallments.reduce((sum, item) => sum + (Number(item.paidAmount) || 0), 0);

    if (loading && paidInstallments.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-green-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-medium text-gray-800">Paid Installments</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Actions */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    {/* Summary Card style */}
                    <div className="flex items-center gap-4 bg-white border border-[#10b981] p-3 rounded-xl shadow-sm min-w-[300px] relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10b981]"></div>
                        <div className="w-10 h-10 bg-[#ecfdf5] text-[#10b981] rounded-lg flex items-center justify-center">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-semibold">Total Paid Amount</div>
                            <div className="text-lg font-bold text-[#10b981]">₹{totalPaid.toLocaleString()}</div>
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
                            <span className="mr-2">📅</span> All Dates
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
                <div className="overflow-x-auto min-h-[400px]">
                    <Table>
                        <TableHeader className="bg-gray-100/50">
                            <TableRow>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase whitespace-nowrap">Inst No.</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase whitespace-nowrap">Student Name</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase whitespace-nowrap">Roll Number</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase whitespace-nowrap">Course Name</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase whitespace-nowrap">Amount</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase whitespace-nowrap">Paid Date</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase whitespace-nowrap">Method</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase whitespace-nowrap">Status</TableHead>
                                <TableHead className="font-bold text-gray-700 text-xs uppercase whitespace-nowrap">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paidInstallments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <FolderOpen size={48} className="mb-4 text-gray-300" />
                                            <p className="text-sm font-medium">No Paid Installments Found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paidInstallments.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50 border-b border-gray-100">
                                        <TableCell className="text-gray-500 font-medium">{item.installmentNo}</TableCell>
                                        <TableCell className="text-gray-800 text-sm font-medium">{item.studentName}</TableCell>
                                        <TableCell className="text-gray-500 text-sm">{item.rollNumber}</TableCell>
                                        <TableCell className="text-gray-600 text-sm">{item.courseName}</TableCell>
                                        <TableCell className="font-bold text-green-600">₹{item.paidAmount}</TableCell>
                                        <TableCell className="text-gray-700 text-xs font-semibold">{item.paidDate}</TableCell>
                                        <TableCell>
                                            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{item.paymentMethod}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Paid</span>
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-7 text-[10px] gap-1 border-gray-200"
                                                onClick={() => generateInvoice(item)}
                                            >
                                                <FileText size={12} /> Invoice
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






