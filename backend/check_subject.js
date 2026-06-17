const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const subject = await prisma.subject.findFirst({
            orderBy: { createdAt: 'desc' },
            include: { questionBanks: true }
        });
        console.log('Latest Subject:', JSON.stringify(subject, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
