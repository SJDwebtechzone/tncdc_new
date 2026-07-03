import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Check } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { updateSiteSettings, saveSiteSettings } from '@/store/websiteSlice';


export default function WebsiteSiteSettingPage() {
    const settings = useSelector((state) => state.website.siteSettings);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(settings);

    const logoRef = useRef(null);
    const faviconRef = useRef(null);

    const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "image/png") {
        alert("Only PNG files are allowed.");
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        alert("File must be under 2MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        setFormData({ ...formData, logo: event.target.result });
    };
    reader.readAsDataURL(file);
};

  const handleUpdate = async () => {
    dispatch(updateSiteSettings(formData));        // updates Redux instantly
    await dispatch(saveSiteSettings(formData));    // saves to PostgreSQL
    alert("Site settings updated successfully!");
};

    const addMarquee = () => setFormData({ ...formData, marqueeEntries: [...formData.marqueeEntries, ""] });
    const removeMarquee = (index) => setFormData({ ...formData, marqueeEntries: formData.marqueeEntries.filter((_, i) => i !== index) });
    const updateMarquee = (index, value) => {
        const newEntries = [...formData.marqueeEntries];
        newEntries[index] = value;
        setFormData({ ...formData, marqueeEntries: newEntries });
    };

    const triggerFileSelect = (ref) => {
        if (ref?.current) ref.current.click();
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 pt-4">

            <div className="px-6 space-y-4">
                <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-10 space-y-12">
                    <h1 className="text-[18px] font-bold text-gray-800 -mt-2 mb-8">Edit Site Settings</h1>

                    {/* Header Display Section */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">Header Display</h3>
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Header Type <span className="text-red-500">*</span></label>
                        </div>
                        <div className="flex items-center gap-8 pt-1">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="headerType"
                                    checked={formData.headerType === 'logo'}
                                    onChange={() => setFormData({ ...formData, headerType: 'logo' })}
                                    className="w-4 h-4 text-[#0f172a] border-gray-300 focus:ring-[#0f172a]"
                                />
                                <span className="text-[13px] font-medium text-gray-700">Logo</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="headerType"
                                    checked={formData.headerType === 'banner'}
                                    onChange={() => setFormData({ ...formData, headerType: 'banner' })}
                                    className="w-4 h-4 text-[#0f172a] border-gray-300 focus:ring-[#0f172a]"
                                />
                                <span className="text-[13px] font-medium text-gray-700">Banner Image</span>
                            </label>
                        </div>
                        <p className="text-[11px] text-gray-400 italic">Choose whether to display a logo or banner in the website header.</p>
                    </div>

                    {/* Images Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">Images</h3>
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Logo</label>
                                <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-white">
<input type="file" ref={logoRef} className="hidden" accept="image/png" onChange={handleLogoChange} />                                    <button
                                        type="button"
                                        onClick={() => triggerFileSelect(logoRef)}
                                        className="px-4 h-full bg-gray-100 border-r border-gray-200 text-[11px] font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        Choose File
                                    </button>
                                    <span className="px-3 text-gray-400 text-[11px] italic">No file chosen</span>
                                </div>
                                <p className="text-[10px] text-gray-400 italic">PNG only, max 2MB. Leave blank to keep existing.</p>
                                <div className="mt-4 w-20 h-20 bg-gray-50 rounded-sm border border-gray-100 flex items-center justify-center overflow-hidden p-2">
                                    {formData.logo && <img src={formData.logo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 md:pt-11">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Favicon</label>
                                <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-white">
                                    <input type="file" ref={faviconRef} className="hidden" onChange={() => { }} />
                                    <button
                                        type="button"
                                        onClick={() => triggerFileSelect(faviconRef)}
                                        className="px-4 h-full bg-gray-100 border-r border-gray-200 text-[11px] font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        Choose File
                                    </button>
                                    <span className="px-3 text-gray-400 text-[11px] italic">No file chosen</span>
                                </div>
                                <p className="text-[10px] text-gray-400 italic">JPEG/PNG/JPG/ICO, max 2MB. Leave blank to keep existing. ✨</p>
                                <div className="mt-4 w-8 h-8 flex items-center justify-center">
                                    {formData.favicon && <img src={formData.favicon} alt="Favicon Preview" className="w-full h-full object-contain" />}
                                    {!formData.favicon && <div className="w-6 h-6 bg-blue-500 rounded-sm" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* URL & Store Links Section */}
                    <div className="space-y-6">
                        <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">Base URLs & Store Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Website URL <span className="text-red-500">*</span></label>
                                <Input
                                    value={formData.websiteUrl}
                                    onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                                    className="h-10 border-gray-200 rounded-sm text-xs focus:ring-1 focus:ring-[#0f172a] font-bold"
                                    placeholder="e.g. http://192.168.1.5:5173"
                                />
                                <p className="text-[10px] text-gray-400 italic">Essential for QR Codes. Use your IP for local phone testing.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Play Store Link</label>
                                <Input
                                    value={formData.playStoreLink}
                                    onChange={e => setFormData({ ...formData, playStoreLink: e.target.value })}
                                    className="h-10 border-gray-200 rounded-sm text-xs focus:ring-1 focus:ring-[#0f172a] placeholder:italic"
                                    placeholder="https://play.google.com/store/apps/details?id=com.example.app"
                                />
                                <p className="text-[10px] text-gray-400 italic">Optional. Enter a valid URL.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">App Store Link</label>
                                <Input
                                    value={formData.appStoreLink}
                                    onChange={e => setFormData({ ...formData, appStoreLink: e.target.value })}
                                    className="h-10 border-gray-200 rounded-sm text-xs focus:ring-1 focus:ring-[#0f172a] placeholder:italic"
                                    placeholder="https://www.apple.com/app-store/"
                                />
                                <p className="text-[10px] text-gray-400 italic">Optional. Enter a valid URL.</p>
                            </div>
                        </div>
                    </div>

                    {/* Brand Colors Section */}
                    {/* Brand Colors Section */}
<div className="space-y-6">
    <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">Brand Colors</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Primary Color <span className="text-red-500">*</span></label>
            <div className="flex h-10 w-full rounded-sm border border-gray-200 overflow-hidden shadow-sm">
                <div className="flex items-center px-4 bg-[#0f172a] text-white text-[10px] font-bold w-24">
                    {formData.primaryColor || '#10b981'}
                </div>
                <div className="flex-1 relative" style={{ backgroundColor: formData.primaryColor || '#10b981' }}>
                    <input
                        type="color"
                        value={formData.primaryColor || '#10b981'}
                        onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>
            <p className="text-[10px] text-gray-400 italic">Click the color bar to change. Used for buttons, links, and accents.</p>
        </div>
        <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Secondary Color <span className="text-red-500">*</span></label>
            <div className="flex h-10 w-full rounded-sm border border-gray-200 overflow-hidden shadow-sm">
                <div className="flex items-center px-4 bg-black text-white text-[10px] font-bold w-24">
                    {formData.secondaryColor || '#059669'}
                </div>
                <div className="flex-1 relative" style={{ backgroundColor: formData.secondaryColor || '#059669' }}>
                    <input
                        type="color"
                        value={formData.secondaryColor || '#059669'}
                        onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>
            <p className="text-[10px] text-gray-400 italic">Click the color bar to change. Used for secondary elements and highlights.</p>
        </div>
    </div>
</div>
                    {/* Marquee Entries Section */}
                    <div className="space-y-6">
                        <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">Marquee Entries</h3>
                        <div className="space-y-6 relative">
                            {formData.marqueeEntries.map((entry, index) => (
                                <div key={index} className="flex gap-4 items-center group relative border-l-2 border-blue-500 pl-4 py-1">
                                    <Input
                                        value={entry}
                                        onChange={(e) => updateMarquee(index, e.target.value)}
                                        className="flex-1 h-10 bg-white border-gray-200 rounded-sm text-xs focus:ring-1 focus:ring-[#0f172a]"
                                        placeholder="Enter marquee text..."
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => removeMarquee(index)}
                                        className="text-gray-600 hover:text-red-500 hover:bg-red-50 h-10 px-6 rounded-sm border-gray-200 text-xs font-bold transition-all"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <div className="pt-2">
                                <Button
                                    onClick={addMarquee}
                                    className="bg-[#0f172a] hover:bg-[#151c63] text-white h-9 px-6 rounded-sm font-bold flex items-center gap-2 transition-all border-none text-[10px] uppercase tracking-wider"
                                >
                                    <Plus size={14} />
                                    Add New Entry
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex justify-start">
                        <Button
                            onClick={handleUpdate}
                            className="bg-[#ebca52] hover:bg-[#d9b942] text-[#0f172a] h-10 px-12 rounded-sm font-bold uppercase tracking-wider transition-all border-none flex items-center gap-2 text-xs shadow-sm"
                        >
                            Update All Settings
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}






