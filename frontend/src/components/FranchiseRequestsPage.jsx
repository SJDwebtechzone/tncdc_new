import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '@/config';
import { 
    FileText, 
    Search, 
    Filter, 
    Eye, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Building, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Monitor, 
    Users,
    X,
    Calendar,
    Hash,
    Navigation,
    Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useSearchParams } from 'react-router-dom';

const FranchiseRequestsPage = () => {
    const [searchParams] = useSearchParams();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, [searchParams]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/franchise-requests`);
            setRequests(response.data);
            
            // Auto-open if ID is present in URL
            const requestId = searchParams.get('id');
            if (requestId) {
                const req = response.data.find(r => r.id === parseInt(requestId));
                if (req) {
                    setSelectedRequest(req);
                    setIsViewModalOpen(true);
                }
            }
        } catch (error) {
            toast.error('Failed to fetch franchise requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`${BASE_URL}/api/franchise-requests/${id}/status`, { status });
            toast.success(`Request marked as ${status}`);
            fetchRequests();
            setIsViewModalOpen(false);
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    const filteredRequests = requests.filter(req => 
        req.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Approved</Badge>;
            case 'Rejected': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Rejected</Badge>;
            default: return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Pending</Badge>;
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Franchise Requests</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage new franchise applications from the website</p>
                </div>
                <div className="flex item-center gap-3">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                            placeholder="Search requests..." 
                            className="pl-10 h-11 bg-white border-gray-200 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-11 rounded-xl gap-2 border-gray-200 bg-white">
                        <Filter size={16} /> Filter
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-gray-700 px-6 py-4">Institution</TableHead>
                            <TableHead className="font-bold text-gray-700 px-4 py-4">Owner Name</TableHead>
                            <TableHead className="font-bold text-gray-700 px-4 py-4">Contact Info</TableHead>
                            <TableHead className="font-bold text-gray-700 px-4 py-4">Location</TableHead>
                            <TableHead className="font-bold text-gray-700 px-4 py-4">Status</TableHead>
                            <TableHead className="font-bold text-gray-700 px-4 py-4">Date</TableHead>
                            <TableHead className="font-bold text-gray-700 px-6 py-4 text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                        <p className="text-gray-400 text-sm font-medium">Loading requests...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                                            <FileText className="text-gray-300" size={32} />
                                        </div>
                                        <p className="text-gray-400 font-medium">No franchise requests found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRequests.map((req) => (
                                <TableRow key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                <Building size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{req.institutionName}</p>
                                                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{req.designation}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <p className="font-bold text-gray-700 text-sm">{req.ownerName}</p>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <div className="space-y-0.5">
                                            <p className="text-[13px] text-gray-600 flex items-center gap-1.5 font-medium">
                                                <Mail size={12} className="text-gray-400" /> {req.email}
                                            </p>
                                            <p className="text-[13px] text-gray-600 flex items-center gap-1.5 font-medium">
                                                <Phone size={12} className="text-gray-400" /> {req.mobile}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <p className="text-[13px] text-gray-600 font-medium">{req.city}, {req.state}</p>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        {getStatusBadge(req.status)}
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <p className="text-[13px] text-gray-500 font-medium">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-9 w-9 p-0 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                            onClick={() => {
                                                setSelectedRequest(req);
                                                setIsViewModalOpen(true);
                                            }}
                                        >
                                            <Eye size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* View Details Modal */}
            {isViewModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-[#0f172a] p-6 flex justify-between items-center text-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <Building size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Franchise Application Details</h2>
                                    <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-0.5">Application ID: #{selectedRequest.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[75vh] p-8 custom-scrollbar bg-gray-50/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Section: Basic Info */}
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-4 mb-4 flex items-center gap-2">
                                            <User className="text-blue-500" size={16} /> Owner & Institution
                                        </h3>
                                        <div className="space-y-4">
                                            <DetailItem label="Institution Name" value={selectedRequest.institutionName} highlight />
                                            <DetailItem label="Center Owner Name" value={selectedRequest.ownerName} />
                                            <DetailItem label="Designation" value={selectedRequest.designation} />
                                            <DetailItem label="Date of Birth" value={selectedRequest.dob} />
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-4 mb-4 flex items-center gap-2">
                                            <Phone className="text-blue-500" size={16} /> Contact Information
                                        </h3>
                                        <div className="space-y-4">
                                            <DetailItem label="Email ID" value={selectedRequest.email} />
                                            <DetailItem label="Mobile Number" value={selectedRequest.mobile} />
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-4 mb-4 flex items-center gap-2">
                                            <Monitor className="text-blue-500" size={16} /> Infrastructure Details
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-center">
                                                <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Computers</p>
                                                <p className="text-2xl font-black text-blue-700">{selectedRequest.computers}</p>
                                            </div>
                                            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 text-center">
                                                <p className="text-[10px] text-orange-600 font-bold uppercase mb-1">Staff Members</p>
                                                <p className="text-2xl font-black text-orange-700">{selectedRequest.staff}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Address Info */}
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
                                        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-4 mb-4 flex items-center gap-2">
                                            <MapPin className="text-blue-500" size={16} /> Location Details
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="space-y-1.5">
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Full Address</p>
                                                <p className="text-sm text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100">{selectedRequest.fullAddress}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <DetailItem label="Taluka/Block" value={selectedRequest.taluka} />
                                                <DetailItem label="Postal Code" value={selectedRequest.pincode} />
                                                <DetailItem label="City" value={selectedRequest.city} />
                                                <DetailItem label="State" value={selectedRequest.state} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t bg-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full animate-pulse ${selectedRequest.status === 'Pending' ? 'bg-blue-500' : selectedRequest.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-sm font-bold text-gray-600">Current Status: <span className={selectedRequest.status === 'Pending' ? 'text-blue-600' : selectedRequest.status === 'Approved' ? 'text-green-600' : 'text-red-600'}>{selectedRequest.status}</span></span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {selectedRequest.status === 'Pending' && (
                                    <>
                                        <Button 
                                            variant="outline" 
                                            className="h-11 rounded-xl px-6 font-bold text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 transition-all active:scale-95"
                                            onClick={() => handleStatusUpdate(selectedRequest.id, 'Rejected')}
                                        >
                                            <XCircle className="mr-2" size={18} /> Reject Application
                                        </Button>
                                        <Button 
                                            className="h-11 rounded-xl px-8 font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100 transition-all active:scale-95"
                                            onClick={() => handleStatusUpdate(selectedRequest.id, 'Approved')}
                                        >
                                            <CheckCircle className="mr-2" size={18} /> Approve Franchise
                                        </Button>
                                    </>
                                )}
                                {selectedRequest.status !== 'Pending' && (
                                    <Button 
                                        variant="outline" 
                                        className="h-11 rounded-xl px-8 font-bold text-gray-600 border-gray-200"
                                        onClick={() => setIsViewModalOpen(false)}
                                    >
                                        Close Window
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value, highlight }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className={`text-sm font-bold ${highlight ? 'text-blue-600 text-base' : 'text-gray-900 font-medium'}`}>{value || 'N/A'}</p>
    </div>
);

export default FranchiseRequestsPage;
