import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    Download, 
    Plus,
    FileEdit,
    CheckCircle2,
    XCircle,
    BarChart3,
    BookOpen,
    BrainCircuit,
    Layers,
    ArrowUpDown,
    Check,
    ImagePlus,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BASE_URL } from '@/config';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// --- UI Sub-components ---

const StatCard = ({ title, value, icon: Icon, gradient, index }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`relative overflow-hidden p-6 rounded-[2.5rem] border border-white/20 shadow-2xl backdrop-blur-xl bg-gradient-to-br ${gradient} group cursor-default`}
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon className="w-20 h-20 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="relative z-10 flex flex-col gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md mb-2">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-4xl font-black text-white tracking-tighter tabular-nums drop-shadow-sm">{value}</div>
            <div className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">{title}</div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </motion.div>
);

const EmptyState = ({ onReset }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-slate-200 mt-8"
    >
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <BookOpen className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">No Records Found</h3>
        <p className="text-slate-400 text-sm font-medium mb-8 text-center max-w-xs leading-relaxed">
            Your current filters didn't yield any matches.
            Try adjusting your search criteria.
        </p>
        <Button 
            onClick={onReset}
            variant="outline"
            className="rounded-2xl border-2 border-slate-100 font-black uppercase tracking-[0.2em] text-[10px] px-8 h-12 hover:bg-slate-50"
        >
            Clear All Filters
        </Button>
    </motion.div>
);

const QuestionsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All'); // 'All', 'Final Exam', 'Mock Test', 'Both'
    const [selectedIds, setSelectedIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [formData, setFormData] = useState({
        text: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: '',
        examType: 'Both',
        language: 'english',
        imageUrl: '',
        imageFile: null
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subjectRes, questionsRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/subjects/${id}`),
                axios.get(`${BASE_URL}/api/subjects/${id}/questions`)
            ]);
            setSubject(subjectRes.data);
            setQuestions(questionsRes.data);
        } catch (err) {
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (q = null) => {
        if (q) {
            setCurrentQuestion(q);
            setFormData({
                text: q.text,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                answer: q.answer,
                examType: q.examType,
                language: q.language || 'english',
                imageUrl: q.imageUrl || ''
            });
        } else {
            setCurrentQuestion(null);
            setFormData({
                text: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                answer: '',
                examType: 'Both',
                language: 'english',
                imageUrl: '',
                imageFile: null
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.text || !formData.optionA || !formData.optionB || !formData.answer) {
            toast.error('Please fill in all required fields');
            return;
        }

        const data = new FormData();
        data.append('text', formData.text);
        data.append('optionA', formData.optionA);
        data.append('optionB', formData.optionB);
        data.append('optionC', formData.optionC);
        data.append('optionD', formData.optionD);
        data.append('answer', formData.answer);
        data.append('examType', formData.examType);
        data.append('language', formData.language);
        if (formData.imageFile) {
            data.append('image', formData.imageFile);
        }

        try {
            if (currentQuestion) {
                // Update
                const res = await axios.put(`${BASE_URL}/api/subjects/questions/${currentQuestion.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setQuestions(prev => prev.map(q => q.id === currentQuestion.id ? res.data : q));
                toast.success('Question updated');
            } else {
                // Create
                const res = await axios.post(`${BASE_URL}/api/subjects/${id}/questions`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setQuestions(prev => [...prev, res.data]);
                toast.success('Question added');
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error('Failed to save question');
        }
    };

    const handleExport = () => {
        window.open(`${BASE_URL}/api/subjects/${id}/questions/export`, '_blank');
        toast.success('Export started');
    };

    const handleDelete = async (questionId) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            await axios.delete(`${BASE_URL}/api/subjects/questions/${questionId}`);
            toast.success('Question deleted');
            setQuestions(prev => prev.filter(q => q.id !== questionId));
        } catch (err) {
            toast.error('Failed to delete question');
        }
    };

    const handleBatchDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected questions?`)) return;
        try {
            await axios.post(`${BASE_URL}/api/subjects/${id}/questions/batch-delete`, { ids: selectedIds });
            toast.success('Selected questions deleted');
            setQuestions(prev => prev.filter(q => !selectedIds.includes(q.id)));
            setSelectedIds([]);
        } catch (err) {
            toast.error('Failed to delete questions');
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredQuestions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredQuestions.map(q => q.id));
        }
    };

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'All' || q.examType === filterType || q.examType === 'Both';
            return matchesSearch && matchesType;
        });
    }, [questions, searchTerm, filterType]);

    const stats = useMemo(() => ({
        total: questions.length,
        final: questions.filter(q => q.examType === 'Final Exam' || q.examType === 'Both').length,
        mock: questions.filter(q => q.examType === 'Mock Test' || q.examType === 'Both').length,
        both: questions.filter(q => q.examType === 'Both').length
    }), [questions]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] gap-8 bg-slate-50/50 rounded-[3rem]">
                <div className="relative">
                    <div className="w-20 h-20 border-[6px] border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white rounded-full shadow-lg"></div>
                    </div>
                </div>
                <div className="space-y-2 text-center">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Syncing Repository</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] animate-pulse">Establishing Connection...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full space-y-10 pb-20"
        >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div className="space-y-4">
                    <motion.button 
                        whileHover={{ x: -4 }}
                        onClick={() => navigate('/dashboard/subjects')}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors group"
                    >
                        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all border border-slate-100">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Return to Subjects</span>
                    </motion.button>
                    
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Question Bank</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm font-bold text-slate-400">Managing <span className="text-slate-900 font-extrabold">{subject?.name}</span> repository</span>
                            <span className="text-slate-200">/</span>
                            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{questions.length} total entries</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        onClick={handleExport}
                        className="h-14 px-8 border-2 border-slate-100 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-3"
                    >
                        <Download className="w-4 h-4" />
                        Export Data
                    </Button>
                    <Button 
                        onClick={() => handleOpenModal()}
                        className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 active:scale-95 flex items-center gap-3"
                    >
                        <Plus className="w-4 h-4" />
                        Add Question
                    </Button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard 
                    index={0}
                    title="Total Question Bank" 
                    value={stats.total} 
                    icon={Layers}
                    gradient="from-[#6366f1] to-[#4f46e5]"
                />
                <StatCard 
                    index={1}
                    title="Final Examination" 
                    value={stats.final} 
                    icon={CheckCircle2}
                    gradient="from-[#10b981] to-[#059669]"
                />
                <StatCard 
                    index={2}
                    title="Mock Assessment" 
                    value={stats.mock} 
                    icon={BrainCircuit}
                    gradient="from-[#3b82f6] to-[#2563eb]"
                />
                <StatCard 
                    index={3}
                    title="Cross-Platform both" 
                    value={stats.both} 
                    icon={BarChart3}
                    gradient="from-[#f59e0b] to-[#d97706]"
                />
            </div>

            {/* Action Bar (Filters + Search) */}
            <div className="bg-white p-4 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between mx-2">
                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto w-full md:w-auto no-scrollbar">
                    {['All', 'Final Exam', 'Mock Test', 'Both'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                filterType === type 
                                ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200 scale-105 z-10' 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                            }`}
                        >
                            {type === 'All' ? 'All' : type === 'Both' ? 'Both' : type}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:min-w-[400px] group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            <Search className="h-4 w-4 text-blue-500 group-focus-within:scale-110 transition-transform" />
                            <div className="h-4 w-px bg-slate-200"></div>
                        </div>
                        <Input
                            placeholder="Search questions..."
                            className="pl-14 h-14 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content Table Area */}
            <AnimatePresence mode="wait">
                {filteredQuestions.length === 0 ? (
                    <EmptyState onReset={() => {setSearchTerm(''); setFilterType('All');}} />
                ) : (
                    <motion.div 
                        key="table-container"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden mx-2"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="p-6 w-12 text-center">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer" 
                                                checked={selectedIds.length === filteredQuestions.length && filteredQuestions.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">#</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[350px]">Question Logic & Options</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exam Type</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Language</th>
                                        <th className="p-6 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] text-center bg-blue-50/30">Edit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50">
                                    {filteredQuestions.map((q, idx) => (
                                        <motion.tr 
                                            key={q.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="hover:bg-blue-50/20 transition-all group relative"
                                        >
                                            <td className="p-6 text-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-4 h-4 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                                                    checked={selectedIds.includes(q.id)}
                                                    onChange={() => toggleSelect(q.id)}
                                                />
                                            </td>
                                            <td className="p-6">
                                                <div className="text-xs font-black text-slate-300 group-hover:text-blue-400 transition-colors">
                                                    #{idx + 1}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col gap-3">
                                                    <div className="text-sm font-extrabold text-slate-800 leading-relaxed max-w-xl group-hover:text-slate-900 transition-colors flex items-start gap-2">
                                                        {q.imageUrl && <ImagePlus className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
                                                        <span>{q.text}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 group-hover:opacity-100 opacity-60 transition-all duration-500 translate-y-1 group-hover:translate-y-0 text-white">
                                                        <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black tracking-widest border flex items-center gap-1.5 transition-all ${q.answer === q.optionA ? 'bg-emerald-500 border-emerald-400 shadow-sm' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                                            {q.answer === q.optionA && <Check className="w-2.5 h-2.5" />}
                                                            A: {q.optionA}
                                                        </span>
                                                        <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black tracking-widest border flex items-center gap-1.5 transition-all ${q.answer === q.optionB ? 'bg-emerald-500 border-emerald-400 shadow-sm' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                                            {q.answer === q.optionB && <Check className="w-2.5 h-2.5" />}
                                                            B: {q.optionB}
                                                        </span>
                                                        <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black tracking-widest border flex items-center gap-1.5 transition-all ${q.answer === q.optionC ? 'bg-emerald-500 border-emerald-400 shadow-sm' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                                            {q.answer === q.optionC && <Check className="w-2.5 h-2.5" />}
                                                            C: {q.optionC}
                                                        </span>
                                                        <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black tracking-widest border flex items-center gap-1.5 transition-all ${q.answer === q.optionD ? 'bg-emerald-500 border-emerald-400 shadow-sm' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                                            {q.answer === q.optionD && <Check className="w-2.5 h-2.5" />}
                                                            D: {q.optionD}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className={`inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                                    q.examType === 'Final Exam' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    q.examType === 'Mock Test' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-violet-50 text-violet-600 border-violet-100'
                                                }`}>
                                                    {q.examType}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${q.language === 'tamil' ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{q.language || 'English'}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 bg-blue-50/20 group-hover:bg-blue-400/10 transition-colors">
                                                <div className="flex items-center justify-center gap-2 transition-all duration-300">
                                                    <motion.button 
                                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleOpenModal(q)}
                                                        className="p-3 text-blue-600 bg-white rounded-2xl shadow-md shadow-blue-100/50 hover:shadow-blue-200/50 transition-all border border-blue-100 focus:ring-2 focus:ring-blue-500/20"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button 
                                                        whileHover={{ scale: 1.15, rotate: -5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDelete(q.id)}
                                                        className="p-3 text-rose-500 bg-white rounded-2xl shadow-md shadow-rose-100/50 hover:shadow-rose-200/50 transition-all border border-rose-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Toolbar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 100, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 100, x: "-50%" }}
                        className="fixed bottom-12 left-1/2 bg-slate-900/90 text-white px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-8 z-[100] border border-white/10 backdrop-blur-2xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Check className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-black tracking-tight">{selectedIds.length} Entries Selected</div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Batch Session</div>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBatchDelete}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-2xl text-[10px] font-black flex items-center gap-3 transition-all uppercase tracking-[0.2em] group"
                        >
                            <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            Terminate Selection
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-white/20 relative z-10"
                        >
                            <div className="p-10 space-y-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                                            {currentQuestion ? 'Refine Entry' : 'New Knowledge Piece'}
                                        </h2>
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Repository Configuration</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="p-4 hover:bg-slate-50 rounded-3xl transition-all text-slate-300 hover:text-slate-600 border border-slate-100/50"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Image Upload Zone */}
                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Visual Context Asset</label>
                                        <div className="relative group rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/30 transition-all p-6 text-center cursor-pointer overflow-hidden min-h-[140px] flex items-center justify-center">
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const url = URL.createObjectURL(file);
                                                        setFormData(prev => ({...prev, imageFile: file, previewUrl: url}));
                                                    }
                                                }}
                                            />
                                            {formData.previewUrl || formData.imageUrl ? (
                                                <div className="relative z-0 flex flex-col items-center gap-4 w-full">
                                                    <div className="w-full max-w-[300px] h-32 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group/image">
                                                        <img 
                                                            src={formData.previewUrl || formData.imageUrl} 
                                                            alt="Question visual" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFormData(prev => ({...prev, imageFile: null, previewUrl: null, imageUrl: ''}));
                                                            }}
                                                            className="absolute top-2 right-2 bg-slate-900/50 hover:bg-rose-500 text-white p-1.5 rounded-full backdrop-blur-md opacity-0 group-hover/image:opacity-100 transition-all z-20"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <FileEdit className="w-3.5 h-3.5" /> Replace Asset
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/5 text-blue-500 group-hover:scale-110 group-hover:-translate-y-1 transition-all">
                                                        <ImagePlus className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-slate-700 tracking-tight">Upload Visual Logic</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supports PNG, JPG, GIF</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Core Question Logic</label>
                                        <textarea 
                                            className="w-full bg-slate-50 border-0 rounded-[2rem] p-6 text-sm font-bold text-slate-700 min-h-[140px] focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300 shadow-inner"
                                            placeholder="What is the central inquiry?"
                                            value={formData.text}
                                            onChange={(e) => setFormData({...formData, text: e.target.value})}
                                        />
                                    </div>

                                    {[
                                        { label: 'Option Alpha', key: 'optionA' },
                                        { label: 'Option Beta', key: 'optionB' },
                                        { label: 'Option Gamma', key: 'optionC' },
                                        { label: 'Option Delta', key: 'optionD' }
                                    ].map((opt, i) => (
                                        <div key={opt.key} className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">{opt.label}</label>
                                            <Input 
                                                className="bg-slate-50 border-0 rounded-2xl h-16 px-6 font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
                                                value={formData[opt.key]}
                                                onChange={(e) => setFormData({...formData, [opt.key]: e.target.value})}
                                            />
                                        </div>
                                    ))}

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Validated Response</label>
                                        <div className="relative group">
                                            <select 
                                                className="w-full bg-slate-100 border-0 rounded-2xl h-16 px-6 font-black text-slate-700 text-sm focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
                                                value={formData.answer}
                                                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                                            >
                                                <option value="">Select Target Match</option>
                                                <option value={formData.optionA}>Option Alpha</option>
                                                <option value={formData.optionB}>Option Beta</option>
                                                <option value={formData.optionC}>Option Gamma</option>
                                                <option value={formData.optionD}>Option Delta</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                                                <ArrowUpDown className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Deployment Tag</label>
                                        <div className="relative group">
                                            <select 
                                                className="w-full bg-slate-100 border-0 rounded-2xl h-16 px-6 font-black text-slate-700 text-sm focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
                                                value={formData.examType}
                                                onChange={(e) => setFormData({...formData, examType: e.target.value})}
                                            >
                                                <option value="Both">Unified (Global)</option>
                                                <option value="Final Exam">Final Examination</option>
                                                <option value="Mock Test">Mock Assessment</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                                                <ArrowUpDown className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Language Protocol</label>
                                        <div className="flex gap-4">
                                            {['english', 'tamil'].map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => setFormData({...formData, language: lang})}
                                                    className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all border-2 ${
                                                        formData.language === lang 
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                                                        : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {lang === 'english' ? 'Standard English' : 'Regional Tamil'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-6 pt-6">
                                    <Button 
                                        onClick={() => setIsModalOpen(false)}
                                        variant="ghost" 
                                        className="h-16 px-10 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                                    >
                                        Discard
                                    </Button>
                                    <Button 
                                        onClick={handleSave}
                                        className="flex-1 h-16 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-200 transition-all active:scale-95"
                                    >
                                        {currentQuestion ? 'Apply Differential' : 'Initialize Record'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default QuestionsPage;
