import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { ChevronRight, BookOpen, Code, Palette, Database, Monitor, Cpu, Globe, Layers, Briefcase, BarChart3 } from 'lucide-react';

// Gradient palette for category cards
const CARD_GRADIENTS = [
    { bg: 'from-violet-500 to-purple-600', light: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', glow: 'shadow-violet-200/50' },
    { bg: 'from-blue-500 to-cyan-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', glow: 'shadow-blue-200/50' },
    { bg: 'from-emerald-500 to-teal-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', glow: 'shadow-emerald-200/50' },
    { bg: 'from-orange-500 to-amber-500', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', glow: 'shadow-orange-200/50' },
    { bg: 'from-pink-500 to-rose-500', light: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100', glow: 'shadow-pink-200/50' },
    { bg: 'from-indigo-500 to-blue-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', glow: 'shadow-indigo-200/50' },
    { bg: 'from-red-500 to-pink-500', light: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', glow: 'shadow-red-200/50' },
    { bg: 'from-teal-500 to-green-500', light: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', glow: 'shadow-teal-200/50' },
];

// Icon pool based on common educational categories
const CATEGORY_ICONS = [Code, Database, Monitor, Palette, Globe, Cpu, Layers, Briefcase, BarChart3, BookOpen];

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/course-categories`);
                setCategories(response.data.filter(cat => cat.status));
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="py-32 text-center">
                <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(180deg, #fafbff 0%, #f0f0ff 50%, #ffffff 100%)' }}>
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-blue-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-pink-200/40 to-orange-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-100/20 to-cyan-100/20 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-sm border border-purple-100 mb-8">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-purple-600 uppercase tracking-[3px]">Course Categories</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.05] mb-6">
                        Explore Top Courses
                        <br />
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500">
                                Categories
                            </span>
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                                <path d="M1 5.5C47 2 153 2 199 5.5" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round"/>
                                <defs><linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                        Discover industry-leading programs designed to transform your career and unlock your potential.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((cat, idx) => {
                        const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
                        const IconComponent = CATEGORY_ICONS[idx % CATEGORY_ICONS.length];

                        return (
                            <div
                                key={cat.id}
                                onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.name)}`)}
                                className={`group relative bg-white rounded-3xl p-7 border ${gradient.border} hover:shadow-2xl ${gradient.glow} hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden`}
                            >
                                {/* Subtle gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient.bg} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-3xl`}></div>

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 ${gradient.light} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 overflow-hidden`}>
                                        {cat.iconUrl ? (
                                            <img src={cat.iconUrl} className="w-10 h-10 object-contain" alt={cat.name} />
                                        ) : (
                                            <IconComponent className={`w-7 h-7 ${gradient.text}`} strokeWidth={2} />
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-lg font-black text-gray-900 mb-2 leading-snug group-hover:text-gray-800 transition-colors line-clamp-2">
                                        {cat.name}
                                    </h4>

                                    {/* Count Badge & Arrow */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${gradient.light}`}>
                                            <BookOpen className={`w-3.5 h-3.5 ${gradient.text}`} />
                                            <span className={`text-xs font-bold ${gradient.text}`}>
                                                {cat.count} {cat.count === 1 ? 'Course' : 'Courses'}
                                            </span>
                                        </div>
                                        <div className={`w-9 h-9 rounded-xl ${gradient.light} flex items-center justify-center group-hover:bg-gradient-to-br group-hover:${gradient.bg} transition-all duration-300`}>
                                            <ChevronRight className={`w-4 h-4 ${gradient.text} group-hover:text-white group-hover:translate-x-0.5 transition-all`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative corner accent */}
                                <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${gradient.bg} opacity-[0.06] rounded-full group-hover:opacity-[0.12] group-hover:scale-150 transition-all duration-700`}></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Categories;
