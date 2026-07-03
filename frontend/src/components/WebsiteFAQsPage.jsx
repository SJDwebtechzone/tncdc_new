import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit2, Trash2, Check, Layout, X, Monitor, Upload } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { addFAQObj, updateFAQObj, deleteFAQObj, saveFAQBanners } from '@/store/websiteSlice';
import { BASE_URL } from '@/config';

export default function WebsiteFAQsPage() {
    const settings = useSelector((state) => state.website.faqSettings);
    const faqs = useSelector((state) => state.website.faqs || []);
    const dispatch = useDispatch();

    const [banner1Preview, setBanner1Preview] = useState(settings.banner1 || '');
    const [banner2Preview, setBanner2Preview] = useState(settings.banner2 || '');

    React.useEffect(() => {
        setBanner1Preview(settings.banner1 || '');
        setBanner2Preview(settings.banner2 || '');
    }, [settings]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        status: true
    });

    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);
    const modalFileInputRef = useRef(null);

    const [editingId, setEditingId] = useState(null);

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const uploadImage = async (file) => {
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            const res = await fetch(`${BASE_URL}/api/profile/upload`, {
                method: 'POST',
                body: uploadFormData
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Upload failed');
            }
            const data = await res.json();
            return data.fileUrl;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    };

    const handleUpdateSettings = async (bannerNum) => {
        const fileInput = bannerNum === 1 ? fileInputRef1 : fileInputRef2;
        const file = fileInput.current?.files?.[0];
        let newUrl = null;
        if (file) {
            try {
                newUrl = await uploadImage(file);
            } catch (e) {
                alert("Upload failed.");
                return;
            }
        }
        
        const payload = {
            banner1: bannerNum === 1 ? (newUrl || banner1Preview) : banner1Preview,
            banner2: bannerNum === 2 ? (newUrl || banner2Preview) : banner2Preview,
        };
        
        if (bannerNum === 1 && newUrl) setBanner1Preview(newUrl);
        if (bannerNum === 2 && newUrl) setBanner2Preview(newUrl);

        dispatch(saveFAQBanners(payload)).then(() => {
             alert(`FAQ Banner ${bannerNum} settings updated!`);
        });
    };

    const handleEditFAQ = (faq) => {
        setFormData({
            question: faq.question,
            answer: faq.answer,
            status: faq.status
        });
        setEditingId(faq.id);
        setIsModalOpen(true);
    };

    const handleSaveFAQ = (e) => {
        e.preventDefault();
        if (editingId) {
            dispatch(updateFAQObj({ ...formData, id: editingId }));
        } else {
            dispatch(addFAQObj(formData));
        }
        setIsModalOpen(false);
        setFormData({ question: '', answer: '', status: true });
        setEditingId(null);
    };

    const handleDeleteFAQ = (id) => {
        if (window.confirm("Delete this FAQ?")) {
            dispatch(deleteFAQObj(id));
        }
    };

    const triggerFileSelect = (ref) => {
        if (ref.current) ref.current.click();
    };

    const handleFilePreview = (e, bannerNum) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (bannerNum === 1) setBanner1Preview(url);
            if (bannerNum === 2) setBanner2Preview(url);
        }
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 pt-4">

            <div className="px-6 space-y-6">
                {/* FAQ Page Banners Section */}
                <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/30">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            FAQ Page Banners
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Banner 1 */}
                            <div className="space-y-4">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Banner Image 1</label>
                                <div className="border border-dashed border-gray-200 rounded-sm aspect-video flex flex-col items-center justify-center bg-gray-50/20 text-gray-400 gap-2 overflow-hidden relative">
                                    {banner1Preview ? (
                                        <img src={banner1Preview.startsWith('/uploads') ? `${BASE_URL}${banner1Preview}` : banner1Preview} alt="Banner 1" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Monitor size={32} className="opacity-20" />
                                            <span className="text-[11px] font-medium uppercase tracking-wider">No Image</span>
                                        </>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-700 ml-1">Upload Image</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 border border-gray-200 rounded-sm h-10 flex items-center px-3 bg-gray-50/20">
                                            <input
                                                type="file"
                                                ref={fileInputRef1}
                                                className="hidden"
                                                onChange={(e) => handleFilePreview(e, 1)}
                                                accept="image/*"
                                            />
                                            <button
                                                onClick={() => triggerFileSelect(fileInputRef1)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 text-[11px] font-bold rounded-sm transition-colors mr-3 h-7 flex items-center gap-1.5"
                                            >
                                                Choose File
                                            </button>
                                            <span className="text-[11px] text-gray-400 italic">No file chosen</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic px-1">Recommended: 600x400px, Max 2MB</p>
                                </div>
                                <Button
                                    onClick={() => handleUpdateSettings(1)}
                                    className="bg-[#0f172a] hover:bg-[#151c63] text-white w-full h-9 rounded-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all border-none uppercase tracking-wider text-[11px]"
                                >
                                    <Upload size={14} />
                                    Update Banner 1
                                </Button>
                            </div>

                            {/* Banner 2 */}
                            <div className="space-y-4">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Banner Image 2</label>
                                <div className="border border-dashed border-gray-200 rounded-sm aspect-video flex flex-col items-center justify-center bg-gray-50/20 text-gray-400 gap-2 overflow-hidden relative">
                                    {banner2Preview ? (
                                        <img src={banner2Preview.startsWith('/uploads') ? `${BASE_URL}${banner2Preview}` : banner2Preview} alt="Banner 2" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Monitor size={32} className="opacity-20" />
                                            <span className="text-[11px] font-medium uppercase tracking-wider">No Image</span>
                                        </>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-700 ml-1">Upload Image</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 border border-gray-200 rounded-sm h-10 flex items-center px-3 bg-gray-50/20">
                                            <input
                                                type="file"
                                                ref={fileInputRef2}
                                                className="hidden"
                                                onChange={(e) => handleFilePreview(e, 2)}
                                                accept="image/*"
                                            />
                                            <button
                                                onClick={() => triggerFileSelect(fileInputRef2)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 text-[11px] font-bold rounded-sm transition-colors mr-3 h-7 flex items-center gap-1.5"
                                            >
                                                Choose File
                                            </button>
                                            <span className="text-[11px] text-gray-400 italic">No file chosen</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic px-1">Recommended: 600x400px, Max 2MB</p>
                                </div>
                                <Button
                                    onClick={() => handleUpdateSettings(2)}
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white w-full h-9 rounded-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all border-none uppercase tracking-wider text-[11px]"
                                >
                                    <Upload size={14} />
                                    Update Banner 2
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manage Faqs Card */}
                <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            Manage Faqs
                        </h2>
                        <Button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({ question: '', answer: '', status: true });
                                setIsModalOpen(true);
                            }}
                            className="bg-[#0f172a] hover:bg-[#151c63] text-white gap-2 rounded-sm h-9 text-[11px] font-bold transition-all border-none uppercase tracking-wider px-6"
                        >
                            <Plus size={16} /> Add New Faq
                        </Button>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Search Area */}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 relative w-full">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search size={16} />
                                </div>
                                <Input
                                    placeholder="Search by question or answer..."
                                    className="pl-10 h-10 border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-[#0f172a]"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button className="bg-[#f8fafc] hover:bg-gray-100 text-[#0f172a] border border-blue-200 h-10 px-16 rounded-sm font-bold transition-all uppercase tracking-wider text-xs">
                                Search
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-white hover:bg-orange-50/30 text-[#b9875a] border border-orange-200 h-10 px-16 rounded-sm font-bold transition-all uppercase tracking-wider text-xs"
                                onClick={() => setSearchQuery("")}
                            >
                                Reset
                            </Button>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-sm border border-gray-100 overflow-hidden min-h-[300px]">
                            <div className="overflow-x-auto">
                                <Table className="border-collapse">
                                    <TableHeader>
                                        <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-100">
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 w-16 text-center border-r border-gray-100">#</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Question</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Answer</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100">Created At</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 text-center px-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredFaqs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-20 text-center">
                                                    <p className="text-red-500 font-bold italic text-xs uppercase tracking-widest">No Data Available</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredFaqs.map((row, index) => (
                                                <TableRow key={row.id} className="hover:bg-gray-50/50 outline-none">
                                                    <TableCell className="py-4 px-6 text-center font-medium text-gray-500 border-r border-gray-100 text-xs">{index + 1}</TableCell>
                                                    <TableCell className="py-4 font-semibold text-gray-700 border-r border-gray-100 text-xs px-6">{row.question}</TableCell>
                                                    <TableCell className="py-4 text-xs text-gray-500 border-r border-gray-100 px-6 max-w-xs truncate italic">"{row.answer}"</TableCell>
                                                    <TableCell className="py-4 text-[10px] text-gray-400 border-r border-gray-100 px-6 uppercase whitespace-nowrap">{row.createdAt}</TableCell>
                                                    <TableCell className="py-4 px-6 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => handleEditFAQ(row)} className="h-8 w-8 text-[#0f172a] border border-blue-100/30 rounded-sm flex items-center justify-center hover:bg-blue-50 transition-colors">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDeleteFAQ(row.id)} className="h-8 w-8 text-red-500 border border-red-100/30 rounded-sm flex items-center justify-center hover:bg-red-50 transition-colors">
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
            </div>

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 font-sans">
                    <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h2 className="text-[15px] font-bold text-gray-800 uppercase tracking-widest">{editingId ? 'Edit Faq' : 'Add New Faq'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveFAQ} className="p-6 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Question <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    value={formData.question}
                                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                                    placeholder="Enter Question"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e463a]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Answer <span className="text-red-500">*</span></label>
                                <Textarea
                                    required
                                    value={formData.answer}
                                    onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                    className="min-h-[120px] rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e463a] leading-relaxed p-3 bg-gray-50/20"
                                    placeholder="Enter Answer"
                                />
                            </div>

                            <div className="flex justify-center gap-4 pt-4 border-t border-gray-100 -mx-6 px-6 mt-6">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-[#b9875a] hover:bg-[#a6764a] text-white border-none h-10 text-[11px] font-bold px-10 rounded-sm shadow-sm transition-all uppercase tracking-wider"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white h-10 text-[11px] font-bold px-10 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                                >
                                    {editingId ? 'Update Faq' : 'Add Faq'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}






