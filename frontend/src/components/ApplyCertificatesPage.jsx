import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileCheck, Clock, CheckCircle, AlertCircle, RefreshCcw, X, AlertTriangle, ExternalLink } from "lucide-react";
import axios from 'axios';
import { BASE_URL } from '@/config';
import toast from 'react-hot-toast';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

export default function ApplyCertificatesPage() {
    const navigate = useNavigate();
    const [admissions, setAdmissions] = useState([]);
    const [examResults, setExamResults] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingApproval, setPendingApproval] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [admRes, examRes, certRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/admissions`),
                axios.get(`${BASE_URL}/api/exam-results`),
                axios.get(`${BASE_URL}/api/certificates`)
            ]);
            setAdmissions(admRes.data);
            setExamResults(examRes.data);
            setCertificates(certRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data");
        }
    };

    const eligibleData = useMemo(() => {
        const flatData = [];
        admissions.forEach(adm => {
            const results = examResults.filter(r => r.admissionId === adm.id && r.isConfirmed);
            results.forEach(result => {
                const certificate = certificates.find(c => c.examResultId === result.id);
                flatData.push({ admission: adm, result, certificate });
            });
        });

        return flatData.filter(item => 
            item.admission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.admission.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.admission.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.admission.courseName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [admissions, examResults, certificates, searchTerm]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(eligibleData.map(item => `${item.admission.id}-${item.result.id}`));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const openConfirmModal = (item = null) => {
        setPendingApproval(item);
        setShowConfirmModal(true);
    };

    const handleApprove = async () => {
        try {
            setLoading(true);
            
            if (pendingApproval) {
                // Individual approval
                await axios.post(`${BASE_URL}/api/certificates`, {
                    admissionId: pendingApproval.admission.id,
                    examResultId: pendingApproval.result.id,
                    status: 'Approved',
                    remarks: `Approved for ${pendingApproval.result.semesterName}`
                });
            } else {
                // Bulk approval
                for (const id of selectedItems) {
                    const [admId, resId] = id.split('-');
                    await axios.post(`${BASE_URL}/api/certificates`, {
                        admissionId: admId,
                        examResultId: resId,
                        status: 'Approved',
                        remarks: "Bulk approved"
                    });
                }
            }
            
            toast.success("Certificate(s) approved successfully");
            setShowConfirmModal(false);
            setPendingApproval(null);
            setSelectedItems([]);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to approve");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Apply Certificates</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium italic tracking-tight">Manage final issuance and approval of student certificates</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    <Button variant="ghost" onClick={fetchData} className="h-9 px-4 rounded-lg text-gray-500 text-xs font-bold hover:bg-gray-50 uppercase gap-2">
                        <RefreshCcw size={14} /> Sync Data
                    </Button>
                </div>
            </div>

            {/* Selection Bar */}
            {selectedItems.length > 0 && (
                <div className="bg-[#4f46e5] text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-indigo-100 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-sm tracking-wide">{selectedItems.length} student{selectedItems.length > 1 ? 's' : ''} selected</span>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => openConfirmModal()} className="bg-white text-indigo-600 hover:bg-indigo-50 font-black text-xs px-6 rounded-xl gap-2 shadow-sm uppercase">
                            <CheckCircle size={14} /> Approve Certificate
                        </Button>
                        <Button onClick={() => setSelectedItems([])} variant="ghost" className="text-white hover:bg-white/10 font-bold text-xs uppercase px-4 rounded-xl">
                            <X size={14} /> Clear
                        </Button>
                    </div>
                </div>
            )}

            {/* Search Hub */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <Input
                            placeholder="Search by student name, ID or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 bg-gray-50/10 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 rounded-xl text-sm transition-all font-medium"
                        />
                    </div>
                    <Button variant="outline" onClick={() => setSearchTerm('')} className="h-12 px-6 rounded-xl border-gray-100 text-gray-400 font-bold text-xs uppercase hover:bg-gray-50 shadow-sm">
                        Reset
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/40 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-200/50">
                                <TableHead className="py-6 px-8 w-12">
                                    <input 
                                        type="checkbox" 
                                        onChange={handleSelectAll}
                                        checked={selectedItems.length === eligibleData.length && eligibleData.length > 0}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
                                    />
                                </TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6 w-12">#</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Certificate status</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Photo</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Student details</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Franchise</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Admission Info</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Created At</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6 text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {eligibleData.map((item, idx) => {
                                const { admission, result, certificate } = item;
                                const isSelected = selectedItems.includes(`${admission.id}-${result.id}`);
                                return (
                                    <TableRow key={`${admission.id}-${result.id}`} className={`group hover:bg-gray-50/50 transition-all border-b border-gray-50 last:border-0 ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                                        <TableCell className="py-6 px-8">
                                            <input 
                                                type="checkbox" 
                                                checked={isSelected}
                                                onChange={() => handleSelectItem(`${admission.id}-${result.id}`)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
                                            />
                                        </TableCell>
                                        <TableCell className="py-6 text-[11px] font-bold text-gray-400">
                                            {String(idx + 1).padStart(2, '0')}
                                        </TableCell>
                                        <TableCell className="py-6">
                                            {certificate ? (
                                                <Badge className={`w-fit font-bold text-[9px] uppercase tracking-wider ${
                                                    certificate.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                    {certificate.status}
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-slate-100 text-slate-500 font-bold text-[9px] uppercase tracking-wider">Pending</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 font-bold text-xs">
                                                {admission.firstName[0]}{admission.surname[0]}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex flex-col">
                                                <span className="font-black text-gray-800 text-sm leading-tight">{admission.firstName} {admission.surname}</span>
                                                <span className="text-[10px] font-bold text-gray-400 mt-0.5">({admission.studentId})</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <span className="text-xs font-bold text-gray-500 line-clamp-2 max-w-[200px]">Tamil Nadu career development council</span>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex flex-col text-[11px] font-bold text-gray-600">
                                                <span>{new Date(admission.admissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6 text-[11px] font-bold text-gray-400">
                                            {new Date(admission.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="py-6 text-center">
                                            <Button 
                                                onClick={() => openConfirmModal(item)}
                                                disabled={certificate?.status === 'Approved'}
                                                className={`h-9 px-6 rounded-xl text-[10px] font-black uppercase gap-2 transition-all shadow-lg active:scale-95 ${
                                                    certificate?.status === 'Approved' 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                                                    : 'bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-gray-200'
                                                }`}
                                            >
                                                {certificate?.status === 'Approved' ? 'Already Approved' : 'Approve Certificate'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
                        <button onClick={() => setShowConfirmModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                        
                        <div className="p-8 text-center pt-10">
                            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="text-orange-500" size={32} />
                            </div>
                            
                            <h2 className="text-xl font-black text-gray-900 mb-6 px-4">Certificate Approval Confirmation</h2>
                            
                            <div className="space-y-4 px-6">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    <span className="font-black text-red-500 uppercase tracking-wider block mb-1">Important Notice:</span>
                                    Once you approve the certificate, you <span className="font-bold text-gray-900 underline decoration-indigo-200 underline-offset-2">cannot change the marks</span> afterwards.
                                </p>
                                <p className="text-sm text-gray-500 italic font-medium pt-2 border-t border-gray-50">
                                    If you need to <span className="font-bold text-indigo-600">update marks</span>, please update them first before approving the certificate.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex items-center justify-center gap-3">
                            <Button 
                                variant="outline"
                                onClick={() => navigate('/dashboard/exams/marks')}
                                className="h-11 px-6 rounded-xl border-indigo-200 text-indigo-600 font-bold text-xs uppercase hover:bg-indigo-50 gap-2 flex-1"
                            >
                                <ExternalLink size={14} /> Update Marks
                            </Button>
                        </div>
                        
                        <div className="p-6 pt-2 flex gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowConfirmModal(false)}
                                className="h-12 flex-1 rounded-xl border-gray-200 text-gray-400 font-black text-xs uppercase hover:bg-gray-50 gap-2"
                            >
                                <X size={14} /> Cancel
                            </Button>
                            <Button 
                                onClick={handleApprove}
                                disabled={loading}
                                className="h-12 flex-[2] rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-black text-xs uppercase gap-2 shadow-lg shadow-blue-100"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        <CheckCircle size={14} /> Proceed with Approval
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
