import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addJobToServer, updateJobToServer } from '@/store/websiteSlice';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function WebsiteAddJobPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const editingJob = location.state?.job;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        jobType: 'Full-time',
        description: '',
        requirements: [''],
        responsibilities: [''],
        salaryRange: ''
    });

    useEffect(() => {
        if (editingJob) {
            setFormData({
                title: editingJob.title || '',
                location: editingJob.location || '',
                jobType: editingJob.jobType || 'Full-time',
                description: editingJob.description || '',
                requirements: editingJob.requirements?.length ? editingJob.requirements : [''],
                responsibilities: editingJob.responsibilities?.length ? editingJob.responsibilities : [''],
                salaryRange: editingJob.salaryRange || ''
            });
        }
    }, [editingJob]);

    const handleDynamicFieldChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addDynamicField = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeDynamicField = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.location || !formData.description) {
            return toast.error("Title, location, and description are required");
        }

        setIsSubmitting(true);
        
        // Clean up empty arrays
        const cleanData = {
            ...formData,
            requirements: formData.requirements.filter(r => r.trim() !== ''),
            responsibilities: formData.responsibilities.filter(r => r.trim() !== '')
        };

        try {
            if (editingJob) {
                await dispatch(updateJobToServer({ id: editingJob.id, data: cleanData })).unwrap();
                toast.success("Job updated successfully");
            } else {
                await dispatch(addJobToServer(cleanData)).unwrap();
                toast.success("Job created successfully");
            }
            navigate('/dashboard/website/jobs');
        } catch (error) {
            toast.error(error || "Failed to save job");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 font-sans pb-10 pt-4">
            <div className="px-6">
                <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-8 space-y-8">
                    <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-wider mb-8">
                        {editingJob ? 'Edit Job' : 'Add New Job'}
                    </h2>

                    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Job Title <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Senior Software Engineer"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    required
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. Remote, Chennai, IT Park"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Job Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full h-10 px-3 rounded-sm border border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] bg-white"
                                    value={formData.jobType}
                                    onChange={e => setFormData({ ...formData, jobType: e.target.value })}
                                    required
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Salary Range
                                </label>
                                <Input
                                    value={formData.salaryRange}
                                    onChange={e => setFormData({ ...formData, salaryRange: e.target.value })}
                                    placeholder="e.g. ₹5,00,000 - ₹8,00,000 P.A."
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <div className="rounded-sm border border-gray-200 overflow-hidden">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={(content) => setFormData({ ...formData, description: content })}
                                    style={{ height: '200px', marginBottom: '40px' }}
                                    placeholder="Brief overview of the role..."
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-gray-100">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Responsibilities
                            </label>
                            {formData.responsibilities.map((resp, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={resp}
                                        onChange={e => handleDynamicFieldChange('responsibilities', index, e.target.value)}
                                        placeholder="Add a responsibility..."
                                        className="h-9 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                    />
                                    {formData.responsibilities.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => removeDynamicField('responsibilities', index)}
                                            className="h-9 w-9 p-0 rounded-sm"
                                        >
                                            X
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => addDynamicField('responsibilities')}
                                className="h-8 px-4 rounded-sm text-[10px] font-bold uppercase tracking-widest border-gray-200"
                            >
                                + Add Responsibility
                            </Button>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-gray-100">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Requirements / Qualifications
                            </label>
                            {formData.requirements.map((req, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={req}
                                        onChange={e => handleDynamicFieldChange('requirements', index, e.target.value)}
                                        placeholder="Add a requirement..."
                                        className="h-9 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                    />
                                    {formData.requirements.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => removeDynamicField('requirements', index)}
                                            className="h-9 w-9 p-0 rounded-sm"
                                        >
                                            X
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => addDynamicField('requirements')}
                                className="h-8 px-4 rounded-sm text-[10px] font-bold uppercase tracking-widest border-gray-200"
                            >
                                + Add Requirement
                            </Button>
                        </div>

                        <div className="pt-8 border-t border-gray-50 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/dashboard/website/jobs')}
                                className="h-10 px-8 rounded-sm text-xs font-bold uppercase tracking-widest text-gray-600 border-gray-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-10 px-8 rounded-sm bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold uppercase tracking-widest transition-all"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                ) : (
                                    editingJob ? 'Update Job' : 'Publish Job'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
