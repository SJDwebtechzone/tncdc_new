import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Clock, Loader2, CheckCircle2, Archive, User, Search, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HelpSupportPage() {
    const [activeTab, setActiveTab] = useState('All');

    const stats = [
        { label: "Total Tickets", count: 0, icon: Ticket, bg: "bg-[#0f172a]" }, // Dark blue/black like screenshot
        { label: "Open", count: 0, icon: Clock, bg: "bg-[#eab308]" }, // Yellow
        { label: "In Progress", count: 0, icon: Loader2, bg: "bg-[#64748b]" }, // Gray
        { label: "Resolved", count: 0, icon: CheckCircle2, bg: "bg-[#10b981]" }, // Green
        { label: "Closed", count: 0, icon: Archive, bg: "bg-[#b45309]" }, // Brown
        { label: "Assigned to Me", count: 0, icon: User, bg: "bg-[#1e293b]" } // Dark
    ];

    const tabs = ["All", "Open", "In Progress", "Resolved", "Closed"];

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-32 gap-3 transition-transform hover:-translate-y-1">
                        <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center text-white shadow-md`}>
                            <stat.icon size={20} />
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{stat.count}</div>
                            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px] p-6">
                <div className="flex items-center gap-2 mb-8">
                    <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                        <span className="text-gray-400">🎧</span> Support Tickets
                    </h2>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-transparent mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "text-sm font-medium px-4 py-2 rounded-lg transition-colors",
                                activeTab === tab
                                    ? "bg-[#1e3a8a] text-white shadow-md"
                                    : "text-blue-900 hover:bg-gray-50"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                    <FolderOpen size={64} className="mb-4 text-gray-400 opacity-50" strokeWidth={1.5} />
                    <h3 className="text-lg font-medium text-gray-500 mb-1">No support tickets found</h3>
                    <p className="text-xs text-gray-400">All support tickets will appear here when students create them.</p>
                </div>
            </div>
        </div>
    )
}






