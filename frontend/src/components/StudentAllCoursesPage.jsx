import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCourses, fetchCategories } from '@/store/courseSlice';
import { fetchStudentDashboard } from '@/store/studentDashboardSlice';
import { BASE_URL } from '@/config';
import { 
    Search, 
    ArrowLeft, 
    Star, 
    ThumbsUp, 
    Eye, 
    ChevronRight,
    BookOpen,
    LayoutGrid,
    List as ListIcon
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StudentAllCoursesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Safety selection fallback
    const courseState = useSelector(state => state.courses) || {};
    const courses = courseState.courses || [];
    const categories = courseState.categories || [];
    const { siteSettings } = useSelector(state => state.website || {});
    
    // Get student enrolled courses
    const { user } = useSelector(state => state.auth) || {};
    const { enrolledCourses } = useSelector(state => state.studentDashboard) || { enrolledCourses: [] };
    
    // Map enrolled courses to matching catalog courses
    const myEnrolledCatalogCourses = useMemo(() => {
        if (!Array.isArray(enrolledCourses) || !Array.isArray(courses)) return [];
        
        const matchedCourses = [];
        const seenTitles = new Set();
        
        enrolledCourses.forEach(enrolled => {
            const rawEnrolledName = (enrolled.courseName || '').toLowerCase().trim();
            // Create a normalized version (no internal spaces) for fuzzy matching
            const normalizedEnrolled = rawEnrolledName.replace(/\s+/g, '');
            
            if (rawEnrolledName && !seenTitles.has(rawEnrolledName)) {
                // Find first match in the catalog
                const match = courses.find(c => {
                    if (!c || !c.title) return false;
                    const catTitle = String(c.title).toLowerCase().trim();
                    const normalizedCat = catTitle.replace(/\s+/g, '');
                    return catTitle === rawEnrolledName || normalizedCat === normalizedEnrolled || catTitle.includes(rawEnrolledName);
                });
                
                if (match) {
                    matchedCourses.push(match);
                    seenTitles.add(rawEnrolledName);
                }
            }
        });
        
        return matchedCourses;
    }, [courses, enrolledCourses]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchCategories());
        if (user?.email) {
            dispatch(fetchStudentDashboard(user.email));
        }
    }, [dispatch, user?.email]);

    // Defensive Filtering with useMemo to prevent performance issues
    const filteredCourses = useMemo(() => {
        try {
            if (!Array.isArray(myEnrolledCatalogCourses)) return [];
            return myEnrolledCatalogCourses.filter(course => {
                if (!course) return false;
                const title = String(course.title || '').toLowerCase();
                const code = String(course.courseCode || '').toLowerCase();
                const search = (searchTerm || '').toLowerCase();
                
                const matchesSearch = title.includes(search) || code.includes(search);
                const matchesCategory = selectedCategory === 'All' || 
                                       (course.category && typeof course.category === 'object' ? course.category.name === selectedCategory : course.category === selectedCategory) ||
                                       (course.Category && course.Category.name === selectedCategory);
                
                return matchesSearch && matchesCategory;
            });
        } catch (error) {
            console.error("Error filtering courses:", error);
            return [];
        }
    }, [myEnrolledCatalogCourses, searchTerm, selectedCategory]);

    const activeCategories = useMemo(() => {
        const cats = ['All'];
        if (Array.isArray(categories)) {
            const uniqueCats = new Set(
                categories
                    .filter(c => c && c.status !== false && c.name)
                    .map(c => c.name)
            );
            return ['All', ...Array.from(uniqueCats)];
        }
        return cats;
    }, [categories]);

    // Utility for image paths
    const getImageUrl = (url) => {
        if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return `${BASE_URL}${url}`;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans overflow-x-hidden">
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-8 sticky top-0 z-40 shadow-sm border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/pwa')}
                        className="group hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all rounded-xl h-10 px-4 -ml-2"
                    >
                        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Hub</span>
                    </Button>
                    <h1 className="text-lg font-black text-gray-900 tracking-tight">My Courses</h1>
                    <div className="w-10"></div>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="mt-6 flex overflow-x-auto gap-3 px-6 pb-2 no-scrollbar scroll-smooth">
                {activeCategories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`shrink-0 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            selectedCategory === cat 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                            : 'bg-white text-gray-400 hover:text-gray-900 shadow-sm border border-gray-100'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="px-6 mt-8 space-y-6">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                        {filteredCourses.length} courses found
                    </p>
                    <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-300'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-300'}`}
                        >
                            <ListIcon size={16} />
                        </button>
                    </div>
                </div>

                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6' : 'space-y-4 max-w-4xl mx-auto'}>
                    {filteredCourses.length > 0 ? filteredCourses.map((course) => (
                        viewMode === 'grid' ? (
                            <Card 
                                key={course.id} 
                                onClick={() => navigate(`/dashboard/courses/${course.id || course._id}`)}
                                className="border border-white shadow-lg shadow-indigo-100/50 rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-white to-gray-50/50 group hover:shadow-2xl hover:shadow-indigo-200/60 transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
                            >
                                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-2">
                                    <img 
                                        src={getImageUrl(course.imageUrl)} 
                                        alt={course.title || 'Course'} 
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 opacity-90" 
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                                        {typeof course.category === 'object' ? course.category?.name : (course.category || 'Special')}
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                                        <Star size={10} className="fill-yellow-400 text-yellow-400 border-none" />
                                        {course.rating || '4.5'}
                                    </div>
                                </div>
                                <CardContent className="p-7">
                                    <div className="flex flex-col mb-4">
                                        <h4 className="font-black text-gray-900 text-xl leading-tight mb-1">{course.title}</h4>
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest opacity-70">{course.courseCode || 'TNCDC'}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                            <ThumbsUp size={14} className="text-pink-500" />
                                            {course.likes || 0}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                            <Eye size={14} className="text-blue-500" />
                                            {course.views || 0}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                            <BookOpen size={14} className="text-emerald-500" />
                                            {course.duration || 'Flexible'}
                                        </div>
                                    </div>

                                    {course.description && (
                                        <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                                            {course.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
                                        <div className="flex flex-col">
                                            {course.mrp && <span className="text-[10px] text-gray-400 line-through font-bold">₹{course.mrp}</span>}
                                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">₹{course.price || 'Free'}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/dashboard/courses/${course.id || course._id}`);
                                                }}
                                                className="w-full px-4 py-3.5 rounded-[1rem] bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_20px_-8px_rgba(79,70,229,0.5)] group-hover:shadow-[0_8px_25px_-8px_rgba(79,70,229,0.8)] transition-all active:scale-95 whitespace-nowrap overflow-hidden relative"
                                            >
                                                <div className="absolute inset-0 bg-white/20 blur-md rounded-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                                Enroll Now
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div 
                                key={course.id} 
                                className="bg-white rounded-[2rem] p-4 shadow-sm flex flex-col gap-4 group hover:shadow-md transition-all cursor-pointer border border-gray-100"
                                onClick={() => navigate(`/dashboard/courses/${course.id || course._id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                        <img src={getImageUrl(course.imageUrl)} alt={course.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 text-sm truncate mb-1">{course.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-indigo-600">₹{course.price || 'Free'}</span>
                                            <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">{typeof course.category === 'object' ? course.category?.name : course.category}</span>
                                        </div>
                                    </div>
                                </div>
                                {course.description && (
                                    <p className="text-gray-500 text-xs line-clamp-2 px-1">
                                        {course.description}
                                    </p>
                                )}
                                <div className="flex justify-end border-t border-gray-50 pt-3 gap-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/dashboard/courses/${course.id || course._id}`);
                                        }}
                                        className="px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5"
                                    >
                                        Enroll Now <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )
                    )) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                            <Search size={40} className="mb-4 opacity-20" />
                            <p className="text-sm font-bold">No courses found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default StudentAllCoursesPage;
