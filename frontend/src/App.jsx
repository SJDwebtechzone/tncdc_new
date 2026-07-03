import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchSiteSettings, fetchBanners, fetchFAQs, fetchContactSettings } from '@/store/websiteSlice';
import { fetchProfile } from '@/store/profileSlice';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { Navigate, Outlet } from 'react-router-dom';

import Home, {
  CoursesPage,
  AboutUsPage,
  TopPerformersPage,
  GalleryPage,
  ServicesPage,
  VerificationPage,
  VerificationResultPage,
  FranchiseRegistrationPage,
  FranchiseRequestsPage,
  StudyMaterialsPage,
  ContactUsPage,
  SampleCertificatesPage,
  AffiliationsPage,
  BlogPage,
  BlogDetailPage,
  JobsPage
} from './Pages';




import CourseDetailPage from './components/CourseDetailPage';
import CourseCheckout from './components/CourseCheckout';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import ProfilePage from '@/components/ProfilePage';
import DesignationsPage from '@/components/DesignationsPage';
import PlaceholderPage from '@/components/PlaceholderPage';
import ExamGrade from '@/components/ExamGrade';
import Subjects from '@/components/Subjects';
import AddSubjectPage from '@/components/AddSubjectPage';
import EditSubjectPage from '@/components/EditSubjectPage';
import BirthdayListPage from '@/components/BirthdayListPage';
import HelpSupportPage from '@/components/HelpSupportPage';
import IdCardPrintPage from '@/components/IdCardPrintPage';
import AdmissionsPage from '@/components/AdmissionsPage';
import AddAdmissionPage from '@/components/AddAdmissionPage';
import EditAdmissionPage from '@/components/EditAdmissionPage';
import StudentWalletPage from '@/components/StudentWalletPage';
import UpcomingInstallmentsPage from '@/components/UpcomingInstallmentsPage';
import PaidInstallmentsPage from '@/components/PaidInstallmentsPage';
import PaymentHistoryPage from '@/components/PaymentHistoryPage';
import WalletTransactionsPage from '@/components/WalletTransactionsPage';
import LanguagesPage from '@/components/LanguagesPage';
import CourseCategoriesPage from '@/components/CourseCategoriesPage';
import CourseAwardCategoriesPage from '@/components/CourseAwardCategoriesPage';
import ManageCoursesPage from '@/components/ManageCoursesPage';
import AddCoursePage from '@/components/AddCoursePage';
import EditCoursePage from '@/components/EditCoursePage';
import CourseVideosPage from '@/components/CourseVideosPage';
import CourseNotesPage from '@/components/CourseNotesPage';
import CourseReviewsPage from '@/components/CourseReviewsPage';
import OnlineClassesPage from '@/components/OnlineClassesPage';
import StudentOnlineClassesPage from '@/components/StudentOnlineClassesPage';
import AddSubjectsToCoursePage from '@/components/AddSubjectsToCoursePage';
import AddSemesterPage from '@/components/AddSemesterPage';
import ManageBatchesPage from '@/components/ManageBatchesPage';
import StudentListPage from '@/components/StudentListPage';
import AddStudentPage from '@/components/AddStudentPage';
import EditStudentPage from '@/components/EditStudentPage';
import StudentEnquiriesPage from '@/components/StudentEnquiriesPage';
import PopupsPage from '@/components/PopupsPage';
import StudentNotificationsPage from '@/components/StudentNotificationsPage';
import EnquiriesFollowUpsPage from '@/components/EnquiriesFollowUpsPage';
import HolidaysPage from '@/components/HolidaysPage';
import LeaveManagementPage from '@/components/LeaveManagementPage';
import AttendanceReportPage from '@/components/AttendanceReportPage';
import AddAttendancePage from '@/components/AddAttendancePage';
import AttendanceQRPage from '@/components/AttendanceQRPage';
import WeekOffDaysPage from '@/components/WeekOffDaysPage';
import StaffListPage from '@/components/StaffListPage';
import StaffAttendancePage from '@/components/StaffAttendancePage';
import StaffLeavesPage from '@/components/StaffLeavesPage';
import StaffSalaryPage from '@/components/StaffSalaryPage';
import StaffLecturesPage from '@/components/StaffLecturesPage';
import InventoryCategoriesPage from '@/components/InventoryCategoriesPage';
import InventoryProductsPage from '@/components/InventoryProductsPage';
import StudentInventoryPage from '@/components/StudentInventoryPage';
import ManageUsersPage from '@/components/ManageUsersPage';
import ManageRolesPage from '@/components/ManageRolesPage';
import ExpenseTypesPage from '@/components/ExpenseTypesPage';
import ExpenseSubTypesPage from '@/components/ExpenseSubTypesPage';
import ExpensesPage from '@/components/ExpensesPage';
import HDICertificatesPage from '@/components/HDICertificatesPage';
import BackgroundImagesPage from '@/components/BackgroundImagesPage';
import OffersPage from '@/components/OffersPage';
import ExamRequestsPage from '@/components/ExamRequestsPage';
import UpdateMarksPage from '@/components/UpdateMarksPage';
import ApplyCertificatesPage from '@/components/ApplyCertificatesPage';
import ApprovedCertificatesPage from '@/components/ApprovedCertificatesPage';
import RequestedCertificatesPage from '@/components/RequestedCertificatesPage';
import GenerateHallTicketsPage from '@/components/GenerateHallTicketsPage';
import MockTestsPage from '@/components/MockTestsPage';
import FinalExamsPage from '@/components/FinalExamsPage';
import WebsiteTopPerformersPage from '@/components/WebsiteTopPerformersPage';
import WebsiteServicesPage from '@/components/WebsiteServicesPage';
import WebsiteFAQsPage from '@/components/WebsiteFAQsPage';
import WebsiteTestimonialsPage from '@/components/WebsiteTestimonialsPage';
import WebsiteTeachersPage from '@/components/WebsiteTeachersPage';
import WebsiteCountersPage from '@/components/WebsiteCountersPage';
import WebsiteEventsPage from '@/components/WebsiteEventsPage';
import WebsiteAboutPage from '@/components/WebsiteAboutPage';
import WebsiteBannersPage from '@/components/WebsiteBannersPage';
import WebsiteMobileBannersPage from '@/components/WebsiteMobileBannersPage';
import WebsiteSampleCertificatesPage from '@/components/WebsiteSampleCertificatesPage';
import WebsiteAffiliationsPage from '@/components/WebsiteAffiliationsPage';
import WebsitePaymentDetailsPage from '@/components/WebsitePaymentDetailsPage';
import WebsitePoliciesPage from '@/components/WebsitePoliciesPage';
import WebsiteSocialMediaPage from '@/components/WebsiteSocialMediaPage';
import WebsiteSiteSettingPage from '@/components/WebsiteSiteSettingPage';
import WebsiteJobApplicationsPage from '@/components/WebsiteJobApplicationsPage';
import WebsiteJobsPage from '@/components/WebsiteJobsPage';
import WebsiteAddJobPage from '@/components/WebsiteAddJobPage';
import WebsiteStudyMaterialsPage from '@/components/WebsiteStudyMaterialsPage';
import WebsiteMissionVisionPage from '@/components/WebsiteMissionVisionPage';
import WebsiteContactPage from '@/components/WebsiteContactPage';
import WebsitePostsPage from '@/components/WebsitePostsPage';
import WebsiteAddPostPage from '@/components/WebsiteAddPostPage';
import WebsiteGalleryPage from '@/components/WebsiteGalleryPage';
import WebsitePartnersPage from '@/components/WebsitePartnersPage';
import SettingsPage from '@/components/SettingsPage';
import ChangePasswordPage from '@/components/ChangePasswordPage';
import PaymentSettingsPage from '@/components/PaymentSettingsPage';
import SecureBackupPage from '@/components/SecureBackupPage';
import WhatsAppTemplatesPage from '@/components/WhatsAppTemplatesPage';
import QuestionsPage from '@/components/QuestionsPage';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import StudentDashboard from './components/StudentDashboard';
import StudentMobileHub from './components/StudentMobileHub';
import StudentProfilePage from './components/StudentProfilePage';
import StudentPlaceholderPage from './components/StudentPlaceholderPage';
import StudentAllCoursesPage from './components/StudentAllCoursesPage';
import StudentCourseDetailsPage from './components/StudentCourseDetailsPage';
import ManagePaymentInstallmentsPage from './components/ManagePaymentInstallmentsPage';
import StudentVerificationResultPage from './components/StudentVerificationResultPage';
import StudentAttendancePage from './components/StudentAttendancePage';
import StudentReferralPage from './components/StudentReferralPage';

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Also check localStorage as a fallback or for initial load before store rehydrates if needed
  const isAuth = isAuthenticated || localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const DashboardHome = () => {
  const { user } = useSelector((state) => state.auth);
  const isStudent = user?.role?.toUpperCase() === 'STUDENT' || user?.roles?.some(r => r.toUpperCase() === 'STUDENT');
  
  return isStudent ? <StudentMobileHub /> : <Dashboard />;
};

const ProfileSwitcher = () => {
  const { user } = useSelector((state) => state.auth);
  const isStudent = user?.role?.toUpperCase() === 'STUDENT' || user?.roles?.some(r => r.toUpperCase() === 'STUDENT');
  
  return isStudent ? <StudentProfilePage /> : <ProfilePage />;
};

function App() {
  const siteSettings = useSelector((state) => state.website.siteSettings);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSiteSettings());
    dispatch(fetchProfile());
    dispatch(fetchBanners());
    dispatch(fetchFAQs());
    dispatch(fetchContactSettings());
  }, [dispatch]);

  useEffect(() => {
    if (siteSettings?.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', siteSettings.primaryColor);
    }
    if (siteSettings?.secondaryColor) {
      document.documentElement.style.setProperty('--secondary-color', siteSettings.secondaryColor);
    }
  }, [siteSettings]);

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <PWAInstallPrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/courses/:id/checkout" element={<CourseCheckout />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/top_performers" element={<TopPerformersPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/our_services" element={<ServicesPage />} />
        <Route path="/student_verification" element={<VerificationPage />} />
        <Route path="/verify-certificate/:certNo" element={<VerificationResultPage />} />
        <Route path="/verify-student/:studentId" element={<StudentVerificationResultPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Franchise_registration" element={<FranchiseRegistrationPage />} />
        <Route path="/study_materials" element={<StudyMaterialsPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/sample_certificates" element={<SampleCertificatesPage />} />
        <Route path="/affiliations" element={<AffiliationsPage />} />
        <Route path="/posts" element={<BlogPage />} />
        <Route path="/posts/:id" element={<BlogDetailPage />} />
        <Route path="/jobs" element={<JobsPage />} />





        <Route path="/pwa" element={<StudentMobileHub />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="exam-grade" element={<ExamGrade />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="subjects/:id/questions" element={<QuestionsPage />} />
            <Route path="add-subject" element={<AddSubjectPage />} />
            <Route path="subjects/edit/:id" element={<EditSubjectPage />} />
            <Route path="users/designations" element={<DesignationsPage />} />
            <Route path="profile" element={<ProfileSwitcher />} />
            <Route path="languages" element={<LanguagesPage />} />
            <Route path="course/categories" element={<CourseCategoriesPage />} />
            <Route path="course/award-categories" element={<CourseAwardCategoriesPage />} />
            <Route path="fees/upcoming" element={<UpcomingInstallmentsPage />} />
            <Route path="fees/paid" element={<PaidInstallmentsPage />} />
            <Route path="fees/history" element={<PaymentHistoryPage />} />
            <Route path="fees/wallet" element={<StudentWalletPage />} />
            <Route path="fees/wallet/transactions" element={<WalletTransactionsPage />} />
            <Route path="courses" element={<ManageCoursesPage />} />
            <Route path="courses/add" element={<AddCoursePage />} />
            <Route path="courses/edit/:id" element={<EditCoursePage />} />
            <Route path="courses/:id/add-subjects" element={<AddSubjectsToCoursePage />} />
            <Route path="courses/:id/add-semester" element={<AddSemesterPage />} />
            <Route path="courses/:id/edit-semester/:semesterId" element={<AddSemesterPage />} />
            <Route path="course/videos" element={<CourseVideosPage />} />
            <Route path="course/notes" element={<CourseNotesPage />} />
            <Route path="course/reviews" element={<CourseReviewsPage />} />
            <Route path="online-classes" element={<OnlineClassesPage />} />
            <Route path="batches" element={<ManageBatchesPage />} />
            <Route path="students/birthday-list" element={<BirthdayListPage />} />
            <Route path="students/help-support" element={<HelpSupportPage />} />
            <Route path="students/id-card-print" element={<IdCardPrintPage />} />
            <Route path="students/admissions" element={<AdmissionsPage />} />
            <Route path="students/admissions/add" element={<AddAdmissionPage />} />
            <Route path="students/admissions/edit/:id" element={<EditAdmissionPage />} />
            <Route path="students/admissions/manage-payments/:id" element={<ManagePaymentInstallmentsPage />} />
            <Route path="students/list" element={<StudentListPage />} />
            <Route path="students/list/add" element={<AddStudentPage />} />
            <Route path="students/list/edit/:id" element={<EditStudentPage />} />
            <Route path="students/enquiries" element={<StudentEnquiriesPage />} />
            <Route path="students/enquiry-followups" element={<EnquiriesFollowUpsPage />} />
            <Route path="students/popups" element={<PopupsPage />} />
            <Route path="students/notifications" element={<StudentNotificationsPage />} />
            <Route path="exams/hall-tickets" element={<GenerateHallTicketsPage />} />
            <Route path="exams/mock-tests" element={<MockTestsPage />} />
            <Route path="exams/final" element={<FinalExamsPage />} />
            <Route path="exams/requests" element={<ExamRequestsPage />} />
            <Route path="exams/marks" element={<UpdateMarksPage />} />
            <Route path="certificates/apply" element={<ApplyCertificatesPage />} />
            <Route path="certificates/approved" element={<ApprovedCertificatesPage />} />
            <Route path="certificates/requested" element={<RequestedCertificatesPage />} />
            <Route path="attendance/report" element={<AttendanceReportPage />} />
            <Route path="attendance/add" element={<AddAttendancePage />} />
            <Route path="attendance/qr" element={<AttendanceQRPage />} />
            <Route path="attendance/leave" element={<LeaveManagementPage />} />
            <Route path="attendance/holidays" element={<HolidaysPage />} />
            <Route path="attendance/week-off" element={<WeekOffDaysPage />} />
            <Route path="franchises/requests" element={<FranchiseRequestsPage />} />
            <Route path="franchises/plans" element={<PlaceholderPage title="Franchise Plans" />} />
            <Route path="franchises/list" element={<PlaceholderPage title="Franchises List" />} />
            <Route path="franchises/wallet" element={<PlaceholderPage title="Franchise Wallet" />} />
            <Route path="staff/list" element={<StaffListPage />} />
            <Route path="staff/attendance" element={<StaffAttendancePage />} />
            <Route path="staff/leaves" element={<StaffLeavesPage />} />
            <Route path="staff/salary" element={<StaffSalaryPage />} />
            <Route path="staff/lectures" element={<StaffLecturesPage />} />
            <Route path="inventory/categories" element={<InventoryCategoriesPage />} />
            <Route path="inventory/products" element={<InventoryProductsPage />} />
            <Route path="inventory/student" element={<StudentInventoryPage />} />
            <Route path="expenses/types" element={<ExpenseTypesPage />} />
            <Route path="expenses/subtypes" element={<ExpenseSubTypesPage />} />
            <Route path="expenses/list" element={<ExpensesPage />} />
            <Route path="hdi-certificate" element={<HDICertificatesPage />} />
            <Route path="backgrounds" element={<BackgroundImagesPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="users/manage" element={<ManageUsersPage />} />
            <Route path="users/roles" element={<ManageRolesPage />} />
            <Route path="website/top-performers" element={<WebsiteTopPerformersPage />} />
            <Route path="website/services" element={<WebsiteServicesPage />} />
            <Route path="website/faqs" element={<WebsiteFAQsPage />} />
            <Route path="website/testimonials" element={<WebsiteTestimonialsPage />} />
            <Route path="website/teachers" element={<WebsiteTeachersPage />} />
            <Route path="website/counters" element={<WebsiteCountersPage />} />
            <Route path="website/events" element={<WebsiteEventsPage />} />
            <Route path="website/about" element={<WebsiteAboutPage />} />
            <Route path="website/banner" element={<WebsiteBannersPage />} />
            <Route path="website/mobile-banner" element={<WebsiteMobileBannersPage />} />
            <Route path="website/sample-certificates" element={<WebsiteSampleCertificatesPage />} />
            <Route path="website/affiliations" element={<WebsiteAffiliationsPage />} />
            <Route path="website/payment-details" element={<WebsitePaymentDetailsPage />} />
            <Route path="website/policies" element={<WebsitePoliciesPage />} />
            <Route path="website/social-media" element={<WebsiteSocialMediaPage />} />
            <Route path="website/site-setting" element={<WebsiteSiteSettingPage />} />
            <Route path="website/job-applications" element={<WebsiteJobApplicationsPage />} />
            <Route path="website/jobs" element={<WebsiteJobsPage />} />
            <Route path="website/jobs/add" element={<WebsiteAddJobPage />} />
            <Route path="website/study-materials" element={<WebsiteStudyMaterialsPage />} />
            <Route path="website/mission-vision" element={<WebsiteMissionVisionPage />} />
            <Route path="website/contact" element={<WebsiteContactPage />} />
            <Route path="website/posts" element={<WebsitePostsPage />} />
            <Route path="website/posts/add" element={<WebsiteAddPostPage />} />
            <Route path="website/gallery" element={<WebsiteGalleryPage />} />
            <Route path="website/partners" element={<WebsitePartnersPage />} />
            <Route path="settings/password" element={<ChangePasswordPage />} />
            <Route path="settings/payment" element={<PaymentSettingsPage />} />
            <Route path="settings/whatsapp" element={<WhatsAppTemplatesPage />} />
            <Route path="settings/backup" element={<SecureBackupPage />} />
            <Route path="settings/:tabId" element={<SettingsPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* New Student Specific Routes */}
            <Route path="referral" element={<StudentReferralPage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="all-courses" element={<StudentAllCoursesPage />} />
            <Route path="courses/:id" element={<StudentCourseDetailsPage />} />
            <Route path="online-courses" element={<StudentOnlineClassesPage />} />
            <Route path="my-courses" element={<StudentPlaceholderPage title="My Enrolled Courses" />} />
            <Route path="test-results" element={<StudentPlaceholderPage title="Test Exam Results" />} />
            <Route path="final-results" element={<StudentPlaceholderPage title="Final Exam Results" />} />
            <Route path="wallet" element={<StudentPlaceholderPage title="My Wallet Balance" />} />
            <Route path="resume" element={<StudentPlaceholderPage title="My Professional Resume" />} />
            <Route path="birthday-poster" element={<StudentPlaceholderPage title="My Birthday Poster" />} />
            <Route path="help-support" element={<HelpSupportPage />} />
            <Route path="about-us" element={<StudentPlaceholderPage title="About TNCDC" />} />
            <Route path="privacy-policy" element={<StudentPlaceholderPage title="Privacy Policy" />} />
            <Route path="terms" element={<StudentPlaceholderPage title="Terms and Conditions" />} />
            <Route path="refund-policy" element={<StudentPlaceholderPage title="Refund Policy" />} />
            <Route path="contact-us" element={<StudentPlaceholderPage title="Contact Support" />} />

            <Route path="*" element={<PlaceholderPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;