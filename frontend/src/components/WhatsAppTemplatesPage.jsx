import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit2, CheckCircle2, AlertTriangle, User, Phone, DollarSign, Calendar, Info, Gift, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function WhatsAppTemplatesPage() {
    const [editingTemplate, setEditingTemplate] = useState(null);

    // Initial templates data
    const [templates, setTemplates] = useState([
        {
            id: 1,
            name: "Admission Confirmation",
            tag: "admission_confirmation",
            status: "Active",
            description: "Sent to student after successful admission",
            variables: ["{{$student_name}}", "{{$course_name}}", "{{$course_price}}", "{{$admission_date}}", "{{$admission_fees}}"],
            content: "🎉 Congratulations {{$student_name}}! \n\nWe are delighted to confirm your admission!",
            type: "success"
        },
        {
            id: 2,
            name: "Birthday Wishes",
            tag: "birthday_message",
            status: "Active",
            description: "Sent to students on their birthday (automated at 8:00 AM)",
            variables: ["{{$student_name}}", "{{$institute_name}}"],
            content: "🎂 Happy Birthday {{$student_name}}! 🎁 \n\nOn this special day, the entire team at {{$institute_name}} wishes you a",
            type: "info"
        },
        {
            id: 3,
            name: "Enquiry Notification to Admin",
            tag: "enquiry_admin",
            status: "Active",
            description: "Sent to admin when a new enquiry is received",
            variables: ["{{$student_name}}", "{{$course_name}}", "{{$student_mobile}}"],
            content: "⚠️ New Course Enquiry Received!\n\nStudent Details:\n👤 Name: {{$student_name}}\n📞 Course Interested: {{$course_name}}",
            type: "warning"
        },
        {
            id: 4,
            name: "Enquiry Confirmation to Student",
            tag: "enquiry_student",
            status: "Active",
            description: "Sent to student after they submit an enquiry",
            variables: ["{{$student_name}}", "{{$institute_name}}", "{{$course_name}}", "{{$institute_mobile}}"],
            content: "Dear {{$student_name}},\n\nThank you for your interest in {{$institute_name}}!",
            type: "info"
        },
        {
            id: 5,
            name: "Fee Reminder - Upcoming Due Date",
            tag: "fee_reminder",
            status: "Active",
            description: "Sent to students when installment payment is due soon",
            variables: ["{{$student_name}}", "{{$course_name}}", "{{$installment_amount}}", "{{$due_date}}", "{{$days_remaining}}", "{{$installment_number}}"],
            content: "Dear {{$student_name}},\n\nI hope you're doing well with your studies!",
            type: "warning"
        },
        {
            id: 6,
            name: "Fee Reminder - Overdue Payment",
            tag: "fee_reminder_overdue",
            status: "Active",
            description: "Sent to students when installment payment is overdue",
            variables: ["{{$student_name}}", "{{$course_name}}", "{{$installment_amount}}", "{{$due_date}}", "{{$days_overdue}}", "{{$installment_number}}"],
            content: "Dear {{$student_name}},\n\nThis is a gentle reminder regarding your course fee payment.",
            type: "error"
        },
        {
            id: 7,
            name: "Installment Payment Confirmation",
            tag: "installment_paid",
            status: "Active",
            description: "Sent to student after successful installment payment",
            variables: ["{{$student_name}}", "{{$course_name}}", "{{$total_amount}}", "{{$paid_amount}}", "{{$due_date}}", "{{$paid_date}}"],
            content: "Dear {{$student_name}},\n\nThank you for your payment! We have successfully received your course fee installment.",
            type: "success"
        },
        {
            id: 8,
            name: "Support Ticket Alert to Admin",
            tag: "support_ticket",
            status: "Active",
            description: "Sent to admin when a student raises a support ticket",
            variables: ["{{$priority}}", "{{$category}}", "{{$title}}", "{{$description}}", "{{$student_name}}"],
            content: "🎫 New Support Ticket Received!\n\nTicket Details:\n🔺 Priority: {{$priority}}\n📁 Category: {{$category}}",
            type: "info"
        }
    ]);

    const handleSaveTemplate = (e) => {
        e.preventDefault();
        const updatedTemplates = templates.map(t =>
            t.id === editingTemplate.id ? editingTemplate : t
        );
        setTemplates(updatedTemplates);
        setEditingTemplate(null);
    };

    return (
        <div className="p-8 animate-in fade-in duration-300 space-y-8 relative">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">WhatsApp Message Templates</h1>
                <p className="text-[13px] text-gray-500 font-medium">Manage your automated WhatsApp message templates</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div key={template.id} className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                        <div className="p-6 space-y-4 flex-1">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-[16px] font-bold text-gray-800 leading-tight">{template.name}</h3>
                                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-mono rounded-sm border border-blue-100">
                                        {template.tag}
                                    </span>
                                </div>
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100 uppercase tracking-wide">
                                    <CheckCircle2 size={10} className="stroke-[3px]" /> {template.status}
                                </span>
                            </div>

                            <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                                {template.description}
                            </p>

                            <div className="space-y-2">
                                <h4 className="text-[12px] font-bold text-gray-700 uppercase tracking-wide">Available Variables:</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {template.variables.map((variable, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-mono font-medium rounded-sm border border-purple-100">
                                            {variable}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-md border border-gray-100 p-4 relative text-[12px] text-gray-600 font-medium leading-relaxed max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                {template.content.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < template.content.split('\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30 rounded-b-lg">
                            <div className="flex items-center gap-2">
                                <Switch checked={true} className="data-[state=checked]:bg-[#0f172a]" />
                                <span className="text-[11px] font-bold text-gray-600">Deactivate</span>
                            </div>
                            <Button
                                onClick={() => setEditingTemplate(template)}
                                className="bg-[#0f172a] hover:bg-black text-white px-4 h-8 text-[10px] font-bold uppercase tracking-wider rounded-sm gap-2"
                            >
                                <Edit2 size={12} /> Edit Template
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-8 text-center">
                <p className="text-[10px] text-gray-400 font-medium">Copyright 2026-27 © <a href="https://www.devspectra.in" className="font-bold hover:text-blue-600 transition-colors">DevSpectra</a> All rights reserved.</p>
            </div>

            {/* Edit Modal */}
            {editingTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">Edit Template</h2>
                            <button onClick={() => setEditingTemplate(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTemplate} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Template Content</label>
                                <Textarea
                                    className="min-h-[200px] text-sm leading-relaxed p-4 bg-gray-50 border-gray-200 focus:border-[#0f172a] focus:ring-0 resize-none font-medium text-gray-600"
                                    value={editingTemplate.content}
                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                                />
                                <p className="text-[11px] text-gray-400 italic">
                                    Line breaks will be preserved in the WhatsApp message.
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                <h4 className="text-[11px] font-bold text-blue-800 uppercase tracking-wide mb-2">Available Variables</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {editingTemplate.variables.map((variable, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setEditingTemplate({
                                                ...editingTemplate,
                                                content: editingTemplate.content + ' ' + variable
                                            })}
                                            className="px-2 py-1 bg-white text-blue-700 text-[10px] font-mono font-bold rounded border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                                        >
                                            {variable}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-blue-600 mt-2 font-medium">Click a variable to add it to your message.</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingTemplate(null)}
                                    className="border-gray-200 text-gray-600 hover:bg-gray-50 font-bold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#0f172a] hover:bg-black text-white font-bold gap-2"
                                >
                                    Update Template
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
