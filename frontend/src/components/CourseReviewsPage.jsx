import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Star, Plus, X } from "lucide-react"
import { useState } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { addReview } from '@/store/courseSlice';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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

export default function CourseReviewsPage() {
    const reviews = useSelector((state) => state.courses.reviews || []);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ courseName: '', studentName: '', rating: '', review: '' });

    const handleSave = (e) => {
        e.preventDefault();
        dispatch(addReview({ ...formData, id: Date.now(), status: true, createdAt: new Date().toLocaleDateString() }));
        setIsModalOpen(false);
        setFormData({ courseName: '', studentName: '', rating: '', review: '' });
    };

    return (
        <div className="space-y-6 relative">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-gray-100/50">
                    <h1 className="text-xl font-medium text-gray-800">Manage Course Reviews</h1>
                    <div className="flex gap-2">
                        <Button onClick={() => setIsModalOpen(true)} className="bg-[#0f172a] hover:bg-[#0f172a]/90 text-white gap-2 rounded-lg px-4 h-9 text-sm font-normal">
                            <Plus size={14} /> Add Review
                        </Button>
                        <Button className="bg-[#14532d] hover:bg-[#14532d]/90 text-white gap-2 rounded-lg px-4 h-9 text-sm font-normal">
                            <Download size={14} /> Export
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <Table>
                    <TableHeader className="bg-[#f1f5f9] border-b border-gray-200">
                        <TableRow>
                            <TableHead className="w-[80px] font-semibold text-gray-700 pl-6 text-xs uppercase tracking-wider border-r border-gray-200">#</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider border-r border-gray-200">Course Name</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider border-r border-gray-200">Student Name</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider border-r border-gray-200">Rating</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider border-r border-gray-200">Review</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider border-r border-gray-200">Status</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider border-r border-gray-200">Created At</TableHead>
                            <TableHead className="text-center font-semibold text-gray-700 pr-8 text-xs uppercase tracking-wider">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-64 text-center border-b border-gray-200">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <Star size={48} className="mb-4 opacity-50" />
                                        <p className="text-sm">No reviews found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell className="font-medium text-blue-600 py-4 pl-6 border-r border-gray-200">{index + 1}</TableCell>
                                    <TableCell className="font-medium text-gray-700 text-sm border-r border-gray-200">{row.courseName}</TableCell>
                                    <TableCell className="text-gray-600 text-sm border-r border-gray-200">{row.studentName}</TableCell>
                                    <TableCell className="text-gray-600 text-sm border-r border-gray-200">
                                        <div className="flex items-center gap-1">
                                            <Star size={12} className="text-yellow-400 fill-yellow-400" /> {row.rating}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm border-r border-gray-200 max-w-[200px] truncate">{row.review}</TableCell>
                                    <TableCell className="border-r border-gray-200">
                                        <CustomBlueSwitch
                                            checked={row.status}
                                            onCheckedChange={() => { }}
                                        />
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm border-r border-gray-200">{row.createdAt}</TableCell>
                                    <TableCell className="text-center pr-6">
                                        {/* Actions could go here */}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add Review Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add Course Review</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700">Course Name</label>
                                <Input required value={formData.courseName} onChange={e => setFormData({ ...formData, courseName: e.target.value })} placeholder="e.g. Python Full Stack" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700">Student Name</label>
                                <Input required value={formData.studentName} onChange={e => setFormData({ ...formData, studentName: e.target.value })} placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700">Rating (1-5)</label>
                                <Input required type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} placeholder="5" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700">Review</label>
                                <Textarea required value={formData.review} onChange={e => setFormData({ ...formData, review: e.target.value })} placeholder="Write review here..." />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[#0f172a] text-white">Save Review</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}






