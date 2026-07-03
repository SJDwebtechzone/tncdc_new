import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContactSettings } from '@/store/websiteSlice';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const ContactUsPage = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.website.contactSettings);
    const siteSettings = useSelector((state) => state.website.siteSettings);

    useEffect(() => {
        dispatch(fetchContactSettings());
        window.scrollTo(0, 0);
    }, [dispatch]);

    const renderWithLineBreaks = (text) => {
        if (!text) return null;
        return text.split('<br>').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                {index !== text.split('<br>').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <div className="min-h-screen bg-[#FDF9FF]">
            <Navbar />
            <Marquee />

            <main className="pt-0 pb-24">
                {/* Header Section */}
                <div className="py-24 text-center px-6">
                    <span 
                        className="inline-block px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border shadow-sm"
                        style={{ 
                            backgroundColor: `color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 10%, transparent)`, 
                            color: siteSettings?.primaryColor || '#10b981',
                            borderColor: `color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 20%, transparent)`
                        }}
                    >
                        Contact Us
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A243E] max-w-4xl mx-auto leading-tight mb-8">
                        {renderWithLineBreaks(settings.title)}
                    </h1>
                </div>

                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {/* Phone Card */}
                        <div className="bg-white p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 hover:shadow-2xl transition-all duration-500 group">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-10 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                                <Phone size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-[#1A243E] mb-6">Contact Phone Number</h3>
                            <div className="space-y-2 text-slate-500 font-medium">
                                <p className="hover:text-orange-500 transition-colors cursor-pointer">{settings.phone1}</p>
                                {settings.phone2 && <p className="hover:text-orange-500 transition-colors cursor-pointer">{settings.phone2}</p>}
                                {settings.whatsapp && (
                                    <div className="flex items-center gap-2 text-emerald-500 font-bold pt-2">
                                        <MessageCircle size={18} />
                                        <span>WhatsApp: {settings.whatsapp}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 hover:shadow-2xl transition-all duration-500 group">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-10 group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
                                <Mail size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-[#1A243E] mb-6">Our Email Address</h3>
                            <div className="space-y-2 text-slate-500 font-medium overflow-hidden">
                                <p className="hover:text-red-500 transition-colors cursor-pointer break-all">{settings.email1}</p>
                                {settings.email2 && <p className="hover:text-red-500 transition-colors cursor-pointer break-all">{settings.email2}</p>}
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-white p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 hover:shadow-2xl transition-all duration-500 group">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-10 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                                <MapPin size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-[#1A243E] mb-6">Our Location</h3>
                            <div className="text-slate-500 font-medium leading-relaxed">
                                {renderWithLineBreaks(settings.address)}
                            </div>
                        </div>
                    </div>

                    {/* Map and Form Split Section */}
                    <div className="flex flex-col lg:flex-row gap-8 mb-20">
                        {/* Map Column */}
                        <div className="w-full lg:w-7/12 h-[500px] lg:h-[600px] rounded-[40px] overflow-hidden border-8 border-white shadow-2xl relative group">
                            {settings.mapIframe ? (
                                <div 
                                    className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full border-none transition-transform duration-700 group-hover:scale-105"
                                    dangerouslySetInnerHTML={{ __html: settings.mapIframe }}
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-medium">
                                    Map not configured
                                </div>
                            )}
                        </div>

                        {/* Contact Form Column */}
                        <div className="w-full lg:w-5/12 bg-white rounded-[40px] shadow-2xl shadow-blue-100/30 p-8 md:p-12 border border-slate-50 flex flex-col justify-center">
                            <div className="mb-8">
                                <h2 className="text-3xl font-extrabold text-[#1A243E] mb-3">Send us a Message</h2>
                                <p className="text-slate-500 font-medium text-sm">Have questions? We're here to help you anytime.</p>
                            </div>

                            <form className="space-y-5" onSubmit={(e) => {
                                e.preventDefault();
                                // Basic alert for now, can be expanded to full logic
                                alert('Thank you for your message! Our team will get back to you soon.');
                            }}>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your name"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 transition-all font-medium"
                                        style={{ '--tw-ring-color': `color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 20%, transparent)`, borderFocusColor: siteSettings?.primaryColor }}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="name@example.com"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 transition-all font-medium"
                                        style={{ '--tw-ring-color': `color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 20%, transparent)`, borderFocusColor: siteSettings?.primaryColor }}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-2">Message</label>
                                    <textarea 
                                        placeholder="How can we help you?"
                                        rows="4"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 transition-all font-medium resize-none"
                                        style={{ '--tw-ring-color': `color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 20%, transparent)`, borderFocusColor: siteSettings?.primaryColor }}
                                        required
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform active:scale-95 text-sm uppercase tracking-wider mt-4"
                                    style={{ background: `linear-gradient(to right, ${siteSettings?.primaryColor || '#10b981'}, ${siteSettings?.secondaryColor || '#059669'})`, boxShadow: `0 20px 40px -10px color-mix(in srgb, ${siteSettings?.primaryColor || '#10b981'} 30%, transparent)` }}
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactUsPage;
