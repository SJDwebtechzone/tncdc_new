import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone, Mail, Calendar, BookOpen, MapPin, History, LogOut, Plus, FileText, GraduationCap, X, CheckCircle, Clock, XCircle } from "lucide-react";
import { BASE_URL } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnquiryFollowUps, saveEnquiryFollowUp } from '@/store/studentSlice';
import { useNavigate } from 'react-router-dom';

export default function StudentEnquiryView({ enquiry, onBack }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const followUps = useSelector(state => state.students.followUps || []);
    
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
    
    // Follow up form state
    const [followUpForm, setFollowUpForm] = useState({
        followUpDate: '',
        nextFollowUpDate: '',
        studentResponse: 'Interested', // default
        conversationDetails: ''
    });

    useEffect(() => {
        if (enquiry && enquiry.id) {
            dispatch(fetchEnquiryFollowUps(enquiry.id));
        }
    }, [dispatch, enquiry]);

    const handleSaveFollowUp = async () => {
        if (!followUpForm.followUpDate || !followUpForm.conversationDetails) {
            alert('Please fill all required fields (*)');
            return;
        }
        await dispatch(saveEnquiryFollowUp({
            enquiryId: enquiry.id,
            data: followUpForm
        }));
        setIsFollowUpModalOpen(false);
        setFollowUpForm({
            followUpDate: '',
            nextFollowUpDate: '',
            studentResponse: 'Interested',
            conversationDetails: ''
        });
    };

    if (!enquiry) return null;

    const calculateAge = (dob) => {
        if (!dob) return '';
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(enquiry.dob);
    const dobFormatted = enquiry.dob ? new Date(enquiry.dob).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    }) : 'Not provided';
    
    const totalFollowUps = followUps.length;
    const lastFollowUp = totalFollowUps > 0 ? new Date(followUps[0].createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never';
    const nextFollowUp = totalFollowUps > 0 && followUps[0].nextFollowUpDate ? new Date(followUps[0].nextFollowUpDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : 'No scheduled follow-up';

    return (
        <div className="space-y-6 relative">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Button 
                    onClick={onBack} 
                    className="bg-[#c27c44] hover:bg-[#a66a3a] text-white font-bold h-10 px-6 rounded-md shadow-sm border-0 flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft size={16} strokeWidth={3} /> Back to Enquiries
                </Button>
                
                <div className="flex flex-wrap items-center gap-2">
                    <Button 
                        onClick={() => setIsFollowUpModalOpen(true)}
                        className="bg-[#1e3a8a] text-white hover:bg-[#152e73] font-semibold h-9 px-4 rounded-sm flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Follow-up
                    </Button>
                    <Button
                        onClick={() => navigate('/dashboard/students/admissions/add')}
                        className="bg-[#1e463a] text-white hover:bg-[#153229] font-semibold h-9 px-4 rounded-sm flex items-center gap-2"
                    >
                        <GraduationCap size={16} /> Convert to Admission
                    </Button>
                    <Button
                        onClick={() => setIsDocsModalOpen(true)}
                        className="bg-[#52525b] text-white hover:bg-[#3f3f46] font-semibold h-9 px-4 rounded-sm flex items-center gap-2"
                    >
                        <FileText size={16} /> View Documents
                    </Button>
                </div>
            </div>

            {/* Profile Banner */}
            <div className="bg-gradient-to-r from-[#6b82df] to-[#8050af] rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 shadow-md relative">
                <div className="w-20 h-20 rounded-full bg-[#5264c9] border-2 border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                    {enquiry.profileImage ? (
                        <img 
                            src={enquiry.profileImage.startsWith('http') ? enquiry.profileImage : `${BASE_URL}${enquiry.profileImage}`} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <span className="text-white text-2xl font-bold uppercase">
                            {enquiry.firstName?.charAt(0) || 'U'}{enquiry.surname?.charAt(0) || ''}
                        </span>
                    )}
                </div>
                
                <div className="flex-1 text-white">
                    <h2 className="text-2xl font-semibold mb-2">{enquiry.firstName} {enquiry.surname}</h2>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="opacity-80" /> {enquiry.mobile || 'Not provided'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="opacity-80" /> {enquiry.email || 'Not provided'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="opacity-80" /> {age ? `${age} years old` : 'Not provided'}
                        </div>
                    </div>
                </div>

                <div className="absolute right-6 top-6 md:top-auto md:bottom-6 lg:right-10 lg:static flex flex-col items-end gap-2">
                    <span className="bg-white/20 text-white text-[10px] px-3 py-1 rounded shadow-sm font-bold tracking-wide backdrop-blur-sm">
                        {enquiry.status || 'New'}
                    </span>
                    <div className="flex flex-col items-end text-sm">
                        <span className="font-bold text-base">Follow-ups: {totalFollowUps}</span>
                        <span className="text-white/80 text-xs">Last: {lastFollowUp}</span>
                    </div>
                </div>
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-6">
                        <User size={20} className="text-[#0b2447]" /> Personal Information
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Full Name:</span>
                            <span className="text-gray-600 text-sm">{enquiry.firstName} {enquiry.surname}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Relationship:</span>
                            <span className="text-gray-600 text-sm">{enquiry.relationship || 'Not provided'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Mother Name:</span>
                            <span className="text-gray-600 text-sm">{enquiry.motherName || 'Not provided'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Marital Status:</span>
                            <span className="text-gray-600 text-sm">{enquiry.maritalStatus || 'Not provided'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Qualification:</span>
                            <span className="text-gray-600 text-sm">{enquiry.qualification || 'Not provided'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Cast:</span>
                            <span className="text-gray-600 text-sm">{enquiry.cast || 'Not provided'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Date of Birth:</span>
                            <span className="text-gray-600 text-sm">{dobFormatted} {age ? `(${age} years)` : ''}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Gender:</span>
                            <span className="text-gray-600 text-sm">{enquiry.gender || 'Not provided'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Roll Number:</span>
                            <span className="text-gray-400 text-sm italic">Not assigned</span>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-6">
                        <Phone size={20} className="text-green-600" /> Contact Information
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs flex items-center">Mobile:</span>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-gray-600 text-sm">{enquiry.mobile || 'Not provided'}</span>
                                <Button size="sm" variant="outline" className="h-8 w-14 border-green-700 text-green-700 hover:bg-green-50 rounded shadow-sm">
                                    <Phone size={14} className="fill-green-700" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs flex items-center">Email:</span>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-gray-600 text-sm truncate max-w-[180px]">{enquiry.email || 'Not provided'}</span>
                                <Button size="sm" variant="outline" className="h-8 w-14 border-[#4f6acf] text-[#4f6acf] hover:bg-blue-50 rounded shadow-sm">
                                    <Mail size={14} className="fill-[#4f6acf]" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">PIN Code:</span>
                            <span className="text-gray-600 text-sm">{enquiry.pincode || 'Not provided'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">City:</span>
                            <span className="text-gray-600 text-sm">{enquiry.city || 'Not provided'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">State:</span>
                            <span className="text-gray-600 text-sm">{enquiry.state || 'Not provided'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-start pt-2">
                            <span className="text-gray-500 font-semibold text-xs pt-1">Address:</span>
                            <span className="text-gray-600 text-sm leading-relaxed">{enquiry.address || 'Not provided'}</span>
                        </div>
                    </div>
                </div>

                {/* Course & Assignment */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-6">
                        <div className="bg-blue-100 p-1.5 rounded text-blue-500"><BookOpen size={16} /></div> Course & Assignment
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-[140px_1fr] items-start">
                            <span className="text-gray-500 font-semibold text-xs pt-1">Course Interested:</span>
                            <span className="text-gray-600 text-sm font-medium">{enquiry.course || 'Not provided'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs flex items-center">Source:</span>
                            <div>
                                <span className="bg-gray-500 text-white text-[10px] px-2.5 py-1 rounded shadow-sm font-semibold tracking-wide">
                                    {enquiry.source || 'Website'}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Assigned To:</span>
                            <span className="text-gray-600 text-sm">{enquiry.assignedTo || 'Unassigned'}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs flex items-center">Status:</span>
                            <div>
                                <span className="bg-[#0b2447] text-white text-[10px] px-2.5 py-1 rounded shadow-sm font-semibold tracking-wide">
                                    {enquiry.status || 'New'}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Created On:</span>
                            <span className="text-gray-600 text-sm">
                                {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString('en-GB', {
                                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'
                                }) : 'Unknown'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Follow-ups Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-6">
                        <History size={20} className="text-amber-500" /> Follow-ups Summary
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Total Follow-ups:</span>
                            <span className="text-gray-600 text-sm font-bold text-amber-600">{totalFollowUps}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Last Follow-up:</span>
                            <span className="text-gray-600 text-sm">{lastFollowUp}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-gray-500 font-semibold text-xs">Next Follow-up:</span>
                            <span className="text-gray-600 text-sm">{nextFollowUp}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Follow-ups History Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative mt-6">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-6">
                    <History size={20} className="text-[#1e3a8a]" /> Follow-ups History
                </h3>
                
                {followUps.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 italic">No follow-ups recorded yet.</div>
                ) : (
                    <div className="relative pl-3 md:pl-0">
                        {/* Vertical line mapping track */}
                        <div className="absolute left-[11px] md:left-[23px] top-4 bottom-4 w-px bg-gray-200 z-0"></div>
                        
                        <div className="space-y-6">
                            {followUps.map((followUp, index) => {
                                // Determine styling based on response
                                let borderColor = 'border-gray-300';
                                let badgeBg = 'bg-gray-500';
                                let badgeText = 'text-white';
                                
                                switch(followUp.studentResponse) {
                                    case 'Interested':
                                        borderColor = 'border-green-600';
                                        badgeBg = 'bg-[#154c33]'; // Dark green from screenshot
                                        break;
                                    case 'Call Back Later':
                                        borderColor = 'border-amber-400';
                                        badgeBg = 'bg-[#dcb93d]'; // Yellow from screenshot
                                        break;
                                    case 'Not Interested':
                                        borderColor = 'border-red-500';
                                        badgeBg = 'bg-red-600';
                                        break;
                                    default:
                                        break;
                                }

                                const dateFormatted = new Date(followUp.followUpDate || followUp.createdAt).toLocaleString('en-GB', {
                                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'
                                });
                                
                                const nextFollowUpFormatted = followUp.nextFollowUpDate 
                                    ? new Date(followUp.nextFollowUpDate).toLocaleString('en-GB', {
                                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'
                                      })
                                    : null;

                                return (
                                    <div key={followUp.id || index} className="relative z-10 flex gap-4 md:gap-6">
                                        {/* Timeline Node */}
                                        <div className="flex-shrink-0 mt-3 relative">
                                            <div className="w-6 h-6 rounded-full bg-blue-50 border-4 border-white flex items-center justify-center shadow-sm z-10 relative hidden md:flex">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            </div>
                                            <div className="w-5 h-5 rounded-full bg-blue-50 border-[3px] border-white flex items-center justify-center shadow-sm z-10 relative md:hidden -ml-1">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* Content Card */}
                                        <div className={`flex-1 border border-gray-100 rounded-lg bg-white overflow-hidden shadow-sm border-l-4 ${borderColor}`}>
                                            <div className="p-4 md:p-5">
                                                <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold mb-3">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {dateFormatted} <span className="text-gray-400 font-normal">by</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 mb-4 text-xs">
                                                    <span className="font-bold text-gray-700 uppercase tracking-wide">Status:</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeBg} ${badgeText}`}>
                                                        {followUp.studentResponse}
                                                    </span>
                                                </div>

                                                <p className="text-gray-500 text-sm mb-4 whitespace-pre-wrap">{followUp.conversationDetails}</p>

                                                {nextFollowUpFormatted && (
                                                    <div className="bg-gray-50/80 rounded-md p-3 flex items-center gap-2 border border-gray-100/50">
                                                        <Clock size={14} className="text-gray-500" />
                                                        <span className="text-gray-700 text-xs font-bold">Next Follow-up: <span className="font-medium text-gray-500">{nextFollowUpFormatted}</span></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals and Overlays */}

            {/* View Documents Modal */}
            {isDocsModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <h2 className="text-base font-bold text-gray-700 flex items-center gap-2">
                                <FileText size={18} /> Student Documents
                            </h2>
                            <button onClick={() => setIsDocsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto bg-gray-50/30">
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase">Profile Image</h4>
                                <div className="border border-dashed border-gray-300 rounded p-2 bg-white flex justify-center min-h-[150px]">
                                    {enquiry.profileImage ? (
                                        <img src={enquiry.profileImage.startsWith('http') ? enquiry.profileImage : `${BASE_URL}${enquiry.profileImage}`}
                                            alt="Profile Document" className="max-h-48 object-contain" />
                                    ) : (
                                        <div className="flex items-center justify-center text-gray-400 text-sm italic w-full">No profile image found.</div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase">Signature</h4>
                                <div className="border border-dashed border-gray-300 rounded p-2 bg-white flex justify-center min-h-[100px]">
                                    {enquiry.signature ? (
                                        <img src={enquiry.signature.startsWith('http') ? enquiry.signature : `${BASE_URL}${enquiry.signature}`}
                                            alt="Signature Document" className="max-h-32 object-contain mix-blend-multiply" />
                                    ) : (
                                        <div className="flex items-center justify-center text-gray-400 text-sm italic w-full">No signature found.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t bg-white flex justify-end">
                            <Button onClick={() => setIsDocsModalOpen(false)} variant="outline" className="bg-gray-100 text-gray-700 h-9 font-semibold text-xs border-gray-200">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Follow-up Modal Window Overlay (Matching the specific UI screenshot context) */}
            {isFollowUpModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-8">
                    <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl relative flex flex-col max-h-full">
                        <div className="flex items-center justify-between p-5 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Add New Follow-up</h2>
                            <button onClick={() => setIsFollowUpModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
                            {/* Dates Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-700">Follow-up Date & Time <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input 
                                            type="datetime-local" 
                                            required
                                            value={followUpForm.followUpDate}
                                            onChange={(e) => setFollowUpForm({...followUpForm, followUpDate: e.target.value})}
                                            className="w-full h-10 border border-gray-200 rounded-sm px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">When did this follow-up happen?</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-700">Next Follow-up Date & Time</label>
                                    <div className="relative">
                                        <input 
                                            type="datetime-local"
                                            value={followUpForm.nextFollowUpDate}
                                            onChange={(e) => setFollowUpForm({...followUpForm, nextFollowUpDate: e.target.value})}
                                            className="w-full h-10 border border-gray-200 rounded-sm px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Schedule next follow-up (optional)</p>
                                </div>
                            </div>

                            {/* Response Options */}
                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-gray-700">Student Response <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className={`border rounded-lg p-4 cursor-pointer transition-all ${followUpForm.studentResponse === 'Interested' ? 'border-green-500 bg-green-50/30 ring-1 ring-green-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-start gap-3">
                                            <input type="radio" name="response" value="Interested" checked={followUpForm.studentResponse === 'Interested'} onChange={(e) => setFollowUpForm({...followUpForm, studentResponse: e.target.value})} className="mt-1 flex-shrink-0" />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">👍</span>
                                                    <span className="font-bold text-gray-800 text-sm">Interested</span>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-tight">Student is interested and wants to proceed</p>
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label className={`border rounded-lg p-4 cursor-pointer transition-all ${followUpForm.studentResponse === 'Call Back Later' ? 'border-amber-500 bg-amber-50/30 ring-1 ring-amber-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-start gap-3">
                                            <input type="radio" name="response" value="Call Back Later" checked={followUpForm.studentResponse === 'Call Back Later'} onChange={(e) => setFollowUpForm({...followUpForm, studentResponse: e.target.value})} className="mt-1 flex-shrink-0" />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">🕒</span>
                                                    <span className="font-bold text-gray-800 text-sm">Call Back Later</span>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-tight">Student needs time to think or discuss</p>
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label className={`border rounded-lg p-4 cursor-pointer transition-all ${followUpForm.studentResponse === 'Not Interested' ? 'border-red-500 bg-red-50/30 ring-1 ring-red-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-start gap-3">
                                            <input type="radio" name="response" value="Not Interested" checked={followUpForm.studentResponse === 'Not Interested'} onChange={(e) => setFollowUpForm({...followUpForm, studentResponse: e.target.value})} className="mt-1 flex-shrink-0" />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">👎</span>
                                                    <span className="font-bold text-gray-800 text-sm">Not Interested</span>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-tight">Student is not interested (will mark as lost)</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Details Textarea */}
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-gray-700">Conversation Details <span className="text-red-500">*</span></label>
                                <p className="text-xs font-medium text-gray-600 mb-2">What was discussed?</p>
                                <textarea 
                                    className="w-full h-32 border border-gray-200 rounded-sm p-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none bg-white" 
                                    placeholder="Describe the conversation, student's concerns, questions asked, information provided, etc."
                                    required
                                    value={followUpForm.conversationDetails}
                                    onChange={(e) => setFollowUpForm({...followUpForm, conversationDetails: e.target.value})}
                                ></textarea>
                                <p className="text-xs text-gray-400 mt-1">Be specific about what was discussed for future reference</p>
                            </div>
                        </div>

                        <div className="p-5 border-t bg-gray-50/80 flex justify-end gap-3 flex-shrink-0">
                            <Button type="button" onClick={() => setIsFollowUpModalOpen(false)} variant="outline" className="bg-[#b45309] hover:bg-[#8e420b] text-white border-0 h-10 px-6 font-bold text-sm shadow-sm rounded-sm">
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleSaveFollowUp} className="bg-[#1e463a] hover:bg-[#153229] text-white h-10 px-6 font-bold text-sm shadow-sm rounded-sm flex items-center gap-2">
                                <Plus size={16} /> Save Follow-up
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
