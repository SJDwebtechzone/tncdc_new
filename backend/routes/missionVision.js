const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { prisma } = require('../db');

const { supabase } = require('../supabase');

// --- Multer Setup ---
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Helper for Supabase Upload
async function uploadToSupabase(file, folder = 'mission-vision') {
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
  { name: 'videoImage', maxCount: 1 },
  { name: 'visionImage1', maxCount: 1 },
  { name: 'visionImage2', maxCount: 1 },
  { name: 'visionImage3', maxCount: 1 },
  { name: 'missionImage1', maxCount: 1 },
  { name: 'missionImage2', maxCount: 1 },
  { name: 'missionImage3', maxCount: 1 }
]);

// --- GET /api/mission-vision ---
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.missionVision.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 }
    });
    res.json(settings);
  } catch (err) {
    console.error('GET /api/mission-vision error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- PUT /api/mission-vision ---
router.put('/', (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const data = { ...req.body };
      
      // Update file paths if new files are uploaded
      const imageFields = [
        'videoImage', 
        'visionImage1', 'visionImage2', 'visionImage3',
        'missionImage1', 'missionImage2', 'missionImage3'
      ];

      for (const field of imageFields) {
        if (req.files?.[field]) {
          data[field] = await uploadToSupabase(req.files[field][0], `mission-vision/${field}`);
        }
      }

      const updated = await prisma.missionVision.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data }
      });

      res.json(updated);
    } catch (err) {
      console.error('PUT /api/mission-vision error:', err);
      res.status(500).json({ error: err.message });
    }
  });
});

module.exports = router;
