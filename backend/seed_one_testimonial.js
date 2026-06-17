const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.testimonial.create({
            data: {
                name: 'Dr. Sarah Mitchell',
                role: 'Senior Research Fellow',
                institute: 'MIT',
                content: 'The curriculum is world-class and perfectly aligned with industry standards. Highly recommended for career growth.'
            }
        });
        console.log('Sample testimonial added');
    } catch (error) {
        console.error('Error seeding:', error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
