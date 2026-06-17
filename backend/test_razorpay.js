const http = require('http');

const data = JSON.stringify({
  amount: 38000,
  currency: 'INR',
  receipt: 'test1234',
  notes: {}
});

const options = {
  hostname: 'localhost',
  port: 5002,
  path: '/api/razorpay/create-order',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
