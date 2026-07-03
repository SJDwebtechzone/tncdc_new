import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, RotateCcw, Pencil, Trash2, Loader2 } from "lucide-react";
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/expense-sub-types`;
const TYPES_API_URL = `${BASE_URL}/api/expense-types`;

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
);

export default function ExpenseSubTypesPage() {
    const [expenseSubTypes, setExpenseSubTypes] = useState([]);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', expenseTypeId: '' });
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subTypesRes, typesRes] = await Promise.all([
                axios.get(API_URL),
                axios.get(TYPES_API_URL)
            ]);
            setExpenseSubTypes(subTypesRes.data);
            setExpenseTypes(typesRes.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = expenseSubTypes.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.expenseType?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.expenseTypeId) return;
        try {
            setSaving(true);
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, formData);
            } else {
                await axios.post(API_URL, { ...formData, status: true });
            }
            await fetchData();
            setIsModalOpen(false);
            setFormData({ name: '', expenseTypeId: '' });
            setEditingId(null);
        } catch (err) {
            console.error('Failed to save expense sub type:', err);
            if (err.response?.data?.error) {
                alert(err.response.data.error);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({ name: item.name, expenseTypeId: item.expenseTypeId.toString() });
        setEditingId(item.id);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setFormData({ name: '', expenseTypeId: '' });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await axios.put(`${API_URL}/${id}`, { status: !currentStatus });
            await fetchData();
        } catch (err) {
            console.error('Failed to toggle status:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setDeleteConfirm(null);
            await fetchData();
        } catch (err) {
            console.error('Failed to delete expense sub type:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Manage Expenses Sub Types</h1>
                <Button
                    onClick={handleAddNew}
                    className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-2 rounded-lg flex items-center gap-2 border-none transition-all transform hover:scale-105"
                >
                    <Plus size={18} />
                    Add Sub Type
                </Button>
            </div>

            {/* Add/Edit Expense Sub Type Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-sm shadow-2xl relative">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-sm font-normal text-gray-800">
                                {editingId ? 'Edit Expense Sub Type' : 'Add New Expense Sub Type'}
                            </h2>
                            <button onClick={() => { setIsModalOpen(false); setEditingId(null); setFormData({ name: '', expenseTypeId: '' }); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700">Expense Type</label>
                                <select 
                                    className="w-full h-9 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.expenseTypeId}
                                    onChange={(e) => setFormData({ ...formData, expenseTypeId: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select Expense Type</option>
                                    {expenseTypes.filter(t => t.status).map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-700">Expense Sub Type</label>
                                <Input 
                                    placeholder="Enter Expense Sub Type" 
                                    className="h-9 rounded-sm border-gray-200 text-xs" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex justify-center gap-3 pt-2">
                                <Button 
                                    type="button" 
                                    onClick={() => { setIsModalOpen(false); setEditingId(null); setFormData({ name: '', expenseTypeId: '' }); }} 
                                    className="bg-[#b45309] hover:bg-[#8e420b] text-white border-none h-9 text-xs font-bold px-8 rounded-sm"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={saving}
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white h-9 text-xs font-bold px-8 rounded-sm"
                                >
                                    {saving ? (
                                        <><Loader2 size={14} className="animate-spin mr-1" /> Saving...</>
                                    ) : editingId ? 'Update Sub Type' : 'Add Sub Type'}
                                </Button>
                            </div>
                        </form>
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
                        <h3 className="text-sm font-bold text-gray-800">Delete Sub Type?</h3>
                        <p className="text-xs text-gray-500">Are you sure you want to delete this expense sub type? This action cannot be undone.</p>
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

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-8 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={18} />
                        </div>
                        <Input
                            placeholder="Search by name or type..."
                            className="pl-10 h-11 bg-gray-50/50 border-gray-200 rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Button className="w-full bg-white hover:bg-gray-50 text-blue-900 border border-blue-900 h-11 rounded-xl font-bold">
                            Search
                        </Button>
                    </div>
                    <div className="md:col-span-2">
                        <Button 
                            variant="outline" 
                            className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 bg-[#e4a873]/10 h-11 rounded-xl flex items-center gap-2"
                            onClick={() => setSearchQuery('')}
                        >
                            <RotateCcw size={18} />
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-200">
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5 px-6">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Expense Sub Type</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Expense Type</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Status</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5">Created At</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase py-5 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-20 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 size={20} className="animate-spin text-gray-400" />
                                            <span className="text-sm text-gray-400">Loading...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-20 text-center">
                                        <p className="font-bold text-lg text-red-500">No Data Available</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                                        <TableCell className="font-medium text-blue-600 py-4 px-6">{index + 1}</TableCell>
                                        <TableCell className="font-medium text-gray-700 text-sm">{item.name}</TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {item.expenseType?.name || 'Unknown'}
                                        </TableCell>
                                        <TableCell>
                                            <CustomBlueSwitch
                                                checked={item.status !== false}
                                                onCheckedChange={() => handleToggleStatus(item.id, item.status)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    onClick={() => handleEdit(item)}
                                                    size="icon"
                                                    className="h-8 w-8 bg-[#1a85ff] hover:bg-[#1a85ff]/90 text-white rounded-md shadow-sm"
                                                >
                                                    <Pencil size={14} />
                                                </Button>
                                                <Button
                                                    onClick={() => setDeleteConfirm(item.id)}
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
