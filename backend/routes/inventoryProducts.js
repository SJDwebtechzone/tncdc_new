const express = require('express');
const router = express.Router();
const { prisma } = require('../db');
const multer = require('multer');
const { supabase } = require('../supabase');
const path = require('path');

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'));
        }
    }
});

// GET /api/inventory-products
router.get('/', async (req, res) => {
    try {
        const { search, categoryId } = req.query;
        let where = {};
        
        if (categoryId) where.categoryId = parseInt(categoryId);
        
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { category: { name: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const products = await prisma.inventoryProduct.findMany({
            where,
            include: {
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (err) {
        console.error('GET /api/inventory-products error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/inventory-products
router.post('/', upload.single('productImage'), async (req, res) => {
    try {
        const { categoryId, name, mrp, price, quantity, stockDate, status } = req.body;
        
        if (!categoryId || !name || !mrp || !price || !quantity || !stockDate) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        let imageUrl = null;
        if (req.file) {
            const fileExt = path.extname(req.file.originalname);
            const fileName = `inventory-product-${Date.now()}${fileExt}`;
            
            const { data, error } = await supabase.storage
                .from('gallery') // Reuse gallery bucket or whatever is public
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;
            
            const { data: publicUrlData } = supabase.storage
                .from('gallery')
                .getPublicUrl(fileName);
                
            imageUrl = publicUrlData.publicUrl;
        }

        const product = await prisma.inventoryProduct.create({
            data: {
                categoryId: parseInt(categoryId),
                name,
                mrp: parseFloat(mrp),
                price: parseFloat(price),
                quantity: parseInt(quantity),
                stockDate,
                imageUrl,
                status: status === 'Active' || status === 'true' || status === true
            },
            include: {
                category: true
            }
        });
        res.status(201).json(product);
    } catch (err) {
        console.error('POST /api/inventory-products error:', err);
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Product name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/inventory-products/:id
router.put('/:id', upload.single('productImage'), async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, name, mrp, price, quantity, stockDate, status } = req.body;
        const updateData = {};
        
        if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);
        if (name !== undefined) updateData.name = name;
        if (mrp !== undefined) updateData.mrp = parseFloat(mrp);
        if (price !== undefined) updateData.price = parseFloat(price);
        if (quantity !== undefined) updateData.quantity = parseInt(quantity);
        if (stockDate !== undefined) updateData.stockDate = stockDate;
        
        if (status !== undefined) {
            updateData.status = status === 'Active' || status === 'true' || status === true;
        }

        if (req.file) {
            const fileExt = path.extname(req.file.originalname);
            const fileName = `inventory-product-${Date.now()}${fileExt}`;
            
            const { data, error } = await supabase.storage
                .from('gallery')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;
            
            const { data: publicUrlData } = supabase.storage
                .from('gallery')
                .getPublicUrl(fileName);
                
            updateData.imageUrl = publicUrlData.publicUrl;
        }

        const product = await prisma.inventoryProduct.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                category: true
            }
        });
        res.json(product);
    } catch (err) {
        console.error('PUT /api/inventory-products/:id error:', err);
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Product name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/inventory-products/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.inventoryProduct.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/inventory-products/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
