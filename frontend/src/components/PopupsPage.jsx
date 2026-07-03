import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, RotateCcw, Trash2, X } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { addPopup, deletePopup } from '@/store/studentSlice';

export default function PopupsPage() {
    const popups = useSelector((state) => state.students.popups || []);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        targetType: '',
        status: 'Active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addPopup({ ...formData, image: selectedImage ? URL.createObjectURL(selectedImage) : null }));
        setIsModalOpen(false);
        setFormData({ title: '', link: '', targetType: '', status: 'Active' });
        setSelectedImage(null);
    };

    return (
        <div className="space-y-6 relative animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans border-b border-gray-100 pb-6 px-6">
                <h2 className="text-xl font-medium text-gray-800 tracking-tight">Manage Popups/Banners</h2>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#0f172a] hover:bg-[#1e293b] text-white gap-2 rounded-sm px-4 h-9 text-xs font-bold transition-all border-none uppercase tracking-wider"
                >
                    <Plus size={16} /> Add Popup
                </Button>
            </div>

            <div className="p-6">
                <div className="bg-white p-6 rounded-sm border border-gray-100 italic">
                    <div className="flex flex-col gap-4 font-sans">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search popups</label>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 relative w-full italic">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search size={16} />
                                </div>
                                <Input
                                    placeholder="Search by title..."
                                    className="pl-10 h-10 border-gray-200 rounded-sm text-sm italic"
                                />
                            </div>
                            <div className="w-48 font-sans">
                                <select className="w-full h-10 rounded-sm border border-gray-200 px-3 text-sm text-gray-500 bg-white outline-none italic">
                                    <option>All Status</option>
                                </select>
                            </div>
                            <Button className="bg-[#1e3a8a] text-white h-10 px-10 rounded-sm font-bold border-none transition-all uppercase tracking-wider text-xs shadow-md">
                                Search
                            </Button>
                            <Button
                                variant="outline"
                                className="border-[#c08457]/30 text-[#c08457] hover:bg-orange-50/30 h-10 px-10 rounded-sm font-bold bg-[#c08457]/10 uppercase tracking-wider text-xs font-sans"
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6">
                <div className="bg-white rounded-sm border border-gray-100 overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto font-sans">
                        <Table className="border-collapse">
                            <TableHeader>
                                <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-100">
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 w-16 text-center border-r border-gray-100">#</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Image</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Title</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Link</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Target</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Status</TableHead>
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 text-center px-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {popups.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-20 text-center border-b border-gray-100 italic">
                                            <p className="text-red-500 font-bold text-base">No Data Available</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    popups.map((item, index) => (
                                        <TableRow key={item.id} className="hover:bg-gray-50/50">
                                            <TableCell className="py-4 px-6 text-center font-medium text-gray-500 border-r border-gray-100 text-xs">{index + 1}</TableCell>
                                            <TableCell className="py-4 border-r border-gray-100">
                                                <div className="w-16 h-10 bg-gray-100 rounded-sm border border-gray-200 overflow-hidden mx-auto">
                                                    {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Preview</div>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 border-r border-gray-100 px-6 font-semibold text-gray-700 text-xs text-left">{item.title}</TableCell>
                                            <TableCell className="py-4 border-r border-gray-100 px-6">
                                                <div className="text-blue-500 underline text-[10px] truncate max-w-[150px]">{item.link || '---'}</div>
                                            </TableCell>
                                            <TableCell className="py-4 border-r border-gray-100 px-6 font-medium text-gray-500 text-[10px]">{item.targetType || 'All Users'}</TableCell>
                                            <TableCell className="py-4 border-r border-gray-100 px-6">
                                                <span className={`px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider ${item.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                                    {item.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 border-b border-gray-100">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="h-8 w-8 text-[#1e3a8a] border border-blue-100/30 rounded-sm flex items-center justify-center hover:bg-blue-50 transition-colors">
                                                        <Search size={14} />
                                                    </button>
                                                    <button onClick={() => dispatch(deletePopup(item.id))} className="h-8 w-8 text-red-500 border border-red-100/30 rounded-sm flex items-center justify-center hover:bg-red-50 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
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

            {/* Add New Popup Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 font-sans">
                    <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-[17px] font-medium text-gray-800">Add New Popup</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter Title"
                                    className="h-10 rounded-sm border-gray-200 text-sm focus:ring-1 focus:ring-[#1e463a]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-700">Image <span className="text-red-500">*</span></label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/30">
                                        <button type="button" className="px-3 py-1 bg-gray-100 border-r border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-200 h-full" onClick={() => document.getElementById('popup-image').click()}>Choose File</button>
                                        <span className="px-3 text-gray-400 text-xs truncate">
                                            {selectedImage ? selectedImage.name : "No file chosen"}
                                        </span>
                                        <input
                                            type="file"
                                            id="popup-image"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setSelectedImage(e.target.files[0])}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic font-medium">Max size: 2MB. Allowed: jpeg, png, jpg, gif, webp</p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-700">Link (Optional)</label>
                                <Input
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="https://example.com"
                                    className="h-10 rounded-sm border-gray-200 text-sm focus:ring-1 focus:ring-[#1e463a]"
                                />
                                <p className="text-[10px] text-gray-400 italic">If provided, clicking the popup will open this link in a new tab</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-700">Target Type <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    className="w-full h-10 rounded-sm border border-gray-200 px-3 text-sm text-gray-500 bg-white outline-none focus:ring-1 focus:ring-[#1e463a]"
                                    value={formData.targetType}
                                    onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                                >
                                    <option value="">Select Type</option>
                                    <option value="All Users">All Users</option>
                                    <option value="Registered Students">Registered Students</option>
                                    <option value="Enquiry Lead Only">Enquiry Lead Only</option>
                                </select>
                                <p className="text-[10px] text-gray-400 italic">Where should this popup appear?</p>
                            </div>

                            <div className="flex justify-center gap-4 pt-4">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-[#b9875a] hover:bg-[#a6764a] text-white border-none h-9 text-xs font-bold px-12 rounded-sm shadow-sm transition-all uppercase tracking-wider"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white h-9 text-xs font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                                >
                                    Add Popup
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}






