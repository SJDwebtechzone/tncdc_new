import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Award, Trash2, X, Edit2, Image as ImageIcon, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchSampleCertificates, addSampleCertificateToServer, updateSampleCertificateToServer, deleteSampleCertificateFromServer } from '@/store/websiteSlice';
import toast from 'react-hot-toast';

export default function WebsiteSampleCertificatesPage() {
    const certificates = useSelector((state) => state.website.sampleCertificates || []);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: null,
        imagePreview: ''
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(fetchSampleCertificates());
    }, [dispatch]);

    const handleOpenModal = (certificate = null) => {
        if (certificate) {
            setEditingId(certificate.id);
            setFormData({
                name: certificate.name || '',
                image: null,
                imagePreview: certificate.image || ''
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', image: null, imagePreview: '' });
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.name) return toast.error("Name is required");
        if (!editingId && !formData.image) return toast.error("Image is required");

        setIsSubmitting(true);
        const submitData = new FormData();
        submitData.append('name', formData.name);
        if (formData.image) {
            submitData.append('image', formData.image);
        }

                try {
            if (editingId) {
                await dispatch(updateSampleCertificateToServer({ id: editingId, formData: submitData })).unwrap();
                toast.success("Recognition updated successfully");
            } else {
                await dispatch(addSampleCertificateToServer(submitData)).unwrap();
                toast.success("Recognition added successfully");
            }
            setIsModalOpen(false);
            setFormData({ name: '', image: null, imagePreview: '' });
        } catch (error) {
            toast.error(error || "Failed to save recognition");
        } finally {
            setIsSubmitting(false);
        }

    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this recognition?")) {
            try {
                await dispatch(deleteSampleCertificateFromServer(id)).unwrap();
                toast.success("Recognition deleted");
            } catch (error) {
                toast.error(error || "Failed to delete recognition");
            }
        }
    };


    const triggerFileSelect = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 pt-4">
            <div className="px-6 space-y-4">
                <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/10">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            Manage Institute Recognitions & Awards
                        </h2>
                        <Button
                            onClick={() => handleOpenModal()}
                            className="bg-[#154c4c] hover:bg-[#0f3838] text-white gap-2 rounded-sm px-6 h-10 text-[11px] font-bold transition-all border-none uppercase tracking-wider"
                        >
                            + Add New Recognition
                        </Button>

                    </div>

                    <div className="p-6">
                        <div className="overflow-x-auto rounded-sm border border-gray-200">
                            <Table className="border-collapse w-full">
                                <TableHeader>
                                    <TableRow className="bg-[#f1f5f9] hover:bg-[#f1f5f9] border-b border-gray-200">
                                        <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-center w-16">#</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Name</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-center">Image</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Created At</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {certificates.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-24 text-center border-b border-gray-100 italic text-gray-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Award size={48} className="text-gray-200" />
                                                    <span className="text-sm font-medium">No recognitions found</span>
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    ) : (
                                        certificates.map((row, index) => (
                                            <TableRow key={row.id} className="hover:bg-gray-50/50">
                                                <TableCell className="py-4 px-6 text-[12px] font-medium text-gray-500 border-r border-gray-200 text-center">{index + 1}</TableCell>
                                                <TableCell className="py-4 px-6 text-[12px] font-bold text-gray-700 border-r border-gray-200">{row.name}</TableCell>
                                                <TableCell className="py-4 px-6 border-r border-gray-200 text-center">
                                                    <div className="w-16 h-10 bg-gray-50 rounded-sm border border-gray-100 flex items-center justify-center mx-auto overflow-hidden">
                                                        {row.image ? (
                                                            <img src={row.image} alt={row.name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <ImageIcon size={16} className="text-gray-200" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-[11px] text-gray-500 border-r border-gray-200 uppercase">
                                                    {new Date(row.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(row)}
                                                            className="h-8 w-8 bg-[#3b82f6] text-white rounded-sm flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(row.id)}
                                                            className="h-8 w-8 text-red-500 border border-red-100/30 rounded-sm flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
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

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
            <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative flex flex-col max-h-[90vh]">

                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-wider">
                                {editingId ? 'Edit Recognition' : 'Add New Recognition'}
                            </h2>

                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto">

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Recognition Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter recognition/award name"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>


                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Recognition Image <span className="text-red-500">*</span>
                                </label>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileChange} 
                                        />
                                        <button
                                            type="button"
                                            onClick={triggerFileSelect}
                                            className="px-3 h-full bg-gray-100 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-400 text-[11px] italic truncate">
                                            {formData.image ? formData.image.name : 'No file chosen'}
                                        </span>
                                    </div>

                                    {formData.imagePreview && (
                                        <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-sm border border-gray-100 overflow-hidden group">
                                            <img 
                                                src={formData.imagePreview} 
                                                alt="Preview" 
                                                className="w-full h-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, image: null, imagePreview: editingId ? (certificates.find(c => c.id === editingId)?.image || '') : '' }))}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <p className="text-[9px] text-gray-400 italic px-1 font-bold">
                                        PNG or JPEG recommended. Max 2MB. Recommended size: 800x600 pixels.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4 pt-6 mt-4">
                                <Button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-[#b9875a] hover:bg-[#a6764a] text-white h-10 text-[11px] font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#154c4c] hover:bg-[#0f3838] text-white h-10 text-[11px] font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider min-w-[160px]"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        editingId ? 'Update Recognition' : 'Add Recognition'
                                    )}
                                </Button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}







