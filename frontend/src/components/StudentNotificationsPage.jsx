import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, RotateCcw, Trash2, X } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { addNotification, deleteNotification } from '@/store/studentSlice';

import { Edit } from "lucide-react";

export default function StudentNotificationsPage() {
    const notifications = useSelector((state) => state.students.notifications || []);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        status: 'Active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addNotification({
            ...formData,
            image: selectedImage ? URL.createObjectURL(selectedImage) : null,
            created: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        }));
        setIsModalOpen(false);
        setFormData({ title: '', description: '', link: '', status: 'Active' });
        setSelectedImage(null);
    };

    return (
        <div className="space-y-6 relative animate-in fade-in duration-500">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Manage Student Notifications</h1>

            {/* Filters Row */}
            <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-1 gap-4 items-center">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <Input className="pl-9 h-10 w-full rounded-sm bg-gray-50/50 border-gray-200 text-sm" placeholder="Search by title or description..." />
                    </div>
                    <div className="w-48">
                        <select className="w-full h-10 rounded-sm border border-gray-200 px-3 text-sm text-gray-500 bg-white outline-none focus:ring-1 focus:ring-blue-900 transition-all">
                            <option>All Status</option>
                        </select>
                    </div>
                    <Button variant="outline" className="h-10 px-8 border-[#1e3a8a] text-[#1e3a8a] font-medium hover:bg-blue-50 rounded-sm transition-all">
                        Search
                    </Button>
                    <Button variant="outline" className="h-10 px-8 border-[#b9875a] text-[#b9875a] font-medium hover:bg-orange-50 rounded-sm transition-all">
                        Reset
                    </Button>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-[#1e3a8a] text-white gap-2 h-10 px-4 rounded-sm hover:bg-blue-900 transition-all active:scale-95 shadow-md font-bold text-[11px] uppercase tracking-widest">
                    <Plus size={16} /> Add Notification
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                <Table>
                    <TableHeader className="bg-gray-50/50 border-b">
                        <TableRow>
                            <TableHead className="w-[60px] font-bold text-gray-800 text-xs uppercase text-center">#</TableHead>
                            <TableHead className="font-bold text-gray-800 text-xs uppercase min-w-[120px]">Image</TableHead>
                            <TableHead className="font-bold text-gray-800 text-xs uppercase min-w-[200px]">Title</TableHead>
                            <TableHead className="font-bold text-gray-800 text-xs uppercase">Link</TableHead>
                            <TableHead className="font-bold text-gray-800 text-xs uppercase">Status</TableHead>
                            <TableHead className="font-bold text-gray-800 text-xs uppercase">Created At</TableHead>
                            <TableHead className="font-bold text-gray-800 text-xs uppercase text-center w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {notifications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-gray-400 italic text-sm">
                                    No notifications found in the database.
                                </TableCell>
                            </TableRow>
                        ) : (
                            notifications.map((item, index) => (
                                <TableRow key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <TableCell className="text-center font-bold text-gray-500">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="w-16 h-10 bg-gray-100 rounded-sm border overflow-hidden flex items-center justify-center">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter text-center leading-tight px-1">No Image</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-[#1e3a8a]">{item.title}</TableCell>
                                    <TableCell className="text-blue-500 underline text-xs">{item.link || '---'}</TableCell>
                                    <TableCell>
                                        <span className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${item.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium text-gray-600">{item.created || '---'}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#1e3a8a] bg-blue-50 hover:bg-blue-100"><Edit size={14} /></Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 bg-red-50 hover:bg-red-100"
                                                onClick={() => dispatch(deleteNotification(item.id))}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add New Notification Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold text-gray-800">Add New Notification</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Title Field */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Title <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    className="h-10 rounded-sm border-gray-200 focus:ring-1 focus:ring-blue-900 transition-all font-medium text-sm"
                                    placeholder="Enter notification title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Description Field */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    className="w-full h-32 rounded-sm border border-gray-200 p-4 font-medium text-sm focus:ring-1 focus:ring-blue-900 outline-none transition-all resize-none shadow-sm"
                                    placeholder="Enter notification description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Link Field */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Link (Optional)</label>
                                <Input
                                    className="h-10 rounded-sm border-gray-200 focus:ring-1 focus:ring-blue-900 transition-all font-medium text-sm"
                                    placeholder="https://example.com"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>

                            {/* Image Field */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Image (Optional)</label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 border border-gray-200 rounded-sm p-1 pr-3 h-10">
                                        <input
                                            type="file"
                                            id="notification-image"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setSelectedImage(e.target.files[0])}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-8 text-[11px] font-bold px-4 rounded-sm bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700"
                                            onClick={() => document.getElementById('notification-image').click()}
                                        >
                                            Choose File
                                        </Button>
                                        <span className="text-[11px] text-gray-500 font-medium truncate flex-1">
                                            {selectedImage ? selectedImage.name : "No file chosen"}
                                        </span>
                                        {selectedImage && (
                                            <button type="button" onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium italic">Max size: 2MB. Allowed: jpeg, png, jpg, gif</p>

                                    {selectedImage && (
                                        <div className="w-32 h-20 rounded border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-1">
                                            <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="h-full w-full object-contain" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex justify-end gap-3 pt-6 border-t font-bold">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-8 rounded-sm h-10 uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-md font-bold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white px-8 rounded-sm h-10 uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-md font-bold"
                                >
                                    Add Notification
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}






