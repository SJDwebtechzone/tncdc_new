import React, { useState, useEffect } from 'react';
import { Plus, Download, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSubjectAsync, fetchLanguages } from '@/store/courseSlice';
import { BASE_URL } from '@/config';
import { toast } from 'react-hot-toast';

const AddSubjectPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const languages = useSelector((state) => state.courses.languages);
    
    const [formData, setFormData] = useState({ name: '' });
    const [questionBanks, setQuestionBanks] = useState([
        { id: 1, language: '', examType: 'Both', file: null }
    ]);

    useEffect(() => {
        dispatch(fetchLanguages());
    }, [dispatch]);

    const handleAddQuestionBank = () => {
        setQuestionBanks([...questionBanks, {
            id: Date.now(),
            language: '',
            examType: 'Both',
            file: null
        }]);
    };

    const handleRemoveQuestionBank = (id) => {
        if (questionBanks.length > 1) {
            setQuestionBanks(questionBanks.filter(qb => qb.id !== id));
        }
    };

    const handleFileChange = (id, file) => {
        setQuestionBanks(questionBanks.map(qb => 
            qb.id === id ? { ...qb, file } : qb
        ));
    };

    const handleExamTypeChange = (id, type) => {
        setQuestionBanks(questionBanks.map(qb => 
            qb.id === id ? { ...qb, examType: type } : qb
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name) return toast.error('Subject Name is required');
        const invalidQB = questionBanks.find(qb => !qb.language || !qb.examType || !qb.file);
        if (invalidQB) return toast.error('Please complete all question bank fields including file upload');

        try {
            await dispatch(addSubjectAsync({
                name: formData.name,
                questionBanks: questionBanks
            })).unwrap();
            toast.success('Subject added successfully');
            navigate('/dashboard/subjects');
        } catch (err) {
            toast.error(err || 'Failed to add subject');
        }
    };

    const handleDownloadSample = (lang) => {
        window.open(`${BASE_URL}/api/subjects/samples/${lang}`, '_blank');
    };

    return (
        <div className="w-full space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard/subjects')}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold text-[#1e293b]">Add Subject</h1>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Subject Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 block">Subject Name</label>
                        <Input
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter Subject Name"
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        />
                    </div>

                    {/* Download Sample Excel Format */}
                    <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-[#0369a1]">
                            <Download className="w-5 h-5" />
                            <p className="font-semibold">Download Sample Excel Format</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button 
                                type="button" 
                                onClick={() => handleDownloadSample('english')}
                                variant="outline" 
                                className="bg-white border-[#bae6fd] text-[#0369a1] hover:bg-[#e0f2fe] h-11 px-6 rounded-lg transition-all"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download English Sample
                            </Button>
                            <Button 
                                type="button" 
                                onClick={() => handleDownloadSample('tamil')}
                                variant="outline" 
                                className="bg-white border-[#bae6fd] text-[#0369a1] hover:bg-[#e0f2fe] h-11 px-6 rounded-lg transition-all"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Tamil Sample
                            </Button>
                        </div>
                    </div>

                    {/* Question Banks */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-[#1e293b] border-b pb-2">Question Bank</h3>

                        {questionBanks.map((qb, index) => (
                            <div key={qb.id} className="p-6 rounded-xl border border-gray-100 bg-gray-50/30 space-y-6 relative group">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Language */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600 block">Language *</label>
                                        <select
                                            required
                                            className="w-full h-12 px-4 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                            value={qb.language}
                                            onChange={(e) => {
                                                const updated = [...questionBanks];
                                                updated[index].language = e.target.value;
                                                setQuestionBanks(updated);
                                            }}
                                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236b7280%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                        >
                                            <option value="">Select Language</option>
                                            {/* Filter languages to show only English and Tamil as requested, but keeping list dynamic from state */}
                                            {languages.filter(l => ['English', 'Tamil'].includes(l.name)).map(l => (
                                                <option key={l.id} value={l.name.toLowerCase()}>{l.name}</option>
                                            ))}
                                            {/* Fallback if languages are not loaded or empty */}
                                            {languages.length === 0 && (
                                                <>
                                                    <option value="english">English</option>
                                                    <option value="tamil">Tamil</option>
                                                </>
                                            )}
                                        </select>
                                    </div>

                                    {/* Exam Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600 block">Exam Type *</label>
                                        <div className="flex gap-2">
                                            {['Final Exam', 'Mock Test', 'Both'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => handleExamTypeChange(qb.id, type)}
                                                    className={`flex-1 h-12 px-4 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                                                        qb.examType === type 
                                                        ? 'bg-white border-blue-500 text-blue-600 shadow-sm' 
                                                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-white'
                                                    }`}
                                                >
                                                    {qb.examType === type && <CheckCircle2 className="w-4 h-4" />}
                                                    {type === 'Final Exam' && <Plus className="w-4 h-4" />}
                                                    {type === 'Mock Test' && <span className="w-4 h-4 text-[10px] flex items-center justify-center border border-current rounded">M</span>}
                                                    {type === 'Both' && <span className="w-4 h-4 text-[10px] flex items-center justify-center border border-current rounded">B</span>}
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Excel File */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600 block">Upload Excel File *</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 flex items-center h-12 px-4 border border-gray-200 rounded-lg bg-white overflow-hidden">
                                            <input
                                                type="file"
                                                accept=".xlsx,.xls"
                                                className="hidden"
                                                id={`excelFile-${qb.id}`}
                                                onChange={(e) => handleFileChange(qb.id, e.target.files[0])}
                                            />
                                            <label htmlFor={`excelFile-${qb.id}`} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm font-medium cursor-pointer transition-colors mr-3 shrink-0">
                                                Choose File
                                            </label>
                                            <span className="text-sm text-gray-500 truncate">
                                                {qb.file ? qb.file.name : 'No file chosen'}
                                            </span>
                                        </div>
                                        {questionBanks.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => handleRemoveQuestionBank(qb.id)}
                                                className="h-12 w-12 p-0 bg-red-500 hover:bg-red-600 shrink-0"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400">Accepted formats: .xlsx, .xls (Max: 5MB)</p>
                                </div>
                            </div>
                        ))}

                        {/* Add Question Bank Button */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddQuestionBank}
                            className="bg-blue-600 hover:bg-blue-700 text-white border-none h-11 px-6 rounded-lg transition-all"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Question Bank
                        </Button>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-start gap-4 pt-8 border-t">
                        <Button
                            type="submit"
                            className="bg-[#1e293b] hover:bg-[#334155] text-white h-11 px-10 rounded-lg font-semibold min-w-[120px]"
                        >
                            Submit
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/dashboard/subjects')}
                            className="h-11 px-10 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-semibold min-w-[120px]"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubjectPage;
