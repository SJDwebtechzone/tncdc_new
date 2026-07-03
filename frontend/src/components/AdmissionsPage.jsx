import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdmissions } from '@/store/admissionSlice';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/config';
import {
    Plus,
    Download,
    Search,
    Banknote,
    CheckCircle2,
    Tag,
    Hourglass,
    AlertTriangle,
    Users,
    FileText,
    CreditCard,
    Edit,
    X,
    Settings,
    User as UserIcon,
    Phone,
    Mail,
    Calendar,
    BookOpen,
    Layers
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import IDCardPreviewModal from './IDCardPreviewModal';
import AdmissionFormModal from './AdmissionFormModal';

export default function AdmissionsPage() {
    const admissions = useSelector((state) => state.admissions?.admissions || []);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedAdmissionForIdCard, setSelectedAdmissionForIdCard] = useState(null);
    const [selectedAdmissionForForm, setSelectedAdmissionForForm] = useState(null);
    const [selectedAdmissionForDetails, setSelectedAdmissionForDetails] = useState(null);

    useEffect(() => {
        dispatch(fetchAdmissions());
    }, [dispatch]);

    const statsTotals = React.useMemo(() => {
        return admissions.reduce((acc, curr) => {
            const total = parseFloat(curr.finalAmount) || 0;
            const paid = parseFloat(curr.admissionFee) || 0;
            const fee = parseFloat(curr.courseFee) || 0;
            const gst = parseFloat(curr.gstAmount) || 0;
            
            const discount = Math.max(0, fee - (total - gst));
            
            return {
                total: acc.total + total,
                paid: acc.paid + paid,
                discount: acc.discount + discount,
                balance: acc.balance + (total - paid)
            };
        }, { total: 0, paid: 0, discount: 0, balance: 0 });
    }, [admissions]);

    return (
        <div className="space-y-6 relative">
            {/* Stats Components - Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard icon={Banknote} label="TOTAL AMOUNT" value={`₹${statsTotals.total.toLocaleString('en-IN')}`} color="text-blue-600" iconColor="text-blue-600" iconBg="bg-blue-50" borderColor="border-l-blue-500" />
                <StatsCard icon={CheckCircle2} label="PAID AMOUNT" value={`₹${statsTotals.paid.toLocaleString('en-IN')}`} color="text-green-600" iconColor="text-green-600" iconBg="bg-green-50" borderColor="border-l-green-500" />
                <StatsCard icon={Tag} label="DISCOUNT AMOUNT" value={`₹${statsTotals.discount.toLocaleString('en-IN')}`} color="text-orange-500" iconColor="text-orange-500" iconBg="bg-orange-50" borderColor="border-l-orange-500" />
                <StatsCard icon={Hourglass} label="REMAINING BALANCE" value={`₹${statsTotals.balance.toLocaleString('en-IN')}`} color="text-red-500" iconColor="text-red-500" iconBg="bg-red-50" borderColor="border-l-red-500" />
            </div>

            {/* Stats Components - Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-400 flex items-start gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center">
                        <AlertTriangle size={20} className="text-gray-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">TOTAL LATE FEES</div>
                        <div className="text-lg font-bold text-gray-700">₹0.00</div>
                        <Button variant="outline" className="h-6 text-[10px] mt-1 border-blue-900 text-blue-900 px-2">View Details</Button>
                    </div>
                </div>
                <StatsCard icon={Users} label="TOTAL ADMISSIONS" value={admissions.length} color="text-gray-800" iconColor="text-blue-500" iconBg="bg-blue-50" borderColor="border-l-blue-400" />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Manage Admissions</h2>
                    <div className="flex gap-2">
                        <Button onClick={() => navigate('/dashboard/students/admissions/add')} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white gap-2 text-xs">
                            <Plus size={14} /> Add Admission
                        </Button>
                        <Button className="bg-[#065f46] hover:bg-[#065f46]/90 text-white gap-2 text-xs">
                            <Download size={14} /> Export
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3 relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                        <Input className="pl-9 h-10 w-full text-xs" placeholder="Search...." />
                    </div>
                    <div className="md:col-span-2">
                        <select className="w-full h-10 rounded-lg border border-gray-200 px-3 text-xs text-gray-600 bg-white">
                            <option>All Batches</option>
                        </select>
                    </div>
                    {/* Date inputs placeholder */}
                    <div className="md:col-span-2"><Input className="w-full h-10 text-xs" placeholder="Start Date" /></div>
                    <div className="md:col-span-2"><Input className="w-full h-10 text-xs" placeholder="End Date" /></div>
                    <div className="md:col-span-1"><Button variant="outline" className="w-full h-10 border-blue-900 text-blue-900 hover:bg-blue-50 text-xs">Submit</Button></div>
                    <div className="md:col-span-1"><Button variant="outline" className="w-full h-10 border-orange-200 text-orange-500 hover:bg-orange-50 text-xs">Reset</Button></div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-100 rounded-lg w-full">
                    <Table className="min-w-full">
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[30px] font-bold text-gray-800 text-[10px] uppercase">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase min-w-[120px]">Student Name</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Student Email</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Image</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase min-w-[120px]">Course</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Batch</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Adm. Date</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Adm. Fee</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Referral</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Fees Details</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Payment</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Final Amt</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Details</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Downloads</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase">Status</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase min-w-[100px] border-l">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={16} className="h-32 text-center text-gray-500">
                                        No admissions found. Add a new admission to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                admissions.map((admission, index) => (
                                    <TableRow key={admission.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <TableCell className="text-blue-600 font-medium text-xs align-top">{index + 1}</TableCell>
                                        <TableCell className="align-top">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-700">{admission.firstName} {admission.surname}</span>
                                                <span className="text-[10px] text-gray-500 bg-gray-100 px-1 rounded w-fit mt-1">{new Date(admission.admissionDate).toLocaleDateString('en-IN')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top text-[10px] text-gray-600">{admission.email}</TableCell>
                                        <TableCell className="align-top">
                                            <div className="w-8 h-8 rounded overflow-hidden flex items-center justify-center text-[10px] font-bold">
                                                {admission.enquiry?.profileImage ? (
                                                    <img 
                                                        src={admission.enquiry.profileImage.startsWith('http') ? admission.enquiry.profileImage : `${BASE_URL}${admission.enquiry.profileImage}`} 
                                                        alt="Student" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (
                                                    <div className="bg-blue-100 text-blue-600 w-full h-full flex items-center justify-center">
                                                        {admission.firstName[0]}{admission.surname[0]}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top text-[10px] text-gray-600 uppercase">{admission.courseName || 'N/A'}</TableCell>
                                        <TableCell className="align-top text-[10px] text-gray-600">{admission.batch || 'General'}</TableCell>
                                        <TableCell className="align-top text-[10px] text-gray-600">{new Date(admission.admissionDate).toLocaleDateString('en-IN')}</TableCell>
                                        <TableCell className="align-top text-[10px] text-gray-600 font-bold">₹{admission.admissionFee}</TableCell>
                                        <TableCell className="align-top text-[10px] text-gray-600">{admission.referredBy || 'Direct'}</TableCell>
                                        <TableCell className="align-top">
                                            <div className="flex flex-col text-[10px] text-gray-600">
                                                <span>Fees: <span className="font-bold">₹{admission.finalAmount}</span></span>
                                                <span className={admission.admissionFee < admission.finalAmount ? "text-red-500" : "text-green-500"}>
                                                    Balance: ₹{(admission.finalAmount - admission.admissionFee).toFixed(2)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top text-[10px]">
                                            {admission.admissionFee >= admission.finalAmount ? (
                                                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium whitespace-nowrap">Paid</span>
                                            ) : admission.admissionFee > 0 ? (
                                                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium whitespace-nowrap">Partially Paid</span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium whitespace-nowrap">Pending</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] font-bold text-blue-700">₹{admission.finalAmount}</span>
                                                <Button 
                                                    variant="outline" 
                                                    className="h-6 text-[9px] border-blue-600 text-blue-600 hover:bg-blue-50 px-2 font-bold uppercase w-fit flex items-center gap-1"
                                                    onClick={() => navigate(`/dashboard/students/admissions/manage-payments/${admission.id}`)}
                                                >
                                                    <Settings size={10} /> Manage
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Button 
                                                variant="outline" 
                                                className="h-6 text-[10px] border-gray-300 text-gray-600 hover:bg-gray-50 px-2 font-bold uppercase"
                                                onClick={() => setSelectedAdmissionForDetails(admission)}
                                            >Details</Button>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <div className="flex flex-col gap-1.5">
                                                <Button 
                                                    variant="outline" 
                                                    className="h-6 text-[9px] border-blue-900 text-blue-900 hover:bg-blue-50 px-2 font-bold uppercase w-full justify-start whitespace-nowrap"
                                                    onClick={() => setSelectedAdmissionForForm(admission)}
                                                >
                                                    <Download size={10} className="mr-1" />
                                                    Admission Form
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    className="h-6 text-[9px] border-purple-700 text-purple-700 hover:bg-purple-50 px-2 font-bold uppercase w-full justify-start whitespace-nowrap"
                                                    onClick={() => setSelectedAdmissionForIdCard(admission)}
                                                >
                                                    <Download size={10} className="mr-1" />
                                                    ID Card
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Switch checked={admission.status === 'Active'} className="data-[state=checked]:bg-[#1e3a8a]" />
                                        </TableCell>
                                        <TableCell className="align-top border-l">
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 text-[#1e3a8a] bg-blue-50 hover:bg-blue-100"
                                                    onClick={() => navigate(`/dashboard/students/admissions/edit/${admission.id}`)}
                                                >
                                                    <Edit size={14} />
                                                </Button>
                                                <div
                                                    className="bg-gray-800 p-1 rounded text-white cursor-pointer hover:bg-gray-700 transition-colors"
                                                    title="View Details"
                                                    onClick={() => setSelectedAdmissionForDetails(admission)}
                                                ><FileText size={12} /></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* ID Card Print Modal */}
            {selectedAdmissionForIdCard && (
                <IDCardPreviewModal 
                    admission={selectedAdmissionForIdCard} 
                    onClose={() => setSelectedAdmissionForIdCard(null)} 
                />
            )}

            {/* Admission Form Print Modal */}
            {selectedAdmissionForForm && (
                <AdmissionFormModal 
                    admission={selectedAdmissionForForm} 
                    onClose={() => setSelectedAdmissionForForm(null)} 
                />
            )}

            {/* Admission Details Side Panel */}
            {selectedAdmissionForDetails && (
                <div className="fixed inset-0 z-[100] flex" onClick={() => setSelectedAdmissionForDetails(null)}>
                    {/* Backdrop */}
                    <div className="flex-1 bg-black/40 backdrop-blur-sm" />
                    {/* Panel */}
                    <div
                        className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Panel Header */}
                        <div className="sticky top-0 bg-[#1e3a8a] px-6 py-4 flex items-center justify-between z-10">
                            <div>
                                <h3 className="text-white font-bold text-base">Admission Details</h3>
                                <p className="text-blue-200 text-xs mt-0.5 font-mono">{selectedAdmissionForDetails.studentId}</p>
                            </div>
                            <button onClick={() => setSelectedAdmissionForDetails(null)} className="text-blue-200 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Student Profile */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-100 flex items-center justify-center bg-blue-50 shadow flex-shrink-0">
                                    {selectedAdmissionForDetails.enquiry?.profileImage ? (
                                        <img
                                            src={selectedAdmissionForDetails.enquiry.profileImage.startsWith('http') ? selectedAdmissionForDetails.enquiry.profileImage : `${BASE_URL}${selectedAdmissionForDetails.enquiry.profileImage}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon size={28} className="text-blue-300" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-base">{selectedAdmissionForDetails.firstName} {selectedAdmissionForDetails.surname}</p>
                                    <p className="text-xs text-gray-500">{selectedAdmissionForDetails.email || 'No email'}</p>
                                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        selectedAdmissionForDetails.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                    }`}>{selectedAdmissionForDetails.status}</span>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <DetailSection title="Contact Information">
                                <DetailRow icon={Phone} label="Mobile" value={selectedAdmissionForDetails.mobile || selectedAdmissionForDetails.enquiry?.mobile || '-'} />
                                <DetailRow icon={Mail} label="Email" value={selectedAdmissionForDetails.email || selectedAdmissionForDetails.enquiry?.email || '-'} />
                                <DetailRow icon={Calendar} label="DOB" value={selectedAdmissionForDetails.enquiry?.dob ? new Date(selectedAdmissionForDetails.enquiry.dob).toLocaleDateString('en-IN') : '-'} />
                                <DetailRow icon={UserIcon} label="Gender" value={selectedAdmissionForDetails.enquiry?.gender || '-'} />
                            </DetailSection>

                            {/* Course Info */}
                            <DetailSection title="Course & Admission">
                                <DetailRow icon={BookOpen} label="Course" value={selectedAdmissionForDetails.courseName || '-'} />
                                <DetailRow icon={Layers} label="Batch" value={selectedAdmissionForDetails.batch || 'General'} />
                                <DetailRow icon={Calendar} label="Admission Date" value={new Date(selectedAdmissionForDetails.admissionDate).toLocaleDateString('en-IN')} />
                                <DetailRow icon={UserIcon} label="Referral" value={selectedAdmissionForDetails.referralBy || selectedAdmissionForDetails.referredBy || 'Direct'} />
                            </DetailSection>

                            {/* Fee Info */}
                            <DetailSection title="Fee Details">
                                <div className="grid grid-cols-2 gap-3">
                                    <FeeBox label="Course Fee" value={`₹${selectedAdmissionForDetails.courseFee || 0}`} color="text-gray-700" />
                                    <FeeBox label="Discount" value={`₹${selectedAdmissionForDetails.discountValue || 0}`} color="text-orange-600" />
                                    <FeeBox label="Final Amount" value={`₹${selectedAdmissionForDetails.finalAmount || 0}`} color="text-blue-700" />
                                    <FeeBox label="Paid" value={`₹${selectedAdmissionForDetails.admissionFee || 0}`} color="text-green-700" />
                                    <FeeBox
                                        label="Balance"
                                        value={`₹${((selectedAdmissionForDetails.finalAmount || 0) - (selectedAdmissionForDetails.admissionFee || 0)).toFixed(2)}`}
                                        color={(selectedAdmissionForDetails.finalAmount - selectedAdmissionForDetails.admissionFee) > 0 ? "text-red-600" : "text-green-600"}
                                        full
                                    />
                                </div>
                            </DetailSection>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    className="flex-1 bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs h-9 font-bold gap-2"
                                    onClick={() => { setSelectedAdmissionForDetails(null); navigate(`/dashboard/students/admissions/edit/${selectedAdmissionForDetails.id}`); }}
                                >
                                    <Edit size={13} /> Edit Admission
                                </Button>
                                <Button
                                    className="flex-1 bg-[#065f46] hover:bg-green-800 text-white text-xs h-9 font-bold gap-2"
                                    onClick={() => { setSelectedAdmissionForDetails(null); navigate(`/dashboard/students/admissions/manage-payments/${selectedAdmissionForDetails.id}`); }}
                                >
                                    <Settings size={13} /> Manage Fees
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, color, iconColor, iconBg, borderColor }) {
    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${borderColor} flex items-start gap-4`}>
            <div className={`${iconBg} p-3 rounded-lg flex items-center justify-center`}>
                <Icon size={20} className={iconColor} />
            </div>
            <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
                <div className={`text-lg font-bold ${color}`}>{value}</div>
            </div>
        </div>
    )
}

function DetailSection({ title, children }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</p>
            <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
                {children}
            </div>
        </div>
    );
}

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 px-4 py-2.5">
            <Icon size={13} className="text-gray-400 flex-shrink-0" />
            <span className="text-[11px] text-gray-400 w-24 flex-shrink-0">{label}</span>
            <span className="text-[11px] font-semibold text-gray-700 flex-1 truncate">{value}</span>
        </div>
    );
}

function FeeBox({ label, value, color, full }) {
    return (
        <div className={`bg-white border border-gray-100 rounded-lg p-3 shadow-sm ${full ? 'col-span-2' : ''}`}>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-sm font-bold ${color}`}>{value}</p>
        </div>
    );
}







