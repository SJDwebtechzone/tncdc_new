const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEnquiries() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      take: 10,
      orderBy: { id: 'desc' },
      select: {
        id: true,
        firstName: true,
        course: true
      }
    });
    console.log(JSON.stringify(enquiries, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnquiries();
