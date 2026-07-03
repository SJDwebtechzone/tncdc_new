import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit2, Trash2, X, Monitor } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvents, addEventToServer, updateEventToServer, deleteEventFromServer } from '@/store/websiteSlice';
import { useEffect } from 'react';

export default function WebsiteEventsPage() {
    const events = useSelector((state) => state.website.events || []);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        time: '',
        date: '',
        year: '',
        description: '',
        image: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [fileData, setFileData] = useState(null);

    const modalFileRef = useRef(null);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditEvent = (event) => {
        setFormData({
            title: event.title,
            location: event.location || '',
            time: event.time || '',
            date: event.date,
            year: event.year || '',
            description: event.description || '',
            image: event.image || ''
        });
        setFileData(null);
        setEditingId(event.id);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (e) => {
        e.preventDefault();
        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('location', formData.location);
        payload.append('time', formData.time);
        payload.append('date', formData.date);
        payload.append('description', formData.description || '');
        if (formData.image) payload.append('image', formData.image);
        if (fileData) payload.append('imageFile', fileData);

        if (editingId) {
            dispatch(updateEventToServer({ id: editingId, data: payload }));
        } else {
            dispatch(addEventToServer(payload));
        }
        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ title: '', location: '', time: '', date: '', year: '', description: '', image: '' });
        setFileData(null);
        setEditingId(null);
    };

    const handleDeleteEvent = (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            dispatch(deleteEventFromServer(id));
        }
    };

    const triggerFileSelect = (ref) => {
        if (ref.current) ref.current.click();
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 px-6 pt-4">

            <div className="space-y-6">
                {/* Manage Events Card */}
                <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            Manage Events
                        </h2>
                        <Button
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="bg-[#0f172a] hover:bg-[#151c63] text-white gap-2 rounded-sm h-9 text-[11px] font-bold transition-all border-none uppercase tracking-wider px-6"
                        >
                            <Plus size={16} /> Add New Event
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
                                    placeholder="Search by title..."
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
                            <div className="overflow-x-auto font-sans">
                                <Table className="border-collapse">
                                    <TableHeader>
                                        <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-100">
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 w-16 text-center border-r border-gray-100">#</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 text-center px-6">Image</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Title</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Location</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Time</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Date</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Year</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Created At</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 text-center px-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEvents.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} className="py-20 text-center font-sans border-b border-gray-100">
                                                    <p className="text-gray-400 font-bold italic text-xs uppercase tracking-widest">No Data Available</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredEvents.map((row, index) => (
                                                <TableRow key={row.id} className="hover:bg-gray-50/50 outline-none border-b border-gray-100">
                                                    <TableCell className="py-4 px-6 text-center font-medium text-gray-500 border-r border-gray-100 text-xs">{index + 1}</TableCell>
                                                    <TableCell className="py-4 border-r border-gray-100">
                                                        <div className="w-12 h-10 rounded-sm bg-gray-50 overflow-hidden border border-gray-200 mx-auto flex items-center justify-center">
                                                            {row.image ? <img src={row.image} alt={row.title} className="w-full h-full object-cover" /> : <Monitor size={18} className="text-gray-300" />}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 font-semibold text-gray-700 border-r border-gray-100 text-xs px-6">{row.title}</TableCell>
                                                    <TableCell className="py-4 text-xs text-gray-600 border-r border-gray-100 px-6">{row.location}</TableCell>
                                                    <TableCell className="py-4 text-xs text-gray-600 border-r border-gray-100 px-6">{row.time}</TableCell>
                                                    <TableCell className="py-4 text-xs text-gray-600 border-r border-gray-100 px-6">{row.date}</TableCell>
                                                    <TableCell className="py-4 text-xs text-gray-600 border-r border-gray-100 px-6">{row.year || '-'}</TableCell>
                                                    <TableCell className="py-4 text-[10px] text-gray-400 border-r border-gray-100 px-6 uppercase whitespace-nowrap">{row.createdAt}</TableCell>
                                                    <TableCell className="py-4 px-6 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => handleEditEvent(row)} className="h-8 w-8 text-[#0f172a] border border-blue-100/30 rounded-sm flex items-center justify-center hover:bg-blue-50 transition-colors">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDeleteEvent(row.id)} className="h-8 w-8 text-red-500 border border-red-100/30 rounded-sm flex items-center justify-center hover:bg-red-50 transition-colors">
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
                            <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEvent} className="p-6 space-y-5">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Image <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input 
                                            type="file" 
                                            ref={modalFileRef} 
                                            className="hidden" 
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFileData(e.target.files[0]);
                                                }
                                            }} 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => triggerFileSelect(modalFileRef)}
                                            className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-600 text-[11px] font-sans">
                                            {fileData ? fileData.name : formData.image ? 'Existing Image Attached' : 'No file chosen'}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold">Image recommended ratio is 355x240 pixels.</p>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Description</label>
                                <Input
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief event description."
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Title <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Event Title"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Location <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Vancouver"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Time <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    value={formData.time}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    placeholder="8.00 am - 5.00 pm"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Event Date <span className="text-red-500">*</span></label>
                                <Input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="flex justify-center gap-4 pt-4 border-t border-gray-100 -mx-6 px-6 mt-4">
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
                                    {editingId ? 'Update Event' : 'Add Event'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}






