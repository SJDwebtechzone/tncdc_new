import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit2, Trash2, Check, Layout, Image as ImageIcon, X, RotateCcw, Upload } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { 
    fetchTopPerformers, 
    saveTopPerformerSettings, 
    addTopPerformerObj, 
    updateTopPerformerObj, 
    deleteTopPerformerObj 
} from '@/store/websiteSlice';
import { useEffect } from 'react';

export default function WebsiteTopPerformersPage() {
    const settings = useSelector((state) => state.website.performerSettings);
    const performers = useSelector((state) => state.website.performers || []);
    const dispatch = useDispatch();

    const [bannerForm, setBannerForm] = useState(settings || { title: '', description: '' });
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', image: '', course: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    const bannerFileRef = useRef(null);
    const modalFileRef = useRef(null);

    useEffect(() => {
        dispatch(fetchTopPerformers());
    }, [dispatch]);

    useEffect(() => {
        if (settings) {
            setBannerForm(settings);
        }
    }, [settings]);

    const filteredPerformers = performers.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.course.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUpdateSettings = () => {
        dispatch(saveTopPerformerSettings(bannerForm));
        alert("Banner settings updated successfully!");
    };

    const handleEditPerformer = (performer) => {
        setFormData({
            name: performer.name,
            image: performer.image,
            course: performer.course,
            description: performer.description
        });
        setEditingId(performer.id);
        setIsModalOpen(true);
    };

    const handleSavePerformer = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await dispatch(updateTopPerformerObj({ ...formData, id: editingId })).unwrap();
                alert("Performer updated successfully!");
            } else {
                await dispatch(addTopPerformerObj(formData)).unwrap();
                alert("Performer added successfully!");
            }
            setIsModalOpen(false);
            setFormData({ name: '', image: '', course: '', description: '' });
            setEditingId(null);
        } catch (error) {
            console.error("Save failed:", error);
            alert("Error saving performer. Please check the logs.");
        }
    };

    const handleDeletePerformer = async (id) => {
        if (window.confirm("Are you sure you want to delete this performer?")) {
            try {
                await dispatch(deleteTopPerformerObj(id)).unwrap();
                alert("Performer deleted successfully!");
            } catch (error) {
                console.error("Delete failed:", error);
                alert("Error deleting performer.");
            }
        }
    };

    const triggerFileSelect = (ref) => {
        if (ref.current) ref.current.click();
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 px-6 pt-4">

            <div className="px-6 space-y-6">
                {/* Banner Settings Section */}
                <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/30">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            Banner Settings
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Title <span className="text-red-500">*</span></label>
                                <Input
                                    value={bannerForm.title}
                                    onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                                    className="h-10 border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-[#1e463a] bg-gray-50/20"
                                    placeholder="Unmatched Performance Excellence"
                                />
                            </div>
                            <div className="space-y-1.5 row-span-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Short Description</label>
                                <Textarea
                                    className="min-h-[141px] border-gray-200 rounded-sm text-sm leading-relaxed focus:ring-1 focus:ring-[#1e463a] bg-gray-50/20"
                                    value={bannerForm.description}
                                    onChange={e => setBannerForm({ ...bannerForm, description: e.target.value })}
                                    placeholder="Delivering exceptional results..."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Banner Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 border border-gray-100 rounded-sm h-10 flex items-center px-3 bg-gray-50/20">
                                        <input 
                                            type="file" 
                                            ref={bannerFileRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setBannerForm({ ...bannerForm, bannerUrl: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => triggerFileSelect(bannerFileRef)}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 text-[11px] font-bold rounded-sm transition-colors mr-3 h-7 flex items-center"
                                        >
                                            Choose File
                                        </button>
                                        <span className="text-[11px] text-gray-400 italic truncate max-w-[200px]">
                                            {bannerForm.bannerUrl ? "Image Selected" : "No file chosen"}
                                        </span>
                                    </div>
                                    {bannerForm.bannerUrl && (
                                        <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden shrink-0">
                                            <img src={bannerForm.bannerUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 italic px-1">Accepted: JPEG, PNG, JPG, GIF, WEBP. Max: 5MB. Recommended: 1415x600px</p>
                            </div>
                        </div>
                        <div className="mt-6 flex">
                            <Button
                                onClick={handleUpdateSettings}
                                className="bg-[#1e463a] hover:bg-[#153229] text-white px-8 h-10 rounded-sm font-bold flex items-center gap-2 shadow-sm transition-all border-none uppercase tracking-wider text-[11px]"
                            >
                                <Check size={14} />
                                Update Banner Settings
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Manage Top Performers Card */}
                <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            Manage Top Performers
                        </h2>
                        <Button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({ name: '', image: '', course: '', description: '' });
                                setIsModalOpen(true);
                            }}
                            className="bg-[#0f172a] hover:bg-[#151c63] text-white gap-2 rounded-sm h-9 text-[11px] font-bold transition-all border-none uppercase tracking-wider px-6"
                        >
                            <Plus size={16} /> Add New Performer
                        </Button>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Search Area */}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 relative w-full">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search size={16} />
                                </div>
                                <Input
                                    placeholder="Search by name or course..."
                                    className="pl-10 h-10 border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-[#0f172a]"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button className="bg-[#0f172a] hover:bg-[#151c63] text-white h-10 px-16 rounded-sm font-bold border-none transition-all uppercase tracking-wider text-xs w-full md:w-auto">
                                Search
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-white hover:bg-orange-50/30 text-[#b9875a] border border-orange-200 h-10 px-16 rounded-sm font-bold transition-all uppercase tracking-wider text-xs w-full md:w-auto"
                                onClick={() => setSearchQuery("")}
                            >
                                Reset
                            </Button>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-sm border border-gray-100 overflow-hidden min-h-[300px]">
                            <div className="overflow-x-auto">
                                <Table className="border-collapse">
                                    <TableHeader>
                                        <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-100">
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 w-16 text-center border-r border-gray-100">#</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Name</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 text-center">Image</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Course Name</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Short Description</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Created At</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 text-center px-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPerformers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="py-20 text-center">
                                                    <p className="text-red-500 font-bold italic text-xs uppercase tracking-widest">No Data Available</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredPerformers.map((row, index) => (
                                                <TableRow key={row.id} className="hover:bg-gray-50/50 outline-none">
                                                    <TableCell className="py-4 px-6 text-center font-medium text-gray-500 border-r border-gray-100 text-xs">{index + 1}</TableCell>
                                                    <TableCell className="py-4 font-semibold text-gray-700 border-r border-gray-100 text-xs px-6">{row.name}</TableCell>
                                                    <TableCell className="py-4 border-r border-gray-100">
                                                        <div className="w-12 h-10 rounded-sm bg-gray-50 overflow-hidden border border-gray-200 mx-auto">
                                                            {row.image ? <img src={row.image} alt={row.name} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-300 m-auto mt-2" />}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-[11px] font-bold text-gray-600 border-r border-gray-100 px-6 uppercase tracking-tight">{row.course}</TableCell>
                                                    <TableCell className="py-4 text-xs text-gray-500 max-w-xs truncate border-r border-gray-100 px-6 italic">"{row.description}"</TableCell>
                                                    <TableCell className="py-4 text-[10px] text-gray-400 border-r border-gray-100 px-6 uppercase whitespace-nowrap">{row.createdAt}</TableCell>
                                                    <TableCell className="py-4 px-6 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => handleEditPerformer(row)} className="h-8 w-8 text-[#0f172a] border border-blue-100/30 rounded-sm flex items-center justify-center hover:bg-blue-50 transition-colors">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePerformer(row.id)}
                                                                className="h-8 w-8 text-red-500 border border-red-100/30 rounded-sm flex items-center justify-center hover:bg-red-50 transition-colors"
                                                            >
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
                </div>
            </div>

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 font-sans">
                    <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative flex flex-col max-h-[90vh]">

                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-widest">{editingId ? 'Edit Performer' : 'Add New Performer'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSavePerformer} className="p-6 space-y-6 overflow-y-auto">

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Name <span className="text-red-500">*</span></label>
                                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter Student Name" className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e463a]" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Image <span className="text-red-500">*</span></label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 border border-gray-200 rounded-sm h-10 flex items-center px-3 bg-gray-50/20">
                                        <input type="file" ref={modalFileRef} className="hidden" accept="image/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, image: reader.result });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                        <button
                                            type="button"
                                            onClick={() => triggerFileSelect(modalFileRef)}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 text-[11px] font-bold rounded-sm transition-colors mr-3 h-7 flex items-center gap-1.5"
                                        >
                                            <Upload size={12} />
                                            Choose File
                                        </button>
                                        <span className="text-[11px] text-gray-400 italic">No file chosen</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 italic px-1 mt-1 font-sans">JPEG/PNG/WEBP format, max 2MB. Recommended size: 400x300 pixels.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Course Name</label>
                                <Input value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })} placeholder="Enter Course Name" className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e463a]" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Short Description</label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Enter Short Description" className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e463a] leading-relaxed p-3 bg-gray-50/20" />
                            </div>

                            <div className="flex justify-center gap-4 pt-4 border-t border-gray-100 -mx-6 px-6 mt-6">
                                <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-[#b9875a] hover:bg-[#a6764a] text-white border-none h-10 text-[11px] font-bold px-10 rounded-sm shadow-sm transition-all uppercase tracking-wider">Cancel</Button>
                                <Button type="submit" className="bg-[#1e463a] hover:bg-[#153229] text-white h-10 text-[11px] font-bold px-10 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider">{editingId ? 'Update Performer' : 'Add Performer'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}







