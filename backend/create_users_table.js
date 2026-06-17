const { pool } = require('./db');

async function createUsersTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                "fullName" VARCHAR(255) DEFAULT '',
                mobile VARCHAR(20) DEFAULT '',
                "employeeId" VARCHAR(100) DEFAULT '',
                "dateOfJoining" VARCHAR(20) DEFAULT '',
                department VARCHAR(255) DEFAULT '',
                designation VARCHAR(255) DEFAULT '',
                qualification VARCHAR(255) DEFAULT '',
                "dateOfBirth" VARCHAR(20) DEFAULT '',
                address TEXT DEFAULT '',
                "profilePhoto" TEXT DEFAULT '',
                roles TEXT[] DEFAULT '{}',
                "createdAt" TIMESTAMP DEFAULT NOW(),
                "updatedAt" TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ users table created successfully!');
    } catch (err) {
        console.error('❌ Error creating users table:', err.message);
    } finally {
        await pool.end();
    }
}

createUsersTable();
