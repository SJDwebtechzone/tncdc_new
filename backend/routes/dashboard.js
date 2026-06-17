const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get dashboard statistics
router.get("/stats", async (req, res) => {
    try {
        const admissions = await prisma.admission.count();
        const enquiries = await prisma.enquiry.count();
        
        // Count users with 'FRANCHISE' role
        const franchises = await prisma.user.count({
            where: {
                roles: {
                    has: 'FRANCHISE'
                }
            }
        });
        
        const courses = await prisma.course.count();

        // Calculate Fees
        const admissionsList = await prisma.admission.findMany({
            select: {
                finalAmount: true,
                admissionFee: true
            }
        });

        let totalFees = 0;
        let paidFees = 0;

        admissionsList.forEach(adm => {
            totalFees += adm.finalAmount || 0;
            paidFees += adm.admissionFee || 0;
        });

        const pendingFees = totalFees - paidFees;
        
        // Get Upcoming Installments
        const upcomingInstallments = await prisma.paymentInstallment.findMany({
            where: {
                status: 'Pending',
                dueDate: {
                    gte: new Date()
                }
            },
            take: 5,
            orderBy: {
                dueDate: 'asc'
            },
            include: {
                admission: {
                    select: {
                        firstName: true,
                        surname: true,
                        courseName: true,
                        studentId: true
                    }
                }
            }
        });

        res.json({
            admissions,
            enquiries,
            franchises,
            courses,
            fees: {
                total: totalFees,
                paid: paidFees,
                pending: pendingFees
            },
            upcomingInstallments: upcomingInstallments.map(inst => ({
                id: inst.id,
                studentName: `${inst.admission.firstName} ${inst.admission.surname}`,
                courseName: inst.admission.courseName,
                rollNumber: inst.admission.studentId,
                amount: inst.amount,
                dueDate: inst.dueDate,
                installmentNo: inst.installmentNo
            })),
            paidInstallments: (await prisma.paymentInstallment.findMany({
                where: { status: 'Paid' },
                take: 5,
                orderBy: { paidDate: 'desc' },
                include: {
                    admission: {
                        select: {
                            firstName: true,
                            surname: true,
                            courseName: true,
                            studentId: true
                        }
                    }
                }
            })).map(inst => ({
                id: inst.id,
                studentName: `${inst.admission.firstName} ${inst.admission.surname}`,
                courseName: inst.admission.courseName,
                rollNumber: inst.admission.studentId,
                amount: inst.paidAmount,
                paidDate: inst.paidDate,
                paymentMethod: inst.paymentMethod
            }))
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
});

module.exports = router;
