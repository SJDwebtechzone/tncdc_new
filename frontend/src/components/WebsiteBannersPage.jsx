import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSelector, useDispatch } from 'react-redux';
import { saveBannerSettings, fetchSlides } from '@/store/websiteSlice';
import { BASE_URL } from '@/config';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

export default function WebsiteBannersPage() {
    const settings = useSelector((state) => state.website.bannerSettings);
    const slidesList = useSelector((state) => state.website.slides || []);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(settings);
    const [preview, setPreview] = useState(settings?.imageUrl || '');
    const [slides, setSlides] = useState([]);
    
    // Slide Form State
    const [slideForm, setSlideForm] = useState({
        title: '',
        subtitle: '',
        link: '',
        order: 1,
        imageUrl: ''
    });
    const [slidePreview, setSlidePreview] = useState('');
    const slideFileRef = useRef(null);

    useEffect(() => {
        if(settings) {
            setFormData(settings);
            setPreview(settings.imageUrl || '');
        }
    }, [settings]);

    useEffect(() => {
        dispatch(fetchSlides());
    }, [dispatch]);

    useEffect(() => {
        setSlides(slidesList);
    }, [slidesList]);

    const bannerFileRef = useRef(null);

    const handleUpdate = () => {
        dispatch(saveBannerSettings(formData)).then(() => {
            alert("Banner settings updated successfully!");
        });
    };

    const triggerFileSelect = (ref) => {
        if (ref.current) ref.current.click();
    };

    const handleBannerImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            setPreview(tempUrl);
            const fd = new FormData();
            fd.append('file', file);
            try {
                const res = await fetch(`${BASE_URL}/api/profile/upload`, {
                    method: 'POST',
                    body: fd
                });
                const data = await res.json();
                setFormData(prev => ({ ...prev, imageUrl: data.fileUrl }));
            } catch (err) {
                console.error("Upload failed", err);
                alert("Upload failed, please try again.");
            }
        }
    };

    const handleSlideImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            setSlidePreview(tempUrl);
            const fd = new FormData();
            fd.append('file', file);
            try {
                const res = await fetch(`${BASE_URL}/api/profile/upload`, {
                    method: 'POST',
                    body: fd
                });
                const data = await res.json();
                setSlideForm(prev => ({ ...prev, imageUrl: data.fileUrl }));
            } catch (err) {
                console.error("Upload failed", err);
                alert("Upload failed, please try again.");
            }
        }
    };

    const handleAddSlide = async () => {
        if (!slideForm.imageUrl) {
            alert("Image is required to add a slide.");
            return;
        }

        try {
            await axios.post(`${BASE_URL}/api/website-banners/slides`, slideForm);
            dispatch(fetchSlides());
            setSlideForm({ title: '', subtitle: '', link: '', order: slides.length + 2, imageUrl: '' });
            setSlidePreview('');
        } catch (err) {
            console.error("Error adding slide:", err);
            alert("Failed to add slide.");
        }
    };

    const handleDeleteSlide = async (id) => {
        if (!window.confirm("Are you sure you want to delete this slide?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/website-banners/slides/${id}`);
            dispatch(fetchSlides());
        } catch (err) {
            console.error("Error deleting slide:", err);
            alert("Failed to delete slide.");
        }
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 px-6 pt-4">

            {/* MAIN BANNER SETTINGS CARD */}
            <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-[#357367]/80 text-white rounded-t">
                    <h2 className="text-[14px] font-semibold tracking-wider">
                        Banner / Slider Management
                    </h2>
                </div>

                <div className="p-8 space-y-8">
                    {/* Display Mode Toggle */}
                    <div className="flex items-center gap-4">
                        <span className="text-[13px] font-bold text-gray-700 tracking-wide">Display Mode:</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-[12px] font-bold ${formData.displayMode === 'banner' ? 'text-orange-400' : 'text-gray-400'}`}>Banner</span>
                            <Switch
                                checked={formData.displayMode === 'slider'}
                                onCheckedChange={(checked) => setFormData({ ...formData, displayMode: checked ? 'slider' : 'banner' })}
                                className="data-[state=checked]:bg-orange-400 data-[state=unchecked]:bg-gray-200 shadow"
                            />
                            <span className={`text-[12px] font-bold ${formData.displayMode === 'slider' ? 'text-orange-400' : 'text-gray-400'}`}>Slider</span>
                        </div>
                    </div>

                    {formData.displayMode === 'banner' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Main Image */}
                                <div className="space-y-1">
                                    <label className="text-[12px] text-gray-500 ml-1">
                                        Main Image <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        {preview && (
                                            <div className="w-full max-w-[200px] h-32 rounded-sm border border-gray-200 overflow-hidden relative group">
                                                <img src={preview.startsWith('/uploads') ? `${BASE_URL}${preview}` : preview} alt="Banner Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                            <input type="file" ref={bannerFileRef} className="hidden" onChange={handleBannerImageChange} accept="image/*" />
                                            <button
                                                type="button"
                                                onClick={() => triggerFileSelect(bannerFileRef)}
                                                className="px-3 h-full bg-gray-100 border-r border-gray-200 text-[12px] text-gray-700 hover:bg-gray-200 transition-colors"
                                            >
                                                Choose File
                                            </button>
                                            <span className="px-3 text-gray-400 text-[12px]">{preview ? 'File Selected' : 'No file chosen'}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-sans leading-tight">
                                            Recommended size: 1200x1400px.
                                        </p>
                                    </div>
                                </div>

                                {/* Badge Text */}
                                <div className="space-y-1">
                                    <label className="text-[12px] text-gray-500 ml-1">
                                        Badge Text <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        value={formData.badgeText}
                                        onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                                        placeholder="The Leader in Online Learning"
                                        className="h-10 rounded-sm border-gray-200 focus:ring-1"
                                    />
                                </div>
                            </div>

                            {/* Badge Icon (Emoji) */}
                            <div className="space-y-1">
                                <label className="text-[12px] text-gray-500 ml-1">
                                    Badge Icon (Emoji) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.badgeIcon}
                                    onChange={e => setFormData({ ...formData, badgeIcon: e.target.value })}
                                    placeholder="👤"
                                    className="h-10 rounded-sm border-gray-200 max-w-sm focus:ring-1"
                                />
                            </div>

                            {/* Title */}
                            <div className="space-y-1">
                                <label className="text-[12px] text-gray-500 ml-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Build The Skills <br /> To Drive Your Career."
                                    className="min-h-[80px] rounded-sm border-gray-200 leading-relaxed p-3 focus:ring-1"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-[12px] text-gray-500 ml-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="min-h-[100px] rounded-sm border-gray-200 leading-relaxed p-3 focus:ring-1"
                                />
                            </div>
                        </>
                    )}

                    {/* Update Settings Button */}
                    <div className="flex justify-start">
                        <Button
                            onClick={handleUpdate}
                            className="bg-[#245344] hover:bg-[#1a3d32] text-white h-9 px-6 rounded text-[13px] tracking-wide"
                        >
                            {formData.displayMode === 'banner' ? 'Update Banner Settings' : 'Save Mode Setup'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* SLIDER MANAGEMENT UI */}
            {formData.displayMode === 'slider' && (
                <div className="space-y-6">
                    {/* Add New Slide Form */}
                    <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden mt-6">
                        <div className="p-4 border-b border-gray-100 bg-[#0f2868] text-white">
                            <h2 className="text-[14px] font-semibold">Add New Slide</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[12px] text-gray-500 ml-1">Title (Optional)</label>
                                    <Input 
                                        value={slideForm.title} 
                                        onChange={e => setSlideForm({...slideForm, title: e.target.value})} 
                                        placeholder="Slide title" 
                                        className="h-10 rounded-sm border-gray-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] text-gray-500 ml-1">Subtitle (Optional)</label>
                                    <Input 
                                        value={slideForm.subtitle} 
                                        onChange={e => setSlideForm({...slideForm, subtitle: e.target.value})} 
                                        placeholder="Slide subtitle" 
                                        className="h-10 rounded-sm border-gray-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] text-gray-500 ml-1">Link (Optional)</label>
                                    <Input 
                                        value={slideForm.link} 
                                        onChange={e => setSlideForm({...slideForm, link: e.target.value})} 
                                        placeholder="https://example.com" 
                                        className="h-10 rounded-sm border-gray-200 focus:ring-opacity-50"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Link will open in a new tab when slide is clicked</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] text-gray-500 ml-1">Image <span className="text-red-500">*</span></label>
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm">
                                        <input type="file" ref={slideFileRef} className="hidden" onChange={handleSlideImageChange} accept="image/*" />
                                        <button
                                            type="button"
                                            onClick={() => triggerFileSelect(slideFileRef)}
                                            className="px-3 h-full bg-gray-100 border-r border-gray-200 text-[12px] hover:bg-gray-200 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-500 text-[12px]">{slidePreview ? "File Ready" : "No file chosen"}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Recommended size: 1000x400px</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] text-gray-500 ml-1">Order</label>
                                    <Input 
                                        type="number"
                                        value={slideForm.order} 
                                        onChange={e => setSlideForm({...slideForm, order: e.target.value})} 
                                        className="h-10 rounded-sm border-gray-200 focus:ring-opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <Button
                                    onClick={handleAddSlide}
                                    className="bg-[#245344] hover:bg-[#1a3d32] text-white h-9 px-8 rounded text-[13px] font-semibold"
                                >
                                    Add Slide
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Manage Slides */}
                    <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-[#c09062] text-white">
                            <h2 className="text-[14px] font-semibold">Manage Slides ({slides.length} slides)</h2>
                        </div>
                        <div className="p-6">
                            {slides.length === 0 ? (
                                <div className="bg-gray-400 text-white p-3 rounded text-sm text-center">
                                    No slides added yet. Add your first slide using the form above.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {slides.map(slide => (
                                        <div key={slide.id} className="border border-gray-200 rounded overflow-hidden shadow-sm hover:shadow relative group">
                                            <div className="h-40 w-full bg-gray-100">
                                                <img src={slide.imageUrl?.startsWith('/uploads') ? `${BASE_URL}${slide.imageUrl}` : slide.imageUrl} alt="Slide Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="p-3 bg-white">
                                                <p className="font-bold text-sm truncate">{slide.title || 'Untitled'}</p>
                                                <p className="text-xs text-gray-500 truncate">{slide.subtitle || 'No subtitle'}</p>
                                                <p className="text-xs text-green-600 mt-1">Order: {slide.order}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteSlide(slide.id)} 
                                                className="absolute top-2 right-2 bg-white rounded-full p-2 text-red-500 opacity-0 group-hover:opacity-100 transition shadow hover:bg-red-500 hover:text-white"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
