import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createAdmission } from '@/store/admissionSlice';
import { fetchEnquiries } from '@/store/studentSlice';
import { fetchBatches } from '@/store/batchSlice';
import { fetchUsers } from '@/store/userSlice';
import { fetchCourses } from '@/store/courseSlice';
import { 
    User, 
    Phone, 
    Mail, 
    BookOpen, 
    Calendar, 
    Users as UsersIcon, 
    IndianRupee,
    Tag,
    Calculator,
    CheckCircle2,
    ArrowLeft,
    Lock
} from "lucide-react";

export default function AddAdmissionPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const enquiryId = searchParams.get('enquiryId');

    const enquiries = useSelector((state) => state.students.enquiries || []);
    const batches = useSelector((state) => state.batches.batches || []);
    const users = useSelector((state) => state.users.users || []);
    const courses = useSelector((state) => state.courses.courses || []);

    const [formData, setFormData] = useState({
        studentId: `STU-${Date.now().toString().slice(-6)}`,
        enquiryId: '',
        firstName: '',
        surname: '',
        email: '',
        mobile: '',
        courseName: '',
        courseType: 'Regular',
        courseFee: 0,
        discountType: 'Amount',
        discountValue: 0,
        isGstTaken: 'No',
        gstAmount: 0,
        finalAmount: 0,
        admissionFee: 0,
        admissionDate: new Date().toISOString().split('T')[0],
        showFatherName: true,
        showSurname: true,
        batch: '',
        referralBy: '',
        password: '' // New field for student login
    });

    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial data fetch
    useEffect(() => {
        dispatch(fetchEnquiries());
        dispatch(fetchBatches());
        dispatch(fetchUsers());
        dispatch(fetchCourses());
    }, [dispatch]);

    // Pre-populate if enquiryId is present
    useEffect(() => {
        if (enquiryId && enquiries.length > 0) {
            const enquiry = enquiries.find(e => e.id === parseInt(enquiryId));
            if (enquiry) {
                setSelectedEnquiry(enquiry);
                
                // Try to find the course to get its price
                const courseData = courses.find(c => c.title === enquiry.course);
                const coursePrice = courseData ? (courseData.price || courseData.mrp || 0) : 0;

                setFormData(prev => ({
                    ...prev,
                    enquiryId: enquiryId,
                    firstName: enquiry.firstName || '',
                    surname: enquiry.surname || '',
                    email: enquiry.email || '',
                    mobile: enquiry.mobile || '',
                    courseName: enquiry.course || '',
                    courseFee: coursePrice,
                    referralBy: enquiry.assignedTo || ''
                }));
            }
        }
    }, [enquiryId, enquiries, courses]);

    // No separate effect needed — fee is set directly on course selection

    // Dynamic Calculations
    useEffect(() => {
        setIsCalculating(true);
        let discount = 0;
        const fee = parseFloat(formData.courseFee) || 0;
        const discValue = parseFloat(formData.discountValue) || 0;

        if (formData.discountType === 'Percentage') {
            discount = (fee * discValue) / 100;
        } else {
            discount = discValue;
        }

        const discountedFee = Math.max(0, fee - discount);
        let gst = 0;
        if (formData.isGstTaken === 'Yes') {
            gst = discountedFee * 0.18; // 18% GST
        }

        setFormData(prev => ({
            ...prev,
            gstAmount: gst.toFixed(2),
            finalAmount: (discountedFee + gst).toFixed(2)
        }));
        
        // Short timeout to ensure state is committed before letting user submit
        const timer = setTimeout(() => setIsCalculating(false), 300);
        return () => clearTimeout(timer);
    }, [formData.courseFee, formData.discountType, formData.discountValue, formData.isGstTaken]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCourseChange = (e) => {
        const selectedTitle = e.target.value;
        const courseData = courses.find(c => c.title === selectedTitle);
        setFormData(prev => ({
            ...prev,
            courseName: selectedTitle,
            courseFee: courseData ? (courseData.price || courseData.mrp || courseData.fees || 0) : prev.courseFee,
            discountValue: 0,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createAdmission(formData)).unwrap();
            navigate('/dashboard/students/admissions');
        } catch (error) {
            alert(error || 'Failed to create admission');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(-1)}
                        className="rounded-full hover:bg-gray-100"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Convert to Admission</h1>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Calendar size={14} />
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* Quick Summary Cards if converting from Enquiry */}
            {selectedEnquiry && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <User size={24} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Enquiry Source: {selectedEnquiry.source}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{selectedEnquiry.firstName} {selectedEnquiry.surname}</h3>
                        <div className="space-y-2 text-blue-50/80 text-sm">
                            <div className="flex items-center gap-2"><Phone size={14} /> {selectedEnquiry.mobile}</div>
                            <div className="flex items-center gap-2"><Mail size={14} /> {selectedEnquiry.email || 'No email provided'}</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">Selected Course</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{selectedEnquiry.course}</h3>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Assigned To</span>
                                <span className="text-sm font-semibold text-gray-700">{selectedEnquiry.assignedTo}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-700 text-sm uppercase tracking-wider">
                        <User size={18} className="text-blue-600" /> General Information
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Student ID</label>
                            <Input 
                                disabled
                                value={formData.studentId}
                                className="h-11 bg-gray-50/50 border-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">First Name <span className="text-red-500">*</span></label>
                            <Input 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter first name"
                                className="h-11 border-gray-200 focus:ring-blue-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Surname <span className="text-red-500">*</span></label>
                            <Input 
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter surname"
                                className="h-11 border-gray-200 focus:ring-blue-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Email Address</label>
                            <Input 
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="example@domain.com"
                                className="h-11 border-gray-200 focus:ring-blue-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Mobile Number <span className="text-red-500">*</span></label>
                            <Input 
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                required
                                placeholder="10-digit number"
                                className="h-11 border-gray-200 focus:ring-blue-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Admission Date</label>
                            <Input 
                                type="date"
                                name="admissionDate"
                                value={formData.admissionDate}
                                onChange={handleInputChange}
                                className="h-11 border-gray-200 focus:ring-blue-600 px-4"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-700 text-sm uppercase tracking-wider">
                        <IndianRupee size={18} className="text-green-600" /> Course & Fee Details
                    </div>
                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Selection Course <span className="text-red-500">*</span></label>
                                <select
                                    name="courseName"
                                    value={formData.courseName}
                                    onChange={handleCourseChange}
                                    required
                                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:ring-1 focus:ring-blue-600 outline-none bg-white font-medium"
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Course Type</label>
                                <select
                                    name="courseType"
                                    value={formData.courseType}
                                    onChange={handleInputChange}
                                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                                >
                                    <option value="Regular">Regular</option>
                                    <option value="Online">Online</option>
                                    <option value="Crash Course">Crash Course</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Course Fee</label>
                                <Input 
                                    name="courseFee"
                                    type="number"
                                    value={formData.courseFee}
                                    onChange={handleInputChange}
                                    className="h-11 border-gray-200 font-bold text-blue-900"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Discount Type</label>
                                <div className="flex gap-4 p-1 bg-gray-100 rounded-lg h-11">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, discountType: 'Amount' }))}
                                        className={`flex-1 rounded-md text-xs font-bold transition-all ${formData.discountType === 'Amount' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Flat Amount
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, discountType: 'Percentage' }))}
                                        className={`flex-1 rounded-md text-xs font-bold transition-all ${formData.discountType === 'Percentage' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Percentage
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Discount Value</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <Input 
                                        name="discountValue"
                                        type="number"
                                        value={formData.discountValue}
                                        onChange={handleInputChange}
                                        className="h-11 pl-10 border-gray-200"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Include GST (18%)?</label>
                                <div className="flex gap-4 p-1 bg-gray-100 rounded-lg h-11">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, isGstTaken: 'Yes' }))}
                                        className={`flex-1 rounded-md text-xs font-bold transition-all ${formData.isGstTaken === 'Yes' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Apply GST
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, isGstTaken: 'No' }))}
                                        className={`flex-1 rounded-md text-xs font-bold transition-all ${formData.isGstTaken === 'No' ? 'bg-gray-200 text-gray-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Exclude
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-inner">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">GST Amount</span>
                                <div className="text-lg font-bold text-blue-900">₹{formData.gstAmount}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Total Payable</span>
                                <div className="text-2xl font-black text-green-700 flex items-center gap-1"><IndianRupee size={20} />{formData.finalAmount}</div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Initial Admission Fee Paid</label>
                                <div className="relative">
                                    <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <Input 
                                        name="admissionFee"
                                        type="number"
                                        value={formData.admissionFee}
                                        onChange={handleInputChange}
                                        className="h-10 pl-10 border-blue-200 bg-white shadow-sm font-bold text-blue-900"
                                        placeholder="Enter amount paid today"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-700 text-sm uppercase tracking-wider">
                            <UsersIcon size={18} className="text-orange-600" /> Batch & Reference
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Select Batch <span className="text-red-500">*</span></label>
                                <select
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                                >
                                    <option value="">Select Batch</option>
                                    {batches.map(v => <option key={v.id} value={v.name}>{v.name} ({v.timing})</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Referral By</label>
                                <select
                                    name="referralBy"
                                    value={formData.referralBy}
                                    onChange={handleInputChange}
                                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                                >
                                    <option value="">Select Reference</option>
                                    {users.map(u => <option key={u.id} value={u.fullName}>{u.fullName}</option>)}
                                    <option value="Self">Self</option>
                                    <option value="Social Media">Social Media</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1e293b] rounded-2xl shadow-sm border border-gray-800 overflow-hidden text-white">
                        <div className="bg-white/5 px-8 py-4 border-b border-white/10 flex items-center gap-2 font-bold text-white/80 text-sm uppercase tracking-wider">
                            <Lock size={18} className="text-yellow-400" /> Student Login Credentials
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                                    <CheckCircle2 size={18} />
                                </div>
                                <div className="text-xs text-yellow-100/80 leading-relaxed font-medium">
                                    Creating a password will automatically register the student for the learning portal access.
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest block">Account Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                    <Input 
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Set portal password"
                                        className="h-11 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-yellow-500/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center justify-end border-t border-gray-100 pt-8">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-8 h-12 rounded-xl transition-all"
                    >
                        Discard Changes
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || isCalculating || courses.length === 0}
                        className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-10 h-12 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 font-bold uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={16} /> Processing...
                            </div>
                        ) : 'Complete Admission'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
