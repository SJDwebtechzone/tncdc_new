const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadToSupabase, deleteFromSupabase } = require('../supabase');

// Get all partners
router.get('/', async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// Create partner
router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    const { name, link, status } = req.body;
    let imageUrl = req.body.image || '';

    if (req.file) {
      imageUrl = await uploadToSupabase(req.file, 'Images');
    }

    const partner = await prisma.partner.create({
      data: {
        name: name || '',
        link: link || '',
        imageUrl,
        status: status === 'false' || status === false ? false : true
      }
    });
    res.status(201).json(partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ error: 'Failed to create partner' });
  }
});

// Update partner
router.put('/:id', upload.single('imageFile'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link, status } = req.body;
    let imageUrl = req.body.image || '';

    if (req.file) {
      imageUrl = await uploadToSupabase(req.file, 'Images');
    }

    const partner = await prisma.partner.update({
      where: { id: parseInt(id) },
      data: {
        name: name || '',
        link: link || '',
        imageUrl,
        status: status === 'false' || status === false ? false : true
      }
    });
    res.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ error: 'Failed to update partner' });
  }
});

// Delete partner
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await prisma.partner.findUnique({ where: { id: parseInt(id) }});
    if (partner && partner.imageUrl) {
       await deleteFromSupabase(partner.imageUrl, 'Images');
    }
    
    await prisma.partner.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ error: 'Failed to delete partner' });
  }
});

module.exports = router;
