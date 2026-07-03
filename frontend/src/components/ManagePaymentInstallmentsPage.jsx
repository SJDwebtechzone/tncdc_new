import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, 
    DollarSign, 
    Calendar, 
    CheckCircle2, 
    AlertCircle, 
    Plus, 
    RefreshCcw, 
    FileEdit, 
    Check, 
    X,
    User,
    Phone,
    BookOpen,
    IndianRupee,
    Clock,
    Receipt,
    History,
    CreditCard,
    MonitorPlay,
    Download,
    Printer
} from "lucide-react";
import axios from 'axios';
import { BASE_URL } from '@/config';
import { toast } from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ManagePaymentInstallmentsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [admission, setAdmission] = useState(null);
    const [installments, setInstallments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Payment Modal State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        amount: 0,
        type: 'Full Payment', // or 'Partial Payment'
        date: new Date().toISOString().split('T')[0],
        method: 'Cash',
        transactionId: '',
        lateFee: 0,
        remarks: ''
    });

    // Generate Modal State
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [generateForm, setGenerateForm] = useState({
        collectionMethod: 'installments', // 'installments' or 'onetime'
        frequency: 'Monthly',
        installmentsCount: 6,
        customCount: '',
        startDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [admRes, instRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/admissions/${id}`),
                axios.get(`${BASE_URL}/api/installments/${id}`)
            ]);
            setAdmission(admRes.data);
            setInstallments(instRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error("Failed to load payment details");
        } finally {
            setLoading(false);
        }
    };

    const submitGenerateInstallments = async () => {
        try {
            const count = generateForm.collectionMethod === 'onetime' 
                ? 1 
                : (generateForm.installmentsCount === 'Custom' ? parseInt(generateForm.customCount) : parseInt(generateForm.installmentsCount));

            if (!count || isNaN(count) || count < 1) {
                toast.error("Please enter a valid number of installments");
                return;
            }

            const totalAmt = admission.finalAmount || admission.courseFee || 0;

            await axios.post(`${BASE_URL}/api/installments/generate`, {
                admissionId: id,
                totalAmount: totalAmt,
                numberOfInstallments: count,
                startDate: generateForm.startDate,
                frequency: generateForm.collectionMethod === 'onetime' ? 'One Time' : generateForm.frequency,
                isModify: installments.length > 0
            });
            toast.success("Installments generated successfully");
            setIsGenerateModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error generating installments:', error);
            toast.error(error.response?.data?.error || "Failed to generate installments");
        }
    };

    const handleSettleAll = async () => {
        if (!window.confirm("Are you sure you want to settle all pending installments?")) return;
        try {
            await axios.post(`${BASE_URL}/api/installments/settle-all/${id}`, {
                paymentMethod: 'Manual Settle All',
                paidDate: new Date().toISOString()
            });
            toast.success("All installments settled");
            fetchData();
        } catch (error) {
            toast.error("Failed to settle installments");
        }
    };

    const handleResetAll = async () => {
        if (!window.confirm("Are you sure you want to reset all installments to unpaid?")) return;
        try {
            await axios.post(`${BASE_URL}/api/installments/reset-all/${id}`);
            toast.success("All installments reset");
            fetchData();
        } catch (error) {
            toast.error("Failed to reset installments");
        }
    };

    const handlePayNow = (installment) => {
        setSelectedInstallment(installment);
        setPaymentForm({
            ...paymentForm,
            amount: installment.amount,
            type: 'Full Payment',
            date: new Date().toISOString().split('T')[0],
            lateFee: 0
        });
        setIsPaymentModalOpen(true);
    };

    const handlePrintInvoice = async (inst) => {
        try {
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                toast.error("Popup blocked! Please allow popups for printing invoices.");
                return;
            }

            const response = await axios.get(`${BASE_URL}/api/background-images`);
            const template = response.data.find(bg => bg.title.toLowerCase().includes('feesreceipt') || bg.title.toLowerCase().includes('invoice'));
            const bgUrl = template ? template.imageUrl : '';

            const paidDate = inst.paidDate ? new Date(inst.paidDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
            const totalCourseFees = admission.finalAmount || 0;
            const discount = admission.discountValue || 0;
            const paidAmount = installments.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
            const pendingAmount = totalCourseFees - paidAmount;

            const pendingInstallments = installments.filter(i => i.status !== 'Paid');
            const nextInstallment = pendingInstallments.length > 0 ? pendingInstallments[0] : null;
            const nextInstallmentDate = nextInstallment && nextInstallment.dueDate ? new Date(nextInstallment.dueDate).toLocaleDateString('en-GB') : 'N/A';
            const nextInstallmentAmount = nextInstallment ? parseFloat(nextInstallment.amount).toFixed(2) : '0.00';

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Invoice - ${inst.transactionId || 'RC'+inst.id}</title>
                        <style>
                            @page { size: A4 portrait; margin: 0; }
                            body { margin: 0; padding: 0; background: #fff; font-family: 'Arial', sans-serif; -webkit-print-color-adjust: exact; color: black; }
                            .print-container {
                                position: relative;
                                width: 210mm;
                                height: 297mm;
                                background: white;
                                margin: 0 auto;
                                overflow: hidden;
                            }
                            @media print {
                                body { background: white; }
                                .print-container {
                                    overflow: hidden !important;
                                    max-height: 297mm !important;
                                    page-break-after: avoid;
                                    page-break-inside: avoid;
                                }
                                .no-print-overflow {
                                    display: none !important;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="print-container">
                            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; background-image: url('${bgUrl || ''}'); background-size: cover; background-position: center; opacity: ${bgUrl ? 1 : 0};"></div>
                            
                            <!-- Overlay -->
                            <div style="position: relative; z-index: 10; padding: 30px 40px;">
                                <!-- Header Section (Hidden to prevent clashing with background image) -->
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                                    <div style="visibility: hidden;">
                                        <h1 style="font-size: 18px; font-weight: 800; margin: 0; padding-bottom: 4px; text-transform: uppercase;">Tamil Nadu Career Development Council</h1>
                                        <h2 style="font-size: 16px; font-weight: 700; margin: 0; padding-bottom: 8px;">Approved Organization</h2>
                                        <p style="font-size: 11px; font-weight: 600; margin: 0; max-width: 280px; line-height: 1.4; text-transform: uppercase;">NO.23/1, SECOND FLOOR, RAGHAVENDRA STREET, CHENNAI - 600 122. INDIA</p>
                                    </div>
                                    <div style="text-align: right; padding-top: 5px;">
                                        <h1 style="font-size: 38px; font-weight: 900; margin: 0 0 15px 0; letter-spacing: 1px; visibility: hidden;">INVOICE</h1>
                                        <table style="font-size: 11px; float: right; font-weight: 700;">
                                            <tr>
                                                <td style="text-align: left; padding-right: 25px; padding-bottom: 8px;">RECEIPT NO</td>
                                                <td style="padding-bottom: 8px; text-align: left;">: <span style="padding-left: 8px;">${inst.transactionId || 'RCPT' + inst.id}</span></td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: left; padding-right: 25px;">RECEIPT DATE</td>
                                                <td style="text-align: left;">: <span style="padding-left: 8px;">${paidDate}</span></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>

                                <!-- Contact Bar (Hidden to prevent clashing) -->
                                <div style="background-color: transparent; padding: 20px 15px; min-height: 42px; display: flex; align-items: center; gap: 15px; font-weight: 800; font-size: 13px; margin-bottom: 6px; width: 100%; color: transparent; visibility: hidden;">
                                    <span>www.tncdc.in</span>
                                    <span>|</span>
                                    <span>📞 +91 9821431005</span>
                                </div>

                                <!-- Course Details -->
                                <div style="margin-bottom: 10px; margin-top: 0px; font-size: 13px; font-weight: 700; padding: 0 15px;">
                                    <table style="width: 100%; text-align: left; border-collapse: separate; border-spacing: 0 8px;">
                                        <tr>
                                            <td style="width: 25%; white-space: nowrap;">Student Name</td>
                                            <td style="width: 3%;">:</td>
                                            <td style="font-size: 15px; font-weight: 800;" colspan="4">${admission.firstName} ${admission.surname}</td>
                                        </tr>
                                        <tr>
                                            <td style="white-space: nowrap;">Course Name</td>
                                            <td>:</td>
                                            <td style="font-size: 14px; font-weight: 800; text-transform: uppercase;" colspan="4">${admission.courseName}</td>
                                        </tr>
                                        <tr>
                                            <td style="white-space: nowrap;">Course Fee</td>
                                            <td>:</td>
                                            <td style="font-size: 14px; font-weight: 800;" colspan="4">₹ ${parseFloat(admission.finalAmount || 0).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td style="white-space: nowrap;">Batch Name</td>
                                            <td>:</td>
                                            <td style="font-size: 14px; font-weight: 800;" colspan="4">${admission.batch || 'General Time'}</td>
                                        </tr>
                                        <tr>
                                            <td style="white-space: nowrap;">Roll No</td>
                                            <td>:</td>
                                            <td style="font-size: 14px; font-weight: 800;" colspan="4">${admission.studentId}</td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Table Area -->
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px; font-size: 11px; font-weight: 700; text-align: center;">
                                    <thead>
                                        <tr style="border-top: 1.5px solid #000; border-bottom: 1px solid #000; ">
                                            <th style="padding: 8px 0; width: 25%;">Installment Number</th>
                                            <th style="padding: 8px 0; width: 30%;">Installment Amount</th>
                                            <th style="padding: 8px 0; width: 30%;">Paid Amount</th>
                                            <th style="padding: 8px 0; width: 15%;">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style="padding: 8px 0;">${inst.installmentNo || '1'}</td>
                                            <td style="padding: 8px 0;">₹ ${parseFloat(inst.amount).toFixed(2)}</td>
                                            <td style="padding: 8px 0;">₹ ${parseFloat(inst.paidAmount || 0).toFixed(2)}</td>
                                            <td style="padding: 8px 0;">${inst.status}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- Payment Breakdown -->
                                <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 15px; display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; margin-bottom: 10px;">
                                    <span>Payment Breakdown</span>
                                    <span>Payment Method: ${inst.paymentMethod || 'Cash'}</span>
                                </div>

                                <!-- Summary Area -->
                                <div style="font-size: 13px; font-weight: 700; line-height: 1.8; padding: 0 15px; display: flex; justify-content: center;">
                                    <table style="width: 70%;">
                                        <tr>
                                            <td style="width: 45%; font-weight: 600;">Total Late Fee</td><td style="width: 5%; text-align: center;">:</td><td style="text-align: right; font-weight: 800;">₹ ${(parseFloat(inst.lateFee) || 0).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600;">Course Fee</td><td style="text-align: center;">:</td><td style="text-align: right; font-weight: 800;">₹ ${parseFloat(totalCourseFees).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600;">Discount Applied</td><td style="text-align: center;">:</td><td style="text-align: right; font-weight: 800;">₹ ${parseFloat(discount).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600;">GST 18%</td><td style="text-align: center;">:</td><td style="text-align: right; font-weight: 800;">₹ 0.00</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600;">Total Amount</td><td style="text-align: center;">:</td><td style="text-align: right; font-weight: 800;">₹ ${parseFloat(totalCourseFees).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600;">Paid Amount</td><td style="text-align: center;">:</td><td style="text-align: right; font-weight: 800;">₹ ${parseFloat(paidAmount).toFixed(2)}</td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Dark Banner -->
                                <div style="background-color: #0d3b44; color: white; padding: 8px 20px; font-size: 9px; font-weight: 700; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; margin-top: 10px; height: 30px;">
                                    <div style="line-height: 1.5;">
                                        <div>Next Installment Date: ${nextInstallmentDate}</div>
                                        <div>Next Installment Amount: ₹${nextInstallmentAmount}/-</div>
                                    </div>
                                    <div style="font-size: 10px; font-weight: 800;">REMAINING BALANCE : ₹ ${parseFloat(pendingAmount).toFixed(2)}</div>
                                </div>

                                <!-- Footer Stats & QR -->
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 15px; padding: 0 20px;">
                                    <div style="width: 80px; height: 80px;">
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${inst.transactionId || admission.studentId}" style="width: 100%;" />
                                    </div>
                                    <div style="border-left: 2px solid #000; padding-left: 20px; flex-grow: 1; margin-left: 30px;">
                                        <table style="font-size: 11px; font-weight: 800; line-height: 2;">
                                            <tr><td style="width: 150px;">Total Installment</td><td style="width: 10px;">:</td><td>${installments.length}</td></tr>
                                            <tr><td>Paid Installments</td><td>:</td><td>${installments.length - pendingInstallments.length}</td></tr>
                                            <tr><td>Remaining Installments</td><td>:</td><td>${pendingInstallments.length}</td></tr>
                                        </table>
                                    </div>
                                    <div style="width: 80px;"></div>
                                </div>

                                <!-- Signatures & Terms -->
                                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 15px; padding: 0 10px;">
                                    <div style="font-size: 12px; font-weight: 800; color: #222; line-height: 1.6;">
                                        Amount Paid : ₹ ${parseFloat(inst.paidAmount).toFixed(2)}/-<br/>
                                        <span style="font-size: 10px; font-weight: 700; color: #555;">Paid On : ${paidDate}</span>
                                    </div>
                                    <div style="text-align: center; font-size: 16px; font-weight: 800; line-height: 1.3;">
                                        Thank You for<br/>Your Payment!
                                    </div>
                                    <div style="text-align: center; font-size: 11px; font-weight: 800; line-height: 1.7;">
                                        <span>SivaSankar</span><br/>
                                        <span>DIRECTOR</span>
                                    </div>
                                </div>

                                <div style="text-align: left; margin-top: 12px; padding: 0 10px; max-width: 60%;">
                                    <div style="font-size: 12px; font-weight: 800; margin-bottom: 3px;">Terms and conditions :</div>
                                    <div style="font-size: 11px; font-style: italic; color: #333;">Please send payment within 30 days of receiving this invoice.</div>
                                </div>


                            </div>
                        </div>
                        <script>
                            window.onload = () => {
                                setTimeout(() => {
                                    window.print();
                                }, 500);
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate invoice");
        }
    };

    const handleCompletePayment = async () => {
        try {
            if (!selectedInstallment) return;

            const updateData = {
                paidAmount: parseFloat(paymentForm.amount),
                paymentMethod: paymentForm.method,
                transactionId: paymentForm.transactionId,
                status: 'Paid',
                lateFee: parseFloat(paymentForm.lateFee),
                paidDate: paymentForm.date
            };

            await axios.put(`${BASE_URL}/api/installments/${selectedInstallment.id}`, updateData);
            
            toast.success('Payment completed successfully');
            setIsPaymentModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error completing payment:', error);
            toast.error('Failed to complete payment');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[400px]">Loading details...</div>;
    }

    if (!admission) {
        return <div className="p-8 text-center text-red-500">Admission not found</div>;
    }

    const totalPaid = installments.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
    const remainingBalance = (admission.finalAmount || 0) - totalPaid;

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header with Student Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400 border-4 border-white shadow-md overflow-hidden ring-1 ring-gray-100">
                            {admission.enquiry?.profileImage ? (
                                <img src={admission.enquiry.profileImage.startsWith('http') ? admission.enquiry.profileImage : `${BASE_URL}${admission.enquiry.profileImage}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} />
                            )}
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{admission.firstName} {admission.surname}</h1>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1 font-bold flex items-center gap-1.5">
                                    <Phone size={14} /> {admission.mobile}
                                </Badge>
                                <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100 px-3 py-1 font-bold flex items-center gap-1.5">
                                    <BookOpen size={14} /> {admission.courseName}
                                </Badge>
                                <Badge variant="outline" className="text-gray-500 font-bold px-3 py-1 border-gray-200">
                                    ID: {admission.studentId}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 font-bold flex items-center gap-2 px-4 hover:bg-gray-100 rounded-xl transition-all">
                        <ArrowLeft size={18} /> Back to Admissions
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                                <IndianRupee size={24} />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Total Amount</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-gray-900">₹{(admission.finalAmount || 0).toLocaleString()}</h3>
                            <p className="text-xs text-gray-500 font-medium">Total amount after discount</p>
                            <p className="text-[10px] text-blue-500 font-bold mt-1">Course Fees: ₹{(admission.courseFee || 0).toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-50 rounded-xl text-orange-600 group-hover:scale-110 transition-transform">
                                <Receipt size={24} />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Discount Amount</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-gray-900">₹{(admission.discountValue || 0).toLocaleString()}</h3>
                            <p className="text-xs text-gray-500 font-medium flex items-center justify-between">Discount at Admission: <span>₹{(admission.discountValue || 0).toLocaleString()}</span></p>
                            <p className="text-xs text-gray-500 font-medium flex items-center justify-between">Discount on Settlement: <span>₹0</span></p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:scale-110 transition-transform">
                                <CheckCircle2 size={24} />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Paid Amount</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-gray-900">₹{totalPaid.toLocaleString()}</h3>
                            <p className="text-xs text-gray-500 font-medium flex items-center justify-between">Installment Amount: <span>₹{totalPaid.toLocaleString()}</span></p>
                            <p className="text-xs text-gray-500 font-medium flex items-center justify-between">Late Fees: <span>₹0</span></p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6 relative">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-50 rounded-xl text-red-600 group-hover:scale-110 transition-transform">
                                <CreditCard size={24} />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Remaining Balance</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-red-600 font-montserrat tracking-tight">₹{remainingBalance.toLocaleString()}</h3>
                            <p className="text-[14px] text-gray-500 font-bold mt-1">₹{remainingBalance.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Actions Toolbar */}
                <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                            <Receipt size={20} />
                        </div>
                        <h2 className="text-xl font-black text-gray-800 tracking-tight">Payment Installments</h2>
                    </div>
                    <div className="flex gap-3">
                        {installments.length === 0 ? (
                            <div className="flex gap-3">
                                <Button onClick={() => setIsGenerateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl shadow-lg border-b-4 border-blue-800 active:translate-y-0.5 active:border-b-0 transition-all flex items-center gap-2">
                                    <Plus size={18} /> Generate Installments
                                </Button>
                                <Button 
                                    onClick={() => setIsGenerateModalOpen(true)} 
                                    style={{ backgroundColor: '#f97316', color: 'white' }}
                                    className="font-bold h-10 px-6 rounded-xl flex items-center gap-2 transition-all opacity-100 shadow-lg border-none"
                                >
                                    <FileEdit size={18} /> Modify Plan
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button onClick={handleSettleAll} className="bg-blue-900 hover:bg-blue-950 text-white font-bold h-10 px-6 rounded-xl flex items-center gap-2 transition-all">
                                    <Check size={18} /> Settle All
                                </Button>
                                <Button 
                                    onClick={() => setIsGenerateModalOpen(true)} 
                                    style={{ backgroundColor: '#f97316', color: 'white' }}
                                    className="font-bold h-10 px-6 rounded-xl flex items-center gap-2 transition-all opacity-100 shadow-lg border-none"
                                >
                                    <FileEdit size={18} /> Modify Plan
                                </Button>
                                <Button onClick={handleResetAll} className="bg-red-600 hover:bg-red-700 text-white font-bold h-10 px-6 rounded-xl flex items-center gap-2 shadow-lg border-b-4 border-red-800 active:translate-y-0.5 active:border-b-0 transition-all">
                                    <RefreshCcw size={18} /> Reset All
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100">
                                <TableHead className="w-[50px] text-[10px] font-black uppercase text-gray-500">#</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500">Installment</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500">Amount</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500">Paid</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500">Due Date</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500">Paid Date</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500">Method</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500">Transaction ID</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500">Late Fee</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500">Frequency</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500">Invoice</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-500 text-right">Reset</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {installments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={12} className="h-48 text-center text-gray-400 font-medium">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-4 bg-gray-50 rounded-full">
                                                <History size={40} className="text-gray-300" />
                                            </div>
                                            <div className="space-y-1">
                                                <p>No installments found for this student.</p>
                                                <p className="text-xs">Click "Generate Installments" to create a schedule.</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                installments.map((inst, idx) => (
                                    <TableRow key={inst.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 h-16">
                                        <TableCell className="text-xs font-bold text-gray-400">{idx + 1}</TableCell>
                                        <TableCell className="text-sm font-black text-gray-900">{inst.installmentNo}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-gray-800">₹{inst.amount.toLocaleString()}</span>
                                                {inst.status !== 'Paid' && (
                                                    <Button 
                                                        onClick={() => handlePayNow(inst)}
                                                        className="h-7 text-[10px] font-black bg-white hover:bg-green-50 text-green-600 border border-green-200 shadow-sm rounded-full py-0 px-3 flex items-center gap-1.5 transition-all active:scale-95"
                                                    >
                                                        <CheckCircle2 size={12} /> Pay Now
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-bold text-gray-500">₹{(inst.paidAmount || 0).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] font-bold bg-gray-50 text-gray-600 border-gray-200">
                                                {new Date(inst.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-gray-400">
                                            {inst.paidDate ? new Date(inst.paidDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-gray-400">{inst.paymentMethod || '-'}</TableCell>
                                        <TableCell className="text-xs font-medium text-gray-400">{inst.transactionId || '-'}</TableCell>
                                        <TableCell className="text-xs font-medium text-gray-400">₹{inst.lateFee || 0}</TableCell>
                                        <TableCell>
                                            <Badge className="bg-gray-100 text-gray-500 text-[10px] border-none font-bold">
                                                {inst.frequency}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`text-[10px] font-black uppercase px-2 py-0.5 border-none shadow-sm ${
                                                inst.status === 'Paid' ? 'bg-green-500 text-white' : 
                                                inst.status === 'Partially Paid' ? 'bg-orange-400 text-white' : 
                                                'bg-orange-500 text-white'
                                            }`}>
                                                {inst.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-yellow-500 text-white text-[10px] font-black uppercase px-2 py-0.5 border-none shadow-sm cursor-pointer hover:bg-yellow-600 transition-colors">
                                                Upcoming
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {inst.status === 'Paid' ? (
                                                <Button 
                                                    onClick={() => handlePrintInvoice(inst)}
                                                    variant="ghost" 
                                                    className="bg-blue-50 text-blue-700 hover:text-blue-900 hover:bg-blue-100 h-7 gap-1.5 font-bold px-3 transition-colors text-[10px] uppercase rounded-full shadow-sm"
                                                >
                                                    <Download size={12} /> Invoice
                                                </Button>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            

            {/* Complete Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] border border-gray-100">
                        {/* Modal Header - Fixed at Top */}
                        <div 
                            style={{ background: 'linear-gradient(to right, #d91b5c, #7b1fa2, #4527a0)' }}
                            className="px-6 py-6 flex justify-between items-center relative flex-shrink-0"
                        >
                            <h3 className="text-white text-xl font-bold tracking-tight">Complete Payment</h3>
                            <button 
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="text-white/80 hover:text-white transition-colors absolute right-6 top-1/2 -translate-y-1/2"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="p-8 space-y-8 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-200">
                            {/* Amount breakdown */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-gray-900 font-bold text-lg">Total Amount:</span>
                                    <span className="text-2xl font-black text-gray-950">₹{(parseFloat(paymentForm.amount) + parseFloat(paymentForm.lateFee)).toFixed(2)}</span>
                                </div>
                                <div className="space-y-1.5 pt-2 border-t border-gray-50 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-medium">Installment Amount:</span>
                                        <span className="font-bold text-gray-700">₹{selectedInstallment?.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-red-400 font-medium">Remaining Amount (from previous):</span>
                                        <span className="font-bold text-red-700">₹0.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-orange-400 font-medium">Late Fees:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-orange-700">₹</span>
                                            <input 
                                                type="number"
                                                value={paymentForm.lateFee}
                                                onChange={(e) => setPaymentForm({...paymentForm, lateFee: e.target.value})}
                                                className="w-16 border-none p-0 focus:ring-0 font-bold text-orange-700 bg-transparent text-right"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Type */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment Type</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setPaymentForm({...paymentForm, type: 'Full Payment'})}
                                        className={cn(
                                            "py-3 rounded-xl border-2 font-bold text-sm transition-all",
                                            paymentForm.type === 'Full Payment' 
                                                ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                                                : "border-gray-100 text-gray-400 hover:border-gray-200"
                                        )}
                                    >
                                        Full Payment
                                    </button>
                                    <button 
                                        onClick={() => setPaymentForm({...paymentForm, type: 'Partial Payment'})}
                                        className={cn(
                                            "py-3 rounded-xl border-2 font-bold text-sm transition-all",
                                            paymentForm.type === 'Partial Payment' 
                                                ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                                                : "border-gray-100 text-gray-400 hover:border-gray-200"
                                        )}
                                    >
                                        Partial Payment
                                    </button>
                                </div>
                            </div>

                            {/* Paid Date */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Paid Date</label>
                                <div className="relative">
                                    <input 
                                        type="date"
                                        value={paymentForm.date}
                                        onChange={(e) => setPaymentForm({...paymentForm, date: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment Method</label>
                                <RadioGroup 
                                    value={paymentForm.method} 
                                    onValueChange={(val) => setPaymentForm({...paymentForm, method: val})}
                                    className="space-y-2"
                                >
                                    {[
                                        { id: 'cash', label: 'Cash', icon: <div className="p-1.5 bg-green-50 text-green-600 rounded-md ring-1 ring-green-200 text-lg"><IndianRupee size={16} /></div> },
                                        { id: 'card', label: 'Credit/Debit Card', icon: <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md ring-1 ring-blue-200 text-lg"><CreditCard size={16} /></div> },
                                        { id: 'online', label: 'Online Payment', icon: <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-md ring-1 ring-cyan-200 text-lg"><MonitorPlay size={16} /></div> }
                                    ].map((method) => (
                                        <div key={method.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <RadioGroupItem value={method.label} id={method.id} />
                                            <div className="flex-1 flex items-center justify-between">
                                                <Label htmlFor={method.id} className="font-bold text-gray-600 cursor-pointer">{method.label}</Label>
                                                {method.icon}
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Transaction ID */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Transaction / Receipt ID</label>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        placeholder="Enter transaction or receipt ID (optional)"
                                        value={paymentForm.transactionId || ''}
                                        onChange={(e) => setPaymentForm({...paymentForm, transactionId: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - Fixed at Bottom */}
                        <div className="p-8 pb-8 pt-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                            <button 
                                onClick={handleCompletePayment}
                                style={{ backgroundColor: '#0a2357', color: 'white' }}
                                className="w-full py-4 font-bold text-lg rounded-2xl shadow-xl active:scale-[0.98] transition-all"
                            >
                                Complete Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Generate Installments Modal */}
            {isGenerateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-3xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden max-h-[95vh] border border-gray-100">
                        {/* Modal Header */}
                        <div className="px-6 py-4 flex justify-between items-center relative flex-shrink-0 bg-white border-b border-gray-100">
                            <h3 className="text-gray-900 text-xl font-bold tracking-tight">Modify Installment</h3>
                            <button 
                                onClick={() => setIsGenerateModalOpen(false)}
                                className="text-gray-500 hover:text-gray-900 transition-colors bg-gray-100/50 hover:bg-gray-100 p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-200">
                            {/* Header Info */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black text-pink-600 font-montserrat tracking-tight">₹{(admission.finalAmount || 0).toLocaleString()}</span>
                                    <span className="text-gray-400 font-medium text-lg">• {admission.courseName}</span>
                                </div>
                                <p className="text-xs font-bold text-gray-400">Remaining Course fees: ₹{remainingBalance.toLocaleString()}</p>
                            </div>

                            {/* Collection Method */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 border-l-4 border-pink-600 pl-2">
                                    <h4 className="text-sm font-bold text-gray-800 tracking-tight">Collection Method</h4>
                                </div>
                                <p className="text-xs text-gray-400 font-medium">How do you want to collect this amount?</p>
                                
                                <div className="space-y-2">
                                    <label className={`flex items-center gap-3 p-4 rounded-xl border ${generateForm.collectionMethod === 'installments' ? 'border-pink-200 bg-pink-50/50' : 'border-gray-100 bg-gray-50 hover:bg-gray-100/50'} cursor-pointer transition-all`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${generateForm.collectionMethod === 'installments' ? 'border-pink-500' : 'border-gray-300'}`}>
                                            {generateForm.collectionMethod === 'installments' && <div className="w-2.5 h-2.5 bg-pink-500 rounded-full" />}
                                        </div>
                                        <input 
                                            type="radio" 
                                            name="collectionMethod" 
                                            value="installments" 
                                            className="hidden"
                                            checked={generateForm.collectionMethod === 'installments'}
                                            onChange={(e) => setGenerateForm({...generateForm, collectionMethod: e.target.value})}
                                        />
                                        <span className={`text-sm font-bold ${generateForm.collectionMethod === 'installments' ? 'text-pink-600' : 'text-gray-600'}`}>Collect in installments</span>
                                    </label>

                                    <label className={`flex items-center gap-3 p-4 rounded-xl border ${generateForm.collectionMethod === 'onetime' ? 'border-pink-200 bg-pink-50/50' : 'border-gray-100 bg-gray-50 hover:bg-gray-100/50'} cursor-pointer transition-all`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${generateForm.collectionMethod === 'onetime' ? 'border-pink-500' : 'border-gray-300'}`}>
                                            {generateForm.collectionMethod === 'onetime' && <div className="w-2.5 h-2.5 bg-pink-500 rounded-full" />}
                                        </div>
                                        <input 
                                            type="radio" 
                                            name="collectionMethod" 
                                            value="onetime" 
                                            className="hidden"
                                            checked={generateForm.collectionMethod === 'onetime'}
                                            onChange={(e) => setGenerateForm({...generateForm, collectionMethod: e.target.value})}
                                        />
                                        <span className={`text-sm font-bold ${generateForm.collectionMethod === 'onetime' ? 'text-pink-600' : 'text-gray-600'}`}>One time payment</span>
                                    </label>
                                </div>
                            </div>

                            {/* Payment Schedule (Only for installments) */}
                            {generateForm.collectionMethod === 'installments' && (
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-2 border-l-4 border-pink-600 pl-2">
                                        <h4 className="text-sm font-bold text-gray-800 tracking-tight">Payment Schedule</h4>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400 font-medium">Frequency of collection</label>
                                        <select 
                                            value={generateForm.frequency}
                                            onChange={(e) => setGenerateForm({...generateForm, frequency: e.target.value})}
                                            className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Weekly">Weekly</option>
                                            <option value="Yearly">Yearly</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <label className="text-xs text-gray-400 font-medium">How many installments?</label>
                                        <div className="space-y-1">
                                            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 'Custom'].map((count) => {
                                                const amountPerInst = count !== 'Custom' ? (admission.finalAmount / count).toFixed(2) : 0;
                                                const isSelected = generateForm.installmentsCount === count;
                                                return (
                                                    <label key={count} className={`flex items-center justify-between p-3 rounded-xl ${isSelected ? 'bg-green-50/50' : 'hover:bg-gray-50/80'} cursor-pointer transition-all`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-pink-500' : 'border-gray-300'}`}>
                                                                {isSelected && <div className="w-2 h-2 bg-pink-500 rounded-full" />}
                                                            </div>
                                                            <input 
                                                                type="radio" 
                                                                name="installmentsCount" 
                                                                value={count} 
                                                                className="hidden"
                                                                checked={isSelected}
                                                                onChange={(e) => setGenerateForm({
                                                                    ...generateForm, 
                                                                    installmentsCount: count === 'Custom' ? 'Custom' : parseInt(count)
                                                                })}
                                                            />
                                                            <span className="text-sm font-bold text-gray-700">
                                                                {count === 'Custom' ? 'Custom number of installments' : `${count} installments`}
                                                            </span>
                                                        </div>
                                                        {count !== 'Custom' && (
                                                            <span className="text-xs font-bold text-green-600 bg-green-100/50 px-2 py-1 rounded-md">
                                                                ₹{amountPerInst} / {generateForm.frequency.toLowerCase().replace('ly', '')}
                                                            </span>
                                                        )}
                                                        {(count === 'Custom' && isSelected) && (
                                                            <input
                                                                type="number"
                                                                min="2"
                                                                max="100"
                                                                placeholder="Enter count"
                                                                className="w-24 p-1.5 text-xs rounded border border-gray-200 outline-none focus:border-pink-500"
                                                                value={generateForm.customCount}
                                                                onChange={(e) => setGenerateForm({...generateForm, customCount: e.target.value})}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        )}
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Start Date */}
                            <div className="space-y-3 pt-4">
                                <div className="flex items-center gap-2 border-l-4 border-pink-600 pl-2">
                                    <h4 className="text-sm font-bold text-gray-800 tracking-tight">Start Date</h4>
                                </div>
                                <p className="text-xs text-gray-400 font-medium">When do you want to start collection?</p>
                                
                                <div>
                                    <input 
                                        type="date" 
                                        value={generateForm.startDate}
                                        onChange={(e) => setGenerateForm({...generateForm, startDate: e.target.value})}
                                        className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Payment Schedule Summary */}
                            <div className="bg-[#e6f2ec] rounded-2xl p-4 space-y-3 mt-4">
                                <div className="flex items-center gap-2 text-teal-700 mb-2">
                                    <Calendar size={18} className="text-teal-600" />
                                    <h4 className="font-bold text-[15px]">Payment Schedule Summary</h4>
                                </div>
                                
                                {generateForm.collectionMethod === 'onetime' ? (
                                    <div className="bg-[#d2e8db] rounded-xl p-4 space-y-2">
                                        <h5 className="font-bold text-gray-800 text-sm">One-time Payment</h5>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-medium text-gray-600 flex gap-2">Amount: <span className="font-bold text-gray-800">₹{(remainingBalance > 0 ? remainingBalance : admission.finalAmount || 0).toLocaleString()}</span></p>
                                            <p className="text-xs font-medium text-gray-600 flex gap-2">Due Date: <span className="font-bold text-gray-800">{new Date(generateForm.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-[#d2e8db] rounded-xl p-4 space-y-2">
                                            <h5 className="font-bold text-gray-800 text-sm">{generateForm.frequency} Installments</h5>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs font-medium text-gray-600 flex gap-2">Number of installments: <span className="font-bold text-gray-800">{generateForm.installmentsCount === 'Custom' ? (generateForm.customCount || 'Not specified') : generateForm.installmentsCount}</span></p>
                                                <p className="text-xs font-medium text-gray-600 flex gap-2">Start Date: <span className="font-bold text-gray-800">{new Date(generateForm.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
                                            </div>
                                        </div>
                                        <div className="bg-[#d2e8db] rounded-xl p-4 space-y-2">
                                            <h5 className="font-bold text-gray-800 text-sm">Equal Installments</h5>
                                            <div className="flex flex-col gap-1">
                                                {(() => {
                                                    const count = generateForm.installmentsCount === 'Custom' ? parseInt(generateForm.customCount) : generateForm.installmentsCount;
                                                    const amt = count && count > 0 ? ((remainingBalance > 0 ? remainingBalance : admission.finalAmount || 0) / count).toFixed(2) : 0;
                                                    return (
                                                        <>
                                                            <p className="text-xs font-medium text-gray-600 flex gap-2">Amount per installment: <span className="font-bold text-gray-800">₹{amt}</span></p>
                                                            <p className="text-xs font-medium text-gray-600 flex gap-2">Payment frequency: <span className="font-bold text-gray-800">{generateForm.frequency}</span></p>
                                                        </>
                                                    )
                                                })()}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="bg-[#eaf5ef] rounded-xl p-4 text-center mt-2 border border-[#d2e8db]">
                                    <p className="text-[10px] uppercase font-bold text-teal-600 mb-0.5">Total Collection</p>
                                    <p className="text-xl font-black text-teal-800">₹{(remainingBalance > 0 ? remainingBalance : admission.finalAmount || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
                            <button 
                                onClick={submitGenerateInstallments}
                                style={{ backgroundColor: '#1e3a8a', color: 'white' }}
                                className="w-full py-3.5 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
                            >
                                Continue to Payment Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
