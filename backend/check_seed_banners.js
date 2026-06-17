const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.websiteBanner.count();
        console.log('Banner count:', count);
        if (count === 0) {
            await prisma.websiteBanner.create({
                data: {
                    displayMode: 'banner',
                    badgeText: 'The Leader in Online Learning',
                    badgeIcon: '🏆',
                    title: 'Build The Skills <br /> To Drive Your Career.',
                    description: 'Unlock your potential with our expert-led courses and industry-recognized certifications.',
                    imageUrl: 'https://tncdc.in/website/assets/images/home_main_banner.png'
                }
            });
            console.log('Sample banner added');
        }
    } catch (error) {
        console.error('Error with banners:', error);
    } finally {
        await prisma.$disconnect();
    }
}
main();
