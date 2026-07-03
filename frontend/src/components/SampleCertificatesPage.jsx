import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSampleCertificates } from '@/store/websiteSlice';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import { Award, Search } from 'lucide-react';

const SampleCertificatesPage = () => {
    const dispatch = useDispatch();
    const { sampleCertificates } = useSelector((state) => state.website);

    useEffect(() => {
        dispatch(fetchSampleCertificates());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />
            <Marquee />

            <main className="pt-[180px] pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold uppercase tracking-wider mb-2">
                        <Award size={16} />
                        Our Recognition
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                        Awards & <span className="text-indigo-600">Recognitions</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        Explore our institute's official recognitions, awards, and affiliations that validate nuestro commitment to excellence.
                    </p>

                </div>

                {/* Certificates Grid */}
                {sampleCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {sampleCertificates.map((cert) => (
                            <div 
                                key={cert.id} 
                                className="group bg-white rounded-[32px] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.2)] transition-all duration-500 hover:-translate-y-2 border border-slate-100"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    <img 
                                        src={cert.image} 
                                        alt={cert.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <button 
                                            onClick={() => window.open(cert.image, '_blank')}
                                            className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                                        >
                                            <Search size={18} />
                                            View Full Screen
                                        </button>
                                    </div>
                                </div>
                                <div className="p-8 text-center">
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                        {cert.name}
                                    </h3>
                                    <div className="mt-4 flex justify-center gap-1">
                                        <div className="w-8 h-1 bg-indigo-500 rounded-full"></div>
                                        <div className="w-2 h-1 bg-indigo-300 rounded-full"></div>
                                        <div className="w-1 h-1 bg-indigo-200 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
                        <Award size={64} className="mx-auto text-slate-200 mb-6" />
                        <h2 className="text-2xl font-bold text-slate-400">No Awards or Recognitions Found</h2>
                        <p className="text-slate-400 font-medium">Please check back later for updates.</p>
                    </div>

                )}
            </main>

            <Footer />
        </div>
    );
};

export default SampleCertificatesPage;
