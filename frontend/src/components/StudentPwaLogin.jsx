import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User } from 'lucide-react';
import { loginUser } from '@/store/authSlice';
import { BASE_URL } from '@/config';
import { motion } from 'framer-motion';

export default function StudentPwaLogin({ onBack, onSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const dispatch = useDispatch();
    const siteSettings = useSelector(state => state.website?.siteSettings);
    const instituteName = siteSettings?.instituteName || "Tamil Nadu Career Development Council";
    const logoUrl = siteSettings?.logoUrl;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await dispatch(loginUser({ email, password })).unwrap();
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-[#001B3D] flex flex-col overflow-hidden"
        >
            {/* Background Decorative Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#001B3D] via-[#002B5C] to-[#001B3D] opacity-100"></div>
            
            {/* Top Bar with Back Arrow */}
            <div className="relative z-10 px-6 pt-12 pb-4 flex items-center justify-between">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-12">
                {/* Logo & Institute Name */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-white p-4 shadow-2xl mb-6 relative overflow-hidden border-4 border-white/10">
                        {logoUrl ? (
                            <img 
                                src={logoUrl.startsWith('http') ? logoUrl : `${BASE_URL}${logoUrl}`} 
                                alt="Logo" 
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <User className="w-full h-full text-indigo-500" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent"></div>
                    </div>
                    <h2 className="text-white font-bold text-lg tracking-tight mb-8">
                        {instituteName}
                    </h2>
                    
                    <h1 className="text-white text-3xl font-black mb-1 tracking-tight">Welcome Back!</h1>
                    <p className="text-blue-200 text-sm font-medium opacity-80 mb-12">
                        Sign in to unlock your learning potential
                    </p>
                </div>

                {/* Login Form */}
                <div className="w-full max-w-sm">
                    <div className="text-center mb-6">
                        <h3 className="text-white text-xl font-bold mb-1">Sign In</h3>
                        <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest opacity-60">
                            Please enter your credentials to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-bold text-center mb-4">
                                {error}
                            </div>
                        )}

                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                                <User size={18} />
                            </div>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white text-sm font-medium focus:bg-white/10 focus:border-blue-400 outline-none transition-all placeholder:text-blue-300/40"
                                required
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                                <Lock size={18} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-white text-sm font-medium focus:bg-white/10 focus:border-blue-400 outline-none transition-all placeholder:text-blue-300/40"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-14 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-900/40 active:scale-95 transition-all mt-8 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>
            </div>
            
            <Styles />
        </motion.div>
    );
}

const Styles = () => (
    <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `}} />
);
