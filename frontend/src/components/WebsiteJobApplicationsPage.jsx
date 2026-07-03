import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RotateCcw, Filter, ClipboardList, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobApplications, updateJobApplicationStatusToServer } from '@/store/websiteSlice';
import toast from 'react-hot-toast';

export default function WebsiteJobApplicationsPage() {
    const dispatch = useDispatch();
    const { jobApplications, loading } = useSelector((state) => state.website);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        dispatch(fetchJobApplications());
    }, [dispatch]);

    const handleUpdateStatus = async (id, status) => {
        setUpdatingId(id);
        try {
            await dispatch(updateJobApplicationStatusToServer({ id, status })).unwrap();
            toast.success(`Application marked as ${status}`);
        } catch (error) {
            toast.error(error || "Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleReset = () => {
        setSearchTerm('');
        setStatusFilter('All');
    };

    const filteredApplications = (jobApplications || []).filter(app => {
        const matchesSearch = 
            app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.mobile?.includes(searchTerm) ||
            app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const apps = jobApplications || [];
    
    const stats = [
        { label: "Total Applications", count: apps.length, color: "bg-[#6366f1]" },
        { label: "Pending", count: apps.filter(a => !a.status || a.status === "Pending").length, color: "bg-[#8b5cf6]" },
        { label: "Shortlisted", count: apps.filter(a => a.status === 'Shortlisted').length, color: "bg-[#5b4fcbe6]" },
        { label: "Interviewed", count: apps.filter(a => a.status === 'Interviewed').length, color: "bg-[#4f46e5]" },
        { label: "Selected", count: apps.filter(a => a.status === 'Selected').length, color: "bg-[#4338ca]" },
        { label: "Rejected", count: apps.filter(a => a.status === 'Rejected').length, color: "bg-[#3730a3]" },
    ];

    return (
        <div className="space-y-6 font-sans relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 px-6">
                <h2 className="text-xl font-medium text-gray-800 tracking-tight">Job Applications Management</h2>
            </div>

            <div className="p-6 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className={`${stat.color} rounded-sm shadow-sm overflow-hidden relative h-24 transform hover:translate-y-[-2px] transition-all cursor-default group`}>
                            <div className="p-4 flex flex-col justify-center items-center h-full text-white text-center relative z-10">
                                <span className="text-2xl font-black mb-1 leading-none">{stat.count}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{stat.label}</span>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10 text-white group-hover:scale-110 transition-transform duration-500">
                                <ClipboardList size={70} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/10">
                        <h2 className="text-[14px] font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wider">
                            <Filter size={18} className="text-blue-600" />
                            Search & Filters
                        </h2>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Filters */}
                        <div className="flex flex-col lg:flex-row gap-4 items-end">
                            <div className="w-full lg:w-48 space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                                <select 
                                    className="w-full h-10 bg-white border border-gray-200 rounded-sm px-4 text-sm font-medium text-gray-700 appearance-none cursor-pointer focus:ring-1 focus:ring-[#1e463a] outline-none"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Shortlisted">Shortlisted</option>
                                    <option value="Interviewed">Interviewed</option>
                                    <option value="Selected">Selected</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search Keywords</label>
                                <div className="relative italic">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Search size={16} />
                                    </div>
                                    <Input
                                        placeholder="Name, email, mobile or job title..."
                                        className="h-10 border-gray-200 rounded-sm text-sm pl-10 focus:ring-1 focus:ring-[#1e463a]"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button 
                                    onClick={handleReset}
                                    variant="outline"
                                    className="border-[#c08457]/30 text-[#c08457] hover:bg-orange-50/30 h-10 px-8 rounded-sm font-bold bg-[#c08457]/10 flex items-center gap-2 uppercase tracking-wider text-xs"
                                >
                                    <RotateCcw size={14} />
                                    Reset
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-sm border border-gray-100 overflow-hidden min-h-[400px]">
                            <div className="overflow-x-auto">
                                <Table className="border-collapse">
                                    <TableHeader>
                                        <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-100">
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 w-16 text-center border-r border-gray-100">#</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Applicant</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Contact Info</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Job Applied</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Experience/Skills</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6 text-center">Status</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 text-center px-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="py-16 text-center">
                                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredApplications.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="py-32 text-center border-b border-gray-100">
                                                    <div className="flex flex-col items-center justify-center gap-4 text-gray-300">
                                                        <div className="bg-gray-50 p-8 rounded-full border border-gray-100/50">
                                                            <ClipboardList size={48} className="text-gray-200" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-red-500 italic text-base">No job applications found</p>
                                                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Adjust your filters and try again</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredApplications.map((app, index) => (
                                                <TableRow key={app.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                                                    <TableCell className="text-center font-bold text-gray-500 text-xs border-r border-gray-100">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="px-6 border-r border-gray-100">
                                                        <p className="font-bold text-gray-800 text-sm">{app.fullName}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 block">
                                                            {new Date(app.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell className="px-6 border-r border-gray-100 text-xs space-y-1">
                                                        <p><a href={`mailto:${app.email}`} className="text-blue-600 hover:underline">{app.email}</a></p>
                                                        <p><a href={`tel:${app.mobile}`} className="text-gray-600">{app.mobile}</a></p>
                                                    </TableCell>
                                                    <TableCell className="px-6 border-r border-gray-100">
                                                        <p className="font-bold text-gray-700 text-sm">{app.job?.title || 'Unknown Job'}</p>
                                                    </TableCell>
                                                    <TableCell className="px-6 border-r border-gray-100 text-xs text-gray-600">
                                                        <p><span className="font-bold text-gray-800 block">Exp:</span> {app.experience || 'N/A'}</p>
                                                        <div className="mt-1 line-clamp-2" title={app.skills}><span className="font-bold text-gray-800">Skills:</span> {app.skills || 'N/A'}</div>
                                                    </TableCell>
                                                    <TableCell className="px-6 border-r border-gray-100 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                                            app.status === 'Selected' ? 'bg-green-100 text-green-700' :
                                                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                            app.status === 'Shortlisted' ? 'bg-purple-100 text-purple-700' :
                                                            app.status === 'Interviewed' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {app.status || 'Pending'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-6 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <select 
                                                                value={app.status || 'Pending'}
                                                                onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                                                disabled={updatingId === app.id}
                                                                className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Shortlisted">Shortlisted</option>
                                                                <option value="Interviewed">Interviewed</option>
                                                                <option value="Selected">Selected</option>
                                                                <option value="Rejected">Rejected</option>
                                                            </select>
                                                            {updatingId === app.id && <Loader2 className="w-4 h-4 animate-spin text-blue-500 self-center" />}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
