const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// Get all certificate applications
router.get('/', async (req, res) => {
    try {
        // Fallback for if Prisma hasn't generated the model yet
        if (!prisma.certificate) {
            const results = await prisma.$queryRaw`
                SELECT c.*, 
                json_build_object(
                    'id', a.id, 
                    'firstName', a."firstName", 
                    'surname', a.surname, 
                    'studentId', a."studentId", 
                    'courseName', a."courseName",
                    'enquiry', json_build_object('profileImage', e."profileImage")
                ) as admission,
                json_build_object(
                    'id', r.id, 
                    'semesterName', r."semesterName", 
                    'percentage', r.percentage, 
                    'grade', r.grade,
                    'result', r.result
                ) as "examResult"
                FROM certificates c
                JOIN admissions a ON c."admissionId" = a.id
                LEFT JOIN enquiries e ON a."enquiryId" = e.id
                JOIN exam_results r ON c."examResultId" = r.id
            `;
            return res.json(results);
        }

        const certificates = await prisma.certificate.findMany({
            include: {
                admission: {
                    include: {
                        enquiry: true
                    }
                },
                examResult: true
            }
        });
        res.json(certificates);
    } catch (err) {
        console.error('GET /api/certificates error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create/Apply for a certificate
router.post('/', async (req, res) => {
    const { admissionId, examResultId, remarks, status } = req.body;
    try {
        if (!prisma.certificate) {
             // Manual check if Prisma client is stale for check existing
             const existing = await prisma.$queryRaw`
                SELECT id FROM certificates 
                WHERE "admissionId" = ${parseInt(admissionId)} AND "examResultId" = ${parseInt(examResultId)}
                LIMIT 1
             `;
             
             if (existing && existing.length > 0) {
                 await prisma.$executeRaw`
                    UPDATE certificates 
                    SET status = ${status || 'Requested'}, remarks = ${remarks || ''}, "updatedAt" = NOW()
                    WHERE id = ${existing[0].id}
                 `;
                 return res.json({ success: true, updated: true });
             }

             // Manual insert if Prisma client is stale
             await prisma.$executeRaw`
                INSERT INTO certificates ("admissionId", "examResultId", remarks, status, "updatedAt")
                VALUES (${parseInt(admissionId)}, ${parseInt(examResultId)}, ${remarks || ''}, ${status || 'Requested'}, NOW())
             `;
             return res.json({ success: true });
        }

        const existing = await prisma.certificate.findFirst({
            where: {
                admissionId: parseInt(admissionId),
                examResultId: parseInt(examResultId)
            }
        });

        if (existing) {
            // If it exists, update it instead of failing
            const updated = await prisma.certificate.update({
                where: { id: existing.id },
                data: {
                    status: status || 'Requested',
                    remarks: remarks || existing.remarks,
                    issuedDate: status === 'Approved' ? new Date() : existing.issuedDate,
                    certificateNo: (status === 'Approved' && !existing.certificateNo) ? `TNCDC-${Date.now()}` : existing.certificateNo
                }
            });
            return res.json(updated);
        }

        const certificate = await prisma.certificate.create({
            data: {
                admissionId: parseInt(admissionId),
                examResultId: parseInt(examResultId),
                status: status || 'Requested',
                remarks: remarks || '',
                issuedDate: status === 'Approved' ? new Date() : null,
                certificateNo: status === 'Approved' ? `TNCDC-${Date.now()}` : null
            }
        });
        res.json(certificate);
    } catch (err) {
        console.error('POST /api/certificates error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update certificate status (Approve/Reject)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, remarks, certificateNo } = req.body;
    try {
        const data = { status, remarks };
        if (status === 'Approved') {
            data.issuedDate = new Date();
            data.certificateNo = certificateNo || `TNCDC-${Date.now()}`;
        }

        if (!prisma.certificate) {
             await prisma.$executeRaw`
                UPDATE certificates 
                SET status = ${status}, remarks = ${remarks || ''}, "certificateNo" = ${data.certificateNo || null}, "issuedDate" = ${data.issuedDate || null}, "updatedAt" = NOW()
                WHERE id = ${parseInt(id)}
             `;
             return res.json({ success: true });
        }

        const certificate = await prisma.certificate.update({
            where: { id: parseInt(id) },
            data
        });
        res.json(certificate);
    } catch (err) {
        console.error('PATCH /api/certificates/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Verify certificate by number (Public)
router.get('/verify/:certNo', async (req, res) => {
    const { certNo } = req.params;
    try {
        if (!prisma.certificate) {
            const results = await prisma.$queryRaw`
                SELECT c.*, 
                json_build_object(
                    'firstName', a."firstName", 
                    'surname', a.surname, 
                    'courseName', a."courseName",
                    'courseDuration', a."courseDuration",
                    'admissionDate', a."admissionDate",
                    'batch', a.batch,
                    'enquiry', json_build_object('profileImage', e."profileImage")
                ) as admission,
                json_build_object(
                    'semesterName', r."semesterName", 
                    'percentage', r.percentage, 
                    'grade', r.grade,
                    'result', r.result
                ) as "examResult"
                FROM certificates c
                JOIN admissions a ON c."admissionId" = a.id
                LEFT JOIN enquiries e ON a."enquiryId" = e.id
                JOIN exam_results r ON c."examResultId" = r.id
                WHERE c."certificateNo" = ${certNo} AND c.status = 'Approved'
                LIMIT 1
            `;
            if (!results || results.length === 0) {
                return res.status(404).json({ error: 'Certificate not found or not approved' });
            }
            return res.json(results[0]);
        }

        const certificate = await prisma.certificate.findFirst({
            where: {
                certificateNo: certNo,
                status: 'Approved'
            },
            include: {
                admission: {
                    include: {
                        enquiry: true
                    }
                },
                examResult: true
            }
        });

        if (!certificate) {
            return res.status(404).json({ error: 'Certificate not found or not approved' });
        }

        res.json(certificate);
    } catch (err) {
        console.error('Verify Certificate error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
