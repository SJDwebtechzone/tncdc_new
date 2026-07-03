import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveEnquiry } from '@/store/studentSlice';
import { createAdmission } from '@/store/admissionSlice';
import { fetchCourses } from '@/store/courseSlice';
import { fetchBatches } from '@/store/batchSlice';
import { X, Upload, BookOpen, Users } from 'lucide-react';

export default function AddStudentPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const courses = useSelector((state) => state.courses.courses || []);
    const batches = useSelector((state) => state.batches.batches || []);

    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchBatches());
    }, [dispatch]);

    const [formData, setFormData] = useState({
        firstName: '',
        relationship: '',
        fatherName: '',
        motherName: '',
        surname: '',
        mobile: '',
        alternateMobile: '',
        email: '',
        dob: '',
        gender: '',
        pincode: '',
        password: '',
        confirmPassword: '',
        address: '',
        course: '',
        batch: '',
        admissionDate: new Date().toISOString().split('T')[0],
        referralBy: 'Direct'
    });

    const [profileImage, setProfileImage] = useState(null);
    const [signature, setSignature] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (type === 'profile') setProfileImage(file);
        else if (type === 'signature') setSignature(file);
    };

    useEffect(() => {
        if (formData.course) {
            const courseData = courses.find(c => c.title === formData.course);
            if (courseData) {
                setFormData(prev => ({
                    ...prev,
                    courseFee: courseData.price || courseData.mrp || 0
                }));
            }
        }
    }, [formData.course, courses]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // 1. First save as Enquiry to handle images and base profile
            const enquiryData = {
                ...formData,
                name: `${formData.firstName} ${formData.surname}`.trim(),
                profileImage,
                signature,
                source: 'Direct Add'
            };

            const enquiry = await dispatch(saveEnquiry(enquiryData)).unwrap();

            // 2. Then create Admission linked to this enquiry
            const admissionData = {
                studentId: `STU-${Date.now().toString().slice(-6)}`,
                enquiryId: enquiry.id,
                firstName: formData.firstName,
                surname: formData.surname,
                email: formData.email,
                mobile: formData.mobile,
                courseName: formData.course,
                courseType: 'Regular',
                courseFee: 0, // Default or could be fetched from course
                discountType: 'Amount',
                discountValue: 0,
                isGstTaken: false,
                gstAmount: 0,
                finalAmount: 0,
                admissionFee: 0,
                admissionDate: formData.admissionDate,
                batch: formData.batch,
                referralBy: formData.referralBy,
                password: formData.password,
                status: 'Active'
            };

            await dispatch(createAdmission(admissionData)).unwrap();
            
            navigate('/dashboard/students/list');
        } catch (error) {
            console.error('Failed to add student:', error);
            alert(error || 'Failed to add student');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Add Student</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-8">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">First Name</label>
                        <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter First Name"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Relationship</label>
                        <select
                            name="relationship"
                            value={formData.relationship}
                            onChange={handleInputChange}
                            className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-blue-900 outline-none bg-white text-gray-700 font-medium"
                        >
                            <option value="">Select</option>
                            <option value="S/O">S/O</option>
                            <option value="D/O">D/O</option>
                            <option value="W/O">W/O</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Father/Husband Name</label>
                        <Input
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleInputChange}
                            placeholder="Enter Father/Husband Name"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Mother Name</label>
                        <Input
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleInputChange}
                            placeholder="Enter Mother Name"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Surname</label>
                        <Input
                            name="surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                            placeholder="Enter Surname"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Mobile</label>
                        <Input
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            placeholder="Enter Mobile Number"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Alternate Mobile</label>
                        <Input
                            name="alternateMobile"
                            value={formData.alternateMobile}
                            onChange={handleInputChange}
                            placeholder="Enter Alternate Mobile Number"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Email Address</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter Email Address"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Date of Birth</label>
                        <Input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium px-3"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-blue-900 outline-none bg-white text-gray-700 font-medium"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Profile Image</label>
                        <div className="flex items-center gap-2 h-10 px-1 border border-gray-200 rounded-sm">
                            <input
                                type="file"
                                id="profile-image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'profile')}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('profile-image-upload').click()}
                                className="h-8 text-[10px] font-bold uppercase rounded-sm bg-gray-100 border-gray-300 hover:bg-gray-200"
                            >
                                Choose File
                            </Button>
                            <span className="text-[10px] text-gray-400 font-medium truncate flex-1">
                                {profileImage ? profileImage.name : "No file chosen"}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Signature</label>
                        <div className="flex items-center gap-2 h-10 px-1 border border-gray-200 rounded-sm">
                            <input
                                type="file"
                                id="signature-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'signature')}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('signature-upload').click()}
                                className="h-8 text-[10px] font-bold uppercase rounded-sm bg-gray-100 border-gray-300 hover:bg-gray-200"
                            >
                                Choose File
                            </Button>
                            <span className="text-[10px] text-gray-400 font-medium truncate flex-1">
                                {signature ? signature.name : "No file chosen"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Row 4 - Course & Admission Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Select Course <span className="text-red-500">*</span></label>
                        <select
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                            required
                            className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-blue-900 outline-none bg-white font-medium"
                        >
                            <option value="">Select Course</option>
                            {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Select Batch <span className="text-red-500">*</span></label>
                        <select
                            name="batch"
                            value={formData.batch}
                            onChange={handleInputChange}
                            required
                            className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-blue-900 outline-none bg-white font-medium"
                        >
                            <option value="">Select Batch</option>
                            {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Admission Date</label>
                        <Input
                            type="date"
                            name="admissionDate"
                            value={formData.admissionDate}
                            onChange={handleInputChange}
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium px-3"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Referral By</label>
                        <Input
                            name="referralBy"
                            value={formData.referralBy}
                            onChange={handleInputChange}
                            placeholder="Direct / Referral Name"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Row 5 - Auth */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Pincode</label>
                        <Input
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="Pincode"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Password</label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter Password"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Confirm Password</label>
                        <Input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm Password"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Row 5 - Address */}
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                        className="w-full h-24 rounded-sm border border-gray-200 p-4 text-xs focus:ring-1 focus:ring-blue-900 outline-none transition-all font-medium resize-none shadow-sm"
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button
                        type="submit"
                        className="bg-[#1e3a8a] hover:bg-blue-900 text-white min-w-[120px] h-10 rounded-sm font-bold uppercase tracking-widest text-[11px] border-none shadow-md transition-all active:scale-95"
                    >
                        Submit
                    </Button>
                    <Button
                        type="button"
                        onClick={() => navigate('/dashboard/students/list')}
                        className="bg-[#b9875a] hover:bg-[#a6764a] text-white min-w-[120px] h-10 rounded-sm font-bold uppercase tracking-widest text-[11px] border-none shadow-md transition-all active:scale-95"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}






