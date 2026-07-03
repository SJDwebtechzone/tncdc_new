import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit2, Trash2, Check, X, Upload, Monitor } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchTeachers, addTeacherObj, updateTeacherObj, deleteTeacherObj } from '@/store/websiteSlice';
import { BASE_URL } from '@/config';

export default function WebsiteTeachersPage() {
    const teachers = useSelector((state) => state.website.teachers || []);
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        designation: '',
        description: '',
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        phone: '',
        email: '',
        basicSalary: 0
    });
    const [editingId, setEditingId] = useState(null);

    const modalFileRef = useRef(null);

    React.useEffect(() => {
        dispatch(fetchTeachers());
    }, [dispatch]);

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.email && t.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleEditTeacher = (teacher) => {
        setFormData({
            name: teacher.name,
            image: teacher.image,
            designation: teacher.designation,
            description: teacher.description || '',
            facebookUrl: teacher.facebookUrl || '',
            twitterUrl: teacher.twitterUrl || '',
            instagramUrl: teacher.instagramUrl || '',
            phone: teacher.phone || '',
            email: teacher.email || '',
            basicSalary: teacher.basicSalary || 0
        });
        setEditingId(teacher.id);
        setIsModalOpen(true);
    };

    const uploadImage = async (file) => {
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            const res = await axios.post(`${BASE_URL}/api/profile/upload`, uploadFormData);
            return res.data.fileUrl;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    };

    const handleSaveTeacher = async (e) => {
        e.preventDefault();
        
        let imageUrl = formData.image;
        const file = modalFileRef.current?.files?.[0];
        if (file) {
            try {
                imageUrl = await uploadImage(file);
            } catch (err) {
                alert("Image upload failed");
                return;
            }
        }

        if (!imageUrl) {
            alert("Please select an image");
            return;
        }

        const payload = { ...formData, image: imageUrl };

        try {
            if (editingId) {
                await dispatch(updateTeacherObj({ ...payload, id: editingId })).unwrap();
                alert("Teacher updated successfully");
            } else {
                await dispatch(addTeacherObj(payload)).unwrap();
                alert("Teacher added successfully");
            }
            setIsModalOpen(false);
            resetForm();
        } catch (err) {
            console.error('Save Teacher Error:', err);
            alert(`Failed to save teacher: ${err.message || 'Unknown error'}`);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            image: '',
            designation: '',
            description: '',
            facebookUrl: '',
            twitterUrl: '',
            instagramUrl: '',
            phone: '',
            email: '',
            basicSalary: 0
        });
        setEditingId(null);
    };

    const handleDeleteTeacher = (id) => {
        if (window.confirm("Delete this teacher entry?")) {
            dispatch(deleteTeacherObj(id));
        }
    };

    const triggerFileSelect = (ref) => {
        if (ref.current) ref.current.click();
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 px-6 pt-4">

            <div className="space-y-6">
                {/* Manage Teachers Card */}
                <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            Manage Teachers
                        </h2>
                        <Button
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="bg-[#0f172a] hover:bg-[#151c63] text-white gap-2 rounded-sm h-9 text-[11px] font-bold transition-all border-none uppercase tracking-wider px-6"
                        >
                            <Plus size={16} /> Add New Teacher
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
                                    placeholder="Search by name or designation..."
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
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Name</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 text-center">Image</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Designation</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Phone</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Email</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Basic Salary</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6 text-center whitespace-nowrap">Created At</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 text-center px-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTeachers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="py-20 text-center font-sans">
                                                    <p className="text-red-500 font-bold italic text-xs uppercase tracking-widest">No Data Available</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredTeachers.map((row, index) => (
                                                <TableRow key={row.id} className="hover:bg-gray-50/50 outline-none">
                                                    <TableCell className="py-4 px-6 text-center font-medium text-gray-500 border-r border-gray-100 text-xs">{index + 1}</TableCell>
                                                    <TableCell className="py-4 font-semibold text-gray-700 border-r border-gray-100 text-xs px-6 whitespace-nowrap">{row.name}</TableCell>
                                                    <TableCell className="py-4 border-r border-gray-100">
                                                        <div className="w-10 h-10 rounded-sm bg-gray-50 overflow-hidden border border-gray-200 mx-auto">
                                                     {row.image ? <img src={row.image.startsWith('/uploads') ? `${BASE_URL}${row.image}` : row.image} alt={row.name} className="w-full h-full object-cover" /> : <Monitor size={18} className="text-gray-300 m-auto mt-2" />}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-[11px] font-bold text-gray-600 border-r border-gray-100 px-6 uppercase tracking-tight">{row.designation}</TableCell>
                                                    <TableCell className="py-4 text-xs text-gray-500 border-r border-gray-100 px-6">{row.phone || '-'}</TableCell>
                                                    <TableCell className="py-4 text-xs text-blue-600 font-medium border-r border-gray-100 px-6">{row.email || '-'}</TableCell>
                                                    <TableCell className="py-4 text-xs font-bold text-gray-700 border-r border-gray-100 px-6">₹{row.basicSalary || 0}</TableCell>
                                                    <TableCell className="py-4 text-[10px] text-gray-400 border-r border-gray-100 px-6 uppercase whitespace-nowrap">{row.createdAt}</TableCell>
                                                    <TableCell className="py-4 px-6 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => handleEditTeacher(row)} className="h-8 w-8 text-[#0f172a] border border-blue-100/30 rounded-sm flex items-center justify-center hover:bg-blue-50 transition-colors">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDeleteTeacher(row.id)} className="h-8 w-8 text-red-500 border border-red-100/30 rounded-sm flex items-center justify-center hover:bg-red-50 transition-colors">
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
                            <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">{editingId ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTeacher} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Name <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Teacher Name"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Image <span className="text-red-500">*</span></label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input 
                                            type="file" 
                                            ref={modalFileRef} 
                                            className="hidden" 
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setFormData({ ...formData, image: URL.createObjectURL(file) });
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
                                        <span className="px-3 text-gray-400 text-[11px] italic">
                                            {modalFileRef.current?.files?.[0]?.name || (formData.image ? "Image selected" : "No file chosen")}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold">Image must be 415x555 pixels.</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Designation</label>
                                <Input
                                    value={formData.designation}
                                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                                    placeholder="Teacher Designation"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                                    placeholder="Teacher Description"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Facebook URL</label>
                                    <Input
                                        value={formData.facebookUrl}
                                        onChange={e => setFormData({ ...formData, facebookUrl: e.target.value })}
                                        placeholder="https://www.facebook.com/"
                                        className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Twitter URL</label>
                                    <Input
                                        value={formData.twitterUrl}
                                        onChange={e => setFormData({ ...formData, twitterUrl: e.target.value })}
                                        placeholder="https://www.twitter.com/"
                                        className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Instagram URL</label>
                                    <Input
                                        value={formData.instagramUrl}
                                        onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })}
                                        placeholder="https://www.instagram.com/"
                                        className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Phone</label>
                                    <Input
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+1-202-555-0174"
                                        className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Email</label>
                                <Input
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="example@gmail.com"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Basic Salary (₹) <span className="text-red-500">*</span></label>
                                <Input
                                    type="number"
                                    required
                                    value={formData.basicSalary}
                                    onChange={e => setFormData({ ...formData, basicSalary: parseFloat(e.target.value) })}
                                    placeholder="0.00"
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
                                    {editingId ? 'Update Teacher' : 'Add Teacher'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}






