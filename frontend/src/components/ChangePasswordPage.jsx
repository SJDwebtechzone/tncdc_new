import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function ChangePasswordPage() {
    return (
        <div className="p-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="bg-[#0f172a] p-6 rounded-t-lg">
                <h1 className="text-xl font-bold text-white tracking-tight">Change Password</h1>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-b-lg shadow-sm space-y-8 -mt-8">
                <div className="space-y-6">
                    <div className="space-y-2 relative">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Current Password <span className="text-red-500">*</span></label>
                        <Input type="password" placeholder="Enter your current password" className="h-11 rounded-sm border-gray-200 text-xs" />
                        <span className="absolute right-4 top-9 text-gray-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </span>
                    </div>

                    <div className="space-y-2 relative">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">New Password <span className="text-red-500">*</span></label>
                        <Input type="password" placeholder="Enter your new password" className="h-11 rounded-sm border-gray-200 text-xs" />
                        <span className="absolute right-4 top-9 text-gray-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </span>
                        <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-green-500 w-full" />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Password Strength:</p>
                    </div>

                    <div className="bg-gray-50/50 p-6 border border-gray-100 rounded-sm">
                        <h4 className="text-[12px] font-bold text-gray-700 mb-3">Password must contain:</h4>
                        <ul className="space-y-2">
                            {[
                                'At least 8 characters',
                                'At least one uppercase letter (A-Z)',
                                'At least one lowercase letter (a-z)',
                                'At least one number (0-9)',
                                'At least one special character (!@#$%^&*()_+)'
                            ].map((rule, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2 relative">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Confirm New Password <span className="text-red-500">*</span></label>
                        <Input type="password" placeholder="Confirm your new password" className="h-11 rounded-sm border-gray-200 text-xs" />
                        <span className="absolute right-4 top-9 text-gray-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </span>
                    </div>

                    <Button
                        onClick={() => alert("Password updated successfully!")}
                        className="w-full bg-[#0f172a] hover:bg-[#151c63] text-white py-6 rounded-sm font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-4"
                    >
                        <Save size={16} /> Update Password
                    </Button>
                </div>

                <div className="bg-blue-50/50 border-l-4 border-blue-600 p-6 space-y-3">
                    <div className="flex items-center gap-2 text-blue-800">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h4 className="text-[13px] font-bold">Security Tips</h4>
                    </div>
                    <ul className="space-y-2 text-[11px] text-blue-700/80 font-medium">
                        <li>Use a unique password that you don't use for other accounts</li>
                        <li>Avoid using personal information like names or birthdays</li>
                        <li>Consider using a password manager to generate and store passwords</li>
                        <li>Change your password regularly to maintain security</li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 text-center">
                <p className="text-[10px] text-gray-400 font-medium">Copyright 2026-27 © <a href="https://www.devspectra.in" className="font-bold hover:text-blue-600 transition-colors">DevSpectra</a> All rights reserved.</p>
            </div>
        </div>
    );
}






