const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { prisma } = require('../db');
const { supabase, deleteFromSupabase } = require('../supabase');

// ─── Multer Setup ─────────────────────────────────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Helper for Supabase Upload
async function uploadToSupabase(file, folder = 'profile') {
    if (!file) return null;
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
        .from('Images')
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

const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
  { name: 'controllerSignature', maxCount: 1 }
]);

// ─── GET /api/profile ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const profile = await prisma.instituteProfile.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 }
    });
    res.json(profile);
  } catch (err) {
    console.error('GET /api/profile error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/profile ─────────────────────────────────────────────────────────
router.put('/', (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const {
        instituteName, ownerName, designation, email, dob,
        mobile, alternateMobile, address, state,
        city, pincode, controllerName, showController, showDirector
      } = req.body;

      const updateData = {
        instituteName,
        ownerName,
        designation,
        email,
        dob,
        mobile,
        alternateMobile,
        address,
        state,
        city,
        pincode,
        controllerName,
        showController: showController === 'true' || showController === true,
        showDirector: showDirector === 'true' || showDirector === true,
      };

      // Only update file URLs if a new file was uploaded
      if (req.files?.logo)
        updateData.logoUrl = await uploadToSupabase(req.files.logo[0], 'profile/logo');

      if (req.files?.signature)
        updateData.signatureUrl = await uploadToSupabase(req.files.signature[0], 'profile/signature');

      if (req.files?.controllerSignature)
        updateData.controllerSignatureUrl = await uploadToSupabase(req.files.controllerSignature[0], 'profile/controller-signature');

      const updated = await prisma.instituteProfile.upsert({
        where: { id: 1 },
        update: updateData,
        create: { id: 1, ...updateData }
      });

      res.json(updated);
    } catch (err) {
      console.error('PUT /api/profile error:', err);
      res.status(500).json({ error: err.message });
    }
  });
});

// ─── DELETE /api/profile/file/:type ──────────────────────────────────────────
router.delete('/file/:type', async (req, res) => {
  const { type } = req.params;

  const fieldMap = {
    logo: 'logoUrl',
    signature: 'signatureUrl',
    controllerSignature: 'controllerSignatureUrl'
  };

  const field = fieldMap[type];
  if (!field) return res.status(400).json({ error: 'Invalid file type' });

  try {
    const profile = await prisma.instituteProfile.findUnique({ where: { id: 1 } });
    const filePath = profile?.[field];

    if (filePath) {
      await deleteFromSupabase(filePath);
    }

    await prisma.instituteProfile.update({
      where: { id: 1 },
      data: { [field]: '' }
    });

    res.json({ success: true, type });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Multer Upload Error:', err);
      return res.status(err instanceof multer.MulterError || err.message.includes('Only') ? 400 : 500).json({ error: err.message });
    }
    
    console.log('--- Upload Request Started ---');
    try {
      if (!req.file) {
        console.error('Upload Error: No file in request');
        return res.status(400).json({ error: 'No file uploaded' });
      }
      console.log('File uploaded successfully:', req.file.originalname);
      const fileUrl = await uploadToSupabase(req.file, 'profile/uploads');
      res.json({ fileUrl });
    } catch (err) {
      console.error('Upload Route Exception:', err);
      res.status(500).json({ error: err.message });
    }
  });
});

module.exports = router;