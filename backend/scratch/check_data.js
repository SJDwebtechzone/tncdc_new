const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmissions() {
  try {
    const admissions = await prisma.admission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        firstName: true,
        courseName: true,
        courseFee: true,
        finalAmount: true,
        admissionFee: true,
        createdAt: true
      }
    });
    console.log(JSON.stringify(admissions, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmissions();
