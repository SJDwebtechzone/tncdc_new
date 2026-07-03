import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSelector, useDispatch } from 'react-redux';
import { updateAboutSettings } from '@/store/websiteSlice';

export default function WebsiteAboutPage() {
    const settings = useSelector((state) => state.website.aboutSettings);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(settings);

    const mainFileRef = useRef(null);
    const optional1FileRef = useRef(null);
    const optional2FileRef = useRef(null);

    const handleUpdate = () => {
        dispatch(updateAboutSettings(formData));
        alert("About section updated successfully!");
    };

    const triggerFileSelect = (ref) => {
        if (ref.current) ref.current.click();
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 px-6 pt-4">

            <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/30">
                    <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                        Edit About Section
                    </h2>
                </div>

                <div className="p-8 space-y-8">
                    {/* Image Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Image 1 (Main) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                    <input type="file" ref={mainFileRef} className="hidden" onChange={() => { }} />
                                    <button
                                        type="button"
                                        onClick={() => triggerFileSelect(mainFileRef)}
                                        className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                    >
                                        Choose File
                                    </button>
                                    <span className="px-3 text-gray-400 text-[11px] italic">No file chosen</span>
                                </div>
                                <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold leading-tight">
                                    Leave blank to keep existing Image. Image must be 400x400 pixels.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Image 2 (Optional) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                    <input type="file" ref={optional1FileRef} className="hidden" onChange={() => { }} />
                                    <button
                                        type="button"
                                        onClick={() => triggerFileSelect(optional1FileRef)}
                                        className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                    >
                                        Choose File
                                    </button>
                                    <span className="px-3 text-gray-400 text-[11px] italic">No file chosen</span>
                                </div>
                                <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold leading-tight">
                                    Leave blank to keep existing Image. Image must be 280x250 pixels.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image Row 2 & Subtitle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Image 3 (Optional) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                    <input type="file" ref={optional2FileRef} className="hidden" onChange={() => { }} />
                                    <button
                                        type="button"
                                        onClick={() => triggerFileSelect(optional2FileRef)}
                                        className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                    >
                                        Choose File
                                    </button>
                                    <span className="px-3 text-gray-400 text-[11px] italic">No file chosen</span>
                                </div>
                                <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold leading-tight">
                                    Leave blank to keep existing Image. Image must be 400x500 pixels.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Subtitle <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={formData.subtitle}
                                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                placeholder="Know About Us"
                                className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Know About Histudy <br /> Learning Platform"
                            className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                        />
                        <p className="text-[9px] text-gray-400 italic px-1 font-bold">Use &lt;br /&gt; for line breaks</p>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="min-h-[100px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                        />
                    </div>

                    {/* Features Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Feature 1 Icon <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={formData.feature1Icon}
                                onChange={e => setFormData({ ...formData, feature1Icon: e.target.value })}
                                placeholder="Heart"
                                className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Feature 1 Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={formData.feature1Title}
                                onChange={e => setFormData({ ...formData, feature1Title: e.target.value })}
                                placeholder="Flexible Classes"
                                className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                            />
                        </div>
                    </div>

                    {/* Feature 1 Description */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                            Feature 1 Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={formData.feature1Desc}
                            onChange={e => setFormData({ ...formData, feature1Desc: e.target.value })}
                            className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                        />
                    </div>

                    {/* Features Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Feature 2 Icon <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={formData.feature2Icon}
                                onChange={e => setFormData({ ...formData, feature2Icon: e.target.value })}
                                placeholder="Book"
                                className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Feature 2 Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={formData.feature2Title}
                                onChange={e => setFormData({ ...formData, feature2Title: e.target.value })}
                                placeholder="Learn From Anywhere"
                                className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                            />
                        </div>
                    </div>

                    {/* Feature 2 Description */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                            Feature 2 Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={formData.feature2Desc}
                            onChange={e => setFormData({ ...formData, feature2Desc: e.target.value })}
                            className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                        />
                    </div>

                    {/* Update Button */}
                    <div className="flex justify-start pt-6 border-t border-gray-100">
                        <Button
                            onClick={handleUpdate}
                            className="bg-[#ebca52] hover:bg-[#d9b942] text-white h-10 text-[11px] font-bold px-10 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                        >
                            Update About Section
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}






