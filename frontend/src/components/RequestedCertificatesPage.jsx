import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Clock, Box, RefreshCcw, UserCheck, AlertCircle } from "lucide-react";
import axios from 'axios';
import { BASE_URL } from '@/config';
import toast from 'react-hot-toast';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

export default function RequestedCertificatesPage() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/certificates`);
            // Only show requested/pending ones
            setRequests(res.data.filter(c => c.status === 'Requested'));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load requested certificates");
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        return requests.filter(req => 
            req.admission?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.admission?.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.admission?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.admission?.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [requests, searchTerm]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Requested Certificates</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium italic tracking-tight">Pending certificate applications awaiting administrative review</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchData} className="h-10 px-4 rounded-xl text-gray-500 font-bold hover:bg-gray-50 border-gray-100 uppercase text-xs gap-2">
                        <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Sync
                    </Button>
                    <Button 
                        onClick={() => navigate('/dashboard/certificates/apply')}
                        className="bg-[#4f46e5] hover:bg-[#4338ca] text-white flex items-center gap-2 h-10 px-6 rounded-xl shadow-lg shadow-indigo-100 font-bold text-xs uppercase"
                    >
                        <UserCheck size={16} /> Process Applications
                    </Button>
                </div>
            </div>

            {/* Search Hub */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <Input
                            placeholder="Search pending requests by student name, ID or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 bg-gray-50/10 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 rounded-xl text-sm transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#fffbeb] border border-amber-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm shadow-amber-50/50">
                <div className="flex items-start gap-4">
                    <div className="bg-amber-500 p-2 rounded-xl text-white shadow-lg shadow-amber-100">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-900 leading-tight">Verification Required</p>
                        <p className="text-xs text-gray-500 font-bold mt-1 max-w-md">
                            These certificates have been requested by students or automated systems. Please verify their marks and eligibility before approval.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-amber-600 bg-white px-4 py-2 rounded-xl border border-amber-50 shadow-sm">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-wider">{filteredData.length} Pending Requests</span>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/40 border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-200/50">
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6 px-8 w-12 text-center">#</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Status</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Student details</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Course / Semester</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Franchise</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Requested At</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6 text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((req, idx) => (
                                    <TableRow key={req.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50 last:border-0">
                                        <TableCell className="py-6 px-8 text-[11px] font-bold text-gray-400 text-center">
                                            {String(idx + 1).padStart(2, '0')}
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <Badge className="bg-orange-100 text-orange-600 font-black text-[9px] uppercase tracking-wider border-0 flex items-center gap-1.5 w-fit">
                                                <div className="w-1 h-1 rounded-full bg-orange-600 animate-pulse" />
                                                Pending
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 font-black text-xs">
                                                    {req.admission?.firstName?.[0]}{req.admission?.surname?.[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-800 text-sm leading-tight">{req.admission?.firstName} {req.admission?.surname}</span>
                                                    <span className="text-[10px] font-semibold text-gray-400 mt-0.5">ID: {req.admission?.studentId}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-700">{req.admission?.courseName}</span>
                                                <span className="text-[10px] font-bold text-orange-500 mt-0.5 uppercase tracking-wider">{req.examResult?.semesterName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <span className="text-xs font-bold text-gray-500 line-clamp-1 max-w-[150px]">Tamil Nadu career development council</span>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <span className="text-[11px] font-bold text-gray-500">
                                                {new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-6 text-center">
                                            <Button 
                                                onClick={() => navigate('/dashboard/certificates/apply')}
                                                variant="outline" 
                                                className="h-9 px-4 rounded-xl text-indigo-600 border-indigo-100 hover:bg-indigo-50 font-black text-[10px] uppercase shadow-sm"
                                            >
                                                Verfiy & Approve
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-32 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-700">
                                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                                                <Box size={40} className="text-slate-200" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-xl text-gray-300">No pending requests</p>
                                                <p className="text-sm text-gray-400 font-medium italic">Everything is up to date! Great job.</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}







