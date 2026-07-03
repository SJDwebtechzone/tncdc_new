import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfilePhoto, updateUserDetails, fetchStudentProfile } from '@/store/authSlice';
import { BASE_URL } from '@/config';
import { toast } from 'react-hot-toast';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    Camera, 
    Save, 
    ShieldCheck,
    CreditCard,
    Loader2
} from "lucide-react";

export default function StudentProfilePage() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        mobile: user?.mobile || '',
        dateOfBirth: user?.dateOfBirth || '',
        address: user?.address || ''
    });

    useEffect(() => {
        if (user?.email) {
            dispatch(fetchStudentProfile(user.email));
        }
    }, [dispatch, user?.email]);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                mobile: user.mobile || '',
                dateOfBirth: user.dateOfBirth || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);
        try {
            await dispatch(updateProfilePhoto({ userId: user.id, file })).unwrap();
            toast.success('Profile photo updated successfully');
        } catch (err) {
            toast.error(err || 'Failed to update profile photo');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        try {
            await dispatch(updateUserDetails({ userId: user.id, details: formData })).unwrap();
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            toast.error(err || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const profilePhotoUrl = user?.profilePhoto 
        ? (user.profilePhoto.startsWith('http') ? user.profilePhoto : `${BASE_URL}${user.profilePhoto}`)
        : null;

    return (
        <div className="space-y-8 pb-10 font-sans">
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900 p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[2rem] bg-white/10 backdrop-blur-md border-4 border-white/20 flex items-center justify-center overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                            {profilePhotoUrl ? (
                                <img 
                                    src={profilePhotoUrl} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={64} className="text-white/80" />
                            )}
                            
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={handleCameraClick}
                            disabled={isUploading}
                            className="absolute -bottom-2 -right-2 p-3 bg-white text-indigo-900 rounded-2xl shadow-xl hover:bg-indigo-50 transition-all active:scale-90 disabled:opacity-50"
                        >
                            <Camera size={20} />
                        </button>
                    </div>
                    
                    <div className="space-y-4 text-center md:text-left">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">{user?.fullName || 'Student Name'}</h1>
                            <p className="text-indigo-200 font-bold text-sm uppercase tracking-[0.2em] mt-1">Enrolled Scholar • ID: {user?.employeeId || 'TNCDC-001'}</p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-xs font-bold">
                                <ShieldCheck size={14} className="text-green-400" /> Verified Account
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-xs font-bold">
                                <CreditCard size={14} className="text-amber-400" /> Student Profile
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-10 space-y-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Personal Information</h2>
                            <div className="flex gap-3">
                                {isEditing && (
                                    <Button 
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-6 h-11 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />} 
                                        Save Changes
                                    </Button>
                                )}
                                <Button 
                                    type="button"
                                    onClick={() => setIsEditing(!isEditing)}
                                    variant={isEditing ? "outline" : "default"}
                                    className={`rounded-2xl px-6 h-11 text-xs font-black uppercase tracking-widest transition-all ${!isEditing && 'bg-gray-900 text-white'}`}
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <Input 
                                        name="fullName"
                                        value={formData.fullName} 
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="h-14 bg-gray-50 border-gray-100 rounded-2xl pl-12 font-bold focus:bg-white transition-all disabled:opacity-70"
                                    />
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Input 
                                        value={user?.email} 
                                        disabled={true}
                                        className="h-14 bg-gray-50 border-gray-100 rounded-2xl pl-12 font-bold focus:bg-white transition-all opacity-70"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                <div className="relative">
                                    <Input 
                                        name="mobile"
                                        value={formData.mobile} 
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="h-14 bg-gray-50 border-gray-100 rounded-2xl pl-12 font-bold focus:bg-white transition-all disabled:opacity-70"
                                    />
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                <div className="relative">
                                    <Input 
                                        name="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth} 
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="h-14 bg-gray-50 border-gray-100 rounded-2xl pl-12 font-bold focus:bg-white transition-all disabled:opacity-70"
                                    />
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Address</label>
                            <div className="relative">
                                <textarea 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full h-32 p-4 pt-12 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:outline-none transition-all disabled:opacity-70 resize-none"
                                />
                                <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-8">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Account Security</h3>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Change Password</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Update your login credentials</p>
                                </div>
                                <ShieldCheck size={20} className="text-blue-600" />
                            </div>
                            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Two-Factor Auth</p>
                                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest font-mono">Inactive</p>
                                </div>
                                <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-[2rem] shadow-xl p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                                <CreditCard size={20} /> Scholarship Status
                            </h3>
                            <div>
                                <h4 className="text-3xl font-black mb-1">Eligible</h4>
                                <p className="text-green-100 text-xs font-medium">You are qualifying for various student offers based on your performance.</p>
                            </div>
                            <Button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-2 border-white/20 rounded-2xl h-12 text-xs font-black uppercase tracking-widest">
                                View Offers
                            </Button>
                        </div>
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                            <ShieldCheck size={180} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
