import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BASE_URL } from '@/config';
import { Mail, Phone, MapPin, ArrowRight, Facebook, Twitter, Instagram, Linkedin, ChevronRight } from 'lucide-react';

const Footer = () => {
    const profile = useSelector((state) => state.profile);
    const website = useSelector((state) => state.website);

    const profileLogoUrl = profile.logoUrl || (website.siteSettings && website.siteSettings.logo) || "https://mum-objectstore.e2enetworks.net/hdi-multi-tenant/tncdc.in/website/logo/image_6979ce5039f69.png";
    const profileLogo = profileLogoUrl && profileLogoUrl.startsWith('/uploads') ? `${BASE_URL}${profileLogoUrl}` : profileLogoUrl;

    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#050B14] max-w-[100vw] overflow-x-hidden border-t border-slate-800">
            {/* Background Gradients & Effects */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
            <div className="absolute -top-40 right-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-40 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 pt-20 pb-12 relative z-10 w-full max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-4 flex flex-col items-start">
                        <Link to="/" className="inline-block bg-white p-3 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-6 transition-transform hover:scale-105">
                            <img src={profileLogo} alt="Logo" className="h-12 object-contain" />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                            Empowering the next generation of digital creators and tech professionals through cutting-edge education, practical experience, and limitless innovation.
                        </p>
                        
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-500 hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 hover:border-pink-500 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-700 hover:border-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div className="lg:col-span-3 lg:ml-auto w-full">
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Study Materials", path: "/study_materials" },
                                { name: "Awards & Recognitions", path: "/sample_certificates" },


                                { name: "Our Affiliations", path: "/affiliations" },
                                { name: "Payment Details", path: "/payment_details" }
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <Link to={item.path} className="group flex items-center text-slate-400 hover:text-white transition-colors duration-300 text-sm">
                                        <ChevronRight size={14} className="text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-1" />
                                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Our Company */}
                    <div className="lg:col-span-2 w-full">
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            Company
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: "About Us", path: "/about" },
                                { name: "Contact Us", path: "/contactus" },
                                { name: "Latest Blog", path: "/posts" },
                                { name: "Careers & Jobs", path: "/jobs" }
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <Link to={item.path} className="group flex items-center text-slate-400 hover:text-white transition-colors duration-300 text-sm">
                                        <ChevronRight size={14} className="text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-1" />
                                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-3 w-full">
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Reach Us
                        </h3>
                        <div className="space-y-5 text-slate-300 text-sm">
                            <div className="flex items-start gap-4 group cursor-pointer w-full">
                                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex flex-shrink-0 items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-400 transition-all duration-300">
                                    <MapPin size={18} />
                                </div>
                                <p className="leading-relaxed mt-1 group-hover:text-white transition-colors">
                                    {(website.contactSettings?.address || website.contactSettings?.location)?.replace(/<br>/g, ' ') || profile.address || '5678 Innovation Drive, Tech City, 100100'}
                                </p>
                            </div>
                            
                            <div className="flex items-start gap-4 group cursor-pointer w-full">
                                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex flex-shrink-0 items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-400 transition-all duration-300">
                                    <Phone size={18} />
                                </div>
                                <div className="mt-1">
                                    <p className="group-hover:text-white transition-colors">{website.contactSettings?.phone1 || profile.mobile || '+91 98765 43210'}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Mon-Sat 9AM-6PM</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group cursor-pointer w-full">
                                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex flex-shrink-0 items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-400 transition-all duration-300">
                                    <Mail size={18} />
                                </div>
                                <p className="mt-2.5 group-hover:text-white transition-colors break-words overflow-hidden">
                                    {website.contactSettings?.email1 || profile.email || 'hello@devspectra.in'}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Newsletter / CTA Banner in Footer */}
                <div className="mt-16 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm w-full mx-auto">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h4 className="text-xl md:text-2xl font-bold text-white mb-2">Ready to start your journey?</h4>
                            <p className="text-slate-400 text-sm max-w-md">Join thousands of students and get access to premium courses, expert mentorship, and a thriving community.</p>
                        </div>
                        <Link to="/contactus" className="whitespace-nowrap bg-white text-indigo-950 px-8 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group flex-shrink-0">
                            Get Started Now
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Bar */}
            <div className="border-t border-slate-800/80 bg-[#030712] py-6 px-6 relative z-10 w-full">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl">
                    <p className="text-slate-500 text-[13px] text-center md:text-left">
                        © {currentYear} <a href="https://www.devspectra.in" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">DevSpectra</a>. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-[13px]">
                        <Link to="/privacy_policy" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms_conditions" className="text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/refund_policy" className="text-slate-500 hover:text-white transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
