require('dotenv').config();
const { pool } = require('./db');

pool.query('TRUNCATE TABLE batches RESTART IDENTITY CASCADE')
    .then(() => {
        console.log("Test data cleared from batches table.");
    })
    .catch((err) => {
        console.error("Error clearing batches table:", err);
    })
    .finally(() => {
        process.exit(0);
    });
