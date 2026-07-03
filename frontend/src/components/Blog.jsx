import React, { useEffect } from 'react';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '@/store/websiteSlice';
import { Link } from 'react-router-dom';

const Blog = () => {
    const dispatch = useDispatch();
    const { posts } = useSelector((state) => state.website);
    const siteSettings = useSelector((state) => state.website.siteSettings);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    // Only show top 3 posts on homepage
    const recentPosts = posts.slice(0, 3);

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div 
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white"
                            style={{ backgroundColor: `color-mix(in srgb, ${siteSettings?.primaryColor || '#3b82f6'} 15%, white)`, color: siteSettings?.primaryColor || '#3b82f6' }}
                        >
                            <BookOpen size={14} />
                            Our Blog & News
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                            Stay Ahead with Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${siteSettings?.primaryColor || '#3b82f6'}, ${siteSettings?.secondaryColor || '#6366f1'})` }}>Latest Stories</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            Dive into expert insights, student success stories, and the latest updates from the heart of our institute.
                        </p>
                    </div>
                    <Link 
                        to="/posts" 
                        className="inline-flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all pb-2 border-b-2 border-slate-900"
                    >
                        View All Posts
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentPosts.length > 0 ? (
                        recentPosts.map((post) => (
                            <article 
                                key={post.id} 
                                className="group flex flex-col h-full rounded-[32px] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-lg"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={post.thumbnail} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {post.tags?.slice(0, 1).map((tag, i) => (
                                            <span key={i} className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1 bg-white">
                                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} style={{ color: siteSettings?.primaryColor || '#3b82f6' }} />
                                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} style={{ color: siteSettings?.primaryColor || '#3b82f6' }} />
                                            Admin
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-4 transition-colors line-clamp-2 leading-tight" style={{ '--hover-color': siteSettings?.primaryColor }}>
                                        {post.title}
                                    </h3>

                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                                        <Link 
                                            to={`/posts/${post.id}`}
                                            className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest hover:gap-3 transition-all"
                                            style={{ color: siteSettings?.primaryColor || '#3b82f6' }}
                                        >
                                            Explore Story
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px]">
                            <p className="text-slate-400 font-bold italic uppercase tracking-widest">No blog stories available right now.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Blog;
