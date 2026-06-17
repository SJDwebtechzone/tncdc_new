
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attendance = await prisma.staffAttendance.findMany({
    where: { 
      userId: 2,
      date: { startsWith: "2026-03" }
    }
  });
  console.log(JSON.stringify(attendance, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
