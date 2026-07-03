import React from 'react';
import { useSelector } from 'react-redux';

const Marquee = () => {
    const messages = useSelector(state => state.website?.siteSettings?.marqueeEntries || []);

    return (
        <div className="overflow-hidden whitespace-nowrap w-full py-3 mt-[140px] bg-gradient-to-r from-purple-900 via-slate-900 to-purple-900 border-y border-purple-500/30 shadow-[0_4px_20px_-10px_rgba(147,51,234,0.5)] z-40 relative">
            <div className="marquee-gradient-content flex gap-12 text-pink-100 font-medium tracking-wide">
                {messages.map((msg, index) => (
                    <span key={index} className="whitespace-nowrap flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                        {msg}
                    </span>
                ))}
                {messages.map((msg, index) => (
                    <span key={`dup-${index}`} className="whitespace-nowrap flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                        {msg}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Marquee;