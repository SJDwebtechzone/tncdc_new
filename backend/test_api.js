const axios = require('axios');

async function test() {
    try {
        const res = await axios.get('http://localhost:5002/api/background-images');
        console.log('STATUS:', res.status);
        console.log('DATA:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('ERROR:', err.response?.data || err.message);
    }
}

test();
