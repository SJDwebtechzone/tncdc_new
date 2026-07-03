import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock, Download, ChevronRight, Save } from "lucide-react";

export default function SecureBackupPage() {
    return (
        <div className="p-8 animate-in fade-in duration-300 space-y-8">
            <h1 className="text-[15px] font-bold text-gray-800 tracking-tight ml-1">Secure Backup</h1>

            <div className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] p-12 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="relative space-y-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Secure Database Backup</h2>
                    <p className="text-[13px] text-white/80 leading-relaxed max-w-2xl font-medium">Protect your valuable data with encrypted backups. Downloads directly to your computer with AES-256 encryption.</p>
                    <Button
                        onClick={() => alert("Backup creation started...")}
                        className="bg-white hover:bg-gray-50 text-[#6366f1] gap-2 rounded-sm h-11 px-8 text-xs font-bold shadow-xl transition-all active:scale-95 uppercase tracking-wider"
                    >
                        <Lock size={14} /> Create & Download Backup Now
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-[#ecfdf5] border-l-4 border-[#10b981] p-6 flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center text-white shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-white">i</span>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-[13px] font-bold text-[#065f46]">Important Information</h4>
                        <p className="text-[11px] text-[#047857] font-medium leading-relaxed">
                            <span className="font-bold">Encryption:</span> Backups use AES-256 military-grade encryption for maximum security.<br />
                            <span className="font-bold">Storage:</span> Backups download directly to your computer. We only keep the last 10 records for reference.
                        </p>
                    </div>
                </div>

                <div className="bg-[#fef9c3] border border-[#fde047] p-6 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <h4 className="text-[13px] font-bold text-orange-800">Windows Users: 7-Zip Required</h4>
                    </div>
                    <p className="text-[11px] text-orange-700/80 font-medium mb-4 ml-6">Windows File Explorer cannot extract AES-256 encrypted files. You'll get "Error 0x80004005" if you try.</p>
                    <div className="flex flex-wrap items-center gap-4 ml-6">
                        <span className="text-[11px] font-bold text-orange-900">Required Software (Free):</span>
                        <Button className="bg-[#eab308] hover:bg-yellow-500 text-white h-8 px-4 text-[10px] font-bold rounded-sm gap-2">
                            <Download size={14} /> Download 7-Zip (Free)
                        </Button>
                        <button className="text-[11px] font-bold text-orange-800 flex items-center gap-1 hover:underline">
                            <ChevronRight size={14} /> How to extract your backup (click to expand)
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-sm p-8 space-y-12 shadow-sm min-h-[400px]">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    <h3 className="text-[14px] font-bold text-gray-800">Backup History (Last 10 Records)</h3>
                </div>

                <div className="flex flex-col items-center justify-center py-12 space-y-4 opacity-50">
                    <div className="w-20 h-24 relative opacity-40">
                        {/* Stacked disks represent database */}
                        <div className="absolute inset-0 bg-gray-200 rounded-lg transform skew-y-6" />
                        <div className="absolute inset-0 bg-gray-300 rounded-lg -mt-4 transform skew-y-6" />
                        <div className="absolute inset-0 bg-gray-400 rounded-lg -mt-8 transform skew-y-6 flex items-center justify-center">
                            <Lock className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[15px] font-bold text-gray-800">No Backup History Yet</p>
                        <p className="text-[11px] text-gray-500 mt-1">Create your first secure backup to protect your data</p>
                    </div>
                </div>
            </div>

            <div className="pt-8 text-center">
                <p className="text-[10px] text-gray-400 font-medium">Copyright 2026-27 © <a href="https://www.devspectra.in" className="font-bold hover:text-blue-600 transition-colors">DevSpectra</a> All rights reserved.</p>
            </div>
        </div>
    );
}






