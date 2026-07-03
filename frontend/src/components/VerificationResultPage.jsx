import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import { CheckCircle, Clock, Calendar, Award, ShieldCheck, MapPin, Mail, Phone, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/config';

const VerificationResultPage = () => {
    const { certNo } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [institute, setInstitute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchResult();
        fetchInstitute();
    }, [certNo]);

    const fetchResult = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/certificates/verify/${certNo}`);
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError('Invalid Certificate Number or certificate not yet approved.');
        } finally {
            setLoading(false);
        }
    };

    const fetchInstitute = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/institute-profile`);
            setInstitute(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-4">
                    <div className="bg-red-50 p-8 rounded-[2rem] text-center max-w-lg border border-red-100">
                        <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-red-200">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4">Verification Failed</h2>
                        <p className="text-gray-500 font-medium mb-8">{error}</p>
                        <button 
                            onClick={() => navigate('/verify-certificate')}
                            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-gray-800 transition-all"
                        >
                            <ArrowLeft size={18} /> Go Back
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col overflow-x-hidden">
            <main className="flex-grow">
                {/* Header Section */}
                <div className="bg-[#1e293b] py-16 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="flex justify-center mb-6">
                            <div className="bg-[#10b981] text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg shadow-green-900/20">
                                <CheckCircle size={16} />
                                Verified
                            </div>
                        </div>
                        <h1 className="text-white text-4xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-sm">
                            Certificate Verification
                        </h1>
                        <p className="text-blue-100/80 text-lg font-medium italic">
                            This certificate is proudly presented to
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-10 relative z-20 mb-20 max-w-5xl">
                    {/* Student Info Card */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-blue-500 font-black text-4xl relative overflow-hidden">
                            {result.admission?.enquiry?.profileImage ? (
                                <img 
                                    src={result.admission.enquiry.profileImage.startsWith('http') ? result.admission.enquiry.profileImage : `${BASE_URL}${result.admission.enquiry.profileImage}`} 
                                    className="w-full h-full object-cover"
                                    alt="Student"
                                />
                            ) : (
                                <span className="bg-gradient-to-br from-blue-50 to-indigo-100 w-full h-full flex items-center justify-center">
                                    {result.admission?.firstName?.[0]}{result.admission?.surname?.[0]}
                                </span>
                            )}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-3xl md:text-5xl font-black text-[#1e293b] mb-4">
                                {result.admission?.firstName} {result.admission?.surname}
                            </h2>
                            
                            <div className="bg-[#f1f5f9] p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-12 w-fit">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Certificate Number</p>
                                    <p className="text-blue-600 font-black text-lg">{result.certificateNo}</p>
                                </div>
                                <div className="h-px md:h-10 w-full md:w-px bg-gray-200 self-center hidden md:block"></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Date Issued</p>
                                    <p className="text-gray-700 font-bold text-lg">
                                        {result.issuedDate ? new Date(result.issuedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center justify-center mb-12">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mx-4 shadow-lg shadow-blue-200"></div>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    {/* Course Info */}
                    <div className="text-center mb-16 px-4">
                        <h3 className="text-2xl md:text-3xl font-black text-[#5b21b6] mb-8 uppercase tracking-tight">Course Information</h3>
                        <div className="max-w-2xl mx-auto">
                            <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                For successfully completing the comprehensive course in{' '}
                                <span className="text-blue-600 font-black underline decoration-blue-200 underline-offset-4">
                                    {result.admission?.courseName?.toUpperCase()}
                                </span>{' '}
                                and demonstrating exceptional skill and dedication throughout the program.
                            </p>
                        </div>
                    </div>

                    {/* Metrics 3-Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center md:items-start">
                            <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3">Duration</p>
                            <p className="text-2xl font-black text-[#1e293b]">{result.admission?.courseDuration || 'N/A'}</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center md:items-start">
                            <p className="text-[11px] font-black text-purple-500 uppercase tracking-[0.2em] mb-3">Period</p>
                            <p className="text-lg font-black text-[#1e293b]">{result.admission?.batch || 'N/A'}</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center md:items-start">
                            <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.2em] mb-3">Performance</p>
                            <p className="text-2xl font-black text-[#10b981]">{result.examResult?.percentage || 0}%</p>
                        </div>
                    </div>

                    {/* Performance & Status Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-green-50/30 p-8 rounded-[2rem] border border-green-100 flex flex-col items-center justify-center text-center">
                            <p className="text-[11px] font-black text-green-600 uppercase tracking-[0.3em] mb-6">Grade Achieved</p>
                            <div className="w-20 h-20 rounded-full bg-[#10b981] text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-green-200">
                                {result.examResult?.grade || 'N/A'}
                            </div>
                        </div>
                        <div className="bg-blue-50/30 p-8 rounded-[2rem] border border-blue-100 flex flex-col items-center justify-center text-center">
                            <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-6">Certificate Status</p>
                            <div className="bg-blue-600 text-white px-8 py-3 rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-blue-200 tracking-wide">
                                <CheckCircle size={20} /> VALID
                            </div>
                        </div>
                    </div>

                    {/* Authorized Center Footer Box */}
                    <div className="bg-gray-50/50 p-8 md:p-10 rounded-[2.5rem] border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-indigo-500 p-2 rounded-lg text-white">
                                <MapPin size={18} />
                            </div>
                            <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">Authorized Center</h4>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between gap-8 md:items-center">
                            <div>
                                <p className="text-xl font-black text-gray-900 mb-1">{institute?.instituteName || "Tamil Nadu career development council"}</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                                    <Mail size={16} className="text-blue-500" />
                                    {institute?.email || 'tncdc@gmail.com'}
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                                    <Phone size={16} className="text-blue-500" />
                                    {institute?.mobile || '9500396045'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button 
                            onClick={() => navigate('/student_verification')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-3 rounded-xl font-bold transition-all inline-flex items-center gap-2"
                        >
                            Verify Another Certificate <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VerificationResultPage;
