const cors = require("cors");
const express = require("express");
const path = require("path");
require('dotenv').config();
const fs = require('fs');

const app = express();

// 1. Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 2. Logging & Static Files
app.use((req, res, next) => {
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
    try { fs.appendFileSync(path.join(__dirname, 'debug_requests.log'), log); } catch (e) { }
    next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. Health Check
app.get('/api/test-ping', (req, res) => res.json({ message: "PONG on 5002" }));

// 4. Routes
const authRouter = require("./routes/auth");
const siteSettingsRouter = require("./routes/siteSettings");
const profileRouter = require("./routes/profile");
const courseCategoriesRouter = require("./routes/courseCategories");
const courseAwardCategoriesRouter = require("./routes/courseAwardCategories");
const coursesRouter = require("./routes/courses");
const examGradesRouter = require("./routes/examGrades");
const batchesRouter = require("./routes/batches");
const designationsRouter = require("./routes/designations");
const rolesRouter = require("./routes/roles");
const usersRouter = require("./routes/users");
const enquiriesRouter = require("./routes/enquiries");
const enquiryFollowUpsRouter = require("./routes/enquiryFollowUps");
const bannersRouter = require('./routes/banners');
const faqsRouter = require('./routes/faqs');
const teachersRouter = require('./routes/teachers');
const testimonialsRouter = require('./routes/testimonials');
const missionVisionRouter = require('./routes/missionVision');
const galleryRouter = require('./routes/gallery');
const languagesRouter = require('./routes/languages');
const admissionsRouter = require('./routes/admissions');
const dashboardRouter = require('./routes/dashboard');
const backgroundImagesRouter = require('./routes/backgroundImages');
const subjectsRouter = require('./routes/subjects');
const courseVideosRouter = require('./routes/courseVideos');
const courseNotesRouter = require('./routes/courseNotes');
const installmentRouter = require('./routes/installmentRoutes');
const topPerformersRouter = require('./routes/topPerformers');
const studentDashboardRouter = require('./routes/studentDashboard');
const examResultsRouter = require('./routes/examResults');
const certificateRouter = require('./routes/certificates');
const notificationsRouter = require('./routes/notifications');
const franchiseRequestsRouter = require('./routes/franchiseRequests');
const studyMaterialsRouter = require('./routes/studyMaterials');
const contactRouter = require('./routes/contact');
const sampleCertificatesRouter = require('./routes/sampleCertificates');
const affiliationsRouter = require('./routes/affiliations');
const postsRouter = require('./routes/posts');
const jobsRouter = require('./routes/jobs');
const jobApplicationsRouter = require('./routes/jobApplications');
const eventsRouter = require('./routes/events');
const partnersRouter = require('./routes/partners');
const onlineClassesRouter = require('./routes/onlineClasses');
const staffAttendanceRouter = require('./routes/staffAttendance');
const staffSalaryRouter = require('./routes/staffSalary');
const paymentDetailsRouter = require('./routes/paymentDetails');
const attendanceSettingsRouter = require('./routes/attendanceSettings');
const paymentSettingsRouter = require('./routes/paymentSettings');
const razorpayRouter = require('./routes/razorpay');
const expenseTypesRouter = require('./routes/expenseTypes');
const expenseSubTypesRouter = require('./routes/expenseSubTypes');
const expensesRouter = require('./routes/expenses');
const inventoryCategoriesRouter = require('./routes/inventoryCategories');
const inventoryProductsRouter = require('./routes/inventoryProducts');



const leavesRouter = require('./routes/leaves');
const studentAttendanceRouter = require('./routes/attendance');

app.use('/api/leaves', leavesRouter);
app.use('/api/student-attendance', studentAttendanceRouter);
app.use('/api/auth', authRouter);
app.use('/api/site-settings', siteSettingsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/course-categories', courseCategoriesRouter);
app.use('/api/course-award-categories', courseAwardCategoriesRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/exam-grades', examGradesRouter);
app.use('/api/batches', batchesRouter);
app.use('/api/designations', designationsRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/users', usersRouter);
app.use('/api/staff-attendance', staffAttendanceRouter);
app.use('/api/staff-salary', staffSalaryRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/enquiries', enquiryFollowUpsRouter); // Mounts to /api/enquiries/:enquiryId/followups
app.use('/api/website-banners', bannersRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/mission-vision', missionVisionRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/languages', languagesRouter);
app.use('/api/admissions', admissionsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/background-images', backgroundImagesRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/course-videos', courseVideosRouter);
app.use('/api/course-notes', courseNotesRouter);
app.use('/api/installments', installmentRouter);
app.use('/api/top-performers', topPerformersRouter);
app.use('/api/student-dashboard', studentDashboardRouter);
app.use('/api/exam-results', examResultsRouter);
app.use('/api/certificates', certificateRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/online-classes', onlineClassesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/franchise-requests', franchiseRequestsRouter);
app.use('/api/study-materials', studyMaterialsRouter);
app.use('/api/contact-settings', contactRouter);
app.use('/api/sample-certificates', sampleCertificatesRouter);
app.use('/api/affiliations', affiliationsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/job-applications', jobApplicationsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/payment-details', paymentDetailsRouter);
app.use('/api/attendance-settings', attendanceSettingsRouter);
app.use('/api/payment-settings', paymentSettingsRouter);
app.use('/api/razorpay', razorpayRouter);
app.use('/api/expense-types', expenseTypesRouter);
app.use('/api/expense-sub-types', expenseSubTypesRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/inventory-categories', inventoryCategoriesRouter);
app.use('/api/inventory-products', inventoryProductsRouter);



// 5. Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `🚀 Server running on port ${PORT}`);
    console.log(`\x1b[34m%s\x1b[0m`, `✨ Supabase Integrated for Storage`);
});