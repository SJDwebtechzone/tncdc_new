import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Calendar, TrendingUp, CreditCard, RotateCw, Search, X, FileText, Filter, PieChart, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function PaymentHistoryPage() {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [methodFilter, setMethodFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [perPage, setPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/installments/history/all`);
            setTransactions(res.data.transactions || []);
            setStats(res.data.stats || {});
        } catch (err) {
            console.error('Error fetching payment history:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Unique payment methods for filter dropdown
    const paymentMethods = useMemo(() => {
        const methods = [...new Set(transactions.map(t => t.paymentMethod).filter(Boolean))];
        return methods;
    }, [transactions]);

    // Compute method summary for pie chart area
    const methodSummary = useMemo(() => {
        const map = {};
        transactions.forEach(t => {
            if (t.status === 'Paid' || t.status === 'Partially Paid') {
                const method = t.paymentMethod || 'Unknown';
                if (!map[method]) map[method] = { count: 0, amount: 0 };
                map[method].count++;
                map[method].amount += (t.paidAmount || 0);
            }
        });
        return Object.entries(map).map(([method, data]) => ({ method, ...data }));
    }, [transactions]);

    const methodColors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

    // Filtered transactions
    const filtered = useMemo(() => {
        let result = transactions;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.studentName?.toLowerCase().includes(q) ||
                t.courseName?.toLowerCase().includes(q) ||
                t.transactionId?.toLowerCase().includes(q) ||
                t.studentId?.toLowerCase().includes(q)
            );
        }
        if (methodFilter !== 'All') {
            result = result.filter(t => t.paymentMethod === methodFilter);
        }
        if (statusFilter !== 'All') {
            result = result.filter(t => t.status === statusFilter);
        }
        if (fromDate) {
            result = result.filter(t => {
                const d = t.paidDate || t.dueDate;
                return d && d >= fromDate;
            });
        }
        if (toDate) {
            result = result.filter(t => {
                const d = t.paidDate || t.dueDate;
                return d && d <= toDate;
            });
        }
        return result;
    }, [transactions, searchQuery, methodFilter, statusFilter, fromDate, toDate]);

    // Pagination
    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, methodFilter, statusFilter, fromDate, toDate, perPage]);

    const clearFilters = () => {
        setSearchQuery('');
        setMethodFilter('All');
        setStatusFilter('All');
        setFromDate('');
        setToDate('');
    };

    const getStatusBadge = (status) => {
        const styles = {
            'Paid': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
            'Partially Paid': 'bg-blue-100 text-blue-700 border-blue-200',
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {status}
            </span>
        );
    };

    const exportCSV = () => {
        const headers = ['Student', 'Course', 'Roll No', 'Installment', 'Amount', 'Paid', 'Method', 'Transaction ID', 'Status', 'Due Date', 'Paid Date'];
        const rows = filtered.map(t => [
            t.studentName, t.courseName, t.studentId, t.installmentNo, t.amount, t.paidAmount,
            t.paymentMethod || '', t.transactionId || '', t.status, t.dueDate || '', t.paidDate || ''
        ]);
        const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payment_history_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const totalMethodAmount = methodSummary.reduce((s, m) => s + m.amount, 0);

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-[#7c3aed] bg-gradient-to-r from-[#5d5fef] to-[#8b5cf6] rounded-xl p-8 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <span className="text-2xl">💸</span>
                        </div>
                        <h1 className="text-3xl font-bold">Payment History</h1>
                    </div>
                    <p className="text-blue-100 opacity-90 max-w-xl">
                        Comprehensive overview of all payment transactions and revenue analytics
                    </p>
                </div>
                <div className="relative z-10 flex gap-3">
                    <Button onClick={fetchData} variant="ghost" className="text-white hover:bg-white/10 gap-2 border border-white/20">
                        <RotateCw size={18} /> Refresh
                    </Button>
                    <Button onClick={exportCSV} className="bg-[#10b981] hover:bg-[#059669] text-white gap-2 shadow-lg border-0">
                        <Download size={18} /> Export Data
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "TODAY'S REVENUE", amount: `₹${(stats.todayRevenue || 0).toLocaleString()}`, sub: `${stats.todayCount || 0} PAYMENTS`, icon: Calendar, color: "text-[#10b981]", bg: "bg-[#10b981]" },
                    { label: "THIS WEEK", amount: `₹${(stats.weekRevenue || 0).toLocaleString()}`, sub: `${stats.weekCount || 0} PAYMENTS`, icon: Calendar, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]" },
                    { label: "THIS MONTH", amount: `₹${(stats.monthRevenue || 0).toLocaleString()}`, sub: `${stats.monthCount || 0} PAYMENTS`, icon: Calendar, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]" },
                    { label: "TOTAL REVENUE", amount: `₹${(stats.totalRevenue || 0).toLocaleString()}`, sub: `${stats.totalCount || 0} PAYMENTS`, icon: TrendingUp, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-full h-1 ${stat.bg}`}></div>
                        <div className="flex justify-between items-start">
                            <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center text-white shadow-md`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stat.amount}</div>
                        </div>
                        <div className="flex justify-between items-center mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <span>{stat.label}</span>
                            <span>{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts & Filters Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Methods Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
                    <div className="flex items-center gap-2 mb-6 text-[#1e293b] font-bold text-lg">
                        <PieChart size={24} className="text-[#1e293b]" />
                        Payment Methods Summary
                    </div>
                    {methodSummary.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                            <PieChart size={64} className="text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">No payment data available</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {methodSummary.map((m, idx) => {
                                const pct = totalMethodAmount > 0 ? ((m.amount / totalMethodAmount) * 100).toFixed(1) : 0;
                                const color = methodColors[idx % methodColors.length];
                                return (
                                    <div key={m.method}>
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                                                <span className="text-sm font-semibold text-gray-700">{m.method}</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">{pct}% · ₹{m.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="pt-3 border-t border-gray-100 flex justify-between text-xs font-bold text-gray-600">
                                <span>Total: {methodSummary.reduce((s, m) => s + m.count, 0)} payments</span>
                                <span>₹{totalMethodAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters & Search */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold border-b border-gray-100 pb-4">
                        <Filter size={18} />
                        Filters & Search
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">From Date</label>
                                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-600" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">To Date</label>
                                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-600" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => setCurrentPage(1)} className="flex-1 bg-[#0f172a] hover:bg-blue-900 text-white gap-2">
                                    <Search size={14} /> Apply Filters
                                </Button>
                                <Button onClick={clearFilters} variant="outline" className="flex-1 border-orange-200 text-orange-500 hover:bg-orange-50 gap-2">
                                    <X size={14} /> Clear
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Payment Method</label>
                                    <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 bg-white">
                                        <option value="All">All Methods</option>
                                        {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Search</label>
                                    <input type="text" placeholder="Student, Course, Transaction ID" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 bg-white">
                                        <option value="All">All Status</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Partially Paid">Partially Paid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Per Page</label>
                                    <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 bg-white">
                                        <option value={15}>15 per page</option>
                                        <option value={25}>25 per page</option>
                                        <option value={50}>50 per page</option>
                                        <option value={100}>100 per page</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Transactions Table */}
            <div className="space-y-0">
                <div className="bg-[#6b5b95] bg-gradient-to-r from-[#5d5fef] to-[#8b5cf6] text-white p-4 rounded-t-xl font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText size={18} />
                        Payment Transactions
                    </div>
                    <span className="text-sm font-medium text-white/80">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-b-xl overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Loader2 size={48} className="animate-spin text-purple-400 mb-4" />
                            <p className="text-gray-500 font-medium">Loading transactions...</p>
                        </div>
                    ) : paginated.length === 0 ? (
                        <>
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Student & Course</TableHead>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Amount</TableHead>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Method</TableHead>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Transaction ID</TableHead>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Status</TableHead>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody></TableBody>
                            </Table>
                            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                                <FileText size={48} className="mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-500">No Payment Records Found</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-xs">No payments match your current filters. Try adjusting your search criteria.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Student & Course</TableHead>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Amount</TableHead>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Method</TableHead>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Transaction ID</TableHead>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Status</TableHead>
                                        <TableHead className="text-gray-600 font-bold text-xs uppercase">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginated.map((t) => (
                                        <TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell>
                                                <div>
                                                    <div className="font-semibold text-gray-800">{t.studentName}</div>
                                                    <div className="text-xs text-gray-500">{t.courseName}</div>
                                                    <div className="text-[10px] text-gray-400 mt-0.5">Roll: {t.studentId} · Inst #{t.installmentNo}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-bold text-gray-800">₹{(t.amount || 0).toLocaleString()}</div>
                                                    {t.paidAmount > 0 && t.paidAmount !== t.amount && (
                                                        <div className="text-xs text-emerald-600 font-medium">Paid: ₹{t.paidAmount.toLocaleString()}</div>
                                                    )}
                                                    {t.lateFee > 0 && (
                                                        <div className="text-[10px] text-red-500">+₹{t.lateFee} late fee</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-gray-700 font-medium">{t.paymentMethod || '—'}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-gray-600 font-mono">{t.transactionId || '—'}</span>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(t.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    {t.paidDate ? (
                                                        <>
                                                            <div className="text-sm text-gray-700 font-medium">{new Date(t.paidDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                            <div className="text-[10px] text-gray-400">Paid</div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="text-sm text-gray-700 font-medium">{t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</div>
                                                            <div className="text-[10px] text-amber-500">Due</div>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                                    <div className="text-xs text-gray-500">
                                        Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <ChevronLeft size={16} />
                                        </Button>
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let page;
                                            if (totalPages <= 5) {
                                                page = i + 1;
                                            } else if (currentPage <= 3) {
                                                page = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                page = totalPages - 4 + i;
                                            } else {
                                                page = currentPage - 2 + i;
                                            }
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        })}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
