const axios = require('axios');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

async function testFullApiVerify() {
    const prisma = new PrismaClient();
    try {
        const settings = await prisma.paymentGatewaySetting.findFirst();
        const secret = settings.razorpaySecret.trim();
        
        const order_id = 'order_fake999';
        const payment_id = 'pay_fake999';
        
        const body = order_id + "|" + payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const payload = {
            razorpay_order_id: order_id,
            razorpay_payment_id: payment_id,
            razorpay_signature: expectedSignature,
            studentDetails: {
                firstName: "ApiTest",
                lastName: "User",
                email: "api@example.com",
                mobile: "9999999999",
                password: "123",
                dob: "2000-01-01",
                pincode: "111111",
                address: "Test Data"
            },
            courseDetails: {
                title: "Test Course",
                courseType: "Diploma",
                price: 1000
            }
        };

        const res = await axios.post('http://localhost:5002/api/razorpay/verify-payment', payload);
        console.log("Success! Server Response:");
        console.log(res.data);
    } catch(err) {
        console.error("FAIL! Axios Error Response:");
        console.error(err.response?.data || err.message);
    } finally {
        await prisma.$disconnect();
    }
}
testFullApiVerify();
