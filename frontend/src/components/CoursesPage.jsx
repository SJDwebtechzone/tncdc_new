import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Grid, List, ChevronDown, ChevronRight, ChevronLeft, Star, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '@/store/courseSlice';
import { BASE_URL } from '@/config';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';

// Robust image URL handling
const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${BASE_URL}${url}`;
};

const CoursesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const courses = useSelector(state => state.courses.courses || []);
    const { siteSettings } = useSelector(state => state.website || {});
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');

    // Read category from URL query params
    const queryParams = new URLSearchParams(location.search);
    const categoryFromUrl = queryParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'All');

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    // Sync selectedCategory when URL changes (e.g. navigating from category card)
    useEffect(() => {
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [categoryFromUrl]);

    // Build unique category names from actual course data
    const categoryNames = [...new Set(courses.map(c => c.category?.name).filter(Boolean))];

    // Filter logic
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category?.name === selectedCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        return 0;
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            <Navbar />
            <Marquee />

            {/* Premium Header Section */}
            <div className="relative bg-slate-900 pt-32 pb-40 px-4 overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-10 -left-20 w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
                </div>

                <div className="container mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-6 shadow-xl">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span>Discover Your Potential</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                        Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Premium Courses</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
                        Elevate your career with industry-leading programs designed to give you the skills required to succeed in today’s dynamic world.
                    </p>
                </div>
                
                {/* Bottom Curve Divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
                    <svg className="relative block w-full h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,155.45,124.64,226.78,92.83,263.85,76.32,291.6,62,321.39,56.44Z" className="fill-[#F8FAFC]"></path>
                    </svg>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="container mx-auto px-4 pb-24 relative z-20 -mt-16">

                {/* Glassmorphism Filter Bar */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 mb-12 flex flex-col lg:flex-row justify-between items-center gap-6">
                    
                    {/* Search Search */}
                    <div className="relative w-full lg:w-96 flex-shrink-0 group">
                        <input
                            type="text"
                            placeholder="What do you want to learn?"
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-slate-100 shadow-inner focus:ring-2 focus:ring-purple-500/50 focus:bg-white transition-all text-slate-700 font-medium placeholder-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                    </div>

                    {/* Filters & View Toggle */}
                    <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
                        
                        {/* Category Dropdown */}
                        <div className="relative bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-200 p-1 flex items-center">
                            <select
                                className="appearance-none bg-transparent pl-4 pr-10 py-2.5 font-semibold text-slate-700 cursor-pointer focus:outline-none text-sm w-full"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="All">All Categories</option>
                                {categoryNames.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-200 p-1 flex items-center">
                            <select
                                className="appearance-none bg-transparent pl-4 pr-10 py-2.5 font-semibold text-slate-700 cursor-pointer focus:outline-none text-sm w-full"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="default">Default Sort</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                        </div>

                        {/* View Modes */}
                        <div className="flex bg-slate-100 rounded-xl p-1 shrink-0 gap-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'} <span className="text-slate-400 font-medium">Available</span>
                    </h2>
                </div>

                {/* Course Grid / List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'flex flex-col gap-6'}>
                    {filteredCourses.map((course, index) => (
                        <div 
                            key={course.id} 
                            className={`group bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 border border-slate-100 flex ${viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'} animate-fade-in-up`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >

                            {/* Image Container */}
                            <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-full sm:w-72 h-48 sm:h-auto shrink-0' : 'w-full h-56'} bg-slate-100`}>
                                {course.imageUrl ? (
                                    <img
                                        src={getImageUrl(course.imageUrl)}
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                                        <BookOpen size={40} />
                                        <span className="text-sm font-medium">No Image</span>
                                    </div>
                                )}
                                
                                {/* Overlay Gradient & Badges */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider block">
                                        {course.category?.name || 'General'}
                                    </span>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className={`p-6 md:p-8 flex flex-col ${viewMode === 'list' ? 'flex-grow justify-center' : 'h-full'}`}>
                                
                                {/* Meta Information */}
                                <div className="flex items-center gap-4 mb-3 text-sm font-medium text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                                        <span className="text-slate-700 font-bold">4.8</span>
                                        <span>({course.reviews || 120})</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>12 Weeks</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-slate-900 leading-snug mb-4 group-hover:text-purple-600 transition-colors line-clamp-2">
                                    {course.title}
                                </h3>

                                {/* Bottom Row: Price & Action */}
                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Price</span>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-extrabold text-slate-900">₹{(course.price || 0).toLocaleString()}</span>
                                            {course.mrp && course.mrp > course.price && (
                                                <span className="text-sm font-semibold text-slate-400 line-through mb-1">₹{course.mrp.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.id}`); }}
                                            className="w-full sm:w-auto h-12 px-8 flex items-center justify-center rounded-xl bg-purple-600 text-white font-black text-[11px] uppercase tracking-widest transition-all duration-300 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 active:scale-95"
                                        >
                                            Enroll Now
                                            <ArrowRight size={14} className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredCourses.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm mt-8">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No courses found</h3>
                        <p className="text-slate-500 max-w-md mx-auto">We couldn't find any courses matching your search criteria. Try adjusting your filters or search terms.</p>
                        <button 
                            onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                            className="mt-6 px-6 py-2 bg-purple-100 text-purple-700 font-bold rounded-full hover:bg-purple-200 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Modern Pagination */}
                {filteredCourses.length > 0 && (
                    <div className="flex justify-center items-center gap-2 mt-16">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-slate-700 hover:shadow-md transition-all border border-slate-100">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30">
                            1
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-600 hover:bg-slate-50 font-bold transition-all border border-slate-100">
                            2
                        </button>
                        <span className="text-slate-400 mx-1">...</span>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-slate-700 hover:shadow-md transition-all border border-slate-100">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

            </main>
            <Footer />

            {/* Scroll to top */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center justify-center text-slate-700 hover:text-purple-600 hover:-translate-y-1 transition-all"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                </button>
            </div>
        </div>
    );
};

export default CoursesPage;






