import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/authSlice';
import { fetchProfile } from '@/store/profileSlice';
import { BASE_URL } from '@/config';
import { Smartphone, User } from 'lucide-react';
import { useEffect } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status, error: authError } = useSelector((state) => state.auth);
    const { instituteName, logoUrl } = useSelector((state) => state.profile);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(result)) {
            console.log('Login successful');
            navigate('/dashboard');
        } else {
            setError(result.payload || 'Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-[20px] shadow-2xl overflow-hidden w-full max-w-6xl h-auto md:h-[800px] flex flex-col md:flex-row">

                {/* Left Side - Blue Branding Panel */}
                <div className="w-full md:w-1/2 bg-blue-600 relative overflow-hidden flex items-center justify-center p-12">
                    {/* Background Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>

                    {/* Logo Card */}
                    <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-sm flex flex-col items-center justify-center text-center z-10 border-4 border-blue-50">
                        <Link to="/" className="w-full flex flex-col items-center">
                            <div className="w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center mb-6 overflow-hidden border-4 border-white shadow-inner">
                                {logoUrl ? (
                                    <img
                                        src={`${BASE_URL}${logoUrl}`}
                                        alt={instituteName || "Logo"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={80} className="text-blue-200" />
                                )}
                            </div>
                            <h3 className="text-2xl font-black text-blue-900 line-clamp-2 px-2 uppercase tracking-tight">
                                {instituteName || "TNCDC Academy"}
                            </h3>
                            <div className="h-1.5 w-12 bg-orange-400 rounded-full mt-4 mb-2"></div>
                            <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">Institute Management</p>
                        </Link>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-12 bg-white flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
                        <p className="text-lg text-gray-500 text-center mb-8">Please login to your account to continue</p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 text-lg rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 text-lg rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-600/30"
                            >
                                SIGN IN
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-center space-x-2 text-gray-600">
                                <Smartphone size={20} className="text-purple-600" />
                                <span className="text-sm">Install as Progressive Web App (Mobile App) for Students</span>
                                <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded font-bold">FREE</span>
                            </div>
                            <p className="text-sm text-center text-gray-400 mt-2">Access your courses anytime, anywhere with our mobile app experience</p>

                            <button 
                                onClick={() => window.dispatchEvent(new CustomEvent('trigger-pwa-install'))}
                                className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Install Mobile App
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;






