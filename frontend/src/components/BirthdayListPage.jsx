import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Gift, Calendar, CalendarDays, Users, Clock, List, Download, Mail, Cake, Loader2 } from "lucide-react";
import { fetchAdmissions } from '@/store/admissionSlice';
import { BASE_URL } from '@/config';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function BirthdayListPage() {
    const dispatch = useDispatch();
    const { admissions = [], loading } = useSelector((state) => state.admissions);
    const [filter, setFilter] = useState("Upcoming (30 Days)");
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        dispatch(fetchAdmissions());
    }, [dispatch]);

    // Date Helper Functions
    const getBirthdayDetails = (dobString) => {
        if (!dobString) return null;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dob = new Date(dobString);
        const currentYear = today.getFullYear();

        let nextBirthday = new Date(dob);
        nextBirthday.setFullYear(currentYear);
        nextBirthday.setHours(0, 0, 0, 0);

        // If birthday has passed this year, it's next year
        if (nextBirthday < today) {
            nextBirthday.setFullYear(currentYear + 1);
        }

        const timeDiff = nextBirthday.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const turningAge = nextBirthday.getFullYear() - dob.getFullYear();

        return {
            date: nextBirthday,
            day: nextBirthday.getDate(),
            month: nextBirthday.toLocaleString('default', { month: 'short' }).toUpperCase(),
            fullDateString: nextBirthday.toLocaleDateString(),
            daysLeft,
            turningAge,
            originalDob: dob.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
    };

    // Process admissions with calculated data
    const processedStudents = useMemo(() => {
        if (!admissions) return [];
        return admissions
            .filter(adm => adm.enquiry?.dob)
            .map(adm => {
                const details = getBirthdayDetails(adm.enquiry.dob);
                return { ...adm, ...details };
            })
            .sort((a, b) => a.daysLeft - b.daysLeft);
    }, [admissions]);

    // Calculate Stats
    const stats = useMemo(() => {
        const todayCount = processedStudents.filter(s => s.daysLeft === 0).length;
        const weekCount = processedStudents.filter(s => s.daysLeft >= 0 && s.daysLeft <= 7).length;
        const monthCount = processedStudents.filter(s => {
            const today = new Date();
            return s.date.getMonth() === today.getMonth() && s.date.getFullYear() === today.getFullYear();
        }).length;

        return [
            { label: "TODAY", count: todayCount, icon: Gift, color: "bg-gradient-to-br from-rose-500 to-pink-600", border: "border-t-4 border-rose-500" },
            { label: "THIS WEEK", count: weekCount, icon: Calendar, color: "bg-gradient-to-br from-amber-400 to-orange-500", border: "border-t-4 border-amber-500" },
            { label: "THIS MONTH", count: monthCount, icon: CalendarDays, color: "bg-gradient-to-br from-sky-400 to-blue-600", border: "border-t-4 border-blue-500" },
            { label: "TOTAL ADMITTED", count: admissions.length, icon: Users, color: "bg-gradient-to-br from-indigo-500 to-purple-600", border: "border-t-4 border-indigo-500" },
        ];
    }, [processedStudents, admissions.length]);

    const filters = [
        { label: "Today", icon: Gift },
        { label: "This Week", icon: Calendar },
        { label: "This Month", icon: CalendarDays },
        { label: "Upcoming (30 Days)", icon: Clock },
        { label: "All Birthdays", icon: List },
    ];

    const filteredList = processedStudents.filter(student => {
        if (filter === "All Birthdays") return true;
        if (filter === "Today") return student.daysLeft === 0;
        if (filter === "This Week") return student.daysLeft >= 0 && student.daysLeft <= 7;
        if (filter === "This Month") {
            const today = new Date();
            return student.date.getMonth() === today.getMonth() && student.date.getFullYear() === today.getFullYear();
        }
        if (filter === "Upcoming (30 Days)") return student.daysLeft >= 0 && student.daysLeft <= 30;
        return false;
    });

    const handleDownloadPoster = async (student) => {
        setIsGenerating(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/background-images`);
            const bgTemplates = response.data;
            
            const bdayTemplate = bgTemplates.find(bg => bg.title.toLowerCase().includes('birthday')) || bgTemplates[0];

            if (!bdayTemplate) {
                toast.error("No Birthday Poster template found. Check backgrounds settings.");
                return;
            }

            const settings = bdayTemplate.designSettings || {};
            const isLandscape = bdayTemplate.type === 'LANDSCAPE';
            
            // Standard Poster Size (A4 or Square depending on type)
            const widthMm = isLandscape ? 297 : 210;
            const heightMm = isLandscape ? 210 : 297;

            const printWindow = window.open('', '_blank');
            
            const renderField = (fieldId, value, isImage = false, isStack = false) => {
                const fieldOpts = settings[fieldId] || { visible: true, fontSize: 16 };
                if (!fieldOpts.visible && !isStack) return ''; // Only hide if not part of our required stack or hidden in settings

                const textAlign = fieldOpts.textAlign || 'center';
                const flexAlign = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';

                return `
                    <div style="
                        ${isStack ? 'position: relative; margin-bottom: 30px;' : `position: absolute; left: ${fieldOpts.x}%; top: ${fieldOpts.y}%; transform: translate(-50%, -50%);`}
                        font-size: calc(${fieldOpts.fontSize || 20}px * 1.5);
                        font-weight: ${fieldOpts.fontWeight || 'bold'};
                        color: ${fieldOpts.color || '#000'};
                        width: ${isImage ? `${fieldOpts.width || 150}px` : 'auto'};
                        height: ${isImage ? `${fieldOpts.height || 150}px` : 'auto'};
                        display: flex;
                        align-items: center;
                        justify-content: ${flexAlign};
                        text-align: ${textAlign};
                        text-transform: ${fieldOpts.textTransform || 'none'};
                        z-index: 10;
                    ">
                        ${isImage ? (value ? `<img src="${value}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 8px solid white; box-shadow: 0 15px 35px rgba(0,0,0,0.2);" />` : '') : `<span>${value}</span>`}
                    </div>
                `;
            };

            const html = `
                <html>
                    <head>
                        <title>Birthday Poster - ${student.firstName}</title>
                        <style>
                            @page { size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'}; margin: 0; }
                            body { 
                                margin: 0; 
                                padding: 0; 
                                display: flex; 
                                justify-content: center; 
                                align-items: center; 
                                background: #222; 
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                            .poster-container {
                                position: relative;
                                width: ${widthMm}mm;
                                height: ${heightMm}mm;
                                background: white;
                                overflow: hidden;
                                box-shadow: 0 0 100px rgba(0,0,0,0.8);
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                            .bg-image { 
                                width: 100%; 
                                height: 100%; 
                                object-fit: cover; 
                                position: absolute; 
                                inset: 0;
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                            .stack-container {
                                position: absolute;
                                inset: 0;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                padding: 60px;
                                background: rgba(255, 255, 255, 0.1);
                                backdrop-filter: blur(2px);
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                            @media print {
                                body { background: none; }
                                .poster-container { box-shadow: none; margin: 0; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="poster-container">
                            <img src="${bdayTemplate.imageUrl}" class="bg-image" id="bgImg" />
                            <div class="stack-container">
                                ${renderField('studentPhoto', student.enquiry?.profileImage, true, true)}
                                ${renderField('studentName', `${student.firstName} ${student.surname}`, false, true)}
                                ${renderField('dob', `Born on: ${student.originalDob}`, false, true)}
                            </div>
                        </div>
                        <script>
                            const img = document.getElementById('bgImg');
                            const doPrint = () => {
                                setTimeout(() => {
                                    window.print();
                                    // window.close(); 
                                }, 1000);
                            };
                            if (img.complete) {
                                doPrint();
                            } else {
                                img.onload = doPrint;
                            }
                        </script>
                    </body>
                </html>
            `;

            printWindow.document.write(html);
            printWindow.document.close();
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate birthday card");
        } finally {
            setIsGenerating(false);
        }
    };

    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
                            <Cake size={24} />
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Student Birthdays</h1>
                    </div>
                    <p className="text-sm text-gray-500 max-w-md">Track student birthdays, celebrate their growth, and generate personalized birthday cards for each student.</p>
                </div>
                <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 select-none pointer-events-none">
                    <Gift size={200} />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ${stat.border} transition-all hover:translate-y-[-4px] hover:shadow-md group`}>
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-black/5 mb-4 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-gray-900 mb-0.5">{stat.count}</div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-1">
                {filters.map((f) => (
                    <button
                        key={f.label}
                        onClick={() => setFilter(f.label)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all
                            ${filter === f.label
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                : "text-gray-500 hover:bg-gray-50 active:scale-95"
                            }`}
                    >
                        <f.icon size={14} /> {f.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
                    <p className="text-sm font-bold text-gray-500">Syncing student birthdays...</p>
                </div>
            ) : filteredList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredList.map((student) => (
                        <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-indigo-100 transition-all">
                            <div className="p-6 relative">
                                <div className="absolute right-4 top-4 text-center">
                                    <div className="bg-indigo-50 text-indigo-700 w-12 h-14 rounded-xl flex flex-col items-center justify-center border border-indigo-100 shadow-sm">
                                        <span className="text-xl font-black leading-none">{student.day}</span>
                                        <span className="text-[9px] font-black uppercase tracking-wider">{student.month}</span>
                                    </div>
                                    <div className={`mt-2 inline-flex px-2 py-0.5 rounded-full text-[9px] font-black text-white ${student.daysLeft === 0 ? 'bg-rose-500' : 'bg-indigo-600'}`}>
                                        {student.daysLeft === 0 ? "TODAY" : `${student.daysLeft} DAYS`}
                                    </div>
                                </div>

                                <div className="flex gap-4 items-center mb-6">
                                    <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg overflow-hidden shrink-0 bg-gray-50">
                                        {student.enquiry?.profileImage ? (
                                            <img src={student.enquiry.profileImage} alt={student.firstName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 font-black text-xl italic uppercase">
                                                {student.firstName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="pr-12">
                                        <h3 className="font-black text-gray-900 text-lg uppercase leading-tight line-clamp-1">{student.firstName} {student.surname}</h3>
                                        <p className="text-gray-400 text-xs font-bold font-mono mt-0.5">{student.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Birth Date</div>
                                        <div className="text-xs font-bold text-gray-700">{student.originalDob}</div>
                                    </div>
                                    <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100/50 text-sky-700">
                                        <div className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-1">Turning</div>
                                        <div className="text-xs font-black italic">{student.turningAge} Years Old</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleDownloadPoster(student)}
                                    className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-xl flex items-center justify-center gap-2 font-black text-xs transition-all active:scale-95 shadow-lg shadow-black/10"
                                >
                                    <Download size={14} /> DOWNLOAD BIRTHDAY CARD
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4">
                        <Cake size={40} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-1 tracking-tight">Party Not Found</h3>
                    <p className="text-xs text-gray-400 font-medium">There are no birthdays matching your selected filter.</p>
                </div>
            )}
        </div>
    );
}






