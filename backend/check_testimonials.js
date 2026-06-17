const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.testimonial.count();
        console.log('--- TESTIMONIAL DB CHECK ---');
        console.log('Total Testimonials:', count);
        const settings = await prisma.testimonialSettings.findFirst();
        console.log('Settings:', settings);
        console.log('---------------------------');
    } catch (error) {
        console.error('Error checking DB:', error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
