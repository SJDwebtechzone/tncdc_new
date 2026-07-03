import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, RotateCcw, Pencil, Trash2, Loader2, Package, X, Image as ImageIcon } from "lucide-react";
import axios from 'axios';
import { BASE_URL } from '@/config';

const PRODUCTS_API = `${BASE_URL}/api/inventory-products`;
const CATEGORIES_API = `${BASE_URL}/api/inventory-categories`;

export default function InventoryProductsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategoryId, setFilterCategoryId] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const initialFormData = {
        categoryId: '',
        name: '',
        mrp: '',
        price: '',
        quantity: '',
        stockDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        productImage: null
    };
    
    const [formData, setFormData] = useState(initialFormData);

    const fetchData = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (searchQuery) queryParams.append('search', searchQuery);
            if (filterCategoryId) queryParams.append('categoryId', filterCategoryId);

            const [productsRes, categoriesRes] = await Promise.all([
                axios.get(`${PRODUCTS_API}?${queryParams.toString()}`),
                axios.get(CATEGORIES_API)
            ]);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data.filter(c => c.status));
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const submitData = new FormData();
            submitData.append('categoryId', formData.categoryId);
            submitData.append('name', formData.name);
            submitData.append('mrp', formData.mrp);
            submitData.append('price', formData.price);
            submitData.append('quantity', formData.quantity);
            submitData.append('stockDate', formData.stockDate);
            submitData.append('status', formData.status);
            
            if (formData.productImage) {
                submitData.append('productImage', formData.productImage);
            }

            if (editingId) {
                await axios.put(`${PRODUCTS_API}/${editingId}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(PRODUCTS_API, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            await fetchData();
            setFormData(initialFormData);
            setEditingId(null);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to save product:', err);
            if (err.response?.data?.error) {
                alert(err.response.data.error);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            categoryId: product.categoryId.toString(),
            name: product.name,
            mrp: product.mrp,
            price: product.price,
            quantity: product.quantity,
            stockDate: product.stockDate || new Date().toISOString().split('T')[0],
            status: product.status ? 'Active' : 'Inactive',
            productImage: null // We don't load the existing image into the file input
        });
        setEditingId(product.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${PRODUCTS_API}/${id}`);
            setDeleteConfirm(null);
            await fetchData();
        } catch (err) {
            console.error('Failed to delete product:', err);
        }
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '-';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Inventory Products</h2>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-70">Manage your stock items and products</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => { setFormData(initialFormData); setEditingId(null); setIsModalOpen(true); }}
                        className="bg-[#1e463a] hover:bg-[#153229] text-white px-6 py-2 rounded-lg flex items-center gap-2 border-none shadow-md transition-all active:scale-95 uppercase text-xs font-bold tracking-wider"
                    >
                        <Plus size={18} />
                        Add New Product
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#f8fafc] p-6 rounded-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Search Keywords</label>
                        <Input 
                            placeholder="Search by name..." 
                            className="h-10 bg-white border-gray-200 rounded-sm text-xs focus:ring-1 focus:ring-[#1e3a8a]" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Filter by Category</label>
                        <select 
                            className="w-full h-10 rounded-sm border border-gray-200 px-4 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-600 transition-all cursor-pointer"
                            value={filterCategoryId}
                            onChange={(e) => setFilterCategoryId(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end gap-3">
                        <Button 
                            onClick={fetchData}
                            className="bg-[#1e3a8a] hover:bg-[#152e6e] text-white h-10 rounded-sm flex items-center gap-2 text-xs font-bold uppercase tracking-wider border-none w-full"
                        >
                            <Search size={14} />
                            Search
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('');
                                setFilterCategoryId('');
                                setLoading(true);
                                axios.get(PRODUCTS_API).then(res => setProducts(res.data)).finally(() => setLoading(false));
                            }}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50 h-10 rounded-sm flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider w-1/2"
                        >
                            <RotateCcw size={14} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-gray-800">
                                {editingId ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button 
                                onClick={() => { setIsModalOpen(false); setEditingId(null); setFormData(initialFormData); }} 
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto">
                            <form id="productForm" onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-600">Category <span className="text-red-500">*</span></label>
                                        <select 
                                            className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-700 transition-all cursor-pointer"
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            required
                                        >
                                            <option value="" disabled>Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-600">Product Name <span className="text-red-500">*</span></label>
                                        <Input
                                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-600">MRP <span className="text-red-500">*</span></label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                            value={formData.mrp}
                                            onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-600">Price <span className="text-red-500">*</span></label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-600">Stock <span className="text-red-500">*</span></label>
                                        <Input
                                            type="number"
                                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-600">Stock Date <span className="text-red-500">*</span></label>
                                        <Input
                                            type="date"
                                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                            value={formData.stockDate}
                                            onChange={(e) => setFormData({ ...formData, stockDate: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[11px] font-bold text-gray-600">Status <span className="text-red-500">*</span></label>
                                        <select 
                                            className="w-1/2 h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-700 transition-all cursor-pointer"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            required
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[11px] font-bold text-gray-600">Product Image <span className="text-red-500">*</span></label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg, image/webp"
                                                className="h-10 rounded-sm border-gray-200 text-xs file:bg-gray-100 file:border-0 file:h-full file:mr-4 file:px-4 cursor-pointer hover:file:bg-gray-200"
                                                onChange={(e) => setFormData({ ...formData, productImage: e.target.files[0] })}
                                                required={!editingId} // Image is required for new products, optional for editing
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400">Accepted formats: JPEG, JPG, PNG, WEBP (Max: 2MB)</p>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50/50">
                            <Button 
                                type="button" 
                                onClick={() => { setIsModalOpen(false); setEditingId(null); setFormData(initialFormData); }} 
                                className="bg-[#b9875a] hover:bg-[#a6764a] text-white border-none h-9 text-xs font-bold px-6 rounded-sm"
                            >
                                Close
                            </Button>
                            <Button 
                                type="submit" 
                                form="productForm"
                                disabled={saving}
                                className="bg-[#1e463a] hover:bg-[#153229] text-white h-9 text-xs font-bold px-6 rounded-sm flex items-center gap-2 border-none"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                                Save Product
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-sm rounded-sm shadow-2xl p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <Trash2 size={20} className="text-red-500" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">Delete Product?</h3>
                        <p className="text-xs text-gray-500">Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="flex justify-center gap-3 pt-2">
                            <Button
                                onClick={() => setDeleteConfirm(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-none h-9 text-xs font-bold px-8 rounded-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="bg-red-500 hover:bg-red-600 text-white border-none h-9 text-xs font-bold px-8 rounded-sm"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden font-sans">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-200">
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 px-6 tracking-wider border-r border-gray-100 w-[50px]">#</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 w-[80px] text-center">Image</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Product Name</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 text-center">Category</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 text-center">Price</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 text-center">Stock</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 text-center">Status</TableHead>
                                <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 text-center tracking-wider">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <Loader2 size={40} className="animate-spin text-gray-300" />
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Loading Products...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-6">
                                            <div className="bg-gray-50 p-6 rounded-3xl">
                                                <Package size={48} className="text-gray-300" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">No Products Found</p>
                                            </div>
                                            <Button
                                                onClick={() => { setFormData(initialFormData); setEditingId(null); setIsModalOpen(true); }}
                                                className="bg-[#1e463a] hover:bg-[#153229] text-white px-10 h-10 rounded-sm font-bold shadow-lg mt-4 uppercase text-xs tracking-widest transition-all active:scale-95 p-0 border-none"
                                            >
                                                <Plus size={18} className="mr-2" />
                                                Add First Product
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product, index) => (
                                    <TableRow key={product.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                                        <TableCell className="font-medium text-blue-600 py-4 px-6 border-r border-gray-100">{index + 1}</TableCell>
                                        <TableCell className="text-center border-r border-gray-100">
                                            {product.imageUrl ? (
                                                <div className="w-10 h-10 rounded-sm border border-gray-200 overflow-hidden mx-auto bg-gray-50">
                                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-sm border border-gray-200 mx-auto bg-gray-50 flex items-center justify-center text-gray-300">
                                                    <ImageIcon size={16} />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="border-r border-gray-100">
                                            <p className="text-xs font-bold text-gray-800">{product.name}</p>
                                        </TableCell>
                                        <TableCell className="text-center text-xs font-medium text-gray-600 border-r border-gray-100">
                                            {product.category?.name}
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-gray-700 text-xs border-r border-gray-100">
                                            {formatCurrency(product.price)}
                                        </TableCell>
                                        <TableCell className="text-center border-r border-gray-100">
                                            <span className={`text-sm font-bold ${product.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                {product.quantity}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center border-r border-gray-100">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                product.status ? 'bg-green-100 text-[#1e463a]' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {product.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    onClick={() => handleEdit(product)}
                                                    size="icon"
                                                    className="h-8 w-8 bg-[#1a85ff] hover:bg-[#1a85ff]/90 text-white rounded-md shadow-sm"
                                                >
                                                    <Pencil size={14} />
                                                </Button>
                                                <Button
                                                    onClick={() => setDeleteConfirm(product.id)}
                                                    size="icon"
                                                    className="h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm"
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
        </div>
    );
}
