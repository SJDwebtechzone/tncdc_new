import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Download, ArrowLeft, PackageSearch, TrendingUp, ShoppingCart, Save } from "lucide-react";

export default function StudentInventoryPage() {
    const [view, setView] = useState('list');

    if (view === 'add') {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-800 font-sans tracking-tight">Assign Inventory To Student</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Section: Student & Product Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8">
                            <h3 className="text-sm font-bold text-[#1e3a8a] border-b border-gray-100 pb-3 uppercase tracking-wider mb-8">Student & Product Selection</h3>

                            <div className="space-y-8">
                                <div className="space-y-1.5 focus-within:text-[#1e463a] transition-colors">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                                        Select Student <span className="text-red-500">*</span>
                                    </label>
                                    <select className="w-full h-11 rounded-sm border border-gray-200 px-4 text-sm focus:ring-1 focus:ring-[#1e463a] outline-none bg-white text-gray-400 font-sans transition-all">
                                        <option>Choose a student...</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5 focus-within:text-[#1e463a] transition-colors">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                                        Add Products <span className="text-red-500">*</span>
                                    </label>
                                    <select className="w-full h-11 rounded-sm border border-gray-200 px-4 text-sm focus:ring-1 focus:ring-[#1e463a] outline-none bg-white text-gray-400 font-sans transition-all">
                                        <option>Choose a product...</option>
                                    </select>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <label className="text-[12px] font-bold text-gray-800 uppercase tracking-wider block">Selected Products</label>
                                    <div className="bg-gray-50/50 rounded-sm border border-dashed border-gray-200 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
                                            <ShoppingCart size={40} className="text-gray-300" />
                                            <p className="text-[11px] font-medium max-w-xs mx-auto">No products selected yet. Please add products above.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Billing Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-8">
                            <h3 className="text-sm font-bold text-[#1e3a8a] border-b border-gray-100 pb-3 uppercase tracking-wider">Billing Summary</h3>

                            <div className="space-y-6 bg-gray-50/50 p-6 rounded-sm">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Total Items:</span>
                                    <span className="font-bold text-gray-800">0</span>
                                </div>
                                <div className="flex items-center justify-between text-sm pb-6 border-b border-gray-200">
                                    <span className="text-gray-500 font-medium">Total Amount:</span>
                                    <span className="font-bold text-gray-800">₹0.00</span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Discount Amount</label>
                                    <Input
                                        type="number"
                                        defaultValue="0"
                                        className="h-10 rounded-sm border-gray-200 bg-white text-sm focus:ring-1 focus:ring-[#1e463a] font-sans"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm pt-4">
                                    <span className="text-gray-500 font-bold">Net Amount:</span>
                                    <span className="text-xl font-bold text-gray-800">₹0.00</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-[#1e463a] hover:bg-[#153229] text-white h-11 rounded-sm text-xs font-bold flex items-center justify-center gap-2 shadow-sm border-none uppercase tracking-wider transition-all"
                                >
                                    <Save size={16} />
                                    Assign Inventory
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setView('list')}
                                    className="w-full bg-[#b9875a] hover:bg-[#a6764a] text-white h-11 rounded-sm text-xs font-bold flex items-center justify-center gap-2 border-none transition-all uppercase tracking-wider"
                                >
                                    <ArrowLeft size={16} />
                                    Back to List
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0f172a] p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={120} />
                    </div>
                    <div className="relative z-10 font-sans">
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Total Amount (All Time)</p>
                        <h2 className="text-4xl font-bold">₹0.00</h2>
                    </div>
                </div>
                <div className="bg-[#1e463a] p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={120} />
                    </div>
                    <div className="relative z-10 font-sans">
                        <p className="text-green-200 text-xs font-bold uppercase tracking-wider mb-1">This Month Total</p>
                        <h2 className="text-4xl font-bold">₹0.00</h2>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 font-sans tracking-tight">Student Inventory Management</h1>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-[#1e463a] hover:bg-[#153229] text-white px-6 py-2 rounded-lg flex items-center gap-2 border-none shadow-md transition-all active:scale-95">
                        <Download size={18} />
                        Export
                    </Button>
                    <Button
                        onClick={() => setView('add')}
                        className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-2 rounded-lg flex items-center gap-2 border-none shadow-md transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Assign Inventory to Student
                    </Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={18} />
                        </div>
                        <Input
                            placeholder="Search student..."
                            className="pl-10 h-11 bg-gray-50/50 border-gray-200 rounded-xl placeholder:text-gray-400 text-sm font-sans"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Input type="date" className="h-11 rounded-xl bg-gray-50/50 border-gray-200 font-sans text-sm" />
                    </div>
                    <div className="md:col-span-3">
                        <Input type="date" className="h-11 rounded-xl bg-gray-50/50 border-gray-200 font-sans text-sm" />
                    </div>
                    <div className="md:col-span-2">
                        <Button className="w-full bg-[#1e3a8a] hover:bg-[#2563eb] text-white h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-none">
                            <Search size={18} />
                            Search
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-200">
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 px-6 tracking-wider">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 tracking-wider">Student</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 tracking-wider">Total Items</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 tracking-wider">Total Amount</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 tracking-wider">Discount</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 tracking-wider">Net Amount</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 tracking-wider">Date</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 text-center tracking-wider">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={8} className="py-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400 gap-4">
                                        <div className="bg-gray-50 p-6 rounded-3xl">
                                            <PackageSearch size={48} className="text-gray-300" />
                                        </div>
                                        <p className="font-bold text-sm uppercase tracking-widest text-red-500">No inventory records found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}






