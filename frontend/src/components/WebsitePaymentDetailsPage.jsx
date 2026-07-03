import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, CreditCard, X, Landmark, Smartphone, QrCode, Search, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from 'react-redux';
import { fetchPaymentDetails, createPaymentDetail, updatePaymentDetail, deletePaymentDetail } from '@/store/paymentDetailSlice';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '@/config';

export default function WebsitePaymentDetailsPage() {
    const { details: paymentDetails, status, error } = useSelector((state) => state.paymentDetails);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState('bank');

    const [formData, setFormData] = useState({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        branchName: '',
        upiId: '',
        qrImageUrl: '',
        status: true
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(fetchPaymentDetails());
    }, [dispatch]);

    const paymentTypes = [
        {
            id: 'bank',
            title: 'Bank Account',
            description: 'Add bank account details for traditional transfers',
            icon: <Landmark className="w-5 h-5" />
        },
        {
            id: 'upi',
            title: 'UPI ID',
            description: 'Add UPI ID for instant digital payments',
            icon: <Smartphone className="w-5 h-5" />
        },
        {
            id: 'qr',
            title: 'QR Code',
            description: 'Upload QR code image for easy scanning',
            icon: <QrCode className="w-5 h-5" />
        }
    ];

    const handleOpenModal = (detail = null) => {
        if (detail) {
            setEditingId(detail.id);
            setSelectedType(detail.type);
            setFormData({
                accountHolderName: detail.accountHolderName || '',
                bankName: detail.bankName || '',
                accountNumber: detail.accountNumber || '',
                ifscCode: detail.ifscCode || '',
                branchName: detail.branchName || '',
                upiId: detail.upiId || '',
                qrImageUrl: detail.qrImageUrl || '',
                status: detail.status !== false
            });
        } else {
            setEditingId(null);
            setSelectedType('bank');
            setFormData({
                accountHolderName: '',
                bankName: '',
                accountNumber: '',
                ifscCode: '',
                branchName: '',
                upiId: '',
                qrImageUrl: '',
                status: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const dataToSave = { ...formData, type: selectedType };

        try {
            if (editingId) {
                await dispatch(updatePaymentDetail({ id: editingId, data: dataToSave })).unwrap();
                toast.success("Payment details updated successfully");
            } else {
                await dispatch(createPaymentDetail(dataToSave)).unwrap();
                toast.success("Payment details added successfully");
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove these payment details?")) {
            try {
                await dispatch(deletePaymentDetail(id)).unwrap();
                toast.success("Deleted successfully");
            } catch (err) {
                toast.error(err);
            }
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const loadingToast = toast.loading("Uploading QR code...");
            const fd = new FormData();
            fd.append('file', file);
            try {
                const res = await fetch(`${BASE_URL}/api/profile/upload`, {
                    method: 'POST',
                    body: fd
                });
                const data = await res.json();
                setFormData(prev => ({ ...prev, qrImageUrl: data.fileUrl }));
                toast.dismiss(loadingToast);
                toast.success("QR Code uploaded");
            } catch (err) {
                console.error("Upload failed", err);
                toast.dismiss(loadingToast);
                toast.error("Upload failed");
            }
        }
    };

    const filteredDetails = paymentDetails.filter(detail =>
        detail.accountHolderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        detail.bankName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        detail.upiId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        detail.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 font-sans relative pb-10 pt-4">

            <div className="px-6 space-y-4">
                <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                    {/* Management Header */}
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/10">
                        <div className="space-y-1">
                            <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                                Manage Payment Details
                            </h2>
                            <p className="text-[11px] text-gray-500 font-medium italic">Configure how students and staff see your payment information.</p>
                        </div>
                        <Button
                            onClick={() => handleOpenModal()}
                            className="bg-[#154c4c] hover:bg-[#0f3838] text-white gap-2 rounded-sm px-6 h-10 text-[11px] font-bold transition-all border-none uppercase tracking-wider"
                        >
                            <Plus size={16} /> Add New Payment Detail
                        </Button>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <Input 
                                    placeholder="Search by name, bank or UPI..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10 text-xs border-gray-200"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-sm border border-gray-200 shadow-sm">
                            <Table className="border-collapse w-full">
                                <TableHeader>
                                    <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-200">
                                        <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-center w-12">#</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Type</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Account Holder / ID</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Details</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-center">QR / File</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-center">Status</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {status === 'loading' ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-20 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#154c4c] border-t-transparent"></div>
                                                    <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredDetails.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-20 text-center border-b border-gray-100 italic text-gray-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <CreditCard size={40} className="text-gray-200" />
                                                    <span className="text-sm font-medium">No payment details found</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDetails.map((row, index) => (
                                            <TableRow key={row.id} className="hover:bg-gray-50/50 text-[12px]">
                                                <TableCell className="py-4 px-6 font-medium text-gray-500 border-r border-gray-200 text-center">{index + 1}</TableCell>
                                                <TableCell className="py-4 px-6 border-r border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "p-2 rounded-sm",
                                                            row.type === 'bank' ? "bg-blue-100 text-blue-600" :
                                                            row.type === 'upi' ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                                                        )}>
                                                            {row.type === 'bank' ? <Landmark size={14} /> : row.type === 'upi' ? <Smartphone size={14} /> : <QrCode size={14} />}
                                                        </span>
                                                        <span className="font-bold text-gray-800 uppercase text-[10px] tracking-wider">{row.type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 font-bold text-gray-700 border-r border-gray-200">
                                                    {row.type === 'bank' ? row.accountHolderName : row.type === 'upi' ? row.upiId : 'General QR'}
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-gray-600 border-r border-gray-200">
                                                    {row.type === 'bank' ? (
                                                        <div className="space-y-1">
                                                            <div className="text-[11px] font-bold text-gray-800">{row.bankName}</div>
                                                            <div className="text-[10px] font-mono text-gray-500">Acc: {row.accountNumber}</div>
                                                            <div className="text-[10px] font-mono text-gray-500 uppercase">IFSC: {row.ifscCode}</div>
                                                        </div>
                                                    ) : row.type === 'upi' ? (
                                                        <span className="text-blue-600 font-medium">Digital ID</span>
                                                    ) : (
                                                        <span className="text-orange-600 font-medium italic underline decoration-dotted">Scan & Pay Template</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4 px-6 border-r border-gray-200 text-center">
                                                    {row.qrImageUrl ? (
                                                        <a href={row.qrImageUrl} target="_blank" rel="noopener noreferrer" className="inline-block relative group">
                                                            <img src={row.qrImageUrl} alt="QR" className="w-8 h-8 rounded border border-gray-200 object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity">
                                                                <Search size={10} className="text-white" />
                                                            </div>
                                                        </a>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto">
                                                            <QrCode size={16} className="text-gray-300" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4 px-6 border-r border-gray-200 text-center">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-sm text-[10px] font-bold uppercase",
                                                        row.status !== false ? "bg-green-100 text-green-700 shadow-sm border border-green-200/50" : "bg-red-100 text-red-700 shadow-sm border border-red-200/50"
                                                    )}>
                                                        {row.status !== false ? 'Active' : 'Hidden'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(row)}
                                                            className="h-8 w-8 bg-[#3b82f6] text-white rounded-sm flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
                                                        >
                                                            <Edit2 size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(row.id)}
                                                            className="h-8 w-8 text-red-500 border border-red-100 rounded-sm flex items-center justify-center hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
                    <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                            <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-wider">
                                {editingId ? 'Edit Payment Detail' : 'Add New Payment Detail'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="overflow-y-auto p-8 pt-6 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[12px] font-bold text-gray-800 tracking-tight block uppercase">
                                    1. Choose Payment Type <span className="text-red-500">*</span>
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {paymentTypes.map((type) => (
                                        <div
                                            key={type.id}
                                            onClick={() => setSelectedType(type.id)}
                                            className={cn(
                                                "p-4 border rounded-sm cursor-pointer transition-all hover:bg-gray-50/50 relative flex flex-col items-center text-center gap-2",
                                                selectedType === type.id
                                                    ? "border-[#154c4c] bg-[#154c4c]/5 shadow-sm"
                                                    : "border-gray-100 bg-white"
                                            )}
                                        >
                                            {selectedType === type.id && (
                                                <div className="absolute top-2 right-2 text-[#154c4c]">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                            )}
                                            <div className={cn(
                                                "p-3 rounded-full",
                                                selectedType === type.id ? "bg-[#154c4c] text-white" : "bg-gray-100 text-gray-400"
                                            )}>
                                                {type.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-[12px] font-bold text-gray-800 leading-tight block">{type.title}</h3>
                                                <p className="text-[10px] text-gray-500 mt-1 leading-tight">{type.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 pt-2">
                                <label className="text-[12px] font-bold text-gray-800 tracking-tight block uppercase">
                                    2. Enter {selectedType.toUpperCase()} Details
                                </label>

                                {selectedType === 'bank' && (
                                    <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-6 shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Account Holder Name <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    value={formData.accountHolderName}
                                                    onChange={e => setFormData({ ...formData, accountHolderName: e.target.value })}
                                                    placeholder="e.g. TNCDC INSTITUTE LTD"
                                                    className="h-10 rounded-sm border-gray-200 text-xs shadow-none focus-visible:ring-1"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Bank Name <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    value={formData.bankName}
                                                    onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                                                    placeholder="e.g. HDFC BANK / SBI"
                                                    className="h-10 rounded-sm border-gray-200 text-xs shadow-none focus-visible:ring-1"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Account Number <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    value={formData.accountNumber}
                                                    onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                                    placeholder="Enter full account number"
                                                    className="h-10 rounded-sm border-gray-200 text-xs shadow-none focus-visible:ring-1"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">IFSC Code <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    value={formData.ifscCode}
                                                    onChange={e => setFormData({ ...formData, ifscCode: e.target.value })}
                                                    placeholder="e.g. HDFC0001234"
                                                    className="h-10 rounded-sm border-gray-200 text-xs shadow-none uppercase focus-visible:ring-1"
                                                />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Branch Name <span className="text-red-500">*</span></label>
                                                <Input
                                                    required
                                                    value={formData.branchName}
                                                    onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                                                    placeholder="e.g. COIMBATORE MAIN BRANCH"
                                                    className="h-10 rounded-sm border-gray-200 text-xs shadow-none focus-visible:ring-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedType === 'upi' && (
                                    <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-6 shadow-sm">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">UPI ID <span className="text-red-500">*</span></label>
                                            <Input
                                                required
                                                value={formData.upiId}
                                                onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                                                placeholder="e.g. 9821431005@paytm"
                                                className="h-12 rounded-sm border-gray-200 text-sm shadow-none focus-visible:ring-1 bg-blue-50/5 font-medium"
                                            />
                                            <p className="text-[9px] text-gray-400 italic px-1 font-bold">Standard UPI IDs like example@upi, mobile@okaxis, etc.</p>
                                        </div>
                                    </div>
                                )}

                                {selectedType === 'qr' && (
                                    <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-6 shadow-sm">
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">QR Code Image <span className="text-red-500">*</span></label>
                                            <div className="flex flex-col gap-4">
                                                {formData.qrImageUrl && (
                                                    <div className="relative w-32 h-32 rounded border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                                                        <img src={formData.qrImageUrl} alt="QR Preview" className="w-full h-full object-contain" />
                                                        <button 
                                                            type="button"
                                                            onClick={() => setFormData({...formData, qrImageUrl: ''})}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="flex items-center h-12 border border-gray-200 rounded-sm overflow-hidden text-sm bg-gray-50/20">
                                                    <input 
                                                        type="file" 
                                                        ref={fileInputRef} 
                                                        className="hidden" 
                                                        onChange={handleImageChange} 
                                                        accept="image/*"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="px-6 h-full bg-[#154c4c] text-white text-[11px] font-bold hover:bg-[#0f2d2d] transition-colors uppercase tracking-widest border-none"
                                                    >
                                                        Upload New QR
                                                    </button>
                                                    <span className="px-4 text-gray-500 text-[11px] italic truncate">
                                                        {formData.qrImageUrl ? 'Image Link Ready' : 'Choose PNG/JPEG file'}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-3 bg-gray-50 rounded-sm border border-gray-100">
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Max Size</div>
                                                        <div className="text-[12px] font-bold text-gray-700">2.0 MB</div>
                                                    </div>
                                                    <div className="p-3 bg-gray-50 rounded-sm border border-gray-100">
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rec. Format</div>
                                                        <div className="text-[12px] font-bold text-gray-700">PNG / JPEG</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3 px-1">
                                    <Checkbox
                                        id="active-status"
                                        checked={formData.status}
                                        onCheckedChange={(val) => setFormData({ ...formData, status: val })}
                                        className="rounded-sm w-4 h-4 data-[state=checked]:bg-[#154c4c] data-[state=checked]:border-[#154c4c]"
                                    />
                                    <label
                                        htmlFor="active-status"
                                        className="text-[13px] font-bold text-gray-800 cursor-pointer"
                                    >
                                        Activate this payment method
                                    </label>
                                </div>
                                <p className="text-[11px] text-gray-400 ml-8 font-bold leading-tight uppercase tracking-tighter">
                                    Only active methods will be visible on the student app and website.
                                </p>
                            </div>

                            <div className="flex justify-center gap-4 pt-6 mt-4 flex-shrink-0">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 h-11 text-[11px] font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider"
                                >
                                    Discard
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#154c4c] hover:bg-[#0f3838] text-white h-11 text-[11px] font-bold px-12 rounded-sm border-none shadow-sm transition-all uppercase tracking-wider flex items-center gap-2"
                                >
                                    {editingId ? 'Update Information' : 'Save Payment Detail'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
