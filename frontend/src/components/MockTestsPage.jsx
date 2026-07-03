import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FolderOpen } from "lucide-react";

export default function MockTestsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Mock Tests</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-700">Mock Tests</h2>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative w-full">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search size={16} />
                            </div>
                            <Input
                                placeholder="Search by student, course, semester, subject, or date"
                                className="pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl text-sm"
                            />
                        </div>
                        <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white h-11 px-10 rounded-xl font-bold transition-all shadow-md">
                            Search
                        </Button>
                        <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 h-11 px-10 rounded-xl font-bold">
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-100">
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 px-6">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5">Student Name</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5">Course Name</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5">Semester Name</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5">Subject Name</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5">Created At</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} className="py-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
                                        <div className="bg-red-50 p-6 rounded-3xl">
                                            <FolderOpen size={48} className="text-red-400" />
                                        </div>
                                        <p className="font-bold text-gray-400 italic">No Data Available</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}






