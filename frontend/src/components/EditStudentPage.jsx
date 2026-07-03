import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateEnquiry } from '@/store/studentSlice';
import { updateAdmission, fetchAdmissions } from '@/store/admissionSlice';
import { BASE_URL } from '@/config';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, User as UserIcon, Upload, Loader2 } from 'lucide-react';

export default function EditStudentPage() {
    const { id } = useParams(); // admission ID
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [admission, setAdmission] = useState(null);
    const [enquiry, setEnquiry] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        fatherName: '',
        motherName: '',
        relationship: '',
        mobile: '',
        alternateMobile: '',
        email: '',
        dob: '',
        gender: '',
        pincode: '',
        address: '',
        referralBy: '',
        batch: '',
        status: 'Active',
    });

    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Fetch admission + enquiry on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${BASE_URL}/api/admissions/${id}`);
                const adm = res.data;
                setAdmission(adm);
                const enq = adm.enquiry || null;
                setEnquiry(enq);

                setFormData({
                    firstName: adm.firstName || enq?.name?.split(' ')[0] || '',
                    surname: adm.surname || '',
                    fatherName: adm.fatherName || enq?.fatherName || '',
                    motherName: enq?.motherName || '',
                    relationship: enq?.relationship || '',
                    mobile: adm.mobile || enq?.mobile || '',
                    alternateMobile: enq?.alternateMobile || '',
                    email: adm.email || enq?.email || '',
                    dob: enq?.dob
                        ? new Date(enq.dob).toISOString().split('T')[0]
                        : adm.dob
                        ? new Date(adm.dob).toISOString().split('T')[0]
                        : '',
                    gender: enq?.gender || '',
                    pincode: enq?.pincode || '',
                    address: enq?.address || '',
                    referralBy: adm.referralBy || enq?.referredBy || 'Direct',
                    batch: adm.batch || '',
                    status: adm.status || 'Active',
                });

                if (enq?.profileImage) {
                    setPreviewUrl(
                        enq.profileImage.startsWith('http')
                            ? enq.profileImage
                            : `${BASE_URL}${enq.profileImage}`
                    );
                }
            } catch (err) {
                console.error('Failed to fetch student:', err);
                toast.error('Failed to load student data');
                navigate('/dashboard/students/list');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // 1. Update the Admission record
            await dispatch(updateAdmission({
                id: parseInt(id),
                data: {
                    firstName: formData.firstName,
                    surname: formData.surname,
                    email: formData.email,
                    mobile: formData.mobile,
                    courseName: admission?.courseName,
                    courseType: admission?.courseType,
                    courseFee: admission?.courseFee,
                    discountType: admission?.discountType,
                    discountValue: admission?.discountValue,
                    isGstTaken: admission?.isGstTaken,
                    gstAmount: admission?.gstAmount,
                    finalAmount: admission?.finalAmount,
                    admissionFee: admission?.admissionFee,
                    admissionDate: admission?.admissionDate,
                    batch: formData.batch,
                    referralBy: formData.referralBy,
                    status: formData.status,
                }
            })).unwrap();

            // 2. Update the linked Enquiry record (profile data, DOB, image, etc.)
            if (enquiry?.id) {
                const enquiryPayload = {
                    name: `${formData.firstName} ${formData.surname}`.trim(),
                    fatherName: formData.fatherName,
                    motherName: formData.motherName,
                    relationship: formData.relationship,
                    mobile: formData.mobile,
                    alternateMobile: formData.alternateMobile,
                    email: formData.email,
                    dob: formData.dob,
                    gender: formData.gender,
                    pincode: formData.pincode,
                    address: formData.address,
                    referredBy: formData.referralBy,
                    status: enquiry.status,
                    source: enquiry.source,
                };

                if (profileImage) {
                    enquiryPayload.profileImage = profileImage;
                }

                await dispatch(updateEnquiry({
                    id: enquiry.id,
                    data: enquiryPayload
                })).unwrap();
            }

            // 3. Refresh admissions list
            dispatch(fetchAdmissions());

            toast.success('Student updated successfully!');
            navigate('/dashboard/students/list');
        } catch (err) {
            console.error('Update student error:', err);
            toast.error(typeof err === 'string' ? err : 'Failed to update student');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-900" size={36} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/dashboard/students/list')}
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">Edit Student</h1>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Editing: <span className="font-semibold text-blue-700">
                            {formData.firstName} {formData.surname}
                        </span>
                        {admission?.studentId && (
                            <span className="ml-2 text-gray-300">·</span>
                        )}
                        {admission?.studentId && (
                            <span className="ml-2 font-mono text-gray-500">{admission.studentId}</span>
                        )}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-8">

                {/* Profile Image */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100 flex items-center justify-center bg-blue-50 shadow">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={36} className="text-blue-300" />
                            )}
                        </div>
                        <label
                            htmlFor="profile-image-upload"
                            className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1e3a8a] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors shadow"
                        >
                            <Upload size={13} className="text-white" />
                        </label>
                        <input
                            type="file"
                            id="profile-image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-700">Profile Photo</p>
                        <p className="text-xs text-gray-400 mt-0.5">Click the camera icon to change photo</p>
                        {profileImage && (
                            <p className="text-xs text-blue-600 mt-1 font-medium">{profileImage.name}</p>
                        )}
                    </div>
                </div>

                {/* Row 1 – Name */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">First Name <span className="text-red-500">*</span></label>
                        <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            required
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Surname</label>
                        <Input
                            name="surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                            placeholder="Surname"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900"
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
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Father / Husband Name</label>
                        <Input
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleInputChange}
                            placeholder="Father/Husband Name"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900"
                        />
                    </div>
                </div>

                {/* Row 2 – Contact */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Mother Name</label>
                        <Input
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleInputChange}
                            placeholder="Mother Name"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Mobile <span className="text-red-500">*</span></label>
                        <Input
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            placeholder="Mobile Number"
                            required
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Alternate Mobile</label>
                        <Input
                            name="alternateMobile"
                            value={formData.alternateMobile}
                            onChange={handleInputChange}
                            placeholder="Alternate Mobile"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Email Address</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email Address"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900"
                        />
                    </div>
                </div>

                {/* Row 3 – Personal */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Date of Birth</label>
                        <Input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900 px-3"
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
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Pincode</label>
                        <Input
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="Pincode"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-blue-900 outline-none bg-white text-gray-700 font-medium"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                {/* Row 4 – Admission Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Batch</label>
                        <Input
                            name="batch"
                            value={formData.batch}
                            onChange={handleInputChange}
                            placeholder="Batch Name"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Referral By</label>
                        <Input
                            name="referralBy"
                            value={formData.referralBy}
                            onChange={handleInputChange}
                            placeholder="Direct / Referral Name"
                            className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Course (Read-only)</label>
                        <Input
                            value={admission?.courseName || ''}
                            readOnly
                            className="h-10 rounded-sm border-gray-200 text-xs bg-gray-50 text-gray-500 font-medium select-none"
                        />
                    </div>
                </div>

                {/* Row 5 – Address */}
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter address"
                        className="w-full h-24 rounded-sm border border-gray-200 p-4 text-xs focus:ring-1 focus:ring-blue-900 outline-none transition-all font-medium resize-none shadow-sm"
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-[#1e3a8a] hover:bg-blue-900 text-white min-w-[140px] h-10 rounded-sm font-bold uppercase tracking-widest text-[11px] border-none shadow-md transition-all active:scale-95 gap-2"
                    >
                        {saving ? (
                            <><Loader2 size={14} className="animate-spin" /> Saving...</>
                        ) : (
                            <><Save size={14} /> Save Changes</>
                        )}
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
