import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses, fetchCourseById } from '@/store/courseSlice';
import { BASE_URL } from '@/config';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Star, Clock, BookOpen, Video, FileText, Users, ChevronRight, ArrowRight,
    ChevronDown, ChevronUp, MessageSquare, Award, Phone, X, Send, User, Mail, Smartphone,
    Upload, Building2, CreditCard
} from 'lucide-react';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';

// Robust image URL handling
const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${BASE_URL}${url}`;
};

const CourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentCourse = useSelector(state => state.courses.currentCourse);
    const allCourses = useSelector(state => state.courses.courses || []);
    const loading = useSelector(state => state.courses.loading);
    const { siteSettings } = useSelector(state => state.website || {});

    const [activeTab, setActiveTab] = useState('description');
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [showEnquiryModal, setShowEnquiryModal] = useState(false);
    const [enquirySubmitting, setEnquirySubmitting] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [signature, setSignature] = useState(null);
    const [enquiryForm, setEnquiryForm] = useState({
        instituteName: 'Tamil Nadu Career Development Council',
        name: '',
        relationship: 'Select',
        parentName: '',
        surname: '',
        dob: '',
        gender: 'Select',
        pincode: '',
        mobile: '',
        alternateMobile: '',
        email: '',
        address: '',
        course: '',
        source: 'Website',
        motherName: '',
        maritalStatus: 'Single',
        qualification: '',
        cast: '',
        state: 'Tamil Nadu',
        city: '',
    });

    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [purchaseSubmitting, setPurchaseSubmitting] = useState(false);
    const [purchaseForm, setPurchaseForm] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        password: '',
        dob: '',
        pincode: '',
        address: '',
    });

    // Sync purchase form with auth user if logged in
    const { user } = useSelector(state => state.auth);
    useEffect(() => {
        if (user && showPurchaseModal) {
            setPurchaseForm(prev => ({
                ...prev,
                firstName: user.fullName?.split(' ')[0] || '',
                lastName: user.fullName?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                mobile: user.mobile || '',
            }));
        }
    }, [user, showPurchaseModal]);

    const handleEnquiryChange = (field, value) => {
        setEnquiryForm({ ...enquiryForm, [field]: value });
    };

    const resetEnquiryForm = () => {
        setEnquiryForm({
            instituteName: 'Tamil Nadu Career Development Council',
            name: '', relationship: 'Select', parentName: '', surname: '',
            dob: '', gender: 'Select', pincode: '', mobile: '',
            alternateMobile: '', email: '', address: '',
            course: course?.title || '', source: 'Website',
            motherName: '', maritalStatus: 'Single', qualification: '',
            cast: '', state: 'Tamil Nadu', city: '',
        });
        setProfileImage(null);
        setSignature(null);
    };

    const openEnquiryModal = () => {
        setEnquiryForm(prev => ({ ...prev, course: course?.title || '' }));
        setShowEnquiryModal(true);
    };

    const handleEnquirySubmit = async (e) => {
        e.preventDefault();
        if (!enquiryForm.name || !enquiryForm.mobile || !enquiryForm.dob || !enquiryForm.pincode) {
            toast.error('Please fill all required fields');
            return;
        }
        setEnquirySubmitting(true);
        try {
            const formData = new FormData();
            formData.append('firstName', enquiryForm.name);
            formData.append('name', enquiryForm.name);
            formData.append('relationship', enquiryForm.relationship);
            formData.append('parentName', enquiryForm.parentName);
            formData.append('surname', enquiryForm.surname);
            formData.append('dob', enquiryForm.dob);
            formData.append('gender', enquiryForm.gender);
            formData.append('pincode', enquiryForm.pincode);
            formData.append('mobile', enquiryForm.mobile);
            formData.append('alternateMobile', enquiryForm.alternateMobile);
            formData.append('email', enquiryForm.email);
            formData.append('address', enquiryForm.address);
            formData.append('course', enquiryForm.course);
            formData.append('source', enquiryForm.source);
            formData.append('motherName', enquiryForm.motherName);
            formData.append('maritalStatus', enquiryForm.maritalStatus);
            formData.append('qualification', enquiryForm.qualification);
            formData.append('cast', enquiryForm.cast);
            formData.append('state', enquiryForm.state);
            formData.append('city', enquiryForm.city);
            if (profileImage) formData.append('profileImage', profileImage);
            if (signature) formData.append('signature', signature);

            await axios.post(`${BASE_URL}/api/enquiries`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Enquiry submitted successfully! We will contact you soon.');
            setShowEnquiryModal(false);
            resetEnquiryForm();
        } catch (err) {
            toast.error('Failed to submit enquiry. Please try again.');
        } finally {
            setEnquirySubmitting(false);
        }
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchCourseById(id));
            dispatch(fetchCourses());
        }
        window.scrollTo(0, 0);
    }, [id, dispatch]);

    // Purchase Logic
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePurchaseChange = (field, value) => {
        setPurchaseForm(prev => ({ ...prev, [field]: value }));
    };

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        
        if (!purchaseForm.firstName || !purchaseForm.mobile || !purchaseForm.email || (!user && !purchaseForm.password)) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            setPurchaseSubmitting(true);
            
            // 1. Load Razorpay script
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                return;
            }

            // 2. Create Order on Backend
            const orderRes = await axios.post(`${BASE_URL}/api/razorpay/create-order`, {
                amount: course.price,
                receipt: `rcpt_${Date.now()}`,
                notes: { courseId: course.id, studentEmail: purchaseForm.email }
            });

            const order = orderRes.data;

            // 3. Fetch Razorpay Settings (to get Key ID)
            const settingsRes = await axios.get(`${BASE_URL}/api/payment-settings`);
            const settings = settingsRes.data;

            // 4. Open Razorpay Checkout Window
            const options = {
                key: settings.razorpayApiKey,
                amount: order.amount,
                currency: order.currency,
                name: settings.companyName || 'Tamil Nadu Career Development Council',
                description: `Enrollment for ${course.title}`,
                order_id: order.id,
                handler: async (response) => {
                    // Payment successful
                    await handlePaymentSuccess(response);
                },
                prefill: {
                    name: `${purchaseForm.firstName} ${purchaseForm.lastName}`,
                    email: purchaseForm.email,
                    contact: purchaseForm.mobile
                },
                theme: {
                    color: "#5d5fef"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error('Payment preparation error:', err);
            let errorMessage = 'Failed to initialize payment';
            if (err.response?.data?.error) {
                const apiErr = err.response.data.error;
                errorMessage = typeof apiErr === 'object' ? (apiErr.description || JSON.stringify(apiErr)) : apiErr;
            } else if (err.message) {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
        } finally {
            setPurchaseSubmitting(false);
        }
    };

    const handlePaymentSuccess = async (razorpayResponse) => {
        try {
            setPurchaseSubmitting(true);
            const verifyRes = await axios.post(`${BASE_URL}/api/razorpay/verify-payment`, {
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                studentDetails: purchaseForm,
                courseDetails: course
            });

            if (verifyRes.data.success) {
                setShowPurchaseModal(false);
                setShowSuccessModal(true);
            }
        } catch (err) {
            console.error('Verification error:', err);
            toast.error('Payment was successful but enrollment failed. Please contact support.');
        } finally {
            setPurchaseSubmitting(false);
        }
    };

    const course = currentCourse;

    // Related courses: same category, exclude current
    const relatedCourses = allCourses
        .filter(c => c.id !== course?.id && (course?.category?.name ? c.category?.name === course.category.name : true) && c.status)
        .slice(0, 3);

    const popularCourses = allCourses
        .filter(c => c.id !== course?.id && c.isPopular && c.status)
        .slice(0, 4);

    // Parse syllabus (could be newline-separated or comma-separated)
    const syllabusItems = (course?.syllabus || '')
        .split(/[\n,;]+/)
        .map(s => s.trim().replace(/^[•\-\*]\s*/, ''))
        .filter(Boolean);

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'syllabus', label: 'Syllabus' },
        { id: 'fees', label: 'Course Fees' },
        { id: 'review', label: 'Review' },
    ];

    if (loading || !course) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
                <Navbar />
                <Marquee />
                <div className="flex-1 flex items-center justify-center pt-40">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-slate-500 text-lg font-medium">Loading course details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            <Navbar />
            <Marquee />

            {/* Hero Banner */}
            <div className="relative bg-slate-900 pt-32 pb-48 px-4 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 -left-20 w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
                    <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {course.imageUrl && (
                    <div className="absolute inset-0 opacity-15">
                        <img src={getImageUrl(course.imageUrl)} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="container mx-auto relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                                {course.category?.name || 'General'}
                            </span>
                            {course.isPopular && (
                                <span className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    🔥 Popular
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                            {course.title}
                        </h1>
                        {course.courseCode && (
                            <p className="text-slate-400 font-semibold text-sm mb-4">Course Code: {course.courseCode}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration || 'N/A'} {course.durationUnit || 'Months'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span>{course.totalLectures || 0} Lectures</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className={`w-4 h-4 ${i <= Math.round(course.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                                    ))}
                                </div>
                                <span>{course.rating || '0'} ({course.views || 0} Reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,155.45,124.64,226.78,92.83,263.85,76.32,291.6,62,321.39,56.44Z" className="fill-[#F8FAFC]"></path>
                    </svg>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 pb-24 relative z-20 -mt-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar - Sticky */}
                    <div className="w-full lg:w-[340px] shrink-0 order-1 lg:order-none">
                        <div className="lg:sticky lg:top-6">
                            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden">
                                {/* Course Image */}
                                {course.imageUrl && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={getImageUrl(course.imageUrl)}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Price */}
                                    <div className="mb-5">
                                        <div className="flex items-end gap-3">
                                            <span className="text-3xl font-extrabold text-slate-900">
                                                ₹{(course.price || 0).toLocaleString()}
                                            </span>
                                            {course.mrp && course.mrp > course.price && (
                                                <span className="text-base font-semibold text-slate-400 line-through mb-1">
                                                    ₹{course.mrp.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        {course.mrp && course.mrp > course.price && (
                                            <span className="inline-block mt-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                                {Math.round(((course.mrp - course.price) / course.mrp) * 100)}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* CTAs */}
                                    <div className="flex gap-2 mb-5">
                                        <button
                                            onClick={openEnquiryModal}
                                            className="flex-1 py-3.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-all shadow-sm flex items-center justify-center gap-1.5 border border-indigo-100 active:scale-[0.98]"
                                        >
                                            Enquire
                                        </button>
                                        {siteSettings?.isPaymentGatewayActive && (
                                            <button
                                                onClick={() => setShowPurchaseModal(true)}
                                                className="flex-1 py-3.5 bg-gradient-to-r from-[#1e463a] to-[#153229] text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-1.5"
                                            >
                                                Enroll Now
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Course Includes */}
                                    <div className="border-t border-slate-100 pt-5">
                                        <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4">Course Includes</h4>
                                        <div className="space-y-3.5">
                                            {[
                                                { icon: Clock, label: 'Duration', value: `${course.duration || 'N/A'} ${course.durationUnit || 'Months'}` },
                                                { icon: Users, label: 'Enrolled', value: `${course.views || 0}` },
                                                { icon: BookOpen, label: 'Lectures', value: `${course.totalLectures || 0}` },
                                                { icon: Video, label: 'Videos', value: `${course._count?.courseSubjects || 0}` },
                                                { icon: FileText, label: 'Notes', value: `${course.courseSubjects?.length || 0}` },
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between py-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                                            <item.icon className="w-4 h-4 text-slate-500" />
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-800">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0 order-2">
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-full p-1.5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 mb-8 inline-flex gap-1 overflow-x-auto w-full sm:w-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-10">

                            {/* Description Tab */}
                            {activeTab === 'description' && (
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 mb-6">What you'll learn</h2>
                                    <div className={`text-slate-600 leading-relaxed font-medium text-[15px] ${!showFullDesc ? 'line-clamp-4' : ''}`}>
                                        {course.description || 'In this course you will learn cutting-edge skills and practical knowledge required to excel in your career.'}
                                    </div>
                                    {(course.description?.length > 200) && (
                                        <button
                                            onClick={() => setShowFullDesc(!showFullDesc)}
                                            className="mt-4 text-purple-600 font-bold text-sm flex items-center gap-1 hover:text-purple-700 transition-colors"
                                        >
                                            {showFullDesc ? 'Show Less' : 'Show More'}
                                            {showFullDesc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Syllabus Tab */}
                            {activeTab === 'syllabus' && (
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Course Syllabus</h2>
                                    {syllabusItems.length > 0 ? (
                                        <div className="space-y-3">
                                            {syllabusItems.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-purple-50 transition-colors group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shrink-0 group-hover:bg-purple-200 transition-colors">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-slate-700 font-semibold">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-slate-400">
                                            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-60" />
                                            <p className="font-medium">Syllabus will be updated soon.</p>
                                        </div>
                                    )}

                                    {/* Also show semesters if available */}
                                    {course.semesters?.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-lg font-extrabold text-slate-800 mb-4">Semester-wise Breakdown</h3>
                                            <div className="space-y-4">
                                                {course.semesters.map((sem, idx) => (
                                                    <div key={sem.id} className="border border-slate-100 rounded-2xl overflow-hidden">
                                                        <div className="bg-slate-50 px-5 py-3 font-bold text-slate-700 text-sm flex items-center gap-2">
                                                            <Award className="w-4 h-4 text-purple-500" />
                                                            {sem.name || `Semester ${idx + 1}`}
                                                        </div>
                                                        {sem.subjects?.length > 0 && (
                                                            <div className="divide-y divide-slate-50">
                                                                {sem.subjects.map((sub, sIdx) => (
                                                                    <div key={sIdx} className="px-5 py-3 text-sm text-slate-600 font-medium flex items-center gap-3">
                                                                        <div className="w-5 h-5 rounded bg-indigo-50 text-indigo-500 flex items-center justify-center text-[10px] font-bold shrink-0">{sIdx + 1}</div>
                                                                        {sub.subject?.name || 'Subject'}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Course Fees Tab */}
                            {activeTab === 'fees' && (
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Course Fees</h2>
                                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                                        <table className="w-full">
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">Course Fees</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-right">:</td>
                                                    <td className="px-6 py-4 text-sm font-extrabold text-red-500 text-right">
                                                        ₹{(course.mrp || course.price || 0).toLocaleString()}/-
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">Discounted Fees</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-right">:</td>
                                                    <td className="px-6 py-4 text-sm font-extrabold text-emerald-600 text-right">
                                                        ₹ {(course.price || 0).toLocaleString()}/-
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">Course Duration</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-right">:</td>
                                                    <td className="px-6 py-4 text-sm font-extrabold text-slate-800 text-right">
                                                        {course.duration || 'N/A'} {course.durationUnit || 'Months'}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Review Tab */}
                            {activeTab === 'review' && (
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Review</h2>
                                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                                        {/* Rating Score */}
                                        <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-8 min-w-[160px]">
                                            <span className="text-5xl font-black text-slate-900">{course.rating || '0.0'}</span>
                                            <div className="flex gap-0.5 my-2">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(course.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">Overall Rating</span>
                                            <span className="text-xs text-slate-400">({course.views || 0} reviews)</span>
                                        </div>

                                        {/* Star Breakdown */}
                                        <div className="flex-1 space-y-2.5 justify-center flex flex-col">
                                            {[5, 4, 3, 2, 1].map(star => (
                                                <div key={star} className="flex items-center gap-3">
                                                    <div className="flex gap-0.5 shrink-0">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <Star key={i} className={`w-3 h-3 ${i <= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                                                        ))}
                                                    </div>
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
                                                            style={{ width: `${star === Math.round(course.rating || 0) ? 60 : 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-400 w-8 text-right">
                                                        {star === Math.round(course.rating || 0) ? '60%' : '0%'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Featured Review */}
                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-800 mb-4">Featured review</h3>
                                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-sm text-orange-700 font-medium flex items-center gap-3">
                                            <MessageSquare className="w-5 h-5 text-orange-400 shrink-0" />
                                            No reviews yet. Be the first to review this course!
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* More Popular Courses */}
                        {popularCourses.length > 0 && (
                            <div className="mt-12">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">Top Courses</span>
                                        <h3 className="text-2xl font-extrabold text-slate-900">
                                            More <span className="text-purple-600">Popular</span> Courses
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => navigate('/courses')}
                                        className="text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors flex items-center gap-1 border border-slate-200 rounded-xl px-4 py-2 hover:border-purple-200"
                                    >
                                        View All Course
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {popularCourses.slice(0, 2).map(c => (
                                        <CourseCard key={c.id} course={c} onClick={() => navigate(`/courses/${c.id}`)} siteSettings={siteSettings} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Courses Section */}
                {relatedCourses.length > 0 && (
                    <div className="mt-16">
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">More Similar Courses</span>
                            <h3 className="text-2xl font-extrabold text-slate-900">Related Courses</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedCourses.map(c => (
                                <CourseCard key={c.id} course={c} onClick={() => navigate(`/courses/${c.id}`)} siteSettings={siteSettings} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Full Enquiry Modal */}
            {showEnquiryModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl relative my-8">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#5d5fef] to-[#8b5cf6]">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Send size={18} /> New Enquiry
                            </h2>
                            <button
                                onClick={() => { setShowEnquiryModal(false); resetEnquiryForm(); }}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleEnquirySubmit} className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">

                            {/* Institute Name */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Building2 size={16} /> Institute Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">Institute Name *</label>
                                        <select
                                            value={enquiryForm.instituteName}
                                            onChange={e => handleEnquiryChange('instituteName', e.target.value)}
                                            className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
                                        >
                                            <option value="Tamil Nadu Career Development Council">Tamil Nadu Career Development Council</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">Course *</label>
                                        <select
                                            className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
                                            value={enquiryForm.course}
                                            onChange={e => handleEnquiryChange('course', e.target.value)}
                                        >
                                            <option value="">Select Course</option>
                                            {allCourses.filter(c => c.status).map(c => (
                                                <option key={c.id} value={c.title}>{c.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <User size={16} /> Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">First Name *</label>
                                        <input required value={enquiryForm.name} onChange={e => handleEnquiryChange('name', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">Relationship *</label>
                                        <select
                                            value={enquiryForm.relationship}
                                            onChange={e => handleEnquiryChange('relationship', e.target.value)}
                                            className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
                                        >
                                            <option>Select</option>
                                            <option>Father</option>
                                            <option>Mother</option>
                                            <option>Self</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Father/Husband Name</label>
                                        <input value={enquiryForm.parentName} onChange={e => handleEnquiryChange('parentName', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Surname Name</label>
                                        <input value={enquiryForm.surname} onChange={e => handleEnquiryChange('surname', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">Date of Birth *</label>
                                        <input required type="date" value={enquiryForm.dob} onChange={e => handleEnquiryChange('dob', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">Gender *</label>
                                        <select
                                            value={enquiryForm.gender}
                                            onChange={e => handleEnquiryChange('gender', e.target.value)}
                                            className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
                                        >
                                            <option>Select</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">PIN Code *</label>
                                        <input required value={enquiryForm.pincode} onChange={e => handleEnquiryChange('pincode', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Mother Name</label>
                                        <input value={enquiryForm.motherName} onChange={e => handleEnquiryChange('motherName', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Marital Status</label>
                                        <select
                                            value={enquiryForm.maritalStatus}
                                            onChange={e => handleEnquiryChange('maritalStatus', e.target.value)}
                                            className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
                                        >
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Qualification</label>
                                        <input value={enquiryForm.qualification} onChange={e => handleEnquiryChange('qualification', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Cast</label>
                                        <input value={enquiryForm.cast} onChange={e => handleEnquiryChange('cast', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">State</label>
                                        <input value={enquiryForm.state} onChange={e => handleEnquiryChange('state', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">City</label>
                                        <input value={enquiryForm.city} onChange={e => handleEnquiryChange('city', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Phone size={16} /> Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">Mobile Number *</label>
                                        <input required value={enquiryForm.mobile} onChange={e => handleEnquiryChange('mobile', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Alternate Mobile</label>
                                        <input value={enquiryForm.alternateMobile} onChange={e => handleEnquiryChange('alternateMobile', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Email Address</label>
                                        <input type="email" value={enquiryForm.email} onChange={e => handleEnquiryChange('email', e.target.value)} className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-1 md:col-span-3">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Address</label>
                                        <textarea
                                            value={enquiryForm.address}
                                            onChange={e => handleEnquiryChange('address', e.target.value)}
                                            className="w-full h-20 rounded-sm border border-gray-200 p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="space-y-4 pb-4">
                                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Upload size={16} /> Documents
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Profile Image</label>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="enquiry-profile-image"
                                                    onChange={(e) => setProfileImage(e.target.files[0])}
                                                />
                                                <button
                                                    type="button"
                                                    className="h-8 text-xs px-3 rounded-sm bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors font-medium"
                                                    onClick={() => document.getElementById('enquiry-profile-image').click()}
                                                >
                                                    Choose File
                                                </button>
                                                <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                                                    {profileImage ? profileImage.name : 'No file chosen'}
                                                </span>
                                                {profileImage && (
                                                    <button type="button" onClick={() => setProfileImage(null)} className="text-red-500 hover:text-red-700">
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            {profileImage && (
                                                <div className="w-16 h-16 rounded border overflow-hidden bg-gray-50">
                                                    <img src={URL.createObjectURL(profileImage)} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[9px] text-gray-400">Max size: 2MB, Format: JPG, PNG</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Signature</label>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="enquiry-signature"
                                                    onChange={(e) => setSignature(e.target.files[0])}
                                                />
                                                <button
                                                    type="button"
                                                    className="h-8 text-xs px-3 rounded-sm bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors font-medium"
                                                    onClick={() => document.getElementById('enquiry-signature').click()}
                                                >
                                                    Choose File
                                                </button>
                                                <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                                                    {signature ? signature.name : 'No file chosen'}
                                                </span>
                                                {signature && (
                                                    <button type="button" onClick={() => setSignature(null)} className="text-red-500 hover:text-red-700">
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            {signature && (
                                                <div className="w-16 h-16 rounded border overflow-hidden bg-gray-50">
                                                    <img src={URL.createObjectURL(signature)} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[9px] text-gray-400">Max size: 1MB, Format: JPG, PNG</p>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50/50">
                            <button
                                type="button"
                                onClick={() => { setShowEnquiryModal(false); resetEnquiryForm(); }}
                                className="bg-[#b45309] hover:bg-[#8e420b] text-white border-none h-9 text-xs font-bold px-6 rounded-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleEnquirySubmit}
                                disabled={enquirySubmitting}
                                className="bg-[#1e463a] hover:bg-[#153229] text-white h-9 text-xs font-bold px-6 rounded-sm flex items-center gap-2 disabled:opacity-60 transition-colors"
                            >
                                {enquirySubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Enquiry'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Complete Your Purchase Modal */}
            {showPurchaseModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <button
                                onClick={() => setShowPurchaseModal(false)}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <CreditCard className="w-6 h-6 text-indigo-200" />
                                <h2 className="text-2xl font-black tracking-tight">Complete Your Purchase</h2>
                            </div>
                            <p className="text-indigo-100 font-medium opacity-90">{course.title}</p>
                        </div>

                        <div className="p-8">
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 mb-8">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <span className="text-blue-600 text-xs font-bold">i</span>
                                </div>
                                <p className="text-sm font-semibold text-blue-800">Please provide your details to continue with the purchase</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">First Name *</label>
                                    <input 
                                        value={purchaseForm.firstName} 
                                        onChange={e => handlePurchaseChange('firstName', e.target.value)} 
                                        placeholder="John"
                                        className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Last Name *</label>
                                    <input 
                                        value={purchaseForm.lastName} 
                                        onChange={e => handlePurchaseChange('lastName', e.target.value)} 
                                        placeholder="Doe"
                                        className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Mobile Number *</label>
                                    <input 
                                        value={purchaseForm.mobile} 
                                        onChange={e => handlePurchaseChange('mobile', e.target.value)} 
                                        placeholder="9876543210"
                                        className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Email *</label>
                                    <input 
                                        type="email" 
                                        value={purchaseForm.email} 
                                        onChange={e => handlePurchaseChange('email', e.target.value)} 
                                        placeholder="john@example.com"
                                        className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-red-500 uppercase tracking-widest pl-1">Create Password *</label>
                                    <input 
                                        type="password" 
                                        value={purchaseForm.password} 
                                        onChange={e => handlePurchaseChange('password', e.target.value)} 
                                        placeholder="••••••••"
                                        className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Date of Birth *</label>
                                    <input 
                                        type="date" 
                                        value={purchaseForm.dob} 
                                        onChange={e => handlePurchaseChange('dob', e.target.value)} 
                                        className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Pincode *</label>
                                    <input 
                                        value={purchaseForm.pincode} 
                                        onChange={e => handlePurchaseChange('pincode', e.target.value)} 
                                        placeholder="600001"
                                        className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Address *</label>
                                    <textarea 
                                        value={purchaseForm.address} 
                                        onChange={e => handlePurchaseChange('address', e.target.value)} 
                                        placeholder="Enter your full address"
                                        className="w-full h-20 rounded-xl border border-slate-200 p-4 text-sm font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none" 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                                <span className="text-slate-500 font-bold">Total Amount:</span>
                                <span className="text-2xl font-black text-indigo-600">₹{(course.price || 0).toLocaleString()}.00</span>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPurchaseModal(false)}
                                    className="flex-1 h-14 rounded-2xl bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleProceedToPayment}
                                    disabled={purchaseSubmitting}
                                    className="flex-1 h-14 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-200 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    {purchaseSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Smartphone size={16} />
                                            Proceed to Payment
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden flex flex-col items-center text-center">
                        {/* Decorative Background */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-b-[50%] scale-150 transform -translate-y-16"></div>
                        
                        <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Award className="w-8 h-8 text-green-600" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-slate-800 mb-2 font-poppins">Thank You!</h3>
                        <p className="text-slate-500 mb-6 font-medium leading-relaxed">
                            for purchasing <span className="text-indigo-600 font-bold">{course?.title}</span>. Your enrollment was successful.
                        </p>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 w-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100/50 rounded-bl-full"></div>
                            <div className="absolute bottom-0 left-0 w-12 h-12 bg-purple-100/50 rounded-tr-full"></div>
                            <div className="relative flex items-center gap-4 text-left">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Next Steps</p>
                                    <p className="text-sm font-semibold text-slate-700 mt-1">You can now login to your student dashboard with the credentials you provided.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => navigate('/pwa')}
                                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                Go to Login
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

// Reusable Course Card for related/popular sections
const CourseCard = ({ course, onClick, siteSettings }) => (
    <div
        className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 cursor-pointer"
        onClick={onClick}
    >
        <div className="relative h-44 overflow-hidden bg-slate-100">
            {course.imageUrl ? (
                <img
                    src={getImageUrl(course.imageUrl)}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <BookOpen size={40} />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-3 h-3 ${i <= Math.round(course.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                    ))}
                </div>
                <span className="text-[11px] font-bold text-slate-400">{course.views || 0} Reviews</span>
            </div>
            <h4 className="text-[15px] font-bold text-slate-900 leading-snug mb-1 line-clamp-2 min-h-[40px] group-hover:text-purple-600 transition-colors">
                {course.title}
            </h4>
            {course.courseCode && (
                <p className="text-[11px] text-slate-400 font-semibold mb-3">({course.courseCode})</p>
            )}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    📂 {course.category?.name || 'General'}
                </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-end gap-2">
                    <span className="text-lg font-extrabold text-slate-900">₹{(course.price || 0).toLocaleString()}</span>
                    {course.mrp && course.mrp > course.price && (
                        <span className="text-xs font-semibold text-slate-400 line-through mb-0.5">₹{course.mrp.toLocaleString()}</span>
                    )}
                </div>
                {!siteSettings?.isPaymentGatewayActive ? (
                    <span className="text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Learn More <ArrowRight className="w-3 h-3" />
                    </span>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // this relies on window or passing navigate
                            window.location.href = `/courses/${course.id}/checkout`;
                        }}
                        className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-wider hover:bg-orange-600 hover:text-white transition-colors"
                    >
                        Buy Now
                    </button>
                )}
            </div>
        </div>
    </div>
);

export default CourseDetailPage;
