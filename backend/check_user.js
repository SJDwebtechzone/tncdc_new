const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:1234@localhost:5432/admin_tncdc' });

async function checkUser() {
    try {
        await client.connect();
        const email = 'smvilakku@gmail.com';
        const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('Users found:', JSON.stringify(res.rows, null, 2));
        
        const res2 = await client.query('SELECT * FROM "admissions" WHERE email = $1', [email]);
        console.log('Admissions found:', JSON.stringify(res2.rows, null, 2));
        
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkUser();
