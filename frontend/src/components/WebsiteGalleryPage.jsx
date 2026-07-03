import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Trash2, Image as ImageIcon, Video, Edit2 } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchGalleryItems, addGalleryItemToServer, deleteGalleryItemFromServer } from '@/store/websiteSlice';
import { BASE_URL } from '@/config';

const API_URL = BASE_URL;

export default function WebsiteGalleryPage() {
    const gallery = useSelector((state) => state.website.gallery || []);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);
    const imageRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        type: 'IMAGE',       // IMAGE or VIDEO
        imageFile: null,
        imagePreview: '', // For local file preview
        mediaUrl: '',     // For existing image/video URL or new video URL
        thumbnailUrl: ''
    });

    useEffect(() => {
        dispatch(fetchGalleryItems());
    }, [dispatch]);

    const handleOpenModal = () => {
        setIsEditMode(false);
        setEditingItemId(null);
        setFormData({ title: '', type: 'IMAGE', imageFile: null, imagePreview: '', mediaUrl: '', thumbnailUrl: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setIsEditMode(true);
        setEditingItemId(item.id);
        const imageUrl = item.mediaUrl ? (item.mediaUrl.startsWith('http') ? item.mediaUrl : `${API_URL}${item.mediaUrl}`) : '';
        setFormData({
            title: item.title,
            type: item.type,
            imageFile: null,
            imagePreview: item.type === 'IMAGE' ? imageUrl : '',
            mediaUrl: item.mediaUrl || '',
            thumbnailUrl: item.thumbnailUrl || ''
        });
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file),
                mediaUrl: '' // Clear mediaUrl if a new file is selected
            }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('type', formData.type);

            if (formData.type === 'IMAGE') {
                if (formData.imageFile) {
                    data.append('image', formData.imageFile);
                } else if (isEditMode && formData.mediaUrl) {
                    data.append('mediaUrl', formData.mediaUrl);
                }
            } else if (formData.type === 'VIDEO') {
                data.append('mediaUrl', formData.mediaUrl);
                if (formData.thumbnailUrl) {
                    data.append('thumbnailUrl', formData.thumbnailUrl);
                }
            }

            if (isEditMode) {
                const response = await fetch(`${BASE_URL}/api/gallery/${editingItemId}`, {
                    method: 'PUT',
                    body: data
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || errorData.message || 'Update failed');
                }
                dispatch(fetchGalleryItems());
            } else {
                await dispatch(addGalleryItemToServer(data)).unwrap();
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Gallery Save Error:", error);
            const errorMessage = error?.error || error?.message || (typeof error === 'string' ? error : 'Unknown server error');
            alert(`Error saving item: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this gallery item?")) {
            try {
                await dispatch(deleteGalleryItemFromServer(id)).unwrap();
            } catch (err) {
                alert('Error deleting item: ' + err);
            }
        }
    };

    const getMediaPreview = (row) => {
        if (row.type === 'IMAGE' && row.mediaUrl) {
            const url = row.mediaUrl.startsWith('http') ? row.mediaUrl : `${API_URL}${row.mediaUrl}`;
            return <img src={url} alt="" className="w-full h-full object-cover" />;
        }
        if (row.type === 'VIDEO') {
            return <Video size={16} className="text-gray-400 m-auto mt-2" />;
        }
        return null;
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 pt-4">
            <div className="px-6 space-y-4">
                <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/10">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            Manage Gallery
                        </h2>

                        <Button
                            onClick={handleOpenModal}
                            className="bg-[#154c4c] hover:bg-[#0f3838] text-white gap-2 rounded-sm px-6 h-10 text-[11px] font-bold transition-all border-none uppercase tracking-wider"
                        >
                            + Add New Gallery Item
                        </Button>
                    </div>

                    <div className="p-6">
                        <div className="overflow-x-auto rounded-sm border border-gray-200">
                            <Table className="border-collapse w-full">
                                <TableHeader>
                                    <TableRow className="bg-[#f1f5f9] hover:bg-[#f1f5f9] border-b border-gray-200">
                                        <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-center w-16">#</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Title</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Type</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Preview</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">URL / Source</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Added</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {gallery.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-20 text-center border-b border-gray-100 italic text-gray-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <ImageIcon size={40} className="text-gray-200" />
                                                    <span className="text-sm font-medium">No gallery items found. Add your first item!</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        gallery.map((row, index) => (
                                            <TableRow key={row.id} className="hover:bg-gray-50/50">
                                                <TableCell className="py-4 px-6 text-[12px] font-medium text-gray-500 border-r border-gray-200 text-center">{index + 1}</TableCell>
                                                <TableCell className="py-4 px-6 text-[12px] font-medium text-gray-700 border-r border-gray-200">{row.title}</TableCell>
                                                <TableCell className="py-4 px-6 border-r border-gray-200">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${row.type === 'IMAGE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                        {row.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 border-r border-gray-200">
                                                    <div className="w-12 h-8 rounded-sm bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                                                        {getMediaPreview(row)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-[11px] text-gray-500 border-r border-gray-200 max-w-[180px] truncate">
                                                    {row.mediaUrl || '-'}
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-[11px] text-gray-500 border-r border-gray-200 uppercase whitespace-nowrap">
                                                    {new Date(row.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(row)}
                                                            className="h-8 w-8 text-[#0f172a] border border-blue-100/30 rounded-sm flex items-center justify-center hover:bg-blue-50 transition-colors"
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
                    <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/30">
                            <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                                {isEditMode ? "Edit Gallery Item" : "Add New Gallery Item"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
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
                                    placeholder="e.g. Annual Day Event 2024"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value, imageFile: null, imagePreview: '', mediaUrl: '', thumbnailUrl: '' })}
                                    className="w-full h-10 px-3 rounded-sm border border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] bg-white outline-none"
                                >
                                    <option value="IMAGE">Image</option>
                                    <option value="VIDEO">YouTube Video</option>
                                </select>
                            </div>

                            {formData.type === 'IMAGE' && (
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                        Image {isEditMode && formData.mediaUrl && !formData.imageFile ? '' : <span className="text-red-500">*</span>}
                                    </label>
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden bg-gray-50/20">
                                        <input type="file" ref={imageRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                                        <button
                                            type="button"
                                            onClick={() => imageRef.current?.click()}
                                            className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-400 text-[11px] italic">
                                            {formData.imageFile ? formData.imageFile.name : (isEditMode && formData.mediaUrl ? 'Existing Image' : "No file chosen")}
                                        </span>
                                    </div>
                                    {(formData.imagePreview) && (
                                        <img src={formData.imagePreview} alt="Preview" className="w-24 h-16 object-cover rounded border border-gray-200" />
                                    )}
                                </div>
                            )}

                            {formData.type === 'VIDEO' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                            YouTube Video URL <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            required
                                            value={formData.mediaUrl}
                                            onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                            Thumbnail URL (Optional)
                                        </label>
                                        <Input
                                            value={formData.thumbnailUrl}
                                            onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                            placeholder="https://img.youtube.com/vi/.../hqdefault.jpg"
                                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-center gap-4 pt-4">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-[#b9875a] hover:bg-[#a6764a] text-white h-10 text-[11px] font-bold px-10 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-[#154c4c] hover:bg-[#0f3838] text-white h-10 text-[11px] font-bold px-10 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                                >
                                    {isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Item' : 'Add Gallery Item')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
