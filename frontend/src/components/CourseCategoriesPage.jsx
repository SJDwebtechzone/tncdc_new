import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Plus, Search, Download, Trash2, Code, Palette, X } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useSelector, useDispatch } from 'react-redux';
import { addCategoryAsync, fetchCategories, deleteCategoryAsync, updateCategoryAsync } from '@/store/courseSlice';
import { BASE_URL } from '@/config';
import { useEffect } from "react"

const CustomBlueSwitch = ({ checked, onCheckedChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`
            relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none 
            ${checked ? 'bg-white border-[#0f172a]' : 'bg-gray-200 border-transparent'}
        `}
    >
        <span
            className={`
                pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform 
                ${checked ? 'translate-x-4 bg-[#0f172a]' : 'translate-x-0.5 bg-white'}
            `}
        />
    </button>
)

export default function CourseCategoriesPage() {
    const categories = useSelector((state) => state.courses.categories);
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const filteredData = categories ? categories.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const handleSave = (e) => {
        e.preventDefault();
        if (editingId) {
            dispatch(updateCategoryAsync({ id: editingId, ...formData, iconFile: selectedFile }));
        } else {
            dispatch(addCategoryAsync({ ...formData, status: true, iconFile: selectedFile }));
        }
        setIsModalOpen(false);
        setFormData({ name: '' });
        setSelectedFile(null);
        setEditingId(null);
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name });
        setEditingId(category.id);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setFormData({ name: '' });
        setEditingId(null);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            dispatch(deleteCategoryAsync(id));
        }
    };

    const handleToggleStatus = (category) => {
        dispatch(updateCategoryAsync({
            id: category.id,
            status: !category.status
        }));
    };

    return (
        <div className="space-y-6 relative">
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-gray-100/50">
                    <h1 className="text-xl font-medium text-gray-800">Manage Course Categories</h1>
                    <div className="flex gap-2">
                        <Button className="bg-[#1e463a] hover:bg-[#153229] text-white gap-2 rounded-sm px-4 h-9 text-[11px] uppercase tracking-widest font-bold shadow-md transition-all active:scale-95">
                            <Download size={14} /> Export
                        </Button>
                        <Button onClick={handleAddNew} className="bg-[#1e463a] hover:bg-[#153229] text-white gap-2 rounded-sm px-4 h-9 text-[11px] uppercase tracking-widest font-bold shadow-md transition-all active:scale-95">
                            <Plus size={14} /> Add New Category
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                    <div className="bg-white border border-gray-200 rounded-lg flex items-center px-3 h-10 w-full md:w-80 shadow-sm">
                        <Search className="text-gray-400 mr-2" size={18} />
                        <input
                            placeholder="Search categories..."
                            className="bg-transparent border-none outline-none text-sm w-full text-gray-600 placeholder:text-gray-400 font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button className="bg-[#1e3a8a] hover:bg-blue-900 text-white h-10 px-8 rounded-sm font-bold shadow-md transition-all active:scale-95">
                        Search
                    </Button>
                    <Button variant="outline" className="border-orange-300 text-orange-400 hover:bg-orange-50 h-10 px-8 rounded-sm font-bold transition-all active:scale-95" onClick={() => setSearchQuery("")}>
                        Reset
                    </Button>
                </div>

                {/* Table */}
                <Table>
                    <TableHeader className="bg-gray-50/50 border-b border-gray-100">
                        <TableRow>
                            <TableHead className="w-[80px] font-bold text-gray-800 text-[10px] uppercase tracking-wider text-center border-r border-gray-50 pl-0">#</TableHead>
                            <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider w-[30%] border-r border-gray-50">Category Name</TableHead>
                            <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-50">Icon</TableHead>
                            <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-50 px-4">Total Courses</TableHead>
                            <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-50 pr-4">Status</TableHead>
                            <TableHead className="text-center font-bold text-gray-800 text-[10px] uppercase tracking-wider w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((row, index) => (
                            <TableRow key={row.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                                <TableCell className="text-center font-bold text-gray-500 py-4 border-r border-gray-50">{index + 1}</TableCell>
                                <TableCell className="font-bold text-gray-800 text-xs border-r border-gray-50">{row.name}</TableCell>
                                <TableCell className="border-r border-gray-50">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                                        {row.iconUrl && row.iconUrl !== 'null' ? (
                                            <img src={row.iconUrl.startsWith('http') ? row.iconUrl : `${BASE_URL}${row.iconUrl}`} alt={row.name} className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <Code className="text-gray-400" size={20} />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="border-r border-gray-50">
                                    <div className="bg-[#1e3a8a] text-white text-[11px] font-bold px-3 py-1 rounded w-fit h-6 flex items-center justify-center ml-2 shadow-sm">
                                        {row.count || 0}
                                    </div>
                                </TableCell>
                                <TableCell className="border-r border-gray-50">
                                    <CustomBlueSwitch
                                        checked={row.status !== false}
                                        onCheckedChange={() => handleToggleStatus(row)}
                                    />
                                </TableCell>
                                <TableCell className="text-center flex items-center justify-center gap-2">
                                    <Button onClick={() => handleEdit(row)} size="icon" className="h-8 w-8 bg-[#1a85ff] hover:bg-blue-600 text-white rounded-sm shadow-sm transition-all active:scale-95">
                                        <Pencil size={14} />
                                    </Button>
                                    <Button onClick={() => handleDelete(row.id)} size="icon" className="h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-sm shadow-sm transition-all active:scale-95">
                                        <Trash2 size={14} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight text-[15px]">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Category Name <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter Category Name"
                                    className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Category Icon <span className="text-red-500">*</span></label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 border border-gray-200 rounded-sm p-1 pr-3 h-10">
                                        <input
                                            type="file"
                                            id="category-icon"
                                            className="hidden"
                                            accept=".svg,.png"
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-8 text-[11px] font-bold px-4 rounded-sm bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700"
                                            onClick={() => document.getElementById('category-icon').click()}
                                        >
                                            Choose File
                                        </Button>
                                        <span className="text-[11px] text-gray-500 font-medium truncate flex-1">
                                            {selectedFile ? selectedFile.name : "No file chosen"}
                                        </span>
                                        {selectedFile && (
                                            <button type="button" onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium italic ml-1">Only SVG or PNG files are allowed.</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t font-bold">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-8 rounded-sm h-10 text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-md font-bold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white px-8 rounded-sm h-10 text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-md font-bold"
                                >
                                    {editingId ? 'Update Category' : 'Add Category'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}






