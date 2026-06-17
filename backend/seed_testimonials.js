const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.testimonial.count();
        if (count === 0) {
            await prisma.testimonial.createMany({
                data: [
                    { name: "John Doe", role: "Software Engineer", content: "The courses are extremely detailed and easy to follow. Highly recommended!", institute: "Tech Corp" },
                    { name: "Jane Smith", role: "UI Designer", content: "The mentors are very helpful and provide real-world insights.", institute: "Design Studio" },
                    { name: "Mike Johnson", role: "Data Scientist", content: "Great platform for learning new technologies at your own pace.", institute: "AI Lab" },
                    { name: "Sarah Williams", role: "Manager", content: "Excellent resources and community support for all learners.", institute: "Edu Group" }
                ]
            });
            console.log('Sample testimonials added.');
        } else {
            console.log(`Already have ${count} testimonials.`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
