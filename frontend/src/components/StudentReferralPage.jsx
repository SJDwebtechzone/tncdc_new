import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Copy, 
    Share2, 
    Gift, 
    Users, 
    Wallet, 
    Info, 
    CheckCircle2, 
    Sparkles,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const StudentReferralPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { summary, loading } = useSelector(state => state.studentDashboard);
    const referralCode = summary?.referralCode || 'TNCDCLOADING';
    
    const [activeTab, setActiveTab] = useState('how-it-works');

    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode);
        toast.success('Referral code copied!');
    };

    const handleShare = () => {
        const studentName = user?.fullName || 'Friend';
        const shareMessage = `Hey, ${studentName} here 👋🏻,\n\n🎓 Join me at Tamil Nadu career development council!\n\n👉 Use my referral code: ${referralCode}\n\n✨ Take a step towards your brighter future.\n\nRegister here:\ntncdc.in`;

        if (navigator.share) {
            navigator.share({
                title: 'Join TNCDC',
                text: shareMessage,
            }).catch(() => {});
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareMessage);
            toast.success('Message copied to clipboard!');
        }
    };

    const steps = [
        {
            title: "Share Your Code",
            desc: "Invite your friends to join TNCDC using your unique referral code.",
            icon: Share2,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Friends Join",
            desc: "When your friend enrolls in any course using your code.",
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            title: "Earn Rewards",
            desc: "Get ₹100 credited to your wallet for every successful admission.",
            icon: Gift,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        }
    ];

    const stats = [
        { label: 'Total Referrals', value: '0', icon: Users, color: 'text-blue-600' },
        { label: 'Pending Rewards', value: '₹0', icon: TrendingUp, color: 'text-orange-600' },
        { label: 'Earned Reward', value: '₹0', icon: Wallet, color: 'text-emerald-600' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">Loading Referral Hub...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* Header */}
            <div className="bg-[#FF9800] text-white px-6 py-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="relative z-10">
                    <button onClick={() => navigate('/pwa')} className="mb-4 bg-white/20 p-2 rounded-xl backdrop-blur-md active:scale-95 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-black tracking-tight leading-tight">Refer & Earn</h1>
                    <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mt-1">Invite friends, grow together</p>
                </div>
            </div>

            <div className="px-6 -mt-6">
                {/* Referral Code Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-orange-100/50 border border-orange-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <Sparkles size={100} />
                    </div>
                    
                    <div className="text-center relative z-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Your Unique Referral Code</p>
                        <div className="bg-gray-50 border-2 border-dashed border-orange-200 rounded-2xl py-4 px-6 flex items-center justify-center gap-4 mb-6">
                            <span className="text-2xl font-black text-gray-900 tracking-[0.2em]">{referralCode}</span>
                            <button 
                                onClick={handleCopy}
                                className="p-2 bg-white rounded-lg shadow-sm text-orange-600 hover:text-orange-700 active:scale-90 transition-all border border-orange-100"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                        <button 
                            onClick={handleShare}
                            className="w-full bg-gradient-to-r from-[#FF9800] to-[#FF5722] text-white rounded-2xl py-4 font-black uppercase tracking-widest text-[12px] shadow-lg shadow-orange-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                        >
                            <Share2 size={18} /> Share With Friends
                        </button>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm text-center">
                            <div className={`w-8 h-8 ${stat.color} bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                <stat.icon size={16} />
                            </div>
                            <p className="text-sm font-black text-gray-900">{stat.value}</p>
                            <p className="text-[7px] font-black text-gray-400 uppercase tracking-tighter mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="mt-8 flex gap-4 border-b border-gray-100 mb-6">
                    <button 
                        onClick={() => setActiveTab('how-it-works')}
                        className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'how-it-works' ? 'text-orange-600' : 'text-gray-400'}`}
                    >
                        How it works
                        {activeTab === 'how-it-works' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('my-referrals')}
                        className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'my-referrals' ? 'text-orange-600' : 'text-gray-400'}`}
                    >
                        My Referrals
                        {activeTab === 'my-referrals' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />}
                    </button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'how-it-works' ? (
                            <div className="space-y-4">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
                                        <div className={`w-12 h-12 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center shrink-0`}>
                                            <step.icon size={22} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 mb-1">{step.title}</h4>
                                            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="bg-indigo-50/50 rounded-[2rem] p-6 border border-indigo-50 mt-4">
                                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Info size={14} /> Important Note
                                    </h4>
                                    <p className="text-[10px] text-indigo-900/70 font-bold leading-relaxed">
                                        Rewards are only credited after your friend pays their first installment. Bonus can be used for your own fee payments or withdrawn to bank (Min ₹500).
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-gray-200">
                                <Users size={40} className="mx-auto text-gray-100 mb-4" />
                                <h3 className="text-sm font-black text-gray-900 mb-1">No Referrals Yet</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                                    Start sharing your code to <br/> earn rewards!
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            
            {/* Styles for no scrollbar */}
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default StudentReferralPage;
