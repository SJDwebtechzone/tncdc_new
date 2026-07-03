import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, deleteJobFromServer, updateJobToServer } from '@/store/websiteSlice';
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Loader2, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function WebsiteJobsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { jobs, loading } = useSelector((state) => state.website);
    const [isDeleting, setIsDeleting] = useState(null);
    const [isToggling, setIsToggling] = useState(null);

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        setIsDeleting(id);
        try {
            await dispatch(deleteJobFromServer(id)).unwrap();
            toast.success("Job deleted successfully");
        } catch (error) {
            toast.error(error || "Failed to delete job");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleToggleStatus = async (job) => {
        setIsToggling(job.id);
        try {
            await dispatch(updateJobToServer({ id: job.id, data: { status: !job.status } })).unwrap();
            toast.success(`Job marked as ${!job.status ? 'Active' : 'Inactive'}`);
        } catch (error) {
            toast.error(error || "Failed to toggle status");
        } finally {
            setIsToggling(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans pb-10 pt-4">
            <div className="flex justify-between items-center px-6">
                <div>
                    <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-wider mb-1 mt-2">Job Postings</h2>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">Manage career opportunities on your website</p>
                </div>
                <Button 
                    onClick={() => navigate('/dashboard/website/jobs/add')}
                    className="bg-[#0f172a] hover:bg-[#1e293b] text-white h-9 px-4 rounded-sm text-[11px] font-bold uppercase tracking-widest shadow-sm"
                >
                    <Plus className="w-3.5 h-3.5 mr-2" /> Add New Job
                </Button>
            </div>

            <div className="px-6">
                <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50">Job Title</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50">Location & Type</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50 text-center">Status</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
                                            No jobs found. Add one to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-4 py-3 align-middle">
                                                <p className="text-sm font-bold text-gray-800">{job.title}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 align-middle">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                        <MapPin size={12} className="text-blue-500" />
                                                        {job.location}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                        <Briefcase size={12} className="text-purple-500" />
                                                        {job.jobType}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 align-middle text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(job)}
                                                    disabled={isToggling === job.id}
                                                    className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm border ${
                                                        job.status 
                                                            ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' 
                                                            : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                                                    } transition-colors ${isToggling === job.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {isToggling === job.id ? '...' : (job.status ? 'Active' : 'Inactive')}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 align-middle text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate('/dashboard/website/jobs/add', { state: { job } })}
                                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-sm"
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(job.id)}
                                                        disabled={isDeleting === job.id}
                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-sm"
                                                    >
                                                        {isDeleting === job.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
