const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany();
    console.log(`Found ${courses.length} courses to update.`);

    for (const course of courses) {
        const rating = (4 + Math.random()).toFixed(1); // 4.0 - 5.0
        const likes = Math.floor(50 + Math.random() * 450); // 50 - 500
        const views = Math.floor(500 + Math.random() * 4500); // 500 - 5000
        
        await prisma.course.update({
            where: { id: course.id },
            data: { 
                rating: parseFloat(rating),
                likes,
                views
            }
        });
        console.log(`Updated course "${course.title}" with Rating: ${rating}, Likes: ${likes}, Views: ${views}`);
    }
    console.log('Finished seeding course metrics.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
