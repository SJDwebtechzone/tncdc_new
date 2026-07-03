import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit2, Trash2, Check, Layout, X, Upload, Monitor } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchTestimonials, saveTestimonialSettings, addTestimonialObj, updateTestimonialObj, deleteTestimonialObj } from '@/store/websiteSlice';

export default function WebsiteTestimonialsPage() {
    const settings = useSelector((state) => state.website.testimonialSettings);
    const testimonials = useSelector((state) => state.website.testimonials || []);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTestimonials());
    }, [dispatch]);

    const [settingsForm, setSettingsForm] = useState(settings);
    
    // Update local form state when settings change in store
    useEffect(() => {
        setSettingsForm(settings);
    }, [settings]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', image: '', role: '', institute: '', content: '' });
    const [editingId, setEditingId] = useState(null);

    const modalFileRef = useRef(null);

    const filteredTestimonials = testimonials.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.institute && t.institute.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.role && t.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleUpdateSettings = () => {
        dispatch(saveTestimonialSettings(settingsForm));
        alert("Testimonial section settings updated successfully!");
    };

    const handleEditTestimonial = (testimonial) => {
        setFormData({
            name: testimonial.name,
            image: testimonial.image,
            role: testimonial.role,
            institute: testimonial.institute,
            content: testimonial.content
        });
        setEditingId(testimonial.id);
        setIsModalOpen(true);
    };

    const handleSaveTestimonial = (e) => {
        e.preventDefault();
        if (editingId) {
            dispatch(updateTestimonialObj({ ...formData, id: editingId }));
        } else {
            dispatch(addTestimonialObj(formData));
        }
        setIsModalOpen(false);
        setFormData({ name: '', image: '', role: '', institute: '', content: '' });
        setEditingId(null);
    };

    const handleDeleteTestimonial = (id) => {
        if (window.confirm("Delete this testimonial?")) {
            dispatch(deleteTestimonialObj(id));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileSelect = () => {
        if (modalFileRef.current) modalFileRef.current.click();
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 px-6 pt-4">

            <div className="space-y-6">
                {/* Testimonial Section Settings */}
                <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/30">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            Testimonial Section Settings
                        </h2>
                        <p className="text-[10px] text-gray-400 mt-1">Update the title and subtitle for the testimonials section on the home page.</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Section Subtitle <span className="text-red-500">*</span></label>
                                <Input
                                    value={settingsForm.subtitle}
                                    onChange={e => setSettingsForm({ ...settingsForm, subtitle: e.target.value })}
                                    className="h-10 border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-[#0f172a] bg-gray-50/20"
                                    placeholder="EDUCATION FOR EVERYONE"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Section Title <span className="text-red-500">*</span></label>
                                <Input
                                    value={settingsForm.title}
                                    onChange={e => setSettingsForm({ ...settingsForm, title: e.target.value })}
                                    className="h-10 border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-[#0f172a] bg-gray-50/20"
                                    placeholder="People like history education..."
                                />
                                <p className="text-[10px] text-gray-400 italic px-1 mt-1">You can use &lt;br /&gt; for line breaks.</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Button
                                onClick={handleUpdateSettings}
                                className="bg-[#0f172a] hover:bg-[#151c63] text-white px-6 h-9 rounded-sm font-bold flex items-center gap-2 shadow-sm transition-all border-none uppercase tracking-wider text-[11px]"
                            >
                                <Check size={14} />
                                Update Section Settings
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Manage Testimonials Card */}
                <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            Manage Testimonials
                        </h2>
                        <Button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({ name: '', image: '', role: '', institute: '', content: '' });
                                setIsModalOpen(true);
                            }}
                            className="bg-[#0f172a] hover:bg-[#151c63] text-white gap-2 rounded-sm h-9 text-[11px] font-bold transition-all border-none uppercase tracking-wider px-6"
                        >
                            <Plus size={16} /> Add New Testimonial
                        </Button>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Search Area */}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 relative w-full">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                    <Search size={16} />
                                </div>
                                <Input
                                    placeholder="Search by name or company..."
                                    className="pl-10 h-10 border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-[#0f172a]"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button className="bg-[#0f172a] hover:bg-[#151c63] text-white h-10 px-16 rounded-sm font-bold border-none transition-all uppercase tracking-wider text-xs w-full md:w-auto shadow-sm">
                                Search
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-white hover:bg-orange-50/30 text-[#b9875a] border border-orange-200 h-10 px-16 rounded-sm font-bold transition-all uppercase tracking-wider text-xs w-full md:w-auto shadow-sm"
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
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Role</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Institute</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Testimonial</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Created At</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 text-center px-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTestimonials.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="py-20 text-center">
                                                    <p className="text-red-500 font-bold italic text-xs uppercase tracking-widest">No Data Available</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredTestimonials.map((row, index) => (
                                                <TableRow key={row.id} className="hover:bg-gray-50/50 outline-none">
                                                    <TableCell className="py-4 px-6 text-center font-medium text-gray-500 border-r border-gray-100 text-xs">{index + 1}</TableCell>
                                                    <TableCell className="py-4 font-semibold text-gray-700 border-r border-gray-100 text-xs px-6">{row.name}</TableCell>
                                                    <TableCell className="py-4 border-r border-gray-100">
                                                        <div className="w-10 h-10 rounded-full bg-gray-50 overflow-hidden border border-gray-200 mx-auto">
                                                            {row.image ? <img src={row.image} alt={row.name} className="w-full h-full object-cover" /> : <Monitor size={20} className="text-gray-300 m-auto mt-2" />}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-[11px] font-bold text-gray-600 border-r border-gray-100 px-6 uppercase tracking-tight">{row.role}</TableCell>
                                                    <TableCell className="py-4 text-[11px] text-blue-600 font-bold border-r border-gray-100 px-6 uppercase tracking-wider">{row.institute}</TableCell>
                                                    <TableCell className="py-4 text-xs text-gray-500 max-w-xs truncate border-r border-gray-100 px-6 italic">"{row.content}"</TableCell>
                                                    <TableCell className="py-4 text-[10px] text-gray-400 border-r border-gray-100 px-6 uppercase whitespace-nowrap">{row.createdAt}</TableCell>
                                                    <TableCell className="py-4 px-6 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => handleEditTestimonial(row)} className="h-8 w-8 text-[#0f172a] border border-blue-100/30 rounded-sm flex items-center justify-center hover:bg-blue-50 transition-colors">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDeleteTestimonial(row.id)} className="h-8 w-8 text-red-500 border border-red-100/30 rounded-sm flex items-center justify-center hover:bg-red-50 transition-colors">
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 font-sans">
                    <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/30">
                            <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTestimonial} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Name <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Client Name"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Image <span className="text-red-500">*</span></label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input 
                                            type="file" 
                                            ref={modalFileRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleImageUpload} 
                                        />
                                        <button
                                            type="button"
                                            onClick={triggerFileSelect}
                                            className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-400 text-[11px] italic truncate">
                                            {formData.image ? (formData.image.startsWith('data:') ? 'Image selected' : formData.image.split('/').pop()) : 'No file chosen'}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-gray-400 italic px-1 font-sans">Image must be 40x40 pixels.</p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Role</label>
                                <Input
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="Client Role"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Institute</label>
                                <Input
                                    value={formData.institute}
                                    onChange={e => setFormData({ ...formData, institute: e.target.value })}
                                    placeholder="Institute Name"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Testimonial <span className="text-red-500">*</span></label>
                                <Textarea
                                    required
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="min-h-[100px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                                    placeholder="Testimonial Text"
                                />
                            </div>

                            <div className="flex justify-center gap-4 pt-4 border-t border-gray-100 -mx-6 px-6 mt-6">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-[#b9875a] hover:bg-[#a6764a] text-white border-none h-10 text-[11px] font-bold px-10 rounded-sm shadow-sm transition-all uppercase tracking-wider"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white h-10 text-[11px] font-bold px-10 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                                >
                                    {editingId ? 'Update Testimonial' : 'Add Testimonial'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}






