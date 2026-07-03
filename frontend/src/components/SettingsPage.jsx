import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Settings as SettingsIcon,
    Globe,
    Bell,
    Hash,
    UserCheck,
    IdCard,
    Tags,
    Smartphone,
    Save,
    ChevronRight,
    Lock,
    Download,
    CreditCard,
    Database,
    KeyRound,
    Check,
    Play,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'website', label: 'Website Display', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'roll_number', label: 'Roll Number', icon: Hash },
    { id: 'enrollment', label: 'Enrollment Number', icon: UserCheck },
    { id: 'id_card', label: 'ID Card Settings', icon: IdCard },
    { id: 'prefixes', label: 'Prefixes', icon: Tags },
    { id: 'mobile_app', label: 'Mobile App', icon: Smartphone },
];

import { useParams, useNavigate } from 'react-router-dom';

export default function SettingsPage() {
    const { tabId } = useParams();
    const navigate = useNavigate();
    const activeTab = tabId || 'general';

    const setActiveTab = (id) => {
        navigate(`/dashboard/settings/${id}`);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralSettings />;
            case 'website':
                return <WebsiteDisplaySettings />;
            case 'notifications':
                return <NotificationSettings />;
            case 'roll_number':
                return <NumberDisplaySettings title="Roll Number Display" />;
            case 'enrollment':
                return <NumberDisplaySettings title="Enrollment Number Display" />;
            case 'id_card':
                return <IDCardSettings />;
            case 'prefixes':
                return <PrefixesSettings />;
            case 'mobile_app':
                return <MobileAppSettings />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                        <SettingsIcon size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">This section is coming soon</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 min-h-[600px] overflow-hidden">
            {/* Internal Sidebar */}
            <div className="w-64 border-r border-gray-100 bg-gray-50/30 flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Settings</h2>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Super Admin</p>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 rounded-sm text-[13px] font-bold transition-all duration-200",
                                activeTab === tab.id
                                    ? "bg-white text-[#0f172a] shadow-sm border border-gray-100"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                            )}
                        >
                            <tab.icon size={16} className={cn(activeTab === tab.id ? "text-[#0f172a]" : "text-gray-400")} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Internal Header */}
                <div className="h-16 px-8 flex items-center justify-between border-b border-gray-50">
                    <div>
                        {/* Title is rendered in sub-components for more flexibility */}
                    </div>
                    <Button
                        onClick={() => alert("Settings saved successfully!")}
                        className="bg-[#0f172a] hover:bg-[#151c63] text-white gap-2 rounded-sm h-9 px-6 text-xs font-bold shadow-md uppercase tracking-wider transition-all active:scale-95"
                    >
                        <Save size={14} /> Save Settings
                    </Button>
                </div>

                <div className="p-8 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

function GeneralSettings() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">General Settings</h1>
                <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">Configure basic application settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Referral Amount <span className="text-red-500">*</span></label>
                    <Input className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-[#0f172a]" defaultValue="100" />
                    <p className="text-[10px] text-gray-400 italic px-1 font-medium">Amount for each successful referral</p>
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Reminder Days <span className="text-red-500">*</span></label>
                    <Input className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-[#0f172a]" defaultValue="7" />
                    <p className="text-[10px] text-gray-400 italic px-1 font-medium">Days before due date to send reminder</p>
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Late Fees Per Day <span className="text-red-500">*</span></label>
                    <Input className="h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-[#0f172a]" defaultValue="0" />
                    <p className="text-[10px] text-gray-400 italic px-1 font-medium">Amount charged per day after due date</p>
                </div>
            </div>
        </div>
    );
}

function WebsiteDisplaySettings() {
    const settings = [
        { label: 'Show Course Fees', sub: 'Display course fees on the website', checked: true },
        { label: 'Show Course Syllabus', sub: 'Display course syllabus on the website', checked: true },
        { label: 'Hide Content After Completion', sub: 'Hide videos and notes after course completion', checked: false },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Website Display</h1>
                <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">Control what's visible on your website</p>
            </div>

            <div className="space-y-6 pt-4">
                {settings.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-sm bg-gray-50/30 border border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-300 group">
                        <div className="space-y-1">
                            <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">{item.label}</h3>
                            <p className="text-[12px] text-gray-500 leading-relaxed italic">{item.sub}</p>
                        </div>
                        <Switch
                            checked={item.checked}
                            className="data-[state=checked]:bg-[#0f172a]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function NotificationSettings() {
    const settings = [
        { label: 'WhatsApp Notifications', sub: 'Send WhatsApp notifications to students', checked: true },
        { label: 'SMS Notifications', sub: 'Send SMS notifications to students', checked: true },
        { label: 'Email Notifications', sub: 'Send email notifications to students', checked: true },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Notifications</h1>
                <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">Manage notification preferences</p>
            </div>

            <div className="space-y-6 pt-4">
                {settings.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-sm bg-gray-50/30 border border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-300 group">
                        <div className="space-y-1">
                            <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">{item.label}</h3>
                            <p className="text-[12px] text-gray-500 leading-relaxed italic">{item.sub}</p>
                        </div>
                        <Switch
                            checked={item.checked}
                            className="data-[state=checked]:bg-[#0f172a]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function IDCardSettings() {
    const fields = [
        'First Name', 'Father Name', 'Surname', 'Date of Birth', 'Batch Name', 'Mobile Number', 'Referral Code'
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">ID Card Fields</h1>
                <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">Choose which fields appear on the ID card</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {fields.map((field, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-sm bg-gray-50/30 border border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-300 group">
                        <h3 className="text-[13px] font-bold text-gray-700 tracking-tight">{field}</h3>
                        <Switch
                            checked={true}
                            className="data-[state=checked]:bg-[#0f172a]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function PrefixesSettings() {
    const prefixTypes = [
        { type: 'certificate_number', prefix: 'CN' },
        { type: 'roll_number', prefix: 'RN', extra: true },
        { type: 'fee_receipt', prefix: 'FR' },
        { type: 'expense_receipt', prefix: 'ER' },
        { type: 'enrollment_number', prefix: 'EN' },
        { type: 'atc_code', prefix: 'ATC' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Prefixes Configuration</h1>
                <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">Configure prefixes for different identifier types</p>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-sm flex gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold">i</span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    <span className="font-bold">Important:</span> All prefixes must be maximum 5 characters long. Generation type is only required for <span className="italic">roll_number</span> type prefixes.
                </p>
            </div>

            <div className="space-y-6">
                {prefixTypes.map((item, idx) => (
                    <div key={idx} className="bg-gray-50/30 border border-gray-100 p-8 rounded-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Type <span className="text-red-500">*</span></label>
                                <Input className="h-10 rounded-sm border-gray-200 text-xs font-bold bg-white text-gray-400" value={item.type} disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Prefix <span className="text-gray-400">(Max 5 characters)</span> <span className="text-red-500">*</span></label>
                                <Input className="h-10 rounded-sm border-gray-200 text-xs font-bold bg-white" defaultValue={item.prefix} />
                                <p className="text-[10px] text-gray-400 font-bold ml-1">{item.prefix.length}/5 characters</p>
                            </div>
                        </div>

                        {item.extra && (
                            <div className="space-y-6 pt-4 border-t border-gray-100">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Generation Type <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-8 pl-1">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="w-4 h-4 rounded-full border border-[#0f172a] flex items-center justify-center p-0.5">
                                                <div className="w-full h-full bg-[#0f172a] rounded-full" />
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-700">Sequential</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="w-4 h-4 rounded-full border border-[#0f172a]" />
                                            <span className="text-[11px] font-bold text-gray-500">Random</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Start With Number <span className="text-gray-400 font-medium">(Max 10 characters - Only last 4 digits editable)</span></label>
                                    <Input className="h-10 rounded-sm border-gray-200 text-xs font-bold bg-white" defaultValue="RN00000001" />
                                    <div className="space-y-1 mt-2 ml-1">
                                        <p className="text-[10px] text-gray-400 font-medium">Format: <span className="font-bold">RN0000XXXX</span> (Only <span className="text-green-500 font-bold">last 4 digits</span> can be changed)</p>
                                        <p className="text-[10px] text-gray-400 font-medium italic">Example: RN00004001</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function MobileAppSettings() {
    const [appType, setAppType] = useState('native');
    const [distribution, setDistribution] = useState('playstore');

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Mobile App Configuration</h1>
                <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">Choose between Progressive Web App or Native Mobile Application</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-sm p-8 space-y-6">
                <h3 className="text-[14px] font-bold text-gray-800 tracking-tight">App Type <span className="text-red-500">*</span></h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PWA Card */}
                    <div
                        onClick={() => setAppType('pwa')}
                        className={cn(
                            "relative p-8 rounded-lg border-2 transition-all duration-300 cursor-pointer group",
                            appType === 'pwa' ? "border-blue-200 bg-blue-50/10" : "border-gray-100 bg-white hover:border-blue-50"
                        )}
                    >
                        <div className={cn(
                            "absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                            appType === 'pwa' ? "bg-blue-600 border-blue-600" : "border-gray-200"
                        )}>
                            {appType === 'pwa' && <Check size={12} className="text-white" />}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mb-6 shadow-blue-200 shadow-lg">
                            <Globe size={18} />
                        </div>
                        <h4 className="text-[17px] font-bold text-gray-800 tracking-tight">Progressive Web App</h4>
                        <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">Modern web app that works across all devices without app store downloads</p>

                        <div className="flex gap-2 mt-6">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-sm uppercase tracking-wider">Cross-Platform</span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[9px] font-bold rounded-sm uppercase tracking-wider">Always Updated</span>
                        </div>
                    </div>

                    {/* Native Card */}
                    <div
                        onClick={() => setAppType('native')}
                        className={cn(
                            "relative p-8 rounded-lg border-2 transition-all duration-300 cursor-pointer group",
                            appType === 'native' ? "border-blue-200 bg-blue-50/10" : "border-gray-100 bg-white hover:border-blue-50"
                        )}
                    >
                        <div className={cn(
                            "absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                            appType === 'native' ? "bg-blue-600 border-blue-600" : "border-gray-200"
                        )}>
                            {appType === 'native' && <Check size={12} className="text-white" />}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white mb-6 shadow-green-200 shadow-lg">
                            <Smartphone size={18} />
                        </div>
                        <h4 className="text-[17px] font-bold text-gray-800 tracking-tight">Native Mobile App</h4>
                        <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">Traditional mobile application distributed via Play Store or direct download</p>

                        <div className="flex gap-2 mt-6">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-[9px] font-bold rounded-sm uppercase tracking-wider">Native Features</span>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[9px] font-bold rounded-sm uppercase tracking-wider">Play Store</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Distribution Section - Only visible for Native App */}
            {appType === 'native' && (
                <div className="animate-in slide-in-from-top-4 duration-500 space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Mobile App Distribution</h1>
                        <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">Choose how users will download your mobile application</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-gray-100 rounded-sm p-8">
                        {/* Play Store Card */}
                        <div
                            onClick={() => setDistribution('playstore')}
                            className={cn(
                                "flex items-start gap-4 p-6 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                distribution === 'playstore' ? "border-orange-200 bg-orange-50/10" : "border-gray-100 hover:border-orange-100"
                            )}
                        >
                            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                <Play size={24} className="fill-orange-500 text-orange-500 ml-1" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-[15px] font-bold text-gray-800">Google Play Store</h4>
                                    {distribution === 'playstore' ? (
                                        <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                                            <Check size={10} className="text-white" />
                                        </div>
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border border-gray-200" />
                                    )}
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Link to Play Store listing</p>
                            </div>
                        </div>

                        {/* Direct APK Card */}
                        <div
                            onClick={() => setDistribution('apk')}
                            className={cn(
                                "flex items-start gap-4 p-6 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                distribution === 'apk' ? "border-blue-200 bg-blue-50/10" : "border-gray-100 hover:border-blue-100"
                            )}
                        >
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                <Download size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-[15px] font-bold text-gray-800">Direct APK Download</h4>
                                    {distribution === 'apk' ? (
                                        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                                            <Check size={10} className="text-white" />
                                        </div>
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border border-gray-200" />
                                    )}
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Upload APK file for direct download</p>
                            </div>
                        </div>
                    </div>

                    {/* Play Store URL Input */}
                    {distribution === 'playstore' && (
                        <div className="bg-white border border-gray-100 rounded-sm p-8 animate-in fade-in duration-300">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest ml-1">Play Store URL <span className="text-red-500">*</span></label>
                            <div className="mt-2 relative">
                                <div className="absolute left-3 top-2.5 text-gray-400">
                                    <Play size={10} className="fill-gray-300 text-gray-300" />
                                </div>
                                <Input className="pl-8 h-10 rounded-sm border-gray-200 text-xs font-medium focus:ring-1 focus:ring-[#0f172a] placeholder:text-gray-300" placeholder="https://play.google.com/store/apps/details?id=your.app" />
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold mt-2 flex items-center gap-1 ml-1">
                                <Info size={12} /> Enter the complete URL to your app on Google Play Store
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


function NumberDisplaySettings({ title }) {
    const options = [
        'Marksheet', 'Admission Form', 'Fee Receipt', 'Certificate', 'ID Card', 'Hall Ticket'
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
                <p className="text-[13px] text-gray-500 mt-1 leading-relaxed whitespace-nowrap">Choose where to display {title.toLowerCase().includes('roll') ? 'roll' : 'enrollment'} numbers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {options.map((option, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-sm bg-gray-50/30 border border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-300 group">
                        <h3 className="text-[13px] font-bold text-gray-700 tracking-tight">{option}</h3>
                        <Switch
                            checked={true}
                            className="data-[state=checked]:bg-[#0f172a]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}






