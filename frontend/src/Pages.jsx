import React from 'react';
import Navbar from './components/Navbar';
import Marquee from './components/Marquee';
import Hero from './components/Hero';
import BrandSlider from './components/BrandSlider';
import Categories from './components/Categories';
import Courses from './components/Courses';
import About from './components/About';
import Counter from './components/Counter';
import Team from './components/Team';
import Testimonials from './components/Testimonials';
import Events from './components/Events';
import Blog from './components/Blog';
import BlogPageContent from './components/BlogPage';
import BlogDetailPageContent from './components/BlogDetailPage';
import JobsPageContent from './components/JobsPage';



import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Login from './components/Login';
import CoursesPageContent from './components/CoursesPage';

import AboutPage from './components/AboutPage';
import GalleryPageContent from './components/GalleryPage';
import ServicesPageContent from './components/ServicesPage';
import TopPerformerPage from './components/TopPerformerPage';
import VerificationPageContent from './components/VerificationPage';
import VerificationResultPageContent from './components/VerificationResultPage';
import FranchiseRegistrationPageContent from './components/FranchiseRegistrationPage';
import StudyMaterialsPageContent from './components/StudyMaterialsPage';
import ContactUsPageContent from './components/ContactUsPage';
import SampleCertificatesPageContent from './components/SampleCertificatesPage';
import AffiliationsPageContent from './components/AffiliationsPage';



// A simple layout wrapper for our interior pages
const PageLayout = ({ children, title }) => (
    <div className="min-h-screen bg-white">
        <Navbar />
        <Marquee />

        <main className="pt-[160px] pb-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">{title}</h1>
                    <div className="w-24 h-1 bg-primary mx-auto"></div>
                </div>
                <div className="bg-gray-50 p-12 rounded-[40px] border border-gray-100 min-h-[400px] flex items-center justify-center">
                    <p className="text-2xl text-gray-400 italic">This is the {title} page content from the source code conversion.</p>
                </div>
            </div>
        </main>
        <Footer />


    </div>
);

const Home = () => (
    <div className="
    min-h-screen
    bg-gradient-to-br
    from-pink-100 via-purple-100 to-blue-100
    ">

        <Navbar />
        <Marquee />
        <main>
            <Hero />
            <Categories />
            <Courses />
            <About />
            <Counter />
            <Team />
            <Testimonials />
            <BrandSlider />
            <Events />
            <Blog />
            <FAQ />
        </main>
        <Footer />

        {/* WhatsApp Floating Switcher */}

    </div>
);



// Define interior pages
export const CoursesPage = () => <CoursesPageContent />;
export const AboutUsPage = () => <AboutPage />;
export const TopPerformersPage = () => <TopPerformerPage />;
export const GalleryPage = () => <GalleryPageContent />;
export const ServicesPage = () => <ServicesPageContent />;
export const VerificationPage = () => <VerificationPageContent />;
export const VerificationResultPage = () => <VerificationResultPageContent />;
export const FranchiseRegistrationPage = () => <FranchiseRegistrationPageContent />;
export const StudyMaterialsPage = () => <StudyMaterialsPageContent />;
export const ContactUsPage = () => <ContactUsPageContent />;
export const SampleCertificatesPage = () => <SampleCertificatesPageContent />;
export const AffiliationsPage = () => <AffiliationsPageContent />;
export const BlogPage = () => <BlogPageContent />;
export const BlogDetailPage = () => <BlogDetailPageContent />;
export const JobsPage = () => <JobsPageContent />;







export { default as CertificationRequestPage } from './components/RequestedCertificatesPage';
export { default as FranchiseRequestsPage } from './components/FranchiseRequestsPage';

export default Home;

