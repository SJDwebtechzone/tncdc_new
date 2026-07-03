import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMissionVision } from '@/store/websiteSlice';
import { API_URL } from '@/config';

const About = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.profile.profile);
    const settings = useSelector((state) => state.website.missionVisionSettings);
    const siteSettings = useSelector((state) => state.website.siteSettings);

    useEffect(() => {
        dispatch(fetchMissionVision());
    }, [dispatch]);

    if (!profile) return null;

    // Helper to render HTML in titles (for <br />)
    const renderTitle = (title) => {
        return <span dangerouslySetInnerHTML={{ __html: title }} />;
    };

    return (
        <div className="rbt-about-area bg-white rbt-section-gapTop pb_md--80 pb_sm--80 about-style-1 pt-[100px] py-16 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="row flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    <div className="col-lg-6 w-full lg:w-1/2 relative group">
                        {/* Main Floating Container for Sync */}
                        <div className="thumbnail-wrapper relative w-full h-[500px] md:h-[600px] animate-float-slow">
                            
                            {/* Decorative background "Frame" */}
                            <div className="absolute top-[10%] left-[5%] w-[85%] h-[85%] rounded-[40px] -z-10 border transition-all duration-700 group-hover:scale-110" style={{ backgroundColor: `color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 10%, transparent)`, borderColor: `color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 20%, transparent)` }}></div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl -z-10 animate-pulse" style={{ backgroundColor: `color-mix(in srgb, ${siteSettings?.secondaryColor || '#059669'} 15%, transparent)` }}></div>

                            {/* Image 1: Main Large */}
                            <div className="thumbnail image-1 absolute left-0 top-[10%] w-[58%] h-[78%] z-20">
                                <img
                                    src={settings?.visionImage1 ? `${API_URL}${settings.visionImage1}` : "https://tncdc.in/website/assets/images/about/about-01.png"}
                                    alt="About main"
                                    className="w-full h-full object-cover rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-8 border-white transition-all duration-500 hover:scale-[1.02] hover:z-40"
                                />
                            </div>

                            {/* Image 2: Top Right Small */}
                            <div className="thumbnail image-2 absolute right-0 top-0 w-[45%] h-[48%] z-10">
                                <img
                                    src={settings?.visionImage2 ? `${API_URL}${settings.visionImage2}` : "https://tncdc.in/website/assets/images/about/about-02.png"}
                                    alt="About secondary"
                                    className="w-full h-full object-cover rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white transition-all duration-500 hover:scale-[1.05] hover:z-40"
                                />
                            </div>

                            {/* Image 3: Bottom Center/Right */}
                            <div className="thumbnail image-3 absolute left-[30%] bottom-0 w-[55%] h-[55%] z-30">
                                <img
                                    src={settings?.visionImage3 ? `${API_URL}${settings.visionImage3}` : "https://tncdc.in/website/assets/images/about/about-03.png"}
                                    alt="About tertiary"
                                    className="w-full h-full object-cover rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] border-8 border-white transition-all duration-500 hover:scale-[1.05] hover:rotate-2"
                                />
                                
                                {/* Experience Badge overlapping the bottom image */}
                                <div className="absolute -right-6 -bottom-6 bg-[#0f172a] text-white p-6 rounded-2xl shadow-2xl hidden md:flex flex-col items-center justify-center animate-pulse">
                                    <span className="text-3xl font-extrabold" style={{ color: siteSettings?.primaryColor || '#10b981' }}>10+</span>
                                    <span className="text-[10px] uppercase font-bold tracking-tighter text-gray-400">Years Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 w-full lg:w-1/2">
                        <div className="inner">
                            <div className="section-title text-start">
                                <span className="subtitle px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-6 inline-block border shadow-sm" style={{ backgroundColor: `color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 10%, transparent)`, color: siteSettings?.primaryColor || '#10b981', borderColor: `color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 20%, transparent)` }}>
                                    Know About Us
                                </span>
                                <h2 className="title text-4xl md:text-5xl font-extrabold text-[#0f172a] leading-tight mb-8">
                                    {settings?.visionTitle ? renderTitle(settings.visionTitle) : `Know About ${profile.instituteName || 'Our Platform'}`}
                                </h2>
                            </div>

                            <p className="description text-lg text-gray-500 leading-relaxed mb-10">
                                {settings?.visionDesc || (profile.address ? `Located in ${profile.city || profile.state}, we are dedicated to providing the best education and career development opportunities.` : '')}
                            </p>

                            <div className="rbt-feature-wrapper space-y-6">
                                {[1, 2].map(num => (
                                    <div key={num} className="rbt-feature feature-style-2 flex items-center gap-6 p-6 rounded-2xl bg-gray-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                                        <div className="w-16 h-16 flex-shrink-0 rounded-2xl flex items-center justify-center text-3xl shadow-sm" style={{ backgroundColor: `color-mix(in srgb, ${num === 1 ? (siteSettings?.primaryColor || '#10b981') : (siteSettings?.secondaryColor || '#6366f1')} 10%, transparent)`, color: num === 1 ? (siteSettings?.primaryColor || '#10b981') : (siteSettings?.secondaryColor || '#6366f1') }}>
                                            <span>{num === 1 ? '❤' : '📚'}</span>
                                        </div>
                                        <div className="feature-content">
                                            <h6 className="feature-title font-extrabold text-[#0f172a] text-xl mb-1">
                                                {settings?.[`visionFeature${num}Title`] || (num === 1 ? "Flexible Classes" : "Learn From Anywhere")}
                                            </h6>
                                            <p className="feature-description text-gray-500 text-sm">
                                                {settings?.[`visionFeature${num}Desc`] || (num === 1 ? "Customized learning schedules that fit your lifestyle perfectly." : "Access our world-class resources from the comfort of your home.")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="about-btn mt-12">
                                <a className="relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200 rounded-full hover:shadow-lg hover:-translate-y-1 active:scale-95 group" 
                                   style={{ background: `linear-gradient(to right, ${siteSettings?.primaryColor || '#10b981'}, ${siteSettings?.secondaryColor || '#059669'})` }}
                                   href="/aboutus">
                                    <span className="flex items-center gap-2">
                                        More About Us
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default About;






