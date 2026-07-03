import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMissionVision } from '@/store/websiteSlice';
import { API_URL } from '@/config';

const DynamicIcon = ({ name, size = 20, className = "" }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
    return <IconComponent size={size} className={className} />;
};

const AboutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.website.missionVisionSettings);

    useEffect(() => {
        dispatch(fetchMissionVision());
    }, [dispatch]);

    // Helper to render HTML in titles (for <br />)
    const renderTitle = (title) => {
        return <span dangerouslySetInnerHTML={{ __html: title }} />;
    };

    if (!settings) return null;

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Navbar />
            <Marquee />

            <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center text-center">

                {/* Badge */}
                {settings.bannerBadgeText && (
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full text-sm font-bold mb-8 shadow-sm border border-emerald-100">
                        {settings.bannerBadgeIcon && <span>{settings.bannerBadgeIcon}</span>}
                        <span>{settings.bannerBadgeText}</span>
                    </div>
                )}

                {/* Heading */}
                <h1 className="text-5xl md:text-6xl font-extrabold text-[#0f172a] mb-6 tracking-tight">
                    Read About Our
                </h1>

                {/* Description */}
                <p className="text-gray-500 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
                    {settings.bannerDesc}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto justify-center">
                    <button onClick={() => navigate('/courses')} className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-8 py-3.5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 transition-all duration-300">
                        Our Courses <LucideIcons.ArrowRight size={20} />
                    </button>
                    <button onClick={() => navigate('/contactus')} className="bg-white text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                        Contact Us <LucideIcons.ArrowRight size={20} />
                    </button>
                </div>

                {/* Video/Image Section */}
                {settings.videoUrl && (
                    <div className="w-full max-w-6xl aspect-[16/9] bg-gray-200 rounded-[40px] flex items-center justify-center relative shadow-inner overflow-hidden group cursor-pointer"
                        onClick={() => window.open(settings.videoUrl, '_blank')}>
                        {settings.videoImage ? (
                            <img src={`${API_URL}${settings.videoImage}`} alt="Video Placeholder" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 bg-gray-300/50"></div>
                        )}

                        {/* Play Button */}
                        <div className="w-24 h-24 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                                <LucideIcons.Play size={32} className="text-[#10b981] ml-1 fill-current" />
                            </div>
                        </div>
                    </div>
                )}


                {/* Our Vision Section */}
                <div className="w-full mt-24 py-10">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">

                        {/* Left Column: Image Collage */}
                        <div className="w-full lg:w-1/2 relative min-h-[600px] hidden md:block">
                            {/* Image 1: Left Large */}
                            <div className="absolute left-0 top-10 w-[45%] h-[80%] rounded-2xl overflow-hidden shadow-2xl z-10">
                                <img
                                    src={settings.visionImage1 ? `${API_URL}${settings.visionImage1}` : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80"}
                                    alt="Vision Primary"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Image 2: Right Top Small */}
                            <div className="absolute right-0 top-0 w-[45%] h-[40%] rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src={settings.visionImage2 ? `${API_URL}${settings.visionImage2}` : "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80"}
                                    alt="Vision Secondary"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Image 3: Right Bottom Medium */}
                            <div className="absolute right-[5%] bottom-0 w-[48%] h-[55%] rounded-2xl overflow-hidden shadow-2xl z-20">
                                <img
                                    src={settings.visionImage3 ? `${API_URL}${settings.visionImage3}` : "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=400&q=80"}
                                    alt="Vision Tertiary"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="w-full lg:w-1/2 text-left flex flex-col justify-center">
                            <span className="inline-block bg-emerald-100 text-emerald-600 px-4 py-1 rounded-md text-xs font-bold tracking-wider mb-6 w-fit uppercase">
                                OUR VISION
                            </span>
                            <h2 className="text-4xl font-extrabold text-[#0f172a] mb-6 leading-tight">
                                {renderTitle(settings.visionTitle)}
                            </h2>
                            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                                {settings.visionDesc}
                            </p>

                            {/* Features List */}
                            <div className="space-y-8">
                                {[1, 2, 3].map(num => (
                                    settings[`visionFeature${num}Title`] && (
                                        <div key={num} className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-500">
                                                <DynamicIcon name={settings[`visionFeature${num}Icon`]} size={20} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">{settings[`visionFeature${num}Title`]}</h4>
                                                <p className="text-gray-500">{settings[`visionFeature${num}Desc`]}</p>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Our Mission Section */}
                <div className="w-full mt-24 py-10 bg-gray-50/50">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">

                            {/* Left Content (Text) */}
                            <div className="w-full lg:w-1/2 text-left flex flex-col justify-center order-2 lg:order-1">
                                <span className="inline-block bg-emerald-100 text-emerald-600 px-4 py-1 rounded-md text-xs font-bold tracking-wider mb-6 w-fit uppercase">
                                    OUR MISSION
                                </span>
                                <h2 className="text-4xl font-extrabold text-[#0f172a] mb-6 leading-tight">
                                    {renderTitle(settings.missionTitle)}
                                </h2>
                                <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                                    {settings.missionDesc}
                                </p>

                                {/* Features List */}
                                <div className="space-y-8">
                                    {[1, 2, 3].map(num => (
                                        settings[`missionFeature${num}Title`] && (
                                            <div key={num} className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-500">
                                                    <DynamicIcon name={settings[`missionFeature${num}Icon`]} size={20} className="text-teal-500" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{settings[`missionFeature${num}Title`]}</h4>
                                                    <p className="text-gray-500">{settings[`missionFeature${num}Desc`]}</p>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Right Column: Image Collage */}
                            <div className="w-full lg:w-1/2 relative min-h-[600px] hidden md:block order-1 lg:order-2">
                                {/* Image 1: Left Large - Moved to Right relative position */}
                                <div className="absolute right-0 top-10 w-[45%] h-[80%] rounded-2xl overflow-hidden shadow-2xl z-10">
                                    <img
                                        src={settings.missionImage1 ? `${API_URL}${settings.missionImage1}` : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80"}
                                        alt="Mission Primary"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Image 2: Right Top Small - Moved to Left relative position */}
                                <div className="absolute left-0 top-0 w-[45%] h-[40%] rounded-2xl overflow-hidden shadow-xl">
                                    <img
                                        src={settings.missionImage2 ? `${API_URL}${settings.missionImage2}` : "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80"}
                                        alt="Mission Secondary"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Image 3: Right Bottom Medium - Moved to Left relative position */}
                                <div className="absolute left-[5%] bottom-0 w-[48%] h-[55%] rounded-2xl overflow-hidden shadow-2xl z-20">
                                    <img
                                        src={settings.missionImage3 ? `${API_URL}${settings.missionImage3}` : "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=400&q=80"}
                                        alt="Mission Tertiary"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </main>

            {/* WhatsApp Floating Icon */}
            <div className="fixed bottom-8 left-8 z-50">
                <button className="bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                    onClick={() => window.open(`https://wa.me/${useSelector(state => state.website.contactSettings.whatsapp)}`, '_blank')}>
                    <LucideIcons.MessageCircle size={32} fill="white" className="text-white" />
                </button>
            </div>

            <Footer />
        </div >
    );
};

export default AboutPage;






