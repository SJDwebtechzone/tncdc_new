import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BASE_URL } from '@/config';
import { Link } from 'react-router-dom';
import { fetchSlides } from '@/store/websiteSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Hero = () => {
    const bannerSettings = useSelector((state) => state.website.bannerSettings);
    const siteSettings = useSelector((state) => state.website.siteSettings);
    const slides = useSelector((state) => state.website.slides || []);
    const dispatch = useDispatch();

    useEffect(() => {
        if (bannerSettings?.displayMode === 'slider') {
            dispatch(fetchSlides());
        }
    }, [bannerSettings?.displayMode, dispatch]);

    // Slider View
    if (bannerSettings?.displayMode === 'slider' && slides.length > 0) {
        return (
            <div className="relative w-full h-[60vh] lg:h-[80vh] overflow-hidden bg-slate-900">
                <Swiper
                    modules={[Pagination, Autoplay, EffectFade]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    effect="fade"
                    loop={true}
                    className="w-full h-full"
                >
                    {slides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="relative w-full h-full">
                                {/* Slide Image */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear hover:scale-110"
                                    style={{ 
                                        backgroundImage: `url('${slide.imageUrl?.startsWith('/uploads') ? `${BASE_URL}${slide.imageUrl}` : slide.imageUrl}')` 
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black/50"></div>
                                </div>
                                
                                {/* Slide Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 text-white">
                                    {slide.title && (
                                        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight shadow-black">
                                            {slide.title}
                                        </h2>
                                    )}
                                    {slide.subtitle && (
                                        <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl drop-shadow-md">
                                            {slide.subtitle}
                                        </p>
                                    )}
                                    {slide.link && (
                                        <a 
                                            href={slide.link} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="px-8 py-3 rounded-full font-bold shadow-lg transition-all transform hover:-translate-y-1 text-white"
                                            style={{ background: `linear-gradient(to right, ${siteSettings?.primaryColor || '#9333ea'}, ${siteSettings?.secondaryColor || '#ec4899'})` }}
                                        >
                                            Learn More
                                        </a>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    }

    // Static Banner View
    return (
        <div className="rbt-banner-area rbt-banner-1 relative overflow-hidden bg-slate-900 min-h-[80vh] flex items-center justify-center pt-24 pb-16">
            
            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob" style={{ backgroundColor: siteSettings?.primaryColor || '#9333ea' }}></div>
                <div className="absolute top-40 -right-40 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000" style={{ backgroundColor: siteSettings?.secondaryColor || '#6366f1' }}></div>
                <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-[700px] h-[700px] rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-4000" style={{ backgroundColor: siteSettings?.primaryColor || '#ec4899' }}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* LEFT CONTENT */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                        {/* Interactive Badge */}
                        <div className="group relative inline-flex items-center justify-center p-0.5 mb-8 overflow-hidden font-medium text-white rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-primary/30" style={{ background: `linear-gradient(to br, ${siteSettings?.primaryColor || '#9333ea'}, ${siteSettings?.secondaryColor || '#ec4899'})` }}>
                            <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-slate-900 bg-opacity-90 rounded-full group-hover:bg-opacity-0 flex items-center gap-2 text-sm font-semibold tracking-wide">
                                <span className="transition-colors duration-300 animate-pulse" style={{ color: siteSettings?.secondaryColor || '#f472b6' }}>{bannerSettings?.badgeIcon || '✨'}</span>
                                {bannerSettings?.badgeText || 'Welcome to TNCDC'}
                            </span>
                        </div>

                        {/* Title with Modern Typography */}
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-2xl">
                            {bannerSettings?.title ? 
                                <span dangerouslySetInnerHTML={{ __html: bannerSettings.title }} /> 
                                : 
                                <>Empower Your <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${siteSettings?.primaryColor || '#f472b6'}, ${siteSettings?.secondaryColor || '#9333ea'})` }}>Future</span></>
                            }
                        </h1>

                        {/* Description */}
                        <div className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl font-light leading-relaxed">
                            {bannerSettings?.description ? 
                                <span dangerouslySetInnerHTML={{ __html: bannerSettings.description }} className="block" /> 
                                : 
                                <p>Join our comprehensive programs designed to build your skills and accelerate your career. Learn from experts and shape your destiny today.</p>
                            }
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link 
                                to="/courses" 
                                className="relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 rounded-xl shadow-lg hover:-translate-y-1 group overflow-hidden" 
                                style={{ 
                                    background: `linear-gradient(to right, ${siteSettings?.primaryColor || '#9333ea'}, ${siteSettings?.secondaryColor || '#ec4899'})`,
                                    boxShadow: `0 20px 40px -10px color-mix(in srgb, ${siteSettings?.primaryColor || '#9333ea'} 30%, transparent)`
                                }}
                            >
                                <span className="relative z-10 flex items-center">
                                    <span className="mr-3">Explore Courses</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </span>
                            </Link>
                            
                            <Link 
                                to="/aboutus" 
                                className="inline-flex items-center justify-center px-8 py-4 font-bold text-slate-300 transition-all duration-200 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 hover:-translate-y-1"
                            >
                                Discover More
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT IMAGE - Hero Graphic with Synced Frame Effect */}
                    <div className="w-full lg:w-1/2 relative group">
                        
                        {/* Main Floating Container - All elements move together for sync */}
                        <div className="relative z-10 animate-float-slow">
                            
                            {/* Interactive Background "System" Frame */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 transition-transform duration-1000 group-hover:scale-110">
                                {/* Soft Glow */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-[80px] animate-pulse"></div>
                                
                                {/* Geometric Rings */}
                                <div className="absolute inset-x-0 inset-y-0 border border-white/10 rounded-full scale-75 animate-spin-slow"></div>
                                <div className="absolute inset-x-0 inset-y-0 border border-dashed border-white/5 rounded-full scale-90 rotate-45"></div>
                                
                                {/* Floating Particles (Dots) */}
                                <div className="absolute top-10 left-10 w-2 h-2 bg-pink-500/40 rounded-full blur-[1px] animate-bounce"></div>
                                <div className="absolute bottom-20 right-10 w-3 h-3 bg-purple-500/40 rounded-full blur-[1px] animate-pulse"></div>
                            </div>

                            {/* Image Container with Perspective */}
                            <div className="relative z-10 transition-all duration-700 transform group-hover:scale-[1.03] group-hover:rotate-1">
                                <img
                                    src={bannerSettings?.imageUrl ? (bannerSettings.imageUrl.startsWith('/uploads') ? `${BASE_URL}${bannerSettings.imageUrl}` : bannerSettings.imageUrl) : "https://tncdc.in/website/assets/images/home_main_banner.png"}
                                    alt="Hero Background"
                                    className="w-full max-w-lg mx-auto object-contain drop-shadow-[0_15px_45px_rgba(0,0,0,0.5)] relative z-20"
                                />
                                
                                {/* Floating Information Cards - Integrated with the Main Image Container */}
                                <div className="absolute right-0 lg:-right-4 top-1/4 bg-white/5 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl hidden md:flex items-center gap-4 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 z-30 group/card">
                                    <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center shrink-0 border border-green-400/30 group-hover/card:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-white font-bold text-sm">Certified</p>
                                        <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Government Approved</p>
                                    </div>
                                </div>

                                <div className="absolute left-0 lg:-left-4 bottom-1/4 bg-white/5 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl hidden md:flex items-center gap-4 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 z-30 group/card">
                                    <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center shrink-0 border border-purple-400/30 group-hover/card:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-white font-bold text-sm">Skills Base</p>
                                        <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">100+ Live Courses</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            {/* Base Wave/Divider if needed */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
                <svg className="relative block w-full h-[60px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,155.45,124.64,226.78,92.83,263.85,76.32,291.6,62,321.39,56.44Z" className="fill-white"></path>
                </svg>
            </div>
            
        </div>
    );
};

export default Hero;
