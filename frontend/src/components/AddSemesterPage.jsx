import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseWithSubjects, fetchSubjects, addCourseSemesterAsync, updateCourseSemesterAsync } from '@/store/courseSlice';
import { Plus, Trash2, ChevronLeft, Save, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AddSemesterPage = () => {
    const { id, semesterId } = useParams();
    const isEditMode = Boolean(semesterId);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [allSubjects, setAllSubjects] = useState([]);
    
    // Form State
    const [semesterName, setSemesterName] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([{
        subjectId: '',
        order: '1',
        totalMarks: 100,
        passingPercentage: 35,
        objectiveMarks: 50,
        practicalMarks: 50,
        totalQuestions: 0,
        marksPerQuestion: 0,
        examTiming: 0
    }]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [courseRes, subjectsRes] = await Promise.all([
                    dispatch(fetchCourseWithSubjects(id)).unwrap(),
                    dispatch(fetchSubjects()).unwrap()
                ]);
                
                setCourse(courseRes);
                setAllSubjects(subjectsRes);
                
                if (semesterId && courseRes.semesters) {
                    const existingSem = courseRes.semesters.find(s => s.id.toString() === semesterId);
                    if (existingSem) {
                        setSemesterName(existingSem.name);
                        if (existingSem.subjects && existingSem.subjects.length > 0) {
                            setSelectedSubjects(existingSem.subjects.map(s => ({
                                subjectId: s.subjectId?.toString() || '',
                                order: s.order?.toString() || '1',
                                totalMarks: s.totalMarks || 100,
                                passingPercentage: s.passingPercentage || 35,
                                objectiveMarks: s.objectiveMarks || 50,
                                practicalMarks: s.practicalMarks || 50,
                                totalQuestions: s.totalQuestions || 0,
                                marksPerQuestion: s.marksPerQuestion || 0,
                                examTiming: s.examTiming || 0
                            })));
                        }
                    }
                }
                
                setLoading(false);
            } catch (err) {
                toast.error('Failed to load course data');
                console.error(err);
                setLoading(false);
            }
        };
        
        loadData();
    }, [id, dispatch]);

    const handleAddSubject = () => {
        if (selectedSubjects.length >= 15) {
            toast.error('Maximum 15 subjects allowed per semester');
            return;
        }
        setSelectedSubjects([...selectedSubjects, {
            subjectId: '',
            order: (selectedSubjects.length + 1).toString(),
            totalMarks: 100,
            passingPercentage: 35,
            objectiveMarks: 50,
            practicalMarks: 50,
            totalQuestions: 0,
            marksPerQuestion: 0,
            examTiming: 0
        }]);
    };

    const handleRemoveSubject = (index) => {
        const newList = selectedSubjects.filter((_, i) => i !== index);
        setSelectedSubjects(newList.length > 0 ? newList : [{
            subjectId: '', order: '1', totalMarks: 100, passingPercentage: 35,
            objectiveMarks: 50, practicalMarks: 50, totalQuestions: 0,
            marksPerQuestion: 0, examTiming: 0
        }]);
    };

    const handleSubjectChange = (index, field, value) => {
        if (field === 'subjectId') {
            if (selectedSubjects.some((s, i) => i !== index && s.subjectId === value && value !== '')) {
                toast.error('Subject already selected in this semester');
                return;
            }
        }
        const newList = [...selectedSubjects];
        newList[index][field] = value;
        setSelectedSubjects(newList);
    };

    const handleSubmit = async () => {
        if (!semesterName.trim()) {
            toast.error('Please enter a semester name');
            return;
        }

        const validSubjects = selectedSubjects.filter(s => s.subjectId !== '');
        if (validSubjects.length === 0) {
            toast.error('Please select at least one subject');
            return;
        }

        try {
            if (isEditMode) {
                await dispatch(updateCourseSemesterAsync({
                    id,
                    semesterId,
                    data: {
                        name: semesterName,
                        subjects: validSubjects
                    }
                })).unwrap();
                toast.success('Semester updated successfully');
            } else {
                await dispatch(addCourseSemesterAsync({
                    id,
                    data: {
                        name: semesterName,
                        subjects: validSubjects
                    }
                })).unwrap();
                toast.success('Semester added successfully');
            }
            navigate('/dashboard/courses');
        } catch (err) {
            toast.error(err || 'Failed to save semester');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        {isEditMode ? 'Edit Semester' : 'Add Semester'}
                    </h1>
                    <p className="text-slate-600 font-bold">
                        {course?.title} - <span className="text-blue-600 uppercase">{course?.courseCode}</span>
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => navigate('/dashboard/courses')}
                    className="gap-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold shadow-sm"
                >
                    <ChevronLeft className="w-4 h-4" /> Back to List
                </Button>
            </div>

            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Course Category</p>
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Achieve More! <Sparkles className="w-5 h-5 text-orange-400" />
                    </h2>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-xs font-black text-slate-600 uppercase tracking-widest block ml-1">Semester Name</label>
                <Input 
                    placeholder="Enter Semester Name"
                    value={semesterName}
                    onChange={(e) => setSemesterName(e.target.value)}
                    className="h-12 w-full rounded-lg border-slate-200 focus:border-blue-500 shadow-sm text-sm font-medium"
                />
            </div>

            {/* Subjects Map */}
            <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <AnimatePresence>
                    {selectedSubjects.map((item, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group space-y-4"
                        >
                            <div className="flex flex-wrap md:flex-nowrap gap-4 items-end">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Select Subject</label>
                                    <select 
                                        value={item.subjectId} 
                                        onChange={(e) => handleSubjectChange(index, 'subjectId', e.target.value)}
                                        className="w-full h-10 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 px-3 focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="">Select Subject</option>
                                        {allSubjects.map(sub => (
                                            <option key={sub.id} value={sub.id.toString()}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="w-20">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Position</label>
                                    <Input 
                                        type="number"
                                        value={item.order}
                                        onChange={(e) => handleSubjectChange(index, 'order', e.target.value)}
                                        className="h-10 text-center font-semibold"
                                    />
                                </div>

                                <div className="w-24">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Total Marks</label>
                                    <Input 
                                        type="number"
                                        value={item.totalMarks}
                                        onChange={(e) => handleSubjectChange(index, 'totalMarks', e.target.value)}
                                        className="h-10 text-center font-semibold"
                                    />
                                </div>

                                <div className="w-24 bg-slate-100 rounded-lg p-1 px-2 border border-slate-200 h-10 flex flex-col justify-center">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase leading-none mb-1">Passing %</label>
                                    <input 
                                        type="number"
                                        value={item.passingPercentage}
                                        onChange={(e) => handleSubjectChange(index, 'passingPercentage', e.target.value)}
                                        className="bg-transparent w-full text-center text-sm font-semibold outline-none text-slate-500"
                                    />
                                </div>

                                <div className="w-24">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Objective</label>
                                    <Input 
                                        type="number"
                                        value={item.objectiveMarks}
                                        onChange={(e) => handleSubjectChange(index, 'objectiveMarks', e.target.value)}
                                        className="h-10 text-center font-semibold"
                                    />
                                    <p className="text-[8px] text-slate-400 mt-1 text-center font-medium">Passing: {Math.round(item.objectiveMarks * (item.passingPercentage / 100))}</p>
                                </div>

                                <div className="w-24">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Practical</label>
                                    <Input 
                                        type="number"
                                        value={item.practicalMarks}
                                        onChange={(e) => handleSubjectChange(index, 'practicalMarks', e.target.value)}
                                        className="h-10 text-center font-semibold"
                                    />
                                    <p className="text-[8px] text-slate-400 mt-1 text-center font-medium">Passing: {Math.round(item.practicalMarks * (item.passingPercentage / 100))}</p>
                                </div>

                                <div className="w-20">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Questions</label>
                                    <Input 
                                        type="number"
                                        value={item.totalQuestions}
                                        onChange={(e) => handleSubjectChange(index, 'totalQuestions', e.target.value)}
                                        className="h-10 text-center font-semibold"
                                    />
                                </div>

                                <div className="w-20 bg-slate-100 rounded-lg p-1 px-2 border border-slate-200 h-10 flex flex-col justify-center">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase leading-none mb-1">Mrks/Q</label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        value={item.marksPerQuestion}
                                        onChange={(e) => handleSubjectChange(index, 'marksPerQuestion', e.target.value)}
                                        className="bg-transparent w-full text-center text-sm font-semibold outline-none text-slate-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-end gap-4 mt-2">
                                <div className="w-32">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Exam Timing <br/><span className="lowercase font-normal">(Minutes)</span></label>
                                    <Input 
                                        type="number"
                                        value={item.examTiming}
                                        onChange={(e) => handleSubjectChange(index, 'examTiming', e.target.value)}
                                        className="h-10 text-center font-semibold"
                                    />
                                </div>

                                <div className="pt-2">
                                    <Button 
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRemoveSubject(index)}
                                        className="h-10 bg-[#dc2626] hover:bg-red-700 text-white font-bold gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Remove
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                <Button 
                    onClick={handleAddSubject}
                    className="bg-[#1e3a8a] text-white hover:bg-blue-900 font-bold px-6 h-10 rounded-md gap-2 shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Add More
                </Button>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <Button 
                    onClick={handleSubmit}
                    className="h-10 px-8 bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-sm rounded-md shadow-sm transition-all"
                >
                    Submit
                </Button>
                <Button 
                    variant="outline"
                    onClick={() => navigate('/dashboard/courses')}
                    className="h-10 px-8 border-none bg-[#cf9a5b] hover:bg-[#b08149] text-white font-bold rounded-md shadow-sm transition-all"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default AddSemesterPage;
