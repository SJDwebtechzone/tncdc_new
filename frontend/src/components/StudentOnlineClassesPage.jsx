import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchOnlineClassesAsync, fetchCourses } from '@/store/courseSlice';
import { fetchStudentDashboard } from '@/store/studentDashboardSlice';
import { Video, Calendar, Clock, ExternalLink, Copy, ChevronRight, Layout } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';

const StudentOnlineClassesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { onlineClasses, loading: classesLoading } = useSelector(state => state.courses);
    const { enrolledCourses, loading: dashLoading } = useSelector(state => state.studentDashboard);

    useEffect(() => {
        dispatch(fetchOnlineClassesAsync());
        if (user?.email) {
            dispatch(fetchStudentDashboard(user.email));
        }
    }, [dispatch, user?.email]);

    const activeClasses = useMemo(() => {
        if (!onlineClasses || !enrolledCourses) return [];
        
        // Filter classes that belong to enrolled courses and are active
        const enrolledTitles = enrolledCourses.map(e => (e.courseName || '').toLowerCase().trim());
        
        return onlineClasses.filter(cls => {
            const courseTitle = (cls.course?.title || '').toLowerCase().trim();
            return cls.status && enrolledTitles.includes(courseTitle);
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [onlineClasses, enrolledCourses]);

    const copyToClipboard = (link) => {
        navigator.clipboard.writeText(link);
        toast.success('Meeting link copied!');
    };

    if (classesLoading || dashLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">Fetching Your Classes...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Video size={20} />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-gray-900">Online Live Classes</h1>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mt-1">My Dashboard</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Hero Stats */}
                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl font-black mb-2 tracking-tight">{activeClasses.length}</h2>
                        <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em]">Scheduled Live Sessions</p>
                    </div>
                </div>

                {/* Class List */}
                <div className="space-y-4">
                    {activeClasses.length > 0 ? (
                        activeClasses.map((cls, idx) => (
                            <motion.div
                                key={cls.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Ongoing/Upcoming</span>
                                                </div>
                                                <h3 className="text-[17px] font-black text-gray-900 leading-snug mb-2">{cls.title}</h3>
                                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">{cls.course?.title}</p>
                                                
                                                <div className="flex items-center gap-4 text-[11px] text-gray-500 font-bold uppercase">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={13} className="text-gray-400" />
                                                        {cls.date}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={13} className="text-gray-400" />
                                                        {cls.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-14 h-14 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                                                <Video size={24} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-8">
                                            <Button 
                                                variant="outline" 
                                                onClick={() => copyToClipboard(cls.link)}
                                                className="rounded-xl border-gray-100 text-[10px] font-black uppercase tracking-widest h-12 gap-2 hover:bg-gray-50"
                                            >
                                                <Copy size={14} /> Copy link
                                            </Button>
                                            <a href={cls.link} target="_blank" rel="noopener noreferrer">
                                                <Button className="w-full rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest h-12 shadow-lg shadow-indigo-100 gap-2 hover:bg-indigo-700">
                                                    <ExternalLink size={14} /> Join Now
                                                </Button>
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                                <Video size={40} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">No Classes Found</h3>
                            <p className="text-gray-400 text-xs px-10 leading-relaxed font-bold uppercase tracking-widest opacity-60">
                                You don't have any live classes scheduled for your enrolled courses right now.
                            </p>
                            <Button 
                                onClick={() => navigate('/dashboard/all-courses')}
                                variant="link" 
                                className="mt-6 text-indigo-600 font-black uppercase tracking-widest text-[10px]"
                            >
                                Browse More Courses <ChevronRight size={14} />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentOnlineClassesPage;
