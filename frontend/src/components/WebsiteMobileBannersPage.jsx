import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit2, Trash2, X, Monitor } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '@/store/courseSlice';
import { addMobileBanner, editMobileBanner, deleteMobileBanner } from '@/store/websiteSlice';
import { BASE_URL } from '@/config';

const CustomBlueSwitch = ({ checked, onCheckedChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full border-2 transition-colors focus-visible:outline-none ${checked ? 'bg-white border-[#0f172a]' : 'bg-gray-200 border-transparent'}`}
    >
        <span className={`pointer-events-none block h-4 w-4 rounded-full shadow-lg transition-transform ${checked ? 'translate-x-4 bg-[#0f172a]' : 'translate-x-0.5 bg-white'}`} />
    </button>
)

export default function WebsiteMobileBannersPage() {
    const banners = useSelector((state) => state.website.mobileBanners || []);
    const courses = useSelector((state) => state.courses?.courses || []);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        type: 'course',
        link: '',
        order: '0',
        status: true
    });
    const [editingId, setEditingId] = useState(null);

    const modalFileRef = useRef(null);

    const filteredBanners = banners.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditBanner = (banner) => {
        setFormData({
            title: banner.title,
            image: banner.image,
            type: banner.type,
            link: banner.link,
            order: banner.order,
            status: banner.status
        });
        setEditingId(banner.id);
        setIsModalOpen(true);
    };

    const handleSaveBanner = (e) => {
        e.preventDefault();
        if (editingId) {
            dispatch(editMobileBanner({ ...formData, id: editingId }));
        } else {
            dispatch(addMobileBanner(formData));
        }
        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ title: '', image: '', type: 'course', link: '', order: '0', status: true });
        setEditingId(null);
    };

    const handleDeleteBanner = (id) => {
        if (window.confirm("Delete this mobile banner?")) {
            dispatch(deleteMobileBanner(id));
        }
    };

    const triggerFileSelect = (ref) => {
        if (ref.current) ref.current.click();
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 px-6 pt-4">

            <div className="space-y-6">
                {/* Manage Mobile Banners Card */}
                <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            Manage Mobile Banners
                        </h2>
                        <Button
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="bg-[#0f172a] hover:bg-[#151c63] text-white gap-2 rounded-sm h-9 text-[11px] font-bold transition-all border-none uppercase tracking-wider px-6"
                        >
                            <Plus size={16} /> Add New Banner
                        </Button>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Search Area */}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 relative w-full">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                    <Search size={16} />
                                </div>
                                <Input
                                    placeholder="Search by title..."
                                    className="pl-10 h-10 border-gray-200 rounded-sm text-sm focus:ring-1 focus:ring-[#0f172a]"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button className="bg-[#0f172a] hover:bg-[#151c63] text-white h-10 px-16 rounded-sm font-bold border-none transition-all uppercase tracking-wider text-xs w-full md:w-auto shadow-sm">
                                Search
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-white hover:bg-orange-50/30 text-[#b9875a] border border-orange-200 h-10 px-16 rounded-sm font-bold transition-all uppercase tracking-wider text-xs w-full md:w-auto shadow-sm"
                                onClick={() => setSearchQuery("")}
                            >
                                Reset
                            </Button>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-sm border border-gray-100 overflow-hidden min-h-[300px]">
                            <div className="overflow-x-auto font-sans">
                                <Table className="border-collapse">
                                    <TableHeader>
                                        <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-100">
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 w-16 text-center border-r border-gray-100">#</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Title</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 text-center px-6">Image</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6 text-center">Type</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Course/Link</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6 text-center">Order</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6 text-center">Status</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 border-r border-gray-100 px-6">Created At</TableHead>
                                            <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 text-center px-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBanners.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} className="py-20 text-center font-sans border-b border-gray-100">
                                                    <p className="text-red-500 font-bold italic text-xs uppercase tracking-widest">No Data Available</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredBanners.map((row, index) => (
                                                <TableRow key={row.id} className="hover:bg-gray-50/50 outline-none border-b border-gray-100">
                                                    <TableCell className="py-4 px-6 text-center font-medium text-gray-500 border-r border-gray-100 text-xs">{index + 1}</TableCell>
                                                    <TableCell className="py-4 font-semibold text-gray-700 border-r border-gray-100 text-xs px-6">{row.title}</TableCell>
                                                    <TableCell className="py-4 border-r border-gray-100">
                                                        <div className="w-12 h-10 rounded-sm bg-gray-50 overflow-hidden border border-gray-200 mx-auto flex items-center justify-center">
                                                            {row.image ? <img src={row.image.startsWith('/uploads') ? `${BASE_URL}${row.image}` : row.image} alt={row.title} className="w-full h-full object-cover" /> : <Monitor size={18} className="text-gray-300" />}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-xs font-bold text-blue-600 uppercase tracking-widest border-r border-gray-100 text-center px-6">{row.type}</TableCell>
                                                    <TableCell className="py-4 text-xs text-gray-600 border-r border-gray-100 px-6 truncate max-w-[150px]">{row.link}</TableCell>
                                                    <TableCell className="py-4 font-bold text-gray-700 border-r border-gray-100 text-xs px-6 text-center">{row.order}</TableCell>
                                                    <TableCell className="py-4 border-r border-gray-100 text-center px-6">
                                                        <div className="flex justify-center scale-90">
                                                            <CustomBlueSwitch checked={row.status} onCheckedChange={() => { }} />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-[10px] text-gray-400 border-r border-gray-100 px-6 uppercase whitespace-nowrap">{row.createdAt}</TableCell>
                                                    <TableCell className="py-4 px-6 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => handleEditBanner(row)} className="h-8 w-8 text-[#0f172a] border border-blue-100/30 rounded-sm flex items-center justify-center hover:bg-blue-50 transition-colors">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDeleteBanner(row.id)} className="h-8 w-8 text-red-500 border border-red-100/30 rounded-sm flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm">
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 font-sans">
                    <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/30">
                            <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">{editingId ? 'Edit Mobile Banner' : 'Add New Mobile Banner'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveBanner} className="p-6 space-y-5">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Title <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Banner Title"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Image <span className="text-red-500">*</span></label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center h-10 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                        <input 
                                            type="file" 
                                            ref={modalFileRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const uploadFormData = new FormData();
                                                    uploadFormData.append('file', file);
                                                    try {
                                                        const res = await fetch(`${BASE_URL}/api/profile/upload`, { method: 'POST', body: uploadFormData }).then(res => res.json());
                                                        setFormData({ ...formData, image: res.fileUrl });
                                                    } catch (error) {
                                                        alert("Failed to upload image.");
                                                    }
                                                }
                                            }} 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => triggerFileSelect(modalFileRef)}
                                            className="px-3 h-full bg-gray-200 border-r border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        <span className="px-3 text-gray-500 text-[11px] truncate flex-1">
                                            {formData.image ? "Image Selected & Uploaded" : <i className="text-gray-400">No file chosen</i>}
                                        </span>
                                    </div>
                                    {formData.image && (
                                        <div className="w-full mt-2 rounded-md overflow-hidden bg-transparent border border-gray-200">
                                            <img src={formData.image.startsWith('http') || formData.image.startsWith('data:') ? formData.image : `${BASE_URL}${formData.image}`} alt="Preview" className="w-full h-auto block" />
                                        </div>
                                    )}
                                    <p className="text-[9px] text-gray-400 italic px-1 font-sans font-bold leading-tight mt-1">Image size should be optimized for mobile devices.</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Banner Type <span className="text-red-500">*</span></label>
                                <select 
                                    required
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value, link: '' })}
                                    className="w-full h-10 px-3 rounded-sm border border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] outline-none"
                                >
                                    <option value="course">Course</option>
                                    <option value="external link">External Link</option>
                                </select>
                            </div>

                            {formData.type === 'course' ? (
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Select Course <span className="text-red-500">*</span></label>
                                    <select 
                                        required
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full h-10 px-3 rounded-sm border border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a] outline-none"
                                    >
                                        <option value="">-- Choose a Course --</option>
                                        {courses.map(course => (
                                            <option key={course.id || course._id} value={`/dashboard/courses/${course.id || course._id}`}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">External Link <span className="text-red-500">*</span></label>
                                    <Input
                                        required
                                        type="url"
                                        placeholder="https://example.com"
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Order</label>
                                <Input
                                    type="number"
                                    value={formData.order}
                                    onChange={e => setFormData({ ...formData, order: e.target.value })}
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#0f172a]"
                                />
                            </div>

                            <div className="flex items-center gap-2 px-1">
                                <input
                                    type="checkbox"
                                    id="active-mobile"
                                    checked={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-[#0f172a] focus:ring-[#0f172a]"
                                />
                                <label htmlFor="active-mobile" className="text-[11px] font-bold text-gray-600 uppercase tracking-widest cursor-pointer">Active</label>
                            </div>

                            <div className="flex justify-center gap-4 pt-4 border-t border-gray-100 -mx-6 px-6 mt-4">
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
                                    {editingId ? 'Update Banner' : 'Add Banner'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}






