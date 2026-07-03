import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCourseById } from '@/store/courseSlice';
import { fetchCourseResources, fetchStudentDashboard } from '@/store/studentDashboardSlice';
import { toast } from 'react-hot-toast';
import { 
    ArrowLeft, 
    BookOpen, 
    FileText, 
    PlayCircle, 
    Star, 
    IndianRupee, 
    GraduationCap, 
    Download,
    CheckCircle2,
    Clock,
    Layout,
    MessageSquare,
    Info,
    Calendar,
    ChevronRight,
    Play,
    Contact,
    Copy,
    ExternalLink,
    Video,
    CreditCard,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BASE_URL } from '@/config';

const StudentCourseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    
    // Support deep-linking via query params (e.g. ?tab=fees)
    const queryTab = new URLSearchParams(location.search).get('tab');
    const [activeTab, setActiveTab] = useState(queryTab || 'overview');
    
    // Sync tab if query param changes
    useEffect(() => {
        if (queryTab) {
            setActiveTab(queryTab);
        }
    }, [queryTab]);
    
    const { currentCourse: course, loading: courseLoading } = useSelector(state => state.courses);
    const { user } = useSelector(state => state.auth) || {};
    const { enrolledCourses, resources, loading: dashLoading } = useSelector(state => state.studentDashboard);
    
    const enrollment = useMemo(() => {
        if (!enrolledCourses || !Array.isArray(enrolledCourses)) return null;
        
        // Try exact ID match first (if backend ever adds courseId to admission)
        const idMatch = enrolledCourses.find(e => e.courseId === id || e._id === id);
        if (idMatch) return idMatch;

        // Fallback to name-based match (more robust)
        if (course?.title) {
            const courseTitle = course.title.toLowerCase().trim();
            return enrolledCourses.find(e => {
                const enName = (e.courseName || '').toLowerCase().trim();
                return enName === courseTitle;
            });
        }
        return null;
    }, [enrolledCourses, id, course?.title]);
    
    useEffect(() => {
        if (id) {
            dispatch(fetchCourseById(id));
            if (user?.email) {
                dispatch(fetchStudentDashboard(user.email));
            }
        }
    }, [dispatch, id, user?.email]);

    useEffect(() => {
        if (course?.title) {
            dispatch(fetchCourseResources(course.title));
        }
    }, [dispatch, course?.title]);

    const helperGetImageUrl = (url) => {
        if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        // Ensure relative URLs are processed correctly
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${BASE_URL}${cleanUrl.replace(/\\/g, '/')}`;
    };

    const handleDownload = (url) => {
        if (!url) return;
        const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url.replace(/\\/g, '/')}`;
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = fullUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Try to suggest a download name if it looks like a file
        if (fullUrl.toLowerCase().endsWith('.pdf') || fullUrl.toLowerCase().endsWith('.jpg') || fullUrl.toLowerCase().endsWith('.png')) {
            const fileName = fullUrl.split('/').pop();
            link.setAttribute('download', fileName);
        }
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (courseLoading || dashLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">Loading Details...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <Layout size={64} className="text-gray-200 mb-4" />
                <h2 className="text-xl font-black text-gray-900">Course Not Found</h2>
                <p className="text-gray-500 mt-2">The course you are looking for might have been moved or removed.</p>
                <Button onClick={() => navigate('/dashboard/all-courses')} className="mt-6 bg-indigo-600">Go Back</Button>
            </div>
        );
    }

    const tabItems = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
        { id: 'resources', label: 'Resources', icon: PlayCircle },
        { id: 'fees', label: 'Fees', icon: IndianRupee },
        { id: 'exam', label: 'Exams', icon: GraduationCap },
        { id: 'reviews', label: 'Reviews', icon: MessageSquare },
        { id: 'downloads', label: 'Downloads', icon: Download },
        { id: 'online-classes', label: 'Online Classes', icon: Video },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate('/dashboard/all-courses')}
                    className="rounded-xl hover:bg-indigo-50 text-gray-400 hover:text-indigo-600"
                >
                    <ArrowLeft size={20} />
                </Button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-sm font-black text-gray-900 truncate">{course?.title || 'Course Details'}</h1>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mt-1">Student Portal</p>
                </div>
            </div>

            {/* Course Hero */}
            <div className="p-6">
                <div className="relative h-[280px] md:h-[350px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100/50 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 group">
                    {/* Modern abstract pattern backdrop */}
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-300 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
                    </div>
                    
                    <img 
                        src={helperGetImageUrl(course?.imageUrl)} 
                        className="w-full h-full object-contain mix-blend-multiply p-12 transition-transform duration-700 group-hover:scale-110 relative z-10"
                        alt={course?.title}
                    />
                    
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-20"></div>
                    
                    <div className="absolute bottom-10 left-10 right-10 z-30">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <span className="bg-indigo-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/30">
                                {course?.categoryId?.name || course?.courseType || 'Certified'}
                            </span>
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl font-black text-white leading-tight drop-shadow-sm"
                        >
                            {course?.title}
                        </motion.h2>
                    </div>
                </div>
            </div>

            {/* Tab Navigation (Horizontal Scroll) */}
            <div className="px-6 overflow-x-auto no-scrollbar mb-6 flex gap-2">
                {tabItems.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab.id 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                            : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
                        }`}
                    >
                        <tab.icon size={14} className={activeTab === tab.id ? 'text-white' : 'text-indigo-400'} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6 pb-6">
                                <Card className="border-none shadow-sm rounded-[2rem]">
                                    <CardContent className="p-8">
                                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                                            <Info size={18} className="text-indigo-600" /> Course Financial Summary
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-50 text-center">
                                                <p className="text-lg font-black text-gray-900 leading-none">₹{course?.mrp || '0'}</p>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">Course Fee</p>
                                            </div>
                                            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50 text-center">
                                                <p className="text-lg font-black text-indigo-600 leading-none">₹{course?.price || 'Free'}</p>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">Discounted Fee</p>
                                            </div>
                                            {enrollment ? (
                                                <>
                                                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50 text-center">
                                                        <p className="text-lg font-black text-emerald-600 leading-none">₹{enrollment?.fees?.totalPaid || '0'}</p>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">Paid Fees</p>
                                                    </div>
                                                    <div className="bg-red-50/50 p-4 rounded-2xl border border-red-50 text-center">
                                                        <p className="text-lg font-black text-red-500 leading-none">₹{enrollment?.fees?.balanceDue || '0'}</p>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">Balanced Fees</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="col-span-2">
                                                    <button 
                                                        onClick={() => navigate(`/courses/${course.id}/checkout`)}
                                                        className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center gap-3 text-white shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all py-4"
                                                    >
                                                        <CreditCard size={18} />
                                                        <span className="text-sm font-black uppercase tracking-widest">Enroll Now</span>
                                                        <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2 border-t border-gray-50 pt-8">
                                            <Layout size={18} className="text-indigo-600" /> About Course
                                        </h3>
                                        <div 
                                            className="text-gray-500 text-sm leading-relaxed prose prose-indigo max-w-none"
                                            dangerouslySetInnerHTML={{ __html: course?.description || 'No description available.' }} 
                                        />
                                        
                                        <div className="grid grid-cols-2 gap-4 mt-8">
                                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-center">
                                                <Clock size={20} className="mx-auto text-indigo-600 mb-2" />
                                                <p className="text-lg font-black text-gray-900 leading-none">{course?.duration} {course?.durationUnit}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Course Duration</p>
                                            </div>
                                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-center">
                                                <PlayCircle size={20} className="mx-auto text-emerald-600 mb-2" />
                                                <p className="text-lg font-black text-gray-900 leading-none">{course?.totalLectures || '20+'}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Total Lectures</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* SYLLABUS TAB */}
                        {activeTab === 'syllabus' && (
                            <div className="space-y-6">
                                {/* HTML Syllabus Content */}
                                {course?.syllabus && (
                                    <Card className="border-none shadow-sm rounded-[2rem]">
                                        <CardContent className="p-8">
                                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                                <BookOpen size={18} className="text-indigo-600" /> Curriculum Overview
                                            </h3>
                                            {/* Intelligent List Formatting for plain text or HTML */}
                                            <div className="space-y-4">
                                                {/* If it contains common HTML block tags, render as HTML */}
                                                {course.syllabus.includes('<p>') || course.syllabus.includes('<ul>') || course.syllabus.includes('<br>') ? (
                                                    <div 
                                                        className="text-gray-500 text-sm leading-relaxed prose prose-indigo max-w-none whitespace-pre-wrap"
                                                        dangerouslySetInnerHTML={{ __html: course.syllabus }} 
                                                    />
                                                ) : (
                                                    /* If it's likely plain text with topics, split and list them */
                                                    <div className="flex flex-col gap-3">
                                                        {(course.syllabus.includes(',') ? course.syllabus.split(',') : course.syllabus.split(/\s(?=[A-Z])/))
                                                            .filter(item => item.trim().length > 0)
                                                            .map((item, idx) => (
                                                                <div key={idx} className="flex items-center gap-3 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-50/50 group hover:bg-indigo-50 transition-colors">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform"></div>
                                                                    <span className="text-sm font-bold text-gray-700 leading-none">{item.trim()}</span>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                    {!course?.syllabus && (
                                        <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-dashed border-gray-200">
                                            <BookOpen size={40} className="mx-auto text-gray-100 mb-3" />
                                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-loose">
                                                Curriculum details are currently being <br/> uploaded for this course.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                        {/* RESOURCES TAB (Notes & Videos) */}
                        {activeTab === 'resources' && (
                            <div className="space-y-6">
                                {/* Videos Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Video Lessons</h4>
                                        <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                            {resources[course?.title]?.videos?.length || 0} Total
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {resources[course?.title]?.videos?.length > 0 ? (
                                            resources[course?.title].videos.map((vid, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group active:scale-95 hover:border-indigo-200 transition-all cursor-pointer"
                                                    onClick={() => handleDownload(vid.videoUrl)}
                                                >
                                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                                                        <Play size={20} className="text-indigo-600 fill-indigo-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="text-[11px] font-black text-gray-900 truncate">{vid.title}</h5>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Lesson {idx + 1}</p>
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="rounded-full text-indigo-600 hover:bg-indigo-50"
                                                    >
                                                        <ChevronRight size={18} />
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                                                <PlayCircle size={40} className="mx-auto text-gray-100 mb-3" />
                                                <p className="text-gray-400 text-[10px] font-bold uppercase">No videos shared yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Study Materials</h4>
                                        <span className="bg-purple-100 text-purple-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                            {resources[course?.title]?.notes?.length || 0} Files
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {resources[course?.title]?.notes?.length > 0 ? (
                                            resources[course?.title].notes.map((note, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group active:scale-95 hover:border-purple-200 transition-all cursor-pointer"
                                                    onClick={() => handleDownload(note.fileUrl)}
                                                >
                                                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0">
                                                        <FileText size={20} className="text-purple-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="text-[11px] font-black text-gray-900 truncate">{note.title}</h5>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">PDF Document</p>
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="rounded-full text-purple-600 hover:bg-purple-50"
                                                    >
                                                        <Download size={18} />
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                                                <FileText size={40} className="mx-auto text-gray-100 mb-3" />
                                                <p className="text-gray-400 text-[10px] font-bold uppercase">No notes uploaded yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FEES TAB */}
                        {activeTab === 'fees' && (
                            <div className="space-y-6">
                                {enrollment ? (
                                    <>
                                        <Card className="border-none shadow-sm rounded-[2rem] bg-gradient-to-br from-indigo-600 to-blue-600 overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                            <CardContent className="p-8 relative z-10">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div>
                                                        <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Fee Progress</p>
                                                        <p className="text-3xl font-black text-white">{enrollment.fees?.paymentProgress || 0}% Paid</p>
                                                    </div>
                                                    <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                        <IndianRupee className="text-white" size={28} />
                                                    </div>
                                                </div>
                                                <div className="w-full bg-white/20 rounded-full h-3 mb-1">
                                                    <div className="bg-emerald-400 h-3 rounded-full transition-all duration-500" style={{ width: `${enrollment.fees?.paymentProgress || 0}%` }}></div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                                                <p className="text-lg font-black text-gray-900">₹{(enrollment.fees?.totalFee || 0).toLocaleString()}</p>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">Total</p>
                                            </div>
                                            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                                                <p className="text-lg font-black text-emerald-600">₹{(enrollment.fees?.totalPaid || 0).toLocaleString()}</p>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">Paid</p>
                                            </div>
                                            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                                                <p className="text-lg font-black text-red-500">₹{(enrollment.fees?.balanceDue || 0).toLocaleString()}</p>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">Due</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-gray-100">
                                        <Calendar size={40} className="mx-auto text-gray-100 mb-3" />
                                        <p className="text-gray-400 text-sm font-bold">Fee records for this course are not available.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* EXAM TAB */}
                        {activeTab === 'exam' && (
                            <div className="space-y-6">
                                <Card className="border-none shadow-sm rounded-[2rem]">
                                    <CardContent className="p-8">
                                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                            <GraduationCap size={18} className="text-indigo-600" /> Exam Schedule & Results
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 border border-gray-100">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                                    <Calendar size={20} className="text-blue-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-0.5">Final Examination</p>
                                                    <p className="text-xs font-black text-gray-900">Check regular hub for upcoming dates</p>
                                                </div>
                                                <span className="text-[9px] font-black text-gray-400 uppercase">TBD</span>
                                            </div>

                                            <div className="flex items-center gap-4 p-5 rounded-3xl bg-emerald-50 border border-emerald-100">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                                    <CheckCircle2 size={20} className="text-emerald-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Academic Status</p>
                                                    <p className="text-xs font-black text-emerald-900">{enrollment?.status || 'Active Student'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* REVIEWS TAB */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <Card className="border-none shadow-sm rounded-[2rem]">
                                    <CardContent className="p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                                <Star size={18} className="text-yellow-400 fill-yellow-400" /> Student Reviews
                                            </h3>
                                            <div className="bg-yellow-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                <span className="text-xs font-black text-yellow-700">{course?.rating || '4.5'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">SM</div>
                                                        <span className="text-xs font-black text-gray-900">Student Member</span>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-yellow-400 fill-yellow-400" />)}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 italic leading-relaxed">"Practical and clear explanations. Definitely helped me master the concepts quickly."</p>
                                            </div>
                                            <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">LR</div>
                                                        <span className="text-xs font-black text-gray-900">Learner</span>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[1,2,3,4].map(s => <Star key={s} size={10} className="text-yellow-400 fill-yellow-400" />)}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 italic leading-relaxed">"Great course material and excellent support from teachers."</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* DOWNLOADS TAB */}
                        {activeTab === 'downloads' && (
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Official Student Paperwork</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 group active:scale-95 transition-all">
                                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                                            <Contact size={20} className="text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-[11px] font-black text-gray-900 uppercase">Student ID Card</h5>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Roll No: {enrollment?.rollNo || 'Pending'}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-full text-indigo-600 hover:bg-indigo-50" onClick={() => {/* TODO: ID Card Logic */}}>
                                            <Download size={18} />
                                        </Button>
                                    </div>
                                    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 group active:scale-95 transition-all">
                                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                                            <FileText size={20} className="text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-[11px] font-black text-gray-900 uppercase">Admission Form</h5>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Enrollment Record {enrollment?.id || 'Pending'}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-full text-emerald-600 hover:bg-emerald-50" onClick={() => {/* TODO: Admission Form Logic */}}>
                                            <Download size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* ONLINE CLASSES TAB */}
                        {activeTab === 'online-classes' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Upcoming Live Sessions</h4>
                                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                        {course?.onlineClasses?.filter(c => c.status).length || 0} Active
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    {course?.onlineClasses?.filter(c => c.status).length > 0 ? (
                                        course.onlineClasses.filter(c => c.status).map((cls, idx) => (
                                            <Card key={idx} className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                                                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Live Session</span>
                                                            </div>
                                                            <h5 className="text-[15px] font-black text-gray-900 mb-1">{cls.title}</h5>
                                                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar size={12} className="text-gray-400" />
                                                                    {cls.date}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Clock size={12} className="text-gray-400" />
                                                                    {cls.time}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                                            <Video size={20} />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-3 mt-6">
                                                        <Button 
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(cls.link);
                                                                toast.success('Link copied!');
                                                            }} 
                                                            variant="outline"
                                                            className="rounded-xl border-gray-100 text-[10px] font-black uppercase tracking-widest h-11 hover:bg-gray-50 gap-2"
                                                        >
                                                            <Copy size={14} /> Copy Link
                                                        </Button>
                                                        <a href={cls.link} target="_blank" rel="noopener noreferrer" className="flex-1">
                                                            <Button className="w-full rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest h-11 hover:bg-indigo-700 shadow-lg shadow-indigo-100 gap-2">
                                                                <ExternalLink size={14} /> Join Now
                                                            </Button>
                                                        </a>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-dashed border-gray-200">
                                            <Video size={40} className="mx-auto text-gray-100 mb-4" />
                                            <h3 className="text-sm font-black text-gray-900 mb-1">No Live Classes Scheduled</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                                                Check back later for upcoming sessions <br/> for the {course?.title} course.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );
};

export default StudentCourseDetailsPage;
