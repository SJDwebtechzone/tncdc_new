import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, RotateCcw, UserCircle, ArrowLeft, Save, Trash2, Pencil, Eye, EyeOff, UserCheck } from "lucide-react";
import { fetchUsers, addUser, deleteUser, updateUser } from '../store/userSlice';
import { fetchRoles } from '../store/roleSlice';
import { BASE_URL } from '@/config';

const FIELD_STYLE = "h-9 rounded-sm border-gray-200 bg-white focus:border-blue-500 focus:ring-0 text-sm transition-all";
const LABEL_STYLE = "text-[11px] font-semibold text-[#1e3a8a] uppercase tracking-wider block mb-1";

const emptyForm = {
    email: '', password: '', confirmPassword: '',
    fullName: '', mobile: '', employeeId: '',
    dateOfJoining: '', department: '', designation: '',
    qualification: '', dateOfBirth: '', address: '',
    roles: [],
};

export default function ManageUsersPage() {
    const dispatch = useDispatch();
    const { users, status } = useSelector(s => s.users);
    const { roles } = useSelector(s => s.roles);

    const [view, setView] = useState('list');
    const [form, setForm] = useState(emptyForm);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchRoles());
    }, [dispatch]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRoleToggle = (roleName) => {
        setForm(prev => ({
            ...prev,
            roles: prev.roles.includes(roleName)
                ? prev.roles.filter(r => r !== roleName)
                : [...prev.roles, roleName]
        }));
    };

    const handleEdit = (user) => {
        setForm({
            ...emptyForm,
            ...user,
            password: '', // Don't pre-fill password for edit
            confirmPassword: '',
            roles: user.roles || [],
        });
        setEditingId(user.id);
        setPreviewUrl(user.profilePhoto ? `${BASE_URL}${user.profilePhoto}` : null);
        setView('add');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.email) return setError('Email is required.');
        if (!editingId && !form.password) return setError('Password is required.');
        if (form.password && form.password !== form.confirmPassword) return setError('Passwords do not match.');
        if (form.password && form.password.length < 8) return setError('Password must be at least 8 characters.');

        setSaving(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (k === 'confirmPassword') return;
            if (k === 'roles') fd.append(k, JSON.stringify(v));
            else fd.append(k, v);
        });
        if (selectedFile) fd.append('profilePhoto', selectedFile);

        let result;
        if (editingId) {
            result = await dispatch(updateUser({ id: editingId, formData: fd }));
        } else {
            result = await dispatch(addUser(fd));
        }
        
        setSaving(true);
        setSaving(false);

        if (addUser.fulfilled.match(result) || updateUser.fulfilled.match(result)) {
            setView('list');
            setForm(emptyForm);
            setEditingId(null);
            setSelectedFile(null);
            setPreviewUrl(null);
        } else {
            setError(result.payload || 'Failed to save user. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this user?')) dispatch(deleteUser(id));
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.fullName?.toLowerCase().includes(search.toLowerCase())
    );

    // ──────────────────────────── ADD FORM VIEW ────────────────────────────────
    if (view === 'add') {
        return (
            <div className="space-y-4 max-w-6xl">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#1e3a8a] p-2 rounded-lg">
                            <UserCheck size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
                            <p className="text-xs text-gray-400">{editingId ? 'Update the details for this user' : 'Fill in the details to create a new user account'}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => { setView('list'); setForm(emptyForm); setEditingId(null); setSelectedFile(null); setPreviewUrl(null); setError(''); }}
                        className="h-8 text-[11px] font-medium text-gray-600 border-gray-300 rounded-sm hover:bg-gray-50 flex items-center gap-1.5 px-3"
                    >
                        <ArrowLeft size={14} /> Back
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Account Credentials */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Email */}
                            <div>
                                <label className={LABEL_STYLE}>Email *</label>
                                <Input
                                    type="email"
                                    placeholder="employee@example.com"
                                    className={FIELD_STYLE}
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    required
                                />
                            </div>
                            {/* Password */}
                            <div>
                                <label className={LABEL_STYLE}>Password {editingId ? '(Leave blank to keep current)' : '*'}</label>
                                <div className="relative">
                                    <Input
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Min 8 chars"
                                        className={`${FIELD_STYLE} pr-9`}
                                        value={form.password}
                                        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPass(v => !v)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                            {/* Confirm Password */}
                            <div>
                                <label className={LABEL_STYLE}>Repeat Password *</label>
                                <div className="relative">
                                    <Input
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="Repeat password"
                                        className={`${FIELD_STYLE} pr-9`}
                                        value={form.confirmPassword}
                                        onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                            <UserCircle size={16} className="text-[#1e3a8a]" />
                            <h3 className="text-sm font-bold text-gray-700">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Full Name */}
                            <div className="md:col-span-2">
                                <label className={LABEL_STYLE}>Full Name *</label>
                                <Input
                                    placeholder="e.g. Rahul Sharma"
                                    className={FIELD_STYLE}
                                    value={form.fullName}
                                    onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                                />
                            </div>
                            {/* Mobile */}
                            <div>
                                <label className={LABEL_STYLE}>Mobile</label>
                                <Input
                                    placeholder="10-digit mobile"
                                    className={FIELD_STYLE}
                                    value={form.mobile}
                                    onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))}
                                    maxLength={10}
                                />
                            </div>
                            {/* Employee ID */}
                            <div>
                                <label className={LABEL_STYLE}>Employee ID</label>
                                <Input
                                    placeholder="EMP001"
                                    className={FIELD_STYLE}
                                    value={form.employeeId}
                                    onChange={e => setForm(p => ({ ...p, employeeId: e.target.value }))}
                                />
                            </div>

                            {/* Date of Joining */}
                            <div>
                                <label className={LABEL_STYLE}>Date of Joining</label>
                                <Input
                                    type="date"
                                    className={FIELD_STYLE}
                                    value={form.dateOfJoining}
                                    onChange={e => setForm(p => ({ ...p, dateOfJoining: e.target.value }))}
                                />
                            </div>
                            {/* Department */}
                            <div>
                                <label className={LABEL_STYLE}>Department</label>
                                <Input
                                    placeholder="e.g. Sales"
                                    className={FIELD_STYLE}
                                    value={form.department}
                                    onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                                />
                            </div>
                            {/* Designation */}
                            <div>
                                <label className={LABEL_STYLE}>Designation</label>
                                <Input
                                    placeholder="e.g. Senior Executive"
                                    className={FIELD_STYLE}
                                    value={form.designation}
                                    onChange={e => setForm(p => ({ ...p, designation: e.target.value }))}
                                />
                            </div>
                            {/* Qualification */}
                            <div>
                                <label className={LABEL_STYLE}>Qualification</label>
                                <Input
                                    placeholder="e.g. B.Com"
                                    className={FIELD_STYLE}
                                    value={form.qualification}
                                    onChange={e => setForm(p => ({ ...p, qualification: e.target.value }))}
                                />
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className={LABEL_STYLE}>Date of Birth</label>
                                <Input
                                    type="date"
                                    className={FIELD_STYLE}
                                    value={form.dateOfBirth}
                                    onChange={e => setForm(p => ({ ...p, dateOfBirth: e.target.value }))}
                                />
                            </div>
                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className={LABEL_STYLE}>Address</label>
                                <textarea
                                    placeholder="Residential address"
                                    rows={2}
                                    className="w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none transition-all"
                                    value={form.address}
                                    onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                                />
                            </div>
                            {/* Profile Photo */}
                            <div className="md:col-span-1">
                                <label className={LABEL_STYLE}>Profile Photo</label>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex items-center border border-gray-200 rounded-sm overflow-hidden h-9 bg-white flex-1 cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <span className="bg-gray-100 h-full px-3 text-[11px] font-bold border-r border-gray-200 text-gray-600 hover:bg-gray-200 transition-colors flex items-center">
                                            Choose File
                                        </span>
                                        <span className="px-3 text-[11px] text-gray-400 truncate">
                                            {selectedFile ? selectedFile.name : 'No file chosen'}
                                        </span>
                                    </div>
                                    {previewUrl && (
                                        <img src={previewUrl} alt="preview" className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assign Roles */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                            <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <h3 className="text-sm font-bold text-gray-700">Assign Roles</h3>
                        </div>
                        {roles.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No roles available. Create roles in Manage Roles first.</p>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {roles.map(role => (
                                    <label key={role.id} className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${form.roles.includes(role.name) ? 'bg-[#1e3a8a] border-[#1e3a8a]' : 'border-gray-300 group-hover:border-[#1e3a8a]'}`}
                                            onClick={() => handleRoleToggle(role.name)}>
                                            {form.roles.includes(role.name) && (
                                                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{role.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-sm text-sm flex items-center gap-2">
                            <span className="font-bold">!</span> {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pb-4">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-6 h-9 rounded-sm text-[11px] font-bold flex items-center gap-2 shadow-sm border-none uppercase tracking-wide disabled:opacity-60"
                        >
                            <Save size={13} />
                            {saving ? 'Saving...' : editingId ? 'Update Employee' : 'Save Employee'}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => { setView('list'); setForm(emptyForm); setEditingId(null); setSelectedFile(null); setPreviewUrl(null); setError(''); }}
                            className="text-[#c2410c] border border-[#f97316]/30 hover:bg-[#fff7ed] px-6 h-9 rounded-sm text-[11px] font-bold bg-white transition-colors uppercase tracking-wide"
                        >
                            <span className="mr-1.5">×</span> Cancel
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    // ──────────────────────────── LIST VIEW ───────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Users</h1>
                <Button
                    onClick={() => { setView('add'); setError(''); }}
                    className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-2 rounded-lg flex items-center gap-2 border-none transition-all transform active:scale-95 shadow-lg"
                >
                    <Plus size={18} /> Add User
                </Button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-8 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={16} />
                        </div>
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-9 h-10 bg-gray-50/50 border-gray-200 rounded-xl placeholder:text-gray-400 text-sm"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Button className="w-full bg-white hover:bg-gray-50 text-[#1e3a8a] border border-[#1e3a8a] h-10 rounded-xl font-bold transition-colors text-sm">
                            Search
                        </Button>
                    </div>
                    <div className="md:col-span-2">
                        <Button
                            variant="outline"
                            onClick={() => setSearch('')}
                            className="w-full text-[#c2410c] border-orange-200 hover:bg-orange-50 bg-[#fff7ed] h-10 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors text-sm"
                        >
                            <RotateCcw size={15} /> Reset
                        </Button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/60 hover:bg-gray-50/60 border-b border-gray-200">
                                {['#', 'Photo', 'Name', 'Email', 'Employee ID', 'Department', 'Roles', 'Joined', 'Actions'].map(h => (
                                    <TableHead key={h} className="font-bold text-gray-700 text-[11px] uppercase py-4 px-4 tracking-wider whitespace-nowrap">{h}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {status === 'loading' ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="py-16 text-center text-sm text-gray-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
                                            Loading users...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="bg-gray-50 p-5 rounded-3xl">
                                                <UserCircle size={44} className="text-gray-300" />
                                            </div>
                                            <p className="font-bold text-red-500 uppercase tracking-widest text-xs">No Data Available</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user, idx) => (
                                    <TableRow key={user.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
                                        <TableCell className="px-4 py-3 text-xs text-gray-500 font-medium">{idx + 1}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            {user.profilePhoto ? (
                                                <img
                                                    src={`${BASE_URL}${user.profilePhoto}`}
                                                    alt={user.fullName}
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center">
                                                    <UserCircle size={16} className="text-[#1e3a8a]" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{user.fullName || '—'}</TableCell>
                                        <TableCell className="px-4 py-3 text-sm text-gray-600">{user.email}</TableCell>
                                        <TableCell className="px-4 py-3 text-xs text-gray-500 font-mono">{user.employeeId || '—'}</TableCell>
                                        <TableCell className="px-4 py-3 text-xs text-gray-500">{user.department || '—'}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {(user.roles || []).length === 0 ? (
                                                    <span className="text-xs text-gray-400 italic">None</span>
                                                ) : (user.roles || []).map(r => (
                                                    <span key={r} className="px-2 py-0.5 text-[10px] font-bold bg-[#1e3a8a]/10 text-[#1e3a8a] rounded-full uppercase tracking-wide">
                                                        {r}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                            {user.dateOfJoining || (user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—')}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    title="Edit"
                                                    onClick={() => handleEdit(user)}
                                                    className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer row count */}
                {filteredUsers.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
                        Showing <span className="font-bold text-gray-700">{filteredUsers.length}</span> user{filteredUsers.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
}
