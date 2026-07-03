import React, { useState, useRef, useEffect } from 'react';
import { Camera, QrCode, Scan, Info, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AttendanceQRPage() {
    const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'usb'
    const videoRef = useRef(null);
    const [hasCamera, setHasCamera] = useState(false);

    useEffect(() => {
        let stream = null;

        const startCamera = async () => {
            if (scanMode === 'camera') {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'environment' }
                    });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        setHasCamera(true);
                    }
                } catch (err) {
                    console.error("Camera access error:", err);
                    setHasCamera(false);
                }
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [scanMode]);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[#f8fbff] py-10 px-4 font-sans">
            {/* Header Section */}
            <div className="flex flex-col items-center mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="w-16 h-16 bg-[#ebf2ff] rounded-2xl flex items-center justify-center text-[#5c7cff] shadow-sm mb-4">
                    <QrCode size={32} />
                </div>
                <h1 className="text-3xl font-bold text-[#1e293b] mb-1">Student Attendance</h1>
                <p className="text-sm text-[#64748b] font-medium tracking-tight">Scan QR code to mark attendance</p>
            </div>

            {/* Mode Switcher */}
            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-[#e2e8f0] flex gap-1 mb-10 animate-in fade-in duration-500 delay-200">
                <button
                    onClick={() => setScanMode('camera')}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${scanMode === 'camera'
                        ? "bg-[#5c7cff] text-white shadow-lg shadow-blue-200"
                        : "text-[#64748b] hover:bg-gray-50"
                        }`}
                >
                    <Camera size={18} />
                    Camera
                </button>
                <button
                    onClick={() => setScanMode('usb')}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${scanMode === 'usb'
                        ? "bg-[#5c7cff] text-white shadow-lg shadow-blue-200"
                        : "text-[#64748b] hover:bg-gray-50"
                        }`}
                >
                    <Zap size={18} />
                    USB Scanner
                </button>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-2xl animate-in zoom-in duration-700 delay-300">
                {scanMode === 'camera' ? (
                    <div className="relative group">
                        {/* Camera Container */}
                        <div className="aspect-square bg-[#0f172a] rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white relative">
                            {/* Live Video */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover opacity-60 grayscale-[0.2]"
                            />

                            {/* Scanning Mask */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 relative">
                                    {/* Corner Borders */}
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>

                                    {/* Central Indicator */}
                                    <div className="absolute inset-0 border border-white/20 rounded-xl"></div>

                                    {/* Scanning Animation Line */}
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-line shadow-[0_0_15px_rgba(96,165,250,0.8)]"></div>
                                </div>
                            </div>

                            {/* Camera Status Overlay */}
                            {!hasCamera && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center bg-[#0f172a]/80 backdrop-blur-sm">
                                    <AlertCircle size={48} className="text-red-400 mb-4" />
                                    <p className="font-bold text-lg">Camera Access Denied</p>
                                    <p className="text-sm text-gray-400 mt-2">Please enable camera permissions to use this feature</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-[2.5rem] p-10 shadow-2xl text-white relative overflow-hidden group">
                        {/* Background Circles */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30 animate-pulse">
                                <Zap size={40} className="fill-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">USB Scanner Ready</h2>
                            <p className="text-white/80 text-sm mb-8 font-medium italic">Scan QR code with your USB barcode scanner</p>

                            <div className="w-full relative max-w-md">
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Waiting for scan..."
                                    className="w-full h-14 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl px-6 text-xl tracking-widest text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-all"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-8 bg-green-400 rounded-full animate-blink"></div>
                            </div>

                            <div className="mt-10 flex items-center justify-between w-full border-t border-white/20 pt-6">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-80">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    Scanner Active
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-80">
                                    <Scan size={14} />
                                    Auto-detect enabled
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#e2e8f0]">
                        <div className="flex items-center gap-2 text-[#5c7cff] font-bold text-sm mb-3">
                            <Info size={16} />
                            How it works
                        </div>
                        <p className="text-[#64748b] text-[13px] leading-relaxed font-medium">
                            {scanMode === 'camera'
                                ? "Point your camera at the student's QR code to record their attendance automatically. Use the button to switch between front and back cameras."
                                : "Simply scan the QR code with your USB barcode scanner. The system will automatically detect the scan and mark attendance instantly."
                            }
                        </p>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 items-start">
                        <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                            {scanMode === 'camera'
                                ? "Tip: If the QR code appears blurry, move your device closer or farther until it becomes clear. Front cameras may need more distance (20-30cm) for best focus."
                                : "Note: Make sure your USB barcode scanner is properly connected. The scanner works like a keyboard and requires no additional drivers."
                            }
                        </p>
                    </div>
                </div>

                {/* Ready Status */}
                <div className="mt-10 flex items-center justify-center gap-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.2em]">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                    Ready to scan
                </div>
            </div>

            {/* Global Animation Styles */}
            <style jsx global>{`
                @keyframes scan-line {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-scan-line {
                    animation: scan-line 3s linear infinite;
                }
                .animate-blink {
                    animation: blink 1s step-end infinite;
                }
            `}</style>
        </div>
    );
}






