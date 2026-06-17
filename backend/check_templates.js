const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTemplates() {
  const templates = await prisma.backgroundImage.findMany();
  console.log(JSON.stringify(templates, null, 2));
}

checkTemplates()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
