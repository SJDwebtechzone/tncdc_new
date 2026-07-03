import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '@/config';

const FAQ = () => {
    const [activeIdx, setActiveIdx] = useState(-1);
    const storeFaqs = useSelector((state) => state.website.faqs || []);
    const faqSettings = useSelector((state) => state.website.faqSettings || {});
    const siteSettings = useSelector((state) => state.website.siteSettings);
    
    // Filter to only display active FAQs
    const activeFaqs = storeFaqs.filter(faq => faq.status);

    const faqs = activeFaqs;

    if (faqs.length === 0) return null;

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    {/* FAQ List */}
                    <div className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="mb-12">
                            <span 
                                className="px-4 py-1.5 font-bold text-xs uppercase tracking-widest rounded-full mb-4 inline-block text-white"
                                style={{ backgroundColor: siteSettings?.primaryColor || '#10b981' }}
                            >
                                FAQ
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4 leading-tight">
                                Got a question?<br /> We’re here to help
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className={`rounded-3xl border border-gray-100 overflow-hidden transition-all ${activeIdx === idx ? 'shadow-xl shadow-gray-200/50 ring-1 ring-primary/20' : ''}`}>
                                    <button
                                        onClick={() => setActiveIdx(activeIdx === idx ? -1 : idx)}
                                        className="w-full text-left px-8 py-6 flex items-center justify-between gap-4 group"
                                    >
                                        <span className={`text-lg font-bold transition-colors ${activeIdx === idx ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                                            {faq.question}
                                        </span>
                                        <ChevronDown size={20} className={`text-gray-400 transition-transform ${activeIdx === idx ? 'rotate-180 text-primary' : ''}`} />
                                    </button>

                                    <div className={`px-8 transition-all duration-300 ease-in-out ${activeIdx === idx ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <p className="text-gray-600 leading-relaxed pt-2 border-t border-gray-50 uppercase-first">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Banner Images */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <div className="relative">
                            <img
                                src={faqSettings?.banner1 ? (faqSettings.banner1.startsWith('/uploads') ? `${BASE_URL}${faqSettings.banner1}` : faqSettings.banner1) : "https://tncdc.in/website/assets/images/about/about-01.jpg"}
                                alt="Banner 1"
                                className="rounded-[40px] shadow-2xl w-4/5 ml-auto"
                            />
                            <div className="absolute -bottom-10 -left-10 w-1/2 hidden md:block">
                                <img
                                    src={faqSettings?.banner2 ? (faqSettings.banner2.startsWith('/uploads') ? `${BASE_URL}${faqSettings.banner2}` : faqSettings.banner2) : "https://tncdc.in/website/assets/images/about/about-10.jpg"}
                                    alt="Banner 2"
                                    className="rounded-[30px] shadow-2xl border-8 border-white"
                                />
                            </div>

                            {/* Decorative dots */}
                            <div className="absolute top-10 left-10 w-20 h-20 border-t-8 border-l-8 border-primary/20 -z-10"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;






