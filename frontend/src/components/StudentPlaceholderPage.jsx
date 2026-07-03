import React from 'react';
import { Card } from "@/components/ui/card";
import { 
    LayoutDashboard, 
    Construction, 
    ArrowLeft,
    Sparkles,
    Stars
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const StudentPlaceholderPage = ({ title = "Feature Coming Soon" }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans pb-10">
            {/* 1. Header with Breadcrumb-style back */}
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/dashboard')}
                    className="group hover:bg-white text-gray-400 hover:text-indigo-600 transition-all rounded-2xl h-12 px-6"
                >
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to Hub</span>
                </Button>
            </div>

            {/* 2. Content Card */}
            <Card className="relative overflow-hidden rounded-[3rem] bg-white border-none shadow-sm min-h-[500px] flex items-center justify-center p-12">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl -ml-40 -mb-40"></div>
                
                <div className="relative z-10 max-w-lg w-full text-center space-y-8">
                    <div className="mx-auto w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-100 rotate-3 transform transition-transform hover:rotate-0 duration-500">
                        <Construction size={48} strokeWidth={1.5} />
                    </div>
                    
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                            <Sparkles size={14} /> Under Development
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                            {title}
                        </h1>
                        <p className="text-gray-400 font-medium text-lg leading-relaxed">
                            We're currently crafting a premium experience for <span className="text-indigo-600 font-bold">"{title}"</span>. Stay tuned, some amazing features are coming your way!
                        </p>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button 
                            onClick={() => navigate('/dashboard')}
                            className="bg-gray-900 hover:bg-black text-white rounded-2xl px-10 h-14 text-xs font-black uppercase tracking-widest shadow-xl shadow-gray-100 transition-all active:scale-95 w-full sm:w-auto"
                        >
                            Return Home
                        </Button>
                        <Button 
                            variant="outline"
                            className="border-gray-100 hover:border-indigo-100 hover:text-indigo-600 bg-white rounded-2xl px-10 h-14 text-xs font-black uppercase tracking-widest transition-all w-full sm:w-auto"
                        >
                            View Roadmap <Stars size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* 3. Small Info Footer */}
            <div className="flex items-center justify-center gap-8 opacity-40 grayscale group">
                <div className="flex items-center gap-2">
                    <LayoutDashboard size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Premium Student Panel</span>
                </div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                <div className="text-[10px] font-black uppercase tracking-widest">TNCDC Official 2026</div>
            </div>
        </div>
    );
};

export default StudentPlaceholderPage;
