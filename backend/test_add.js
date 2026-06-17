const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: 'd:/DevSpectra Client Projects/tncdc/tncdc/backend/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        const category = await prisma.courseCategory.create({
            data: {
                name: 'Test Category ' + Date.now(),
                status: true
            }
        });
        console.log('Created category:', category);

        const all = await prisma.courseCategory.findMany();
        console.log('All categories:', all.length);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
