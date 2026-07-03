import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Search, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdmissions } from '@/store/admissionSlice';
import { BASE_URL } from '@/config';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function IdCardPrintPage() {
    const dispatch = useDispatch();
    const { admissions = [], loading } = useSelector((state) => state.admissions);
    const siteSettings = useSelector((state) => state.website.siteSettings);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        dispatch(fetchAdmissions());
    }, [dispatch]);

    const filteredAdmissions = admissions.filter(adm =>
        `${adm.firstName} ${adm.surname} ${adm.studentId} ${adm.mobile}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredAdmissions.map(a => a.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handlePrint = async (ids) => {
        if (ids.length === 0) {
            toast.error("Please select at least one student");
            return;
        }

        setIsPrinting(true);
        try {
            // 1. Fetch Template
            const response = await axios.get(`${BASE_URL}/api/background-images`);
            const bgTemplates = response.data;
            
            let idCardTemplate = bgTemplates.find(bg => {
                const title = bg.title.toLowerCase();
                return title.includes('id card') || title.includes('idcard') || title.includes('identity');
            });

            if (!idCardTemplate) {
                idCardTemplate = bgTemplates.find(bg => bg.type === 'PORTRAIT' && !bg.title.toLowerCase().includes('cert'));
            }

            if (!idCardTemplate) {
                toast.error("No ID Card template found. Please create one in backgrounds settings.");
                return;
            }

            const settings = idCardTemplate.designSettings || {};
            const isLandscape = idCardTemplate.type === 'LANDSCAPE';
            const cardWidthMm = isLandscape ? 86 : 54;
            const cardHeightMm = isLandscape ? 54 : 86;

            // 2. Prepare Print Window
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                toast.error("Popup blocked! Please allow popups for printing.");
                return;
            }

            const selectedAdmissions = admissions.filter(a => ids.includes(a.id));

            // Helper to generate a single card HTML
            const generateCardHtml = (admission) => {
                const renderField = (fieldId, value, isImage = false) => {
                    const fieldOpts = settings[fieldId];
                    if (!fieldOpts || !fieldOpts.visible) return '';

                    const textAlign = fieldOpts.textAlign || 'left';
                    const flexAlign = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';

                    return `
                        <div style="
                            position: absolute;
                            left: ${fieldOpts.x}%;
                            top: ${fieldOpts.y}%;
                            transform: translate(-50%, -50%);
                            font-size: calc(${fieldOpts.fontSize}px * var(--scale-factor, 1));
                            font-weight: ${fieldOpts.fontWeight};
                            width: ${isImage ? `calc(${fieldOpts.width}px * var(--scale-factor, 1))` : 'max-content'};
                            height: ${isImage ? `calc(${fieldOpts.height}px * var(--scale-factor, 1))` : 'auto'};
                            overflow: hidden;
                            display: flex;
                            align-items: center;
                            justify-content: ${flexAlign};
                            text-align: ${textAlign};
                            text-transform: ${fieldOpts.textTransform || 'none'};
                            white-space: nowrap;
                            color: #000;
                        ">
                            ${isImage ? (
                                value ? `<img src="${value}" style="width: 100%; height: 100%; object-fit: cover;" />` : 
                                `<div style="width: 100%; height: 100%; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 8px;">Photo</div>`
                            ) : `<span>${value}</span>`}
                        </div>
                    `;
                };

                return `
                    <div class="card-container" style="
                        position: relative;
                        width: ${cardWidthMm}mm;
                        height: ${cardHeightMm}mm;
                        background: white;
                        margin: 10mm auto;
                        box-shadow: 0 0 5px rgba(0,0,0,0.1);
                        overflow: hidden;
                        page-break-after: always;
                        --scale-factor: 0.35;
                    ">
                        <img src="${idCardTemplate.imageUrl}" style="width: 100%; height: 100%; display: block; object-fit: contain;" />
                        <div style="position: absolute; inset: 0;">
                            ${renderField('courseNameLabel', 'Course Name')}
                            ${renderField('firstNameLabel', 'First Name')}
                            ${renderField('fatherNameLabel', 'Father Name')}
                            ${renderField('surnameLabel', 'Surname')}
                            ${renderField('dobLabel', 'DOB')}
                            ${renderField('batchNameLabel', 'Batch Name')}
                            ${renderField('rollNumberLabel', 'Roll No')}
                            ${renderField('enrollmentNumberLabel', 'Enrollment No')}
                            ${renderField('mobileNumberLabel', 'Mobile No')}
                            ${renderField('referralCodeLabel', 'Ref Code')}

                            ${renderField('courseName', admission.courseName)}
                            ${renderField('firstName', `: ${admission.firstName}`)}
                            ${renderField('fatherName', `: ${admission.enquiry?.parentName || 'N/A'}`)}
                            ${renderField('surname', `: ${admission.surname}`)}
                            ${renderField('dob', `: ${admission.enquiry?.dob || 'N/A'}`)}
                            ${renderField('batchName', `: ${admission.batch || 'Gen'}`)}
                            ${renderField('rollNumber', `: N/A`)}
                            ${renderField('enrollmentNumber', `: ${admission.studentId}`)}
                            ${renderField('mobileNumber', `: ${admission.mobile}`)}
                            ${renderField('referralCode', `: ${admission.referralBy || 'N/A'}`)}

                            ${renderField('studentPhoto', admission.enquiry?.profileImage, true)}
                            ${renderField('qrCode', `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${(siteSettings.websiteUrl || window.location.origin).replace(/\/$/, '')}/student_verification?type=student&id=${admission.studentId}`)}`, true)}
                        </div>
                    </div>
                `;
            };

            const allCardsHtml = selectedAdmissions.map(adm => generateCardHtml(adm)).join('');

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Bulk ID Cards</title>
                        <style>
                            @page { size: auto; margin: 0; }
                            body { margin: 0; padding: 0; background: #f0f0f0; font-family: sans-serif; }
                            @media print {
                                body { background: white; }
                                .card-container { margin: 0 !important; box-shadow: none !important; }
                            }
                        </style>
                    </head>
                    <body>
                        ${allCardsHtml}
                        <script>
                            window.onload = () => {
                                setTimeout(() => {
                                    window.print();
                                    // window.close(); 
                                }, 500);
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();

        } catch (error) {
            console.error(error);
            toast.error("Failed to prepare cards for printing");
        } finally {
            setIsPrinting(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-medium text-gray-800">Bulk ID Card Information</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                {/* Filter / Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-1 gap-4 w-full">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                            <Input
                                placeholder="Search Name, ID, Mobile...."
                                className="pl-10 bg-gray-50 border-gray-200 shadow-none focus-visible:ring-blue-900"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 px-8 font-bold">Submit</Button>
                        <Button variant="outline" className="text-orange-400 border-orange-200 hover:bg-orange-50 px-8 font-bold" onClick={() => { setSearchQuery(""); setSelectedIds([]); }}>Reset</Button>
                    </div>
                    <Button 
                        onClick={() => handlePrint(selectedIds)}
                        disabled={selectedIds.length === 0 || isPrinting}
                        className="bg-[#14532d] hover:bg-[#14532d]/90 text-white gap-2 px-6 shadow-md transition-all active:scale-95 font-bold"
                    >
                        {isPrinting ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                        Print Selected (${selectedIds.length})
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-sm border border-gray-100 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[50px]">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 accent-blue-900 h-4 w-4"
                                        checked={selectedIds.length === filteredAdmissions.length && filteredAdmissions.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="w-[50px] font-bold text-gray-600 text-[10px] uppercase tracking-wider">#</TableHead>
                                <TableHead className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">Enrollment No</TableHead>
                                <TableHead className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">Student Name</TableHead>
                                <TableHead className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">Student Mobile</TableHead>
                                <TableHead className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">Student Profile</TableHead>
                                <TableHead className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">Course Name</TableHead>
                                <TableHead className="font-bold text-gray-600 text-[10px] uppercase tracking-wider text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-40 text-center text-gray-500">
                                        <Loader2 className="animate-spin mx-auto text-blue-900 mb-2" size={24} />
                                        <span className="text-sm font-medium">Fetching admitted students...</span>
                                    </TableCell>
                                </TableRow>
                            ) : filteredAdmissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-40 text-center text-gray-400 italic text-sm">
                                        No admitted students found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAdmissions.map((admission, index) => (
                                    <TableRow key={admission.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell>
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300 accent-blue-900 h-4 w-4"
                                                checked={selectedIds.includes(admission.id)}
                                                onChange={() => handleSelectOne(admission.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-gray-500 font-bold text-xs">{index + 1}</TableCell>
                                        <TableCell className="text-gray-900 font-bold text-xs">{admission.studentId}</TableCell>
                                        <TableCell className="text-blue-900 font-bold text-xs uppercase">{admission.firstName} {admission.surname}</TableCell>
                                        <TableCell className="text-gray-600 text-xs font-medium">{admission.mobile}</TableCell>
                                        <TableCell>
                                            <div className="w-10 h-10 bg-gray-50 rounded-full overflow-hidden border border-gray-100 flex items-center justify-center">
                                                {admission.enquiry?.profileImage ? (
                                                    <img src={admission.enquiry.profileImage} alt={admission.firstName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[10px] text-gray-300 font-bold italic">No Photo</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[#14532d] font-bold text-[11px]">{admission.courseName}</TableCell>
                                        <TableCell className="text-center">
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 gap-1.5 font-bold text-[11px] px-3"
                                                onClick={() => handlePrint([admission.id])}
                                            >
                                                <Printer size={14} /> Print
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}






