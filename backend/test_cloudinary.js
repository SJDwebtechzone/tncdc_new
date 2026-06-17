const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinary() {
    try {
        console.log('Testing Cloudinary config...');
        console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
        console.log('API Key:', process.env.CLOUDINARY_API_KEY);
        // Don't log full secret for safety, just first 4 chars
        console.log('API Secret (First 4):', process.env.CLOUDINARY_API_SECRET?.substring(0, 4) + '...');
        
        const result = await cloudinary.api.ping();
        console.log('Cloudinary Ping Result:', result);
    } catch (error) {
        console.error('Cloudinary Test Failed:', error.message);
        if (error.http_code) console.error('Status Code:', error.http_code);
    }
}

testCloudinary();
