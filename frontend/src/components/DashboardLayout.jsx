import React from 'react';
import { Sidebar } from './Sidebar';
import Dashboard from './Dashboard';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    
    // Array of routes that belong to the PWA/Student Mobile Hub
    const pwaRoutes = [
        '/all-courses', '/courses/', '/online-courses', '/my-courses', '/test-results', 
        '/final-results', '/wallet', '/resume', '/birthday-poster', 
        '/help-support', '/about-us', '/privacy-policy', '/terms', 
        '/refund-policy', '/contact-us', '/referral'
    ];
    
    // Determine if the current route is a PWA specific route
    const isPwaRoute = pwaRoutes.some(route => location.pathname.includes(route));
    
    const isExplicitStudent = user?.role?.toUpperCase() === 'STUDENT' || user?.roles?.some(r => r.toUpperCase() === 'STUDENT');
    const isAdmin = user?.roles?.some(r => r.toUpperCase() === 'ADMIN');
    const isStudent = isExplicitStudent || (isPwaRoute && !isAdmin);

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen font-sans overflow-x-hidden">
            {/* Sidebar - Hidden for students on mobile, or toggleable */}
            <div className={cn(
                "hidden md:block fixed inset-y-0",
                isStudent && "md:hidden" // Hide sidebar entirely for students if preferred, or keep for desktop
            )}>
                <Sidebar />
            </div>

            <div className={cn(
                "flex-1 flex flex-col w-full min-w-0 overflow-hidden",
                !isStudent && "md:ml-64",
                isStudent && "md:ml-0" // Students get the full width mobile-first experience
            )}>
                {!isStudent && <Header />}
                <div className={cn(
                    "flex-1 p-0 md:p-4 overflow-y-auto overflow-x-auto",
                    !isStudent && "mt-0"
                )}>
                    <div className="flex flex-col min-h-full justify-between">
                        <div className="w-full">
                            <Outlet />
                        </div>
                        {!isStudent && (
                            <div className="mt-4 px-4 pb-4 text-sm text-gray-500">
                                Copyright 2026-27 © <a href="https://www.devspectra.in" className="font-bold hover:text-blue-600 transition-colors">DevSpectra</a> All rights reserved.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;






