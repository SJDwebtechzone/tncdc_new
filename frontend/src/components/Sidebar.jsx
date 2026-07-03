import { Link, useLocation } from "react-router-dom"
import {
    LayoutDashboard,
    Award,
    Image as ImageIcon,
    BookOpen,
    DollarSign,
    Box,
    Layers,
    FileText,
    MonitorPlay,
    MessageSquare,
    Video,
    StickyNote,
    Star,
    Menu,
    Search,
    Files,
    Users,
    Contact,
    CalendarCheck,
    CalendarX,
    Banknote,
    UserCog,
    Lock,
    Briefcase,
    Gift,
    Settings,
    Settings2,
    KeyRound,
    ShieldCheck,
    Bell,
    AppWindow,
    MessageCircle,
    ArrowLeftRight,
    ArrowUpRight,
    UserPlus,
    Printer,
    HelpCircle,
    Cake,
    History as HistoryIcon,
    Wallet,
    ChartBar,
    Clock,
    QrCode,
    CalendarOff,
    Palmtree,
    Calendar,
    FileSignature, // Hall Ticket
    FileQuestion, // Mock Test
    FileCheck, // Final Exam & Approved Cert
    FileInput, // Exam Request
    PenTool, // Update Marks
    FileBadge, // Apply Cert
    FileOutput, // Requested Cert
    Smartphone,
    Target,
    Link as LinkIcon,
    Share2,
    Info,
    Hash,
    MessageSquareQuote,
    Images,
    Handshake,
    Book,
    ClipboardList,
    Shield,
    CreditCard,
    Mail,
    MapPin
} from "lucide-react"
import { useState } from "react"
import { fetchProfile } from '@/store/profileSlice';
import { BASE_URL } from '@/config';
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

const studentMenuGroups = [
    {
        title: "STUDENT PANEL",
        items: [
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/dashboard/profile", label: "My Profile", icon: Contact },
            { href: "/dashboard/referral", label: "Referral", icon: Share2 },
            { href: "/dashboard/attendance", label: "Attendance", icon: CalendarCheck },
        ]
    },
    {
        title: "COURSES",
        items: [
            { href: "/dashboard/all-courses", label: "All Courses", icon: Book },
            { href: "/dashboard/online-courses", label: "Online Courses", icon: MonitorPlay },
            { href: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },
        ]
    },
    {
        title: "EXAMS & RESULTS",
        items: [
            { href: "/dashboard/test-results", label: "Test Exam Results", icon: FileQuestion },
            { href: "/dashboard/final-results", label: "Final Exam Results", icon: FileCheck },
        ]
    },
    {
        title: "ACCOUNT & EXTRAS",
        items: [
            { href: "/dashboard/wallet", label: "My Wallet", icon: Wallet },
            { href: "/dashboard/resume", label: "My Resume", icon: FileText },
            { href: "/dashboard/offers", label: "Offers", icon: Gift },
            { href: "/dashboard/birthday-poster", label: "My Birthday Poster", icon: Cake },
            { href: "/dashboard/help-support", label: "Help Support", icon: HelpCircle },
        ]
    },
    {
        title: "INFORMATION",
        items: [
            { href: "/dashboard/about-us", label: "About Us", icon: Info },
            { href: "/dashboard/privacy-policy", label: "Privacy Policy", icon: Shield },
            { href: "/dashboard/terms", label: "Terms and Conditions", icon: FileText },
            { href: "/dashboard/refund-policy", label: "Refund Policy", icon: DollarSign },
            { href: "/dashboard/contact-us", label: "Contact Us", icon: Mail },
        ]
    }
]

// Structure based on USER REQUEST images
const menuGroups = [
    {
        title: "COURSES",
        items: [
            { href: "/dashboard/exam-grade", label: "Exam Grade System", icon: Award },
            { href: "/dashboard/subjects", label: "Subjects", icon: BookOpen },
            { href: "/dashboard/languages", label: "Languages", icon: MessageSquare },
            { href: "/dashboard/course/categories", label: "Course Categories", icon: Layers },
            { href: "/dashboard/course/award-categories", label: "Course Award Categories", icon: Award },
            { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
            { href: "/dashboard/online-classes", label: "Online Classes", icon: MonitorPlay },
        ]
    },
    {
        title: "COURSE CONTENT",
        items: [
            { href: "/dashboard/course/videos", label: "Course Videos", icon: Video },
            { href: "/dashboard/course/notes", label: "Course Notes", icon: StickyNote },
            { href: "/dashboard/course/reviews", label: "Course Reviews", icon: Star },
        ]
    },
    {
        title: "BATCHES",
        items: [
            { href: "/dashboard/batches", label: "Batches", icon: Box },
        ]
    },
    {
        title: "STUDENT MANAGEMENT",
        items: [
            { href: "/dashboard/students/list", label: "Students List", icon: Users },
            { href: "/dashboard/students/notifications", label: "Student Notifications", icon: Bell },
            { href: "/dashboard/students/popups", label: "Popups", icon: AppWindow },
            { href: "/dashboard/students/enquiries", label: "Student Enquiries", icon: MessageCircle },
            { href: "/dashboard/students/enquiry-followups", label: "Enquiries Follow-Ups", icon: ArrowUpRight },
            { href: "/dashboard/students/admissions", label: "Admissions", icon: UserPlus },
            { href: "/dashboard/students/id-card-print", label: "Bulk ID Card Print", icon: Printer },
            { href: "/dashboard/students/help-support", label: "Help Support", icon: HelpCircle },
            { href: "/dashboard/students/birthday-list", label: "Birthday List", icon: Cake },
        ]
    },
    {
        title: "STUDENT FEES",
        items: [
            { href: "/dashboard/fees/upcoming", label: "Upcoming Installments", icon: DollarSign },
            { href: "/dashboard/fees/paid", label: "Paid Installments", icon: FileText },
            { href: "/dashboard/fees/history", label: "Payment History", icon: HistoryIcon },
            { href: "/dashboard/fees/wallet", label: "Student Wallet", icon: Wallet },
        ]
    },
    {
        title: "STUDENT ATTENDANCE",
        items: [
            { href: "/dashboard/attendance/report", label: "Attendance Report", icon: ChartBar },
            { href: "/dashboard/attendance/add", label: "Add Attendance", icon: Clock },
            { href: "/dashboard/attendance/qr", label: "Add Attendance QR", icon: QrCode },
            { href: "/dashboard/attendance/leave", label: "Leave Management", icon: CalendarOff },
            { href: "/dashboard/attendance/holidays", label: "Holidays", icon: Palmtree },
            { href: "/dashboard/attendance/week-off", label: "Week Off Days", icon: Calendar },
        ]
    },
    {
        title: "STUDENT EXAMS",
        items: [
            { href: "/dashboard/exams/hall-tickets", label: "Generate Hall Tickets", icon: FileSignature },
            { href: "/dashboard/exams/mock-tests", label: "Mock Tests", icon: FileQuestion },
            { href: "/dashboard/exams/final", label: "Final Exams", icon: FileCheck },
            { href: "/dashboard/exams/requests", label: "Exam Requests", icon: FileInput },
            { href: "/dashboard/exams/marks", label: "Update Marks", icon: PenTool },
        ]
    },
    {
        title: "CERTIFICATES",
        items: [
            { href: "/dashboard/certificates/apply", label: "Apply for Certificate", icon: FileBadge },
            { href: "/dashboard/certificates/approved", label: "Approved Certificates", icon: FileCheck },
            { href: "/dashboard/certificates/requested", label: "Requested Certificates", icon: FileOutput },
        ]
    },
    {
        title: "OLD/HDI CERTIFICATES",
        items: [
            { href: "/dashboard/hdi-certificate", label: "HDI Certificate Marksheets", icon: Box },
        ]
    },
    {
        title: "BACKGROUND IMAGES",
        items: [
            { href: "/dashboard/backgrounds", label: "Background Images", icon: ImageIcon },
        ]
    },
    {
        title: "EXPENSES",
        items: [
            { href: "/dashboard/expenses/types", label: "Expense Types", icon: FileText },
            { href: "/dashboard/expenses/subtypes", label: "Expense Sub Types", icon: Layers },
            { href: "/dashboard/expenses/list", label: "Expenses List", icon: FileText },
        ]
    },
    {
        title: "INVENTORY",
        items: [
            { href: "/dashboard/inventory/categories", label: "Inventory Categories", icon: Files },
            { href: "/dashboard/inventory/products", label: "Inventory Products", icon: Box },
            { href: "/dashboard/inventory/student", label: "Student Inventory", icon: Users },
        ]
    },
    {
        title: "FRANCHISES",
        items: [
            { href: "/dashboard/franchises/plans", label: "Franchise Plans", icon: Briefcase },
            { href: "/dashboard/franchises/list", label: "Franchises List", icon: MapPin },
            { href: "/dashboard/franchises/requests", label: "Franchises Requests", icon: MapPin },
            { href: "/dashboard/franchises/wallet", label: "Franchise Wallet", icon: Wallet },
        ]
    },
    {
        title: "STAFF MANAGEMENT",
        items: [
            { href: "/dashboard/staff/list", label: "Staff List", icon: Contact },
            { href: "/dashboard/staff/attendance", label: "Staff Attendance", icon: CalendarCheck },
            { href: "/dashboard/staff/leaves", label: "Staff Leaves", icon: CalendarX },
            { href: "/dashboard/staff/salary", label: "Staff Salary", icon: Banknote },
            { href: "/dashboard/staff/lectures", label: "Staff Lectures", icon: BookOpen },
        ]
    },
    {
        title: "USER MANAGEMENT",
        items: [
            { href: "/dashboard/users/manage", label: "Manage Users", icon: UserCog },
            { href: "/dashboard/users/roles", label: "Manage Roles", icon: Lock },
            { href: "/dashboard/users/designations", label: "Designations", icon: Briefcase },
        ]
    },
    {
        title: "OFFERS",
        items: [
            { href: "/dashboard/offers", label: "Offers", icon: Gift },
        ]
    },
    {
        title: "SETTINGS",
        items: [
            { href: "/dashboard/settings/general", label: "Settings", icon: Settings },
            { href: "/dashboard/settings/payment", label: "Payment Settings", icon: Settings2 },
            { href: "/dashboard/settings/whatsapp", label: "WhatsApp Templates", icon: MessageSquare },
            { href: "/dashboard/settings/password", label: "Change Password", icon: KeyRound },
            { href: "/dashboard/settings/backup", label: "Secure Backup", icon: ShieldCheck },
        ]
    }
]

const websiteMenuGroups = [
    {
        title: "WEBSITE CONTENT",
        items: [
            { href: "/dashboard/website/top-performers", label: "Top Performers", icon: Star },
            { href: "/dashboard/website/services", label: "Our Services", icon: Settings2 },
            { href: "/dashboard/website/faqs", label: "FAQs", icon: HelpCircle },
            { href: "/dashboard/website/testimonials", label: "Testimonials", icon: MessageSquareQuote },
            { href: "/dashboard/website/teachers", label: "Teachers", icon: Users },
            { href: "/dashboard/website/counters", label: "Counters", icon: Hash },
            { href: "/dashboard/website/events", label: "Events", icon: Calendar },
            { href: "/dashboard/website/about", label: "About", icon: Info },
            { href: "/dashboard/website/banner", label: "Banner", icon: ImageIcon },
            { href: "/dashboard/website/mobile-banner", label: "Mobile Banner", icon: Smartphone },
            { href: "/dashboard/website/mission-vision", label: "Mission & Vision", icon: Target },
            { href: "/dashboard/website/contact", label: "Contact", icon: Mail },
            { href: "/dashboard/website/posts", label: "Posts", icon: FileText },
            { href: "/dashboard/website/gallery", label: "Gallery", icon: Images },
            { href: "/dashboard/website/partners", label: "Partners", icon: Handshake },
            { href: "/dashboard/website/site-setting", label: "Site Setting", icon: Settings },
            { href: "/dashboard/website/study-materials", label: "Study Materials", icon: Book },
            { href: "/dashboard/website/jobs", label: "Jobs", icon: Briefcase },
            { href: "/dashboard/website/job-applications", label: "Job Applications", icon: ClipboardList },
            { href: "/dashboard/website/sample-certificates", label: "Sample Certificates", icon: Award },
            { href: "/dashboard/website/affiliations", label: "Affiliations", icon: LinkIcon },
            { href: "/dashboard/website/payment-details", label: "Payment Details", icon: CreditCard },
            { href: "/dashboard/website/policies", label: "Policies", icon: Shield },
            { href: "/dashboard/website/social-media", label: "Social Media", icon: Share2 },
        ]
    }
]

import { useSelector } from "react-redux"

export function Sidebar() {
    const { pathname } = useLocation()
    const { user } = useSelector((state) => state.auth)
    const profile = useSelector((state) => state.profile)
    const [mode, setMode] = useState('academic') // 'academic' or 'website'

    const permissions = user?.permissions || {}
    const isAdmin = user?.isAdmin || user?.roles?.includes('ADMIN')

    const hasPermission = (label) => {
        if (isAdmin) return true
        return permissions[label]?.view === true
    }

    const isStudent = user?.role?.toUpperCase() === 'STUDENT' || user?.roles?.some(r => r.toUpperCase() === 'STUDENT');

    let currentMenu = [];
    if (isStudent) {
        currentMenu = studentMenuGroups;
    } else {
        currentMenu = (mode === 'academic' ? menuGroups : websiteMenuGroups)
            .map(group => ({
                ...group,
                items: group.items.filter(item => hasPermission(item.label))
            }))
            .filter(group => group.items.length > 0);
    }

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 overflow-y-auto z-50 shadow-sm scrollbar-thin scrollbar-thumb-gray-200">
            {/* Logo Area */}
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2 px-2">
                    {profile?.logoUrl ? (
                        <img 
                            src={profile.logoUrl.startsWith('/uploads') ? `${BASE_URL}${profile.logoUrl}` : profile.logoUrl} 
                            alt="Institute Logo" 
                            className="h-12 object-contain" 
                        />
                    ) : (
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                            {profile?.instituteName?.charAt(0) || 'T'}
                        </div>
                    )}
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                    <Menu size={20} />
                </button>
            </div>

            {/* Switch Button (Only for Admin/Staff) */}
            {!isStudent && (
                <div className="px-4 mb-4">
                    <button
                        onClick={() => setMode(mode === 'academic' ? 'website' : 'academic')}
                        className="w-full bg-[#0f172a] hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <div className="bg-white/20 p-1 rounded-lg">
                            <ArrowLeftRight size={16} />
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                            <span>Switch to {mode === 'academic' ? 'Website' : 'Academic'}</span>
                            <span>Management</span>
                        </div>
                    </button>
                </div>
            )}

            {/* Search */}
            <div className="px-4 mb-2">
                <div className="relative">
                    <Input
                        placeholder="Search menu..."
                        className="pl-3 pr-4 py-2 h-9 text-sm bg-white border-gray-200"
                    />
                    {/* <Search className="absolute right-3 top-2.5 text-gray-400" size={14} /> */}
                </div>
            </div>

            {/* Dashboard Link (Separate - Only for Non-Students as Students have it in panel) */}
            {!isStudent && hasPermission('Dashboard') && (
                <div className="px-4 mb-4">
                    <Link
                        to="/dashboard"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            pathname === "/dashboard"
                                ? "bg-[#0f172a] text-white shadow-md" // Dark blue active state like image
                                : "text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>
                </div>
            )}

            {/* Menu Items */}
            <nav className="flex-1 px-4 space-y-6 pb-8 overflow-y-auto scrollbar-none">
                {currentMenu.map((group) => (
                    <div key={group.title}>
                        <h3 className="text-xs font-bold text-gray-900 mb-3 px-2 uppercase tracking-wide">{group.title}</h3>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                        pathname === item.href
                                            ? "bg-[#0f172a] text-white shadow-md font-medium"
                                            : "text-gray-900 hover:text-[#5d5fef] hover:bg-gray-50"
                                    )}
                                >
                                    <item.icon size={18} className={cn("opacity-70", pathname === item.href && "opacity-100")} />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-gray-100">
                <p className="text-xs text-center text-gray-400">Copyright 2026-27 © DevSpectra.</p>
            </div>
        </div>
    )
}






