import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPartners } from '@/store/websiteSlice';
import { BASE_URL } from '@/config';

const BrandSlider = () => {
    const dispatch = useDispatch();
    const dynamicPartners = useSelector((state) => state.website.partners || []);

    useEffect(() => {
        dispatch(fetchPartners());
    }, [dispatch]);

    const staticBrands = [
        "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/b/b8/Adobe_Systems_logo_and_wordmark.svg",
    ];

    // Use dynamic partners if available, otherwise fallback to static for demo
    const brands = dynamicPartners.length > 0 
        ? dynamicPartners.map(p => p.imageUrl.startsWith('/uploads') ? `${BASE_URL}${p.imageUrl}` : p.imageUrl)
        : staticBrands;

    return (
        <section className="brand-section py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 mb-12 text-center">
                <h5 className="text-xl md:text-2xl font-extrabold text-[#1a3d32] tracking-tight">
                    Trusted by <span className="text-blue-600">industry leaders</span> and{' '}
                    <span className="text-orange-500">valued partners</span> worldwide
                </h5>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="relative flex overflow-x-hidden group justify-center">
                <div className={`flex ${brands.length > 5 ? 'animate-marquee' : ''} whitespace-nowrap gap-20 md:gap-32 items-center py-8`}>
                    {brands.map((logo, index) => (
                        <div key={index} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 transform hover:scale-125">
                            <img src={logo} alt="Partner" className="h-14 md:h-20 w-auto object-contain max-w-[250px]" />
                        </div>
                    ))}
                    {/* Duplicate for seamless scroll - ONLY if animating */}
                    {brands.length > 5 && brands.map((logo, index) => (
                        <div key={`dup-${index}`} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 transform hover:scale-125">
                            <img src={logo} alt="Partner" className="h-14 md:h-20 w-auto object-contain max-w-[250px]" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandSlider;






