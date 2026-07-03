import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdmissions } from '@/store/admissionSlice';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Upload, History, Download, Search, Settings, ArrowRight, Lock, Edit, User as UserIcon, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/config';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function StudentListPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch admissions which represent our "Admitted Students"
    const admissions = useSelector((state) => state.admissions?.admissions || []);
    
    // Convert admissions to unique students map
    const admittedStudentsList = useMemo(() => {
        const uniqueStudentsMap = {};
        admissions.forEach(adm => {
            const email = adm.email || adm.enquiry?.email || `noemail-${adm.id}@tncdc.in`;
            
            // If student already exists, just bump their admission count
            if (uniqueStudentsMap[email]) {
                uniqueStudentsMap[email].totalAdmissions += 1;
            } else {
                const dobValue = adm.dob || adm.enquiry?.dob;
                uniqueStudentsMap[email] = {
                    id: adm.id,
                    name: `${adm.firstName || ''} ${adm.surname || ''}`.trim() || 'Unknown Student',
                    relationship: adm.fatherName ? `S/O ${adm.fatherName}` : 'S/O -',
                    mobile: adm.mobile || adm.enquiry?.mobile || '-', 
                    email: adm.email || adm.enquiry?.email || '-',
                    dob: dobValue ? new Date(dobValue).toLocaleDateString('en-IN') : '-',
                    referralCode: adm.referredBy || 'Direct',
                    walletBalance: 0,
                    status: adm.status || 'Active',
                    totalAdmissions: 1,
                    createdAt: adm.createdAt ? new Date(adm.createdAt).toLocaleDateString('en-IN') : '-',
                    profileImage: adm.enquiry?.profileImage || null
                };
            }
        });
        return Object.values(uniqueStudentsMap);
    }, [admissions]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    // Change Password Modal State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedStudentEmail, setSelectedStudentEmail] = useState('');
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        dispatch(fetchAdmissions());
    }, [dispatch]);

    useEffect(() => {
        setFilteredStudents(admittedStudentsList);
    }, [admittedStudentsList]);

    const handleSearch = () => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = admittedStudentsList.filter(student =>
            student.name.toLowerCase().includes(lowerQuery) ||
            (student.mobile && student.mobile.toLowerCase().includes(lowerQuery)) ||
            (student.email && student.email.toLowerCase().includes(lowerQuery))
        );
        setFilteredStudents(filtered);
    };

    const handleReset = () => {
        setSearchQuery('');
        setFilteredStudents(admittedStudentsList);
    };

    const handleOpenPasswordModal = (student) => {
        setSelectedStudentEmail(student.email);
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setIsPasswordModalOpen(true);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (passwordData.newPassword.length < 4) {
            toast.error("Password must be at least 4 characters.");
            return;
        }

        setIsUpdating(true);
        try {
            await axios.post(`${BASE_URL}/api/auth/change-student-password`, {
                email: selectedStudentEmail,
                newPassword: passwordData.newPassword
            });
            toast.success("Password updated successfully!");
            setIsPasswordModalOpen(false);
        } catch (err) {
            console.error('Update password error:', err);
            toast.error(err.response?.data?.error || "Failed to update password");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            <h1 className="text-xl font-bold text-gray-800">Manage Students (Admitted)</h1>

            {/* Header Actions */}
            <div className="flex justify-end gap-2">
                <Button onClick={() => navigate('/dashboard/students/list/add')} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white gap-2">
                    <Plus size={16} /> Add Student
                </Button>
                <Button className="bg-[#52525b] hover:bg-[#52525b]/90 text-white gap-2">
                    <Upload size={16} /> Import
                </Button>
                <Button className="bg-[#b45309] hover:bg-[#b45309]/90 text-white gap-2">
                    <History size={16} /> Import History
                </Button>
                <Button className="bg-[#065f46] hover:bg-[#065f46]/90 text-white gap-2">
                    <Download size={16} /> Export
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-6 relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <Input
                        className="pl-9 h-10 w-full"
                        placeholder="Search by name, mobile or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <div className="md:col-span-3">
                    <Button
                        variant="outline"
                        className="w-full h-10 border-blue-900 text-blue-900 hover:bg-blue-50"
                        onClick={handleSearch}
                    >
                        Submit
                    </Button>
                </div>
                <div className="md:col-span-3">
                    <Button
                        variant="outline"
                        className="w-full h-10 border-orange-200 text-orange-500 hover:bg-orange-50"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[50px] font-bold text-gray-800 text-xs uppercase">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase min-w-[200px]">Student Name</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Relationship</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase whitespace-nowrap">Profile Image</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Mobile</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Email</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase whitespace-nowrap">DOB</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase whitespace-nowrap">Referral Code</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Status</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase whitespace-nowrap">Total Admissions</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase whitespace-nowrap">Created At</TableHead>
                                <TableHead className="font-bold text-gray-800 text-xs uppercase">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <TableRow key={student.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <TableCell className="text-orange-500 font-medium">{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="text-blue-600 font-medium">{student.name}</div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 text-xs">{student.relationship}</TableCell>
                                        <TableCell>
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center font-bold">
                                                {student.profileImage ? (
                                                    <img 
                                                        src={student.profileImage.startsWith('http') ? student.profileImage : `${BASE_URL}${student.profileImage}`} 
                                                        alt="Profile" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (
                                                    <div className="bg-blue-100 text-blue-600 w-full h-full flex items-center justify-center">
                                                        <UserIcon size={16} />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 text-xs">{student.mobile}</TableCell>
                                        <TableCell className="text-blue-500 text-xs">{student.email}</TableCell>
                                        <TableCell className="text-gray-600 text-xs">{student.dob}</TableCell>
                                        <TableCell className="text-gray-600 text-xs">{student.referralCode}</TableCell>
                                        <TableCell>
                                            <div className="w-8 h-4 bg-[#1e3a8a] rounded-full relative cursor-pointer">
                                                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="bg-[#1e3a8a] text-white w-6 h-6 rounded flex items-center justify-center text-xs mx-auto font-bold shadow">
                                                {student.totalAdmissions}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-[10px] whitespace-nowrap">
                                            {student.createdAt}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" title="View Admissions" onClick={() => navigate(`/dashboard/students/admissions?email=${encodeURIComponent(student.email)}`)}><ArrowRight size={16} /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-cyan-500 hover:bg-cyan-50" title="Edit Student" onClick={() => navigate(`/dashboard/students/list/edit/${student.id}`)}><Edit size={16} /></Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-indigo-900 hover:bg-indigo-50"
                                                    onClick={() => handleOpenPasswordModal(student)}
                                                >
                                                    <Lock size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={12} className="text-center py-12 text-gray-500 text-sm">
                                        No admitted students found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
                            <button 
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                                <Input 
                                    value={selectedStudentEmail}
                                    readOnly
                                    className="bg-gray-50 border-gray-200 text-gray-500 font-medium h-10 select-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">New Password</label>
                                <Input 
                                    type="password"
                                    placeholder="Enter New Password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="border-gray-200 focus:ring-1 focus:ring-blue-900 h-10"
                                    required
                                    autoFocus
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Confirm Password</label>
                                <Input 
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="border-gray-200 focus:ring-1 focus:ring-blue-900 h-10"
                                    required
                                />
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="flex-1 bg-[#b9875a] hover:bg-[#a6764a] text-white border-none h-11 font-bold uppercase tracking-widest text-[11px]"
                                >
                                    Close
                                </Button>
                                <Button 
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 bg-[#1e3a8a] hover:bg-blue-900 text-white h-11 font-bold uppercase tracking-widest text-[11px]"
                                >
                                    {isUpdating ? "Updating..." : "Update"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}






