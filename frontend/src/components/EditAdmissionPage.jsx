import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateAdmission } from '@/store/admissionSlice';
import { fetchBatches } from '@/store/batchSlice';
import { fetchUsers } from '@/store/userSlice';
import { fetchCourses } from '@/store/courseSlice';
import axios from 'axios';
import { BASE_URL } from '@/config';
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
    Loader2
} from "lucide-react";

export default function EditAdmissionPage() {
    const { id } = useParams();
    console.log("EditAdmissionPage mounting with ID:", id);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const batches = useSelector((state) => state.batches.batches || []);
    const users = useSelector((state) => state.users.users || []);
    const courses = useSelector((state) => state.courses.courses || []);

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        studentId: '',
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
        admissionDate: '',
        showFatherName: true,
        showSurname: true,
        batch: '',
        referralBy: '',
        status: 'Active',
        profileImage: null
    });
    const [isCalculating, setIsCalculating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial data fetch
    useEffect(() => {
        const loadData = async () => {
            try {
                dispatch(fetchBatches());
                dispatch(fetchUsers());
                dispatch(fetchCourses());

                const response = await axios.get(`${BASE_URL}/api/admissions/${id}`);
                const admission = response.data;
                
                setFormData({
                    studentId: admission.studentId,
                    firstName: admission.firstName,
                    surname: admission.surname,
                    email: admission.email || '',
                    mobile: admission.mobile,
                    courseName: admission.courseName,
                    courseType: admission.courseType,
                    courseFee: admission.courseFee,
                    discountType: admission.discountType,
                    discountValue: admission.discountValue,
                    isGstTaken: admission.isGstTaken ? 'Yes' : 'No',
                    gstAmount: admission.gstAmount,
                    finalAmount: admission.finalAmount,
                    admissionFee: admission.admissionFee,
                    admissionDate: admission.admissionDate ? new Date(admission.admissionDate).toISOString().split('T')[0] : '',
                    showFatherName: admission.showFatherName,
                    showSurname: admission.showSurname,
                    batch: admission.batch || '',
                    referralBy: admission.referralBy || '',
                    status: admission.status || 'Active',
                    profileImage: admission.enquiry?.profileImage || null
                });
            } catch (error) {
                console.error('Failed to load admission:', error);
                alert('Failed to load admission details');
                navigate('/dashboard/students/admissions');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, dispatch, navigate]);

    // No separate effect needed — fee is set directly on course selection


    // Dynamic Calculations
    useEffect(() => {
        if (loading) return;
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
        
        const timer = setTimeout(() => setIsCalculating(false), 300);
        return () => clearTimeout(timer);
    }, [formData.courseFee, formData.discountType, formData.discountValue, formData.isGstTaken, loading]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // When course is selected manually, auto-fill the fee from the courses list
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
        if (isCalculating) return;
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await dispatch(updateAdmission({ id, data: formData })).unwrap();
            navigate('/dashboard/students/admissions');
        } catch (error) {
            alert(error || 'Failed to update admission');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

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
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Edit Admission</h1>
                </div>
                <div className="flex items-center gap-4">
                    {formData.profileImage && (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-200">
                            <img 
                                src={formData.profileImage.startsWith('http') ? formData.profileImage : `${BASE_URL}${formData.profileImage}`} 
                                alt="Student" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                        <Calendar size={14} />
                        {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>

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
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Admission Fee Paid</label>
                                <div className="relative">
                                    <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <Input 
                                        name="admissionFee"
                                        type="number"
                                        value={formData.admissionFee}
                                        onChange={handleInputChange}
                                        className="h-10 pl-10 border-blue-200 bg-white shadow-sm font-bold text-blue-900"
                                        placeholder="Enter amount paid"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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
                        disabled={isSubmitting || isCalculating}
                        className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-10 h-12 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 font-bold uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={16} /> Updating...
                            </div>
                        ) : 'Update Admission'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
