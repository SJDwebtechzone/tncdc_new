const { pool } = require('./db');
const fs = require('fs');

async function check() {
    const res = await pool.query('SELECT * FROM users');
    
    fs.writeFileSync('all_users.json', JSON.stringify(res.rows, null, 2));
}
check().catch(console.error).finally(() => process.exit());
