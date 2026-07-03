import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGalleryItems } from '@/store/websiteSlice';
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BASE_URL } from '@/config';

const API_URL = BASE_URL;

// Extract YouTube video ID from various URL formats
const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/shorts\/))([^&?/]+)/);
    return match ? match[1] : null;
};

// Get YouTube thumbnail
const getYouTubeThumbnail = (url, thumbnailUrl) => {
    if (thumbnailUrl) return thumbnailUrl;
    const videoId = getYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

const GalleryPage = () => {
    const dispatch = useDispatch();
    const galleryItems = useSelector((state) => state.website.gallery || []);

    const [activeTab, setActiveTab] = useState('images');
    const [currentPage, setCurrentPage] = useState(1);
    const [lightbox, setLightbox] = useState(null); // { type: 'IMAGE'|'VIDEO', src: string }
    const itemsPerPage = 12;

    useEffect(() => {
        dispatch(fetchGalleryItems());
    }, [dispatch]);

    const images = galleryItems.filter(item => item.type === 'IMAGE' && item.status);
    const videos = galleryItems.filter(item => item.type === 'VIDEO' && item.status);
    const data = activeTab === 'images' ? images : videos;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const openLightbox = (item) => {
        if (item.type === 'IMAGE') {
            const src = item.mediaUrl.startsWith('http') ? item.mediaUrl : `${API_URL}${item.mediaUrl}`;
            setLightbox({ type: 'IMAGE', src });
        } else if (item.type === 'VIDEO') {
            const videoId = getYouTubeId(item.mediaUrl);
            setLightbox({ type: 'VIDEO', src: videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : item.mediaUrl });
        }
    };

    const getImageSrc = (item) => {
        return item.mediaUrl.startsWith('http') ? item.mediaUrl : `${API_URL}${item.mediaUrl}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <Marquee />

            <main className="flex-grow container mx-auto px-4 py-12">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-4">Our Gallery</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Explore our campus life, events, and student activities through our collection of photos and videos.
                    </p>
                </div>

                {/* Toggle Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1.5 rounded-full shadow-md inline-flex">
                        <button
                            onClick={() => handleTabChange('images')}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                activeTab === 'images'
                                    ? 'bg-gradient-to-r from-[#FF512F] to-[#DD2476] text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Photos ({images.length})
                        </button>
                        <button
                            onClick={() => handleTabChange('videos')}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                activeTab === 'videos'
                                    ? 'bg-gradient-to-r from-[#FF512F] to-[#DD2476] text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Videos ({videos.length})
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                {currentItems.length === 0 ? (
                    <div className="text-center py-24 text-gray-400">
                        <p className="text-xl font-medium">No {activeTab} added yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                        {currentItems.map((item) => {
                            const thumbSrc = item.type === 'IMAGE'
                                ? getImageSrc(item)
                                : getYouTubeThumbnail(item.mediaUrl, item.thumbnailUrl);

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => openLightbox(item)}
                                    className="group relative rounded-2xl overflow-hidden shadow-md bg-white aspect-[4/3] cursor-pointer"
                                >
                                    {thumbSrc ? (
                                        <img
                                            src={thumbSrc}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            No Preview
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-300 flex items-end justify-start opacity-0 group-hover:opacity-100 p-4">
                                        {item.type === 'VIDEO' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white">
                                                    <Play fill="white" className="text-white ml-1" size={24} />
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-white text-sm font-semibold">{item.title}</p>
                                    </div>

                                    {item.type === 'VIDEO' && (
                                        <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                                            VIDEO
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-full border ${currentPage === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={`w-10 h-10 rounded-full font-bold transition-all ${currentPage === i + 1 ? 'bg-[#FF512F] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-full border ${currentPage === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

            </main>

            <Footer />

            {/* Lightbox Modal */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
                        onClick={() => setLightbox(null)}
                    >
                        <X size={24} />
                    </button>
                    <div
                        className="max-w-5xl w-full max-h-[85vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        {lightbox.type === 'IMAGE' ? (
                            <img
                                src={lightbox.src}
                                alt="Gallery"
                                className="w-full h-full max-h-[85vh] object-contain rounded-lg"
                            />
                        ) : (
                            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                <iframe
                                    src={lightbox.src}
                                    className="absolute inset-0 w-full h-full rounded-lg"
                                    allowFullScreen
                                    allow="autoplay; encrypted-media"
                                    title="Gallery Video"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
