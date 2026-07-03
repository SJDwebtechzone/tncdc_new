import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Calendar, Clock, CheckCircle2, MapPin, Search } from "lucide-react";
import { fetchCourses } from '@/store/courseSlice';
import { fetchAdmissions } from '@/store/admissionSlice';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { toast } from 'react-hot-toast';
import { fetchProfile } from '@/store/profileSlice';

const steps = [
    { id: 1, label: 'Select Course' },
    { id: 2, label: 'Choose Semester' },
    { id: 3, label: 'Exam Details' },
    { id: 4, label: 'Select Students' },
];

export default function GenerateHallTicketsPage() {
    const dispatch = useDispatch();
    const { courses } = useSelector((state) => state.courses);
    const { admissions } = useSelector((state) => state.admissions);
    const profile = useSelector((state) => state.profile);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedSemesterId, setSelectedSemesterId] = useState("");
    const [examDetails, setExamDetails] = useState({
        date: "",
        startTime: "",
        endTime: "",
        venue: "Main Campus Examination Hall"
    });
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [subjectExams, setSubjectExams] = useState([]);

    const selectedCourse = courses.find(c => c.id === Number(selectedCourseId));
    const hasSemesters = selectedCourse?.semesters?.length > 0;

    useEffect(() => {
        if (selectedCourseId && courses.length > 0) {
            const course = courses.find(c => c.id === Number(selectedCourseId));
            if (!course) return;

            let subjects = [];
            if (hasSemesters && selectedSemesterId) {
                const semester = course.semesters?.find(s => s.id === selectedSemesterId);
                subjects = semester?.subjects || [];
            } else {
                subjects = course.courseSubjects || [];
            }
            
            setSubjectExams(subjects.map(s => ({
                id: s.id,
                subjectName: s.subject?.name || "Subject",
                date: examDetails.date,
                startTime: examDetails.startTime || "10:00",
                endTime: examDetails.endTime || "12:00"
            })));
        }
    }, [selectedCourseId, selectedSemesterId, courses, hasSemesters, examDetails.date, examDetails.startTime, examDetails.endTime]);

    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchAdmissions());
        dispatch(fetchProfile());
    }, [dispatch]);

    const filteredAdmissions = admissions.filter(adm => {
        const matchesCourse = adm.courseName?.toLowerCase().trim() === selectedCourse?.title?.toLowerCase().trim();
        const matchesSearch = (adm.enquiry?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            adm.enquiry?.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            adm.rollNo?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (adm.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            adm.surname?.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Include any active/admitted status
        const isActive = ['active', 'admitted', 'converted', 'approved'].includes(adm.status?.toLowerCase());
        return matchesCourse && matchesSearch && isActive;
    });

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(filteredAdmissions.map(adm => adm.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (id) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleGenerateHallTickets = async () => {
        if (selectedStudents.length === 0) {
            toast.error("Please select at least one student.");
            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}/api/background-images`);
            const hTicketTemplate = response.data.find(t => 
                t.title?.toLowerCase() === 'hallticket image' || 
                t.name?.toLowerCase() === 'hall ticket' || 
                t.title?.toLowerCase() === 'hall ticket'
            );

            if (!hTicketTemplate) {
                toast.error("Hall Ticket template not found. Please check backgrounds settings (Default: 'hallticket image').");
                return;
            }

            const settings = hTicketTemplate.designSettings || {};
            const isLandscape = hTicketTemplate.type === 'LANDSCAPE';
            const widthMm = isLandscape ? 297 : 210;
            const heightMm = isLandscape ? 210 : 297;

            const printWindow = window.open('', '_blank');

            const selectedData = admissions.filter(a => selectedStudents.includes(a.id));

            let ticketsHtml = selectedData.map(student => `
                <div class="ticket-page">
                    <div class="poster-container" style="font-family: Arial, sans-serif; color: #000;">
                        <img src="${hTicketTemplate.imageUrl}" class="bg-image" />
                        
                        <div style="position: absolute; inset: 0; padding: 40px; display: flex; flex-direction: column;">
                            <!-- Header logos spacer -->
                            <div style="height: 130px;"></div>

                            <!-- Title spacer (Skip background 'HALL TICKETS') -->
                            <div style="height: 120px;"></div>

                            <!-- Student Info Grid -->
                            <div style="display: flex; justify-content: space-between; margin-bottom: 25px; padding: 0 40px;">
                                <div style="flex: 1; font-size: 14px; line-height: 1.8; font-weight: bold; color: #000;">
                                    <div style="display: grid; grid-template-columns: 170px 10px 1fr; gap: 4px;">
                                        <span>Student Name</span> <span>:</span> <span style="text-transform: uppercase;">${student.firstName} ${student.surname}</span>
                                        <span>Mother Name</span> <span>:</span> <span style="text-transform: uppercase;">${student.enquiry?.motherName || ''}</span>
                                        <span>Exam Center Name</span> <span>:</span> <span style="text-transform: uppercase;">${profile?.instituteName || 'Tamil Nadu Career Development Council'}</span>
                                        <span>Contact Number</span> <span>:</span> <span>${student.mobile || student.enquiry?.mobile || ''}</span>
                                        <span>Roll Number</span> <span>:</span> <span>${student.rollNo || ''}</span>
                                        <span>Enrollment Number</span> <span>:</span> <span>${student.studentId}</span>
                                        <span>Course Duration</span> <span>:</span> <span>${selectedCourse?.duration} ${selectedCourse?.durationUnit}</span>
                                    </div>
                                </div>
                                <div style="width: 140px; height: 180px; border: 2px solid #ccc; background: #fff; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                                    ${student.enquiry?.profileImage ? `<img src="${student.enquiry.profileImage}" style="width: 100%; height: 100%; object-fit: cover;" />` : '<span style="color: #999; font-size: 11px;">PHOTO</span>'}
                                </div>
                            </div>

                            <!-- Course Title Center Block -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h2 style="font-size: 20px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                    ${selectedCourse?.title} (${selectedCourse?.courseCode})
                                </h2>
                            </div>

                            <!-- Detailed Exam Schedule Table -->
                            <div style="margin-bottom: 40px;">
                                <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; background: #fff;">
                                    <thead>
                                        <tr style="background: #000; color: #fff; font-size: 13px; text-transform: uppercase;">
                                            <th style="padding: 12px; border: 1px solid #000; text-align: left;">Subject</th>
                                            <th style="padding: 12px; border: 1px solid #000; text-align: center;">Exam Date</th>
                                            <th style="padding: 12px; border: 1px solid #000; text-align: center;">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${subjectExams.map(ex => `
                                            <tr style="font-size: 14px; font-weight: bold; color: #000;">
                                                <td style="padding: 10px 12px; border: 1px solid #000;">${ex.subjectName}</td>
                                                <td style="padding: 10px 12px; border: 1px solid #000; text-align: center;">${ex.date}</td>
                                                <td style="padding: 10px 12px; border: 1px solid #000; text-align: center;">${ex.startTime} - ${ex.endTime}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            const html = `
                <html>
                    <head>
                        <title>Hall Tickets - ${selectedCourse?.title}</title>
                        <style>
                            @page { size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'}; margin: 0; }
                            body { margin: 0; padding: 0; background: #f0f0f0; }
                            .ticket-page { page-break-after: always; display: flex; justify-content: center; align-items: center; padding: 20px; }
                            .poster-container {
                                position: relative;
                                width: ${widthMm}mm;
                                height: ${heightMm}mm;
                                background: white;
                                overflow: hidden;
                                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                            }
                            .bg-image { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
                            @media print {
                                body { background: none; }
                                .ticket-page { padding: 0; }
                                .poster-container { box-shadow: none; }
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                        </style>
                    </head>
                    <body>
                        ${ticketsHtml}
                        <script>
                            window.onload = () => { setTimeout(() => { window.print(); }, 1000); };
                        </script>
                    </body>
                </html>
            `;

            printWindow.document.write(html);
            printWindow.document.close();
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate hall tickets.");
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Generate Hall Tickets</h1>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center max-w-4xl mx-auto mb-12">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center relative group">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 z-10 ${isActive || isCompleted
                                    ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                                    : "bg-white border-gray-200 text-gray-400"
                                    }`}>
                                    {isCompleted ? <CheckCircle2 size={20} /> : step.id}
                                </div>
                                <span className={`absolute -bottom-7 w-max text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${isActive || isCompleted ? "text-blue-600" : "text-gray-400"
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`h-[2px] w-24 mx-2 transition-colors duration-300 ${isCompleted ? "bg-blue-600" : "bg-gray-100"
                                    }`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Step 1: Select Course */}
                <div className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 ${currentStep === 1 ? 'border-blue-500' : 'border-gray-100'}`}>
                    <div className={`p-1 ${currentStep === 1 ? 'bg-blue-500/5' : ''}`}>
                        <div className="flex items-center gap-3 p-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>1</div>
                            <h2 className="font-bold text-gray-800 text-base">Select Course</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <select
                            className="w-full h-12 rounded-xl border border-gray-100 bg-gray-50/30 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={selectedCourseId}
                            onChange={(e) => {
                                setSelectedCourseId(e.target.value);
                                setSelectedSemesterId("");
                                setCurrentStep(e.target.value ? (hasSemesters ? 2 : 3) : 1);
                            }}
                        >
                            <option value="">Choose a course...</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.title} ({course.courseCode})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Step 2: Choose Semester (Conditional) */}
                {selectedCourseId && hasSemesters && (
                    <div className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 ${currentStep === 2 ? 'border-blue-500' : 'border-gray-100'} animate-in fade-in slide-in-from-top-4`}>
                        <div className={`p-1 ${currentStep === 2 ? 'bg-blue-500/5' : ''}`}>
                            <div className="flex items-center gap-3 p-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>2</div>
                                <h2 className="font-bold text-gray-800 text-base">Choose Semester</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {selectedCourse.semesters.map(semester => (
                                    <button
                                        key={semester.id}
                                        onClick={() => {
                                            setSelectedSemesterId(semester.id);
                                            setCurrentStep(3);
                                        }}
                                        className={`p-4 rounded-xl border-2 transition-all font-bold text-sm ${selectedSemesterId === semester.id
                                                ? "border-blue-600 bg-blue-50 text-blue-600"
                                                : "border-gray-100 hover:border-gray-200 text-gray-500"
                                            }`}
                                    >
                                        {semester.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Exam Details */}
                {selectedCourseId && (!hasSemesters || selectedSemesterId) && (
                    <div className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 ${currentStep === 3 ? 'border-emerald-500' : 'border-gray-100'} animate-in fade-in slide-in-from-top-4`}>
                        <div className={`p-1 ${currentStep === 3 ? 'bg-emerald-500/5' : ''}`}>
                            <div className="flex items-center gap-3 p-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 3 ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>3</div>
                                <h2 className="font-bold text-gray-800 text-base">Set Exam Details</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead className="font-bold text-[10px] uppercase tracking-wider h-10">Subject</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-wider h-10 w-40 text-center">Exam Date</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-wider h-10 w-64 text-center">Time (Start - End)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subjectExams.map((ex, idx) => (
                                            <TableRow key={ex.id}>
                                                <TableCell className="font-medium text-sm text-gray-700">{ex.subjectName}</TableCell>
                                                <TableCell className="p-2">
                                                    <Input 
                                                        type="date" 
                                                        className="h-9 text-xs border-gray-100 rounded-lg bg-white" 
                                                        value={ex.date}
                                                        onChange={(e) => {
                                                            const newExams = [...subjectExams];
                                                            newExams[idx].date = e.target.value;
                                                            setSubjectExams(newExams);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="p-2">
                                                    <div className="flex items-center gap-2">
                                                        <Input 
                                                            type="time" 
                                                            className="h-9 text-xs border-gray-100 rounded-lg bg-white" 
                                                            value={ex.startTime}
                                                            onChange={(e) => {
                                                                const newExams = [...subjectExams];
                                                                newExams[idx].startTime = e.target.value;
                                                                setSubjectExams(newExams);
                                                            }}
                                                        />
                                                        <span className="text-gray-400">-</span>
                                                        <Input 
                                                            type="time" 
                                                            className="h-9 text-xs border-gray-100 rounded-lg bg-white" 
                                                            value={ex.endTime}
                                                            onChange={(e) => {
                                                                const newExams = [...subjectExams];
                                                                newExams[idx].endTime = e.target.value;
                                                                setSubjectExams(newExams);
                                                            }}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Examination Venue</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <Input
                                            className="h-12 pl-12 bg-gray-50/30 border-gray-100 rounded-xl text-sm"
                                            placeholder="Enter venue address..."
                                            value={examDetails.venue}
                                            onChange={(e) => setExamDetails({ ...examDetails, venue: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <Button
                                    onClick={() => setCurrentStep(4)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-12 font-bold shadow-lg"
                                >
                                    Proceed to Student Selection
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Select Students */}
                {currentStep === 4 && (
                    <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-500 overflow-hidden animate-in fade-in slide-in-from-top-4">
                        <div className="p-1 bg-blue-500/5">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">4</div>
                                    <h2 className="font-bold text-gray-800 text-base">Select Students</h2>
                                </div>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <Input
                                        className="h-9 pl-9 bg-white border-gray-100 rounded-lg text-xs"
                                        placeholder="Search name or ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="max-h-[400px] overflow-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-20">
                                    <TableRow className="bg-[#f8fafc] border-b border-gray-100">
                                        <TableHead className="w-12 px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300"
                                                onChange={handleSelectAll}
                                                checked={filteredAdmissions.length > 0 && selectedStudents.length === filteredAdmissions.length}
                                            />
                                        </TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4">Student</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 text-center">Enrollment No</TableHead>
                                        <TableHead className="font-bold text-gray-600 text-[11px] uppercase py-4 text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAdmissions.length > 0 ? (
                                        filteredAdmissions.map((adm) => (
                                            <TableRow key={adm.id} className="hover:bg-blue-50/30 transition-colors">
                                                <TableCell className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-gray-300 pointer-events-auto"
                                                        checked={selectedStudents.includes(adm.id)}
                                                        onChange={() => handleSelectStudent(adm.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                                            {adm.enquiry?.profileImage ? (
                                                                <img src={adm.enquiry.profileImage} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-blue-50 text-xs">
                                                                    {adm.enquiry?.firstName?.[0]}{adm.enquiry?.surname?.[0]}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-800 text-sm">{adm.enquiry?.firstName} {adm.enquiry?.surname}</div>
                                                            <div className="text-[10px] text-gray-500 font-medium">{adm.enquiry?.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold">
                                                        {adm.rollNo || adm.id}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 text-right pr-6">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`h-8 px-3 rounded-lg text-xs font-bold ${selectedStudents.includes(adm.id) ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-blue-600'}`}
                                                        onClick={() => handleSelectStudent(adm.id)}
                                                    >
                                                        {selectedStudents.includes(adm.id) ? 'Selected' : 'Select'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-12 text-center text-gray-400 italic text-sm">
                                                No admitted students found for this course/semester.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {currentStep === 4 && selectedStudents.length > 0 && (
                    <div className="flex flex-col items-center gap-4 py-8 animate-bounce-subtle">
                        <Button
                            onClick={handleGenerateHallTickets}
                            className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-12 h-14 rounded-2xl font-bold flex items-center gap-3 shadow-[0_10px_30px_rgba(30,64,175,0.3)] transition-all transform hover:scale-105"
                        >
                            <FileText size={22} />
                            Generate {selectedStudents.length} Hall {selectedStudents.length === 1 ? 'Ticket' : 'Tickets'}
                        </Button>
                        <p className="text-gray-400 text-xs font-medium tracking-wide">Ready to print A4 size hall tickets</p>
                    </div>
                )}
            </div>
        </div>
    );
}
