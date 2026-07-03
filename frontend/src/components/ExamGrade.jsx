import React from 'react';
import { Lock, Trash2, Plus, Save, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExamGrades, addExamGradeAsync, deleteExamGradeAsync } from '@/store/courseSlice';

const ExamGrade = () => {
    const grades = useSelector((state) => state.courses.examGrades || []);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({ performance: '', grade: '', start: '', end: '' });

    React.useEffect(() => {
        dispatch(fetchExamGrades());
    }, [dispatch]);

    const handleRemove = (id) => {
        if (window.confirm('Are you sure you want to remove this grade?')) {
            dispatch(deleteExamGradeAsync(id));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await dispatch(addExamGradeAsync(formData)).unwrap();
            setIsModalOpen(false);
            setFormData({ performance: '', grade: '', start: '', end: '' });
        } catch (err) {
            alert('Failed to add grade: ' + err);
        }
    };

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Exam Grade System</h1>
                <Button className="bg-[#1e4e3e] hover:bg-[#15382d] text-white">
                    <Lock className="w-4 h-4 mr-2" />
                    Lock Grade System
                </Button>
            </div>

            <div className="bg-gray-600 text-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-1"><GraduationCap className="h-6 w-6 text-white" /></div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Important: Lock Your Grade System</h3>
                        <p className="text-gray-200 text-sm leading-relaxed">
                            Once you've finalized your grade configuration, please <span className="font-bold text-white">lock the system</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Grades List */}
            <div className="space-y-6">
                {grades.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-end bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="col-span-3 space-y-2">
                            <label className="text-sm font-semibold text-gray-600 block">Performance</label>
                            <Input value={item.performance} readOnly className="bg-gray-50 border-gray-200" />
                        </div>
                        <div className="col-span-3 space-y-2">
                            <label className="text-sm font-semibold text-gray-600 block">Grade Name</label>
                            <Input value={item.grade} readOnly className="bg-gray-50 border-gray-200" />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-gray-600 block">Start %</label>
                            <Input value={item.start} readOnly className="bg-gray-50 border-gray-200" />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-gray-600 block">End %</label>
                            <Input value={item.end} readOnly className="bg-gray-50 border-gray-200" />
                        </div>
                        <div className="col-span-2">
                            <Button variant="destructive" className="bg-[#ea5455] hover:bg-[#d63e3f] text-white w-full" onClick={() => handleRemove(item.id)}>
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
                <Button className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6" onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Grade
                </Button>
            </div>

            {/* Add Grade Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Grade</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700">Performance</label>
                                <Input required value={formData.performance} onChange={e => setFormData({ ...formData, performance: e.target.value })} placeholder="e.g. Excellent" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700">Grade</label>
                                <Input required value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} placeholder="e.g. A+" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Start %</label>
                                    <Input required type="number" value={formData.start} onChange={e => setFormData({ ...formData, start: e.target.value })} placeholder="90" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700">End %</label>
                                    <Input required type="number" value={formData.end} onChange={e => setFormData({ ...formData, end: e.target.value })} placeholder="100" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[#1e3a8a] text-white">Save</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamGrade;
