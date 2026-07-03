import React from 'react';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Marquee />

            {/* Hero Section */}
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] flex items-center bg-gray-900 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop"
                        alt="Services Hero Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="container mx-auto px-4 z-10 relative text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Empowering Your Digital Future
                    </h1>
                    <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light">
                        Master in-demand tech skills with our industry-leading courses and expert instructors
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/courses"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition-all duration-300"
                        >
                            Explore Courses
                        </Link>
                        <Link
                            to="/contactus"
                            className="bg-transparent border border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-md transition-all duration-300"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>

            {/* Empty White Content Area (as per screenshot design) */}
            <div className="min-h-[500px] bg-white w-full">
                {/* This section intentionally left empty to match the provided design screenshot which shows a large white space between hero and footer */}
            </div>

            <Footer />
        </div>
    );
};

export default ServicesPage;






