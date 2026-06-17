const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixLinks() {
    try {
        const result = await prisma.notification.updateMany({
            where: {
                link: '/dashboard/enquiries'
            },
            data: {
                link: '/dashboard/students/enquiries'
            }
        });
        console.log(`Updated ${result.count} notification links.`);
    } catch (err) {
        console.error('Error updating links:', err);
    } finally {
        await prisma.$disconnect();
    }
}

fixLinks();
