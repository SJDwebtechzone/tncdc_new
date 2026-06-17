const axios = require('axios');

async function checkHealth() {
    try {
        const res = await axios.get('http://localhost:5001/api/enquiries');
        console.log('API Health Check: Success');
        console.log('Status:', res.status);
        console.log('Data count:', res.data.length);
    } catch (err) {
        console.error('API Health Check: Failed');
        console.error(err.message);
    }
}

checkHealth();
