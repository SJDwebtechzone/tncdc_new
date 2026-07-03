import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [preparingTime, setPreparingTime] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIOSDevice);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            setIsInstalled(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            
            // Do NOT automatically show on other pages.
            // It will be shown by the logic that checks for the /pwa path.
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Listen for custom trigger from other components
        const triggerHandler = () => {
            setIsVisible(true);
        };
        window.addEventListener('trigger-pwa-install', triggerHandler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsVisible(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('trigger-pwa-install', triggerHandler);
        };
    }, [location.pathname]);

    // Show automatically on /pwa path, hide elsewhere
    useEffect(() => {
        if (location.pathname === '/pwa') {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [location.pathname]);

    // Track preparing time
    useEffect(() => {
        let timer;
        if (isVisible && !deferredPrompt && !isIOS && !isInstalled) {
            timer = setInterval(() => {
                setPreparingTime(prev => prev + 1);
            }, 1000);
        } else {
            setPreparingTime(0);
        }
        return () => clearInterval(timer);
    }, [isVisible, deferredPrompt, isIOS, isInstalled]);

    const handleInstallClick = async () => {
        if (isIOS) {
            alert("To install on iOS (iPhone/iPad):\n1. Click the 'Share' icon at the bottom of Safari.\n2. Scroll down and click 'Add to Home Screen'.\n3. Click 'Add' in the top right corner.");
            return;
        }

        if (isInstalled) {
            alert("TNCDC is already installed on your device. Look for the app icon on your home screen or app drawer.");
            setIsVisible(false);
            return;
        }

        if (!deferredPrompt) {
            // Check if it's Chrome/Edge but just not ready yet
            const isChromium = !!window.chrome;
            if (isChromium) {
                alert("Your browser is still preparing the app for installation. Please wait a few seconds and try again. This can happen if the site just loaded.");
            } else {
                alert("Installation is best supported on Chrome, Edge, or Safari. If you are using another browser, please try 'Add to Home Screen' from your browser's menu.");
            }
            return;
        }
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleClose = () => {
        setIsVisible(false);
        // We set this so the user isn't immediately re-prompted in the same session,
        // unless they explicitly click a trigger button elsewhere.
        sessionStorage.setItem('pwaPromptDismissed', 'true');
    };

    // Check if dismissed in this session
    useEffect(() => {
        if (sessionStorage.getItem('pwaPromptDismissed') === 'true') {
            setIsVisible(false);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300 border border-gray-100">
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Logo Container with Glow */}
                <div className="relative mb-6 p-1 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 group">
                    <div className="bg-white rounded-xl p-4 overflow-hidden shadow-inner">
                        <img 
                            src="/assets/tncdc_logo.jpg" 
                            alt="TNCDC Logo" 
                            className="w-24 h-24 object-contain rounded-lg"
                        />
                    </div>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight px-4">
                    {isInstalled ? "Already Installed" : "TNCDC Mobile App"}
                </h2>
                <p className="text-gray-500 text-sm mb-8 px-6 leading-relaxed">
                    {isInstalled 
                        ? "TNCDC is already on your home screen! Open it from there for the best experience."
                        : isIOS 
                            ? "To install, tap the Share button in Safari and select 'Add to Home Screen'."
                            : "Download the Official TNCDC App for a faster and smoother learning experience."}
                </p>

                {/* Install Button */}
                {!isInstalled && (
                    <button
                        onClick={handleInstallClick}
                        disabled={!deferredPrompt && !isIOS}
                        className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 uppercase tracking-wider text-sm font-bold ${
                            !deferredPrompt && !isIOS 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-purple-800 text-white shadow-purple-200 hover:shadow-purple-300 active:scale-95'
                        }`}
                    >
                        {isIOS ? <Smartphone size={18} /> : <Download size={18} strokeWidth={3} />}
                        {isIOS 
                            ? "How to Install" 
                            : !deferredPrompt 
                                ? "Preparing..." 
                                : "Install Now"}
                    </button>
                )}
                
                {!isInstalled && !deferredPrompt && !isIOS && (
                    <div className="mt-4 flex flex-col items-center">
                        <p className="text-[10px] text-gray-400 animate-pulse mb-3 text-center">
                            {preparingTime > 6 
                                ? "Taking too long? Try refreshing to sync the app."
                                : "Wait a few seconds for the browser to prepare the app..."}
                        </p>
                        {preparingTime > 4 && (
                            <button 
                                onClick={() => window.location.reload(true)}
                                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full"
                            >
                                <RefreshCw size={10} />
                                Force Refresh
                            </button>
                        )}
                    </div>
                )}
                
                {isInstalled && (
                    <button
                        onClick={handleClose}
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gray-900 text-white font-bold rounded-2xl shadow-lg transition-all duration-200 uppercase tracking-wider text-sm"
                    >
                        Great, Thanks!
                    </button>
                )}
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
