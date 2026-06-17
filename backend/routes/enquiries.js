const express = require('express');
const { prisma } = require('../db');
const router = express.Router();
const multer = require('multer');
const { supabase } = require('../supabase');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper for Supabase Upload
async function uploadToSupabase(file, folder = 'enquiries') {
    if (!file) return null;
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
        .from('Images') // Assuming we use same bucket or you want a new one. I'll use 'Images' for simplicity as it exists.
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('Images')
        .getPublicUrl(fileName);

    return publicUrl;
}

// Multi-file upload configuration
const enquiryUpload = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
]);

// GET all enquiries
router.get('/', async (req, res) => {
    try {
        const enquiries = await prisma.enquiry.findMany({
            include: {
                followUps: {
                    orderBy: { followUpDate: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(enquiries);
    } catch (err) {
        console.error('GET /api/enquiries error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new enquiry
router.post('/', enquiryUpload, async (req, res) => {
    try {
        const data = req.body;
        const files = req.files;

        const profileImage = await uploadToSupabase(files['profileImage'] ? files['profileImage'][0] : null, 'enquiries/profile');
        const signature = await uploadToSupabase(files['signature'] ? files['signature'][0] : null, 'enquiries/signature');

        const newEnquiry = await prisma.enquiry.create({
            data: {
                firstName: data.name || data.firstName,
                relationship: data.relationship || 'Select',
                parentName: data.parentName || '',
                surname: data.surname || '',
                dob: data.dob,
                gender: data.gender || 'Select',
                pincode: data.pincode,
                mobile: data.mobile,
                alternateMobile: data.alternateMobile || '',
                email: data.email || '',
                address: data.address || '',
                course: data.course,
                source: data.source || 'Unknown',
                assignedTo: data.assignedTo || 'Unassigned',
                profileImage,
                signature,
                motherName: data.motherName || '',
                maritalStatus: data.maritalStatus || 'Single',
                qualification: data.qualification || '',
                cast: data.cast || '',
                state: data.state || 'Tamil Nadu',
                city: data.city || '',
                status: 'New'
            }
        });

        res.status(201).json(newEnquiry);

        // Create notification for dashboard (fire-and-forget)
        try {
            await prisma.notification.create({
                data: {
                    title: '🎓 New Website Enquiry',
                    message: `${newEnquiry.firstName} enquired about "${newEnquiry.course}" via the website.`,
                    type: 'enquiry',
                    link: `/dashboard/students/enquiries?id=${newEnquiry.id}`,
                }
            });
        } catch (notifErr) {
            console.error('Notification creation failed:', notifErr);
        }
    } catch (err) {
        console.error('POST /api/enquiries error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT update enquiry
router.put('/:id', enquiryUpload, async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const files = req.files;

        const updateData = {
            firstName: data.name || data.firstName,
            relationship: data.relationship,
            parentName: data.parentName,
            surname: data.surname,
            dob: data.dob,
            gender: data.gender,
            pincode: data.pincode,
            mobile: data.mobile,
            alternateMobile: data.alternateMobile,
            email: data.email,
            address: data.address,
            course: data.course,
            source: data.source,
            assignedTo: data.assignedTo,
            motherName: data.motherName,
            maritalStatus: data.maritalStatus,
            qualification: data.qualification,
            cast: data.cast,
            state: data.state,
            city: data.city,
            status: data.status
        };

        if (files['profileImage']) {
            updateData.profileImage = await uploadToSupabase(files['profileImage'][0], 'enquiries/profile');
        }
        if (files['signature']) {
            updateData.signature = await uploadToSupabase(files['signature'][0], 'enquiries/signature');
        }

        const updatedEnquiry = await prisma.enquiry.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.json(updatedEnquiry);
    } catch (err) {
        console.error('PUT /api/enquiries error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE enquiry
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.enquiry.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Enquiry deleted successfully' });
    } catch (err) {
        console.error('DELETE /api/enquiries error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
