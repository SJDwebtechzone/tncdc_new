import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '@/store/websiteSlice';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events = () => {
    const dispatch = useDispatch();
    const events = useSelector((state) => state.website.events || []);

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    const activeEvents = events.filter((e) => e.status !== false).slice(0, 3);

    if (activeEvents.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd] relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 shadow-sm mb-6 transform hover:scale-105 transition-transform duration-300">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-sm font-bold text-blue-900 tracking-widest uppercase">Upcoming Events</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                        Join Our Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Happenings</span>
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Stay connected, learn from experts, and participate in our exciting upcoming events.
                    </p>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeEvents.map((event) => (
                        <div
                            key={event.id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50"
                        >
                            {/* Image Container */}
                            <div className="relative h-56 w-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10"></div>
                                {event.image ? (
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 transform group-hover:scale-110 transition-transform duration-700"></div>
                                )}
                                
                                {/* Date Badge */}
                                <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm rounded-xl p-2 text-center shadow-lg transform group-hover:scale-105 transition-transform duration-300 border border-white/20">
                                    <div className="text-blue-600 font-bold text-lg leading-none">{new Date(event.date || Date.now()).getDate()}</div>
                                    <div className="text-slate-500 text-xs font-semibold uppercase">{new Date(event.date || Date.now()).toLocaleString('default', { month: 'short' })}</div>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-6 relative">
                                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {event.title}
                                </h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-slate-600 text-sm">
                                        <Clock size={16} className="text-blue-500 mr-3 flex-shrink-0" />
                                        <span className="font-medium">{event.time || 'TBA'}</span>
                                    </div>
                                    <div className="flex items-center text-slate-600 text-sm">
                                        <MapPin size={16} className="text-blue-500 mr-3 flex-shrink-0" />
                                        <span className="font-medium truncate">{event.location || 'TBA'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;
