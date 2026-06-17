const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.testimonialSettings.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                title: "People like our education. <br /> Here's the proof!",
                subtitle: "EDUCATION FOR EVERYONE"
            }
        });
        console.log('Testimonial settings initialized.');
        
        const count = await prisma.testimonial.count();
        console.log(`Current testimonial count: ${count}`);
    } catch (error) {
        console.error('Initialization error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
