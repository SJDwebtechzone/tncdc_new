const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    try {
        const subjects = await prisma.subject.findMany({
            include: { questionBanks: true }
        });
        console.log(JSON.stringify(subjects, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
