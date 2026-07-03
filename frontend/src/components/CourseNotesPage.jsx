import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Plus, Search, Download, FileText, X, Trash2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourseNotesAsync, addCourseNoteAsync, deleteCourseNoteAsync, fetchCourses } from '@/store/courseSlice';
import toast from 'react-hot-toast';

export default function CourseNotesPage() {
    const dispatch = useDispatch();
    const { courses = [], notes = [] } = useSelector((state) => state.courses);
    const [searchCourseId, setSearchCourseId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [formData, setFormData] = useState({ courseId: '', subjectId: '', semesterId: '', title: '' });

    useEffect(() => {
        dispatch(fetchCourseNotesAsync());
        if (courses.length === 0) dispatch(fetchCourses());
    }, [dispatch]);

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            toast.error("Please select a PDF file");
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('courseId', formData.courseId);
        data.append('subjectId', formData.subjectId);
        if (formData.semesterId) data.append('semesterId', formData.semesterId);
        data.append('file', selectedFile);

        setIsSubmitting(true);
        try {
            await dispatch(addCourseNoteAsync(data)).unwrap();
            toast.success("Course Note added successfully!");
            setIsModalOpen(false);
            setFormData({ courseId: '', subjectId: '', semesterId: '', title: '' });
            setSelectedFile(null);
        } catch (error) {
            toast.error(error || "Failed to add course note");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        setIsDeleting(id);
        try {
            await dispatch(deleteCourseNoteAsync(id)).unwrap();
            toast.success("Note deleted successfully!");
        } catch (error) {
            toast.error(error || "Failed to delete note");
        } finally {
            setIsDeleting(null);
        }
    };

    const filteredNotes = notes.filter(note =>
        !searchCourseId || note.courseId.toString() === searchCourseId.toString()
    );

    // Form logic to get Semesters and Subjects dynamically
    const selectedCourseObj = courses.find(c => c.id.toString() === formData.courseId) || null;
    const isMultiple = selectedCourseObj?.courseType === 'Multiple' || selectedCourseObj?.courseType === 'Multiple Exam';

    let subjectOptions = [];
    if (selectedCourseObj) {
        if (isMultiple) {
            if (formData.semesterId) {
                const sem = selectedCourseObj.semesters?.find(s => s.id.toString() === formData.semesterId);
                subjectOptions = sem ? (sem.subjects || []) : [];
            }
        } else {
            subjectOptions = selectedCourseObj.courseSubjects || [];
        }
    }

    return (
        <div className="space-y-6 relative animate-in fade-in duration-500">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight ml-1">Manage Course Notes</h1>

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                {/* Filters Row */}
                <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="flex flex-col gap-1.5 flex-1 max-w-[240px]">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Course</label>
                            <select
                                className="h-10 w-full rounded-sm border border-gray-200 text-sm bg-gray-50/50 outline-none focus:ring-1 focus:ring-blue-900 transition-all px-3"
                                value={searchCourseId}
                                onChange={(e) => setSearchCourseId(e.target.value)}
                            >
                                <option value="">All Courses</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end h-full pt-6">
                            <Button className="h-10 px-12 bg-[#1e3a8a] text-white rounded-sm font-bold shadow-md hover:bg-blue-900 transition-all active:scale-95">
                                Search
                            </Button>
                        </div>
                        <div className="flex items-end h-full pt-6">
                            <Button
                                variant="outline"
                                className="h-10 px-12 bg-[#b9875a] hover:bg-[#a6764a] text-white border-none rounded-sm font-bold shadow-md transition-all active:scale-95"
                                onClick={() => setSearchCourseId("")}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-end gap-2 pt-6">
                        <Button className="bg-[#1e463a] hover:bg-[#153229] text-white gap-2 h-10 px-4 rounded-sm transition-all shadow-md font-bold text-xs">
                            <Download size={14} /> Export
                        </Button>
                        <Button onClick={() => setIsModalOpen(true)} className="bg-[#1e463a] hover:bg-[#153229] text-white gap-2 h-10 px-4 rounded-sm transition-all shadow-md font-bold text-xs">
                            <Plus size={14} /> Add New Note
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50 border-b border-gray-100">
                            <TableRow>
                                <TableHead className="w-[60px] font-bold text-gray-800 text-[10px] uppercase tracking-wider text-center border-r border-gray-50">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-50">Course</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-50">Subject</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-50">Note Title</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-50">Created At</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-50">File</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider text-center w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredNotes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center text-gray-400 italic text-sm">
                                        No notes found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredNotes.map((row, index) => (
                                    <TableRow key={row.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                                        <TableCell className="text-center font-bold text-gray-500 py-4 border-r border-gray-50">{index + 1}</TableCell>
                                        <TableCell className="font-bold text-[#1e3a8a] border-r border-gray-50 text-xs">{row.course?.title}</TableCell>
                                        <TableCell className="text-[#1e3a8a] border-r border-gray-50 text-xs font-medium">
                                            {row.subject?.name}
                                            {row.semester && <div className="text-[10px] text-gray-400 mt-0.5">{row.semester.name}</div>}
                                        </TableCell>
                                        <TableCell className="text-gray-700 border-r border-gray-50 text-xs font-medium">{row.title}</TableCell>
                                        <TableCell className="text-xs font-medium text-gray-600 border-r border-gray-50">
                                            {new Date(row.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-gray-600 border-r border-gray-50">
                                            <a href={row.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                <FileText size={14} /> PDF
                                            </a>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 bg-red-50 hover:bg-red-100 rounded-sm"
                                                    disabled={isDeleting === row.id} onClick={() => handleDelete(row.id)}>
                                                    {isDeleting === row.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Add Note Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight text-[15px]">Add New Course Note</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            {/* Course Select */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Course <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    className="h-10 w-full rounded-sm border border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all px-3 bg-white"
                                    value={formData.courseId}
                                    onChange={e => setFormData({ ...formData, courseId: e.target.value, semesterId: '', subjectId: '' })}
                                >
                                    <option value="">Select a course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.title} {course.courseCode ? `(${course.courseCode})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Conditionally render Semester dropdown if Multiple */}
                            {selectedCourseObj && isMultiple && (
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Semester <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        className="h-10 w-full rounded-sm border border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all px-3 bg-white"
                                        value={formData.semesterId}
                                        onChange={e => setFormData({ ...formData, semesterId: e.target.value, subjectId: '' })}
                                    >
                                        <option value="">{selectedCourseObj.semesters?.length === 0 ? 'No semesters added to this course' : 'Select a semester'}</option>
                                        {selectedCourseObj.semesters?.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Subject Select */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Subject <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    className="h-10 w-full rounded-sm border border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all px-3 bg-white"
                                    value={formData.subjectId}
                                    onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                >
                                    <option value="">{subjectOptions.length === 0 ? 'No subjects added to this selection' : 'Select a subject'}</option>
                                    {subjectOptions.map(cs => (
                                        <option key={cs.subjectId} value={cs.subjectId}>{cs.subject?.name || 'Loading...'}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Note Title */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Note Title <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all"
                                    placeholder="Enter Note title"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Notes PDF Selection */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Notes (PDF) <span className="text-red-500">*</span></label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 border border-gray-200 rounded-sm p-1 pr-3 h-10">
                                        <input
                                            type="file"
                                            id="note-file"
                                            className="hidden"
                                            accept=".pdf"
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-8 text-[11px] font-bold px-4 rounded-sm bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700"
                                            onClick={() => document.getElementById('note-file').click()}
                                        >
                                            Choose File
                                        </Button>
                                        <span className="text-[11px] text-gray-500 font-medium truncate flex-1">
                                            {selectedFile ? selectedFile.name : "No file chosen"}
                                        </span>
                                        {selectedFile && (
                                            <button type="button" onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium italic">Only PDF allowed, max 10MB.</p>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex justify-end gap-3 pt-6 border-t font-bold">
                                <Button
                                    type="button"
                                    onClick={() => !isSubmitting && setIsModalOpen(false)}
                                    className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-8 rounded-sm h-10 text-xs transition-all active:scale-95 shadow-md font-bold"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#1e463a] hover:bg-[#153229] text-white px-8 rounded-sm h-10 text-xs transition-all active:scale-95 shadow-md font-bold"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Add Note"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}






