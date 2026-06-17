const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function createRolesTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS roles (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(255) UNIQUE NOT NULL,
      "permissions" JSONB NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
    try {
        await pool.query(query);
        console.log("Table 'roles' ensured.");
    } catch (err) {
        console.error("Error creating roles table:", err);
    } finally {
        pool.end();
    }
}

createRolesTable();
