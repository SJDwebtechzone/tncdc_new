const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// Generate unique receipt number
const generateReceiptNo = async () => {
    const count = await prisma.expense.count();
    const prefix = 'EXP';
    // Format: EXP-000001
    return `${prefix}-${String(count + 1).padStart(6, '0')}`;
};

// GET /api/expenses (including summary)
router.get('/', async (req, res) => {
    try {
        const { search, fromDate, toDate, expenseTypeId, expenseSubTypeId, paymentMode } = req.query;

        // Build where clause
        let where = {};
        if (expenseTypeId) where.expenseTypeId = parseInt(expenseTypeId);
        if (expenseSubTypeId) where.expenseSubTypeId = parseInt(expenseSubTypeId);
        if (paymentMode) where.paymentMode = paymentMode;

        if (fromDate || toDate) {
            where.date = {};
            if (fromDate) where.date.gte = fromDate;
            if (toDate) where.date.lte = toDate;
        }

        if (search) {
            where.OR = [
                { receiptNo: { contains: search, mode: 'insensitive' } },
                { receiverName: { contains: search, mode: 'insensitive' } },
                { issuePersonName: { contains: search, mode: 'insensitive' } },
                { remark: { contains: search, mode: 'insensitive' } },
                { expenseType: { name: { contains: search, mode: 'insensitive' } } },
                { expenseSubType: { name: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const expenses = await prisma.expense.findMany({
            where,
            include: {
                expenseType: true,
                expenseSubType: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(expenses);
    } catch (err) {
        console.error('GET /api/expenses error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/expenses/summary
router.get('/summary', async (req, res) => {
    try {
        // Calculate Total Income (from payment installments and admissions)
        const installments = await prisma.paymentInstallment.aggregate({
            _sum: { paidAmount: true }
        });
        
        const admissions = await prisma.admission.aggregate({
            _sum: { admissionFee: true }
        });
        
        // Let's add up admission fees + installment paid amounts.
        // Some systems only count one, but since both have amount fields, we sum them for total revenue.
        const totalIncome = (installments._sum.paidAmount || 0) + (admissions._sum.admissionFee || 0);

        // Calculate Total Expenses
        const expenses = await prisma.expense.aggregate({
            _sum: { amount: true }
        });
        const totalExpenses = expenses._sum.amount || 0;

        // Net Profit/Loss
        const netProfit = totalIncome - totalExpenses;

        // Count for stats
        const admissionCount = await prisma.admission.count();
        const expenseCount = await prisma.expense.count();

        res.json({
            totalIncome,
            totalExpenses,
            netProfit,
            admissionCount,
            expenseCount
        });
    } catch (err) {
        console.error('GET /api/expenses/summary error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/expenses
router.post('/', async (req, res) => {
    try {
        const { expenseTypeId, expenseSubTypeId, receiverName, issuePersonName, amount, paymentMode, date, remark } = req.body;

        if (!expenseTypeId || !expenseSubTypeId || !amount || !paymentMode || !date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const receiptNo = await generateReceiptNo();

        const expense = await prisma.expense.create({
            data: {
                receiptNo,
                expenseTypeId: parseInt(expenseTypeId),
                expenseSubTypeId: parseInt(expenseSubTypeId),
                receiverName,
                issuePersonName,
                amount: parseFloat(amount),
                paymentMode,
                date,
                remark
            },
            include: {
                expenseType: true,
                expenseSubType: true
            }
        });
        res.status(201).json(expense);
    } catch (err) {
        console.error('POST /api/expenses error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.expense.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/expenses/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
