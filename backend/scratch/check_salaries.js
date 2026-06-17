
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const records = await prisma.staffSalaryRecord.findMany({
    where: { month: "March", year: "2026" },
    include: { user: true, teacher: true }
  });
  console.log(JSON.stringify(records, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
