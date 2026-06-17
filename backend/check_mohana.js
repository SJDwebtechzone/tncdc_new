const { pool } = require('./db');
const { prisma } = require('./db');
const fs = require('fs');

async function check() {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', ['listentocoolbreeze@gmail.com']);
    
    if (res.rows.length === 0) return console.log("No user");

    const userRecord = res.rows[0];
    const userEmail = (userRecord.email || '').trim();
    const userMobile = (userRecord.mobile || '').trim();
    const userFirstName = (userRecord.fullName || '').split(' ')[0];

    const orConditions = [];
    if (userEmail) orConditions.push({ email: userEmail });
    if (userMobile) {
        orConditions.push({ mobile: userMobile });
        const normalizedMobile = userMobile.replace(/^0+/, '');
        if (normalizedMobile !== userMobile) {
            orConditions.push({ mobile: normalizedMobile });
        }
    }

    const admissions = await prisma.admission.findMany({
        where: {
            firstName: userFirstName ? { equals: userFirstName, mode: 'insensitive' } : undefined,
            OR: orConditions
        }
    });
    
    console.log(admissions.map(a => a.courseName + ' | ' + a.firstName + ' | ' + a.email));
}
check().catch(console.error).finally(() => process.exit());
