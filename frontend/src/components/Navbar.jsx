import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BASE_URL } from '@/config';
import { Smartphone } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const profile = useSelector((state) => state.profile);
    const website = useSelector((state) => state.website);
    const siteSettings = website.siteSettings;

    const profileLogoUrl = profile.logoUrl || (website.siteSettings && website.siteSettings.logo);
    const profileLogo = profileLogoUrl && profileLogoUrl.startsWith('/uploads') ? `${BASE_URL}${profileLogoUrl}` : profileLogoUrl;

    const websiteLogo = website.siteSettings && website.siteSettings.logo;

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        { name: 'About Us', path: '/aboutus' },
        { name: 'Top Performers', path: '/top_performers' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Our Services', path: '/our_services' },
        { name: 'Verification', path: '/student_verification' },
        { name: 'Franchise Registration', path: '/Franchise_registration' },
    ];

    return (
        <>
            <header
                className={`
rbt-header rbt-header-10
fixed top-0 left-0 w-full z-[1000]
transition-all duration-500 ease-in-out
${isSticky
                        ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/30 py-3'
                        : 'bg-white/40 backdrop-blur-md py-5'}
`}
            >

                <div className="rbt-header-wrapper header-space-betwween">
                    <div className="container-fluid px-4">
                        <div className="mainbar-row rbt-navigation-center flex items-center justify-between py-4">

                            <div className="header-left rbt-header-content">
                                <div className="header-info">
                                    <div className="logo logo-dark">
                                        <Link to="/">
                                            <img src={profileLogo} alt="Education Logo Images" className="h-12 md:h-16" />                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="rbt-main-navigation hidden lg:block">
                                <nav className="mainmenu-nav">
                                    <ul className="mainmenu flex items-center space-x-8">
                                        {navLinks.map((link) => (
                                            <li key={link.path}>
                                                <Link
                                                    to={link.path}
                                                    className={`font-medium transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-gray-800 hover:text-primary'}`}
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>

                            <div className="header-right flex items-center space-x-4">
                                <ul className="quick-access flex items-center space-x-4">
                                    <li className="account-access hidden lg:block">                                        <Link to="/login" className="flex items-center gap-2 text-gray-800 font-medium hover:text-primary">
                                        <span role="img" aria-label="login">🔑</span> Login
                                    </Link>
                                    </li>
                                    <li className="account-access hidden xl:block">
                                        <Link 
                                            to="/pwa" 
                                            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 border border-indigo-100"
                                        >
                                            <Smartphone size={18} />
                                            <span className="text-xs uppercase tracking-wider">PWA</span>
                                        </Link>
                                    </li>
                                    <li className="access-icon xl:hidden">
                                        <Link className="rbt-round-btn flex items-center justify-center border p-2 rounded-full" to="/login">
                                            <span className="text-lg">L</span>
                                        </Link>
                                    </li>
                                </ul>

                                <div className="rbt-btn-wrapper hidden lg:block ml-4">
                                    <button
                                        style={{ backgroundColor: siteSettings?.primaryColor || 'var(--primary-color)' }}
                                        className="rbt-btn radius-round btn-sm text-white px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 whitespace-nowrap"
                                        onClick={() => navigate('/courses')}
                                    >
                                        <span>Enroll Now</span>
                                    </button>
                                </div>

                                <div className="mobile-menu-bar lg:hidden ml-4">                                    <button className="hamberger-button rbt-round-btn p-2 border rounded-full" onClick={toggleMenu}>
                                    <span>☰</span>
                                </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Sidebar */}
            <div className={`popup-mobile-menu fixed top-0 right-0 h-full w-[300px] bg-white/70 backdrop-blur-md shadow-md z-[2000] shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="inner-wrapper p-8 h-full flex flex-col">
                    <div className="inner-top flex justify-between items-center mb-10">
                        <div className="logo">
                            <img src={profileLogo} alt="Logo" className="h-10" onError={(e) => e.target.src = '/assets/tncdc_logo.jpg'} />                        </div>
                        <button className="close-button text-2xl" onClick={toggleMenu}>✕</button>
                    </div>

                    <nav className="mainmenu-nav flex-grow">
                        <ul className="mainmenu space-y-4 text-lg">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`${location.pathname === link.path ? 'text-primary' : 'text-gray-900'}`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="mobile-menu-bottom mt-10">
                        <button 
                            className="rbt-btn btn-gradient w-full text-center py-4 rounded-xl font-bold text-white shadow-lg" 
                            style={{ background: `linear-gradient(to right, ${siteSettings?.primaryColor || '#9333ea'}, ${siteSettings?.secondaryColor || '#ec4899'})` }}
                            onClick={() => {
                                setIsMenuOpen(false);
                                navigate('/courses');
                            }}
                        >
                            Enroll Now
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-[1999]" onClick={toggleMenu}></div>}
        </>
    );
};

export default Navbar;






