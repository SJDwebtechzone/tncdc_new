import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, RotateCcw, ArrowLeft, Save, Edit2, Trash2, X, Eye, CreditCard, Activity, CalendarDays, BookOpen, Wallet, CalendarRange } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser } from '@/store/userSlice';
import axios from 'axios';
import { BASE_URL, API_URL } from '@/config';
import StaffIDCardPreviewModal from './StaffIDCardPreviewModal';

export default function StaffListPage() {
    const dispatch = useDispatch();
    const { users, status } = useSelector((state) => state.users);
    const [view, setView] = useState('list');
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        mobile: '',
        employeeId: '',
        dateOfJoining: '',
        department: '',
        designation: '',
        qualification: '',
        dateOfBirth: '',
        address: '',
        emergencyContact: '',
        paidLeaveAllocation: 0,
        salaryMode: 'Monthly',
        basicSalary: 0,
        roles: ['STAFF']
    });
    const [editingId, setEditingId] = useState(null);
    const [viewingStaff, setViewingStaff] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
    const [idCardStaff, setIdCardStaff] = useState(null);
    const [staffStats, setStaffStats] = useState(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'roles') {
                data.append(key, JSON.stringify(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
        });

        if (editingId) {
            await dispatch(updateUser({ id: editingId, formData: data }));
        } else {
            await dispatch(addUser(data));
        }
        setView('list');
        resetForm();
    };

    const handleUserSelect = (userId) => {
        if (!userId) return;
        const u = users.find(x => x.id === parseInt(userId));
        if (u) {
            setFormData(prev => ({
                ...prev,
                email: u.email,
                fullName: u.fullName,
                mobile: u.mobile,
                employeeId: u.employeeId,
                dateOfJoining: u.dateOfJoining,
                department: u.department,
                designation: u.designation,
                qualification: u.qualification,
                dateOfBirth: u.dateOfBirth,
                address: u.address,
                emergencyContact: u.emergencyContact || '',
                paidLeaveAllocation: (u.paidLeaveAllocation !== undefined && u.paidLeaveAllocation !== null) ? u.paidLeaveAllocation : 12,
                salaryMode: u.salaryMode || 'Monthly',
                basicSalary: u.basicSalary || 0
            }));
            setEditingId(u.id);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            fullName: '',
            mobile: '',
            employeeId: '',
            dateOfJoining: '',
            department: '',
            designation: '',
            qualification: '',
            dateOfBirth: '',
            address: '',
            emergencyContact: '',
            paidLeaveAllocation: 12,
            salaryMode: 'Monthly',
            basicSalary: 0,
            roles: ['STAFF']
        });
        setEditingId(null);
    };

    const handleEdit = (user) => {
        setFormData({
            email: user.email,
            password: '', 
            fullName: user.fullName,
            mobile: user.mobile,
            employeeId: user.employeeId,
            dateOfJoining: user.dateOfJoining,
            department: user.department,
            designation: user.designation,
            qualification: user.qualification,
            dateOfBirth: user.dateOfBirth,
            address: user.address,
            emergencyContact: user.emergencyContact || '',
            paidLeaveAllocation: (user.paidLeaveAllocation !== undefined && user.paidLeaveAllocation !== null) ? user.paidLeaveAllocation : 12,
            salaryMode: user.salaryMode || 'Monthly',
            basicSalary: user.basicSalary || 0,
            status: user.status !== false,
            roles: user.roles || ['STAFF']
        });
        setEditingId(user.id);
        setView('add');
    };

    const handleView = async (user) => {
        setViewingStaff(user);
        setIsViewModalOpen(true);
        setIsLoadingStats(true);
        setStaffStats(null);
        try {
            const response = await axios.get(`${API_URL}/users/${user.id}/stats`);
            setStaffStats(response.data);
        } catch (error) {
            console.error('Error fetching staff stats:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    const handleViewIdCard = (user) => {
        setIdCardStaff(user);
        setIsIdCardModalOpen(true);
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === false ? true : false;
        const data = new FormData();
        Object.keys(user).forEach(key => {
            if (key === 'roles') {
                data.append(key, JSON.stringify(user[key]));
            } else if (key === 'status') {
                data.append(key, newStatus);
            } else if (user[key] !== null && key !== 'profilePhoto') {
                data.append(key, user[key]);
            }
        });
        await dispatch(updateUser({ id: user.id, formData: data }));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            dispatch(deleteUser(id));
        }
    };

    const filteredUsers = users.filter(u => 
        u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.mobile?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (view === 'add') {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-medium text-gray-800 tracking-tight">{editingId ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
                        <Button
                            variant="outline"
                            onClick={() => { setView('list'); resetForm(); }}
                            className="h-9 text-[11px] font-bold text-white border-none bg-[#b9875a] hover:bg-[#a6764a] rounded-sm flex items-center gap-1.5 px-4 uppercase tracking-widest shadow-sm"
                        >
                            <ArrowLeft size={16} /> Back to List
                        </Button>
                    </div>

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-800 border-b pb-2 tracking-tight">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Select User <span className="text-red-500">*</span></label>
                                    <select 
                                        className="w-full h-10 rounded-sm border border-gray-200 text-xs px-3 focus:ring-1 focus:ring-blue-500 outline-none bg-white transition-all font-sans"
                                        onChange={(e) => handleUserSelect(e.target.value)}
                                        value={editingId || ""}
                                    >
                                        <option value="">Select User</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.fullName || u.email}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Staff Name <span className="text-red-500">*</span></label>
                                    <Input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Staff Name" required className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 font-sans" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Employee ID</label>
                                    <Input name="employeeId" value={formData.employeeId} onChange={handleInputChange} placeholder="Employee ID" className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 font-sans" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Mobile</label>
                                    <Input name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile" className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 font-sans" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Emergency Contact</label>
                                    <Input name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Emergency Contact" className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 font-sans" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Date of Joining</label>
                                    <Input name="dateOfJoining" type="date" value={formData.dateOfJoining} onChange={handleInputChange} className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 font-sans" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Date of Birth</label>
                                    <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 font-sans" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Department</label>
                                    <Input name="department" value={formData.department} onChange={handleInputChange} placeholder="Department" className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 font-sans" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Designation</label>
                                    <Input name="designation" value={formData.designation} onChange={handleInputChange} placeholder="Designation" className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 font-sans" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Qualification</label>
                                    <Input name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="Qualification" className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 font-sans" />
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Paid Leave Yearly Allocation</label>
                                    <Input name="paidLeaveAllocation" type="number" value={formData.paidLeaveAllocation} onChange={handleInputChange} className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 font-sans" />
                                </div>
                            </div>
                            <div className="space-y-1.5 mt-6">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Address"
                                    className="w-full h-24 rounded-sm border border-gray-200 p-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white resize-none font-sans"
                                />
                            </div>
                        </div>

                        {/* Salary Configuration Section */}
                        <div className="space-y-6 pt-6">
                            <h3 className="text-sm font-bold text-gray-800 border-b pb-2 tracking-tight">Salary Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Salary Mode <span className="text-red-500">*</span></label>
                                    <select 
                                        name="salaryMode"
                                        value={formData.salaryMode}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full h-10 rounded-sm border border-gray-200 text-xs px-3 focus:ring-1 focus:ring-blue-500 outline-none bg-white transition-all font-sans"
                                    >
                                        <option value="">Select Salary Mode</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Daily">Daily</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Basic Salary (₹) <span className="text-red-500">*</span></label>
                                    <Input 
                                        name="basicSalary" 
                                        type="number" 
                                        value={formData.basicSalary} 
                                        onChange={handleInputChange} 
                                        placeholder="0.00" 
                                        required 
                                        className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 font-sans" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-8 border-t">
                            <Button
                                type="submit"
                                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-8 h-10 rounded-sm text-[11px] font-bold flex items-center gap-2 shadow-sm border-none uppercase tracking-widest transition-all active:scale-95"
                            >
                                <Save size={16} />
                                {editingId ? 'Update Staff Member' : 'Save Staff Member'}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => { setView('list'); resetForm(); }}
                                className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-8 h-10 rounded-sm text-[11px] font-bold border-none transition-all uppercase tracking-widest shadow-sm active:scale-95 flex items-center gap-2"
                            >
                                <X size={16} /> Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 font-sans tracking-tight">Staff List</h1>
                <Button
                    onClick={() => { resetForm(); setView('add'); }}
                    className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-2 rounded-lg flex items-center gap-2 border-none transition-all transform active:scale-95 shadow-lg"
                >
                    <Plus size={18} />
                    Add Staff Member
                </Button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-5 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={18} />
                        </div>
                        <Input
                            placeholder="Search by name, employee ID, or mobile..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 bg-gray-50/50 border-gray-200 rounded-xl placeholder:text-gray-400 text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-200">
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 px-6 tracking-wider border-r border-gray-100">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Employee ID</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Staff Name</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Department</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Designation</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[13px] py-5 px-4 tracking-tight border-r border-gray-100">Mobile</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[13px] py-5 px-4 tracking-tight border-r border-gray-100">Salary Mode</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[13px] py-5 px-4 tracking-tight border-r border-gray-100 text-center">Status</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[13px] py-5 px-4 tracking-tight border-r border-gray-100">Date of Joining</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[13px] py-5 px-4 tracking-tight text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {status === 'loading' ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="py-24 text-center text-gray-400 font-medium font-sans animate-pulse">
                                        Loading staff members...
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="py-24 text-center text-gray-400 font-medium font-sans">
                                        No staff members found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="py-4 px-6 font-medium text-gray-500 border-r border-gray-100 text-xs">{index + 1}</TableCell>
                                        <TableCell className="py-4 border-r border-gray-100 px-4 text-xs">{user.employeeId || '-'}</TableCell>
                                        <TableCell className="py-4 border-r border-gray-100 px-4 font-bold text-gray-700 text-xs">{user.fullName}</TableCell>
                                        <TableCell className="py-4 border-r border-gray-100 px-4 text-xs">{user.department || '-'}</TableCell>
                                        <TableCell className="py-4 border-r border-gray-100 px-4 text-xs font-semibold text-blue-600">{user.designation || '-'}</TableCell>
                                        <TableCell className="py-4 border-r border-gray-100 px-4 text-xs font-medium text-gray-700">{user.mobile || '-'}</TableCell>
                                        <TableCell className="py-4 border-r border-gray-100 px-4">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-600/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                                {user.salaryMode || 'Monthly'} fixed
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 border-r border-gray-100 px-4 text-center">
                                            <div 
                                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(user); }}
                                                className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out shadow-inner ${user.status !== false ? 'bg-[#002b5b]' : 'bg-gray-200'}`}
                                            >
                                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${user.status !== false ? 'translate-x-[26px]' : 'translate-x-[2px]'}`} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 border-r border-gray-100 px-4 text-xs text-gray-700 font-bold">{user.dateOfJoining || '-'}</TableCell>
                                        <TableCell className="py-4 px-4">
                                                <button onClick={() => handleView(user)} className="h-10 w-12 text-[#1e293b] border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm active:scale-95" title="View">
                                                    <Eye size={18} />
                                                </button>
                                                <button onClick={() => handleViewIdCard(user)} className="h-10 w-12 text-[#b28c64] border border-[#b28c64]/30 rounded-md flex items-center justify-center hover:bg-[#b28c64]/10 transition-all shadow-sm active:scale-95" title="ID Card">
                                                    <CreditCard size={18} />
                                                </button>
                                                <button onClick={() => handleEdit(user)} className="h-10 w-12 text-[#1034a6] border border-[#1034a6]/30 rounded-md flex items-center justify-center hover:bg-[#1034a6]/10 transition-all shadow-sm active:scale-95" title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(user.id)} className="h-10 w-12 text-red-600 border border-red-100 rounded-md flex items-center justify-center hover:bg-red-50 transition-all shadow-sm active:scale-95" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {/* Staff Details View Modal */}
            {isViewModalOpen && viewingStaff && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 sm:py-8 overflow-hidden">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-full flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-5 border-b bg-gray-50/50 flex-none z-10">
                            <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2 uppercase">
                                <Eye className="text-blue-600" size={20} />
                                Staff Member Full Profile
                            </h2>
                            <button 
                                onClick={() => setIsViewModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800"
                            >
                                <X size={22} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                {/* Profile Information Sidebar */}

                                <div className="md:col-span-4 space-y-6 flex flex-col items-center border-r border-gray-100 pr-4">
                                    <div className="h-48 w-48 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shadow-inner group">
                                        {viewingStaff.profilePhoto ? (
                                            <img 
                                                src={viewingStaff.profilePhoto} 
                                                alt={viewingStaff.fullName} 
                                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="text-gray-400 flex flex-col items-center gap-3">
                                                <div className="h-20 w-20 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shadow-sm">
                                                    <span className="text-3xl font-bold text-blue-600 font-sans">{viewingStaff.fullName?.charAt(0)}</span>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No Profile Photo Uploaded</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center w-full">
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">{viewingStaff.fullName}</h3>
                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-2 bg-blue-50 py-1.5 px-3 rounded-full inline-block border border-blue-100">{viewingStaff.designation || 'Staff Member'}</p>
                                        <div className="mt-5 block text-center">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Employee Reference</div>
                                            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 text-gray-700 text-xs font-bold border border-gray-100 shadow-sm leading-none tabular-nums">
                                                ID: {viewingStaff.employeeId || 'NOT ASSIGNED'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Information Grid */}
                                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                                    <div className="col-span-full border-b border-gray-100 pb-3 mb-2">
                                        <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-600 shadow-sm shadow-blue-200" />
                                            Communication & Identity
                                        </h4>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Official Email Address</label>
                                        <p className="text-sm font-bold text-gray-800 break-words font-sans">{viewingStaff.email || '—'}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Contact Number</label>
                                        <p className="text-sm font-bold text-gray-800 tabular-nums font-sans">{viewingStaff.mobile || '—'}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Emergency Contact</label>
                                        <p className="text-sm font-bold text-red-600 tabular-nums font-sans">{viewingStaff.emergencyContact || '—'}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Date of Birth</label>
                                        <p className="text-sm font-bold text-gray-800 tabular-nums font-sans">{viewingStaff.dateOfBirth || '—'}</p>
                                    </div>
                                    
                                    <div className="col-span-full border-b border-gray-100 pb-3 mb-2 mt-4">
                                        <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-sm shadow-indigo-200" />
                                            Employment & Academic
                                        </h4>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Department</label>
                                        <p className="text-sm font-bold text-gray-800 font-sans">{viewingStaff.department || '—'}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Highest Qualification</label>
                                        <p className="text-sm font-bold text-gray-800 font-sans">{viewingStaff.qualification || '—'}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Date of Joining</label>
                                        <p className="text-sm font-bold text-gray-800 tabular-nums font-sans">{viewingStaff.dateOfJoining || '—'}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Paid Leave (Yearly)</label>
                                        <p className="text-sm font-bold text-gray-800 font-sans">{viewingStaff.paidLeaveAllocation || 0} Working Days</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Salary Mode</label>
                                        <div className="mt-1">
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-lg bg-gray-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                                                {viewingStaff.salaryMode || 'Monthly'} fixed
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Membership Status</label>
                                        <div className="mt-1">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border shadow-sm ${viewingStaff.status !== false ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                {viewingStaff.status !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-span-full space-y-1.5 mt-4">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Full Permanent Address</label>
                                        <p className="text-sm font-bold text-gray-700 leading-relaxed font-sans bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line">{viewingStaff.address || 'Address not provided'}</p>
                                    </div>
                                    
                                    {/* Dashboard Statistics Panel */}
                                    <div className="col-span-full border-t border-gray-100 pt-6 mt-4">
                                        <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-3 mb-6">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                                            Professional Overview
                                        </h4>
                                        
                                        {isLoadingStats ? (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="h-24 bg-gray-50 rounded-xl border border-gray-100" />
                                                ))}
                                            </div>
                                        ) : staffStats ? (
                                            <div className="space-y-8">
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100/50 shadow-sm">
                                                        <div className="flex items-center gap-3 text-indigo-600 mb-2">
                                                            <CalendarDays size={18} />
                                                            <h5 className="text-[10px] font-bold uppercase tracking-widest">Attendance</h5>
                                                        </div>
                                                        <p className="text-2xl font-bold text-gray-900 font-sans">{staffStats.totalAttendance}</p>
                                                        <p className="text-[10px] text-gray-400 font-semibold mt-1">Days Present</p>
                                                    </div>
                                                    
                                                    <div className="bg-gradient-to-br from-rose-50 to-white p-4 rounded-xl border border-rose-100/50 shadow-sm">
                                                        <div className="flex items-center gap-3 text-rose-600 mb-2">
                                                            <CalendarRange size={18} />
                                                            <h5 className="text-[10px] font-bold uppercase tracking-widest">Leaves</h5>
                                                        </div>
                                                        <p className="text-2xl font-bold text-gray-900 font-sans">{staffStats.totalLeaves}</p>
                                                        <p className="text-[10px] text-gray-400 font-semibold mt-1">Leave Records</p>
                                                    </div>
                                                    
                                                    <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100/50 shadow-sm">
                                                        <div className="flex items-center gap-3 text-amber-600 mb-2">
                                                            <BookOpen size={18} />
                                                            <h5 className="text-[10px] font-bold uppercase tracking-widest">Lectures</h5>
                                                        </div>
                                                        <p className="text-2xl font-bold text-gray-900 font-sans">{staffStats.totalLectures}</p>
                                                        <p className="text-[10px] text-gray-400 font-semibold mt-1">Classes Handled</p>
                                                    </div>
                                                    
                                                    <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-100/50 shadow-sm">
                                                        <div className="flex items-center gap-3 text-emerald-600 mb-2">
                                                            <Wallet size={18} />
                                                            <h5 className="text-[10px] font-bold uppercase tracking-widest">Salary</h5>
                                                        </div>
                                                        <p className="text-2xl font-bold text-gray-900 font-sans">{staffStats.totalSalaryRecords}</p>
                                                        <p className="text-[10px] text-gray-400 font-semibold mt-1">Payments Made</p>
                                                    </div>
                                                </div>

                                                {/* Recent Salary Records */}
                                                <div>
                                                    <h5 className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <Activity size={16} className="text-gray-400" /> Recent Salary Disbursals
                                                    </h5>
                                                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
                                                                    <TableHead className="font-bold text-gray-600 text-[10px] uppercase py-3 border-r border-gray-100">Month/Year</TableHead>
                                                                    <TableHead className="font-bold text-gray-600 text-[10px] uppercase py-3 border-r border-gray-100">Gross</TableHead>
                                                                    <TableHead className="font-bold text-gray-600 text-[10px] uppercase py-3 border-r border-gray-100 text-red-600">Deductions</TableHead>
                                                                    <TableHead className="font-bold text-gray-900 text-[10px] uppercase py-3 border-r border-gray-100">Net Paid</TableHead>
                                                                    <TableHead className="font-bold text-gray-600 text-[10px] uppercase py-3 text-center">Status</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {staffStats.recentSalaries.length > 0 ? (
                                                                    staffStats.recentSalaries.map(salary => (
                                                                        <TableRow key={salary.id} className="hover:bg-gray-50/50">
                                                                            <TableCell className="py-3 px-4 text-xs font-semibold text-gray-700 border-r border-gray-50">{salary.month} {salary.year}</TableCell>
                                                                            <TableCell className="py-3 px-4 text-xs border-r border-gray-50 font-sans tabular-nums">₹{salary.grossSalary}</TableCell>
                                                                            <TableCell className="py-3 px-4 text-xs text-red-600 border-r border-gray-50 font-sans tabular-nums">₹{salary.deductions}</TableCell>
                                                                            <TableCell className="py-3 px-4 text-xs font-bold text-emerald-700 border-r border-gray-50 font-sans tabular-nums">₹{salary.netSalary}</TableCell>
                                                                            <TableCell className="py-3 px-4 text-center">
                                                                                <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-wider">
                                                                                    {salary.status}
                                                                                </span>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                ) : (
                                                                    <TableRow>
                                                                        <TableCell colSpan={5} className="py-8 text-center text-[11px] text-gray-400 font-medium">
                                                                            No salary records available for this member
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center text-[11px] text-gray-400 font-medium bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                Failed to load statistics
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-gray-50 border-t flex justify-end gap-3 shadow-inner">
                            <Button 
                                onClick={() => { setIsViewModalOpen(false); handleViewIdCard(viewingStaff); }}
                                className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-8 h-11 rounded-lg text-[11px] font-bold border-none transition-all uppercase tracking-widest shadow-lg active:scale-95 flex items-center gap-2"
                            >
                                <CreditCard size={18} /> View ID Card
                            </Button>
                            <Button 
                                onClick={() => setIsViewModalOpen(false)}
                                className="bg-[#1e3a8a] hover:bg-[#1a3275] text-white px-8 h-11 rounded-lg text-[11px] font-bold border-none transition-all uppercase tracking-widest shadow-lg active:scale-95"
                            >
                                Close Profile
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Staff ID Card Modal */}
            {isIdCardModalOpen && idCardStaff && (
                <StaffIDCardPreviewModal 
                    staff={idCardStaff} 
                    onClose={() => setIsIdCardModalOpen(false)} 
                />
            )}
        </div>
    );
}






