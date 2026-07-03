import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import { 
    CheckCircle, 
    Calendar, 
    ShieldCheck, 
    MapPin, 
    Mail, 
    Phone, 
    ArrowLeft, 
    Loader2, 
    User, 
    FileText, 
    Clock, 
    BookOpen, 
    Hash 
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/config';

const StudentVerificationResultPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [institute, setInstitute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchResult();
        fetchInstitute();
    }, [studentId]);

    const fetchResult = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/admissions/verify/${studentId}`);
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError('Student record not found or verification ID is invalid.');
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
            <Navbar />
            <Marquee />
            
            <main className="flex-grow">
                {/* Header Section - Matches Certificate Verification Premium Look */}
                <div className="bg-[#1e293b] py-16 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="flex justify-center mb-6">
                            <div className="bg-[#10b981] text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg shadow-green-900/20">
                                <ShieldCheck size={16} />
                                Officially Verified
                            </div>
                        </div>
                        <h1 className="text-white text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm uppercase">
                            Student Identity Verification
                        </h1>
                        <p className="text-blue-100/80 text-lg font-medium italic">
                            Institutional record found for the enrollment below
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-10 relative z-20 mb-20 max-w-5xl">
                    {/* Student Info Card */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-blue-500 font-black text-4xl relative overflow-hidden">
                            {result.enquiry?.profileImage ? (
                                <img 
                                    src={result.enquiry.profileImage.startsWith('http') ? result.enquiry.profileImage : `${BASE_URL}${result.enquiry.profileImage}`} 
                                    className="w-full h-full object-cover"
                                    alt="Student"
                                />
                            ) : (
                                <span className="bg-gradient-to-br from-blue-50 to-indigo-100 w-full h-full flex items-center justify-center">
                                    {result.firstName?.[0]}{result.surname?.[0]}
                                </span>
                            )}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-3xl md:text-5xl font-black text-[#1e293b] mb-4">
                                {result.firstName} {result.surname}
                            </h2>
                            
                            <div className="bg-[#f1f5f9] p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-12 w-fit mx-auto md:mx-0">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Enrollment Number</p>
                                    <p className="text-blue-600 font-black text-lg">{result.studentId}</p>
                                </div>
                                <div className="h-px md:h-10 w-full md:w-px bg-gray-200 self-center hidden md:block"></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Date Joined</p>
                                    <p className="text-gray-700 font-bold text-lg">
                                        {result.admissionDate ? new Date(result.admissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
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
                        <h3 className="text-2xl md:text-3xl font-black text-[#5b21b6] mb-8 uppercase tracking-tight">Academic Pursuit</h3>
                        <div className="max-w-2xl mx-auto">
                            <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                Enrolled in the professional development course for{' '}
                                <span className="text-blue-600 font-black underline decoration-blue-200 underline-offset-4">
                                    {result.courseName?.toUpperCase()}
                                </span>{' '}
                                under the {result.courseType?.toUpperCase()} program category.
                            </p>
                        </div>
                    </div>

                    {/* Metrics 3-Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center md:items-start text-center md:text-left">
                            <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Clock size={12}/> Batch / Session</p>
                            <p className="text-2xl font-black text-[#1e293b] uppercase">{result.batch || 'GENERAL'}</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center md:items-start text-center md:text-left">
                            <p className="text-[11px] font-black text-purple-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Award size={12}/> Best Performance</p>
                            <p className="text-2xl font-black text-[#1e293b]">
                                {result.latestExamResult ? `${result.latestExamResult.percentage}% (${result.latestExamResult.grade})` : 'Awaiting Exams'}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center md:items-start text-center md:text-left">
                            <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><CheckCircle size={12}/> Admission Status</p>
                            <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black uppercase">
                                {result.status || 'Active'}
                            </div>
                        </div>
                    </div>

                    {/* Additional Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Personal Info */}
                        <div className="bg-[#f8fafc] p-8 rounded-[2rem] border border-slate-100">
                           <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                               <User size={16} className="text-blue-500" /> Member Information
                           </h4>
                           <div className="space-y-6">
                               <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Guardian / Parent</p>
                                   <p className="text-gray-800 font-bold">{result.enquiry?.parentName || 'N/A'}</p>
                               </div>
                               <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Date of Birth</p>
                                   <p className="text-gray-800 font-bold">
                                       {result.enquiry?.dob ? new Date(result.enquiry.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                   </p>
                               </div>
                               <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Contact Email</p>
                                   <p className="text-gray-800 font-bold">{result.email || 'N/A'}</p>
                               </div>
                           </div>
                        </div>

                        {/* Location / Status */}
                        <div className="bg-[#f8fafc] p-8 rounded-[2rem] border border-slate-100">
                           <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                               <MapPin size={16} className="text-indigo-500" /> Contact Details
                           </h4>
                           <div className="space-y-6">
                               <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Mobile Number</p>
                                   <p className="text-gray-800 font-bold">{result.mobile}</p>
                               </div>
                               <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Residential Address</p>
                                   <p className="text-gray-800 font-bold leading-relaxed">
                                       {result.enquiry?.address ? (
                                           <>
                                               {result.enquiry.address}, {result.enquiry.city}<br />
                                               {result.enquiry.state} - {result.enquiry.pincode}
                                           </>
                                       ) : 'Not disclosed'}
                                   </p>
                               </div>
                           </div>
                        </div>
                    </div>

                    {/* Authorized Center Footer Box */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 p-4 rounded-2xl text-blue-400">
                                <CheckCircle size={32} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Verified By</p>
                                <p className="text-white font-black text-base uppercase tracking-tight">
                                    {institute?.instituteName || "Tamil Nadu career development council"}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                                <Mail size={16} className="text-blue-500/50" /> {institute?.email || 'tncdc@gmail.com'}
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                                <Phone size={16} className="text-blue-500/50" /> {institute?.mobile || '9500396045'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-3 rounded-xl font-bold transition-all inline-flex items-center gap-2"
                        >
                            Return to Website <ArrowLeft size={18} />
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default StudentVerificationResultPage;
