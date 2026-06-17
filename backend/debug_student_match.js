const { pool, prisma } = require('./db');
const fs = require('fs');

async function check() {
    let output = '';

    const users = await pool.query("SELECT id, email, mobile, \"fullName\", roles FROM users ORDER BY id");
    output += '=== ALL Users ===\n';
    for (const u of users.rows) {
        output += `ID:${u.id} | Name:${u.fullName} | E:${u.email} | M:${u.mobile} | R:${JSON.stringify(u.roles)}\n`;
    }

    const admissions = await prisma.admission.findMany({
        select: { id: true, firstName: true, surname: true, email: true, mobile: true, courseName: true }
    });
    output += '\n=== Admissions ===\n';
    for (const a of admissions) {
        output += `ID:${a.id} | Name:${a.firstName} ${a.surname} | E:${a.email} | M:${a.mobile} | C:${a.courseName}\n`;
    }

    fs.writeFileSync('debug_result.txt', output, 'utf8');
    console.log('Done');
    process.exit();
}
check();
