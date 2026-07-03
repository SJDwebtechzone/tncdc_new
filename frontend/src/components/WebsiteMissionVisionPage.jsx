import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSelector, useDispatch } from 'react-redux';
import { updateMissionVision, fetchMissionVision } from '@/store/websiteSlice';
import { API_URL } from '@/config';

export default function WebsiteMissionVisionPage() {
    const settings = useSelector((state) => state.website.missionVisionSettings);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(settings);

    useEffect(() => {
        dispatch(fetchMissionVision());
    }, [dispatch]);

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const videoImageRef = useRef(null);
    const visionImage1Ref = useRef(null);
    const visionImage2Ref = useRef(null);
    const visionImage3Ref = useRef(null);
    const missionImage1Ref = useRef(null);
    const missionImage2Ref = useRef(null);
    const missionImage3Ref = useRef(null);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                [`${field}File`]: file,
                [`${field}Preview`]: URL.createObjectURL(file)
            }));
        }
    };

    const handleUpdate = async () => {
        try {
            await dispatch(updateMissionVision(formData)).unwrap();
            alert("Mission & Vision sections updated successfully!");
        } catch (error) {
            alert("Failed to update: " + error);
        }
    };

    const triggerFileSelect = (ref) => {
        if (ref.current) ref.current.click();
    };

    const renderImagePreview = (field, currentImage, previewImage) => {
        const displayImage = previewImage || (currentImage ? `${API_URL}${currentImage}` : null);
        return (
            <div className="mt-2 relative w-24 h-24 border rounded-sm overflow-hidden bg-gray-50 flex items-center justify-center">
                {displayImage ? (
                    <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-2 text-center">No Image</span>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 px-6 pt-4">

            <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/30">
                    <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                        Edit Mission & Vision Sections
                    </h2>
                </div>

                <div className="p-8 space-y-10 font-sans">
                    {/* Banner Section */}
                    <div className="space-y-6">
                        <h3 className="text-[13px] font-bold text-gray-800">
                            Banner Section
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Badge Text <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.bannerBadgeText || ''}
                                    onChange={e => setFormData({ ...formData, bannerBadgeText: e.target.value })}
                                    placeholder="The Leader in Online Learning"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Badge Icon (Emoji) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.bannerBadgeIcon || ''}
                                    onChange={e => setFormData({ ...formData, bannerBadgeIcon: e.target.value })}
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                                <p className="text-[9px] text-gray-400 italic px-1 font-bold">Enter an emoji (e.g., 👤, ⭐, 🎓).</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                value={formData.bannerDesc || ''}
                                onChange={e => setFormData({ ...formData, bannerDesc: e.target.value })}
                                className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                            />
                        </div>
                    </div>

                    {/* Video Section */}
                    <div className="space-y-6">
                        <h3 className="text-[13px] font-bold text-gray-800">
                            Video Section
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Video Image <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input type="file" ref={videoImageRef} className="hidden" onChange={(e) => handleFileChange(e, 'videoImage')} />
                                        <button
                                            type="button"
                                            onClick={() => triggerFileSelect(videoImageRef)}
                                            className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-400 text-[11px] italic">
                                            {formData.videoImageFile ? formData.videoImageFile.name : "No file chosen"}
                                        </span>
                                    </div>
                                    {renderImagePreview('videoImage', formData.videoImage, formData.videoImagePreview)}
                                    <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold leading-tight">
                                        Leave blank to keep existing image.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Video URL <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.videoUrl || ''}
                                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                    placeholder="https://www.youtube.com/watch?v=nAIaqp0sPQo"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vision Section */}
                    <div className="space-y-6">
                        <h3 className="text-[13px] font-bold text-gray-800">
                            Vision Section
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Image 1 (Main) <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input type="file" ref={visionImage1Ref} className="hidden" onChange={(e) => handleFileChange(e, 'visionImage1')} />
                                        <button
                                            type="button"
                                            onClick={() => triggerFileSelect(visionImage1Ref)}
                                            className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-400 text-[11px] italic">
                                            {formData.visionImage1File ? formData.visionImage1File.name : "No file chosen"}
                                        </span>
                                    </div>
                                    {renderImagePreview('visionImage1', formData.visionImage1, formData.visionImage1Preview)}
                                    <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold leading-tight">
                                        Leave blank to keep existing image.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Image 2 (Optional) <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input type="file" ref={visionImage2Ref} className="hidden" onChange={(e) => handleFileChange(e, 'visionImage2')} />
                                        <button
                                            type="button"
                                            onClick={() => triggerFileSelect(visionImage2Ref)}
                                            className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-400 text-[11px] italic">
                                            {formData.visionImage2File ? formData.visionImage2File.name : "No file chosen"}
                                        </span>
                                    </div>
                                    {renderImagePreview('visionImage2', formData.visionImage2, formData.visionImage2Preview)}
                                    <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold leading-tight">
                                        Leave blank to keep existing image.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Image 3 (Optional) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col gap-2 max-w-[calc(50%-16px)]">
                                <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                    <input type="file" ref={visionImage3Ref} className="hidden" onChange={(e) => handleFileChange(e, 'visionImage3')} />
                                    <button
                                        type="button"
                                        onClick={() => triggerFileSelect(visionImage3Ref)}
                                        className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                    >
                                        Choose File
                                    </button>
                                    <span className="px-3 text-gray-400 text-[11px] italic">
                                        {formData.visionImage3File ? formData.visionImage3File.name : "No file chosen"}
                                    </span>
                                </div>
                                {renderImagePreview('visionImage3', formData.visionImage3, formData.visionImage3Preview)}
                                <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold leading-tight">
                                    Leave blank to keep existing image.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                value={formData.visionTitle || ''}
                                onChange={e => setFormData({ ...formData, visionTitle: e.target.value })}
                                placeholder="Know About Histudy <br /> Learning Platform"
                                className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                            />
                            <p className="text-[9px] text-gray-400 italic px-1 font-bold">Use &lt;br /&gt; for line breaks.</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                value={formData.visionDesc || ''}
                                onChange={e => setFormData({ ...formData, visionDesc: e.target.value })}
                                className="min-h-[100px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                            />
                        </div>

                        {/* Vision Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">
                            {[1, 2, 3].map(num => (
                                <React.Fragment key={num}>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                            Feature {num} Icon <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData[`visionFeature${num}Icon`] || ''}
                                            onChange={e => setFormData({ ...formData, [`visionFeature${num}Icon`]: e.target.value })}
                                            className="w-full h-10 px-3 rounded-sm border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0f172a] bg-white"
                                        >
                                            <option value="">Select Icon</option>
                                            <option value="Heart">Heart</option>
                                            <option value="BookOpen">Book</option>
                                            <option value="Monitor">Monitor</option>
                                            <option value="Globe">Globe</option>
                                            <option value="User">User</option>
                                            <option value="GraduationCap">Degree</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                            Feature {num} Title <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={formData[`visionFeature${num}Title`] || ''}
                                            onChange={e => setFormData({ ...formData, [`visionFeature${num}Title`]: e.target.value })}
                                            placeholder="Flexible Classes"
                                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-1">
                                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                            Feature {num} Description <span className="text-red-500">*</span>
                                        </label>
                                        <Textarea
                                            value={formData[`visionFeature${num}Desc`] || ''}
                                            onChange={e => setFormData({ ...formData, [`visionFeature${num}Desc`]: e.target.value })}
                                            className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                                        />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Mission Section */}
                    <div className="space-y-6">
                        <h3 className="text-[13px] font-bold text-gray-800">
                            Mission Section
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Image 1 (Main) <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input type="file" ref={missionImage1Ref} className="hidden" onChange={(e) => handleFileChange(e, 'missionImage1')} />
                                        <button
                                            type="button"
                                            onClick={() => triggerFileSelect(missionImage1Ref)}
                                            className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-400 text-[11px] italic">
                                            {formData.missionImage1File ? formData.missionImage1File.name : "No file chosen"}
                                        </span>
                                    </div>
                                    {renderImagePreview('missionImage1', formData.missionImage1, formData.missionImage1Preview)}
                                    <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold leading-tight">
                                        Leave blank to keep existing image.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Image 2 (Optional) <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input type="file" ref={missionImage2Ref} className="hidden" onChange={(e) => handleFileChange(e, 'missionImage2')} />
                                        <button
                                            type="button"
                                            onClick={() => triggerFileSelect(missionImage2Ref)}
                                            className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-400 text-[11px] italic">
                                            {formData.missionImage2File ? formData.missionImage2File.name : "No file chosen"}
                                        </span>
                                    </div>
                                    {renderImagePreview('missionImage2', formData.missionImage2, formData.missionImage2Preview)}
                                    <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold leading-tight">
                                        Leave blank to keep existing image.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Image 3 (Optional) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col gap-2 max-w-[calc(50%-16px)]">
                                <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                    <input type="file" ref={missionImage3Ref} className="hidden" onChange={(e) => handleFileChange(e, 'missionImage3')} />
                                    <button
                                        type="button"
                                        onClick={() => triggerFileSelect(missionImage3Ref)}
                                        className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                    >
                                        Choose File
                                    </button>
                                    <span className="px-3 text-gray-400 text-[11px] italic">
                                        {formData.missionImage3File ? formData.missionImage3File.name : "No file chosen"}
                                    </span>
                                </div>
                                {renderImagePreview('missionImage3', formData.missionImage3, formData.missionImage3Preview)}
                                <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold leading-tight">
                                    Leave blank to keep existing image.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                value={formData.missionTitle || ''}
                                onChange={e => setFormData({ ...formData, missionTitle: e.target.value })}
                                placeholder="Know About Histudy <br /> Learning Platform"
                                className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                            />
                            <p className="text-[9px] text-gray-400 italic px-1 font-bold">Use &lt;br /&gt; for line breaks.</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                value={formData.missionDesc || ''}
                                onChange={e => setFormData({ ...formData, missionDesc: e.target.value })}
                                className="min-h-[100px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                            />
                        </div>

                        {/* Mission Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">
                            {[1, 2, 3].map(num => (
                                <React.Fragment key={num}>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                            Feature {num} Icon <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData[`missionFeature${num}Icon`] || ''}
                                            onChange={e => setFormData({ ...formData, [`missionFeature${num}Icon`]: e.target.value })}
                                            className="w-full h-10 px-3 rounded-sm border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#0f172a] bg-white"
                                        >
                                            <option value="">Select Icon</option>
                                            <option value="Heart">Heart</option>
                                            <option value="BookOpen">Book</option>
                                            <option value="Monitor">Monitor</option>
                                            <option value="Globe">Globe</option>
                                            <option value="User">User</option>
                                            <option value="GraduationCap">Degree</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                            Feature {num} Title <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={formData[`missionFeature${num}Title`] || ''}
                                            onChange={e => setFormData({ ...formData, [`missionFeature${num}Title`]: e.target.value })}
                                            placeholder="Flexible Classes"
                                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-1">
                                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                            Feature {num} Description <span className="text-red-500">*</span>
                                        </label>
                                        <Textarea
                                            value={formData[`missionFeature${num}Desc`] || ''}
                                            onChange={e => setFormData({ ...formData, [`missionFeature${num}Desc`]: e.target.value })}
                                            className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                                        />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Update Button */}
                    <div className="flex justify-start pt-6 border-t border-gray-100">
                        <Button
                            onClick={handleUpdate}
                            className="bg-[#ebca52] hover:bg-[#d9b942] text-white h-10 text-[11px] font-bold px-10 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                        >
                            Update All Sections
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}






