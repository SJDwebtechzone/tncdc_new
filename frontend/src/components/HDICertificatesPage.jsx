import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Upload, Trash2, History, Database, ArrowLeft, X, FileSpreadsheet, CheckCircle2 } from "lucide-react";

export default function HDICertificatesPage() {
    const [view, setView] = useState('list');
    const [selectedFile, setSelectedFile] = useState("");
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file.name);
        }
    };

    if (view === 'import') {
        return (
            <div className="space-y-6 animate-in fade-in duration-500 font-sans">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-[20px] font-bold text-gray-800 tracking-tight">Import HDI Certificate Marksheets</h1>
                    <div className="flex items-center gap-3">
                        <Button
                            className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-5 h-9 rounded-sm flex items-center gap-2 border-none transition-all shadow-md text-[11px] font-bold uppercase tracking-wider"
                        >
                            <History size={16} />
                            Import History
                        </Button>
                        <Button
                            onClick={() => setView('list')}
                            variant="ghost"
                            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 h-9 px-0 border-none bg-transparent hover:bg-transparent text-[11px] font-bold"
                        >
                            <Plus size={16} className="rotate-45" />
                            Back to HDI Certificate Marksheets
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Import Area */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-[#f8fafc] border-2 border-dashed border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center gap-6 group hover:border-[#1e3a8a] transition-all">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                    <Upload size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-gray-700">Choose Excel File to Import</h3>
                                    <p className="text-[10px] text-gray-400 font-medium">Maximum file size: 10MB</p>
                                </div>

                                <div className="w-full max-w-md">
                                    <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden h-10 bg-white shadow-sm focus-within:ring-1 focus-within:ring-[#1e3a8a] transition-all">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept=".xlsx, .xls, .csv"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-gray-100 h-full px-5 text-[11px] font-bold border-r border-gray-200 text-gray-600 hover:bg-gray-200 transition-colors uppercase tracking-widest whitespace-nowrap"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-4 text-[11px] text-gray-400 truncate flex-1 italic">
                                            {selectedFile || "No file chosen"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                <Button className="w-full sm:w-auto bg-white hover:bg-blue-50 text-[#1e3a8a] border border-[#dcf0fb] h-10 px-8 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-sm">
                                    <Download size={16} className="mr-2" />
                                    Download Sample Template
                                </Button>
                                <Button className="w-full sm:w-auto bg-[#1e3a8a] hover:bg-[#152e6e] text-white h-10 px-8 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-md flex items-center gap-2 border-none">
                                    <Upload size={16} />
                                    Import HDI Certificate Marksheets
                                </Button>
                            </div>
                        </div>

                        {/* Sidebar Info Area */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-[#f8fafc] rounded-lg p-8 border border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-1.5 h-6 bg-[#1e3a8a] rounded-full"></div>
                                    <h3 className="text-[13px] font-extrabold text-gray-700 uppercase tracking-wider">Required Fields</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        'student_id',
                                        'student_name',
                                        'course_name',
                                        'grade',
                                        'percentage',
                                        'institute_name',
                                        'course_duration',
                                        'course_period',
                                        'certificate_number',
                                        'date_of_issue'
                                    ].map((field) => (
                                        <li key={field} className="flex items-center gap-3 text-xs font-bold text-gray-500 hover:text-green-600 transition-colors cursor-default">
                                            <CheckCircle2 size={14} className="text-green-500" />
                                            {field}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-[#5c6066] rounded-sm p-6 text-white shadow-lg relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-2 opacity-5 group-hover:scale-110 transition-transform">
                                    <Database size={80} />
                                </div>
                                <p className="text-[11px] font-medium leading-relaxed italic opacity-90 relative z-10">
                                    Note: The import will be processed in the background. You can check the progress in the Import History page.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight uppercase">Manage HDI Certificates</h1>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setView('import')}
                        className="bg-[#1e3a8a] hover:bg-[#152e6e] text-white flex items-center gap-2 h-10 px-6 rounded-sm border-none transition-all active:scale-95 shadow-md text-xs font-bold uppercase tracking-widest"
                    >
                        <Upload size={18} />
                        Import
                    </Button>
                    <Button className="bg-[#b9875a] hover:bg-[#a6764a] text-white flex items-center gap-2 h-10 px-6 rounded-sm border-none transition-all active:scale-95 shadow-md text-xs font-bold uppercase tracking-widest">
                        <History size={18} />
                        Import History
                    </Button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 border-r pr-2 border-gray-200">
                            <Search size={16} />
                        </div>
                        <Input
                            placeholder="Search by student name, certificate number, course..."
                            className="pl-12 h-11 bg-gray-50/50 border-gray-200 rounded-sm text-sm focus:bg-white transition-all shadow-inner"
                        />
                    </div>
                    <Button className="bg-[#1e3a8a] hover:bg-[#1a365d] text-white h-11 px-8 rounded-sm font-bold flex items-center gap-2 border-none shadow-md transition-all active:scale-95 uppercase tracking-widest text-xs">
                        <Search size={18} />
                        Search
                    </Button>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none bg-[#ef4444] hover:bg-[#dc2626] text-white h-11 px-6 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none transition-all active:scale-95 shadow-sm">
                            Delete Selected
                        </Button>
                        <Button className="flex-1 md:flex-none bg-[#d97706] hover:bg-[#b45309] text-white h-11 px-6 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none transition-all active:scale-95 shadow-sm">
                            Delete All
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-200">
                                <TableHead className="w-12 py-5 px-6 border-r border-gray-100">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#1e3a8a] cursor-pointer" />
                                </TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">#</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Student Image</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 text-center">Student Signature</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Student Name</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Course</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Certificate No.</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Date of Issue</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 text-center tracking-wider">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={9} className="py-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
                                        <div className="bg-gray-50 p-6 rounded-3xl">
                                            <Database size={48} className="text-gray-300" />
                                        </div>
                                        <p className="font-bold text-[11px] uppercase tracking-widest text-[#1e3a8a] italic">No records found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div className="p-5 bg-gray-50/30 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Showing 0 to 0 of 0 records</p>
                </div>
            </div>
        </div>
    );
}

// Simple dummy icon for the Back button because Plus rotated by 45 is basically X
function Plus({ size, className }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}






