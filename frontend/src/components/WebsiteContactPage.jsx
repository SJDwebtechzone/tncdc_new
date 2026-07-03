import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSelector, useDispatch } from 'react-redux';
import { updateContactSettingsFromServer, fetchContactSettings } from '@/store/websiteSlice';
import { useEffect } from 'react';
import { Loader2 } from "lucide-react";

export default function WebsiteContactPage() {
    const settings = useSelector((state) => state.website.contactSettings);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        dispatch(fetchContactSettings());
    }, [dispatch]);

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            await dispatch(updateContactSettingsFromServer(formData)).unwrap();
            alert("Contact section updated successfully!");
        } catch (error) {
            alert("Failed to update contact section: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 px-6 pt-4">

            <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/30">
                    <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                        Edit Contact Section
                    </h2>
                </div>

                <div className="p-8 space-y-10">
                    {/* General Section */}
                    <div className="space-y-6">
                        <h3 className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wider border-l-4 border-[#0f172a] pl-3">
                            General
                        </h3>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Histudy Course Contact <br> can join with us."
                                className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                            />
                            <p className="text-[9px] text-gray-400 italic px-1 font-bold">Use &lt;br&gt; for line breaks.</p>
                        </div>
                    </div>

                    {/* Phone & Email Section */}
                    <div className="space-y-6">
                        <h3 className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wider border-l-4 border-[#0f172a] pl-3">
                            Phone & Email
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Phone 1 <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.phone1}
                                    onChange={e => setFormData({ ...formData, phone1: e.target.value })}
                                    placeholder="+444 555 666 777"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Phone 2 (Optional)
                                </label>
                                <Input
                                    value={formData.phone2}
                                    onChange={e => setFormData({ ...formData, phone2: e.target.value })}
                                    placeholder="+222 222 222 333"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Whatsapp Number
                                </label>
                                <Input
                                    value={formData.whatsapp}
                                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                    Email 1 <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.email1}
                                    onChange={e => setFormData({ ...formData, email1: e.target.value })}
                                    placeholder="admin@gmail.com"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Block Section */}
                    <div className="space-y-6">
                        <h3 className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wider border-l-4 border-[#0f172a] pl-3">
                            Location Block
                        </h3>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                placeholder="5678 Bangla Main Road, cities 580 <br> GBnagla, example 54786"
                                className="min-h-[80px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                            />
                            <p className="text-[9px] text-gray-400 italic px-1 font-bold">Use &lt;br&gt; for line breaks.</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">
                                Map <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                value={formData.mapIframe}
                                onChange={e => setFormData({ ...formData, mapIframe: e.target.value })}
                                placeholder="Paste Google Map iframe here."
                                className="min-h-[100px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] leading-relaxed p-3 bg-gray-50/20"
                            />
                            <p className="text-[9px] text-gray-400 italic px-1 font-bold">Paste Google Map iframe here.</p>
                        </div>
                    </div>

                    {/* Update Button */}
                    <div className="flex justify-start pt-6 border-t border-gray-100">
                        <Button
                            onClick={handleUpdate}
                            disabled={isSaving}
                            className="bg-[#ebca52] hover:bg-[#d9b942] text-white h-10 text-[11px] font-bold px-10 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider disabled:opacity-70"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Contact Section"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}






