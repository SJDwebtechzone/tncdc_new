import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Plus, Search, Video, X, ExternalLink, Copy, Check, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useSelector, useDispatch } from 'react-redux';
import { fetchOnlineClassesAsync, addOnlineClassAsync, updateOnlineClassAsync, deleteOnlineClassAsync, fetchCourses } from '@/store/courseSlice';
import { toast } from 'react-hot-toast';

const CustomBlueSwitch = ({ checked, onCheckedChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`
            relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none 
            ${checked ? 'bg-[#0f172a] border-[#0f172a]' : 'bg-gray-200 border-transparent'}
        `}
    >
        <span
            className={`
                pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform 
                ${checked ? 'translate-x-4 bg-white' : 'translate-x-0.5 bg-white'}
            `}
        />
    </button>
)

export default function OnlineClassesPage() {
    const classes = useSelector((state) => state.courses.onlineClasses || []);
    const courses = useSelector((state) => state.courses.courses || []);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [formData, setFormData] = useState({ title: '', courseId: '', link: '', date: '', time: '' });
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        dispatch(fetchOnlineClassesAsync());
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleOpenModal = (cls = null) => {
        if (cls) {
            setEditingClass(cls);
            setFormData({
                title: cls.title,
                courseId: cls.courseId.toString(),
                link: cls.link,
                date: cls.date,
                time: cls.time
            });
        } else {
            setEditingClass(null);
            setFormData({ title: '', courseId: '', link: '', date: '', time: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingClass) {
                await dispatch(updateOnlineClassAsync({ id: editingClass.id, data: formData })).unwrap();
                toast.success('Class updated successfully');
            } else {
                await dispatch(addOnlineClassAsync(formData)).unwrap();
                toast.success('Class added successfully');
            }
            setIsModalOpen(false);
            setFormData({ title: '', courseId: '', link: '', date: '', time: '' });
        } catch (error) {
            toast.error(error || 'Failed to save class');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            try {
                await dispatch(deleteOnlineClassAsync(id)).unwrap();
                toast.success('Class deleted successfully');
            } catch (error) {
                toast.error(error || 'Failed to delete class');
            }
        }
    };

    const toggleStatus = async (cls) => {
        try {
            await dispatch(updateOnlineClassAsync({ id: cls.id, data: { status: !cls.status } })).unwrap();
            toast.success('Status updated');
        } catch (error) {
            toast.error(error || 'Failed to update status');
        }
    };

    const copyToClipboard = (link, id) => {
        navigator.clipboard.writeText(link);
        setCopiedId(id);
        toast.success('Link copied!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6 relative animate-in fade-in duration-500 p-6">
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden p-6 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Video className="text-gray-700" size={28} /> Online Classes
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Manage and schedule virtual classes for your courses</p>
                    </div>
                    <Button onClick={() => handleOpenModal()} className="bg-[#1e463a] hover:bg-[#153229] text-white gap-2 rounded-sm px-6 h-10 text-[11px] uppercase tracking-widest font-bold shadow-md transition-all active:scale-95">
                        <Plus size={16} /> Add New Class
                    </Button>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-start gap-4 border-t-4 border-blue-500 shadow-sm shadow-blue-50 relative overflow-hidden group">
                        <div className="p-3 bg-blue-500 rounded-lg text-white">
                            <Video size={24} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{classes.length}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-1">TOTAL CLASSES</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 flex flex-col items-start gap-4 border-t-4 border-green-500 shadow-sm shadow-green-50 relative overflow-hidden group">
                        <div className="p-3 bg-green-500 rounded-lg text-white">
                            <div className="w-6 h-6 flex items-center justify-center border-2 border-white rounded-full text-[10px] font-bold">▶</div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{classes.filter(c => c.status).length}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-1">ACTIVE CLASSES</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 flex flex-col items-start gap-4 border-t-4 border-red-500 shadow-sm shadow-red-50 relative overflow-hidden group">
                        <div className="p-3 bg-red-500 rounded-lg text-white">
                            <X size={24} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{classes.filter(c => !c.status).length}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-1">INACTIVE CLASSES</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="border border-gray-100 rounded-sm overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-gray-50/80 border-b border-gray-100">
                            <TableRow>
                                <TableHead className="w-[80px] font-bold text-gray-800 text-[10px] uppercase tracking-wider text-center border-r border-gray-100">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100">Class Details</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100">Course</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100">Date & Time</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100 text-center">Status</TableHead>
                                <TableHead className="text-center font-bold text-gray-800 text-[10px] uppercase tracking-wider w-[200px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400 py-12">
                                            <Video size={64} className="mb-4 opacity-20 text-gray-800" />
                                            <h3 className="text-xl font-bold text-gray-800 tracking-tight">No Online Classes Found</h3>
                                            <p className="text-sm text-gray-400 mt-1 font-medium italic">Start by adding your first online class</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                classes.map((row, index) => (
                                    <TableRow key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="text-center font-bold text-[#1e3a8a] py-4 border-r border-gray-50">{index + 1}</TableCell>
                                        <TableCell className="border-r border-gray-50">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 text-xs">{row.title}</span>
                                                <button 
                                                    onClick={() => copyToClipboard(row.link, row.id)}
                                                    className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-1 truncate max-w-[200px]"
                                                >
                                                    {copiedId === row.id ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                                                    {row.link}
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[#10b981] text-xs font-bold border-r border-gray-50">{row.course?.title || 'Unknown Course'}</TableCell>
                                        <TableCell className="border-r border-gray-50">
                                            <div className="flex flex-col text-[11px] font-medium text-gray-600">
                                                <span className="font-bold uppercase">{row.date}</span>
                                                <span>{row.time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="border-r border-gray-50 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <CustomBlueSwitch
                                                    checked={row.status}
                                                    onCheckedChange={() => toggleStatus(row)}
                                                />
                                                <span className={`text-[9px] font-bold uppercase tracking-widest ${row.status ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>
                                                    {row.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <a href={row.link} target="_blank" rel="noopener noreferrer">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-[#1e463a] bg-green-50 hover:bg-green-100 rounded-sm" title="Open Link">
                                                        <ExternalLink size={14} />
                                                    </Button>
                                                </a>
                                                <Button 
                                                    onClick={() => handleOpenModal(row)}
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 text-[#1e3a8a] bg-blue-50 hover:bg-blue-100 rounded-sm" 
                                                    title="Edit Class"
                                                >
                                                    <Pencil size={14} />
                                                </Button>
                                                <Button 
                                                    onClick={() => handleDelete(row.id)}
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 text-red-600 bg-red-50 hover:bg-red-100 rounded-sm" 
                                                    title="Delete Class"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-hidden">
                        <div className="bg-[#1e463a] p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <Video size={18} className="stroke-white" />
                                <h2 className="text-sm font-bold uppercase tracking-widest">{editingClass ? 'Edit Online Class' : 'Add New Online Class'}</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 rounded-full p-1">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">Title <span className="text-red-500">*</span></label>
                                    <Input
                                        required
                                        className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-[#1e463a] transition-all"
                                        placeholder="e.g., Live Session on React"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">Select Course <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        className="h-10 w-full rounded-sm border border-gray-200 text-xs font-medium focus:ring-1 focus:ring-[#1e463a] px-3 bg-white"
                                        value={formData.courseId}
                                        onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                                    >
                                        <option value="">Choose Course</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>{course.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">Meeting Link <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    type="url"
                                    className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-[#1e463a] transition-all"
                                    placeholder="https://meet.google.com/..."
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">Class Date <span className="text-red-500">*</span></label>
                                    <Input
                                        required
                                        type="date"
                                        className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-[#1e463a]"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest ml-1">Class Time <span className="text-red-500">*</span></label>
                                    <Input
                                        required
                                        type="time"
                                        className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-[#1e463a]"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t font-bold">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 rounded-sm h-10 text-[10px] uppercase tracking-widest font-bold border border-gray-200"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white px-8 rounded-sm h-10 text-[10px] uppercase tracking-widest font-bold shadow-md"
                                >
                                    {editingClass ? 'Update Class' : 'Schedule Class'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
