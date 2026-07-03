import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '@/config';
import Navbar from './Navbar';
import Footer from './Footer';
import Marquee from './Marquee';
import { 
    Building, 
    User, 
    Calendar, 
    ChevronRight,
    ChevronLeft,
    Target,
    Users,
    Zap,
    BookOpen,
    Headphones,
    Globe,
    Layout,
    Award,
    TrendingUp,
    Phone,
    Mail,
    Smartphone,
    MapPin,
    Map,
    Navigation,
    Hash,
    Settings,
    Monitor,
    Info,
    Send
} from 'lucide-react';

const FranchiseRegistrationPage = () => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        institutionName: '',
        ownerName: '',
        designation: '',
        dob: '',
        email: '',
        mobile: '',
        fullAddress: '',
        taluka: '',
        pincode: '',
        city: '',
        state: '',
        computers: '',
        staff: '',
        agreeToTerms: false,
        agreeToCommunications: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(`${BASE_URL}/api/franchise-requests`, formData);
            toast.success('Franchise Application Submitted Successfully!');
            setStep(5); // Show success state
        } catch (error) {
            console.error('Submission failed:', error);
            toast.error('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const features = [
        {
            icon: <Award className="text-blue-500" size={24} />,
            title: "Proven Business Model",
            description: "Join a successful franchise network with tested business strategies and proven results."
        },
        {
            icon: <Users className="text-blue-500" size={24} />,
            title: "Training & Support",
            description: "Comprehensive training programs and ongoing support to ensure your success."
        },
        {
            icon: <TrendingUp className="text-blue-500" size={24} />,
            title: "Marketing Support",
            description: "Professional marketing materials and campaigns to help grow your business."
        },
        {
            icon: <BookOpen className="text-blue-500" size={24} />,
            title: "Course Materials",
            description: "Access to comprehensive course materials and curriculum designed by experts."
        },
        {
            icon: <Headphones className="text-blue-500" size={24} />,
            title: "24/7 Support",
            description: "Round-the-clock technical and operational support for your institute."
        },
        {
            icon: <Globe className="text-blue-500" size={24} />,
            title: "Brand Recognition",
            description: "Leverage our established brand name and reputation in the education sector."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <Marquee />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Hero Header */}
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                            Franchise Registration
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Join Our Franchise Network
                        </h1>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Start your own educational institute with our proven business model
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 p-8 md:p-12 mb-20 border border-gray-100 transition-all duration-500">
                        
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-start gap-6 mb-12">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Building size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Institution & Owner Details</h2>
                                        <p className="text-gray-400 font-medium text-sm">Basic information about your institution</p>
                                    </div>
                                </div>

                                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Building size={16} className="text-blue-500" /> Institution Name*
                                        </label>
                                        <input
                                            type="text"
                                            name="institutionName"
                                            placeholder="Enter institution name"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-gray-300"
                                            value={formData.institutionName}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <User size={16} className="text-blue-500" /> Center Owner Name*
                                        </label>
                                        <input
                                            type="text"
                                            name="ownerName"
                                            placeholder="Enter owner name"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-gray-300"
                                            value={formData.ownerName}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <User size={16} className="text-blue-500" /> Designation*
                                        </label>
                                        <select
                                            name="designation"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none text-gray-600 cursor-pointer"
                                            value={formData.designation}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Designation</option>
                                            <option value="Director">Director</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Principal">Principal</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Calendar size={16} className="text-blue-500" /> Date of Birth*
                                        </label>
                                        <input
                                            type="date"
                                            name="dob"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-600"
                                            value={formData.dob}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="md:col-span-2 flex justify-end mt-4">
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
                                        >
                                            Next Step <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-start gap-6 mb-12">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Phone size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                                        <p className="text-gray-400 font-medium text-sm">How can we reach you?</p>
                                    </div>
                                </div>

                                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Mail size={16} className="text-blue-500" /> Email Address*
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="example@domain.com"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-gray-300"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Smartphone size={16} className="text-blue-500" /> Mobile Number*
                                        </label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            placeholder="10 digit mobile number"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-gray-300"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="md:col-span-2 flex justify-between items-center mt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-800 transition-colors bg-white border border-gray-100 px-8 py-4 rounded-xl shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            <ChevronLeft size={18} /> Previous
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
                                        >
                                            Next Step <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-start gap-6 mb-12">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <MapPin size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Address Details</h2>
                                        <p className="text-gray-400 font-medium text-sm">Your institution location</p>
                                    </div>
                                </div>

                                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Map size={16} className="text-blue-500" /> Full Address*
                                        </label>
                                        <textarea
                                            name="fullAddress"
                                            placeholder="Landmark, Road, Building/House no. etc."
                                            className="w-full min-h-[120px] bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-gray-300 resize-none"
                                            value={formData.fullAddress}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Navigation size={16} className="text-blue-500" /> Taluka Name*
                                        </label>
                                        <input
                                            type="text"
                                            name="taluka"
                                            placeholder="Enter taluka name"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-gray-300"
                                            value={formData.taluka}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Hash size={16} className="text-blue-500" /> Postal Code*
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            placeholder="Enter PIN code"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-gray-300"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Building size={16} className="text-blue-500" /> City*
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Enter city name"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-gray-300"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <MapPin size={16} className="text-blue-500" /> State*
                                        </label>
                                        <select
                                            name="state"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none text-gray-600 cursor-pointer"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select State</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Kerala">Kerala</option>
                                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 flex justify-between items-center mt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-800 transition-colors bg-white border border-gray-100 px-8 py-4 rounded-xl shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            <ChevronLeft size={18} /> Previous
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
                                        >
                                            Next Step <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-start gap-6 mb-12">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Settings size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Infrastructure Details</h2>
                                        <p className="text-gray-400 font-medium text-sm">Tell us about your resources</p>
                                    </div>
                                </div>

                                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Monitor size={16} className="text-blue-500" /> Total Number of Computers*
                                        </label>
                                        <input
                                            type="number"
                                            name="computers"
                                            placeholder="Enter number of computers"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-gray-300"
                                            value={formData.computers}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Users size={16} className="text-blue-500" /> Total Number of Staff*
                                        </label>
                                        <input
                                            type="number"
                                            name="staff"
                                            placeholder="Enter number of staff"
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-gray-300"
                                            value={formData.staff}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Agreement Box */}
                                    <div className="md:col-span-2 bg-gray-50/30 border-2 border-dashed border-gray-100 rounded-3xl p-8 space-y-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Agreement</h3>
                                        
                                        <div className="space-y-4">
                                            <label className="flex items-start gap-4 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    name="agreeToTerms"
                                                    className="mt-1.5 h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 transition-all cursor-pointer"
                                                    checked={formData.agreeToTerms}
                                                    onChange={handleInputChange}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-800 group-hover:text-blue-500 transition-colors">I agree to the terms and conditions for franchise*</span>
                                                    <span className="text-[11px] text-gray-400 font-medium leading-relaxed mt-1">By checking this box, you acknowledge that you have read and agree to our franchise terms and conditions.</span>
                                                </div>
                                            </label>

                                            <label className="flex items-start gap-4 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    name="agreeToCommunications"
                                                    className="mt-1.5 h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 transition-all cursor-pointer"
                                                    checked={formData.agreeToCommunications}
                                                    onChange={handleInputChange}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-800 group-hover:text-blue-500 transition-colors">I agree to receive communications*</span>
                                                    <span className="text-[11px] text-gray-400 font-medium leading-relaxed mt-1">Please check this to agree to receive SMS, Email, and Call regarding your franchise application.</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Info Box */}
                                    <div className="md:col-span-2 bg-blue-50/50 border-l-4 border-blue-500 rounded-2xl p-6 flex items-start gap-4 shadow-sm shadow-blue-50">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-500">
                                            <Info size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1">What happens next?</h4>
                                            <p className="text-[12px] text-gray-600 font-medium leading-relaxed">We'll review your application and contact you within 2-3 business days with further details about the franchise opportunity.</p>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex justify-between items-center mt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-800 transition-colors bg-white border border-gray-100 px-8 py-4 rounded-xl shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            <ChevronLeft size={18} /> Previous
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!formData.agreeToTerms || !formData.agreeToCommunications || isSubmitting}
                                            className={`px-10 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                                                formData.agreeToTerms && formData.agreeToCommunications && !isSubmitting
                                                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-200'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                            }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={18} /> Submit Application
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="animate-in zoom-in-95 fade-in duration-500 text-center py-12">
                                <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100/50">
                                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white">
                                        <Award size={36} />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Application Submitted!</h2>
                                <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium">
                                    Your franchise registration request for <span className="text-blue-600 font-bold">"{formData.institutionName}"</span> has been received successfully.
                                </p>
                                <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8 max-w-lg mx-auto mb-12">
                                    <div className="flex items-center gap-3 justify-center text-blue-600 font-bold mb-4">
                                        <Info size={20} />
                                        <span>What's next?</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                        Our verification team will review your details and contact you via email (<span className="text-gray-900">{formData.email}</span>) or mobile within 2-3 business days.
                                    </p>
                                </div>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="bg-gray-900 hover:bg-black text-white px-12 py-4 rounded-xl font-bold transition-all shadow-xl active:scale-95"
                                >
                                    Back to Home
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Features Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Why Partner With Us?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-white p-10 rounded-[40px] border border-gray-50 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500 group">
                                    <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FranchiseRegistrationPage;
