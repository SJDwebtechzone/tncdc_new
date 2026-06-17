const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const sql = `
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    "admissionId" INTEGER NOT NULL,
    "examResultId" INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Requested',
    "issuedDate" TIMESTAMP,
    "certificateNo" TEXT UNIQUE,
    remarks TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("admissionId") REFERENCES admissions(id) ON DELETE CASCADE,
    FOREIGN KEY ("examResultId") REFERENCES exam_results(id) ON DELETE CASCADE
);
`;

async function run() {
  try {
    await client.connect();
    await client.query(sql);
    console.log("Table 'certificates' created successfully!");
  } catch (err) {
    console.error("Error creating table:", err.message);
  } finally {
    await client.end();
  }
}

run();
