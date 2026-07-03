import React, { useEffect, useState, useRef } from 'react';
import { X, Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BASE_URL } from '@/config';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function StaffIDCardPreviewModal({ staff, onClose }) {
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
        // Fetch ID Card Template
        const fetchTemplate = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/background-images`);
                const bgTemplates = response.data;
                
                // Find explicitly named staff ID card templates first
                let idCardTemplate = bgTemplates.find(bg => {
                    const title = bg.title.toLowerCase();
                    return title.includes('staff id') || title.includes('staffid');
                });

                // Fallback to standard ID card
                if (!idCardTemplate) {
                    idCardTemplate = bgTemplates.find(bg => {
                        const title = bg.title.toLowerCase();
                        return title.includes('id card') || title.includes('idcard') || title.includes('identity');
                    });
                }

                // Fallback to the first PORTRAIT template
                if (!idCardTemplate) {
                    idCardTemplate = bgTemplates.find(bg => bg.type === 'PORTRAIT' && !bg.title.toLowerCase().includes('cert'));
                }
                
                if (idCardTemplate) {
                    setTemplate(idCardTemplate);
                } else {
                    toast.error("No ID Card template found. Please create one in settings.");
                    onClose();
                }
            } catch (error) {
                console.error("Error fetching template", error);
                toast.error("Failed to load ID card template.");
                onClose();
            } finally {
                setLoading(false);
            }
        };
        fetchTemplate();
    }, [onClose]);

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=800,height=600');
        const printWidthMm = template.type === 'LANDSCAPE' ? 86 : 54;
        const printWidthPx = printWidthMm * 3.779;
        const printScaleFactor = printWidthPx / (imageRef.current?.naturalWidth || 1000);

        const style = `
            <style>
                @page { size: auto; margin: 0mm; }
                body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: white; font-family: sans-serif; }
                #printable-id-card { 
                    position: relative; 
                    width: ${printWidthMm}mm; 
                    height: auto; 
                    --scale-factor: ${printScaleFactor};
                    overflow: hidden;
                }
                #printable-id-card img.bg-image { width: 100%; height: auto; display: block; }
            </style>
        `;
        
        printWindow.document.write('<html><head><title>Print Staff ID Card</title>');
        printWindow.document.write(style);
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<div id="printable-id-card">${printRef.current.innerHTML}</div>`);
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
                <div className="bg-white p-6 rounded-lg flex items-center gap-3">
                    <Loader2 className="animate-spin text-blue-600" />
                    <span>Loading Staff ID Card Template...</span>
                </div>
            </div>
        );
    }

    if (!template) return null;

    const settings = template.designSettings || {};

    const renderField = (fieldId, value, isImage = false) => {
        const fieldOpts = settings[fieldId];
        if (!fieldOpts || !fieldOpts.visible) return null;

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
                    fontSize: `calc(${fieldOpts.fontSize}px * var(--scale-factor, 1))`,
                    fontWeight: fieldOpts.fontWeight,
                    width: isImage ? `calc(${fieldOpts.width}px * var(--scale-factor, 1))` : 'max-content',
                    height: isImage ? `calc(${fieldOpts.height}px * var(--scale-factor, 1))` : 'auto',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: flexAlign,
                    textAlign: textAlign,
                    textTransform: fieldOpts.textTransform || 'none',
                }}
            >
                {isImage ? (
                    value ? (
                        <img src={value} alt={fieldId} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6b7280' }}>Photo</div>
                    )
                ) : (
                    <span style={{ color: '#000', whiteSpace: 'nowrap' }}>{value}</span>
                )}
            </div>
        );
    };

    // Mapping Staff Data to Template Fields
    // We try to reuse existing field IDs from the designer for maximum compatibility
    return (
        <div className="fixed inset-0 z-[100] bg-black/60 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-bold">Preview Staff ID Card</h2>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                            <Printer size={16} /> Print ID Card
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={20} />
                        </Button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center bg-gray-100">
                    <div ref={printRef} className="relative inline-block shadow-lg bg-white my-auto" style={{ 
                        width: 'fit-content', 
                        height: 'fit-content',
                        '--scale-factor': scaleFactor
                    }}>
                        <img 
                            ref={imageRef}
                            src={template.imageUrl} 
                            alt="ID Card Background" 
                            className="bg-image block"
                            onLoad={handleImageLoad}
                            style={{ 
                                width: template.type === 'LANDSCAPE' ? 'min(1000px, 95vw)' : 'min(600px, 90vw)', 
                                height: 'auto',
                                maxWidth: '100%',
                                objectFit: 'contain'
                            }} 
                        />
                        
                        <div className="absolute inset-0">
                            {/* Labels - can be static if the user didn't define them */}
                            {renderField('courseNameLabel', 'Designation')}
                            {renderField('firstNameLabel', 'Staff Name')}
                            {renderField('fatherNameLabel', 'Department')}
                            {renderField('dobLabel', 'DOB')}
                            {renderField('enrollmentNumberLabel', 'Employee ID')}
                            {renderField('mobileNumberLabel', 'Mobile No')}

                            {/* Staff Values mapped to existing student field slots if necessary */}
                            {renderField('courseName', staff.designation || 'Staff')}
                            {renderField('firstName', `: ${staff.fullName}`)}
                            {renderField('fatherName', `: ${staff.department || 'N/A'}`)}
                            {renderField('dob', `: ${staff.dateOfBirth || 'N/A'}`)}
                            {renderField('enrollmentNumber', `: ${staff.employeeId || 'N/A'}`)}
                            {renderField('mobileNumber', `: ${staff.mobile || 'N/A'}`)}

                            {/* Profile Photo */}
                            {renderField('studentPhoto', staff.profilePhoto, true)}
                            {renderField('qrCode', "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + (staff.employeeId || staff.id), true)}
                        </div>
                    </div>
                </div>
                
                <div className="p-4 bg-yellow-50 border-t flex items-center gap-3">
                    <div className="bg-yellow-100 p-2 rounded-full text-yellow-700">
                        <X size={16} className="rotate-45" />
                    </div>
                    <p className="text-[11px] text-yellow-800 font-medium">
                        <strong>Note:</strong> Staff ID cards use the "Staff ID" or "ID Card" template from Background Settings. Ensure you have designed at least one ID card template.
                    </p>
                </div>
            </div>
        </div>
    );
}
