const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const performers = await prisma.topPerformer.findMany();
    const settings = await prisma.topPerformerSettings.findFirst();
    console.log('Performers Count:', performers.length);
    console.log('Settings:', settings);
}

main().catch(console.error).finally(() => prisma.$disconnect());
