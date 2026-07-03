import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '@/store/websiteSlice';
import { Calendar, User, Tag, ChevronLeft, Clock, Share2 } from 'lucide-react';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';

const BlogDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { posts } = useSelector((state) => state.website);
    const post = posts.find(p => p.id === parseInt(id));

    useEffect(() => {
        if (posts.length === 0) {
            dispatch(fetchPosts());
        }
    }, [dispatch, posts.length]);

    if (!post) {
        return (
            <div className="min-h-screen bg-white flex flex-col pt-40 items-center justify-center">
                <div className="animate-pulse text-slate-300 font-bold uppercase tracking-widest text-sm">Loading post...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Marquee />

            <main className="pt-[180px] pb-24">
                <div className="container mx-auto px-6 md:px-12 max-w-4xl">
                    {/* Back Link */}
                    <Link to="/posts" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-colors mb-12 group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to all posts
                    </Link>

                    {/* Article Header */}
                    <header className="space-y-6 mb-12">
                        <div className="flex flex-wrap gap-2">
                            {post.tags?.map((tag, i) => (
                                <span key={i} className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                            {post.title}
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-blue-100 pl-6">
                            {post.subheading}
                        </p>
                        
                        <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                    <Calendar size={12} /> Published Date
                                </p>
                                <p className="text-xs font-bold text-slate-900 uppercase">
                                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                    </header>

                    {/* Main Image */}
                    <div className="mb-16 rounded-[40px] overflow-hidden shadow-2xl">
                        <img 
                            src={post.thumbnail} 
                            alt={post.title} 
                            className="w-full aspect-[16/9] object-cover"
                        />
                    </div>

                    {/* Post Content */}
                    <div className="mb-16">
                        <div 
                            className="blog-content text-slate-600 leading-loose text-lg font-medium whitespace-normal"
                            dangerouslySetInnerHTML={{ __html: post.description }}
                        />
                        <style dangerouslySetInnerHTML={{ __html: `
                            .blog-content h1 { font-size: 2rem; font-weight: 800; color: #0f172a; margin-top: 2rem; margin-bottom: 1rem; }
                            .blog-content h2 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-top: 1.5rem; margin-bottom: 1rem; }
                            .blog-content p { margin-bottom: 1.5rem; }
                            .blog-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
                            .blog-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.5rem; }
                            .blog-content li { margin-bottom: 0.5rem; }
                            .blog-content blockquote { border-left: 4px solid #3b82f6; padding-left: 1.5rem; font-style: italic; color: #475569; margin-bottom: 1.5rem; }
                            .blog-content a { color: #3b82f6; text-decoration: underline; font-weight: 600; }
                            .blog-content b, .blog-content strong { font-weight: 800; color: #0f172a; }
                        `}} />
                    </div>


                    {/* Gallery Section */}
                    {post.additionalImages?.length > 0 && (
                        <div className="space-y-8 mb-16">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-blue-600"></span>
                                Visual Highlights
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {post.additionalImages.map((img, i) => (
                                    <div key={i} className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 group">
                                        <img 
                                            src={img} 
                                            alt={`Highlight ${i + 1}`} 
                                            className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-12 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">
                                <Share2 size={16} /> Share Post
                            </button>
                        </div>
                        <p className="text-slate-400 text-xs font-bold italic">© 2026 Institute Insights</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetailPage;
