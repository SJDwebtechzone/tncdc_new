import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourseById } from '@/store/courseSlice';
import { fetchPaymentDetails } from '@/store/paymentDetailSlice';
import { BASE_URL } from '@/config';
import axios from 'axios';
import { 
    ArrowLeft, 
    CheckCircle2, 
    CreditCard, 
    Smartphone, 
    Landmark, 
    QrCode, 
    User, 
    Mail, 
    Phone, 
    MapPin,
    ShieldCheck,
    ArrowRight,
    Star,
    Clock,
    BookOpen,
    Award
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { toast } from 'react-hot-toast';

const CourseCheckout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { currentCourse: course, loading: courseLoading } = useSelector(state => state.courses);
    const { details: paymentDetails, status: paymentStatus } = useSelector(state => state.paymentDetails);
    const { siteSettings } = useSelector(state => state.website);
    const { user } = useSelector(state => state.auth);
    
    const [step, setStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || user?.firstName ? `${user.firstName} ${user.lastName || user.surname || ''}`.trim() : '',
        email: user?.email || '',
        phone: user?.mobile || user?.phone || '',
        password: '',
        dob: '',
        pincode: '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchCourseById(id));
            dispatch(fetchPaymentDetails());
        }
        window.scrollTo(0, 0);
    }, [id, dispatch]);

    // Update formData if user details load later
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || (user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || user.surname || ''}`.trim() : '')),
                email: prev.email || user.email || '',
                phone: prev.phone || (user.mobile || user.phone || ''),
                address: prev.address || user.address || '',
                city: prev.city || user.city || '',
                state: prev.state || user.state || ''
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.phone) {
                toast.error("Please fill in all required fields");
                return;
            }
        }
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

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

    const handlePaymentSuccess = async (razorpayResponse) => {
        try {
            setSubmitting(true);
            console.log('Payment successful, verifying on server...', razorpayResponse);
            const verifyRes = await axios.post(`${BASE_URL}/api/razorpay/verify-payment`, {
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                studentDetails: {
                    firstName: formData.fullName.split(' ')[0],
                    lastName: formData.fullName.split(' ').slice(1).join(' '),
                    email: formData.email,
                    mobile: formData.phone,
                    password: formData.password,
                    dob: formData.dob,
                    pincode: formData.pincode,
                    address: formData.address
                },
                courseDetails: course
            });

            if (verifyRes.data.success) {
                setShowSuccessModal(true);
            }
        } catch (err) {
            console.error('Verification error:', err);
            toast.error(err.response?.data?.error || 'Payment successful but enrollment failed. Please contact support.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        // Validation
        const requiredFields = ['fullName', 'email', 'phone', 'dob'];
        const missingFields = requiredFields.filter(f => !formData[f]);
        
        if (missingFields.length > 0 || (!user && !formData.password)) {
            toast.error(`Please fill in all required fields${!user ? ' including Password' : ''}.`);
            return;
        }

        if (!course || (!course.price && course.price !== 0)) {
            toast.error("Course price information is missing. Please contact support.");
            return;
        }

        try {
            setSubmitting(true);
            
            // 1. Load Razorpay
            const loaded = await loadRazorpay();
            if (!loaded) {
                toast.error("Could not load Razorpay payment window. Please check your internet connection.");
                return;
            }

            // 2. Create Order
            console.log('Initiating order for amount:', course.price);
            const orderRes = await axios.post(`${BASE_URL}/api/razorpay/create-order`, {
                amount: course.price,
                receipt: `rcpt_${Date.now()}`
            });
            const order = orderRes.data;

            // 3. Get Settings (for Key ID)
            const settingsRes = await axios.get(`${BASE_URL}/api/payment-settings`);
            const settings = settingsRes.data;

            if (!settings.razorpayApiKey) {
                throw new Error("Razorpay API Key is not configured on the server.");
            }

            // 4. Open Razorpay
            const options = {
                key: settings.razorpayApiKey,
                amount: order.amount,
                currency: order.currency,
                name: settings.companyName || 'Tamil Nadu Career Development Council',
                description: `Enrollment for ${course.title}`,
                order_id: order.id,
                handler: handlePaymentSuccess,
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                notes: {
                    student_email: formData.email,
                    course_id: id
                },
                theme: { color: "#4f46e5" },
                modal: {
                    ondismiss: function() {
                        setSubmitting(false);
                        toast.info("Payment cancelled");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                console.error('Payment failed:', response.error);
                toast.error(`Payment failed: ${response.error.description}`);
            });
            rzp.open();

        } catch (err) {
            console.error('Payment Error Flow:', err);
            const errMsg = err.response?.data?.error || err.message || "Failed to initiate payment";
            toast.error(errMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (courseLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Preparing Checkout...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Course Not Found</h2>
                    <p className="text-gray-500 mb-6">The course you are looking for is no longer available.</p>
                    <button onClick={() => navigate('/courses')} className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold">Back to Courses</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <Navbar />
            
            <div className="pt-24 pb-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    
                    {/* Back Button & Header */}
                    <div className="mb-10">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm transition-colors mb-6 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Details
                        </button>
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Checkout</h1>
                                <p className="text-slate-500 font-medium mt-1">Complete your registration for {course.title}</p>
                            </div>
                            
                            {/* Stepper */}
                            <div className="flex items-center gap-4">
                                {[1, 2].map(s => (
                                    <div key={s} className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${step >= s ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-slate-200 text-slate-400'}`}>
                                            {step > s ? <CheckCircle2 size={18} /> : s}
                                        </div>
                                        <div className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step >= s ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {s === 1 ? 'Personal Info' : 'Payment Details'}
                                        </div>
                                        {s === 1 && <div className={`w-8 h-px ${step > 1 ? 'bg-purple-600' : 'bg-slate-200'}`}></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Form Section */}
                        <div className="lg:col-span-8 space-y-6">
                            
                            {step === 1 && (
                                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-50">
                                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900">Personal Information</h2>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Step 01 / 02</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors" size={18} />
                                                <input 
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your full name"
                                                    className="w-full pl-12 pr-4 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors" size={18} />
                                                <input 
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your@email.com"
                                                    className="w-full pl-12 pr-4 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number *</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors" size={18} />
                                                <input 
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="w-full pl-12 pr-4 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">City / Town</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors" size={18} />
                                                <input 
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Your city"
                                                    className="w-full pl-12 pr-4 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth *</label>
                                            <input 
                                                required
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                                className="w-full px-4 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all font-bold text-slate-700"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode *</label>
                                            <input 
                                                required
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                placeholder="600001"
                                                className="w-full px-4 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all font-bold text-slate-700"
                                            />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[11px] font-black text-red-500 uppercase tracking-widest pl-1">Create Password *</label>
                                            <input 
                                                required
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="••••••••"
                                                className="w-full px-4 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all font-bold text-slate-700"
                                            />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Residential Address</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-4 text-slate-300 group-focus-within:text-purple-500 transition-colors" size={18} />
                                                <textarea 
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                    placeholder="Enter your full address"
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all font-bold text-slate-700 overflow-hidden resize-none"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 flex justify-end">
                                        <button 
                                            onClick={siteSettings?.isPaymentGatewayActive ? handleSubmit : nextStep}
                                            disabled={submitting}
                                            className="px-10 h-14 bg-purple-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-purple-200 hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {submitting ? (
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    {siteSettings?.isPaymentGatewayActive ? 'Proceed to Payment' : 'Continue to Payment'}
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-50">
                                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900">Payment Information</h2>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Step 02 / 02</p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-10">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Secure Payment Instructions</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                                    Please use any of the payment methods below to pay the course fee. After making the payment, our counselor will contact you within 24 hours to verify and confirm your enrollment.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Options */}
                                    <div className="space-y-6">
                                        {/* Bank Accounts */}
                                        {paymentDetails.filter(d => d.type === 'bank' && d.status !== false).length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bank Transfer</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {paymentDetails.filter(d => d.type === 'bank' && d.status !== false).map((bank, i) => (
                                                        <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-200 transition-colors">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600">
                                                                    <Landmark size={18} />
                                                                </div>
                                                                <div className="font-black text-slate-900 text-xs truncate">{bank.bankName}</div>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Account Holder</div>
                                                                    <div className="text-xs font-bold text-slate-700">{bank.accountHolderName}</div>
                                                                </div>
                                                                <div className="flex justify-between items-end">
                                                                    <div>
                                                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">A/C Number</div>
                                                                        <div className="text-sm font-black text-purple-600 font-mono tracking-wider">{bank.accountNumber}</div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">IFSC Code</div>
                                                                    <div className="text-xs font-black text-slate-700 uppercase">{bank.ifscCode}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* UPI and QR Section */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* UPI ID List */}
                                            {paymentDetails.filter(d => d.type === 'upi' && d.status !== false).length > 0 && (
                                                <div className="space-y-4">
                                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Digital Wallets (UPI)</h3>
                                                    {paymentDetails.filter(d => d.type === 'upi' && d.status !== false).map((upi, i) => (
                                                        <div key={i} className="flex items-center gap-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                                                                <Smartphone size={18} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-[9px] font-black text-emerald-600/60 uppercase tracking-tighter mb-0.5">UPI Address</div>
                                                                <div className="text-sm font-black text-slate-900 truncate">{upi.upiId}</div>
                                                            </div>
                                                            <div className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full uppercase">Instant</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* QR Code Template */}
                                            {paymentDetails.filter(d => d.type === 'qr' && d.status !== false).length > 0 && (
                                                <div className="space-y-4">
                                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Scan to Pay</h3>
                                                    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                                        <div className="w-32 h-32 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 overflow-hidden border border-slate-100">
                                                            {paymentDetails.find(d => d.type === 'qr')?.qrImageUrl ? (
                                                                <img src={paymentDetails.find(d => d.type === 'qr').qrImageUrl} className="w-full h-full object-contain" alt="QR" />
                                                            ) : (
                                                                <QrCode size={48} className="text-slate-200" />
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Scan using GooglePay, PhonePe or Paytm</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-8">
                                        <button 
                                            onClick={() => setStep(1)}
                                            className="text-slate-400 hover:text-slate-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 group transition-colors"
                                        >
                                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                            Previous Step
                                        </button>
                                        <button 
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="px-10 h-14 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Finish Enrollment
                                                    <CheckCircle2 size={18} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 animate-in zoom-in-95 duration-500">
                                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                        <CheckCircle2 size={48} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 mb-4">Registration Sent!</h2>
                                    <p className="text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed font-medium">
                                        Thank you for choosing TNCDC, <span className="text-slate-900 font-black">{formData.fullName}</span>! We have received your enrollment request for <span className="text-purple-600 font-extrabold">{course.title}</span>. Our experts will verify your details and connect with you shortly.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-10">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Sent To</div>
                                            <div className="text-xs font-bold text-slate-700 truncate">{formData.email}</div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Wait</div>
                                            <div className="text-xs font-bold text-slate-700 uppercase tracking-tight">4-24 Business Hours</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <button 
                                            onClick={() => navigate('/courses')}
                                            className="w-full sm:w-auto px-10 h-14 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-black active:scale-95"
                                        >
                                            Explore More Courses
                                        </button>
                                        <button 
                                            onClick={() => navigate('/')}
                                            className="w-full sm:w-auto px-10 h-14 bg-white text-slate-600 border border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
                                        >
                                            Go to homepage
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

                                <div className="relative z-10">
                                    <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-6">Course Summary</h3>
                                    
                                    <div className="flex gap-4 mb-8">
                                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shrink-0 border border-white/10">
                                            {course.imageUrl ? (
                                                <img src={getImageUrl(course.imageUrl)} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/30"><BookOpen size={24} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold leading-snug line-clamp-2">{course.title}</h4>
                                            <p className="text-[10px] text-white/40 font-bold uppercase mt-1">ID: {course.id || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8 border-y border-white/10 py-6">
                                        <div className="flex items-center justify-between text-xs font-medium">
                                            <div className="flex items-center gap-2 text-white/50">
                                                <Clock size={14} /> Duration
                                            </div>
                                            <span className="font-bold">{course.duration} {course.durationUnit}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-medium">
                                            <div className="flex items-center gap-2 text-white/50">
                                                <Star size={14} /> Certification
                                            </div>
                                            <span className="font-bold">{course.certificateType || 'Standard'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-white/40 font-bold uppercase">Course Price</span>
                                            <span className="text-sm font-bold text-white/60 line-through">₹{course.mrp?.toLocaleString() || '0'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-black uppercase text-purple-400">Total Payable</span>
                                            <span className="text-3xl font-black text-white">₹{course.price?.toLocaleString() || '0'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-widest">
                                            <ShieldCheck size={14} className="text-purple-500" /> Secure Enrollment Process
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Enrollment Benefits Card */}
                            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Why learn with us?</h4>
                                <ul className="space-y-3">
                                    {[
                                        'Official Certification of Completion',
                                        'Lifetime access to study materials',
                                        'Industry-standard curriculum',
                                        'Job assistance & placement support'
                                    ].map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-3 text-xs text-slate-500 font-medium">
                                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden flex flex-col items-center text-center">
                        {/* Decorative Background */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-b-[50%] scale-150 transform -translate-y-16"></div>
                        
                        <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Award className="w-8 h-8 text-green-600" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-slate-800 mb-2 font-poppins">Thank You!</h3>
                        <p className="text-slate-500 mb-6 font-medium leading-relaxed">
                            for purchasing <span className="text-purple-600 font-bold">{course?.title}</span>. Your enrollment was successful.
                        </p>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 w-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100/50 rounded-bl-full"></div>
                            <div className="absolute bottom-0 left-0 w-12 h-12 bg-indigo-100/50 rounded-tr-full"></div>
                            <div className="relative flex items-center gap-4 text-left">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0">
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
                                onClick={() => navigate(`/courses/${course?.id}`)}
                                className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                Back to Course
                            </button>
                            <button
                                onClick={() => navigate('/pwa')}
                                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95 flex items-center justify-center gap-2"
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

// Local Helper for image paths
const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${BASE_URL}${url}`;
};

export default CourseCheckout;
