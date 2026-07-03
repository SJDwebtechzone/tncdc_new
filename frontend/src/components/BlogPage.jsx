import React, { useEffect } from 'react';
import { Calendar, User, ArrowRight, Tag, BookOpen } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '@/store/websiteSlice';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Marquee from './Marquee';
import Footer from './Footer';

const BlogPage = () => {
    const dispatch = useDispatch();
    const { posts } = useSelector((state) => state.website);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />
            <Marquee />

            <main className="pt-[180px] pb-24">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">
                            <BookOpen size={16} />
                            Insights & Updates
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Latest from Our <span className="text-blue-600">Blog</span>
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                            Stay updated with the latest trends in technology, education, and professional development.
                        </p>
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article 
                                    key={post.id} 
                                    className="group bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 flex flex-col h-full"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img 
                                            src={post.thumbnail} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                            {post.tags?.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-blue-500" />
                                                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                            <div className="flex items-center gap-1.5">
                                                <User size={14} className="text-blue-500" />
                                                Admin
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                        
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                                            {post.subheading}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                                            <Link 
                                                to={`/posts/${post.id}`}
                                                className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all duration-300"
                                            >
                                                Read Full Story
                                                <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
                            <BookOpen size={64} className="mx-auto text-slate-200 mb-6" />
                            <h2 className="text-2xl font-bold text-slate-400">No blog posts found</h2>
                            <p className="text-slate-400 font-medium">Check back later for fresh content.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogPage;
