import React, { useEffect, useState, useRef } from 'react';
import { X, Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BASE_URL } from '@/config';
import axios from 'axios';
import toast from 'react-hot-toast';

const FIXED_ADMISSION_SETTINGS = {
    // Section A
    studentName: { x: 30, y: 23.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    parentName: { x: 48, y: 23.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    surname: { x: 67, y: 23.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    motherName: { x: 88, y: 23.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    mobile: { x: 35, y: 27, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    dob: { x: 74, y: 27.5, fontSize: 52, fontWeight: '800', visible: true, textAlign: 'left', isDate: true },
    maritalSingle: { x: 23.5, y: 31.3, fontSize: 64, fontWeight: '900', visible: true, textAlign: 'center' },
    maritalMarried: { x: 33.5, y: 31.3, fontSize: 64, fontWeight: '900', visible: true, textAlign: 'center' },
    genderMale: { x: 60.5, y: 31.3, fontSize: 64, fontWeight: '900', visible: true, textAlign: 'center' },
    genderFemale: { x: 70.5, y: 31.3, fontSize: 64, fontWeight: '900', visible: true, textAlign: 'center' },
    genderOther: { x: 80.5, y: 31.3, fontSize: 64, fontWeight: '900', visible: true, textAlign: 'center' },
    state: { x: 35, y: 36.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    city: { x: 75, y: 36.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    pincode: { x: 35, y: 40.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    email: { x: 75, y: 40.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    qualification: { x: 35, y: 44.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    cast: { x: 75, y: 44.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    address: { x: 38, y: 49.5, fontSize: 40, fontWeight: '600', visible: true, textAlign: 'left', width: 600 },
    studentPhoto: { x: 90.5, y: 17, width: 90, height: 115, visible: true, type: 'image' },
    studentSignature: { x: 85, y: 53.5, width: 130, height: 50, visible: true, type: 'image' },
    
    // Section B
    courseName: { x: 55, y: 56.5, fontSize: 48, fontWeight: '800', visible: true, textAlign: 'center' },
    admissionDate: { x: 32.5, y: 59, fontSize: 48, fontWeight: '800', visible: true, textAlign: 'left', isDate: true },
    studentId: { x: 62.5, y: 59, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    batch: { x: 85, y: 59, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    
    // Section C
    feeYes: { x: 26, y: 70.3, fontSize: 64, fontWeight: '900', visible: true, textAlign: 'center' },
    feeNo: { x: 33, y: 70.3, fontSize: 64, fontWeight: '900', visible: true, textAlign: 'center' },
    admissionAmount: { x: 60, y: 70.3, fontSize: 48, fontWeight: '700', visible: true, textAlign: 'left' },
    installments: { x: 88, y: 70.3, fontSize: 48, fontWeight: '700', visible: true, textAlign: 'left' },
    courseFee: { x: 20, y: 76.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    gstAmount: { x: 34, y: 76.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    totalAmount: { x: 55, y: 76.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    paidFees: { x: 70, y: 76.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
    balanceFees: { x: 88, y: 76.5, fontSize: 44, fontWeight: '700', visible: true, textAlign: 'left' },
};

export default function AdmissionFormModal({ admission, onClose }) {
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scaleFactor, setScaleFactor] = useState(1);
    const printRef = useRef();
    const imageRef = useRef();

    const handleImageLoad = (e) => {
        const { naturalWidth } = e.target;
        const currentWidth = e.target.offsetWidth;
        if (naturalWidth && currentWidth) {
            setScaleFactor(currentWidth / naturalWidth);
        }
    };

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/background-images`);
                const bgTemplates = response.data;
                
                let admissionTemplate = bgTemplates.find(bg => {
                    const title = bg.title.toLowerCase();
                    return title.includes('admission');
                });

                if (admissionTemplate) {
                    setTemplate(admissionTemplate);
                } else {
                    toast.error("No Admission Form template found.");
                    onClose();
                }
            } catch (error) {
                console.error("Error fetching template", error);
                toast.error("Failed to load Admission Form template.");
                onClose();
            } finally {
                setLoading(false);
            }
        };
        fetchTemplate();
    }, [onClose]);

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=900,height=1200');
        const printWidthMm = 210; // A4 width
        const printWidthPx = printWidthMm * 3.779;
        const printScaleFactor = printWidthPx / (imageRef.current?.naturalWidth || 1000);

        const style = `
            <style>
                @page { size: A4; margin: 0mm; }
                body { margin: 0; display: flex; justify-content: center; background-color: white; font-family: sans-serif; }
                #printable-form { 
                    position: relative; 
                    width: ${printWidthMm}mm; 
                    height: 297mm;
                    --scale-factor: ${printScaleFactor};
                    overflow: hidden;
                }
                #printable-form img.bg-image { width: 100%; height: 100%; display: block; object-fit: fill; }
                .date-box-container { display: flex; gap: calc(3px * var(--scale-factor, 1)); }
                .date-group { 
                    width: calc(65px * var(--scale-factor, 1)); 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-weight: 800;
                    font-size: calc(36px * var(--scale-factor, 1));
                    letter-spacing: calc(15px * var(--scale-factor, 1));
                }
            </style>
        `;
        
        printWindow.document.write('<html><head><title>Admission Form - ' + admission.firstName + '</title>');
        printWindow.document.write(style);
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<div id="printable-form">${printRef.current.innerHTML}</div>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg flex items-center gap-3 shadow-2xl">
                    <Loader2 className="animate-spin text-blue-600" />
                    <span className="font-bold">Loading Admission Form...</span>
                </div>
            </div>
        );
    }

    if (!template) return null;

// Force use of fixed settings for admission form to ensure perfect alignment
const settings = FIXED_ADMISSION_SETTINGS;

const renderDateBoxes = (dateStr, fieldOpts) => {
    if (!dateStr) return null;
    let day = '', month = '', year = '';
    
    const parseDate = (str) => {
        // Try standard parsing first
        let date = new Date(str);
        if (!isNaN(date.getTime())) {
            return {
                d: date.getDate().toString().padStart(2, '0'),
                m: (date.getMonth() + 1).toString().padStart(2, '0'),
                y: date.getFullYear().toString().slice(-2)
            };
        }
        
        // Manual parsing for common formats like DD-MM-YYYY or DD/MM/YYYY
        const parts = str.split(/[-/.]/);
        if (parts.length === 3) {
            // Assume DD-MM-YYYY
            if (parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length >= 2) {
                return {
                    d: parts[0].padStart(2, '0'),
                    m: parts[1].padStart(2, '0'),
                    y: parts[2].slice(-2)
                };
            }
            // Assume YYYY-MM-DD
            if (parts[0].length === 4) {
                return {
                    d: parts[2].padStart(2, '0'),
                    m: parts[1].padStart(2, '0'),
                    y: parts[0].slice(-2)
                };
            }
        }
        return null;
    };

    const result = parseDate(dateStr);
    if (!result) return <span style={{ color: '#000' }}>{dateStr}</span>;

    day = result.d;
    month = result.m;
    year = result.y;

    const digits = [...day.split(''), ...month.split(''), ...year.split('')];
    
    return (
        <div className="date-box-container">
            {digits.map((d, i) => (
                <div key={i} className="date-box" style={{ 
                    marginRight: (i === 1 || i === 3) ? `calc(55px * var(--scale-factor, 1))` : `calc(18px * var(--scale-factor, 1))`
                }}>{d}</div>
            ))}
        </div>
    );
};

    const renderField = (fieldId, value, forcedType = null) => {
        const fieldOpts = settings[fieldId];
        if (!fieldOpts || !fieldOpts.visible) return null;

        const isImage = forcedType === 'image' || fieldOpts.type === 'image';
        const isDate = fieldOpts.isDate;
        const textAlign = fieldOpts.textAlign || 'left';
        const flexAlign = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';

        return (
            <div
                key={fieldId}
                style={{
                    position: 'absolute',
                    left: `${fieldOpts.x}%`,
                    top: `${fieldOpts.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontSize: `calc(${fieldOpts.fontSize || 12}px * var(--scale-factor, 1))`,
                    fontWeight: fieldOpts.fontWeight || '600',
                    width: isImage ? `calc(${fieldOpts.width}px * var(--scale-factor, 1))` : (fieldOpts.width ? `calc(${fieldOpts.width}px * var(--scale-factor, 1))` : 'max-content'),
                    height: isImage ? `calc(${fieldOpts.height}px * var(--scale-factor, 1))` : 'auto',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: flexAlign,
                    textAlign: textAlign,
                    textTransform: fieldOpts.textTransform || 'none',
                    zIndex: 10,
                }}
            >
                {isImage ? (
                    value ? (
                        <img src={value} alt={fieldId} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justify: 'center', fontSize: '10px', color: '#9ca3af', border: '1px dashed #d1d5db' }}>{fieldId}</div>
                    )
                ) : (
                    isDate ? renderDateBoxes(value, fieldOpts) : <span style={{ color: '#000', whiteSpace: 'nowrap' }}>{value}</span>
                )}
            </div>
        );
    };

    const isSingle = (admission.enquiry?.maritalStatus || 'Single') === 'Single';
    const isMale = admission.enquiry?.gender === 'Male';
    const isFemale = admission.enquiry?.gender === 'Female';
    const isOther = admission.enquiry?.gender === 'Other';

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Admission Form Generator</h2>
                        <p className="text-xs text-gray-500 font-medium tracking-wide font-sans">Prefilled and Print Ready (A4)</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white gap-2 font-bold px-6 shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98]">
                            <Printer size={18} /> Print Admission Form
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-red-50 hover:text-red-500 transition-colors">
                            <X size={24} />
                        </Button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center bg-gray-200/50 shadow-inner">
                    <div ref={printRef} className="relative inline-block shadow-2xl bg-white my-auto border-8 border-white" style={{ 
                        width: 'fit-content', 
                        height: 'fit-content',
                        '--scale-factor': scaleFactor
                    }}>
                        <img 
                            ref={imageRef}
                            src={template.imageUrl} 
                            alt="Admission Form Background" 
                            className="bg-image block"
                            onLoad={handleImageLoad}
                            style={{ 
                                width: 'min(900px, 90vw)', 
                                height: 'auto',
                                maxWidth: '100%',
                                objectFit: 'fill'
                            }} 
                        />
                        
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {renderField('studentName', admission.firstName)}
                            {renderField('parentName', admission.enquiry?.parentName || 'N/A')}
                            {renderField('surname', admission.surname)}
                            {renderField('motherName', admission.enquiry?.motherName || 'N/A')}
                            {renderField('mobile', admission.mobile)}
                            {renderField('dob', admission.enquiry?.dob)}
                            
                            {renderField('maritalSingle', isSingle ? '✓' : '')}
                            {renderField('maritalMarried', !isSingle ? '✓' : '')}
                            {renderField('genderMale', isMale ? '✓' : '')}
                            {renderField('genderFemale', isFemale ? '✓' : '')}
                            {renderField('genderOther', isOther ? '✓' : '')}
                            
                            {renderField('state', admission.enquiry?.state)}
                            {renderField('city', admission.enquiry?.city)}
                            {renderField('pincode', admission.enquiry?.pincode)}
                            {renderField('email', admission.enquiry?.email)}
                            {renderField('qualification', admission.enquiry?.qualification)}
                            {renderField('cast', admission.enquiry?.cast)}
                            {renderField('address', admission.enquiry?.permanentAddress || admission.enquiry?.fullAddress)}
                            
                            {renderField('studentPhoto', admission.profileImage || admission.studentPhoto, 'image')}
                            {renderField('studentSignature', admission.signatureImage, 'image')}
                            
                            {/* Section B */}
                            {renderField('courseName', admission.courseName)}
                            {renderField('admissionDate', admission.admissionDate)}
                            {renderField('studentId', admission.studentId || admission.rollNumber)}
                            {renderField('batch', admission.batchName)}
                            
                            {/* Section C */}
                            {renderField('feeYes', admission.admissionFee > 0 ? '✓' : '')}
                            {renderField('feeNo', admission.admissionFee <= 0 ? '✓' : '')}
                            {renderField('admissionAmount', admission.admissionFee)}
                            {renderField('installments', 1)}
                            {renderField('courseFee', admission.courseFee)}
                            {renderField('gstAmount', admission.gstAmount || 0)}
                            {renderField('totalAmount', admission.finalAmount || admission.courseFee)}
                            {renderField('paidFees', admission.paidFees || admission.admissionFee)}
                            {renderField('balanceFees', (admission.finalAmount || admission.courseFee) - (admission.paidFees || admission.admissionFee))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
