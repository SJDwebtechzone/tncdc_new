import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, fetchProfile, saveProfile, deleteProfileFile } from '@/store/profileSlice';
import { BASE_URL } from '@/config';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User, MapPin, FileText, Image as ImageIcon, Phone, Calendar, Trash2 } from "lucide-react";

export default function ProfilePage() {
    const profile = useSelector((state) => state.profile);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(profile);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const { name } = e.target;
        if (file) {
            setFormData(prev => ({
                ...prev,
                [name]: file
            }));
        }
    };

    const handleUpdate = () => {
        dispatch(saveProfile(formData));
        // Simple success feedback
        alert('Profile updated successfully!');
    };

    const handleDeleteFile = (type) => {
        if (window.confirm(`Are you sure you want to delete the ${type}?`)) {
            dispatch(deleteProfileFile(type));
            // Immediately clear local formData to update preview
            if (type === 'logo') setFormData(prev => ({ ...prev, logoFile: null, logoUrl: '' }));
            if (type === 'signature') setFormData(prev => ({ ...prev, signatureFile: null, signatureUrl: '' }));
            if (type === 'controllerSignature') setFormData(prev => ({ ...prev, controllerSignatureFile: null, controllerSignatureUrl: '' }));
        }
    };

    return (
        <div className="space-y-6 w-full max-w-full overflow-x-hidden">
            {/* Header Card */}
            <div className="bg-[#6366f1] p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                <div className="relative z-10 bg-white p-2 rounded-xl shrink-0">
                    <img
                        src={formData.logoUrl ? `${BASE_URL}${formData.logoUrl}` : "/assets/tncdc_logo.jpg"}
                        alt="Institute Logo"
                        className="w-20 h-20 object-contain"
                        onError={(e) => {
                            if (e.target.src !== 'https://placehold.co/100x100?text=Logo') {
                                e.target.src = 'https://placehold.co/100x100?text=Logo';
                            }
                        }}
                    />
                </div>
                <div className="relative z-10 flex-1 text-center md:text-left min-w-0">
                    <h1 className="text-2xl font-bold mb-1 truncate">{formData.instituteName}</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 text-blue-100 text-sm">
                        <span className="flex items-center gap-1"><User size={14} /> {formData.ownerName}</span>
                        <span className="flex items-center gap-1"><Mail size={14} /> {formData.email}</span>
                    </div>
                </div>

                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">

                {/* Basic Information */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><User size={18} /></span>
                        Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Institute Name <span className="text-red-500">*</span></label>
                            <Input
                                name="instituteName"
                                value={formData.instituteName}
                                onChange={handleChange}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Owner Name <span className="text-red-500">*</span></label>
                            <Input
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Designation <span className="text-red-500">*</span></label>
                            <select
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="DIRECTOR">DIRECTOR</option>
                                <option value="MANAGER">MANAGER</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address <span className="text-red-500">*</span></label>
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Birth</label>
                            <div className="relative">
                                <Input
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="bg-gray-50 border-gray-200"
                                />
                                <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Contact Information */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="p-1.5 bg-green-100 text-green-600 rounded-lg"><Phone size={18} /></span>
                        Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile Number <span className="text-red-500">*</span></label>
                            <Input
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Alternate Mobile <span className="text-red-500">*</span></label>
                            <Input
                                name="alternateMobile"
                                value={formData.alternateMobile}
                                onChange={handleChange}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Address Information */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><MapPin size={18} /></span>
                        Address Information
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full min-h-[80px] p-3 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">State <span className="text-red-500">*</span></label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Kerala">Kerala</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">City</label>
                                <Input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="bg-gray-50 border-gray-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pincode</label>
                                <Input
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="bg-gray-50 border-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Certificate Information */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><FileText size={18} /></span>
                        Certificate Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Controller of Examiner</label>
                                <Input
                                    name="controllerName"
                                    value={formData.controllerName}
                                    onChange={handleChange}
                                    className="bg-gray-50 border-gray-200"
                                />
                            </div>
                            <div className="flex items-center gap-8">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="showController"
                                        checked={formData.showController}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Show Controller on Certificate</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Upload Controller Examiner Sign</label>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center">
                                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 text-sm font-medium transition-colors">
                                        Choose File
                                        <input
                                            type="file"
                                            className="hidden"
                                            name="controllerSignatureFile"
                                            onChange={handleFileChange}
                                            accept=".jpg, .jpeg, .png, .webp"
                                        />
                                    </label>
                                    <span className="px-3 text-xs text-gray-400">
                                        {formData.controllerSignatureFile ? formData.controllerSignatureFile.name : "No file chosen"}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 uppercase">Accepted formats: JPG, PNG, WEBP (Max: 2MB)</p>

                            <div className="mt-4">
                                <h4 className="text-xs font-bold text-gray-700 mb-2">Current Controller Examiner Sign:</h4>
                                <div className="relative group w-48 border border-gray-100 rounded-lg p-2">
                                    <img
                                        src={formData.controllerSignatureFile ? URL.createObjectURL(formData.controllerSignatureFile) : (formData.controllerSignatureUrl ? `${BASE_URL}${formData.controllerSignatureUrl}` : "/placeholder-sign.png")}
                                        alt="Signature"
                                        className="w-full h-auto"
                                        onError={(e) => {
                                            if (e.target.src !== 'https://placehold.co/200x80?text=Signature') {
                                                e.target.src = 'https://placehold.co/200x80?text=Signature';
                                            }
                                        }}
                                    />
                                    {(formData.controllerSignatureFile || formData.controllerSignatureUrl) && (
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            className="absolute top-2 right-2 h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDeleteFile('controllerSignature')}
                                        >
                                            <Trash2 size={12} className="mr-1" /> Delete
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer mt-4">
                                <input
                                    type="checkbox"
                                    name="showDirector"
                                    checked={formData.showDirector}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Show Director on Certificate</span>
                            </label>

                        </div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Institute Logo & Signature */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"><ImageIcon size={18} /></span>
                        Institute Logo & Signature
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Logo Upload */}
                        <div className="space-y-4">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Upload Logo</label>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center">
                                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 text-sm font-medium transition-colors">
                                        Choose File
                                        <input
                                            type="file"
                                            className="hidden"
                                            name="logoFile"
                                            onChange={handleFileChange}
                                            accept=".jpg, .jpeg, .png, .webp"
                                        />
                                    </label>
                                    <span className="px-3 text-xs text-gray-400">
                                        {formData.logoFile ? formData.logoFile.name : "No file chosen"}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 uppercase">Accepted formats: JPG, PNG, WEBP (Max: 2MB)</p>

                            <div className="mt-4">
                                <h4 className="text-xs font-bold text-gray-700 mb-2">Current Logo:</h4>
                                <div className="relative group w-32 border border-gray-100 rounded-lg p-2">
                                    <img
                                        src={formData.logoFile ? URL.createObjectURL(formData.logoFile) : (formData.logoUrl ? `${BASE_URL}${formData.logoUrl}` : "/assets/tncdc_logo.jpg")}
                                        alt="Logo"
                                        className="w-full h-auto"
                                        onError={(e) => {
                                            if (e.target.src !== 'https://placehold.co/150x150?text=Logo') {
                                                e.target.src = 'https://placehold.co/150x150?text=Logo';
                                            }
                                        }}
                                    />
                                    {(formData.logoFile || formData.logoUrl) && (
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            className="absolute top-2 right-2 h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDeleteFile('logo')}
                                        >
                                            <Trash2 size={12} className="mr-1" /> Delete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Signature Upload */}
                        <div className="space-y-4">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Upload Signature</label>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center">
                                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 text-sm font-medium transition-colors">
                                        Choose File
                                        <input
                                            type="file"
                                            className="hidden"
                                            name="signatureFile"
                                            onChange={handleFileChange}
                                            accept=".jpg, .jpeg, .png, .webp"
                                        />
                                    </label>
                                    <span className="px-3 text-xs text-gray-400">
                                        {formData.signatureFile ? formData.signatureFile.name : "No file chosen"}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 uppercase">Accepted formats: JPG, PNG, WEBP (Max: 2MB)</p>

                            <div className="mt-4">
                                <h4 className="text-xs font-bold text-gray-700 mb-2">Current Signature:</h4>
                                <div className="relative group w-48 border border-gray-100 rounded-lg p-2 min-h-[60px] flex items-center justify-center bg-gray-50">
                                    {formData.signatureFile ? (
                                        <div className="relative group w-full">
                                            <img
                                                src={URL.createObjectURL(formData.signatureFile)}
                                                alt="Signature"
                                                className="w-full h-auto"
                                            />
                                            {/* No dynamic delete for local file before save, just UI consistency */}
                                        </div>
                                    ) : formData.signatureUrl ? (
                                        <div className="relative group w-full">
                                            <img
                                                src={`${BASE_URL}${formData.signatureUrl}`}
                                                alt="Signature"
                                                className="w-full h-auto"
                                            />
                                            {(formData.signatureFile || formData.signatureUrl) && (
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm" 
                                                    className="absolute top-2 right-2 h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleDeleteFile('signature')}
                                                >
                                                    <Trash2 size={12} className="mr-1" /> Delete
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">No signature uploaded</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-4 flex items-center gap-4">
                    <Button onClick={handleUpdate} className="bg-[#1e293b] hover:bg-[#0f172a] text-white px-8 py-2 h-11 rounded-lg">
                        <FileText size={16} className="mr-2" />
                        Update Profile
                    </Button>
                    <Button variant="outline" className="bg-[#059669] hover:bg-[#047857] text-white border-none px-8 py-2 h-11 rounded-lg">
                        Cancel
                    </Button>
                </div>

            </div>
        </div>
    );
}






