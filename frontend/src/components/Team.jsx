import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTeachers } from '@/store/websiteSlice';
import { BASE_URL } from '@/config';
import { Facebook, Twitter, Instagram, Linkedin, MoveRight, Layers } from 'lucide-react';

const Team = () => {
    const dispatch = useDispatch();
    const teachers = useSelector((state) => state.website.teachers || []);

    useEffect(() => {
        dispatch(fetchTeachers());
    }, [dispatch]);

    if (teachers.length === 0) {
        return null;
    }

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Architectural Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col mb-32">
                    <div className="flex items-center gap-6 mb-8">
                        <span className="h-[2px] w-20 bg-slate-900"></span>
                        <p className="font-bold text-sm tracking-[0.4em] uppercase text-slate-400">The Architects of Knowledge</p>
                    </div>
                    <h2 className="text-6xl md:text-[8rem] font-black text-slate-900 leading-[0.8] tracking-tighter mb-12">
                        Editorial <br />
                        <span className="text-primary italic">Excellence.</span>
                    </h2>
                </div>

                {/* Staggered Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-32 gap-x-12">
                    {teachers.map((teacher, idx) => (
                        <div 
                            key={teacher.id || idx} 
                            className={`group relative flex flex-col ${idx % 2 === 1 ? 'md:translate-y-20' : ''}`}
                        >
                            {/* Decorative Index */}
                            <div className="absolute -top-16 -left-8 text-9xl font-black text-slate-100/50 z-0 select-none group-hover:text-primary/10 transition-colors">
                            {String(idx + 1).padStart(2, '0')}
                            </div>

                            {/* Image Container with Floating Border */}
                            <div className="relative z-10">
                                <div className="absolute -inset-4 border border-slate-200 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700"></div>
                                <div className="relative h-[500px] w-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                                    <img
                                        src={teacher?.image?.startsWith('/uploads') ? `${BASE_URL}${teacher.image}` : (teacher?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher")}
                                        alt={teacher?.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    {/* Hover Info Reveal */}
                                    <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] bg-slate-900">
                                        <p className="text-white/60 text-xs font-medium leading-relaxed italic mb-4">
                                            "{teacher?.description}"
                                        </p>
                                        <div className="flex gap-4">
                                            {teacher?.facebookUrl && <a href={teacher.facebookUrl} className="text-white/40 hover:text-primary transition-colors"><Facebook size={16} /></a>}
                                            {teacher?.twitterUrl && <a href={teacher.twitterUrl} className="text-white/40 hover:text-primary transition-colors"><Twitter size={16} /></a>}
                                            {teacher?.instagramUrl && <a href={teacher.instagramUrl} className="text-white/40 hover:text-primary transition-colors"><Instagram size={16} /></a>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Section - Absolute Offset */}
                            <div className="mt-12 relative z-20 pl-8">
                                <div className="absolute left-0 top-0 h-full w-[1px] bg-slate-200">
                                    <div className="h-0 group-hover:h-full w-full bg-primary transition-all duration-1000"></div>
                                </div>
                                
                                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">
                                    {teacher?.designation}
                                </span>
                                <h3 className="text-4xl font-black text-slate-900 group-hover:text-primary transition-colors flex items-center gap-4">
                                    {teacher?.name}
                                    <MoveRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                                </h3>

                                {/* Vertical Label for Design */}
                                <div className="absolute top-0 right-0 origin-bottom-right -rotate-90 translate-x-full translate-y-[-100%] pointer-events-none">
                                    <span className="text-[8px] font-black text-slate-200 uppercase tracking-[1em] whitespace-nowrap">
                                        Faculty EXPERT
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Section Decoration */}
            <div className="mt-64 flex flex-col items-center">
                <div className="h-32 w-[1px] bg-slate-200 mb-12"></div>
                <div className="inline-flex items-center gap-4 px-8 py-4 border border-slate-900 group hover:bg-slate-900 transition-colors cursor-pointer">
                    <span className="text-slate-900 font-bold uppercase tracking-widest text-xs group-hover:text-white">View All Faculty</span>
                    <Layers size={16} className="text-slate-900 group-hover:text-white" />
                </div>
            </div>
        </section>
    );
};

export default Team;






