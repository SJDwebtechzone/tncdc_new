import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Plus, X, Video, Image as ImageIcon, Trash2, Bold, Italic, Underline, List, Link, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { fetchCategories, fetchAwardCategories, fetchCourseById, updateCourseAsync } from '@/store/courseSlice'

const RichTextEditor = ({ label, placeholder, value, onChange }) => (
    <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">{label} <span className="text-red-500">*</span></label>
        <div className="border border-gray-200 rounded-sm overflow-hidden bg-white">
            <div className="flex items-center gap-1 p-2 bg-gray-50/50 border-b border-gray-100">
                <button type="button" className="p-1 px-2 hover:bg-white rounded transition-colors text-xs font-medium text-gray-600 border border-transparent hover:border-gray-200">Normal</button>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button type="button" className="p-1 px-2 hover:bg-white rounded transition-colors text-gray-600"><Bold size={14} /></button>
                <button type="button" className="p-1 px-2 hover:bg-white rounded transition-colors text-gray-600"><Italic size={14} /></button>
                <button type="button" className="p-1 px-2 hover:bg-white rounded transition-colors text-gray-600"><Underline size={14} /></button>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button type="button" className="p-1 px-2 hover:bg-white rounded transition-colors text-gray-600"><List size={14} /></button>
                <button type="button" className="p-1 px-2 hover:bg-white rounded transition-colors text-gray-600"><List size={14} className="rotate-180" /></button>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button type="button" className="p-1 px-2 hover:bg-white rounded transition-colors text-gray-600"><Link size={14} /></button>
                <button type="button" className="p-1 px-2 hover:bg-white rounded transition-colors text-gray-600"><RotateCcw size={14} /></button>
            </div>
            <textarea
                className="w-full min-h-[150px] p-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white placeholder:italic text-gray-600 transition-all"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
)

const YesNoToggle = ({ label, value, onChange }) => (
    <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">{label}</label>
        <div className="flex w-full h-10 border border-gray-200 rounded-sm overflow-hidden">
            <button
                type="button"
                onClick={() => onChange(true)}
                className={`flex-1 text-[11px] font-bold transition-all ${value ? 'bg-[#1e75ff] text-white shadow-inner uppercase' : 'bg-white text-gray-400'}`}
            >
                Yes
            </button>
            <button
                type="button"
                onClick={() => onChange(false)}
                className={`flex-1 text-[11px] font-bold transition-all ${!value ? 'bg-[#ff4d4d] text-white shadow-inner uppercase' : 'bg-white text-gray-400 border-l border-gray-100'}`}
            >
                No
            </button>
        </div>
    </div>
)

export default function EditCoursePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const categories = useSelector(state => state.courses.categories || []);
    const awardCategories = useSelector(state => state.courses.awardCategories || []);

    const [selectedImage, setSelectedImage] = useState(null);
    const [tags, setTags] = useState(['']);
    const [franchisePlans, setFranchisePlans] = useState([{ plan: '', fee: '' }]);
    const [formData, setFormData] = useState({
        awardCategory: '',
        certificateType: 'Certificate',
        title: '',
        preposition: 'In',
        courseType: '',
        courseCategory: '',
        mrp: '',
        price: '',
        duration: '',
        durationUnit: 'Months',
        previewVideo: '',
        totalLectures: '',
        examFormat: { practical: true, objective: true },
        description: '',
        syllabus: '',
        isPopular: true,
        isRecommended: true,
        isMRPVisible: true,
        hideExamResult: true,
        status: true
    });

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchAwardCategories());
        if (id) {
            dispatch(fetchCourseById(id)).unwrap().then(data => {
                setFormData({
                    awardCategory: data.awardCategoryId?.toString() || '',
                    certificateType: data.certificateType || 'Certificate',
                    title: data.title || '',
                    preposition: data.preposition || 'In',
                    courseType: data.courseType || '',
                    courseCategory: data.categoryId?.toString() || '',
                    mrp: data.mrp?.toString() || '',
                    price: data.price?.toString() || '',
                    duration: data.duration?.toString() || '',
                    durationUnit: data.durationUnit || 'Months',
                    previewVideo: data.previewVideoUrl || '',
                    totalLectures: data.totalLectures?.toString() || '',
                    examFormat: {
                        practical: data.practicalExam === true,
                        objective: data.objectiveExam === true
                    },
                    description: data.description || '',
                    syllabus: data.syllabus || '',
                    isPopular: data.isPopular !== false,
                    isRecommended: data.isRecommended !== false,
                    isMRPVisible: data.isMRPVisible !== false,
                    hideExamResult: data.hideExamResult !== false,
                    status: data.status !== false
                });
                if (data.tags && Array.isArray(data.tags)) setTags(data.tags.length > 0 ? data.tags : ['']);
                // Note: franchisePlans logic not implemented in backend yet, keeping as is
            }).catch(err => {
                console.error("Failed to fetch course:", err);
                alert("Failed to load course details");
                navigate('/dashboard/courses');
            });
        }
    }, [dispatch, id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleExamToggle = (type) => {
        setFormData(prev => ({
            ...prev,
            examFormat: { ...prev.examFormat, [type]: !prev.examFormat[type] }
        }));
    };

    const handleAddTag = () => setTags([...tags, '']);
    const handleRemoveTag = (index) => setTags(tags.filter((_, i) => i !== index));
    const handleTagChange = (index, value) => {
        const newTags = [...tags];
        newTags[index] = value;
        setTags(newTags);
    };

    const handleAddPlan = () => setFranchisePlans([...franchisePlans, { plan: '', fee: '' }]);
    const handleRemovePlan = (index) => setFranchisePlans(franchisePlans.filter((_, i) => i !== index));
    const handlePlanChange = (index, field, value) => {
        const newPlans = [...franchisePlans];
        newPlans[index][field] = value;
        setFranchisePlans(newPlans);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseData = {
            id,
            ...formData,
            awardCategoryId: formData.awardCategory,
            categoryId: formData.courseCategory,
            previewVideoUrl: formData.previewVideo,
            practicalExam: formData.examFormat.practical,
            objectiveExam: formData.examFormat.objective,
            tags,
            imageFile: selectedImage
        };

        console.log('Final Course Data to Update:', courseData);

        try {
            await dispatch(updateCourseAsync(courseData)).unwrap();
            navigate('/dashboard/courses');
        } catch (err) {
            console.error('Failed to update course:', err);
            const errMsg = typeof err === 'string' ? err : (err.details || err.message || JSON.stringify(err));
            alert('Failed to update course: ' + errMsg);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 bg-white">
                    <h1 className="text-lg font-bold text-gray-800 uppercase tracking-tight text-[15px]">Edit Course</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Award Category */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Award Category</label>
                            <select
                                className="h-10 w-full rounded-sm border border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all px-3 bg-white"
                                value={formData.awardCategory}
                                onChange={handleInputChange}
                                name="awardCategory"
                            >
                                <option value="">Select Award Category</option>
                                {awardCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Certificate Type */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Certificate Type <span className="text-red-500">*</span></label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center h-10 border border-gray-200 rounded-sm cursor-pointer transition-all ${formData.certificateType === 'Certificate' ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a] bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        className="hidden"
                                        name="certType"
                                        checked={formData.certificateType === 'Certificate'}
                                        onChange={() => setFormData({ ...formData, certificateType: 'Certificate' })}
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full border border-gray-300 ${formData.certificateType === 'Certificate' ? 'bg-[#1e3a8a] scale-110' : ''}`} />
                                        <span className="text-xs font-bold text-gray-700">Certificate</span>
                                    </div>
                                </label>
                                <label className={`flex-1 flex items-center justify-center h-10 border border-gray-200 rounded-sm cursor-pointer transition-all ${formData.certificateType === 'Diploma' ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a] bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        className="hidden"
                                        name="certType"
                                        checked={formData.certificateType === 'Diploma'}
                                        onChange={() => setFormData({ ...formData, certificateType: 'Diploma' })}
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full border border-gray-300 ${formData.certificateType === 'Diploma' ? 'bg-[#1e3a8a] scale-110' : ''}`} />
                                        <span className="text-xs font-bold text-gray-700">Diploma</span>
                                    </div>
                                </label>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium italic ml-1">Select certificate or diploma type</p>
                        </div>

                        {/* Course Title */}
                        <div className="space-y-1.5">
                            <label htmlFor="course-title" className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Course Title</label>
                            <Input
                                id="course-title"
                                name="title"
                                className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all"
                                placeholder="Enter Course Title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Course Preposition */}
                        <div className="space-y-1.5">
                            <label htmlFor="course-preposition" className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Course Preposition</label>
                            <Input
                                id="course-preposition"
                                name="preposition"
                                className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all"
                                placeholder="In"
                                value={formData.preposition}
                                onChange={handleInputChange}
                            />
                            <p className="text-[10px] text-gray-400 font-medium italic ml-1">This word connects the category and title (e.g., "Category In Title")</p>
                        </div>

                        {/* Course Type */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Course Type</label>
                            <select
                                className="h-10 w-full rounded-sm border border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all px-3 bg-white"
                                value={formData.courseType}
                                onChange={handleInputChange}
                                name="courseType"
                            >
                                <option value="">Select Course Type</option>
                                <option value="Single">Single</option>
                                <option value="Multiple Exam">Multiple Exam</option>
                                <option value="Typing">Typing</option>
                            </select>
                        </div>

                        {/* Course Category */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Course Category</label>
                            <select
                                className="h-10 w-full rounded-sm border border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all px-3 bg-white"
                                value={formData.courseCategory}
                                onChange={handleInputChange}
                                name="courseCategory"
                            >
                                <option value="">Select Course Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* MRP & Price */}
                        <div className="grid grid-cols-2 gap-4 col-span-1">
                            <div className="space-y-1.5">
                                <label htmlFor="course-mrp" className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">MRP</label>
                                <Input
                                    id="course-mrp"
                                    name="mrp"
                                    className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all"
                                    placeholder="Enter MRP"
                                    value={formData.mrp}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="course-price" className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Price</label>
                                <Input
                                    id="course-price"
                                    name="price"
                                    className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all"
                                    placeholder="Enter Price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Duration <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <Input
                                        id="course-duration"
                                        name="duration"
                                        className="h-10 pl-9 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all"
                                        placeholder="Enter Duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex h-10 border border-gray-200 rounded-sm overflow-hidden min-w-[180px]">
                                    {['Days', 'Months', 'Years'].map(unit => (
                                        <button
                                            key={unit}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, durationUnit: unit })}
                                            className={`flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all px-2 ${formData.durationUnit === unit ? 'bg-blue-50/50 text-[#1e3a8a] border-x border-[#1e3a8a]/20' : 'bg-white text-gray-400'}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full border border-gray-300 ${formData.durationUnit === unit ? 'bg-[#1e3a8a]' : ''}`} />
                                            {unit}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium italic ml-1">Select duration and unit (e.g., 30 Days, 6 Months, 1 Year)</p>
                        </div>

                        {/* Course Image */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Course Image</label>
                            <div className="flex items-center gap-2 border border-gray-200 rounded-sm p-1 pr-3 h-10 bg-white shadow-sm">
                                <input
                                    type="file"
                                    id="course-img"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => setSelectedImage(e.target.files[0])}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-8 text-[11px] font-bold px-4 rounded-sm bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700"
                                    onClick={() => document.getElementById('course-img').click()}
                                >
                                    Choose File
                                </Button>
                                <span className="text-[11px] text-gray-500 font-medium truncate flex-1">
                                    {selectedImage ? selectedImage.name : "No file chosen (keep empty to maintain current image)"}
                                </span>
                                {selectedImage && (
                                    <button type="button" onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                                )}
                            </div>
                        </div>

                        {/* Preview Video */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Course Preview Video</label>
                            <Input
                                id="course-video"
                                name="previewVideo"
                                className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all"
                                placeholder="Enter YouTube Video URL"
                                value={formData.previewVideo}
                                onChange={handleInputChange}
                            />
                            <p className="text-[10px] text-gray-400 font-medium italic ml-1">Enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)</p>
                        </div>

                        {/* Total Lectures */}
                        <div className="grid grid-cols-2 gap-4 col-span-1">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Total Lectures <span className="text-red-500">*</span></label>
                                <Input
                                    id="course-lectures"
                                    name="totalLectures"
                                    type="number"
                                    className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all"
                                    placeholder="Enter Total Lectures"
                                    value={formData.totalLectures}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Exam Format */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Exam Format</label>
                                <div className="flex gap-4 h-10 items-center pl-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${formData.examFormat.practical ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                                            {formData.examFormat.practical && <ChevronLeft className="text-white rotate-[135deg]" size={12} strokeWidth={4} />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.examFormat.practical}
                                            onChange={() => handleExamToggle('practical')}
                                        />
                                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Practical</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${formData.examFormat.objective ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                                            {formData.examFormat.objective && <ChevronLeft className="text-white rotate-[135deg]" size={12} strokeWidth={4} />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.examFormat.objective}
                                            onChange={() => handleExamToggle('objective')}
                                        />
                                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Objective</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Franchise Plan Exam Fees */}
                    <div className="bg-gray-50/50 rounded-sm p-8 border border-gray-100 space-y-6">
                        <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-widest ml-1 flex items-center gap-2">Franchise Plan Exam Fees</h3>
                        <div className="space-y-4">
                            {franchisePlans.map((item, index) => (
                                <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className="flex-1 space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Select Plan</label>
                                        <select
                                            className="h-10 w-full rounded-sm border border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all px-3 bg-white"
                                            value={item.plan}
                                            onChange={e => handlePlanChange(index, 'plan', e.target.value)}
                                        >
                                            <option value="">Select Franchise Plan</option>
                                        </select>
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Exam Fee</label>
                                        <Input
                                            className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all"
                                            placeholder="Enter Exam Fee"
                                            value={item.fee}
                                            onChange={e => handlePlanChange(index, 'fee', e.target.value)}
                                        />
                                    </div>
                                    {franchisePlans.length > 1 && (
                                        <Button
                                            type="button"
                                            onClick={() => handleRemovePlan(index)}
                                            className="bg-red-500 hover:bg-red-600 text-white h-10 px-4 rounded-sm transition-all active:scale-95 shadow-sm font-bold text-xs"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={handleAddPlan}
                                className="bg-[#b9875a] hover:bg-[#a6764a] text-white h-9 px-6 rounded-sm transition-all active:scale-95 shadow-sm font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
                            >
                                <Plus size={14} /> Add More Plan
                            </Button>
                        </div>
                    </div>

                    {/* Rich Text Areas */}
                    <div className="space-y-8">
                        <RichTextEditor
                            label="Description"
                            placeholder="Write your course description here..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                        <RichTextEditor
                            label="Syllabus"
                            placeholder="Write your course syllabus here..."
                            value={formData.syllabus}
                            onChange={e => setFormData({ ...formData, syllabus: e.target.value })}
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Tags <span className="text-red-500">*</span></label>
                        <div className="space-y-3">
                            {tags.map((tag, index) => (
                                <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <Input
                                        className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-blue-900 transition-all"
                                        placeholder="Enter tag"
                                        value={tag}
                                        onChange={e => handleTagChange(index, e.target.value)}
                                    />
                                    {tags.length > 1 && (
                                        <Button
                                            type="button"
                                            onClick={() => handleRemoveTag(index)}
                                            className="bg-red-500 hover:bg-red-600 text-white h-10 px-4 rounded-sm transition-all active:scale-95 shadow-sm font-bold text-xs"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <div className="pt-2">
                                <Button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="bg-[#1e75ff] hover:bg-blue-600 text-white h-9 px-6 rounded-sm transition-all active:scale-95 shadow-sm font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
                                >
                                    <Plus size={14} /> Add Another Tag
                                </Button>
                                <p className="text-[10px] text-gray-400 font-medium italic ml-1 mt-2">Add relevant tags to help categorize your course.</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Boolean Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-10 border-t border-gray-100">
                        <YesNoToggle label="Is Popular" value={formData.isPopular} onChange={v => setFormData({ ...formData, isPopular: v })} />
                        <YesNoToggle label="Is Recommended" value={formData.isRecommended} onChange={v => setFormData({ ...formData, isRecommended: v })} />
                        <YesNoToggle label="Is MRP Visible" value={formData.isMRPVisible} onChange={v => setFormData({ ...formData, isMRPVisible: v })} />
                        <YesNoToggle label="Hide Exam Result" value={formData.hideExamResult} onChange={v => setFormData({ ...formData, hideExamResult: v })} />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-10">
                        <Button
                            type="submit"
                            className="bg-[#1e463a] hover:bg-[#153229] text-white px-10 rounded-sm h-10 uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-md font-bold"
                        >
                            Update
                        </Button>
                        <Button
                            type="button"
                            onClick={() => navigate('/dashboard/courses')}
                            className="bg-[#b9875a] hover:bg-[#a6764a] text-white px-10 rounded-sm h-10 uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-md font-bold"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
