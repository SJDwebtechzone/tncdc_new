const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCreate() {
    try {
        const studentDetails = {
            firstName: "Suresh",
            lastName: "",
            email: "suresh@example.com",
            mobile: "9988776655",
            password: "",
            dob: "",
            pincode: "",
            address: ""
        };

        const courseDetails = {
            title: "Python Pro",
            courseType: "Diploma",
            price: 38000
        };

        const newEnquiry = await prisma.enquiry.create({
            data: {
                firstName: studentDetails.firstName,
                surname: studentDetails.lastName || studentDetails.surname || '',
                relationship: 'Self',
                dob: studentDetails.dob || '',
                gender: studentDetails.gender || 'Other',
                pincode: studentDetails.pincode || '',
                mobile: studentDetails.mobile,
                email: studentDetails.email,
                address: studentDetails.address || '',
                course: courseDetails.title,
                source: 'Online Purchase',
                status: 'Converted',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        console.log("Enquiry successful", newEnquiry.id);

        const studentId = `STU-${Date.now()}`;
        const newAdmission = await prisma.admission.create({
            data: {
                studentId: studentId,
                enquiryId: newEnquiry.id,
                firstName: studentDetails.firstName,
                surname: studentDetails.lastName || studentDetails.surname || '',
                email: studentDetails.email,
                mobile: studentDetails.mobile,
                courseName: courseDetails.title,
                courseType: courseDetails.courseType || 'Certificate',
                courseFee: parseFloat(courseDetails.price) || 0,
                finalAmount: parseFloat(courseDetails.price) || 0,
                admissionFee: parseFloat(courseDetails.price) || 0,
                admissionDate: new Date().toISOString().split('T')[0],
                status: 'Active'
            }
        });
        console.log("Admission successful", newAdmission.id);

    } catch (err) {
        console.error("PRISMA ERROR:");
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

testCreate();
