const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function createDesignationsTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS designations (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(255) UNIQUE NOT NULL,
      "status" BOOLEAN DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
    try {
        await pool.query(query);
        console.log("Table 'designations' ensured.");
    } catch (err) {
        console.error("Error creating designations table:", err);
    } finally {
        pool.end();
    }
}

createDesignationsTable();
