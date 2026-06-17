const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadToSupabase, deleteFromSupabase } = require('../supabase');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create event
router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    const { title, date, time, location, description, status } = req.body;
    let imageUrl = req.body.image || '';

    if (req.file) {
      imageUrl = await uploadToSupabase(req.file, 'Images');
    }

    const event = await prisma.event.create({
      data: {
        title,
        date,
        time: time || '',
        location: location || '',
        description: description || '',
        image: imageUrl,
        status: status === 'false' || status === false ? false : true
      }
    });
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', upload.single('imageFile'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, time, location, description, status } = req.body;
    let imageUrl = req.body.image || '';

    if (req.file) {
      imageUrl = await uploadToSupabase(req.file, 'Images');
    }

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        date,
        time: time || '',
        location: location || '',
        description: description || '',
        image: imageUrl,
        status: status === 'false' || status === false ? false : true
      }
    });
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally delete from supabase if it contains the public URL
    const event = await prisma.event.findUnique({ where: { id: parseInt(id) }});
    if (event && event.image) {
       await deleteFromSupabase(event.image, 'Images');
    }
    
    await prisma.event.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
