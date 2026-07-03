import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Bold, Italic, Underline, AlignLeft, AlignCenter, Link, RotateCcw, X, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPostToServer, updatePostToServer } from '@/store/websiteSlice';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function WebsiteAddPostPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const editingPost = location.state?.post;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subheading: '',
        thumbnail: null,
        thumbnailPreview: '',
        description: '',
        additionalImages: [], 
        additionalImagesPreviews: [], 
        existingAdditionalImages: [], 
        tags: ['']
    });

    useEffect(() => {
        if (editingPost) {
            setFormData({
                title: editingPost.title || '',
                subheading: editingPost.subheading || '',
                thumbnail: null,
                thumbnailPreview: editingPost.thumbnail || '',
                description: editingPost.description || '',
                additionalImages: [],
                additionalImagesPreviews: [],
                existingAdditionalImages: editingPost.additionalImages || [],
                tags: editingPost.tags?.length ? editingPost.tags : ['']
            });
        }
    }, [editingPost]);

    const thumbnailRef = useRef(null);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                thumbnail: file,
                thumbnailPreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length) {
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setFormData(prev => ({
                ...prev,
                additionalImages: [...prev.additionalImages, ...files],
                additionalImagesPreviews: [...prev.additionalImagesPreviews, ...newPreviews]
            }));
        }
    };

    const removeNewImage = (index) => {
        setFormData(prev => ({
            ...prev,
            additionalImages: prev.additionalImages.filter((_, i) => i !== index),
            additionalImagesPreviews: prev.additionalImagesPreviews.filter((_, i) => i !== index)
        }));
    };

    const removeExistingImage = (index) => {
        setFormData(prev => ({
            ...prev,
            existingAdditionalImages: prev.existingAdditionalImages.filter((_, i) => i !== index)
        }));
    };

    const addTagField = () => {
        setFormData({ ...formData, tags: [...formData.tags, ''] });
    };

    const removeTagField = (index) => {
        const newTags = formData.tags.filter((_, i) => i !== index);
        setFormData({ ...formData, tags: newTags });
    };

    const handleTagChange = (index, value) => {
        const newTags = [...formData.tags];
        newTags[index] = value;
        setFormData({ ...formData, tags: newTags });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.title) return toast.error("Title is required");
        if (!editingPost && !formData.thumbnail) return toast.error("Thumbnail is required");

        setIsSubmitting(true);
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('subheading', formData.subheading);
        submitData.append('description', formData.description);
        
        if (formData.thumbnail) {
            submitData.append('thumbnail', formData.thumbnail);
        } else if (editingPost) {
            submitData.append('existingThumbnail', formData.thumbnailPreview);
        }

        formData.tags.filter(t => t.trim()).forEach(tag => {
            submitData.append('tags', tag);
        });

        if (editingPost) {
            formData.existingAdditionalImages.forEach(img => {
                submitData.append('existingAdditionalImages', img);
            });
        }

        formData.additionalImages.forEach(file => {
            submitData.append('additionalImages', file);
        });

        try {
            if (editingPost) {
                await dispatch(updatePostToServer({ id: editingPost.id, formData: submitData })).unwrap();
                toast.success("Post updated successfully");
            } else {
                await dispatch(addPostToServer(submitData)).unwrap();
                toast.success("Post created successfully");
            }
            navigate('/dashboard/website/posts');
        } catch (error) {
            toast.error(error || "Failed to save post");
        } finally {
            setIsSubmitting(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'clean']
        ],
    };

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link'
    ];

    return (
        <div className="space-y-6 font-sans pb-10 pt-4">
            <div className="px-6">
                <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-8 space-y-8">
                    <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-wider mb-8">
                        {editingPost ? 'Edit Post' : 'Add New Post'}
                    </h2>

                    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter post title"
                                className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Subheading <span className="text-red-500">*</span>
                            </label>
                            <Input
                                required
                                value={formData.subheading}
                                onChange={e => setFormData({ ...formData, subheading: e.target.value })}
                                placeholder="Enter post subheading"
                                className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Thumbnail <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                    <input 
                                        type="file" 
                                        ref={thumbnailRef} 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleThumbnailChange} 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => thumbnailRef.current.click()}
                                        className="px-3 h-full bg-gray-100 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                                    >
                                        Choose File
                                    </button>
                                    <span className="px-3 text-gray-400 text-[11px] italic truncate">
                                        {formData.thumbnail ? formData.thumbnail.name : (editingPost ? 'Keep existing' : 'No file chosen')}
                                    </span>
                                </div>
                                {formData.thumbnailPreview && (
                                    <div className="relative w-40 aspect-video bg-gray-50 rounded-sm border border-gray-100 overflow-hidden">
                                        <img src={formData.thumbnailPreview} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <p className="text-[9px] text-gray-400 italic px-1 font-bold">Recommended size: 638x330 pixels. JPEG/PNG format, max 2MB.</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <div className="rounded-sm border border-gray-200 overflow-hidden">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={(content) => setFormData({ ...formData, description: content })}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    style={{ height: '300px', marginBottom: '40px' }}
                                    placeholder="Write your post content here..."
                                />
                            </div>
                        </div>


                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1 block">
                                Additional Images
                            </label>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.existingAdditionalImages.map((img, index) => (
                                    <div key={`existing-${index}`} className="relative aspect-video bg-gray-50 border border-gray-100 rounded-sm group">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {formData.additionalImagesPreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative aspect-video bg-gray-50 border border-emerald-100 rounded-sm group">
                                        <img src={preview} alt="" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                        <div className="absolute top-1 left-1 bg-emerald-500 text-white text-[8px] px-1 rounded uppercase font-bold">New</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20 max-w-sm">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        id="add-images"
                                        multiple 
                                        accept="image/*"
                                        onChange={handleAdditionalImagesChange} 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('add-images').click()}
                                        className="px-3 h-full bg-gray-100 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                                    >
                                        Add Images
                                    </button>
                                    <span className="px-3 text-gray-400 text-[11px] italic">Select multiple...</span>
                                </div>
                                <p className="text-[9px] text-gray-400 italic px-1 font-bold">Recommended size: 1085x645 pixels. Max 2MB each.</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1 block">
                                Tags <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {formData.tags.map((tag, index) => (
                                    <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded-sm border border-gray-100">
                                        <Input
                                            value={tag}
                                            onChange={e => handleTagChange(index, e.target.value)}
                                            placeholder="Tag"
                                            className="h-8 w-32 rounded-sm border-gray-200 text-[10px] focus:ring-1 focus:ring-[#0f172a]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeTagField(index)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={addTagField}
                                    className="h-8 bg-[#0f172a] hover:bg-[#151c63] text-white gap-2 rounded-sm px-4 text-[10px] font-bold transition-all border-none uppercase tracking-wider"
                                >
                                    <Plus size={12} /> Add Tag
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-start gap-4 pt-10 border-t border-gray-100">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#154c4c] hover:bg-[#0f3838] text-white h-11 text-[11px] font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider min-w-[160px]"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editingPost ? 'Update Post' : 'Create Post')}
                            </Button>
                            <Button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => navigate('/dashboard/website/posts')}
                                className="bg-[#b9875a] hover:bg-[#a6764a] text-white h-11 text-[11px] font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}







