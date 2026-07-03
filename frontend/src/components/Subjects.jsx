import React, { useState, useEffect } from 'react';
import { Plus, Download, Search, Eye, FileEdit, Trash2, X, Database, RefreshCw, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSubjects, fetchLanguages } from '@/store/courseSlice';
import { BASE_URL } from '@/config';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Subjects = () => {
    const subjects = useSelector((state) => state.courses.subjects);
    const languages = useSelector((state) => state.courses.languages);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [activeLanguage, setActiveLanguage] = useState('English');
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        dispatch(fetchSubjects());
        dispatch(fetchLanguages());
    }, [dispatch]);

    const filteredSubjects = subjects ? subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
        try {
            await axios.delete(`${BASE_URL}/api/subjects/${id}`);
            toast.success('Subject deleted');
            dispatch(fetchSubjects());
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete subject');
        }
    };

    const handleOpenModal = (subject) => {
        setSelectedSubject(subject);
        setIsModalOpen(true);
        // Set active language to first available or default to English
        const availableLangs = Array.from(new Set(subject.questionBanks?.map(qb => qb.language) || []));
        if (availableLangs.length > 0) {
            setActiveLanguage(availableLangs.includes('English') ? 'English' : availableLangs[0]);
        } else {
            setActiveLanguage('English');
        }
    };

    const handleSync = async (subjectId, language, fromType, toType) => {
        setIsSyncing(true);
        try {
            await axios.post(`${BASE_URL}/api/subjects/${subjectId}/sync`, {
                language,
                fromType,
                toType
            });
            toast.success(`Synced ${toType} from ${fromType}`);
            dispatch(fetchSubjects());
            // Update selected subject in state to reflect changes
            const updatedSubjects = await axios.get(`${BASE_URL}/api/subjects`);
            const updated = updatedSubjects.data.find(s => s.id === subjectId);
            if (updated) setSelectedSubject(updated);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to sync questions');
        } finally {
            setIsSyncing(false);
        }
    };

    const getQBByLangAndType = (lang, type) => {
        return selectedSubject?.questionBanks?.find(qb => 
            qb.language?.toLowerCase() === lang?.toLowerCase() && 
            qb.examType === type
        );
    };

    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

    return (
        <div className="w-full missing-demos space-y-6 relative">
            <h1 className="text-2xl font-bold text-gray-800">Subjects</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                {/* Top Actions */}
                <div className="flex justify-between items-center mb-6">
                    <Button onClick={() => navigate('/dashboard/add-subject')} className="bg-[#0f172a] hover:bg-[#1e293b] text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Subject
                    </Button>
                    <Button className="bg-[#1e4e3e] hover:bg-[#15382d] text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>

                {/* Search Filter */}
                <div className="flex gap-4 mb-8 overflow-x-auto">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search subjects.."
                            className="pl-9 bg-gray-50 border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button className="bg-[#5d5fef] hover:bg-[#4b4dcf] text-white min-w-[100px]">
                        Submit
                    </Button>
                    <Button className="bg-[#ea5455] hover:bg-[#d63e3f] text-white min-w-[100px]" onClick={() => setSearchTerm('')}>
                        Reset
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100/50 border-b border-gray-200 text-left">
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject Name</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Total Questions</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Question Bank</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSubjects.map((subject, index) => (
                                <tr key={subject.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-sm text-gray-600">{index + 1}</td>
                                    <td className="p-4 text-sm font-semibold text-gray-900">{subject.name}</td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[30px] h-[30px] rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
                                            {subject.totalQuestions || 0}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-xs text-gray-500">{subject.questionBanks?.length || 0} Files</span>
                                            <button 
                                                onClick={() => handleOpenModal(subject)}
                                                className="text-gray-500 hover:text-[#5d5fef] transition-colors"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="inline-flex items-center cursor-pointer">
                                            <div className={`w-9 h-5 rounded-full relative transition-colors ${subject.status ? 'bg-[#0f172a]' : 'bg-gray-200'}`}>
                                                <div className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white transition-transform ${subject.status ? 'translate-x-4' : ''}`}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(subject.createdAt).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => navigate(`/dashboard/subjects/edit/${subject.id}`)}
                                                className="p-2 text-gray-500 hover:text-[#0f172a] hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FileEdit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(subject.id, subject.name)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredSubjects.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
                                        No subjects found. Add a subject to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Question Bank Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-4 border-b flex justify-between items-center bg-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <Database className="w-5 h-5 text-[#0f172a]" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Question Bank</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Headings */}
                            <div className="grid grid-cols-4 gap-4 mb-6 border-b border-gray-100 pb-2">
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Language</div>
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Mock Test</div>
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Final Exam</div>
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Actions</div>
                            </div>

                            {/* Language Content Row */}
                            <div className="grid grid-cols-4 gap-4 items-start">
                                {/* Language Selection Buttons */}
                                <div className="space-y-2">
                                    {/* Get all unique languages from question banks normalized to lowercase */}
                                    {Array.from(new Set(selectedSubject?.questionBanks?.map(qb => qb.language?.toLowerCase()) || [activeLanguage.toLowerCase()])).map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => setActiveLanguage(lang)}
                                            className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                                                activeLanguage.toLowerCase() === lang.toLowerCase()
                                                    ? 'bg-white border-[#3b82f6] text-[#3b82f6] shadow-sm'
                                                    : 'bg-white border-transparent text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <Languages className={`w-4 h-4 ${activeLanguage.toLowerCase() === lang.toLowerCase() ? 'text-[#3b82f6]' : 'text-gray-400'}`} />
                                            {capitalize(lang)}
                                        </button>
                                    ))}
                                </div>

                                {/* Mock Test Card */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-full bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center min-h-[140px] shadow-sm">
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {getQBByLangAndType(activeLanguage, 'Mock Test')?.questionCount || 0}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Questions</div>
                                    </div>
                                    <button 
                                        onClick={() => handleSync(selectedSubject.id, activeLanguage, 'Final Exam', 'Mock Test')}
                                        disabled={isSyncing || !getQBByLangAndType(activeLanguage, 'Final Exam')}
                                        className="w-full border border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/5 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                                        Sync from Final
                                    </button>
                                </div>

                                {/* Final Exam Card */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-full bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center min-h-[140px] shadow-sm">
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {getQBByLangAndType(activeLanguage, 'Final Exam')?.questionCount || 0}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Questions</div>
                                    </div>
                                    <button 
                                        onClick={() => handleSync(selectedSubject.id, activeLanguage, 'Mock Test', 'Final Exam')}
                                        disabled={isSyncing || !getQBByLangAndType(activeLanguage, 'Mock Test')}
                                        className="w-full border border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/5 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                                        Sync from Mock
                                    </button>
                                </div>

                                {/* View Action */}
                                <div className="flex justify-center">
                                    <button 
                                        onClick={() => {
                                            console.log('Navigating to questions for subject:', selectedSubject?.id);
                                            setIsModalOpen(false);
                                            navigate(`/dashboard/subjects/${selectedSubject.id}/questions`);
                                        }}
                                        disabled={!getQBByLangAndType(activeLanguage, 'Mock Test') && !getQBByLangAndType(activeLanguage, 'Final Exam')}
                                        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white disabled:opacity-50 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subjects;
