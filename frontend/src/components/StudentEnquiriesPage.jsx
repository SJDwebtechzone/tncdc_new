import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Upload, History, Download, Search, Settings, ArrowRight, Lock, Edit, RotateCcw, Eye, Phone, User, Trash2, Users, Calendar, X, FileText, Mail } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchEnquiries, saveEnquiry, updateEnquiry, deleteEnquiry, saveEnquiryFollowUp, assignEnquiry } from '@/store/studentSlice';
import { fetchCourses } from '@/store/courseSlice';
import { fetchUsers } from '@/store/userSlice';
import { BASE_URL } from '@/config';
import StudentEnquiryView from './StudentEnquiryView';

export default function StudentEnquiriesPage() {
    const dispatch = useDispatch();
    const enquiries = useSelector((state) => state.students.enquiries || []);
    const courses = useSelector((state) => state.courses.courses || []);
    const users = useSelector((state) => state.users.users || []);
    const loading = useSelector((state) => state.students.loading);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [signature, setSignature] = useState(null);
    const [formData, setFormData] = useState({ 
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
        source: 'Select Source', 
        assignedTo: 'Select Employee',
        motherName: '',
        maritalStatus: 'Single',
        qualification: '',
        cast: '',
        state: 'Tamil Nadu',
        city: ''
    });

    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [staffSearch, setStaffSearch] = useState('');
    const [followUpForm, setFollowUpForm] = useState({
        followUpDate: '',
        nextFollowUpDate: '',
        studentResponse: 'Interested',
        conversationDetails: ''
    });

    const location = useLocation();

    useEffect(() => {
        dispatch(fetchEnquiries());
        dispatch(fetchCourses());
        dispatch(fetchUsers());
    }, [dispatch]);

    // Handle auto-opening enquiry from notification link
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const autoEnquiryId = searchParams.get('id');
        
        if (autoEnquiryId && enquiries.length > 0) {
            const enquiry = enquiries.find(e => e.id === parseInt(autoEnquiryId));
            if (enquiry) {
                setSelectedEnquiry(enquiry);
                setIsViewModalOpen(true);
            }
        }
    }, [location.search, enquiries]);


    const handleSave = async (e) => {
        e.preventDefault();
        const data = { ...formData, profileImage, signature };
        
        if (selectedEnquiry) {
            await dispatch(updateEnquiry({ id: selectedEnquiry.id, data }));
        } else {
            await dispatch(saveEnquiry(data));
        }
        
        setIsModalOpen(false);
        setSelectedEnquiry(null);
        setFormData({ 
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
            source: 'Select Source', 
            assignedTo: 'Select Employee',
            motherName: '',
            maritalStatus: 'Single',
            qualification: '',
            cast: '',
            state: 'Tamil Nadu',
            city: ''
        });
        setProfileImage(null);
        setSignature(null);
    };

    const handleEdit = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setFormData({
            name: enquiry.firstName,
            relationship: enquiry.relationship || 'Select',
            parentName: enquiry.parentName || '',
            surname: enquiry.surname || '',
            dob: enquiry.dob ? new Date(enquiry.dob).toISOString().split('T')[0] : '',
            gender: enquiry.gender || 'Select',
            pincode: enquiry.pincode,
            mobile: enquiry.mobile,
            alternateMobile: enquiry.alternateMobile || '',
            email: enquiry.email || '',
            address: enquiry.address || '',
            course: enquiry.course,
            source: enquiry.source || 'Select Source',
            assignedTo: enquiry.assignedTo || 'Select Employee',
            motherName: enquiry.motherName || '',
            maritalStatus: enquiry.maritalStatus || 'Single',
            qualification: enquiry.qualification || '',
            cast: enquiry.cast || '',
            state: enquiry.state || 'Tamil Nadu',
            city: enquiry.city || ''
        });
        setIsModalOpen(true);
    };

    const handleView = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setIsViewModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            dispatch(deleteEnquiry(id));
        }
    };

    const handleOpenAssign = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setIsAssignModalOpen(true);
        setStaffSearch('');
    };

    const handleAssign = async (staffName) => {
        await dispatch(assignEnquiry({ enquiryId: selectedEnquiry.id, assignedTo: staffName }));
        setIsAssignModalOpen(false);
    };

    const handleOpenFollowUp = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setFollowUpForm({
            followUpDate: new Date().toISOString().slice(0, 16), // Set current date-time as default
            nextFollowUpDate: '',
            studentResponse: 'Interested',
            conversationDetails: ''
        });
        setIsFollowUpModalOpen(true);
    };

    const handleSaveFollowUp = async () => {
        if (!followUpForm.followUpDate || !followUpForm.conversationDetails) {
            alert('Please fill all required fields (*)');
            return;
        }
        await dispatch(saveEnquiryFollowUp({
            enquiryId: selectedEnquiry.id,
            data: followUpForm
        }));
        setIsFollowUpModalOpen(false);
        dispatch(fetchEnquiries()); // Refresh list to show updated status
    };

    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter(e => e.status === 'New').length;

    if (isViewModalOpen && selectedEnquiry) {
        return <StudentEnquiryView enquiry={selectedEnquiry} onBack={() => setIsViewModalOpen(false)} />;
    }

    return (
        <div className="space-y-6 relative">
            {/* Stats */}
            <div className="bg-[#6b5b95] bg-gradient-to-r from-[#5d5fef] to-[#8b5cf6] rounded-xl p-8 text-white shadow-lg flex justify-between items-center mb-8">
                {[
                    { label: "Total Enquiries", count: totalEnquiries },
                    { label: "New Enquiries", count: newEnquiries },
                    { label: "Pending Follow-ups", count: 0 },
                    { label: "Converted", count: 0 },
                ].map((stat, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-center border-r border-[#ffffff30] last:border-0">
                        <div className="text-4xl font-bold mb-1">{stat.count}</div>
                        <div className="text-sm font-medium opacity-90">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">

                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center p-6 pb-2">
                    <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                        <Users size={20} className="text-gray-700" /> All Enquiries
                    </h2>
                    <div className="flex gap-2">
                        <Button onClick={() => setIsModalOpen(true)} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white gap-2 text-xs font-medium px-4 h-9">
                            <Plus size={14} /> Add New Enquiry
                        </Button>
                        <Button className="bg-[#52525b] hover:bg-[#52525b]/90 text-white gap-2 text-xs font-medium px-4 h-9">
                            <Upload size={14} /> Import
                        </Button>
                        <Button className="bg-[#b45309] hover:bg-[#b45309]/90 text-white gap-2 text-xs font-medium px-4 h-9">
                            <History size={14} /> Import History
                        </Button>
                        <Button className="bg-[#065f46] hover:bg-[#065f46]/90 text-white gap-2 text-xs font-medium px-4 h-9">
                            <Download size={14} /> Export
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Row 1 */}
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                                <Input className="pl-9 h-10 w-full text-xs bg-gray-50/50" placeholder="Name, mobile, email..." />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Status</label>
                            <select className="w-full h-10 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 bg-white">
                                <option>All Status</option>
                                <option>New</option>
                                <option>Pending</option>
                                <option>Converted</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Source</label>
                            <select className="w-full h-10 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 bg-white">
                                <option>All Sources</option>
                                <option>Social Media</option>
                                <option>Referral</option>
                                <option>Walk-in</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Assigned To</label>
                            <select className="w-full h-10 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 bg-white">
                                <option>All Employees</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.fullName}>{u.fullName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Course</label>
                            <select className="w-full h-10 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 bg-white">
                                <option>All Courses</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.title}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* Row 2 */}
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">From Date</label>
                            <div className="relative">
                                <Input placeholder="dd-mm-yyyy" className="h-10 w-full text-xs text-gray-500" />
                                <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={14} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">To Date</label>
                            <div className="relative">
                                <Input placeholder="dd-mm-yyyy" className="h-10 w-full text-xs text-gray-500" />
                                <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={14} />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white h-10 text-xs font-medium">
                                <Search size={14} className="mr-2" /> Search
                            </Button>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full bg-[#b45309] hover:bg-[#b45309]/90 text-white h-10 text-xs font-medium">
                                <RotateCcw size={14} className="mr-2" /> Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[40px] font-bold text-gray-800 text-xs uppercase">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase w-[50px]">Photo</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase min-w-[200px]">Student Details</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Contact</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase max-w-[200px]">Course</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Source</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Assigned To</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Status</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase whitespace-nowrap">Follow-ups</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Created</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase text-center w-[120px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={11} className="h-32 text-center text-gray-500">
                                        Loading enquiries...
                                    </TableCell>
                                </TableRow>
                            ) : enquiries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={11} className="h-32 text-center text-gray-500">
                                        No enquiries found. Add one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                enquiries.map((row, index) => (
                                    <TableRow key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <TableCell className="text-orange-500 font-medium text-xs align-top">{index + 1}</TableCell>
                                        <TableCell className="align-top">
                                            {row.profileImage ? (
                                                <img src={row.profileImage.startsWith('http') ? row.profileImage : `${BASE_URL}${row.profileImage}`} 
                                                     alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="bg-[#b45309] text-white w-8 h-8 rounded-full flex items-center justify-center text-xs">
                                                    <User size={14} />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-[#1e3a8a] text-sm">{row.firstName} {row.surname}</span>
                                                <span className="text-gray-400 text-[10px]">DOB: {row.dob}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-green-600 text-xs flex items-center gap-1">
                                                    📞 {row.mobile}
                                                </span>
                                                <span className="text-blue-500 text-[10px]">
                                                    📧 {row.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <div className="text-gray-600 text-xs truncate max-w-[200px]">
                                                {row.course}
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <span className="bg-gray-500 text-white text-[10px] px-2 py-0.5 rounded">{row.source}</span>
                                        </TableCell>
                                        <TableCell className="text-gray-600 text-xs align-top">{row.assignedTo}</TableCell>
                                        <TableCell className="align-top">
                                            <span className="bg-[#1e3a8a] text-white text-[10px] px-2 py-0.5 rounded">{row.status}</span>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <div className="flex flex-col gap-1">
                                                                                                {row.followUps && row.followUps.length > 0 && row.followUps[0].nextFollowUpDate ? (
                                                    <span className="text-[#14532d] font-bold text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                                        Next: {new Date(row.followUps[0].nextFollowUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-[10px]">No scheduled</span>
                                                )}

                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 text-xs align-top">
                                            {new Date(row.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <div className="grid grid-cols-2 gap-2 justify-items-center">
                                                <Button onClick={() => handleView(row)} variant="ghost" size="icon" className="h-6 w-6 text-[#1e3a8a]">
                                                    <Eye size={14} />
                                                </Button>
                                                <Button onClick={() => handleEdit(row)} variant="ghost" size="icon" className="h-6 w-6 text-[#1e3a8a]">
                                                    <Edit size={14} />
                                                </Button>
                                                <Button onClick={() => handleOpenFollowUp(row)} variant="ghost" size="icon" className="h-6 w-6 text-[#1e3a8a]">
                                                    <Phone size={14} />
                                                </Button>
                                                <Button onClick={() => handleOpenAssign(row)} variant="ghost" size="icon" className="h-6 w-6 text-[#1e3a8a]">
                                                    <User size={14} />
                                                </Button>
                                                <Button onClick={() => handleDelete(row.id)} variant="ghost" size="icon" className="h-6 w-6 text-[#1e3a8a] col-span-2">
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Add Enquiry Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl relative my-8">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-normal text-gray-800">Add New Enquiry</h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedEnquiry(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <User size={16} /> Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">First Name *</label>
                                        <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">Relationship *</label>
                                        <select 
                                            value={formData.relationship}
                                            onChange={e => setFormData({ ...formData, relationship: e.target.value })}
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
                                        <Input value={formData.parentName} onChange={e => setFormData({ ...formData, parentName: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Surname Name</label>
                                        <Input value={formData.surname} onChange={e => setFormData({ ...formData, surname: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">Date of Birth *</label>
                                        <Input required type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">Gender *</label>
                                        <select 
                                            value={formData.gender}
                                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
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
                                        <Input required value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Mother Name</label>
                                        <Input value={formData.motherName} onChange={e => setFormData({ ...formData, motherName: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Marital Status</label>
                                        <select 
                                            value={formData.maritalStatus}
                                            onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
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
                                        <Input value={formData.qualification} onChange={e => setFormData({ ...formData, qualification: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Cast</label>
                                        <Input value={formData.cast} onChange={e => setFormData({ ...formData, cast: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">State</label>
                                        <Input value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">City</label>
                                        <Input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="h-9 rounded-sm border-gray-200" />
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
                                        <Input required value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Alternate Mobile</label>
                                        <Input value={formData.alternateMobile} onChange={e => setFormData({ ...formData, alternateMobile: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Email Address</label>
                                        <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="h-9 rounded-sm border-gray-200" />
                                    </div>
                                    <div className="space-y-1 md:col-span-3">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Address</label>
                                        <textarea 
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full h-20 rounded-sm border border-gray-200 p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Course & Assignment */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Calendar size={16} /> Course & Assignment
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-red-500 uppercase">Course *</label>
                                        <select
                                            className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
                                            value={formData.course}
                                            onChange={e => setFormData({ ...formData, course: e.target.value })}
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map(c => (
                                                <option key={c.id} value={c.title}>{c.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Source</label>
                                        <select
                                            className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
                                            value={formData.source}
                                            onChange={e => setFormData({ ...formData, source: e.target.value })}
                                        >
                                            <option value="Select Source">Select Source</option>
                                            <option value="Social Media">Social Media</option>
                                            <option value="Referral">Referral</option>
                                            <option value="Walk-in">Walk-in</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-600 uppercase">Assign To</label>
                                        <select
                                            className="w-full h-9 rounded-sm border border-gray-200 px-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
                                            value={formData.assignedTo}
                                            onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                                        >
                                            <option value="Select Employee">Select Employee</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.fullName}>{u.fullName}</option>
                                            ))}
                                        </select>
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
                                                    id="profile-image-input"
                                                    onChange={(e) => setProfileImage(e.target.files[0])}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-8 text-xs px-3 rounded-sm bg-gray-50 border-gray-200"
                                                    onClick={() => document.getElementById('profile-image-input').click()}
                                                >
                                                    Choose File
                                                </Button>
                                                <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                                                    {profileImage ? profileImage.name : "No file chosen"}
                                                </span>
                                                {profileImage && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-red-500"
                                                        onClick={() => setProfileImage(null)}
                                                    >
                                                        <X size={14} />
                                                    </Button>
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
                                                    id="signature-input"
                                                    onChange={(e) => setSignature(e.target.files[0])}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-8 text-xs px-3 rounded-sm bg-gray-50 border-gray-200"
                                                    onClick={() => document.getElementById('signature-input').click()}
                                                >
                                                    Choose File
                                                </Button>
                                                <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                                                    {signature ? signature.name : "No file chosen"}
                                                </span>
                                                {signature && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-red-500"
                                                        onClick={() => setSignature(null)}
                                                    >
                                                        <X size={14} />
                                                    </Button>
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

                        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50/50">
                            <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setSelectedEnquiry(null); }} className="bg-[#b45309] hover:bg-[#8e420b] text-white border-none h-9 text-xs font-bold px-6 rounded-sm">
                                Cancel
                            </Button>
                            <Button type="submit" onClick={handleSave} className="bg-[#1e463a] hover:bg-[#153229] text-white h-9 text-xs font-bold px-6 rounded-sm">
                                {selectedEnquiry ? 'Update Enquiry' : 'Add Enquiry'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Follow-up Modal Window Overlay */}
            {isFollowUpModalOpen && selectedEnquiry && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 md:p-6 overflow-y-auto w-full h-full">
                    <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl relative flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in duration-200">
                        {/* Student Info Header Bar */}
                        <div className="bg-gradient-to-r from-[#6b82df] to-[#8050af] p-5 text-white flex justify-between items-center rounded-t-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold border border-white/30 overflow-hidden shadow-inner">
                                    {selectedEnquiry.profileImage ? (
                                        <img src={selectedEnquiry.profileImage.startsWith('http') ? selectedEnquiry.profileImage : `${BASE_URL}${selectedEnquiry.profileImage}`} 
                                             alt="" className="w-full h-full object-cover" />
                                    ) : selectedEnquiry.firstName?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl leading-tight">{selectedEnquiry.firstName} {selectedEnquiry.surname}</h3>
                                    <div className="flex items-center gap-3 text-sm text-white/90 font-medium">
                                        <span className="flex items-center gap-1 opacity-90"><Phone size={12} /> {selectedEnquiry.mobile}</span>
                                        <span className="opacity-40">|</span>
                                        <span className="flex items-center gap-1 opacity-90"><Mail size={12} /> {selectedEnquiry.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="bg-white/20 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/10 backdrop-blur-sm">
                                    {selectedEnquiry.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-5 border-b bg-white">
                            <h2 className="text-lg font-bold text-gray-800">Add New Follow-up</h2>
                            <button onClick={() => setIsFollowUpModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 md:p-8 space-y-8 bg-white">
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
                                            className="w-full h-11 border border-gray-200 rounded-sm px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium" 
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 font-medium">When did this follow-up happen?</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-700">Next Follow-up Date & Time</label>
                                    <div className="relative">
                                        <input 
                                            type="datetime-local"
                                            value={followUpForm.nextFollowUpDate}
                                            onChange={(e) => setFollowUpForm({...followUpForm, nextFollowUpDate: e.target.value})}
                                            className="w-full h-11 border border-gray-200 rounded-sm px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium" 
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 font-medium">Schedule next follow-up (optional)</p>
                                </div>
                            </div>

                            {/* Response Options */}
                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-gray-700">Student Response <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 ${followUpForm.studentResponse === 'Interested' ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' : 'border-gray-100 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <input type="radio" name="response" value="Interested" checked={followUpForm.studentResponse === 'Interested'} onChange={(e) => setFollowUpForm({...followUpForm, studentResponse: e.target.value})} className="mt-1 flex-shrink-0 accent-primary" />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-xl">👍</span>
                                                    <span className="font-bold text-gray-900 text-[14px]">Interested</span>
                                                </div>
                                                <p className="text-[11px] text-gray-500 leading-normal font-medium">Student is interested and wants to proceed</p>
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 ${followUpForm.studentResponse === 'Call Back Later' ? 'border-amber-500 bg-amber-50/5 ring-1 ring-amber-500 shadow-sm' : 'border-gray-100 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <input type="radio" name="response" value="Call Back Later" checked={followUpForm.studentResponse === 'Call Back Later'} onChange={(e) => setFollowUpForm({...followUpForm, studentResponse: e.target.value})} className="mt-1 flex-shrink-0 accent-amber-500" />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-xl">🕒</span>
                                                    <span className="font-bold text-gray-900 text-[14px]">Call Back Later</span>
                                                </div>
                                                <p className="text-[11px] text-gray-500 leading-normal font-medium">Student needs time to think or discuss</p>
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 ${followUpForm.studentResponse === 'Not Interested' ? 'border-red-500 bg-red-50/5 ring-1 ring-red-500 shadow-sm' : 'border-gray-100 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <input type="radio" name="response" value="Not Interested" checked={followUpForm.studentResponse === 'Not Interested'} onChange={(e) => setFollowUpForm({...followUpForm, studentResponse: e.target.value})} className="mt-1 flex-shrink-0 accent-red-500" />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-xl">👎</span>
                                                    <span className="font-bold text-gray-900 text-[14px]">Not Interested</span>
                                                </div>
                                                <p className="text-[11px] text-gray-500 leading-normal font-medium">Student is not interested (will mark as lost)</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Details Textarea */}
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-gray-700">Conversation Details <span className="text-red-500">*</span></label>
                                <p className="text-xs font-bold text-gray-600 mb-2.5">What was discussed?</p>
                                <textarea 
                                    className="w-full h-36 border border-gray-200 rounded-sm p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none bg-white font-medium placeholder:text-gray-300" 
                                    placeholder="Describe the conversation, student's concerns, questions asked, information provided, etc."
                                    required
                                    value={followUpForm.conversationDetails}
                                    onChange={(e) => setFollowUpForm({...followUpForm, conversationDetails: e.target.value})}
                                ></textarea>
                                <p className="text-xs text-gray-400 mt-1 font-medium italic">Be specific about what was discussed for future reference</p>
                            </div>
                        </div>

                        <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                            <Button type="button" onClick={() => setIsFollowUpModalOpen(false)} className="bg-[#b45309] hover:bg-[#8e420b] text-white border-0 h-10 px-8 font-bold text-xs shadow-md rounded-sm transition-all active:scale-95">
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleSaveFollowUp} className="bg-[#1e463a] hover:bg-[#153229] text-white h-10 px-8 font-bold text-xs shadow-md rounded-sm flex items-center gap-2 transition-all active:scale-95">
                                <FileText size={16} /> Save Follow-up
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Assign Enquiry Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-[#1e3a8a] p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Users size={20} />
                                <h2 className="text-lg font-bold">Assign Enquiry</h2>
                            </div>
                            <button onClick={() => setIsAssignModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-4">
                            <div className="mb-4 text-sm text-gray-600">
                                Assign <span className="font-bold text-[#1e3a8a] italic">"{selectedEnquiry?.firstName} {selectedEnquiry?.surname}"</span> to:
                            </div>
                            
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <Input 
                                    placeholder="Search staff..." 
                                    className="pl-10 h-10"
                                    value={staffSearch}
                                    onChange={(e) => setStaffSearch(e.target.value)}
                                />
                            </div>

                            <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                {users.filter(u => u.fullName.toLowerCase().includes(staffSearch.toLowerCase())).map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleAssign(user.fullName)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-[#1e3a8a]">
                                                <User size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 text-sm">{user.fullName}</span>
                                                <span className="text-[10px] text-gray-500 uppercase">{user.designation || 'Staff'}</span>
                                            </div>
                                        </div>
                                        <div className={`h-2 w-2 rounded-full ${user.status !== false ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    </button>
                                ))}
                                {users.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 text-xs">No staff found</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 flex justify-end gap-2 border-t border-gray-100">
                            <Button variant="ghost" onClick={() => setIsAssignModalOpen(false)} className="h-9 px-4 text-xs">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

