import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import bannerImg from '../assets/new_performance_bg.png';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopPerformers } from '@/store/websiteSlice';
import { Star, Award, GraduationCap, Quote } from 'lucide-react';

const TopPerformerPage = () => {
    const dispatch = useDispatch();
    const { performers, performerSettings } = useSelector((state) => state.website);

    useEffect(() => {
        dispatch(fetchTopPerformers());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
            <Navbar />
            <Marquee />

            <main className="flex-grow">
                {/* Dynamic Hero Banner */}
                <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden group">
                    <img
                        src={performerSettings?.bannerUrl || bannerImg}
                        alt="Top Performer Excellence"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent flex flex-col items-center justify-center text-center px-6">
                        <div className="inline-flex items-center gap-2 bg-yellow-500/10 backdrop-blur-md border border-yellow-500/20 px-4 py-1.5 rounded-full mb-6 animate-bounce">
                            <Award className="text-yellow-500" size={18} />
                            <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Excellence Awards</span>
                        </div>
                        <h1 className="text-white text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
                            {performerSettings?.title || "Top Performance Excellence"}
                        </h1>
                        <p className="text-white/90 text-sm md:text-xl max-w-3xl font-medium leading-relaxed drop-shadow-md">
                            {performerSettings?.description || "Delivering exceptional results through cutting-edge solutions and proven methodologies"}
                        </p>
                    </div>
                </div>

                {/* Performers Showcase Section */}
                <div className="py-24 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
                    
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Our Academic Achievers</h2>
                            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">Meet the exceptional students who have demonstrated extraordinary dedication and achieved outstanding results.</p>
                        </div>

                        {performers && performers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {performers.map((student, index) => (
                                    <div 
                                        key={student.id} 
                                        className="group relative bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 overflow-hidden"
                                    >
                                        {/* Decorative Background Elements */}
                                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-pink-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 delay-100"></div>

                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            {/* Image Container with Grade/Rank Icon */}
                                            <div className="relative mb-8">
                                                <div className="w-32 h-32 rounded-full p-1.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl overflow-hidden group-hover:rotate-6 transition-transform duration-500">
                                                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                                        <img 
                                                            src={student.image || "https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=2670&auto=format&fit=crop"} 
                                                            alt={student.name} 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-duration-700" 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-gray-50 transform group-hover:scale-110 transition-transform">
                                                    <GraduationCap className="text-indigo-600" size={20} />
                                                </div>
                                            </div>

                                            {/* Student Details */}
                                            <div className="space-y-3">
                                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                    {student.name}
                                                </h3>
                                                <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1 rounded-full">
                                                    <span className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">{student.course || "General Excellence"}</span>
                                                </div>
                                                <div className="relative mt-4">
                                                    <Quote className="text-gray-100 absolute -top-4 -left-2 scale-150" size={48} />
                                                    <p className="text-gray-500 text-sm leading-relaxed italic relative z-10 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                                        "{student.description || "An exceptional student who consistently demonstrates outstanding performance and commitment to technical excellence."}"
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Footer Interaction */}
                                            <div className="w-full h-[1px] bg-gray-100 my-6"></div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <Star className="fill-yellow-400 text-yellow-400" size={14} />
                                                Consistent Performer
                                                <Star className="fill-yellow-400 text-yellow-400" size={14} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-transform">
                                    <Star className="text-gray-300" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Performers Listed Yet</h3>
                                <p className="text-gray-400 text-sm">Our academic excellence board is currently being updated.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TopPerformerPage;
