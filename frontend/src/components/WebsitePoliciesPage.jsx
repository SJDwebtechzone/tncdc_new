import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Edit2, X, Check } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { updatePolicy } from '@/store/websiteSlice';

export default function WebsitePoliciesPage() {
    const policies = useSelector((state) => state.website.policies || []);
    const dispatch = useDispatch();

    const [editingPolicy, setEditingPolicy] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '' });

    const handleEdit = (policy) => {
        setEditingPolicy(policy);
        setFormData({ title: policy.title, content: policy.content });
    };

    const handleSave = (e) => {
        e.preventDefault();
        dispatch(updatePolicy({ ...editingPolicy, ...formData }));
        setEditingPolicy(null);
        alert(`${formData.title} updated successfully!`);
    };

    return (
        <div className="space-y-2 font-sans relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 px-6">
                <h2 className="text-xl font-medium text-gray-800 tracking-tight">Website Policies Management</h2>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {policies.length === 0 ? (
                        <div className="col-span-full py-20 bg-white rounded-sm border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 font-sans italic">
                            <FileText size={48} className="mb-2 opacity-20" />
                            <p className="font-bold">No policies found</p>
                        </div>
                    ) : (
                        policies.map((policy) => (
                            <div key={policy.id} className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow group">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="bg-blue-50 p-2.5 rounded-sm group-hover:scale-105 transition-transform duration-300">
                                            <FileText className="text-blue-600" size={24} />
                                        </div>
                                        <button
                                            onClick={() => handleEdit(policy)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-sm"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-[17px] font-bold text-gray-800 tracking-tight">{policy.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-4 leading-relaxed italic">
                                            {policy.content}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Updated: {policy.updatedAt || 'Recently'}</span>
                                    <Button
                                        onClick={() => handleEdit(policy)}
                                        variant="link"
                                        className="text-blue-600 font-bold text-[11px] p-0 h-auto hover:no-underline uppercase tracking-wider"
                                    >
                                        Modify Content
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editingPolicy && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 font-sans">
                    <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h2 className="text-[17px] font-medium text-gray-800 flex items-center gap-2">
                                <Edit2 size={18} className="text-blue-600" />
                                Edit {formData.title}
                            </h2>
                            <button onClick={() => setEditingPolicy(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-700">Policy Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="h-10 rounded-sm border-gray-200 text-sm focus:ring-1 focus:ring-[#1e463a]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-700">Policy Content</label>
                                <Textarea
                                    required
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="min-h-[300px] rounded-sm border-gray-200 leading-relaxed p-4 text-sm focus:ring-1 focus:ring-[#1e463a]"
                                    placeholder="Enter full policy content here..."
                                />
                            </div>
                            <div className="flex justify-center gap-4 pt-4 border-t border-gray-100 -mx-6 px-6 mt-6">
                                <Button
                                    type="button"
                                    onClick={() => setEditingPolicy(null)}
                                    className="bg-[#b9875a] hover:bg-[#a6764a] text-white border-none h-9 text-xs font-bold px-12 rounded-sm shadow-sm transition-all uppercase tracking-wider"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white h-9 text-xs font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider flex items-center gap-2"
                                >
                                    <Check size={14} />
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}






