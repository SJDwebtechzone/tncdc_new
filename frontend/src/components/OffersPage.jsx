import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Gift, X } from "lucide-react";

export default function OffersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Offers</h1>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#1e463a] hover:bg-[#153229] text-white px-6 py-2 rounded-xl flex items-center gap-2 border-none shadow-md transition-all transform hover:scale-105"
                >
                    <Plus size={18} />
                    Add New Offer
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-200">
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 px-6">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5">Title</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5">Description</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5">Image</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5">Expiry Date</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5">Status</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5">Created At</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={8} className="py-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
                                        <div className="bg-gray-50 p-6 rounded-3xl group">
                                            <Gift size={64} className="text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <p className="font-bold text-lg text-gray-400 italic">No offers found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-none shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h2 className="text-lg font-normal text-gray-800">Add New Offer</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-red-500">Title *</label>
                                <Input placeholder="Enter a catchy title for the offer." className="h-9 rounded-sm border-gray-300" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-red-500">Description *</label>
                                <textarea
                                    className="w-full h-24 rounded-sm border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                    placeholder="Provide details about the offer."
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-red-500">Image *</label>
                                <div className="flex gap-2">
                                    <label className="flex-1 cursor-pointer">
                                        <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden h-9">
                                            <div className="bg-gray-100 px-3 py-2 text-xs border-r border-gray-300 text-gray-700">Choose File</div>
                                            <div className="px-3 text-xs text-gray-400">No file chosen</div>
                                        </div>
                                        <input type="file" className="hidden" />
                                    </label>
                                </div>
                                <p className="text-[10px] text-gray-400">Accepted formats: JPEG, PNG, JPG, GIF. Max 2MB.</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-red-500">Expiry Date *</label>
                                <Input type="date" className="h-9 rounded-sm border-gray-300" />
                                <p className="text-[10px] text-gray-400">Select when this offer will expire.</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 p-4 pt-0">
                            <Button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-1 h-8 bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold rounded-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="px-4 py-1 h-8 bg-[#0f392b] hover:bg-[#0f392b]/90 text-white text-xs font-bold rounded-sm"
                            >
                                Add Offer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}






