const axios = require('axios');
const crypto = require('crypto');

async function testVerify() {
    try {
        const orderId = 'order_fake123';
        const paymentId = 'pay_fake123';
        const secret = 'vA7iX9n22Q4N6tK6b0uKz1B2'; // need real or we get 400 invalid signature.

        // Actually we can just hit create-order first to get a real order ID?
        // Or I can just check the razorpay_audit.log to see the 500 error!
    } catch(err) {
        console.error(err);
    }
}
