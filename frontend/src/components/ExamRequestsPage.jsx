import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

export default function ExamRequestsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Exam Requests</h1>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={16} />
                        </div>
                        <Input
                            placeholder="Search..."
                            className="pl-10 h-10 bg-gray-50/50 border-gray-200 rounded-lg text-sm"
                        />
                    </div>
                    <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white h-10 px-8 rounded-lg font-medium min-w-[120px]">
                        Submit
                    </Button>
                    <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 h-10 px-8 rounded-lg font-medium min-w-[120px]">
                        Reset
                    </Button>
                    <Button className="bg-[#64748b] hover:bg-[#475569] text-white h-10 px-4 rounded-lg text-xs font-bold uppercase transition-all">
                        Complete Selected
                    </Button>
                    <Button className="bg-[#ef4444] hover:bg-[#dc2626] text-white h-10 px-4 rounded-lg text-xs font-bold uppercase transition-all">
                        Cancel Selected
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-200">
                                <TableHead className="w-12 py-4 px-4">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                </TableHead>
                                <TableHead className="font-bold text-[#475569] text-[11px] uppercase py-4">#</TableHead>
                                <TableHead className="font-bold text-[#475569] text-[11px] uppercase py-4">Student Details</TableHead>
                                <TableHead className="font-bold text-[#475569] text-[11px] uppercase py-4">Student Profile</TableHead>
                                <TableHead className="font-bold text-[#475569] text-[11px] uppercase py-4">Course Name</TableHead>
                                <TableHead className="font-bold text-[#475569] text-[11px] uppercase py-4">Semester Name</TableHead>
                                <TableHead className="font-bold text-[#475569] text-[11px] uppercase py-4">Subject Name</TableHead>
                                <TableHead className="font-bold text-[#475569] text-[11px] uppercase py-4">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={8} className="py-20 text-center">
                                    <p className="text-red-500 font-bold italic text-base">No Data Available</p>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}






