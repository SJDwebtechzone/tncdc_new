const { prisma } = require('./db');
const fs = require('fs');

async function check() {
    const adms = await prisma.admission.findMany();
    
    fs.writeFileSync('all_admissions.json', JSON.stringify(adms, null, 2));
}
check().catch(console.error).finally(() => process.exit());
