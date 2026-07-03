import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RotateCcw, ArrowLeft, Clock } from "lucide-react";

export default function StaffLecturesPage() {
    const [view, setView] = useState('list');

    if (view === 'add') {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-8 border-b pb-4">
                        <h2 className="text-xl font-medium text-gray-800 tracking-tight">Add Lecture Record</h2>
                        <Button
                            variant="outline"
                            onClick={() => setView('list')}
                            className="h-8 text-[11px] font-medium text-white border-none bg-[#b9875a] hover:bg-[#a6764a] rounded-sm flex items-center gap-1.5 px-4 uppercase tracking-wider"
                        >
                            <ArrowLeft size={14} className="mr-1" /> Back to List
                        </Button>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {/* Staff Selection */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                                    Select Staff <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-400 font-sans">
                                    <option>Select Staff Member</option>
                                </select>
                            </div>

                            {/* Lecture Date */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                                    Lecture Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        defaultValue="2026-02-05"
                                        className="h-10 rounded-sm border-gray-200 bg-white text-xs focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Subject</label>
                                <Input
                                    placeholder="e.g., Mathematics, Physics"
                                    className="h-10 rounded-sm border-gray-200 bg-white text-xs focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            {/* Batch/Class */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Batch/Class</label>
                                <Input
                                    placeholder="e.g., Grade 10-A, Batch 2024"
                                    className="h-10 rounded-sm border-gray-200 bg-white text-xs focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            {/* Start Time */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Start Time</label>
                                <div className="relative">
                                    <Input
                                        type="time"
                                        className="h-10 rounded-sm border-gray-200 bg-white text-xs focus:ring-1 focus:ring-blue-500 pr-10"
                                    />
                                    <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* End Time */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">End Time</label>
                                <div className="relative">
                                    <Input
                                        type="time"
                                        className="h-10 rounded-sm border-gray-200 bg-white text-xs focus:ring-1 focus:ring-blue-500 pr-10"
                                    />
                                    <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 italic">Duration will be calculated automatically</p>
                            </div>

                            {/* Lecture Type */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Lecture Type</label>
                                <select className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-700 font-sans">
                                    <option>Regular Lecture</option>
                                    <option>Extra Class</option>
                                    <option>Practical Session</option>
                                    <option>Seminar/Guest Lecture</option>
                                </select>
                                <p className="text-[10px] text-gray-400 mt-1 italic">Extra lectures are counted separately for hybrid salary mode</p>
                            </div>

                            {/* Remarks */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Remarks</label>
                                <textarea
                                    placeholder="Optional remarks or notes"
                                    className="w-full h-20 rounded-sm border border-gray-200 p-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white resize-none font-sans"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-6 border-t font-sans">
                            <Button
                                type="submit"
                                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-8 h-10 rounded-sm text-[11px] font-bold flex items-center gap-2 shadow-sm border-none uppercase tracking-wide"
                            >
                                <Plus size={16} />
                                Add Lecture
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setView('list')}
                                className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-8 h-10 rounded-sm text-[11px] font-bold border-none transition-colors uppercase tracking-wide flex items-center gap-2"
                            >
                                <span className="text-sm">×</span> Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 font-sans tracking-tight">Staff Lecture Records</h1>
                <Button
                    onClick={() => setView('add')}
                    className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-2 rounded-lg flex items-center gap-2 border-none transition-all transform active:scale-95 shadow-lg"
                >
                    <Plus size={18} />
                    Add Lecture
                </Button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-3">
                        <select className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50">
                            <option>All Staff</option>
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <select className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50">
                            <option>February</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <select className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50">
                            <option>2026</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <Button className="w-full bg-white hover:bg-gray-50 text-blue-900 border border-blue-900 h-11 rounded-xl font-bold">
                            Filter
                        </Button>
                    </div>
                    <div className="md:col-span-2">
                        <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 bg-[#e4a873]/10 h-11 rounded-xl flex items-center gap-2">
                            <RotateCcw size={18} />
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-200">
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5 px-6">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Staff Name</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Lecture Date</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Subject</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Batch</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Time</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Duration</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Type</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Locked</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={9} className="py-20 text-center text-gray-400 font-medium">
                                    No lecture records found
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}






