import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";

export const generateInvoice = async (payment) => {
    try {
        console.log("Generating invoice for:", payment);
        if (!payment) return;
        
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Load and Add Background Image
        const bgUrl = "https://tkexjhynheqwkywhrsiy.supabase.co/storage/v1/object/public/Images/backgrounds/1774428457262-fee.png";
        
        try {
            const img = new Image();
            img.src = bgUrl;
            await new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if image fails
            });
            doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
        } catch (imgError) {
            console.error("Failed to load background image:", imgError);
        }

        // Header - Removed redundant text that overlaps with background image
        // Only keeping essential variable data
        
        // 2. Variable Data (Bill To & Invoice Details)
        // Shifting slightly up to reduce the gap below the gray bar
        const dataStartY = 105; 
        
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Bill To:", 25, dataStartY);
        
        doc.setFont("helvetica", "normal");
        doc.text(`${payment.studentName || 'Student'}`, 25, dataStartY + 7);
        doc.text(`Roll No: ${payment.rollNumber || 'N/A'}`, 25, dataStartY + 13);
        doc.text(`Course: ${payment.courseName || 'N/A'}`, 25, dataStartY + 19);

        doc.setFont("helvetica", "bold");
        doc.text("Invoice Details:", pageWidth - 80, dataStartY);
        doc.setFont("helvetica", "normal");
        doc.text(`Invoice No: INV-${payment.id || 'N/A'}`, pageWidth - 80, dataStartY + 7);
        
        const displayDate = payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : new Date().toLocaleDateString();
        doc.text(`Date: ${displayDate}`, pageWidth - 80, dataStartY + 13);
        doc.text(`Status: Paid`, pageWidth - 80, dataStartY + 19);

        // 3. Payment Table
        const displayAmount = payment.amount || payment.paidAmount || "0.00";
        autoTable(doc, {
            startY: dataStartY + 30,
            head: [['Installment No', 'Description', 'Amount']],
            body: [
                [
                    payment.installmentNo || "1",
                    `Course Fee Installment - ${payment.courseName || 'Course'}`,
                    `INR ${displayAmount}`
                ]
            ],
            headStyles: { fillColor: [16, 185, 129] }, 
            alternateRowStyles: { fillColor: [250, 250, 250] },
            styles: { fontSize: 10, cellPadding: 6 }
        });

        const finalY = (doc.lastAutoTable?.finalY || 180) + 12;

        // 4. Summary
        doc.setFont("helvetica", "bold");
        doc.setTextColor(20, 20, 20);
        // Using INR instead of Rupee symbol to avoid character corruption in standard PDF fonts
        doc.text(`Total Amount Paid: INR ${displayAmount}`, pageWidth - 90, finalY);
        doc.text(`Payment Method: ${payment.paymentMethod || 'Online'}`, pageWidth - 90, finalY + 8);

        // 5. Footer
        doc.setFontSize(7);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(160, 160, 160);
        doc.text("This is an electronically generated document. No signature is required.", pageWidth / 2, 285, { align: 'center' });
        
        // 6. Save PDF
        const safeName = (payment.studentName || "Student").replace(/\s+/g, '_');
        const safeId = payment.id || Math.floor(Math.random() * 1000000);
        doc.save(`Invoice_${safeName}_${safeId}.pdf`);
        toast.success("Invoice downloaded successfully!");
    } catch (error) {
        console.error("Invoice Generation Error:", error);
        toast.error("Failed to generate invoice. Please check the console.");
    }
};
