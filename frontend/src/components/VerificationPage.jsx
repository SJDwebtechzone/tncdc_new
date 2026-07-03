import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import { Search, Loader2, AlertCircle, Headphones, Edit3, Database, Star, ShieldCheck, Zap, CheckCircle, Award, User } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/config';

const VerificationPage = () => {
    const navigate = useNavigate();
    const [certNumber, setCertNumber] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [activeTab, setActiveTab] = useState('certificate'); // 'certificate' or 'student'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');
        const id = params.get('id');

        if (type === 'student' || type === 'certificate') {
            setActiveTab(type);
            if (id) {
                if (type === 'student') setIdNumber(id);
                else setCertNumber(id);
                
                // Auto verify if both type and id are provided
                setTimeout(() => {
                    handleAutoVerify(type, id);
                }, 500);
            }
        }
    }, []);

    const handleAutoVerify = async (type, val) => {
        setLoading(true);
        setError('');
        try {
            const apiPath = type === 'certificate' ? `certificates/verify/${val}` : `admissions/verify/${val}`;
            const res = await axios.get(`${BASE_URL}/api/${apiPath}`);
            if (res.data) {
                navigate(type === 'certificate' ? `/verify-certificate/${val}` : `/verify-student/${val}`);
            }
        } catch (err) {
            setError(`Automated verification failed for ${type === 'certificate' ? 'Certificate' : 'Student'} ID.`);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        const queryValue = activeTab === 'certificate' ? certNumber.trim() : idNumber.trim();
        if (!queryValue) {
            setError(`Please enter a ${activeTab === 'certificate' ? 'certificate' : 'student ID'} number`);
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (activeTab === 'certificate') {
                const res = await axios.get(`${BASE_URL}/api/certificates/verify/${queryValue}`);
                if (res.data) {
                    navigate(`/verify-certificate/${queryValue}`);
                }
            } else {
                const res = await axios.get(`${BASE_URL}/api/admissions/verify/${queryValue}`);
                if (res.data) {
                    navigate(`/verify-student/${queryValue}`);
                }
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                setError(`Invalid ${activeTab === 'certificate' ? 'Certificate' : 'Student ID'} Number. Please check and try again.`);
            } else {
                setError('Internal server error. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col overflow-x-hidden">
            <Navbar />
            <Marquee />

            <main className="flex-grow">
                {/* Hero / Header Section */}
                <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1541829070764-84a7d30dee60?auto=format&fit=crop&w=1600&q=80"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-black mb-4 drop-shadow-lg tracking-tight uppercase">
                            Institutional Verification
                        </h1>
                        <p className="text-white/90 text-sm md:text-lg max-w-xl mb-8 font-bold italic tracking-wide">
                            Authenticate student credentials and identities through our official secure database
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-2 flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">
                                <ShieldCheck size={14} />
                                <span>Encrypted</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-2 flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">
                                <Zap size={14} />
                                <span>Real-time</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-16 relative z-20 mb-20 max-w-4xl">
                    {/* Verification Hub */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95">
                        {/* Tab Switcher */}
                        <div className="flex border-b border-gray-100">
                            <button 
                                onClick={() => { setActiveTab('certificate'); setError(''); }}
                                className={`flex-1 py-6 font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${activeTab === 'certificate' ? 'bg-white text-blue-600 border-b-4 border-blue-600' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                            >
                                <Award size={18} /> Verify Certificate
                            </button>
                            <button 
                                onClick={() => { setActiveTab('student'); setError(''); }}
                                className={`flex-1 py-6 font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${activeTab === 'student' ? 'bg-white text-indigo-600 border-b-4 border-indigo-600' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                            >
                                <User size={18} /> Verify Student ID
                            </button>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="flex items-start gap-6 mb-10">
                                <div className={`p-4 rounded-2xl shadow-lg ${activeTab === 'certificate' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-200' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-200'}`}>
                                    <Search className="text-white" size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-[#1e293b] mb-1 tracking-tight uppercase">
                                        {activeTab === 'certificate' ? 'Certificate Authentication' : 'Student Identity Check'}
                                    </h2>
                                    <p className="text-gray-400 font-bold text-sm tracking-tight">
                                        {activeTab === 'certificate' ? 'Enter the unique certificate number printed on your document' : 'Enter the student enrollment or admission ID number'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={activeTab === 'certificate' ? certNumber : idNumber}
                                        onChange={(e) => activeTab === 'certificate' ? setCertNumber(e.target.value) : setIdNumber(e.target.value)}
                                        placeholder={activeTab === 'certificate' ? 'e.g. TNCDC-Cert-1234' : 'e.g. STU-2026-001'}
                                        className={`w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl px-8 font-black text-[#1e293b] placeholder:text-gray-300 focus:outline-none transition-all text-xl ${activeTab === 'certificate' ? 'focus:border-blue-400' : 'focus:border-indigo-400'}`}
                                    />
                                    <div className={`absolute right-8 top-1/2 -translate-y-1/2 text-gray-200 transition-colors ${activeTab === 'certificate' ? 'group-focus-within:text-blue-500' : 'group-focus-within:text-indigo-500'}`}>
                                        {activeTab === 'certificate' ? <ShieldCheck size={28} /> : <CheckCircle size={28} />}
                                    </div>
                                </div>

                                <button
                                    onClick={handleVerify}
                                    disabled={loading}
                                    className={`w-full h-16 text-white font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 ${activeTab === 'certificate' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={20} />}
                                    {loading ? 'Authenticating...' : activeTab === 'certificate' ? 'Verify Certificate Now' : 'Verify Student Identity'}
                                </button>

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-5 rounded-2xl border border-red-100 flex items-center gap-4 animate-in slide-in-from-top-4">
                                        <AlertCircle size={24} />
                                        <p className="font-bold">{error}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* How It Works Section Re-added */}
                    <div className="py-20 bg-white">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-[#1e293b] mb-4 uppercase tracking-tighter">
                                How Our Verification Works
                            </h2>
                            <p className="text-gray-400 font-bold max-w-2xl mx-auto italic">
                                A simple three-step process to ensure your credentials are authentic and verified
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="bg-indigo-50 p-6 rounded-3xl mb-6 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 transform group-hover:rotate-12 shadow-sm">
                                    <Edit3 size={32} />
                                </div>
                                <h3 className="text-xl font-black text-[#1e293b] mb-4">Enter Details</h3>
                                <p className="text-gray-500 font-bold leading-relaxed text-sm">
                                    Enter your unique certificate number into the secure verification portal above.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="bg-purple-50 p-6 rounded-3xl mb-6 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500 transform group-hover:-rotate-12 shadow-sm">
                                    <Database size={32} />
                                </div>
                                <h3 className="text-xl font-black text-[#1e293b] mb-4">Secure Sync</h3>
                                <p className="text-gray-500 font-bold leading-relaxed text-sm">
                                    Our system cross-references with our official encrypted student database instantly.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="bg-blue-50 p-6 rounded-3xl mb-6 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 transform group-hover:rotate-12 shadow-sm">
                                    <Star size={32} />
                                </div>
                                <h3 className="text-xl font-black text-[#1e293b] mb-4">Get Result</h3>
                                <p className="text-gray-500 font-bold leading-relaxed text-sm">
                                    Receive a detailed performance report confirming the authenticity of the degree.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Support Bar */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-200">
                        <div className="flex items-center gap-6">
                            <div className="bg-white/10 p-4 rounded-2xl text-blue-400">
                                <Headphones size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Need assistance?</h3>
                                <p className="text-slate-400 font-bold text-sm">Our 24/7 technical support team is ready to help</p>
                            </div>
                        </div>
                        <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-lg">
                            Contact Support
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VerificationPage;
