const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:1234@localhost:5432/admin_tncdc'
});

const sql = `
CREATE TABLE IF NOT EXISTS batches (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    "fromTime" TEXT NOT NULL,
    "toTime" TEXT NOT NULL,
    timing TEXT NOT NULL,
    "totalStudents" TEXT NOT NULL,
    "totalAmount" TEXT DEFAULT '18,000.00',
    "paidAmount" TEXT DEFAULT '0.00',
    "remainingAmount" TEXT DEFAULT '18,000.00',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);
`;

async function run() {
    try {
        await client.connect();
        await client.query(sql);
        console.log("Table 'batches' created successfully");

        // Verify
        const res = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
        console.log("Existing tables:", res.rows.map(r => r.tablename));

    } catch (err) {
        console.error("Error creating table:", err);
    } finally {
        await client.end();
    }
}

run();
