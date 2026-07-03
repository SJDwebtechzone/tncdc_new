import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/config';
import { ArrowRight, Star, Clock, BookOpen, Users, TrendingUp } from 'lucide-react';

// Robust image URL handling
const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${BASE_URL}${url}`;
};

const Courses = () => {
    const navigate = useNavigate();
    const siteSettings = useSelector((state) => state.website.siteSettings);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/courses`);
                // Show active courses, prioritize popular ones, limit to 6
                const activeCourses = response.data.filter(c => c.status);
                const popular = activeCourses.filter(c => c.isPopular);
                setCourses((popular.length > 0 ? popular : activeCourses).slice(0, 6));
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading || courses.length === 0) return null;

    return (
        <section className="relative py-28 overflow-hidden bg-white">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-32 bg-gray-50/50"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gray-50/50"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-8">
                    <div className="max-w-2xl text-left">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-6" style={{ backgroundColor: `color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 10%, transparent)`, borderColor: `color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 20%, transparent)` }}>
                            <TrendingUp className="w-4 h-4" style={{ color: siteSettings?.primaryColor || '#10b981' }} />
                            <span className="text-xs font-bold uppercase tracking-[2px]" style={{ color: siteSettings?.primaryColor || '#10b981' }}>Popular Courses</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-4">
                            Our Most Popular
                            <br />
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${siteSettings?.primaryColor || '#10b981'}, ${siteSettings?.secondaryColor || '#059669'})` }}>
                                Professional Courses
                            </span>
                        </h2>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed">
                            Industry-recognized certifications designed by experts to accelerate your career growth.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/courses')}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-all shrink-0 shadow-xl shadow-gray-900/20 active:scale-95"
                    >
                        View All Courses
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {courses.map((course, idx) => (
                        <div
                            key={course.id}
                            className="group relative bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)] hover:-translate-y-3 transition-all duration-700"
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={getImageUrl(course.imageUrl)}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Badges */}
                                <div className="absolute top-5 left-5 flex items-center gap-2">
                                    {course.isPopular && (
                                        <span className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-orange-300/30 uppercase tracking-wider">
                                            🔥 Popular
                                        </span>
                                    )}
                                    <span className="bg-white/95 backdrop-blur-md text-gray-700 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                                        {course.courseType || 'Course'}
                                    </span>
                                </div>

                                {/* Price Tag */}
                                <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl border border-white/50">
                                    {course.mrp && course.mrp > course.price && (
                                        <span className="text-[10px] font-bold text-gray-400 line-through block text-right">₹{Number(course.mrp).toLocaleString()}</span>
                                    )}
                                    <span className="text-xl font-black" style={{ color: siteSettings?.primaryColor || '#10b981' }}>
                                        ₹{Number(course.price || 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-7">
                                {/* Rating */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3.5 h-3.5 ${i < Math.round(course.rating || 4.5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-gray-500">
                                        {course.rating || '4.5'} ({course.views || 0} views)
                                    </span>
                                </div>

                                {/* Title */}
                                <h4 className="text-xl font-black text-gray-900 mb-5 leading-snug line-clamp-2 min-h-[52px] group-hover:text-primary transition-colors duration-300" style={{ color: `group-hover:${siteSettings?.primaryColor}` }}>
                                    {course.title}
                                </h4>

                                {/* Meta */}
                                <div className="flex items-center gap-5 pb-5 border-b border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500">{course.duration || '3'} {course.durationUnit || 'Months'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${siteSettings?.secondaryColor || '#059669'} 10%, transparent)` }}>
                                            <BookOpen className="w-3.5 h-3.5" style={{ color: siteSettings?.secondaryColor || '#059669' }} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500">{course.totalLectures || 0} Modules</span>
                                    </div>
                                </div>

                                {/* CTAs */}
                                <div className="mt-5">
                                    <button
                                        className="w-full py-4 text-white rounded-xl font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        style={{ background: `linear-gradient(to right, ${siteSettings?.primaryColor || '#10b981'}, ${siteSettings?.secondaryColor || '#059669'})` }}
                                        onClick={() => navigate(`/courses/${course.id}`)}
                                    >
                                        Enroll Now
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Courses;
