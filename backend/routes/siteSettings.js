const express = require('express');
const { prisma } = require('../db');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// GET site settings
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "SiteSettings" LIMIT 1');
        let paymentActive = false;
        try {
            const paymentResult = await prisma.paymentGatewaySetting.findFirst();
            if (paymentResult) paymentActive = paymentResult.isActive;
        } catch (e) {
            console.error('Error fetching payment settings in siteSettings:', e);
        }

        let settings;
        if (result.rows.length === 0) {
            const insert = await pool.query(
                'INSERT INTO "SiteSettings" ("headerType", "logo", "favicon", "websiteUrl", "playStoreLink", "appStoreLink", "primaryColor", "secondaryColor", "marqueeEntries", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *',
                ['logo', 'https://mum-objectstore.e2enetworks.net/hdi-multi-tenant/tncdc.in/website/logo/image_6979ce5039f69.png', '', '', '', '', '#10b981', '#059669', ['Welcome to TamilNadu Career Development Council', 'Join our courses today!', 'Contact us for more info!']]
            );
            settings = insert.rows[0];
        } else {
            settings = result.rows[0];
        }

        res.json({ ...settings, isPaymentGatewayActive: paymentActive });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update site settings
router.put('/', async (req, res) => {
    try {
        const { headerType, logo, favicon, websiteUrl, playStoreLink, appStoreLink, primaryColor, secondaryColor, marqueeEntries } = req.body;
        const check = await pool.query('SELECT * FROM "SiteSettings" LIMIT 1');

        let result;
        if (check.rows.length === 0) {
            result = await pool.query(
                'INSERT INTO "SiteSettings" ("headerType", "logo", "favicon", "websiteUrl", "playStoreLink", "appStoreLink", "primaryColor", "secondaryColor", "marqueeEntries", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *',
                [headerType, logo, favicon, websiteUrl, playStoreLink, appStoreLink, primaryColor, secondaryColor, marqueeEntries]
            );
        } else {
            result = await pool.query(
                'UPDATE "SiteSettings" SET "headerType"=$1, "logo"=$2, "favicon"=$3, "websiteUrl"=$4, "playStoreLink"=$5, "appStoreLink"=$6, "primaryColor"=$7, "secondaryColor"=$8, "marqueeEntries"=$9, "updatedAt"=NOW() WHERE id=$10 RETURNING *',
                [headerType, logo, favicon, websiteUrl, playStoreLink, appStoreLink, primaryColor, secondaryColor, marqueeEntries, check.rows[0].id]
            );
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;