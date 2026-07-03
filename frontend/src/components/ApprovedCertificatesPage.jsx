import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Info, Edit2, Box, RefreshCcw, FileText, PenTool, X, Award, Target, CheckCircle2, Trophy, Clock, GraduationCap, User } from "lucide-react";
import axios from 'axios';
import { BASE_URL } from '@/config';
import toast from 'react-hot-toast';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function ApprovedCertificatesPage() {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [institute, setInstitute] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Analysis Modal State
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [selectedCert, setSelectedCert] = useState(null);

    useEffect(() => {
        fetchData();
        fetchInstitute();
    }, []);

    const fetchInstitute = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/institute-profile`);
            setInstitute(res.data);
        } catch (err) {
            console.error("Failed to load institute profile", err);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/certificates`);
            // Only show approved ones
            setCertificates(res.data.filter(c => c.status === 'Approved'));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load approved certificates");
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        return certificates.filter(cert => 
            cert.admission?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.admission?.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.admission?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.admission?.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.certificateNo?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [certificates, searchTerm]);

    const handlePrintCertificate = async (cert) => {
        try {
            toast.loading("Preparing certificate...", { id: 'cert-print' });
            
            // 1. Fetch Template
            const response = await axios.get(`${BASE_URL}/api/background-images`);
            const bgTemplates = response.data;
            
            let template = bgTemplates.find(bg => {
                const title = bg.title.toLowerCase();
                return title.includes('cert') || title.includes('certificate');
            });

            if (!template) {
                toast.error("No Certificate template found. Please create one in backgrounds settings.", { id: 'cert-print' });
                return;
            }

            const settings = template.designSettings || {};
            const isLandscape = template.type === 'LANDSCAPE';
            
            // 2. Prepare Print Window
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                toast.error("Popup blocked! Please allow popups for printing.", { id: 'cert-print' });
                return;
            }

            const admission = cert.admission || {};
            const examResult = cert.examResult || {};
            const inst = institute || {};

            const fieldValues = {
                certificateNumber: cert.certificateNo || 'N/A',
                dateOfIssue: cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
                studentName: `${admission.firstName} ${admission.surname}`.toUpperCase(),
                courseName: admission.courseName?.toUpperCase() || 'N/A',
                courseDuration: admission.courseDuration || 'N/A', 
                coursePeriod: admission.batch || 'N/A',
                rollNumber: admission.studentId || 'N/A',
                enrollmentNumber: admission.studentId || 'N/A',
                gradePercentage: `${examResult.grade || 'N/A'} (${examResult.percentage || 0}%)`,
                atcName: inst.instituteName || "Tamil Nadu career development council",
                qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${(window.location.origin).replace(/\/$/, '')}/student_verification?type=certificate&id=${cert.certificateNo}`)}`,
                studentPhoto: admission.enquiry?.profileImage ? (admission.enquiry.profileImage.startsWith('http') ? admission.enquiry.profileImage : `${BASE_URL}${admission.enquiry.profileImage}`) : null,
                studentSignature: admission.enquiry?.signature ? (admission.enquiry.signature.startsWith('http') ? admission.enquiry.signature : `${BASE_URL}${admission.enquiry.signature}`) : null,
                controllerSignature: inst.controllerSignatureUrl ? (inst.controllerSignatureUrl.startsWith('http') ? inst.controllerSignatureUrl : `${BASE_URL}${inst.controllerSignatureUrl}`) : null,
                ownerSignature: inst.signatureUrl ? (inst.signatureUrl.startsWith('http') ? inst.signatureUrl : `${BASE_URL}${inst.signatureUrl}`) : null
            };

            const renderField = (fieldId) => {
                const fieldOpts = settings[fieldId];
                if (!fieldOpts || !fieldOpts.visible) return '';

                const isImage = ['qrCode', 'studentPhoto', 'studentSignature', 'controllerSignature', 'ownerSignature'].includes(fieldId);
                const value = fieldValues[fieldId];
                const textAlign = fieldOpts.textAlign || 'left';
                const flexAlign = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';

                return `
                    <div style="
                        position: absolute;
                        left: ${fieldOpts.x}%;
                        top: ${fieldOpts.y}%;
                        transform: translate(-50%, -50%);
                        font-size: ${fieldOpts.fontSize}px;
                        font-weight: ${fieldOpts.fontWeight};
                        width: ${isImage ? `${fieldOpts.width}px` : 'max-content'};
                        height: ${isImage ? `${fieldOpts.height}px` : 'auto'};
                        display: flex;
                        align-items: center;
                        justify-content: ${flexAlign};
                        text-align: ${textAlign};
                        text-transform: ${fieldOpts.textTransform || 'none'};
                        white-space: nowrap;
                        color: #000;
                        z-index: 10;
                        font-family: ${fieldId === 'studentName' ? 'Georgia, serif' : 'inherit'};
                    ">
                        ${isImage ? (
                            value ? `<img src="${value}" style="width: 100%; height: 100%; object-fit: contain;" />` : ''
                        ) : `<span>${value}</span>`}
                    </div>
                `;
            };

            const fieldsHtml = Object.keys(fieldValues).map(id => renderField(id)).join('');

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Certificate - ${fieldValues.studentName}</title>
                        <style>
                            @page { 
                                size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'}; 
                                margin: 0; 
                            }
                            html, body { 
                                margin: 0; 
                                padding: 0; 
                                width: ${isLandscape ? '297mm' : '210mm'};
                                height: ${isLandscape ? '210mm' : '297mm'};
                                background: #fff;
                            }
                            .cert-container {
                                position: relative;
                                width: 100%;
                                height: 100%;
                                background: white;
                                overflow: hidden;
                            }
                            .bg-img {
                                width: 100%;
                                height: 100%;
                                object-fit: fill;
                                display: block;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="cert-container">
                            <img src="${template.imageUrl}" class="bg-img" />
                            ${fieldsHtml}
                        </div>
                        <script>
                            window.onload = () => {
                                setTimeout(() => {
                                    window.print();
                                    window.close();
                                }, 1000);
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
            toast.success("Certificate ready for download", { id: 'cert-print' });

        } catch (error) {
            console.error(error);
            toast.error("Failed to generate certificate", { id: 'cert-print' });
        }
    };

    const handlePrintPerformanceCard = async (cert) => {
        try {
            toast.loading("Preparing performance card...", { id: 'card-print' });
            
            // 1. Fetch Template
            const response = await axios.get(`${BASE_URL}/api/background-images`);
            const bgTemplates = response.data;
            
            // Prioritize 'performance card' specifically, then fallback
            let template = bgTemplates.find(bg => bg.title.toLowerCase() === 'performance card') || 
                           bgTemplates.find(bg => bg.title.toLowerCase().includes('performance')) ||
                           bgTemplates.find(bg => bg.title.toLowerCase().includes('card'));

            if (!template) {
                toast.error("No 'Performance Card' template found in backgrounds.", { id: 'card-print' });
                return;
            }

            const settings = template.designSettings || {};
            const isLandscape = template.type === 'LANDSCAPE';
            
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                toast.error("Popup blocked!", { id: 'card-print' });
                return;
            }

            const admission = cert.admission || {};
            const examResult = cert.examResult || {};
            const inst = institute || {};

            const fieldValues = {
                studentName: `${admission.firstName} ${admission.surname}`.toUpperCase(),
                courseName: admission.courseName?.toUpperCase() || 'N/A',
                gradePercentage: `${examResult.grade || 'N/A'}`,
                percentage: `${examResult.percentage?.toFixed(0) || 0}%`,
                studentPhoto: admission.enquiry?.profileImage ? (admission.enquiry.profileImage.startsWith('http') ? admission.enquiry.profileImage : `${BASE_URL}${admission.enquiry.profileImage}`) : null,
                certificateNumber: cert.certificateNo || 'N/A',
                rollNumber: admission.studentId || 'N/A',
                atcName: inst.instituteName || "Tamil Nadu career development council",
                qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${(window.location.origin).replace(/\/$/, '')}/student_verification?type=certificate&id=${cert.certificateNo}`)}`
            };

            const renderField = (fieldId) => {
                const fieldOpts = settings[fieldId];
                if (!fieldOpts || !fieldOpts.visible) return '';

                const isImage = ['qrCode', 'studentPhoto'].includes(fieldId);
                const value = fieldValues[fieldId];
                const textAlign = fieldOpts.textAlign || 'left';
                const flexAlign = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';

                return `
                    <div style="
                        position: absolute;
                        left: ${fieldOpts.x}%;
                        top: ${fieldOpts.y}%;
                        transform: translate(-50%, -50%);
                        font-size: ${fieldOpts.fontSize}px;
                        font-weight: ${fieldOpts.fontWeight};
                        width: ${isImage ? `${fieldOpts.width}px` : 'max-content'};
                        height: ${isImage ? `${fieldOpts.height}px` : 'auto'};
                        display: flex;
                        align-items: center;
                        justify-content: ${flexAlign};
                        text-align: ${textAlign};
                        color: #000;
                        z-index: 10;
                    ">
                        ${isImage ? (
                            value ? `<img src="${value}" style="width: 100%; height: 100%; object-fit: contain;" />` : ''
                        ) : `<span>${value}</span>`}
                    </div>
                `;
            };

            const fieldsHtml = Object.keys(fieldValues).map(id => renderField(id)).join('');

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Performance Card - ${fieldValues.studentName}</title>
                        <style>
                            @page { size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'}; margin: 0; }
                            body { margin: 0; padding: 0; }
                            .container { position: relative; width: 100%; height: 100%; }
                            .bg { width: 100%; height: 100%; object-fit: fill; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src="${template.imageUrl}" class="bg" />
                            ${fieldsHtml}
                        </div>
                        <script>
                            window.onload = () => {
                                setTimeout(() => { window.print(); window.close(); }, 1000);
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
            toast.success("Performance card ready", { id: 'card-print' });

        } catch (err) {
            console.error(err);
            toast.error("Failed to generate performance card", { id: 'card-print' });
        }
    };

    const handleShowAnalysis = (cert) => {
        setSelectedCert(cert);
        setShowAnalysis(true);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Approved Certificates</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium italic tracking-tight">View and manage all successfully issued student certificates</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={() => navigate('/dashboard/backgrounds')}
                        variant="outline" 
                        className="h-10 px-4 rounded-xl text-blue-600 font-bold hover:bg-blue-50 border-blue-100 uppercase text-xs gap-2"
                    >
                        <PenTool size={14} /> Customize Layout
                    </Button>
                    <Button variant="outline" onClick={fetchData} className="h-10 px-4 rounded-xl text-gray-500 font-bold hover:bg-gray-50 border-gray-100 uppercase text-xs gap-2">
                        <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Sync
                    </Button>
                    <Button className="bg-[#1e463a] hover:bg-[#153229] text-white flex items-center gap-2 h-10 px-6 rounded-xl shadow-lg shadow-green-100 font-bold text-xs uppercase">
                        <Download size={16} /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Search Hub */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <Input
                            placeholder="Search by student name, ID, course or certificate number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 bg-gray-50/10 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-50 rounded-xl text-sm transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#f0f9ff] border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm shadow-blue-50/50">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-500 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
                        <Info size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-900 leading-tight">Certificate Management Portal</p>
                        <p className="text-xs text-gray-500 font-bold mt-1 max-w-md">
                            All students listed here have completed their exams and their certificates have been verified and approved by the administration.
                        </p>
                    </div>
                </div>
                <Button 
                    onClick={() => navigate('/dashboard/students/list')}
                    className="shrink-0 bg-[#0f172a] hover:bg-[#1e293b] text-white h-10 px-6 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-gray-200"
                >
                    <Edit2 size={14} /> Manage Students
                </Button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/40 border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-200/50">
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6 px-8 w-12 text-center">#</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Student details</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Course / Semester</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Franchise Name</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Admission Date</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Certificate No</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6">Issue Date</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[10px] uppercase tracking-widest py-6 text-center">Actions Coloumn</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((cert, idx) => (
                                    <TableRow key={cert.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50 last:border-0">
                                        <TableCell className="py-6 px-8 text-[11px] font-bold text-gray-400 text-center">
                                            {String(idx + 1).padStart(2, '0')}
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 font-black text-xs shrink-0">
                                                    {cert.admission?.enquiry?.profileImage ? (
                                                        <img 
                                                            src={cert.admission.enquiry.profileImage.startsWith('http') ? cert.admission.enquiry.profileImage : `${BASE_URL}${cert.admission.enquiry.profileImage}`} 
                                                            className="w-full h-full object-cover" 
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <span>{cert.admission?.firstName?.[0]}{cert.admission?.surname?.[0]}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-black text-gray-800 text-sm leading-tight truncate">{cert.admission?.firstName} {cert.admission?.surname}</span>
                                                    <span className="text-[10px] font-semibold text-gray-400 mt-0.5">ID: {cert.admission?.studentId}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-700">{cert.admission?.courseName}</span>
                                                <span className="text-[10px] font-bold text-indigo-500 mt-0.5 uppercase tracking-wider">{cert.examResult?.semesterName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <span className="text-xs font-bold text-gray-500 line-clamp-2 max-w-[150px]">
                                                {institute?.instituteName || "Tamil Nadu career development council"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <span className="text-[11px] font-bold text-gray-500">
                                                {cert.admission?.admissionDate ? new Date(cert.admission.admissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <code className="text-[11px] font-black bg-gray-50 text-gray-600 px-2 py-1 rounded-lg border border-gray-100">
                                                {cert.certificateNo || 'N/A'}
                                            </code>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <span className="text-[11px] font-bold text-gray-500">
                                                {cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-9 w-9 p-0 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all shadow-sm border border-green-100"
                                                    title="Course Certificate Download"
                                                    onClick={() => handlePrintCertificate(cert)}
                                                >
                                                    <Download size={14} />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-9 w-9 p-0 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-all shadow-sm border border-orange-100"
                                                    title="Result Analysis"
                                                    onClick={() => handleShowAnalysis(cert)}
                                                >
                                                    <RefreshCcw size={14} />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-9 w-9 p-0 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all shadow-sm border border-blue-100"
                                                    title="Update Students"
                                                    onClick={() => navigate(`/dashboard/students/admissions/edit/${cert.admission.id}`)}
                                                >
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-9 w-9 p-0 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition-all shadow-sm border border-purple-100"
                                                    title="Performance Card Download"
                                                    onClick={() => handlePrintPerformanceCard(cert)}
                                                >
                                                    <FileText size={14} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-32 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-700">
                                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                                                <Box size={40} className="text-slate-200" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-xl text-gray-300">No approved certificates</p>
                                                <p className="text-sm text-gray-400 font-medium italic">Approved student certificates will appear here automatically</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AnimatePresence>
                {showAnalysis && selectedCert && (
                    <ResultAnalysisModal 
                        certificate={selectedCert} 
                        onClose={() => setShowAnalysis(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

const ResultAnalysisModal = ({ certificate, onClose }) => {
    const admission = certificate.admission || {};
    const result = certificate.examResult || {};
    
    const subjectList = result.subjects ? result.subjects.split(',').map(s => s.trim()).filter(Boolean) : ["Core Subject"];

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overflow-x-hidden p-4 md:p-8 bg-black/60 backdrop-blur-sm py-12">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden z-10"
            >
                {/* Header */}
                <div className="bg-[#5c4cf4] p-6 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <RefreshCcw size={20} />
                        </div>
                        <h2 className="text-xl font-black tracking-tight uppercase">Examination Results</h2>
                    </div>
                    <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 md:p-10 space-y-10">
                    {/* Student Identity */}
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-[#5c4cf4] font-black text-2xl overflow-hidden shrink-0">
                            {admission.enquiry?.profileImage ? (
                                <img src={admission.enquiry.profileImage.startsWith('http') ? admission.enquiry.profileImage : `${BASE_URL}${admission.enquiry.profileImage}`} className="w-full h-full object-cover" />
                            ) : (
                                <span>{admission.firstName?.[0]}{admission.surname?.[0]}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900">{admission.firstName} {admission.surname}</h3>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                    <GraduationCap size={14} className="text-blue-500" /> {admission.courseName?.toUpperCase()} ({admission.studentId})
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                    <Box size={14} className="text-purple-500" /> {result.semesterName}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                    <Clock size={14} className="text-orange-500" /> {admission.batch || 'Afternoon'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Level */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <PerformanceMetric label="Total Marks" value={result.totalMarks} color="blue" icon={Target} />
                        <PerformanceMetric label="Obtained Marks" value={result.obtainedMarks} color="green" icon={CheckCircle2} />
                        <PerformanceMetric label="Overall Percentage" value={`${result.percentage.toFixed(0)}%`} color="orange" icon={Trophy} />
                        <PerformanceMetric label="Final Grade" value={result.grade} color="purple" icon={Award} />
                    </div>

                    {/* Table Sector */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <FileText size={18} className="text-gray-400" />
                            <h4 className="text-sm font-black text-gray-800 uppercase tracking-wider">Semester-wise Performance</h4>
                            <div className="h-px bg-indigo-100 flex-1"></div>
                        </div>

                        <div className="bg-[#f8faff] rounded-[2rem] border border-indigo-50/50 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#5c4cf4] text-white">
                                        <th className="py-4 px-8 text-[11px] font-black uppercase tracking-widest">{result.semesterName}</th>
                                        <th colSpan={4}></th>
                                    </tr>
                                    <tr className="bg-white/50 text-gray-400 border-b border-indigo-50">
                                        <th className="py-5 px-8 text-[11px] font-black uppercase tracking-widest">Subject</th>
                                        <th className="py-5 px-4 text-center text-[10px] font-black uppercase tracking-widest leading-tight">Theory<br/><span className="text-[8px] opacity-70">(T/O)</span></th>
                                        <th className="py-5 px-4 text-center text-[10px] font-black uppercase tracking-widest leading-tight">Practical<br/><span className="text-[8px] opacity-70">(T/O)</span></th>
                                        <th className="py-5 px-4 text-center text-[10px] font-black uppercase tracking-widest leading-tight">Total<br/><span className="text-[8px] opacity-70">(T/O)</span></th>
                                        <th className="py-5 px-8 text-center text-[11px] font-black uppercase tracking-widest">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjectList.map((subject, idx) => (
                                        <tr key={idx} className="bg-white border-b border-indigo-50/50 last:border-0 group hover:bg-indigo-50/30 transition-colors">
                                            <td className="py-5 px-8 text-sm font-bold text-gray-700">{subject}</td>
                                            <td className="py-5 px-4 text-center text-sm font-black text-gray-400">
                                                <span className="text-gray-900">{result.totalObjectiveMarks}</span>/{result.obtainedObjectiveMarks}
                                            </td>
                                            <td className="py-5 px-4 text-center text-sm font-black text-gray-400">
                                                <span className="text-gray-900">{result.totalPracticalMarks}</span>/{result.obtainedPracticalMarks}
                                            </td>
                                            <td className="py-5 px-4 text-center text-sm font-black text-gray-400">
                                                <span className="text-[#5c4cf4]">{result.totalMarks}</span>/{result.obtainedMarks}
                                            </td>
                                            <td className="py-5 px-8 text-center">
                                                <span className="text-sm font-black text-gray-900">{result.percentage.toFixed(0)}%</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Footer Summary Row */}
                                    <tr className="bg-white text-gray-900 border-t-2 border-indigo-50">
                                        <td className="py-6 px-8 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100">
                                                <span className="text-[14px] font-black">{result.totalMarks}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Marks</span>
                                        </td>
                                        <td className="py-6 px-4 text-center">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black">{result.obtainedMarks}</span>
                                                <span className="text-[8px] font-black text-gray-400 uppercase">Obtained</span>
                                            </div>
                                        </td>
                                        <td colSpan={2} className="py-6 px-4 text-center">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-[#5c4cf4]">{result.percentage.toFixed(0)}%</span>
                                                <span className="text-[8px] font-black text-gray-400 uppercase">Percentage</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-center">
                                            <div className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg shadow-green-100">
                                                <Trophy size={12} />
                                                <span className="text-[11px] font-black uppercase tracking-tighter">{result.grade} Grade</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const PerformanceMetric = ({ label, value, color, icon: Icon }) => {
    const colors = {
        blue: "text-blue-500 bg-blue-50/50 border-blue-100",
        green: "text-green-500 bg-green-50/50 border-green-100",
        orange: "text-orange-500 bg-orange-50/50 border-orange-100",
        purple: "text-purple-500 bg-purple-50/50 border-purple-100"
    };
    
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center justify-center text-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <p className="text-[20px] font-black text-gray-900 mb-1">{value}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        </div>
    );
};







