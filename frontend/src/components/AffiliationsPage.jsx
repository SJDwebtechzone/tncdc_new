import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAffiliations } from '@/store/websiteSlice';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import { Award, ExternalLink } from 'lucide-react';

const AffiliationsPage = () => {
    const dispatch = useDispatch();
    const { affiliations } = useSelector((state) => state.website);

    useEffect(() => {
        dispatch(fetchAffiliations());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />
            <Marquee />

            <main className="pt-[180px] pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold uppercase tracking-wider mb-2">
                        <Award size={16} />
                        Global Standards
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                        Our <span className="text-emerald-600">Affiliations</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        We are proud to be associated with world-class organizations and educational bodies that ensure our training remains top-tier.
                    </p>
                </div>

                {/* Affiliations Grid */}
                {affiliations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {affiliations.map((aff) => (
                            <div 
                                key={aff.id} 
                                className="group bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 flex flex-col items-center text-center"
                            >
                                <div className="w-full aspect-video mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <img 
                                        src={aff.image} 
                                        alt={aff.title} 
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 transition-colors">
                                    {aff.title}
                                </h3>
                                {aff.subtitle && (
                                    <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-wide">
                                        {aff.subtitle}
                                    </p>
                                )}
                                <div className="mt-4 w-12 h-1 bg-emerald-100 group-hover:bg-emerald-500 rounded-full transition-all duration-500"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
                        <Award size={64} className="mx-auto text-slate-200 mb-6" />
                        <h2 className="text-2xl font-bold text-slate-400">No Affiliations Found</h2>
                        <p className="text-slate-400 font-medium">Check back soon as we expand our network.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AffiliationsPage;
