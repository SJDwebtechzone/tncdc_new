import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Handshake, Trash2, X, Edit2 } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchPartners, addPartnerToServer, updatePartnerToServer, deletePartnerFromServer } from '@/store/websiteSlice';
import { BASE_URL } from '@/config';

export default function WebsitePartnersPage() {
    const partners = useSelector((state) => state.website.partners || []);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', link: '', imageUrl: '' });
    const [fileData, setFileData] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(fetchPartners());
    }, [dispatch]);

    const handleOpenModal = (partner = null) => {
        if (partner) {
            setEditingId(partner.id);
            setFormData({ 
                name: partner.name || '', 
                link: partner.link || '', 
                imageUrl: partner.imageUrl || '' 
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', link: '', imageUrl: '' });
        }
        setFileData(null);
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('link', formData.link);
        if (formData.imageUrl) payload.append('image', formData.imageUrl);
        if (fileData) payload.append('imageFile', fileData);

        if (editingId) {
            dispatch(updatePartnerToServer({ id: editingId, data: payload }));
        } else {
            dispatch(addPartnerToServer(payload));
        }
        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: '', link: '', imageUrl: '' });
        setFileData(null);
        setEditingId(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Remove this partner?")) {
            dispatch(deletePartnerFromServer(id));
        }
    };

    const triggerFileSelect = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 pt-4 px-6">
            <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                {/* Management Header */}
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/10">
                    <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                        Manage Our Partners
                    </h2>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="bg-[#154c4c] hover:bg-[#0f3838] text-white gap-2 rounded-sm px-6 h-10 text-[11px] font-bold transition-all border-none uppercase tracking-wider"
                    >
                        + Add New Partner
                    </Button>
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto rounded-sm border border-gray-200">
                        <Table className="border-collapse w-full">
                            <TableHeader>
                                <TableRow className="bg-[#f1f5f9] hover:bg-[#f1f5f9] border-b border-gray-200">
                                    <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-center w-16">#</TableHead>
                                    <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Logo</TableHead>
                                    <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Name</TableHead>
                                    <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Created At</TableHead>
                                    <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {partners.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-20 text-center border-b border-gray-100 italic text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <Handshake size={40} className="text-gray-200" />
                                                <span className="text-sm font-medium">No partners found</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    partners.map((row, index) => (
                                        <TableRow key={row.id} className="hover:bg-gray-50/50">
                                            <TableCell className="py-4 px-6 text-[12px] font-medium text-gray-500 border-r border-gray-200 text-center">{index + 1}</TableCell>
                                            <TableCell className="py-4 px-6 border-r border-gray-200">
                                                <div className="w-20 h-10 rounded-sm bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center p-1">
                                                    {row.imageUrl && <img src={row.imageUrl.startsWith('/uploads') ? `${BASE_URL}${row.imageUrl}` : row.imageUrl} alt="" className="w-full h-full object-contain" />}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-[12px] text-gray-500 border-r border-gray-200">{row.name || 'N/A'}</TableCell>
                                            <TableCell className="py-4 px-6 text-[12px] text-gray-500 border-r border-gray-200 uppercase">{new Date(row.createdAt).toLocaleDateString()}</TableCell>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
                    <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-wider">
                                {editingId ? 'Edit Partner' : 'Add New Partner'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Partner Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-10 border border-gray-200 rounded-sm px-3 text-sm focus:ring-1 focus:ring-[#154c4c] outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Partner Logo <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFileData(e.target.files[0]);
                                                }
                                            }} 
                                        />
                                        <button
                                            type="button"
                                            onClick={triggerFileSelect}
                                            className="px-3 h-full bg-gray-100 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-600 text-[11px] font-sans">
                                            {fileData ? fileData.name : formData.imageUrl ? 'Existing Image Attached' : 'No file chosen'}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-gray-400 italic px-1 font-bold leading-tight">
                                        PNG format recommended for transparent backgrounds. Max 2MB. Recommended size: 400x140 pixels.
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
                                    className="bg-[#154c4c] hover:bg-[#0f3838] text-white h-10 text-[11px] font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                                >
                                    {editingId ? 'Update Partner' : 'Add Partner'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
