import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, RotateCcw, Download, Filter, TrendingUp, TrendingDown, DollarSign, ArrowLeft, Trash2, Loader2 } from "lucide-react";
import axios from 'axios';
import { BASE_URL } from '@/config';

const EXPENSES_API = `${BASE_URL}/api/expenses`;
const TYPES_API = `${BASE_URL}/api/expense-types`;
const SUBTYPES_API = `${BASE_URL}/api/expense-sub-types`;

export default function ExpensesPage() {
    const [view, setView] = useState('list'); // 'list' or 'add'
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [expenses, setExpenses] = useState([]);
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        admissionCount: 0,
        expenseCount: 0
    });
    
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [expenseSubTypes, setExpenseSubTypes] = useState([]);
    const [filteredSubTypes, setFilteredSubTypes] = useState([]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Filters state
    const [filterSearch, setFilterSearch] = useState('');
    const [filterExpenseTypeId, setFilterExpenseTypeId] = useState('');
    const [filterExpenseSubTypeId, setFilterExpenseSubTypeId] = useState('');
    const [filterPaymentMode, setFilterPaymentMode] = useState('');
    const [filterFromDate, setFilterFromDate] = useState('');
    const [filterToDate, setFilterToDate] = useState('');

    const initialFormData = {
        expenseTypeId: '',
        expenseSubTypeId: '',
        receiverName: '',
        issuePersonName: '',
        amount: '',
        paymentMode: '',
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        remark: ''
    };
    
    const [formData, setFormData] = useState(initialFormData);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            const queryParams = new URLSearchParams();
            if (filterSearch) queryParams.append('search', filterSearch);
            if (filterExpenseTypeId) queryParams.append('expenseTypeId', filterExpenseTypeId);
            if (filterExpenseSubTypeId) queryParams.append('expenseSubTypeId', filterExpenseSubTypeId);
            if (filterPaymentMode) queryParams.append('paymentMode', filterPaymentMode);
            if (filterFromDate) queryParams.append('fromDate', filterFromDate);
            if (filterToDate) queryParams.append('toDate', filterToDate);

            const [expensesRes, summaryRes, typesRes, subTypesRes] = await Promise.all([
                axios.get(`${EXPENSES_API}?${queryParams.toString()}`),
                axios.get(`${EXPENSES_API}/summary`),
                axios.get(TYPES_API),
                axios.get(SUBTYPES_API)
            ]);
            setExpenses(expensesRes.data);
            setSummary(summaryRes.data);
            setExpenseTypes(typesRes.data.filter(t => t.status));
            setExpenseSubTypes(subTypesRes.data.filter(t => t.status));
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter sub types when expense type changes
    useEffect(() => {
        if (formData.expenseTypeId) {
            setFilteredSubTypes(expenseSubTypes.filter(st => st.expenseTypeId === parseInt(formData.expenseTypeId)));
        } else {
            setFilteredSubTypes([]);
        }
    }, [formData.expenseTypeId, expenseSubTypes]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await axios.post(EXPENSES_API, formData);
            await fetchData();
            setFormData(initialFormData);
            setView('list');
        } catch (err) {
            console.error('Failed to save expense:', err);
            if (err.response?.data?.error) {
                alert(err.response.data.error);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${EXPENSES_API}/${id}`);
            setDeleteConfirm(null);
            await fetchData();
        } catch (err) {
            console.error('Failed to delete expense:', err);
        }
    };

    const handleExport = () => {
        if (expenses.length === 0) {
            alert('No data to export');
            return;
        }

        // Create an HTML table string with embedded CSS styles for Excel
        let tableHtml = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office"
                  xmlns:x="urn:schemas-microsoft-com:office:excel"
                  xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8" />
                <style>
                    table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
                    th { 
                        background-color: #1e3a8a; 
                        color: white; 
                        font-weight: bold; 
                        border: 1px solid #000000; 
                        padding: 8px; 
                        text-align: center;
                    }
                    td { 
                        border: 1px solid #000000; 
                        padding: 8px; 
                        text-align: left;
                    }
                    .amount { text-align: right; }
                    .center { text-align: center; }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>
                            <th>Receipt No</th>
                            <th>Expense Type</th>
                            <th>Sub Type</th>
                            <th>Receiver Name</th>
                            <th>Issue Person</th>
                            <th>Amount</th>
                            <th>Payment Mode</th>
                            <th>Date</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        expenses.forEach(item => {
            tableHtml += `
                <tr>
                    <td>${item.receiptNo || ''}</td>
                    <td>${item.expenseType?.name || ''}</td>
                    <td>${item.expenseSubType?.name || ''}</td>
                    <td>${item.receiverName || ''}</td>
                    <td>${item.issuePersonName || ''}</td>
                    <td class="amount">${item.amount || 0}</td>
                    <td class="center">${item.paymentMode || ''}</td>
                    <td class="center">${item.date || ''}</td>
                    <td>${item.remark || ''}</td>
                </tr>
            `;
        });

        tableHtml += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `Expenses_Report_${new Date().toISOString().split('T')[0]}.xls`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const filteredExpenses = expenses.filter(item => 
        searchQuery === '' ||
        item.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.receiverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.remark?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.expenseType?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.expenseSubType?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (view === 'add') {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-[20px] font-bold text-gray-800 font-sans tracking-tight">Add Expense</h1>
                    <Button
                        onClick={() => { setView('list'); setFormData(initialFormData); }}
                        className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-6 h-9 rounded-sm flex items-center gap-2 border-none transition-all shadow-md font-sans text-xs font-bold uppercase tracking-wider"
                    >
                        <ArrowLeft size={16} />
                        Back to List
                    </Button>
                </div>

                <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-10 font-sans">
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
                            {/* Expense Type */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                    Expense Type <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-700 transition-all cursor-pointer"
                                    value={formData.expenseTypeId}
                                    onChange={(e) => setFormData({ ...formData, expenseTypeId: e.target.value, expenseSubTypeId: '' })}
                                    required
                                >
                                    <option value="" disabled>Select Expense Type</option>
                                    {expenseTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Expense Sub Type */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                    Expense Sub Type <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-700 transition-all cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
                                    value={formData.expenseSubTypeId}
                                    onChange={(e) => setFormData({ ...formData, expenseSubTypeId: e.target.value })}
                                    required
                                    disabled={!formData.expenseTypeId}
                                >
                                    <option value="" disabled>
                                        {formData.expenseTypeId ? "Select Sub Type" : "Select Expense Type First"}
                                    </option>
                                    {filteredSubTypes.map(st => (
                                        <option key={st.id} value={st.id}>{st.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Receiver Name */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                    Receiver Name
                                </label>
                                <Input
                                    placeholder="Enter Receiver Name"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                    value={formData.receiverName}
                                    onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                                />
                            </div>

                            {/* Issue Person Name */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                    Issue Person Name
                                </label>
                                <Input
                                    placeholder="Enter Issue Person Name"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                    value={formData.issuePersonName}
                                    onChange={(e) => setFormData({ ...formData, issuePersonName: e.target.value })}
                                />
                            </div>

                            {/* Amount */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                    Amount <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    placeholder="Enter Amount"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>

                            {/* Payment Mode */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                    Payment Mode <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    className="w-full h-10 rounded-sm border border-gray-200 px-3 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-700 transition-all cursor-pointer"
                                    value={formData.paymentMode}
                                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select Payment Mode</option>
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Card">Card</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="date"
                                    className="h-10 rounded-sm border-gray-200 text-xs focus:ring-1 focus:ring-[#1e3a8a] transition-all"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Remark */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                                Remark
                            </label>
                            <textarea
                                placeholder="Enter your remark"
                                className="w-full h-32 rounded-sm border border-gray-200 p-4 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none resize-none bg-white transition-all shadow-sm"
                                value={formData.remark}
                                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-[#1e3a8a] hover:bg-[#152e6e] text-white px-10 h-9 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none transition-all shadow-md active:scale-95 flex items-center justify-center p-0"
                            >
                                {saving ? (
                                    <><Loader2 size={14} className="animate-spin mr-1" /> Submitting...</>
                                ) : "Submit"}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => { setView('list'); setFormData(initialFormData); }}
                                className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-10 h-9 rounded-sm text-[11px] font-bold uppercase tracking-widest border-none transition-all shadow-md active:scale-95 flex items-center justify-center p-0"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    const profitPercentage = summary.totalIncome > 0 
        ? ((summary.netProfit / summary.totalIncome) * 100).toFixed(1) 
        : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 font-sans tracking-tight">Financial Management</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-green-500 border-x border-b border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Income</p>
                        <h2 className="text-3xl font-bold text-green-600 tracking-tight">{formatCurrency(summary.totalIncome)}</h2>
                        <p className="text-[10px] text-gray-400 mt-1 font-medium italic">{summary.admissionCount} admission(s) / payments</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-red-500 border-x border-b border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Expenses</p>
                        <h2 className="text-3xl font-bold text-red-600 tracking-tight">{formatCurrency(summary.totalExpenses)}</h2>
                        <p className="text-[10px] text-gray-400 mt-1 font-medium italic">{summary.expenseCount} transaction(s)</p>
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <TrendingDown size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-500 border-x border-b border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Net Profit/Loss</p>
                        <h2 className="text-3xl font-bold text-blue-600 tracking-tight">{formatCurrency(summary.netProfit)}</h2>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold mt-1 uppercase ${summary.netProfit >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {summary.netProfit >= 0 ? <Plus size={8} className="mr-0.5" /> : null} 
                            {summary.netProfit >= 0 ? 'Profit' : 'Loss'} ({profitPercentage}%)
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <DollarSign size={24} />
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-sm rounded-sm shadow-2xl p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <Trash2 size={20} className="text-red-500" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">Delete Expense?</h3>
                        <p className="text-xs text-gray-500">Are you sure you want to delete this expense record? This action cannot be undone and will affect your financial totals.</p>
                        <div className="flex justify-center gap-3 pt-2">
                            <Button
                                onClick={() => setDeleteConfirm(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-none h-9 text-xs font-bold px-8 rounded-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="bg-red-500 hover:bg-red-600 text-white border-none h-9 text-xs font-bold px-8 rounded-sm"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="font-sans">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Expense Records</h2>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-70">Manage and track your business expenditures</p>
                    </div>
                    <div className="flex items-center gap-3 font-sans">
                        <Button
                            onClick={() => setView('add')}
                            className="bg-[#1e3a8a] hover:bg-[#1a365d] text-white px-6 py-2 rounded-lg flex items-center gap-2 border-none shadow-md transition-all active:scale-95 uppercase text-xs font-bold tracking-wider"
                        >
                            <Plus size={18} />
                            Add New Expense
                        </Button>
                        <Button 
                            onClick={handleExport}
                            className="bg-[#1e463a] hover:bg-[#153229] text-white px-6 py-2 rounded-lg flex items-center gap-2 border-none shadow-md transition-all active:scale-95 uppercase text-xs font-bold tracking-wider"
                        >
                            <Download size={18} />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#f8fafc] p-6 rounded-sm border border-gray-100 space-y-6 font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Search Keywords</label>
                            <Input 
                                placeholder="Receipt, name, remark..." 
                                className="h-10 bg-white border-gray-200 rounded-sm text-xs focus:ring-1 focus:ring-[#1e3a8a]" 
                                value={filterSearch}
                                onChange={(e) => setFilterSearch(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Expense Type</label>
                            <select 
                                className="w-full h-10 rounded-sm border border-gray-200 px-4 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-600 transition-all cursor-pointer"
                                value={filterExpenseTypeId}
                                onChange={(e) => {
                                    setFilterExpenseTypeId(e.target.value);
                                    setFilterExpenseSubTypeId(''); // Reset subtype when type changes
                                }}
                            >
                                <option value="">All Types</option>
                                {expenseTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Sub Type</label>
                            <select 
                                className="w-full h-10 rounded-sm border border-gray-200 px-4 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-600 cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
                                value={filterExpenseSubTypeId}
                                onChange={(e) => setFilterExpenseSubTypeId(e.target.value)}
                                disabled={!filterExpenseTypeId}
                            >
                                <option value="">All Sub Types</option>
                                {expenseSubTypes
                                    .filter(st => st.expenseTypeId === parseInt(filterExpenseTypeId))
                                    .map(st => <option key={st.id} value={st.id}>{st.name}</option>)
                                }
                            </select>
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">Payment Mode</label>
                            <select 
                                className="w-full h-10 rounded-sm border border-gray-200 px-4 text-xs focus:ring-1 focus:ring-[#1e3a8a] outline-none bg-white text-gray-600 transition-all cursor-pointer"
                                value={filterPaymentMode}
                                onChange={(e) => setFilterPaymentMode(e.target.value)}
                            >
                                <option value="">All Modes</option>
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Card">Card</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">From Date</label>
                            <Input 
                                type="date"
                                className="h-10 bg-white border-gray-200 rounded-sm text-xs focus:ring-1 focus:ring-[#1e3a8a]" 
                                value={filterFromDate}
                                onChange={(e) => setFilterFromDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-1">To Date</label>
                            <Input 
                                type="date"
                                className="h-10 bg-white border-gray-200 rounded-sm text-xs focus:ring-1 focus:ring-[#1e3a8a]" 
                                value={filterToDate}
                                onChange={(e) => setFilterToDate(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button 
                            variant="outline"
                            onClick={() => {
                                setFilterSearch('');
                                setFilterExpenseTypeId('');
                                setFilterExpenseSubTypeId('');
                                setFilterPaymentMode('');
                                setFilterFromDate('');
                                setFilterToDate('');
                                // We wait for state update before fetching, so we could call fetchData immediately but the state hasn't been applied yet.
                                // It's better to just manually trigger it with empty strings.
                                const fetchWithoutFilters = async () => {
                                    try {
                                        setLoading(true);
                                        const [expensesRes, summaryRes, typesRes, subTypesRes] = await Promise.all([
                                            axios.get(EXPENSES_API),
                                            axios.get(`${EXPENSES_API}/summary`),
                                            axios.get(TYPES_API),
                                            axios.get(SUBTYPES_API)
                                        ]);
                                        setExpenses(expensesRes.data);
                                        setSummary(summaryRes.data);
                                        setExpenseTypes(typesRes.data.filter(t => t.status));
                                        setExpenseSubTypes(subTypesRes.data.filter(t => t.status));
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setLoading(false);
                                    }
                                };
                                fetchWithoutFilters();
                            }}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50 h-9 rounded-sm flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                        >
                            <RotateCcw size={14} />
                            Reset Filters
                        </Button>
                        <Button 
                            onClick={fetchData}
                            className="bg-[#1e3a8a] hover:bg-[#152e6e] text-white h-9 rounded-sm flex items-center gap-2 text-xs font-bold uppercase tracking-wider border-none"
                        >
                            <Filter size={14} />
                            Apply Filters
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden font-sans">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-200">
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 px-6 tracking-wider border-r border-gray-100">#</TableHead>
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Receipt No.</TableHead>
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Expense Type</TableHead>
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100">Person Details</TableHead>
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 text-right">Amount</TableHead>
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 text-center">Mode</TableHead>
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 tracking-wider border-r border-gray-100 text-center">Date</TableHead>
                                    <TableHead className="font-bold text-gray-700 text-[11px] uppercase py-5 text-center tracking-wider">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-32 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <Loader2 size={40} className="animate-spin text-gray-300" />
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Loading Records...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredExpenses.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-32 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-6">
                                                <div className="bg-gray-50 p-6 rounded-3xl">
                                                    <DollarSign size={48} className="text-gray-300" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">No Expenses Found</p>
                                                    <p className="text-[11px] text-gray-300 font-medium italic">Start tracking your business expenditures today</p>
                                                </div>
                                                <Button
                                                    onClick={() => setView('add')}
                                                    className="bg-[#1e3a8a] hover:bg-[#1a365d] text-white px-10 h-10 rounded-sm font-bold shadow-lg mt-4 uppercase text-xs tracking-widest transition-all active:scale-95 p-0"
                                                >
                                                    <Plus size={18} className="mr-2" />
                                                    Add Your First Expense
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredExpenses.map((expense, index) => (
                                        <TableRow key={expense.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                                            <TableCell className="font-medium text-blue-600 py-4 px-6 border-r border-gray-100">{index + 1}</TableCell>
                                            <TableCell className="font-bold text-gray-700 text-xs border-r border-gray-100">{expense.receiptNo}</TableCell>
                                            <TableCell className="border-r border-gray-100">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-gray-800">{expense.expenseType?.name}</p>
                                                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{expense.expenseSubType?.name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-r border-gray-100">
                                                <div className="space-y-1">
                                                    <p className="text-[11px] text-gray-600"><span className="text-gray-400 mr-1">Rcv:</span> {expense.receiverName || '-'}</p>
                                                    <p className="text-[11px] text-gray-600"><span className="text-gray-400 mr-1">Iss:</span> {expense.issuePersonName || '-'}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-red-600 border-r border-gray-100">
                                                {formatCurrency(expense.amount)}
                                            </TableCell>
                                            <TableCell className="text-center border-r border-gray-100">
                                                <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
                                                    {expense.paymentMode}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center text-xs text-gray-500 border-r border-gray-100">
                                                {new Date(expense.date).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    onClick={() => setDeleteConfirm(expense.id)}
                                                    size="icon"
                                                    className="h-8 w-8 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-md shadow-none transition-colors border border-red-100 hover:border-red-500"
                                                >
                                                    <Trash2 size={14} />
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
        </div>
    );
}
