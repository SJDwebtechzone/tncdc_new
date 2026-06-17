const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCourses() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        mrp: true
      }
    });
    console.log(JSON.stringify(courses, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

checkCourses();
