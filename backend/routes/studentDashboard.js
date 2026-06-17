const express = require('express');
const router = express.Router();
const { prisma } = require('../db');
const { pool } = require('../db');

// GET /api/student-dashboard/me?email=student@example.com
// Returns: enrolled courses, attendance %, videos, notes, fee breakdown
router.get('/me', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email query parameter is required' });
        }

        // 1. Find the user record to get their exact mobile, email & name
        const userResult = await pool.query(
            'SELECT email, mobile, "fullName" FROM users WHERE email = $1',
            [email.trim().toLowerCase()]
        );

        if (userResult.rows.length === 0) {
            return res.json({ enrolledCourses: [], summary: null });
        }

        const userRecord = userResult.rows[0];
        const userMobile = (userRecord.mobile || '').trim();
        const userEmail = (userRecord.email || '').trim();
        const userFullName = (userRecord.fullName || '').trim();
        const userFirstName = userFullName.split(' ')[0]; // e.g. "Mohana" from "Mohana Sundaram"

        // 2. Build exact-match conditions for the admission lookup
        const orConditions = [];
        
        // Match by exact email on the admission record
        if (userEmail) {
            orConditions.push({ email: userEmail });
        }
        // Match by exact mobile on the admission record
        if (userMobile) {
            orConditions.push({ mobile: userMobile });
            // Normalize mobile by removing leading zeros for broader match
            const normalizedMobile = userMobile.replace(/^0+/, '');
            if (normalizedMobile !== userMobile) {
                orConditions.push({ mobile: normalizedMobile });
            }
        }

        if (orConditions.length === 0) {
            return res.json({ enrolledCourses: [], summary: null });
        }

        const admissions = await prisma.admission.findMany({
            where: {
                firstName: userFirstName ? { equals: userFirstName, mode: 'insensitive' } : undefined,
                OR: orConditions
            },
            include: {
                installments: {
                    orderBy: { installmentNo: 'asc' }
                },
                attendance: true
            }
        });

        if (!admissions || admissions.length === 0) {
            return res.json({ enrolledCourses: [], summary: null });
        }

        // Fetch all courses to map names to IDs
        const allCourses = await prisma.course.findMany({
            select: { id: true, title: true }
        });

        // Fetch attendance settings for weekend logic
        const attendanceSettings = await prisma.attendanceSettings.findFirst() || { weekOffDays: ["Saturday", "Sunday"] };

        return res.json(buildDashboardResponse(admissions, allCourses, attendanceSettings));
    } catch (err) {
        console.error('GET /api/student-dashboard/me error:', err);
        res.status(500).json({ error: err.message });
    }
});


function buildDashboardResponse(admissions, allCourses = [], settings = { weekOffDays: ["Saturday", "Sunday"] }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const enrolledCourses = admissions.map(adm => {
        // Find corresponding course ID
        const courseRecord = allCourses.find(c => c.title.toLowerCase().trim() === (adm.courseName || '').toLowerCase().trim());
        
        // --- CALC ATTENDANCE (Auto-Absent Logic) ---
        const rawRecords = adm.attendance || [];
        const recordDict = {};
        rawRecords.forEach(r => {
            if (r.date) {
                const d = new Date(r.date);
                d.setHours(0,0,0,0);
                recordDict[d.toISOString().split('T')[0]] = (r.status || '').trim().toLowerCase();
            }
        });

        let presentCount = 0;
        let absentCount = 0;
        let holidayCount = 0;
        let leaveCount = 0;
        let totalDays = 0;

        if (adm.admissionDate) {
            const startDate = new Date(adm.admissionDate);
            startDate.setHours(0, 0, 0, 0);

            const iter = new Date(startDate);
            while (iter <= today) {
                const dateStr = iter.toISOString().split('T')[0];
                const dayName = iter.toLocaleDateString('en-US', { weekday: 'long' });
                const isWeekend = (settings.weekOffDays || []).includes(dayName);
                
                const status = recordDict[dateStr];
                
                if (status) {
                    if (status === 'present') presentCount++;
                    else if (status === 'absent') absentCount++;
                    else if (status === 'holiday') holidayCount++;
                    else if (status === 'leave' || status === 'leaves') leaveCount++;
                    totalDays++;
                } else if (!isWeekend) {
                    // Auto-Absent for past weekdays with no record
                    absentCount++;
                    totalDays++;
                }
                
                iter.setDate(iter.getDate() + 1);
            }
        }

        const workingDays = totalDays - holidayCount;
        const attendancePercent = workingDays > 0 
            ? Math.round((presentCount / workingDays) * 100) 
            : 0;

        // --- CALC FEES ---
        const totalFee = adm.finalAmount || adm.courseFee || 0;
        const paidAmount = adm.installments?.reduce((sum, inst) => sum + (inst.paidAmount || 0), 0) || 0;
        const totalPaid = paidAmount > 0 ? paidAmount : (adm.admissionFee || 0);
        const balanceDue = Math.max(0, totalFee - totalPaid);

        return {
            admissionId: adm.id,
            courseId: courseRecord ? courseRecord.id : null,
            studentId: adm.studentId,
            courseName: adm.courseName,
            courseType: adm.courseType,
            batch: adm.batch,
            admissionDate: adm.admissionDate,
            status: adm.status,
            // Attendance
            attendance: {
                total: totalDays,
                present: presentCount,
                absent: absentCount,
                percentage: attendancePercent,
                records: rawRecords
            },
            // Fee Details
            fees: {
                courseFee: adm.courseFee || 0,
                discountType: adm.discountType,
                discountValue: adm.discountValue || 0,
                gstAmount: adm.gstAmount || 0,
                totalFee: totalFee,
                admissionFee: adm.admissionFee || 0,
                totalPaid: totalPaid,
                balanceDue: balanceDue,
                paymentProgress: totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0
            },
            // Installments
            installments: (adm.installments || []).map(inst => ({
                installmentNo: inst.installmentNo,
                amount: inst.amount,
                paidAmount: inst.paidAmount,
                dueDate: inst.dueDate,
                paidDate: inst.paidDate,
                status: inst.status,
                paymentMethod: inst.paymentMethod
            }))
        };
    });

    // Summary across all courses
    const totalFeeAll = enrolledCourses.reduce((s, c) => s + c.fees.totalFee, 0);
    const totalPaidAll = enrolledCourses.reduce((s, c) => s + c.fees.totalPaid, 0);
    const totalBalanceAll = enrolledCourses.reduce((s, c) => s + c.fees.balanceDue, 0);

    // Referral Code Generation (Deterministic based on first student record)
    const primaryStudent = admissions[0];
    const firstName = (primaryStudent?.firstName || 'USER').split(' ')[0].toUpperCase();
    const referralCode = `TNCDC${firstName}${primaryStudent?.id || '00'}`;

    return {
        enrolledCourses,
        summary: {
            totalCourses: enrolledCourses.length,
            totalFee: totalFeeAll,
            totalPaid: totalPaidAll,
            totalBalance: totalBalanceAll,
            overallPaymentProgress: totalFeeAll > 0 ? Math.round((totalPaidAll / totalFeeAll) * 100) : 0,
            referralCode
        }
    };
}

// GET /api/student-dashboard/course-resources/:courseName
// Returns videos and notes for a specific course by name
router.get('/course-resources/:courseName', async (req, res) => {
    try {
        const { courseName } = req.params;

        // Find the course by name
        const course = await prisma.course.findFirst({
            where: {
                title: {
                    contains: courseName,
                    mode: 'insensitive'
                }
            },
            include: {
                videos: true,
                notes: true
            }
        });

        if (!course) {
            return res.json({ videos: [], notes: [], courseId: null });
        }

        res.json({
            courseId: course.id,
            courseTitle: course.title,
            courseImage: course.imageUrl,
            duration: course.duration,
            durationUnit: course.durationUnit,
            videos: course.videos || [],
            notes: course.notes || []
        });
    } catch (err) {
        console.error('GET /api/student-dashboard/course-resources error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/student-dashboard/profile?email=student@example.com
router.get('/profile', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        // 1. Get User record
        const user = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        // 2. Get Admission + Enquiry record
        const admission = await prisma.admission.findFirst({
            where: { email: { equals: email.trim().toLowerCase(), mode: 'insensitive' } },
            include: { enquiry: true }
        });

        // Merge data: User table is primary, but fallback to Admission/Enquiry for missing fields
        const profile = {
            id: user.id,
            fullName: user.fullName || (admission ? `${admission.firstName} ${admission.surname}` : ''),
            email: user.email,
            mobile: user.mobile || admission?.mobile || '',
            address: user.address || admission?.enquiry?.address || '',
            dateOfBirth: user.dateOfBirth || admission?.enquiry?.dob || '',
            profilePhoto: user.profilePhoto || admission?.enquiry?.profileImage || '',
            employeeId: user.employeeId || admission?.studentId || '',
            gender: admission?.enquiry?.gender || '',
            city: admission?.enquiry?.city || '',
            state: admission?.enquiry?.state || '',
            pincode: admission?.enquiry?.pincode || '',
        };

        res.json(profile);
    } catch (err) {
        console.error('GET /api/student-dashboard/profile error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
