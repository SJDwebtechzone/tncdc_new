import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight, CheckCircle2, X, Send, User, Mail, Phone, MessageSquareQuote } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs } from '@/store/websiteSlice';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import { BASE_URL } from '@/config';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const JobsPage = () => {
    const dispatch = useDispatch();
    const { jobs } = useSelector((state) => state.website);
    const profile = useSelector((state) => state.profile);
    const website = useSelector((state) => state.website);

    const profileLogoUrl = profile.logoUrl || (website?.siteSettings && website?.siteSettings?.logo) || "";
    const profileLogo = profileLogoUrl && profileLogoUrl.startsWith('/uploads') ? `${BASE_URL}${profileLogoUrl}` : profileLogoUrl;

    const [selectedJob, setSelectedJob] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        experience: '',
        skills: '',
        coverLetter: ''
    });

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    // Disable scrolling when modal is open
    useEffect(() => {
        if (selectedJob) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedJob]);

    const activeJobs = jobs.filter(job => job.status === true);

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setFormData({
            fullName: '',
            email: '',
            mobile: '',
            experience: '',
            skills: '',
            coverLetter: ''
        });
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        
        if (!formData.fullName || !formData.email || !formData.mobile) {
            return toast.error("Please fill all required fields");
        }

        setIsSubmitting(true);
        try {
            await axios.post(`${BASE_URL}/api/job-applications`, {
                jobId: selectedJob.id,
                ...formData
            });
            toast.success("Application submitted successfully!");
            setSelectedJob(null);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to submit application");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />
            <Marquee />

            <main className="pt-[180px] pb-24 relative z-0">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    
                    {/* Header Section */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">
                            <Briefcase size={16} />
                            Careers & Jobs
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Join Our <span className="text-blue-600">Growing Team</span>
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                            Discover career opportunities, make an impact, and grow with us. We are always looking for passionate individuals.
                        </p>
                    </div>

                    {/* Jobs List */}
                    <div className="space-y-8">
                        {activeJobs.length > 0 ? (
                            activeJobs.map((job) => (
                                <article 
                                    key={job.id} 
                                    className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-blue-200 transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-8">
                                        <div className="space-y-4 text-left">
                                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{job.title}</h2>
                                            <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                                                <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                                                    <Clock size={14} /> {job.jobType}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-slate-500">
                                                    <MapPin size={16} className="text-slate-400" /> {job.location}
                                                </span>
                                                {job.salaryRange && (
                                                    <span className="flex items-center gap-1.5 text-slate-500">
                                                        <DollarSign size={16} className="text-slate-400" /> {job.salaryRange}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleApplyClick(job)}
                                            className="flex-shrink-0 bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-colors shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 group"
                                        >
                                            Apply Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    <span className="w-6 h-1 bg-blue-600 rounded-full"></span> Role Overview
                                                </h3>
                                                <div 
                                                    className="text-slate-600 leading-relaxed job-description"
                                                    dangerouslySetInnerHTML={{ __html: job.description }}
                                                />
                                            </div>

                                            {job.responsibilities && job.responsibilities.length > 0 && (
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                        <span className="w-6 h-1 bg-blue-600 rounded-full"></span> Key Responsibilities
                                                    </h3>
                                                    <ul className="space-y-3">
                                                        {job.responsibilities.map((resp, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-slate-600">
                                                                <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                                                <span className="leading-relaxed">{resp}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {job.requirements && job.requirements.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    <span className="w-6 h-1 bg-blue-600 rounded-full"></span> Requirements
                                                </h3>
                                                <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100">
                                                    <ul className="space-y-4">
                                                        {job.requirements.map((req, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                                                <span className="leading-relaxed">{req}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
                                <Briefcase size={64} className="mx-auto text-slate-200 mb-6" />
                                <h2 className="text-2xl font-bold text-slate-400">No open positions right now</h2>
                                <p className="text-slate-400 font-medium">Please check back later for new career opportunities.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Application Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 md:p-8 overflow-y-auto w-full text-left">
                    <div 
                        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex flex-col items-center p-6 border-b border-gray-100 relative shrink-0">
                            <button 
                                onClick={handleCloseModal}
                                className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Apply for Position</h2>
                            <p className="text-gray-500 mt-1">{selectedJob.title}</p>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-6 md:p-8 flex-1">
                            
                            {/* Job Brief Header */}
                            <div className="flex items-start gap-4 mb-8">
                                {profileLogo ? (
                                    <img src={profileLogo} alt="Logo" className="w-14 h-14 object-contain" />
                                ) : (
                                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                        T
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{selectedJob.title}</h3>
                                    <p className="text-blue-600 font-medium">{profile?.instituteName || "TNCDC"}</p>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                        {selectedJob.salaryRange && <span className="text-blue-600 font-bold">{selectedJob.salaryRange}</span>}
                                        <span className="flex items-center gap-1.5"><Clock size={14}/> {new Date(selectedJob.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description Brief */}
                            <div className="mb-8">
                                <h4 className="font-bold text-gray-900 mb-2">Job Description:</h4>
                                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-600 max-h-40 overflow-y-auto" dangerouslySetInnerHTML={{ __html: selectedJob.description }} />
                            </div>

                            {/* Application Form */}
                            <form id="jobApplicationForm" onSubmit={handleSubmitApplication} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                            <User size={14}/> Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            required
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            className="h-11 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                            <Mail size={14}/> Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="h-11 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                            <Phone size={14}/> Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            required
                                            type="tel"
                                            value={formData.mobile}
                                            onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                            className="h-11 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your mobile number"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                            <Briefcase size={14}/> Years of Experience
                                        </label>
                                        <select
                                            value={formData.experience}
                                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                            className="w-full h-11 px-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                        >
                                            <option value="">Select Experience</option>
                                            <option value="Fresher">Fresher (0 years)</option>
                                            <option value="1-2 Years">1-2 Years</option>
                                            <option value="3-5 Years">3-5 Years</option>
                                            <option value="5+ Years">5+ Years</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5 flex flex-col items-start w-full">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                        <CheckCircle2 size={14}/> Key Skills
                                    </label>
                                    <textarea
                                        value={formData.skills}
                                        onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                        className="w-full min-h-[100px] p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                        placeholder="List your relevant skills (e.g., PHP, Laravel, JavaScript, etc.)"
                                    ></textarea>
                                </div>

                                <div className="space-y-1.5 flex flex-col items-start w-full">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                        <MessageSquareQuote size={14} className="lucide lucide-message-square-quote"/> Cover Letter / Message
                                    </label>
                                    <textarea
                                        value={formData.coverLetter}
                                        onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
                                        className="w-full min-h-[120px] p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                        placeholder="Tell us why you're interested in this position..."
                                    ></textarea>
                                </div>

                                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                                    <Clock size={16} />
                                    <span>We'll review your application and get back to you within 2-3 business days.</span>
                                </div>
                            </form>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 flex justify-center gap-4 shrink-0 bg-gray-50/80 rounded-b-2xl">
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={handleCloseModal}
                                className="h-11 px-8 rounded-lg font-bold bg-white text-gray-700 border-gray-200 hover:bg-gray-50 text-[15px]"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                form="jobApplicationForm"
                                disabled={isSubmitting}
                                className="h-11 px-8 rounded-lg font-bold bg-[#e11d48] hover:bg-[#be123c] text-white flex items-center gap-2 transition-all shadow-md text-[15px]"
                            >
                                {isSubmitting ? (
                                    <>Applying...</>
                                ) : (
                                    <><Send size={18} /> Submit Application</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default JobsPage;
