import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchCourseWithSubjects, 
    updateCourseSubjects, 
    fetchSubjects 
} from '@/store/courseSlice';
import { 
    Plus, 
    Trash2, 
    ChevronLeft, 
    Save, 
    X, 
    BookOpen, 
    Gamepad2, 
    CheckCircle2,
    LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AddSubjectsToCoursePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [allSubjects, setAllSubjects] = useState([]);
    
    // Form State
    const [examConfig, setExamConfig] = useState({
        totalMarks: 100,
        objectiveMarks: 50,
        practicalMarks: 50,
        totalQuestions: 0,
        marksPerQuestion: 0,
        examTiming: 0,
        passingPercentage: 35
    });
    
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [courseRes, subjectsRes] = await Promise.all([
                    dispatch(fetchCourseWithSubjects(id)).unwrap(),
                    dispatch(fetchSubjects()).unwrap()
                ]);
                
                setCourse(courseRes);
                setAllSubjects(subjectsRes);
                
                // Initialize form with existing data
                setExamConfig({
                    totalMarks: courseRes.totalMarks || 100,
                    objectiveMarks: courseRes.objectiveMarks || 50,
                    practicalMarks: courseRes.practicalMarks || 50,
                    totalQuestions: courseRes.totalQuestions || 0,
                    marksPerQuestion: courseRes.marksPerQuestion || 0,
                    examTiming: courseRes.examTiming || 0,
                    passingPercentage: courseRes.passingPercentage || 35
                });
                
                if (courseRes.courseSubjects && courseRes.courseSubjects.length > 0) {
                    setSelectedSubjects(courseRes.courseSubjects.map(cs => ({
                        subjectId: cs.subjectId.toString(),
                        order: cs.order.toString()
                    })));
                } else {
                    setSelectedSubjects([{ subjectId: '', order: '1' }]);
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
        if (selectedSubjects.length >= 10) {
            toast.error('Maximum 10 subjects allowed');
            return;
        }
        setSelectedSubjects([...selectedSubjects, { subjectId: '', order: (selectedSubjects.length + 1).toString() }]);
    };

    const handleRemoveSubject = (index) => {
        const newList = selectedSubjects.filter((_, i) => i !== index);
        setSelectedSubjects(newList.length > 0 ? newList : [{ subjectId: '', order: '1' }]);
    };

    const handleSubjectChange = (index, subjectId) => {
        // Check if subject already selected
        if (selectedSubjects.some((s, i) => i !== index && s.subjectId === subjectId)) {
            toast.error('Subject already selected');
            return;
        }
        const newList = [...selectedSubjects];
        newList[index].subjectId = subjectId;
        setSelectedSubjects(newList);
    };

    const handleOrderChange = (index, order) => {
        const newList = [...selectedSubjects];
        newList[index].order = order;
        setSelectedSubjects(newList);
    };

    const handleSubmit = async () => {
        // Validation
        const validSubjects = selectedSubjects.filter(s => s.subjectId !== '');
        if (validSubjects.length === 0) {
            toast.error('Please select at least one subject');
            return;
        }

        try {
            await dispatch(updateCourseSubjects({
                id,
                data: {
                    subjects: validSubjects,
                    examConfig
                }
            })).unwrap();
            
            toast.success('Course updated successfully');
            navigate('/dashboard/courses');
        } catch (err) {
            toast.error(err || 'Failed to update course');
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
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                        </div>
                        Add Subjects To Course
                    </h1>
                    <p className="text-slate-500 font-bold pl-12">
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

            {/* Course Category Display */}
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                        <LayoutDashboard className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Course Category</p>
                        <p className="text-sm font-black text-slate-700">{course?.courseType || 'Single'}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 bg-blue-600 px-6 py-2.5 rounded-full shadow-lg shadow-blue-200 border border-blue-500 ring-4 ring-blue-50">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span className="text-sm font-black text-white tracking-wide uppercase">
                        Selected Subjects: {selectedSubjects.filter(s => s.subjectId).length} / 10
                    </span>
                </div>
            </div>

            {/* Exam Configuration Section */}
            <div className="bg-[#f0f9f6] rounded-3xl border-2 border-emerald-100 p-8 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Gamepad2 className="w-32 h-32 text-emerald-600" />
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h2 className="text-lg font-black text-emerald-800 tracking-tight uppercase">Exam Configuration <span className="text-[10px] text-emerald-600 lowercase ml-2 font-bold">(Applied to all subjects)</span></h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-emerald-700 uppercase tracking-wider ml-1">Total Marks</label>
                        <Input 
                            type="number"
                            value={examConfig.totalMarks}
                            onChange={(e) => setExamConfig({...examConfig, totalMarks: e.target.value})}
                            className="bg-white border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/10 font-bold text-emerald-900 rounded-xl h-12 shadow-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-emerald-700 uppercase tracking-wider ml-1">Objective Marks</label>
                        <Input 
                            type="number"
                            value={examConfig.objectiveMarks}
                            onChange={(e) => setExamConfig({...examConfig, objectiveMarks: e.target.value})}
                            className="bg-white border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/10 font-bold text-emerald-900 rounded-xl h-12 shadow-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-emerald-700 uppercase tracking-wider ml-1">Practical Marks</label>
                        <Input 
                            type="number"
                            value={examConfig.practicalMarks}
                            onChange={(e) => setExamConfig({...examConfig, practicalMarks: e.target.value})}
                            className="bg-white border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/10 font-bold text-emerald-900 rounded-xl h-12 shadow-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-emerald-700 uppercase tracking-wider ml-1">Total Questions</label>
                        <Input 
                            type="number"
                            value={examConfig.totalQuestions}
                            onChange={(e) => setExamConfig({...examConfig, totalQuestions: e.target.value})}
                            className="bg-white border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/10 font-bold text-emerald-900 rounded-xl h-12 shadow-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-emerald-700 uppercase tracking-wider ml-1">Marks per Question</label>
                        <Input 
                            type="number"
                            step="0.01"
                            value={examConfig.marksPerQuestion}
                            onChange={(e) => setExamConfig({...examConfig, marksPerQuestion: e.target.value})}
                            className="bg-slate-100 border-none font-bold text-slate-500 rounded-xl h-12 shadow-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-emerald-700 uppercase tracking-wider ml-1">Exam Timing (Minutes)</label>
                        <Input 
                            type="number"
                            value={examConfig.examTiming}
                            onChange={(e) => setExamConfig({...examConfig, examTiming: e.target.value})}
                            className="bg-white border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/10 font-bold text-emerald-900 rounded-xl h-12 shadow-sm"
                        />
                    </div>
                    <div className="space-y-2 text-slate-400">
                        <label className="text-xs font-black text-emerald-700 uppercase tracking-wider ml-1">Passing %</label>
                        <Input 
                            type="number"
                            value={examConfig.passingPercentage}
                            onChange={(e) => setExamConfig({...examConfig, passingPercentage: e.target.value})}
                            className="bg-slate-100 border-none font-bold text-slate-500 rounded-xl h-12 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Select Subjects List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        Select Subjects
                    </h2>
                    <Button 
                        onClick={handleAddSubject}
                        className="bg-blue-900 hover:bg-black text-white gap-2 h-10 px-6 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={16} /> Add Subject
                    </Button>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {selectedSubjects.map((item, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group"
                            >
                                <div className="md:col-span-8">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Select Subject</p>
                                    <select 
                                        value={item.subjectId} 
                                        onChange={(e) => handleSubjectChange(index, e.target.value)}
                                        className="w-full h-12 rounded-2xl border border-slate-200 group-hover:border-blue-200 font-bold text-slate-700 shadow-sm px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                                    >
                                        <option value="">Choose a subject...</option>
                                        {allSubjects.map(sub => (
                                            <option 
                                                key={sub.id} 
                                                value={sub.id.toString()}
                                            >
                                                {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-3">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 text-center">Order</p>
                                    <Input 
                                        type="number"
                                        value={item.order}
                                        onChange={(e) => handleOrderChange(index, e.target.value)}
                                        className="h-12 rounded-2xl border-slate-200 group-hover:border-blue-200 font-bold text-slate-700 text-center shadow-sm"
                                    />
                                </div>
                                <div className="md:col-span-1 flex justify-center pt-5">
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleRemoveSubject(index)}
                                        className="h-12 w-12 rounded-2xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                <Button 
                    onClick={handleSubmit}
                    className="h-12 px-12 bg-blue-900 hover:bg-black text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 gap-3"
                >
                    <Save size={18} /> Submit
                </Button>
                <Button 
                    variant="outline"
                    onClick={() => navigate('/dashboard/courses')}
                    className="h-12 px-12 border-slate-200 hover:bg-slate-50 text-slate-500 font-bold rounded-2xl shadow-sm transition-all"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default AddSubjectsToCoursePage;
