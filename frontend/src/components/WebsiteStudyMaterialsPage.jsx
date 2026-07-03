import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, BookOpen, Trash2, X, Edit2, FileText, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { 
    fetchStudyMaterials, 
    addStudyMaterialToServer, 
    updateStudyMaterialToServer, 
    deleteStudyMaterialFromServer 
} from '@/store/websiteSlice';
import toast from 'react-hot-toast';

export default function WebsiteStudyMaterialsPage() {
    const materials = useSelector((state) => state.website.studyMaterials || []);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null
    });
    const [selectedFileName, setSelectedFileName] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(fetchStudyMaterials());
    }, [dispatch]);

    const handleOpenModal = (material = null) => {
        if (material) {
            setEditingId(material.id);
            setFormData({
                title: material.title || '',
                description: material.description || '',
                file: null
            });
            setSelectedFileName(material.fileUrl ? 'Existing File' : '');
        } else {
            setEditingId(null);
            setFormData({ title: '', description: '', file: null });
            setSelectedFileName('');
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size should be less than 2MB");
                return;
            }
            setFormData({ ...formData, file });
            setSelectedFileName(file.name);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description) {
            toast.error("Title and description are required");
            return;
        }

        if (!editingId && !formData.file) {
            toast.error("Please upload a file");
            return;
        }

        setIsSubmitting(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.file) {
            data.append('file', formData.file);
        }

        try {
            if (editingId) {
                await dispatch(updateStudyMaterialToServer({ id: editingId, formData: data })).unwrap();
                toast.success("Study material updated successfully");
            } else {
                await dispatch(addStudyMaterialToServer(data)).unwrap();
                toast.success("Study material added successfully");
            }
            setIsModalOpen(false);
            setFormData({ title: '', description: '', file: null });
            setSelectedFileName('');
        } catch (error) {
            toast.error(error || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this study material?")) {
            try {
                await dispatch(deleteStudyMaterialFromServer(id)).unwrap();
                toast.success("Deleted successfully");
            } catch (error) {
                toast.error(error || "Delete failed");
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
                            Manage Study Materials
                        </h2>
                        <Button
                            onClick={() => handleOpenModal()}
                            className="bg-[#154c4c] hover:bg-[#0f3838] text-white gap-2 rounded-sm px-6 h-10 text-[11px] font-bold transition-all border-none uppercase tracking-wider"
                        >
                            + Add New Study Material
                        </Button>
                    </div>

                    <div className="p-6">
                        <div className="overflow-x-auto rounded-sm border border-gray-200">
                            <Table className="border-collapse w-full">
                                <TableHeader>
                                    <TableRow className="bg-[#f1f5f9] hover:bg-[#f1f5f9] border-b border-gray-200">
                                        <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-center w-16">#</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Title</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Description</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">File</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Date</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {materials.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-20 text-center border-b border-gray-100 italic text-gray-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText size={40} className="text-gray-200" />
                                                    <span className="text-sm font-medium">No study materials found</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        materials.map((row, index) => (
                                            <TableRow key={row.id} className="hover:bg-gray-50/50">
                                                <TableCell className="py-4 px-6 text-[12px] font-medium text-gray-500 border-r border-gray-200 text-center">{index + 1}</TableCell>
                                                <TableCell className="py-4 px-6 text-[12px] font-medium text-gray-700 border-r border-gray-200">{row.title}</TableCell>
                                                <TableCell className="py-4 px-6 text-[12px] text-gray-600 border-r border-gray-200 max-w-xs truncate">{row.description}</TableCell>
                                                <TableCell className="py-4 px-6 border-r border-gray-200">
                                                    <a 
                                                        href={row.fileUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    >
                                                        <FileText size={14} />
                                                        <span className="text-[11px] font-bold uppercase tracking-tighter">View Material</span>
                                                    </a>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
                    <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-wider">
                                {editingId ? 'Edit Study Material' : 'Add New Study Material'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter a descriptive title"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Provide a short description"
                                    className="min-h-[100px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    File <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept=".pdf,.doc,.docx"
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
                                            {selectedFileName || 'No file chosen'}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-gray-400 italic px-1 font-bold">
                                        Accepted formats: PDF, DOC, DOCX. Max 2MB.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4 pt-6 mt-4">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-[#b9875a] hover:bg-[#a6764a] text-white h-10 text-[11px] font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#154c4c] hover:bg-[#0f3838] text-white h-10 text-[11px] font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : (editingId ? 'Update' : 'Add Material')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}






