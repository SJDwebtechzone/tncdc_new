import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, deletePostFromServer } from '@/store/websiteSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function WebsitePostsPage() {
    const posts = useSelector((state) => state.website.posts || []);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm("Remove this post?")) {
            try {
                await dispatch(deletePostFromServer(id)).unwrap();
                toast.success("Post removed successfully");
            } catch (error) {
                toast.error(error || "Failed to remove post");
            }
        }
    };

    return (
        <div className="space-y-6 font-sans relative pb-10 pt-4">
            <div className="px-6 space-y-4">
                <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/10">
                        <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-widest">
                            Manage Blog Posts
                        </h2>
                        <Button
                            onClick={() => navigate('/dashboard/website/posts/add')}
                            className="bg-[#154c4c] hover:bg-[#0f3838] text-white gap-2 rounded-sm px-6 h-10 text-[11px] font-bold transition-all border-none uppercase tracking-wider"
                        >
                            + Add New Post
                        </Button>
                    </div>

                    <div className="p-6">
                        <div className="overflow-x-auto rounded-sm border border-gray-200">
                            <Table className="border-collapse w-full">
                                <TableHeader>
                                    <TableRow className="bg-[#f1f5f9] hover:bg-[#f1f5f9] border-b border-gray-200">
                                        <TableHead className="font-bold text-gray-800 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-center w-16">#</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Title</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Subheading</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-center">Thumbnail</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Tags</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 border-r border-gray-200 text-left">Created At</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 px-6 text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-24 text-center border-b border-gray-100 italic text-gray-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText size={48} className="text-gray-200" />
                                                    <span className="text-sm font-medium">No posts found</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        posts.map((row, index) => (
                                            <TableRow key={row.id} className="hover:bg-gray-50/50">
                                                <TableCell className="py-4 px-6 text-[12px] font-medium text-gray-500 border-r border-gray-200 text-center">{index + 1}</TableCell>
                                                <TableCell className="py-4 px-6 text-[12px] font-bold text-gray-700 border-r border-gray-200">{row.title}</TableCell>
                                                <TableCell className="py-4 px-6 text-[12px] text-gray-600 border-r border-gray-200 truncate max-w-[200px]">{row.subheading}</TableCell>
                                                <TableCell className="py-4 px-6 border-r border-gray-200 text-center">
                                                    <div className="w-16 h-10 bg-gray-50 rounded-sm border border-gray-100 flex items-center justify-center mx-auto overflow-hidden">
                                                        {row.thumbnail ? (
                                                            <img src={row.thumbnail} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon size={16} className="text-gray-200" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-[12px] text-gray-500 border-r border-gray-200">
                                                    <div className="flex flex-wrap gap-1">
                                                        {row.tags?.map((tag, i) => (
                                                            <span key={i} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">
                                                                {tag}
                                                            </span>
                                                        )) || '-'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-[11px] text-gray-500 border-r border-gray-200 uppercase whitespace-nowrap">
                                                    {new Date(row.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => navigate('/dashboard/website/posts/add', { state: { post: row } })}
                                                            className="h-8 w-8 bg-[#3b82f6] text-white rounded-sm flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(row.id)}
                                                            className="h-8 w-8 text-red-500 border border-red-100/30 rounded-sm flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}







