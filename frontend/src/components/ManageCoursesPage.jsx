import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Pencil, Plus, Search, Download, X, Eye } from "lucide-react"
import { useState } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCourses, updateCourseAsync, fetchCourseWithSubjects, deleteCourseSemesterAsync } from '@/store/courseSlice';
import { toast } from 'react-hot-toast';
import { useEffect } from "react"

const CustomBlueSwitch = ({ checked, onCheckedChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`
            relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none 
            ${checked ? 'bg-white border-[#0f172a]' : 'bg-gray-200 border-transparent'}
        `}
    >
        <span
            className={`
                pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform 
                ${checked ? 'translate-x-4 bg-[#0f172a]' : 'translate-x-0.5 bg-white'}
            `}
        />
    </button>
)

export default function ManageCoursesPage() {
    const courses = useSelector((state) => state.courses.courses);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("")
    const [viewModal, setViewModal] = useState({ show: false, loading: false, courseData: null });

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const filteredData = courses.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleViewSubjects = async (courseId) => {
        setViewModal({ show: true, loading: true, courseData: null });
        try {
            const data = await dispatch(fetchCourseWithSubjects(courseId)).unwrap();
            setViewModal({ show: true, loading: false, courseData: data });
        } catch (err) {
            console.error('Failed to fetch course subjects:', err);
            setViewModal({ show: false, loading: false, courseData: null });
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 border border-gray-100">

                {/* Top Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h1 className="text-xl font-bold text-gray-800">Manage Courses</h1>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => navigate('/dashboard/courses/add')}
                            className="bg-[#1e463a] hover:bg-[#153229] text-white gap-2 rounded-sm px-4 h-9 text-[11px] uppercase tracking-widest font-bold shadow-md transition-all active:scale-95"
                        >
                            <Plus size={14} /> Add Course
                        </Button>
                        <Button className="bg-[#1e463a] hover:bg-[#153229] text-white gap-2 rounded-sm px-4 h-9 text-[11px] uppercase tracking-widest font-bold shadow-md transition-all active:scale-95">
                            <Download size={14} /> Export
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center mb-8 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                    <div className="bg-white border border-gray-200 rounded-lg flex items-center px-3 h-10 w-full md:w-80 shadow-sm">
                        <Search className="text-gray-400 mr-2" size={16} />
                        <input
                            placeholder="Search...."
                            className="bg-transparent border-none outline-none text-sm w-full text-gray-600 placeholder:text-gray-400 font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button className="bg-[#1e3a8a] hover:bg-blue-900 text-white h-10 px-12 rounded-sm font-bold shadow-md transition-all active:scale-95">
                        Search
                    </Button>
                    <Button variant="outline" className="text-orange-400 border-orange-300 hover:bg-orange-50 h-10 px-12 rounded-sm font-bold transition-all active:scale-95" onClick={() => setSearchQuery("")}>
                        Reset
                    </Button>
                </div>

                {/* Table */}
                <div className="border border-gray-100 rounded-sm overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-gray-50/50 border-b border-gray-100">
                            <TableRow>
                                <TableHead className="w-[50px] font-bold text-gray-800 pl-4 text-[10px] uppercase tracking-wider border-r border-gray-100">#</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100 whitespace-nowrap min-w-[200px]">Title</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100 whitespace-nowrap">Course Type</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100 whitespace-nowrap">Course Category</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100 whitespace-nowrap">Course Code</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100 whitespace-nowrap">Duration</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100 whitespace-nowrap">MRP</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100 whitespace-nowrap">Price</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100 whitespace-nowrap">Status</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100 whitespace-nowrap text-center">Course Subject</TableHead>
                                <TableHead className="font-bold text-gray-800 text-[10px] uppercase tracking-wider border-r border-gray-100 whitespace-nowrap">Created At</TableHead>
                                <TableHead className="text-center font-bold text-gray-800 pr-4 text-[10px] uppercase tracking-wider whitespace-nowrap">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((row, index) => (
                                <TableRow key={row.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                                    <TableCell className="text-center font-bold text-gray-500 py-3 border-r border-gray-100 text-[11px]">{index + 1}</TableCell>
                                    <TableCell className="font-bold text-gray-800 text-[11px] border-r border-gray-100">{row.title}</TableCell>
                                    <TableCell className="text-gray-600 font-medium text-[11px] border-r border-gray-100 w-[100px]">
                                        <div className="flex flex-col gap-1">
                                            <span>{row.courseType}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600 font-medium text-[11px] border-r border-gray-100">{row.category?.name}</TableCell>
                                    <TableCell className="text-gray-600 font-medium text-[11px] border-r border-gray-100">{row.courseCode}</TableCell>
                                    <TableCell className="text-gray-600 font-medium text-[11px] border-r border-gray-100">{row.duration} {row.durationUnit}</TableCell>
                                    <TableCell className="text-gray-600 font-medium text-[11px] border-r border-gray-100">₹{row.mrp}</TableCell>
                                    <TableCell className="text-gray-600 font-medium text-[11px] border-r border-gray-100">₹{row.price}</TableCell>
                                    <TableCell className="border-r border-gray-100 text-center">
                                        <CustomBlueSwitch
                                            checked={row.status !== false}
                                            onCheckedChange={() => {
                                                dispatch(updateCourseAsync({ id: row.id, status: !row.status }));
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="border-r border-gray-100 text-center">
                                        {(row.courseType === 'Multiple' || row.courseType === 'Multiple Exam' || (row._count?.courseSubjects || 0) > 0) ? (
                                            <Button 
                                                size="sm" 
                                                className={`h-7 ${row.courseType === 'Multiple' ? 'bg-[#1e3a8a] hover:bg-blue-900 rounded-sm' : 'bg-emerald-600 hover:bg-emerald-700 rounded-sm'} text-white text-[10px] font-bold px-3 shadow-sm uppercase tracking-wider gap-1`}
                                                onClick={() => handleViewSubjects(row.id)}
                                            >
                                                {row.courseType === 'Multiple' ? 'Add / Update' : <><Eye size={12} /> View</>}
                                            </Button>
                                        ) : (
                                            <Button 
                                                size="sm" 
                                                className="h-auto py-1 bg-[#1e3a8a] hover:bg-blue-900 text-white text-[10px] font-bold px-3 rounded-sm shadow-sm leading-tight uppercase tracking-wider"
                                                onClick={() => navigate(`/dashboard/courses/${row.id}/add-subjects`)}
                                            >
                                                Add / <br /> Update
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-gray-500 font-medium text-[10px] border-r border-gray-100 whitespace-nowrap">
                                        {row.createdAt ? row.createdAt.split(' ')[0] : '2026-02-04'} <br />
                                        {/* <span className="text-gray-400">{row.createdAt.split(' ')[1]}</span> */}
                                    </TableCell>
                                    <TableCell className="text-center pr-4">
                                        <Button
                                            size="icon"
                                            className="h-8 w-8 bg-[#1a85ff] hover:bg-blue-600 text-white rounded-sm shadow-sm transition-all active:scale-95"
                                            onClick={() => {
                                                console.log('Navigating to Edit for ID:', row.id);
                                                navigate(`/dashboard/courses/edit/${row.id}`);
                                            }}
                                        >
                                            <Pencil size={14} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* ── View Course Details Modal ── */}
            {viewModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setViewModal({ show: false, loading: false, courseData: null })}>
                    <div 
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">Course Details</h2>
                            <button 
                                onClick={() => setViewModal({ show: false, loading: false, courseData: null })}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(85vh-130px)]">
                            {viewModal.loading ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : viewModal.courseData ? (
                                <div className="space-y-6">
                                    {/* Course Info Header */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <h3 className="font-bold text-slate-800 text-base">{viewModal.courseData.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Code: <span className="font-bold text-blue-600">{viewModal.courseData.courseCode}</span> 
                                            &nbsp;•&nbsp; Type: <span className="font-semibold">{viewModal.courseData.courseType}</span>
                                            &nbsp;•&nbsp; Category: <span className="font-semibold">{viewModal.courseData.category?.name || 'N/A'}</span>
                                        </p>
                                    </div>

                                    {/* Exam Configuration */}
                                    {(viewModal.courseData.totalMarks || viewModal.courseData.objectiveMarks || viewModal.courseData.practicalMarks) && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
                                                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Exam Configuration</h4>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {[
                                                    { label: 'Total Marks', value: viewModal.courseData.totalMarks },
                                                    { label: 'Objective', value: viewModal.courseData.objectiveMarks },
                                                    { label: 'Practical', value: viewModal.courseData.practicalMarks },
                                                    { label: 'Questions', value: viewModal.courseData.totalQuestions },
                                                    { label: 'Marks/Q', value: viewModal.courseData.marksPerQuestion },
                                                    { label: 'Duration', value: viewModal.courseData.examTiming ? `${viewModal.courseData.examTiming} min` : '-' },
                                                    { label: 'Pass %', value: viewModal.courseData.passingPercentage ? `${viewModal.courseData.passingPercentage}%` : '-' },
                                                ].map((item, i) => (
                                                    <div key={i} className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                                                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">{item.label}</p>
                                                        <p className="text-sm font-black text-emerald-800 mt-0.5">{item.value || '-'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Subjects Table */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-5 bg-[#146cda] rounded-sm"></div>
                                                <h4 className="font-bold text-slate-700 text-base">Semester & Subjects</h4>
                                            </div>
                                            {(viewModal.courseData.courseType === 'Multiple' || viewModal.courseData.courseType === 'Multiple Exam') ? (
                                                <Button 
                                                    size="sm"
                                                    className="h-8 text-sm font-bold bg-[#146cda] hover:bg-blue-600 text-white rounded-md px-4"
                                                    onClick={() => {
                                                        setViewModal({ show: false, loading: false, courseData: null });
                                                        navigate(`/dashboard/courses/${viewModal.courseData.id}/add-semester`);
                                                    }}
                                                >
                                                    Add New Semester
                                                </Button>
                                            ) : (
                                                <Button 
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-[10px] font-bold uppercase tracking-wider border-blue-200 text-blue-600 hover:bg-blue-50 rounded-md px-3"
                                                    onClick={() => {
                                                        setViewModal({ show: false, loading: false, courseData: null });
                                                        navigate(`/dashboard/courses/${viewModal.courseData.id}/add-subjects`);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                        </div>

                                        {(viewModal.courseData.courseType === 'Multiple' || viewModal.courseData.courseType === 'Multiple Exam') ? (
                                            <>
                                                {viewModal.courseData.semesters && viewModal.courseData.semesters.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {viewModal.courseData.semesters.map((sem, idx) => (
                                                            <div key={sem.id || idx} className="border border-slate-200 rounded-xl overflow-hidden mb-4">
                                                                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                                        <h5 className="font-bold text-slate-800 text-sm">{sem.name}</h5>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{sem.subjects?.length || 0} Subjects</span>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                            onClick={() => {
                                                                                setViewModal({ show: false, loading: false, courseData: null });
                                                                                navigate(`/dashboard/courses/${viewModal.courseData.id}/edit-semester/${sem.id}`);
                                                                            }}
                                                                        >
                                                                            <Pencil size={12} />
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                            onClick={async () => {
                                                                                if (window.confirm('Are you sure you want to delete this semester?')) {
                                                                                    try {
                                                                                        await dispatch(deleteCourseSemesterAsync({ id: viewModal.courseData.id, semesterId: sem.id })).unwrap();
                                                                                        const data = await dispatch(fetchCourseWithSubjects(viewModal.courseData.id)).unwrap();
                                                                                        setViewModal(prev => ({ ...prev, courseData: data }));
                                                                                        toast.success('Semester deleted successfully');
                                                                                    } catch (err) {
                                                                                        toast.error('Failed to delete semester');
                                                                                    }
                                                                                }
                                                                            }}
                                                                        >
                                                                            <X size={14} />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                {sem.subjects && sem.subjects.length > 0 ? (
                                                                    <table className="w-full">
                                                                        <thead>
                                                                            <tr className="bg-white">
                                                                                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Subject</th>
                                                                                <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Total Marks</th>
                                                                                <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Passing %</th>
                                                                                <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Timing</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {sem.subjects.map((cs, i) => (
                                                                                <tr key={cs.id || i} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50 transition-colors bg-white">
                                                                                    <td className="px-4 py-2 text-sm font-semibold text-slate-700">{cs.subject?.name || 'Unknown'}</td>
                                                                                    <td className="px-4 py-2 text-sm text-center font-bold text-slate-800">{cs.totalMarks || '-'}</td>
                                                                                    <td className="px-4 py-2 text-sm text-center font-medium text-slate-600">{cs.passingPercentage ? `${cs.passingPercentage}%` : '-'}</td>
                                                                                    <td className="px-4 py-2 text-sm text-center font-medium text-slate-600">{cs.examTiming ? `${cs.examTiming}m` : '-'}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                ) : (
                                                                    <div className="p-4 text-center bg-white"><p className="text-xs text-slate-400 italic">No subjects in this semester.</p></div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center bg-white">
                                                        <p className="text-sm text-slate-400 font-medium italic">No semesters available for this course.</p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {viewModal.courseData.courseSubjects && viewModal.courseData.courseSubjects.length > 0 ? (
                                                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                                                        <table className="w-full">
                                                            <thead>
                                                                <tr className="bg-slate-50/80">
                                                                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Subject</th>
                                                                    <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Objective Marks</th>
                                                                    <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Practical Marks</th>
                                                                    <th className="text-center px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Total Marks</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {viewModal.courseData.courseSubjects.map((cs, i) => (
                                                                    <tr key={cs.id || i} className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30 transition-colors">
                                                                        <td className="px-4 py-3 text-sm font-semibold text-blue-700">{cs.subject?.name || 'Unknown'}</td>
                                                                        <td className="px-4 py-3 text-sm text-center font-medium text-slate-600">{cs.objectiveMarks ?? viewModal.courseData.objectiveMarks ?? '-'}</td>
                                                                        <td className="px-4 py-3 text-sm text-center font-medium text-slate-600">{cs.practicalMarks ?? viewModal.courseData.practicalMarks ?? '-'}</td>
                                                                        <td className="px-4 py-3 text-sm text-center font-bold text-slate-800">{cs.totalMarks ?? viewModal.courseData.totalMarks ?? '-'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100">
                                                        <p className="text-sm text-slate-400 font-medium">No subjects assigned yet</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end px-6 py-4 border-t border-gray-100">
                            <Button 
                                onClick={() => setViewModal({ show: false, loading: false, courseData: null })}
                                className="bg-[#b8860b] hover:bg-[#996f09] text-white font-bold px-8 rounded-md shadow-sm transition-all active:scale-95"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


