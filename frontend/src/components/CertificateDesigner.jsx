import React, { useState, useRef, useEffect } from 'react';
import { Save, RefreshCw, X, Type, Image as ImageIcon, QrCode, ArrowLeft, ChevronDown, AlignLeft, AlignCenter, AlignRight, Bold, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '@/config';

const CERTIFICATE_FIELDS = [
    { id: 'certificateNumber', label: 'Certificate Number', type: 'text', defaultText: 'TNCDC/2024/001' },
    { id: 'dateOfIssue', label: 'Date of Issue', type: 'text', defaultText: '15-Aug-2024' },
    { id: 'studentName', label: 'Student Name', type: 'text', defaultText: 'JOHN DOE' },
    { id: 'courseName', label: 'Course Name', type: 'text', defaultText: 'DIPLOMA IN WEB DEVELOPMENT' },
    { id: 'courseDuration', label: 'Course Duration', type: 'text', defaultText: '6 MONTHS' },
    { id: 'coursePeriod', label: 'Course Period', type: 'text', defaultText: 'JAN 2024 - JUN 2024' },
    { id: 'rollNumber', label: 'Roll Number', type: 'text', defaultText: 'ROLL-12345' },
    { id: 'enrollmentNumber', label: 'Enrollment Number', type: 'text', defaultText: 'ENR-98765' },
    { id: 'gradePercentage', label: 'Grade & Percentage', type: 'text', defaultText: 'A+ (95%)' },
    { id: 'atcName', label: 'ATC (Institute Name)', type: 'text', defaultText: 'Tech Academy' },
    { id: 'qrCode', label: 'QR Code', type: 'image', defaultText: 'QR' },
    { id: 'studentPhoto', label: 'Student Photo', type: 'image', defaultText: 'Photo' },
    { id: 'studentSignature', label: 'Student Signature', type: 'image', defaultText: 'Student Sig' },
    { id: 'controllerSignature', label: 'Controller Signature', type: 'image', defaultText: 'Controller Sig' },
    { id: 'ownerSignature', label: 'Owner Signature', type: 'image', defaultText: 'Owner Sig' }
];

const IDCARD_FIELDS = [
    { id: 'studentPhoto', label: 'Student Photo', type: 'image', defaultText: 'Photo', description: 'Student profile image' },
    { id: 'qrCode', label: 'QR Code', type: 'image', defaultText: 'QR', description: 'Generated QR code' },
    { id: 'courseNameLabel', label: 'Course Name Label', type: 'text', defaultText: 'Course Name', description: 'Course Name label' },
    { id: 'courseName', label: 'Course Name', type: 'text', defaultText: 'DIPLOMA IN WEB DEVELOPMENT', description: 'Course or class name' },
    { id: 'firstNameLabel', label: 'First Name Label', type: 'text', defaultText: 'First Name', description: 'First Name label' },
    { id: 'firstName', label: 'First Name', type: 'text', defaultText: ': John', description: 'Student first name' },
    { id: 'fatherNameLabel', label: 'Father Name Label', type: 'text', defaultText: 'Father Name', description: 'Father Name label' },
    { id: 'fatherName', label: 'Father Name', type: 'text', defaultText: ': Kumar', description: 'Father/Middle name' },
    { id: 'surnameLabel', label: 'Surname Label', type: 'text', defaultText: 'Surname', description: 'Surname label' },
    { id: 'surname', label: 'Surname', type: 'text', defaultText: ': Sharma', description: 'Student surname' },
    { id: 'dobLabel', label: 'Date of Birth Label', type: 'text', defaultText: 'Date of Birth', description: 'Date of Birth label' },
    { id: 'dob', label: 'Date of Birth', type: 'text', defaultText: ': 01-01-2000', description: 'Student DOB' },
    { id: 'batchNameLabel', label: 'Batch Name Label', type: 'text', defaultText: 'Batch Name', description: 'Batch Name label' },
    { id: 'batchName', label: 'Batch Name', type: 'text', defaultText: ': Morning Batch', description: 'Batch or timing' },
    { id: 'rollNumberLabel', label: 'Roll Number Label', type: 'text', defaultText: 'Roll Number', description: 'Roll Number label' },
    { id: 'rollNumber', label: 'Roll Number', type: 'text', defaultText: ': 12345', description: 'Student roll number' },
    { id: 'enrollmentNumberLabel', label: 'Enrollment No. Label', type: 'text', defaultText: 'Enrollment No.', description: 'Enrollment No. label' },
    { id: 'enrollmentNumber', label: 'Enrollment Number', type: 'text', defaultText: ': ENR2024001', description: 'Enrollment identifier' },
    { id: 'mobileNumberLabel', label: 'Mobile Number Label', type: 'text', defaultText: 'Mobile Number', description: 'Mobile Number label' },
    { id: 'mobileNumber', label: 'Mobile Number', type: 'text', defaultText: ': 9876543210', description: 'Contact number' },
    { id: 'referralCodeLabel', label: 'Referral Code Label', type: 'text', defaultText: 'Referral Code', description: 'Referral Code label' },
    { id: 'referralCode', label: 'Referral Code', type: 'text', defaultText: ': REF123', description: 'Referral code' },
    { id: 'ownerSignature', label: 'Owner Signature', type: 'image', defaultText: 'Owner Sig', description: 'Authorized signature' },
    { id: 'ownerName', label: 'Owner Name', type: 'text', defaultText: 'Owner Name', description: 'Owner or Director name' },
    { id: 'ownerDesignation', label: 'Owner Designation', type: 'text', defaultText: 'Owner Designation', description: 'Designation' }
];

const ADMISSION_FIELDS = [
    { id: 'studentName', label: 'Student Name', type: 'text', defaultText: 'JOHN DOE' },
    { id: 'parentName', label: 'Father/Husband Name', type: 'text', defaultText: 'KUMAR' },
    { id: 'surname', label: 'Surname', type: 'text', defaultText: 'DOE' },
    { id: 'motherName', label: 'Mother Name', type: 'text', defaultText: 'JANE DOE' },
    { id: 'mobile', label: 'Student Mobile', type: 'text', defaultText: '9876543210' },
    { id: 'dob', label: 'Date of Birth', type: 'text', defaultText: '01/01/2000' },
    { id: 'state', label: 'State', type: 'text', defaultText: 'Tamil Nadu' },
    { id: 'city', label: 'City', type: 'text', defaultText: 'Chennai' },
    { id: 'pincode', label: 'PIN Code', type: 'text', defaultText: '600001' },
    { id: 'email', label: 'Email', type: 'text', defaultText: 'test@test.com' },
    { id: 'qualification', label: 'Qualification', type: 'text', defaultText: 'B.E.' },
    { id: 'cast', label: 'Cast', type: 'text', defaultText: 'General' },
    { id: 'address', label: 'Address', type: 'text', defaultText: '123 Street, Area' },
    { id: 'courseName', label: 'Course Name', type: 'text', defaultText: 'DIPLOMA IN IT' },
    { id: 'admissionDate', label: 'Admission Date', type: 'text', defaultText: '15/08/2024' },
    { id: 'studentId', label: 'Roll Number', type: 'text', defaultText: 'STU001' },
    { id: 'batch', label: 'Batch Time', type: 'text', defaultText: 'Morning' },
    { id: 'admissionFee', label: 'Admission Fee', type: 'text', defaultText: '1000' },
    { id: 'courseFee', label: 'Course Fee', type: 'text', defaultText: '5000' },
    { id: 'gstAmount', label: 'GST Amount', type: 'text', defaultText: '900' },
    { id: 'finalAmount', label: 'Total Amount', type: 'text', defaultText: '5900' },
    { id: 'paidFees', label: 'Paid Fees', type: 'text', defaultText: '1000' },
    { id: 'balanceFees', label: 'Balance Fees', type: 'text', defaultText: '4900' },
    { id: 'maritalSingle', label: 'Marital: Single (Check)', type: 'text', defaultText: '✓' },
    { id: 'maritalMarried', label: 'Marital: Married (Check)', type: 'text', defaultText: '✓' },
    { id: 'genderMale', label: 'Gender: Male (Check)', type: 'text', defaultText: '✓' },
    { id: 'genderFemale', label: 'Gender: Female (Check)', type: 'text', defaultText: '✓' },
    { id: 'genderOther', label: 'Gender: Other (Check)', type: 'text', defaultText: '✓' },
    { id: 'studentPhoto', label: 'Student Photo', type: 'image', defaultText: 'Photo' },
    { id: 'studentSignature', label: 'Student Signature', type: 'image', defaultText: 'Sig' }
];

const PERFORMANCE_CARD_FIELDS = [
    { id: 'studentName', label: 'Student Name', type: 'text', defaultText: 'JOHN DOE' },
    { id: 'gradePercentage', label: 'Grade', type: 'text', defaultText: 'A' },
    { id: 'percentage', label: 'Percentage', type: 'text', defaultText: '95%' },
    { id: 'courseName', label: 'Course Name', type: 'text', defaultText: 'JAVA FULL STACK' },
    { id: 'certificateNumber', label: 'Certificate No.', type: 'text', defaultText: 'TNCDC-001' },
    { id: 'rollNumber', label: 'Roll Number', type: 'text', defaultText: 'STU-019089' },
    { id: 'atcName', label: 'Institute Name', type: 'text', defaultText: 'Tamil Nadu CDC' },
    { id: 'studentPhoto', label: 'Student Photo', type: 'image', defaultText: 'Photo' },
    { id: 'qrCode', label: 'QR Code', type: 'image', defaultText: 'QR' }
];

export default function CertificateDesigner({ template, onClose, onSaveSuccess }) {
    const titleLower = template?.title?.toLowerCase() || '';
    const isIdCard = titleLower.includes('id') && titleLower.includes('card');
    const isAdmission = titleLower.includes('admission');
    const isPerformanceCard = titleLower.includes('performance') || titleLower.includes('mark') || (titleLower.includes('card') && !isIdCard);
    
    let AVAILABLE_FIELDS = CERTIFICATE_FIELDS;
    if (isAdmission) AVAILABLE_FIELDS = ADMISSION_FIELDS;
    else if (isIdCard) AVAILABLE_FIELDS = IDCARD_FIELDS;
    else if (isPerformanceCard) AVAILABLE_FIELDS = PERFORMANCE_CARD_FIELDS;
    const [fields, setFields] = useState({});
    const [saving, setSaving] = useState(false);
    const containerRef = useRef(null);
    const [draggingField, setDraggingField] = useState(null);
    const [selectedFieldId, setSelectedFieldId] = useState(null);

    useEffect(() => {
        if (!template?.id) return;
        
        // Initialize fields from template.designSettings or defaults
        let initialSettings = {};
        try {
            initialSettings = typeof template.designSettings === 'string' 
                ? JSON.parse(template.designSettings) 
                : (template.designSettings || {});
        } catch (e) {
            console.error("Error parsing design settings", e);
        }

        const newFields = {};
        
        AVAILABLE_FIELDS.forEach((f, index) => {
            if (initialSettings[f.id]) {
                newFields[f.id] = initialSettings[f.id];
            } else {
                newFields[f.id] = {
                    visible: false,
                    x: 20 + Math.floor(index / 10) * 30,
                    y: 10 + ((index % 10) * 8),
                    width: f.id === 'studentPhoto' ? 100 : f.type === 'image' ? 80 : 200,
                    height: f.id === 'studentPhoto' ? 120 : f.type === 'image' ? 80 : 30,
                    fontSize: 80,
                    fontWeight: f.id.toLowerCase().includes('name') || f.id.toLowerCase().includes('course') ? 'bold' : 'normal',
                    textAlign: 'left',
                    textTransform: 'none'
                };
            }
        });
        setFields(newFields);
    }, [template.id]); // ONLY re-initialize if the template ID changes

    const handleToggleField = (id, isVisible) => {
        setFields(prev => {
            const current = prev[id] || { 
                visible: false, x: 50, y: 50, fontSize: 24, fontWeight: 'normal', textAlign: 'left', textTransform: 'none',
                width: 100, height: 100 
            };
            return {
                ...prev,
                [id]: {
                    ...current,
                    visible: isVisible
                }
            };
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await axios.put(`${BASE_URL}/api/background-images/${template.id}`, {
                title: template.title,
                type: template.type,
                imageUrl: template.imageUrl,
                designSettings: fields
            });
            toast.success('Design saved successfully');
            if (onSaveSuccess) onSaveSuccess(response.data);
            onClose();
        } catch (error) {
            console.error('Error saving design:', error);
            toast.error('Failed to save design');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all fields to their default non-visible state?')) {
            const newFields = {};
            AVAILABLE_FIELDS.forEach((f, index) => {
                newFields[f.id] = {
                    visible: false,
                    x: 20 + Math.floor(index / 10) * 30,
                    y: 10 + ((index % 10) * 8),
                    width: f.id === 'studentPhoto' ? 100 : f.type === 'image' ? 80 : 200,
                    height: f.id === 'studentPhoto' ? 120 : f.type === 'image' ? 80 : 30,
                    fontSize: 16,
                    fontWeight: f.id === 'studentName' || f.id === 'courseName' ? 'bold' : 'normal',
                    textAlign: 'left',
                    textTransform: 'none'
                };
            });
            setFields(newFields);
        }
    };

    // Dragging Logic
    const handleDragStart = (e, id) => {
        if (e.type === 'mousedown') {
            e.preventDefault();
        }
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (!containerRef.current || !clientX) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        
        setDraggingField({
            id,
            startX: clientX,
            startY: clientY,
            initialX: fields[id].x,
            initialY: fields[id].y
        });
    };

    const handleDragMove = (e) => {
        if (!draggingField || !containerRef.current) return;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (!clientX) return;

        const rect = containerRef.current.getBoundingClientRect();
        
        const deltaX = ((clientX - draggingField.startX) / rect.width) * 100;
        const deltaY = ((clientY - draggingField.startY) / rect.height) * 100;

        let newX = draggingField.initialX + deltaX;
        let newY = draggingField.initialY + deltaY;

        // Keep within bounds
        newX = Math.max(0, Math.min(newX, 100));
        newY = Math.max(0, Math.min(newY, 100));

        setFields(prev => ({
            ...prev,
            [draggingField.id]: {
                ...prev[draggingField.id],
                x: newX,
                y: newY
            }
        }));
    };

    const handleDragEnd = () => {
        setDraggingField(null);
    };

    useEffect(() => {
        if (draggingField) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
        } else {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [draggingField]);

    const isLandscape = template.type === 'LANDSCAPE';

    return (
        <div className="fixed inset-0 z-[100] bg-gray-100 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-16 bg-[#3b5998] text-white flex items-center justify-between px-6 shadow-md transition-colors">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-2xl">🪄</span> Certificate Designer
                    </h1>
                    <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl">
                        <button 
                            onClick={() => {
                                template.type = 'PORTRAIT';
                                setFields({...fields}); // trigger re-render
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${template.type === 'PORTRAIT' ? 'bg-white text-[#3b5998]' : 'text-white'}`}
                        >
                            PORTRAIT
                        </button>
                        <button 
                            onClick={() => {
                                template.type = 'LANDSCAPE';
                                setFields({...fields}); // trigger re-render
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${template.type === 'LANDSCAPE' ? 'bg-white text-[#3b5998]' : 'text-white'}`}
                        >
                            LANDSCAPE
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={handleReset} variant="ghost" className="text-white hover:bg-white/10 hidden sm:flex">
                        <RefreshCw className="w-4 h-4 mr-2" /> Reset
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-white text-[#3b5998] hover:bg-gray-100 font-bold">
                        {saving ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Save All
                    </Button>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Preview Panel */}
                <div className="flex-1 bg-gray-200/80 p-6 overflow-auto flex items-center justify-center relative shadow-inner">
                    <div className="relative inline-block shadow-2xl max-w-full max-h-[85vh] overflow-hidden">
                        {template.imageUrl ? (
                            <img 
                                src={template.imageUrl} 
                                alt="Certificate Template" 
                                className="w-auto h-auto max-w-[1000px] max-h-[85vh] object-contain block select-none pointer-events-none" 
                            />
                        ) : (
                            <div className="w-[800px] h-[600px] bg-white flex items-center justify-center text-gray-400 border border-gray-200">
                                No Background Image Set
                            </div>
                        )}
                        
                        <div 
                            ref={containerRef}
                            className="absolute inset-0"
                        >

                        {/* Rendering Draggable Fields */}
                        {AVAILABLE_FIELDS.map(f => {
                            const fieldState = fields[f.id];
                            if (!fieldState?.visible) return null;

                            return (
                                <div
                                    key={f.id}
                                    onMouseDown={(e) => handleDragStart(e, f.id)}
                                    onTouchStart={(e) => handleDragStart(e, f.id)}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move select-none"
                                    style={{
                                        left: `${fieldState.x}%`,
                                        top: `${fieldState.y}%`,
                                        fontSize: `${fieldState.fontSize}px`,
                                        fontWeight: fieldState.fontWeight,
                                        width: f.type === 'image' ? `${fieldState.width}px` : 'auto',
                                        height: f.type === 'image' ? `${fieldState.height}px` : 'auto',
                                        zIndex: draggingField?.id === f.id ? 50 : 10,
                                        padding: '4px 8px',
                                        backgroundColor: draggingField?.id === f.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                        outline: selectedFieldId === f.id ? '2px solid #3b82f6' : 'none',
                                        outlineOffset: '2px'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedFieldId(f.id);
                                    }}
                                >
                                    <div 
                                        className={`hover:border-blue-400 hover:bg-blue-50/50 transition-colors border border-dashed p-1 whitespace-nowrap ${
                                            selectedFieldId === f.id ? 'border-blue-500 bg-blue-50/30' : 'border-transparent'
                                        }`}
                                        style={{ 
                                            textAlign: fieldState.textAlign || 'left',
                                            textTransform: fieldState.textTransform || 'none'
                                        }}
                                    >
                                        {f.type === 'text' ? (
                                            <span className="text-gray-800 drop-shadow-sm">{f.defaultText}</span>
                                        ) : (
                                            <div className="w-full h-full bg-gray-200/80 border-2 border-gray-400 border-dashed flex flex-col items-center justify-center text-gray-500 rounded p-1 text-center">
                                                {f.id === 'qrCode' ? <QrCode size={16} className="mb-1" /> : <ImageIcon size={16} className="mb-1" />}
                                                <span className="text-[10px] font-semibold leading-tight">{f.label}</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Tooltip for the field name */}
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                                        {f.label}
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-xl z-10 overflow-hidden">
                    {!selectedFieldId ? (
                        <>
                            <div className="p-4 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-2 mb-1">
                                    <Type className="w-4 h-4 text-gray-400" />
                                    <h2 className="font-bold text-gray-800">Available Fields</h2>
                                </div>
                                <p className="text-xs text-gray-500">Enable fields and drag them on the preview to set their positions.</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {AVAILABLE_FIELDS.map(f => {
                                    const fieldState = fields[f.id] || { visible: false };
                                    const isVisible = fieldState.visible;
                                    const isSelected = selectedFieldId === f.id;
                                    
                                    return (
                                        <div 
                                            key={f.id} 
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all gap-3 shadow-sm ${
                                                isVisible 
                                                    ? 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-400 cursor-pointer' 
                                                    : 'border-gray-100 bg-gray-50/50 opacity-60'
                                            } ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
                                            onClick={() => {
                                                if (isVisible) setSelectedFieldId(f.id);
                                            }}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden flex-1">
                                                <div className={`p-2 rounded-lg shrink-0 ${isVisible ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                                                    {f.type === 'text' ? <Type size={16} /> : f.id === 'qrCode' ? <QrCode size={16} /> : <ImageIcon size={16} />}
                                                </div>
                                                <div className="flex flex-col min-w-0 pr-2">
                                                    <span className="text-sm font-bold text-gray-700 truncate">{f.label}</span>
                                                    <span className="text-[10px] text-gray-400 truncate">{isVisible ? (isSelected ? 'Currently editing' : 'Click to edit') : 'Inactive'}</span>
                                                </div>
                                            </div>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Switch 
                                                    checked={isVisible}
                                                    onCheckedChange={(checked) => {
                                                        handleToggleField(f.id, checked);
                                                        // Removed auto-selection and auto-deselection from here
                                                    }}
                                                    className="data-[state=checked]:bg-emerald-500"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                <button 
                                    onClick={() => setSelectedFieldId(null)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Editing Field</span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                {/* Field Header */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                                            {AVAILABLE_FIELDS.find(f => f.id === selectedFieldId)?.type === 'text' ? <Type size={20} /> : <ImageIcon size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{AVAILABLE_FIELDS.find(f => f.id === selectedFieldId)?.label}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Switch 
                                                    checked={fields[selectedFieldId]?.visible}
                                                    onCheckedChange={(checked) => handleToggleField(selectedFieldId, checked)}
                                                    className="scale-75 data-[state=checked]:bg-emerald-500"
                                                />
                                                <span className="text-xs text-gray-500 font-medium">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Position Section */}
                                <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Move size={12} /> Position
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-gray-500 ml-1">Top (%)</label>
                                            <input 
                                                type="number"
                                                step="0.1"
                                                value={fields[selectedFieldId]?.y.toFixed(2)}
                                                onChange={(e) => setFields(prev => ({
                                                    ...prev,
                                                    [selectedFieldId]: { ...prev[selectedFieldId], y: parseFloat(e.target.value) || 0 }
                                                }))}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-gray-500 ml-1">Left (%)</label>
                                            <input 
                                                type="number"
                                                step="0.1"
                                                value={fields[selectedFieldId]?.x.toFixed(2)}
                                                onChange={(e) => setFields(prev => ({
                                                    ...prev,
                                                    [selectedFieldId]: { ...prev[selectedFieldId], x: parseFloat(e.target.value) || 0 }
                                                }))}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setFields(prev => ({
                                            ...prev,
                                            [selectedFieldId]: { ...prev[selectedFieldId], x: 50 }
                                        }))}
                                        className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                                    >
                                        <RefreshCw size={12} className="mr-2" /> Center Horizontally
                                    </Button>
                                </div>

                                {/* Style Section */}
                                <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Type size={12} /> {AVAILABLE_FIELDS.find(f => f.id === selectedFieldId)?.type === 'text' ? 'Text Style' : 'Dimensions'}
                                    </h4>
                                    
                                    {AVAILABLE_FIELDS.find(f => f.id === selectedFieldId)?.type === 'text' ? (
                                        <>
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-gray-500 ml-1">Font Size (px)</label>
                                                <input 
                                                    type="number"
                                                    value={fields[selectedFieldId]?.fontSize}
                                                    onChange={(e) => setFields(prev => ({
                                                        ...prev,
                                                        [selectedFieldId]: { ...prev[selectedFieldId], fontSize: parseInt(e.target.value) || 12 }
                                                    }))}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-gray-500 ml-1">Weight</label>
                                                <select 
                                                    value={fields[selectedFieldId]?.fontWeight}
                                                    onChange={(e) => setFields(prev => ({
                                                        ...prev,
                                                        [selectedFieldId]: { ...prev[selectedFieldId], fontWeight: e.target.value }
                                                    }))}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="normal">Normal</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="semibold">Semibold</option>
                                                    <option value="bold">Bold</option>
                                                    <option value="black">Extra Bold</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-gray-500 ml-1">Transform</label>
                                                <select 
                                                    value={fields[selectedFieldId]?.textTransform || 'none'}
                                                    onChange={(e) => setFields(prev => ({
                                                        ...prev,
                                                        [selectedFieldId]: { ...prev[selectedFieldId], textTransform: e.target.value }
                                                    }))}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="none">None</option>
                                                    <option value="uppercase">UPPERCASE</option>
                                                    <option value="lowercase">lowercase</option>
                                                    <option value="capitalize">Capitalize</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-gray-500 ml-1">Align</label>
                                                <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                                                    {[
                                                        { id: 'left', icon: <AlignLeft size={14} /> },
                                                        { id: 'center', icon: <AlignCenter size={14} /> },
                                                        { id: 'right', icon: <AlignRight size={14} /> }
                                                    ].map(align => (
                                                        <button
                                                            key={align.id}
                                                            onClick={() => setFields(prev => ({
                                                                ...prev,
                                                                [selectedFieldId]: { ...prev[selectedFieldId], textAlign: align.id }
                                                            }))}
                                                            className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all ${
                                                                fields[selectedFieldId]?.textAlign === align.id 
                                                                    ? 'bg-blue-100 text-blue-600 shadow-sm' 
                                                                    : 'text-gray-400 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {align.icon}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-gray-500 ml-1">Width (px)</label>
                                                <input 
                                                    type="number"
                                                    value={fields[selectedFieldId]?.width}
                                                    onChange={(e) => setFields(prev => ({
                                                        ...prev,
                                                        [selectedFieldId]: { ...prev[selectedFieldId], width: parseInt(e.target.value) || 50 }
                                                    }))}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-gray-500 ml-1">Height (px)</label>
                                                <input 
                                                    type="number"
                                                    value={fields[selectedFieldId]?.height}
                                                    onChange={(e) => setFields(prev => ({
                                                        ...prev,
                                                        [selectedFieldId]: { ...prev[selectedFieldId], height: parseInt(e.target.value) || 50 }
                                                    }))}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
