const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany();
    console.log(`Resetting metrics for ${courses.length} courses.`);

    for (const course of courses) {
        await prisma.course.update({
            where: { id: course.id },
            data: { 
                rating: 0,
                likes: 0,
                views: 0
            }
        });
        console.log(`Reset course "${course.title}" metrics.`);
    }
    console.log('Finished resetting course metrics.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
