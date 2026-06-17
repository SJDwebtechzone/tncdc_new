const { prisma } = require('./db');

async function createStudent() {
    try {
        console.log('Creating/Updating test student via Prisma...');
        const user = await prisma.user.upsert({
            where: { email: 'student@tncdc.in' },
            update: {
                password: 'student123',
                roles: ['STUDENT'],
                fullName: 'Test Student'
            },
            create: {
                email: 'student@tncdc.in',
                password: 'student123',
                fullName: 'Test Student',
                roles: ['STUDENT']
            }
        });
        
        console.log('✅ Test student account ready!');
        console.log('Email: student@tncdc.in');
        console.log('Password: student123');
        process.exit(0);
    } catch (err) {
        console.error('❌ Prisma Error:', err);
        process.exit(1);
    }
}

createStudent();
