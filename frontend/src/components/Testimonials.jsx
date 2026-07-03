import React, { useEffect } from 'react';
import { Quote } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTestimonials } from '@/store/websiteSlice';
import { BASE_URL } from '@/config';

const Testimonials = () => {
    const dispatch = useDispatch();
    const testimonials = useSelector((state) => state.website.testimonials || []);
    const settings = useSelector((state) => state.website.testimonialSettings);

    useEffect(() => {
        dispatch(fetchTestimonials());
    }, [dispatch]);

    // Split testimonials into two rows for the infinite scroll effect
    const midIndex = Math.ceil(testimonials.length / 2);
    const testimonialsOne = testimonials.slice(0, midIndex);
    const testimonialsTwo = testimonials.slice(midIndex);

    const TestimonialCard = ({ item }) => (
        <div className="flex-shrink-0 w-[400px] p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-50 overflow-hidden border border-gray-100 flex-shrink-0">
                    {item.image ? (
                        <img 
                            src={item.image.startsWith('/uploads') ? `${BASE_URL}${item.image}` : item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/50 bg-primary/5">
                            <Quote size={20} />
                        </div>
                    )}
                </div>
                <div>
                    <h5 className="font-bold text-gray-900">{item.name}</h5>
                    <p className="text-[10px] text-primary uppercase font-black tracking-[0.2em]">
                        {item.role} {item.institute ? `@ ${item.institute}` : ''}
                    </p>
                </div>
            </div>
            <p className="text-gray-500 leading-relaxed italic text-sm">
                "{item.content}"
            </p>
        </div>
    );

    if (testimonials.length === 0) return null;

    // Decide layout based on count
    const isSmallCount = testimonials.length <= 4;

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>
            
            <div className="container mx-auto px-6 mb-20 text-center relative z-10">
                {settings.subtitle && (
                    <span className="px-5 py-2 bg-white text-primary font-black text-[10px] uppercase tracking-[0.3em] rounded-full mb-6 inline-block shadow-sm border border-slate-100">
                        {settings.subtitle}
                    </span>
                )}
                {settings.title && (
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mt-4 tracking-tighter leading-tight" 
                        dangerouslySetInnerHTML={{ __html: settings.title }}>
                    </h2>
                )}
            </div>

            <div className="relative z-10 px-6">
                {isSmallCount ? (
                    /* Centered Static Layout for 1-4 Testimonials */
                    <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
                        {testimonials.map((item) => (
                            <TestimonialCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    /* Infinite Scroll Layout for 5+ Testimonials */
                    <>
                        {/* Row 1 - Scroll Right to Left */}
                        <div className="flex gap-6 animate-scroll-infinite mb-8 pb-4">
                            {[...testimonialsOne, ...testimonialsOne, ...testimonialsOne].map((item, idx) => (
                                <TestimonialCard key={`row1-${idx}`} item={item} />
                            ))}
                        </div>

                        {/* Row 2 - Scroll Left to Right */}
                        <div className="flex gap-6 animate-scroll-infinite flex-row-reverse">
                            {[...testimonialsTwo, ...testimonialsTwo, ...testimonialsTwo].map((item, idx) => (
                                <TestimonialCard key={`row2-${idx}`} item={item} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Testimonials;






