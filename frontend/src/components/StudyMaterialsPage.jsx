import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudyMaterials } from '@/store/websiteSlice';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import { FileText, Download, Search, BookOpen, Clock, Calendar } from 'lucide-react';

const StudyMaterialsPage = () => {
    const dispatch = useDispatch();
    const materials = useSelector((state) => state.website.studyMaterials || []);

    useEffect(() => {
        dispatch(fetchStudyMaterials());
        window.scrollTo(0, 0);
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />
            <Marquee />

            <main className="pb-24">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-[#0F172A] py-20 mb-16">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
                    
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                                Access Premium <span className="text-indigo-400">Study Materials</span>
                            </h1>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Enhance your learning experience with our curated collection of course materials, 
                                lecture notes, and reference guides designed for your academic success.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6">
                    {materials.length === 0 ? (
                        <div className="bg-white rounded-[40px] border border-slate-200 p-20 text-center shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <BookOpen size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Materials Available Yet</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                We're currently updating our library. Please check back soon for expert-curated study resources.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-5xl mx-auto">
                            {materials.filter(m => m.status).map((material) => (
                                <div 
                                    key={material.id} 
                                    className="group bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 flex flex-col md:flex-row items-center gap-6"
                                >
                                    {/* Icon Column */}
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                                        <FileText size={28} />
                                    </div>
                                    
                                    {/* Content Column */}
                                    <div className="flex-grow text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {material.title}
                                            </h3>
                                            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                            <div className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Calendar size={14} />
                                                <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-1 max-w-2xl">
                                            {material.description}
                                        </p>
                                    </div>

                                    {/* Action Column */}
                                    <div className="flex-shrink-0 w-full md:w-auto">
                                        <a 
                                            href={material.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-full md:w-auto gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-slate-200 group-hover:shadow-indigo-200"
                                        >
                                            <Download size={18} />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default StudyMaterialsPage;
