const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing Cloudinary upload with credentials for:', process.env.CLOUDINARY_CLOUD_NAME);

const buf = Buffer.from('test-image-data');
cloudinary.uploader.upload_stream({ folder: 'test_folder' }, (error, result) => {
    if (error) {
        console.error('UPLOAD FAILED:', error);
        process.exit(1);
    } else {
        console.log('UPLOAD SUCCESS:', result.secure_url);
        process.exit(0);
    }
}).end(buf);
