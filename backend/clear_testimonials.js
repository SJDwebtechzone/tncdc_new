const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.testimonial.deleteMany({});
        console.log('All testimonials removed from the database.');
    } catch (error) {
        console.error('Error clearing testimonials:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
