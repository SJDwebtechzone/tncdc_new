import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdmissions } from '@/store/admissionSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, ArrowLeft, RefreshCcw, CheckCircle2, Trophy, Target, Award, User, BookOpen, Clock, ChevronDown, X, Plus } from "lucide-react";
import axios from 'axios';
import { BASE_URL } from '@/config';
import toast from 'react-hot-toast';
import { Badge } from "@/components/ui/badge";

export default function UpdateMarksPage() {
    const dispatch = useDispatch();
    const admissions = useSelector((state) => state.admissions?.admissions || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('list'); // 'list' or 'details'
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [examGrades, setExamGrades] = useState([]);
    const [examResults, setExamResults] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form state for updating marks
    const [formData, setFormData] = useState({
        semesterName: 'First Semester',
        totalObjectiveMarks: 50,
        obtainedObjectiveMarks: 0,
        totalPracticalMarks: 50,
        obtainedPracticalMarks: 0,
        subjects: '',
        isConfirmed: false
    });

    // Helper to convert comma string to array
    const subjectList = useMemo(() => {
        return formData.subjects ? formData.subjects.split(',').map(s => s.trim()).filter(Boolean) : [];
    }, [formData.subjects]);

    useEffect(() => {
        dispatch(fetchAdmissions());
        fetchExamGrades();
        fetchExamResults();
        fetchCourses();
    }, [dispatch]);

    const fetchExamGrades = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/exam-grades`);
            setExamGrades(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchExamResults = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/exam-results`);
            setExamResults(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/courses`);
            setCourses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredAdmissions = useMemo(() => {
        return admissions.filter(adm => 
            adm.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            adm.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            adm.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            adm.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [admissions, searchTerm]);

    const handleUpdateClick = (admission) => {
        setSelectedAdmission(admission);
        const existing = examResults.find(r => r.admissionId === admission.id);
        const course = courses.find(c => c.title === admission.courseName);
        
        let defaultSubjects = '';
        if (course) {
            if (course.courseType === 'Single') {
                defaultSubjects = (course.courseSubjects || [])
                    .map(cs => cs.subject?.name)
                    .filter(Boolean)
                    .join(', ');
            } else {
                const firstSem = course.semesters?.find(s => s.name === "First Semester" || s.order === 1);
                if (firstSem) {
                    defaultSubjects = (firstSem.subjects || [])
                        .map(cs => cs.subject?.name)
                        .filter(Boolean)
                        .join(', ');
                }
            }
        }

        if (existing) {
            setFormData({
                id: existing.id,
                semesterName: existing.semesterName,
                totalObjectiveMarks: existing.totalObjectiveMarks,
                obtainedObjectiveMarks: existing.obtainedObjectiveMarks,
                totalPracticalMarks: existing.totalPracticalMarks,
                obtainedPracticalMarks: existing.obtainedPracticalMarks,
                subjects: existing.subjects || defaultSubjects,
                isConfirmed: existing.isConfirmed
            });
        } else {
            setFormData({
                semesterName: 'First Semester',
                totalObjectiveMarks: course?.objectiveMarks || 50,
                obtainedObjectiveMarks: 0,
                totalPracticalMarks: course?.practicalMarks || 50,
                obtainedPracticalMarks: 0,
                subjects: defaultSubjects,
                isConfirmed: false
            });
        }
        setView('details');
    };

    // Auto-update subjects when semester changes if it's a new result
    useEffect(() => {
        if (selectedAdmission && view === 'details') {
            const isExisting = examResults.some(r => r.admissionId === selectedAdmission.id);
            if (!isExisting) {
                const course = courses.find(c => c.title === selectedAdmission.courseName);
                if (course && course.courseType !== 'Single') {
                    const selectedSem = course.semesters?.find(s => s.name === formData.semesterName);
                    if (selectedSem) {
                        const subjects = (selectedSem.subjects || [])
                            .map(cs => cs.subject?.name)
                            .filter(Boolean)
                            .join(', ');
                        setFormData(prev => ({ ...prev, subjects }));
                    }
                }
            }
        }
    }, [formData.semesterName, selectedAdmission, view, courses, examResults]);

    const handleSaveMarks = async () => {
        if (!formData.isConfirmed) {
            toast.error("Please confirm that the marks are accurate");
            return;
        }

        try {
            setLoading(true);
            const data = {
                ...formData,
                admissionId: selectedAdmission.id,
                totalMarks: parseFloat(formData.totalObjectiveMarks) + parseFloat(formData.totalPracticalMarks)
            };
            await axios.post(`${BASE_URL}/api/exam-results`, data);
            toast.success("Exam results updated successfully");
            fetchExamResults();
            setView('list');
        } catch (err) {
            console.error(err);
            toast.error("Failed to update exam results");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSubject = (name) => {
        const newList = subjectList.filter(s => s !== name);
        setFormData(prev => ({ ...prev, subjects: newList.join(', ') }));
    };

    const handleAddSubject = (name) => {
        if (name && !subjectList.includes(name)) {
            const newList = [...subjectList, name];
            setFormData(prev => ({ ...prev, subjects: newList.join(', ') }));
        }
    };

    const totalPossible = parseFloat(formData.totalObjectiveMarks) + parseFloat(formData.totalPracticalMarks);
    const totalObtained = parseFloat(formData.obtainedObjectiveMarks) + parseFloat(formData.obtainedPracticalMarks);
    const percentage = totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;
    
    const currentGrade = useMemo(() => {
        const rule = examGrades.find(g => percentage >= g.start && percentage <= g.end);
        return rule ? rule.grade : 'N/A';
    }, [percentage, examGrades]);

    const currentPerformance = useMemo(() => {
        const rule = examGrades.find(g => percentage >= g.start && percentage <= g.end);
        return rule ? rule.performance : 'Needs improvement';
    }, [percentage, examGrades]);

    const isObjectiveFail = formData.obtainedObjectiveMarks < (formData.totalObjectiveMarks * 0.35);
    const isPracticalFail = formData.obtainedPracticalMarks < (formData.totalPracticalMarks * 0.35);

    // Get current course details
    const currentCourse = useMemo(() => {
        return selectedAdmission ? courses.find(c => c.title === selectedAdmission.courseName) : null;
    }, [selectedAdmission, courses]);

    // Unique subjects for the dropdown
    const availableSubjects = useMemo(() => {
        if (!currentCourse) return [];
        const subjects = new Set();
        
        // Add course-level subjects
        (currentCourse.courseSubjects || []).forEach(cs => {
            if (cs.subject?.name) subjects.add(cs.subject.name);
        });

        // Add subjects from all semesters
        (currentCourse.semesters || []).forEach(sem => {
            (sem.subjects || []).forEach(cs => {
                if (cs.subject?.name) subjects.add(cs.subject.name);
            });
        });

        return Array.from(subjects).sort();
    }, [currentCourse]);

    if (view === 'details') {
        return (
            <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Profile Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl font-bold border-4 border-green-50">
                            {selectedAdmission.firstName[0]}{selectedAdmission.surname[0]}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-800">{selectedAdmission.firstName} {selectedAdmission.surname}</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-gray-500 text-sm">
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                    <BookOpen size={14} className="text-blue-500" />
                                    <span>{selectedAdmission.courseName}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                    <Target size={14} className="text-purple-500" />
                                    <span>{selectedAdmission.studentId}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                    <Clock size={14} className="text-orange-500" />
                                    <span>{selectedAdmission.batch || 'Afternoon'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-10 text-xs gap-2 rounded-lg border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">
                                <User size={14} /> Profile
                            </Button>
                            <Button variant="outline" className="h-10 text-xs gap-2 rounded-lg border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">
                                <RefreshCcw size={14} className="rotate-0" /> Log out
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Grade System Display */}
                <div className="bg-[#6366f1] rounded-2xl p-6 shadow-md shadow-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                    <div className="flex items-center gap-3 mb-6 relative">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Award className="text-white" size={24} />
                        </div>
                        <h3 className="text-white font-bold text-lg">Course Grade System</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                        {examGrades.slice(0, 4).map((grade, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 transform transition-transform hover:scale-[1.02]">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/80 text-xs font-bold uppercase tracking-wider">{grade.performance}</span>
                                    <span className="bg-white/20 text-white rounded px-2 py-0.5 text-[10px] font-bold">{grade.start}-{grade.end}%</span>
                                </div>
                                <div className="text-white text-2xl font-black">{grade.grade}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ResultCard icon={Target} color="border-l-blue-500" bgColor="bg-blue-50" iconColor="text-blue-500" label="Total Marks" value={totalPossible} help="Combined theory & practical" />
                            <ResultCard icon={CheckCircle2} color="border-l-green-500" bgColor="bg-green-50" iconColor="text-green-500" label="Obtained Marks" value={totalObtained} help="Your total score" />
                            <ResultCard icon={Trophy} color="border-l-pink-500" bgColor="bg-pink-50" iconColor="text-pink-500" label="Percentage" value={`${percentage.toFixed(2)}%`} help="Overall performance" />
                            <ResultCard icon={Award} color="border-l-orange-500" bgColor="bg-orange-50" iconColor="text-orange-500" label="Grade" value={currentGrade} help={currentPerformance} />
                        </div>

                        {/* Input Fields */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-gray-800">Exam Mark Entries</h3>
                                    <p className="text-xs text-gray-400 font-medium">Select semester and enter marks obtained</p>
                                </div>
                                <Button variant="outline" onClick={() => setFormData({...formData, obtainedObjectiveMarks: 0, obtainedPracticalMarks: 0})} className="h-8 text-[11px] gap-2 border-pink-200 text-pink-600 hover:bg-pink-50 font-bold px-4 rounded-full uppercase">
                                    <RefreshCcw size={14} /> Reset Exam
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {/* Semester Selection */}
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Select Semester</label>
                                    <div className="relative group">
                                        <select 
                                            value={formData.semesterName}
                                            onChange={(e) => setFormData({...formData, semesterName: e.target.value})}
                                            className="w-full h-11 bg-gray-50 border border-gray-100 rounded-lg font-bold text-gray-700 px-4 appearance-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all cursor-pointer"
                                        >
                                            {currentCourse?.semesters?.length > 0 ? (
                                                currentCourse.semesters.map(s => (
                                                    <option key={s.id} value={s.name}>{s.name}</option>
                                                ))
                                            ) : (
                                                <option value="First Semester">First Semester</option>
                                            )}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                </div>

                                {/* Objective Marks */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Objective Marks</label>
                                        <div className="h-11 bg-gray-100 rounded-lg flex items-center px-4 text-gray-500 font-medium">
                                            {formData.totalObjectiveMarks}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Obtained Objective Marks</label>
                                        <div className="relative group">
                                            <Input 
                                                type="number" 
                                                value={formData.obtainedObjectiveMarks}
                                                onChange={(e) => setFormData({...formData, obtainedObjectiveMarks: e.target.value})}
                                                className="h-11 border-gray-100 hover:border-blue-400 focus:ring-4 focus:ring-blue-50 rounded-lg text-lg font-bold pl-4 pr-12 transition-all" 
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">/ {formData.totalObjectiveMarks}</div>
                                        </div>
                                        <div className="flex justify-between items-center px-1">
                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${isObjectiveFail ? 'bg-pink-100 text-pink-600' : 'bg-green-100 text-green-600'}`}>
                                                {isObjectiveFail ? 'Fail' : 'Pass'}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium italic">Passing: {Math.ceil(formData.totalObjectiveMarks * 0.35)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Practical Marks */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Practical Marks</label>
                                        <div className="h-11 bg-gray-100 rounded-lg flex items-center px-4 text-gray-500 font-medium">
                                            {formData.totalPracticalMarks}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Obtained Practical Marks</label>
                                        <div className="relative group">
                                            <Input 
                                                type="number"
                                                value={formData.obtainedPracticalMarks}
                                                onChange={(e) => setFormData({...formData, obtainedPracticalMarks: e.target.value})}
                                                className="h-11 border-gray-100 hover:border-blue-400 focus:ring-4 focus:ring-blue-50 rounded-lg text-lg font-bold pl-4 pr-12 transition-all" 
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">/ {formData.totalPracticalMarks}</div>
                                        </div>
                                        <div className="flex justify-between items-center px-1">
                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${isPracticalFail ? 'bg-pink-100 text-pink-600' : 'bg-green-100 text-green-600'}`}>
                                                {isPracticalFail ? 'Fail' : 'Pass'}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium italic">Passing: {Math.ceil(formData.totalPracticalMarks * 0.35)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Subjects Interactive Sector */}
                                <div className="md:col-span-2 space-y-1.5 pt-4">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subjects involved</label>
                                    
                                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                                        {/* Dropdown Selector */}
                                        <div className="flex-1 relative group">
                                            <select 
                                                className="w-full h-11 bg-gray-50 border border-gray-100 rounded-lg font-bold text-gray-700 px-4 appearance-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all cursor-pointer"
                                                onChange={(e) => {
                                                    handleAddSubject(e.target.value);
                                                    e.target.value = ""; // Reset
                                                }}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Select from course...</option>
                                                {availableSubjects.map((name, idx) => (
                                                    <option key={idx} value={name}>{name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                                        </div>

                                        {/* Manual Add Trigger */}
                                        <div className="flex-1">
                                            <Input 
                                                placeholder="Or type & press Enter..." 
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddSubject(e.target.value);
                                                        e.target.value = "";
                                                    }
                                                }}
                                                className="h-11 bg-white border-gray-100 rounded-lg font-medium shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 p-5 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-2xl min-h-[120px] transition-all hover:bg-slate-50/80">
                                        {subjectList.length > 0 ? (
                                            subjectList.map((subject, idx) => (
                                                <Badge 
                                                    key={idx} 
                                                    className="bg-white hover:bg-indigo-50 text-slate-800 border border-slate-200 py-2 pl-3 pr-2 rounded-xl gap-2 group transition-all shadow-sm"
                                                >
                                                    <span className="font-black text-[11px] tracking-wide">{subject}</span>
                                                    <button onClick={() => handleRemoveSubject(subject)} className="text-slate-300 hover:text-red-500 p-1 rounded-full hover:bg-white transition-all">
                                                        <X size={12} strokeWidth={3} />
                                                    </button>
                                                </Badge>
                                            ))
                                        ) : (
                                            <div className="w-full flex flex-col items-center justify-center text-slate-400 text-xs font-bold italic gap-2 py-4">
                                                <Plus size={20} className="text-slate-300" />
                                                Add subjects to record exam performance
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold italic px-1 pt-1">Tip: Select from dropdown or type a new subject and press Enter.</p>
                                </div>

                                {/* Confirmation */}
                                <div className="md:col-span-2 flex items-center gap-2 pt-2">
                                    <input 
                                        type="checkbox" 
                                        id="confirm" 
                                        checked={formData.isConfirmed}
                                        onChange={(e) => setFormData({...formData, isConfirmed: e.target.checked})}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 transition-all cursor-pointer" 
                                    />
                                    <label htmlFor="confirm" className="text-xs text-gray-600 font-medium cursor-pointer">I confirm that these exam results are accurate</label>
                                </div>

                                {/* Actions */}
                                <div className="md:col-span-2 flex gap-4 pt-6">
                                    <Button onClick={() => setView('list')} variant="outline" className="h-12 flex-1 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50 font-bold gap-2">
                                        <ArrowLeft size={18} /> Back to List
                                    </Button>
                                    <Button 
                                        onClick={handleSaveMarks} 
                                        disabled={loading}
                                        className="h-12 flex-[2] rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold gap-2 shadow-lg shadow-gray-200"
                                    >
                                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} /> {loading ? "Updating..." : "Update Result"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Status Panel */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h4 className="text-sm font-bold text-gray-800 mb-4 inline-flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Performance Insight
                            </h4>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                                    <div className={`text-lg font-bold ${percentage >= 35 ? 'text-green-600' : 'text-pink-600'}`}>
                                        {percentage >= 35 ? 'Qualifies for Next Semester' : 'Requires Re-Evaluation'}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Grading Feedback</div>
                                    <div className="text-sm text-gray-600 leading-relaxed font-normal">
                                        Based on an overall score of <span className="font-bold text-indigo-600">{percentage.toFixed(2)}%</span>, the student has achieved a <span className="font-extrabold text-blue-600">{currentGrade} Grade</span>.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-2">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Student Exam Records</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium italic">Manage and update academic results for all enrolled students</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    <Button variant="ghost" className="h-9 px-4 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">Active Students</Button>
                    <Button variant="ghost" className="h-9 px-4 rounded-lg text-gray-500 text-xs font-medium hover:bg-gray-50">Archived Records</Button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100/80">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <Input
                            placeholder="Search by student name, ID or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-14 bg-gray-50/30 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 rounded-2xl text-base transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white h-14 px-10 rounded-2xl font-black text-sm shadow-lg shadow-blue-100 min-w-[140px] transition-all active:scale-95">
                            Apply Search
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => setSearchTerm('')}
                            className="border-gray-200 text-gray-500 hover:bg-gray-50 h-14 px-8 rounded-2xl font-bold min-w-[100px]"
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/40 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc] border-b border-gray-200/50">
                                <TableHead className="font-bold text-[#64748b] text-[11px] uppercase tracking-widest py-6 px-8 w-16">#</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[11px] uppercase tracking-widest py-6">Admission Id</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[11px] uppercase tracking-widest py-6">Student Name</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[11px] uppercase tracking-widest py-6">Course</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[11px] uppercase tracking-widest py-6">Admission Date</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[11px] uppercase tracking-widest py-6">Performance</TableHead>
                                <TableHead className="font-bold text-[#64748b] text-[11px] uppercase tracking-widest py-6 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAdmissions.map((admission, index) => {
                                const result = examResults.find(r => r.admissionId === admission.id);
                                return (
                                    <TableRow key={admission.id} className="group hover:bg-gray-50/80 transition-all border-b border-gray-50 last:border-0">
                                        <TableCell className="py-6 px-8 text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                                            {String(index + 1).padStart(2, '0')}
                                        </TableCell>
                                        <TableCell className="py-6 text-sm">
                                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-black text-xs border border-slate-200 shadow-sm">
                                                {admission.id}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                                    {admission.firstName[0]}
                                                </div>
                                                <div className="font-black text-gray-800 text-base">{admission.firstName} {admission.surname}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-700 text-sm max-w-[200px] truncate">{admission.courseName}</span>
                                                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter mt-0.5">{admission.studentId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
                                                <span className="text-gray-800 font-black text-xs">{new Date(admission.admissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            {result ? (
                                                <div className="space-y-1.5 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                                    <div className="font-black text-[11px] text-gray-500 uppercase tracking-wider">{result.semesterName}</div>
                                                    <div className="text-[11px] font-bold flex flex-wrap items-center gap-x-3 gap-y-1">
                                                        <span className="text-gray-500">Marks: <span className="text-slate-900">{result.percentage.toFixed(2)}%</span></span>
                                                        <span className={`px-2 py-0.5 rounded-full ${result.result === 'pass' ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'} uppercase text-[9px]`}>
                                                            {result.result}
                                                        </span>
                                                        <span className="text-gray-500">Grade: <span className="text-indigo-600">{result.grade}</span></span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-300 italic text-xs font-medium">
                                                    <RefreshCcw size={12} /> Pending Result
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-6 text-center">
                                            <Button 
                                                onClick={() => handleUpdateClick(admission)}
                                                className={`h-10 px-6 rounded-2xl text-xs font-black flex items-center gap-2 mx-auto transition-all shadow-lg active:scale-95 ${result ? 'bg-[#2563eb] hover:bg-[#1d4ed8]' : 'bg-[#2563eb] hover:bg-[#1d4ed8]'} text-white shadow-blue-100`}
                                            >
                                                <Edit size={14} />
                                                {result ? result.semesterName : 'Update Result'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
                {filteredAdmissions.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 border-2 border-slate-100 mb-4 animate-pulse">
                            <Search className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-gray-800 font-bold mb-1">No Students Found</h3>
                        <p className="text-gray-400 text-sm font-medium">Try adjusting your search filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ResultCard({ icon: Icon, color, bgColor, iconColor, label, value, help }) {
    return (
        <div className={`p-6 rounded-3xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md ${color} border-l-4`}>
            <div className={`w-12 h-12 rounded-2xl ${bgColor} ${iconColor} flex items-center justify-center mb-6 shadow-inner`}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{label}</div>
                <div className="text-2xl font-black text-gray-900 tracking-tight">{value}</div>
                <div className="text-[10px] text-gray-400 font-bold leading-tight pt-1 truncate">{help}</div>
            </div>
        </div>
    );
}
