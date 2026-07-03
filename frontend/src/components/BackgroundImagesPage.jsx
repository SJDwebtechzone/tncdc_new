import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Image as ImageIcon, Edit, Palette, Calendar, X, Upload, Loader2 } from "lucide-react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { BASE_URL } from '@/config';
import CertificateDesigner from './CertificateDesigner';

export default function BackgroundImagesPage() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [updating, setUpdating] = useState(false);
    
    // Designer state
    const [designingItem, setDesigningItem] = useState(null);

    useEffect(() => {
        fetchBackgrounds();
    }, []);

    const fetchBackgrounds = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/background-images`);
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching backgrounds:', error);
            toast.error('Failed to load background images');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (tpl) => {
        setEditingItem(tpl);
        setPreviewUrl(tpl.imageUrl || '');
        setSelectedFile(null);
        setIsEditModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        if (!editingItem) return;
        
        try {
            setUpdating(true);
            const formData = new FormData();
            formData.append('title', editingItem.title);
            formData.append('type', editingItem.type);
            if (selectedFile) {
                formData.append('image', selectedFile);
            } else {
                formData.append('imageUrl', editingItem.imageUrl);
            }

            await axios.put(`${BASE_URL}/api/background-images/${editingItem.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Background image updated successfully');
            setIsEditModalOpen(false);
            fetchBackgrounds();
        } catch (error) {
            console.error('Error updating background:', error);
            toast.error(error.response?.data?.error || 'Failed to update background image');
        } finally {
            setUpdating(false);
        }
    };

    const filteredTemplates = templates.filter(tpl => 
        tpl.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && templates.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Background Images</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-700">Background Images</h2>
                    <p className="text-sm text-gray-500 italic -mt-2">Manage your A4-sized background templates</p>
                    <div className="relative max-w-4xl">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={18} />
                        </div>
                        <Input
                            placeholder="Search background images.."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11 bg-white border-gray-100 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {filteredTemplates.map((tpl) => (
                    <div key={tpl.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden group hover:shadow-md transition-all">
                        {/* Preview Area */}
                        <div className="relative aspect-[3/4] bg-gray-50 p-4 border-b border-gray-50 flex items-center justify-center">
                            <div className="flex flex-col items-center justify-between w-full h-full">
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-sm font-bold text-gray-700 capitalize break-all mr-2">{tpl.title}</span>
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded tracking-widest leading-none">
                                        {tpl.type}
                                    </span>
                                </div>

                                {tpl.imageUrl ? (
                                    <div className="flex-1 flex items-center justify-center w-full px-2 py-4">
                                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded shadow-sm bg-white border border-gray-100">
                                            <img
                                                src={tpl.imageUrl}
                                                alt={tpl.title}
                                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2">
                                        <ImageIcon size={48} className="opacity-50" />
                                        <p className="text-[10px] font-medium italic">No Image Uploaded</p>
                                    </div>
                                )}

                                <div className="w-full space-y-2 mt-auto">
                                    <div className="flex items-start gap-1.5 order-1">
                                        <Calendar size={12} className="text-gray-400 shrink-0 mt-0.5" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-gray-500 leading-none">Created: {new Date(tpl.createdAt).toLocaleDateString()}</span>
                                            <span className="text-[8px] font-medium text-gray-400 leading-tight">{new Date(tpl.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-1.5 order-2">
                                        <Calendar size={12} className="text-gray-400 shrink-0 mt-0.5" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-gray-500 leading-none">Updated: {new Date(tpl.updatedAt).toLocaleDateString()}</span>
                                            <span className="text-[8px] font-medium text-gray-400 leading-tight">{new Date(tpl.updatedAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-3 bg-gray-50/30 flex gap-2">
                            <Button 
                                onClick={() => handleEditClick(tpl)}
                                className="flex-1 h-9 bg-[#dcf0fb] hover:bg-[#c9e7f7] text-[#0284c7] border-none flex items-center justify-center gap-2 rounded text-xs font-bold"
                            >
                                <Edit size={14} />
                                Edit
                            </Button>
                            {!tpl.title.toLowerCase().includes('receipt') && !tpl.title.toLowerCase().includes('atc') && (
                                <Button 
                                    onClick={() => setDesigningItem(tpl)}
                                    className="flex-1 h-9 bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#059669] border-none flex items-center justify-center gap-2 rounded text-xs font-bold"
                                >
                                    <Palette size={14} />
                                    Design
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Update Background Image - <span className="capitalize text-blue-600">{editingItem?.title}</span>
                                </h3>
                                <button 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                        Orientation
                                    </label>
                                    <select 
                                        value={editingItem?.type}
                                        onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    >
                                        <option value="PORTRAIT">Portrait (Vertical)</option>
                                        <option value="LANDSCAPE">Landscape (Horizontal)</option>
                                    </select>
                                    <p className="text-[10px] text-gray-400 italic">Select orientation that matches your image</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <ImageIcon size={16} className="text-blue-500" />
                                        Background Image
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 relative group">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                                            />
                                            <div className="h-12 w-full border-2 border-dashed border-gray-200 rounded-xl flex items-center px-4 bg-gray-50 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all">
                                                <Upload size={18} className="text-gray-400 mr-3 shrink-0" />
                                                <span className="text-sm text-gray-500 truncate font-medium">
                                                    {selectedFile ? selectedFile.name : 'Choose A4 Background Image'}
                                                </span>
                                                <div className="ml-auto bg-white px-3 py-1 rounded-lg border border-gray-200 text-[11px] font-bold text-gray-600 shadow-sm group-hover:text-blue-600 group-hover:border-blue-200">
                                                    Browse
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic">Recommended format: JPG/PNG, A4 Aspect Ratio</p>
                                </div>
                            </div>

                            {/* Preview Section */}
                            {previewUrl && (
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Preview</label>
                                    <div className="relative aspect-[3/4] max-h-[300px] w-full bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center p-4">
                                        <img 
                                            src={previewUrl} 
                                            alt="Preview" 
                                            className="max-w-full max-h-full object-contain rounded shadow-lg border-2 border-white"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-blue-600 shadow-sm border border-blue-50 flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                            Selected Image
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-gray-50 flex items-center gap-4">
                            <Button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="flex-1 h-12 bg-[#1034a6] hover:bg-[#0d2a85] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all disabled:opacity-70"
                            >
                                {updating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Update
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={() => setIsEditModalOpen(false)}
                                disabled={updating}
                                className="h-12 px-8 bg-[#b28c64] hover:bg-[#9d7955] text-white rounded-xl font-bold shadow-lg shadow-[#b28c64]/10 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Designer Modal component full screen */}
            {designingItem && (
                <CertificateDesigner 
                    template={designingItem} 
                    onClose={() => setDesigningItem(null)} 
                    onSaveSuccess={(updated) => {
                        setTemplates(templates.map(t => t.id === updated.id ? updated : t));
                    }}
                />
            )}
        </div>
    );
}

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}






