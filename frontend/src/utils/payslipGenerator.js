import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePayslip = async (record) => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // 1. Background Image
        const bgUrl = "https://tkexjhynheqwkywhrsiy.supabase.co/storage/v1/object/public/Images/backgrounds/1774428457262-fee.png";
        
        try {
            const img = new Image();
            img.src = bgUrl;
            await new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve; 
            });
            doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
            
            // 2. Hide "INVOICE" from BG and write "PAYSLIP"
            doc.setFillColor(255, 255, 255);
            doc.rect(pageWidth - 75, 15, 65, 25, 'F'); // Smaller, more targeted cover
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24); // Slightly smaller font
            doc.setTextColor(20, 20, 20);
            doc.text("PAYSLIP", pageWidth - 65, 32);
        } catch (err) {
            console.error("BG Load Error:", err);
        }

        // 3. Header Info
        const infoStartY = 85; // Shifted up from 100
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(60, 60, 60);

        doc.text(`Pay Period : ${record.month} ${record.year}`, 25, infoStartY);
        doc.text(`Employee ID : ${record.user?.employeeId || record.id}`, 25, infoStartY + 8);
        doc.text(`Designation : ${record.user?.designation || record.staffType}`, 25, infoStartY + 16);

        const displayDate = new Date(record.createdAt).toLocaleDateString('en-IN');
        doc.text(`Payment Date : ${displayDate}`, pageWidth - 80, infoStartY);

        // 4. Attendance Summary (4 Boxes Layout)
        autoTable(doc, {
            startY: infoStartY + 25, // Shifted up
            head: [['Present', 'Absent', 'Half-Days', 'Late Comings']],
            body: [
                [
                    record.presentCount || 0,
                    record.absentCount || 0,
                    record.halfDayCount || 0,
                    record.lateCount || 0
                ]
            ],
            theme: 'grid',
            headStyles: { fillColor: [240, 240, 240], textColor: [40, 40, 40], fontStyle: 'bold', halign: 'center' },
            bodyStyles: { halign: 'center', fontStyle: 'bold', fontSize: 13, textColor: [20, 20, 20] },
            margin: { left: 25, right: 25 }
        });

        // 5. Salary Breakdown
        const salaryStartY = doc.lastAutoTable.finalY + 12; // Reduced gap from 20 to 12
        autoTable(doc, {
            startY: salaryStartY,
            body: [
                ['Gross Salary', `INR ${record.grossSalary.toLocaleString()}`],
                ['Deductions', `- INR ${record.deductions.toLocaleString()}`],
                ['Net Salary', `INR ${record.netSalary.toLocaleString()}`]
            ],
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 6 }, // Reduced padding from 8 to 6
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 100 },
                1: { halign: 'right', fontStyle: 'bold' }
            },
            didParseCell: function (data) {
                if (data.row.index === 0) data.cell.styles.fillColor = [240, 255, 240];
                if (data.row.index === 1) data.cell.styles.fillColor = [255, 240, 240];
                if (data.row.index === 2) {
                    data.cell.styles.fillColor = [15, 23, 42];
                    data.cell.styles.textColor = [255, 255, 255];
                    data.cell.styles.fontSize = 14;
                }
            },
            margin: { left: 25, right: 25 }
        });

        // 6. Footer Information
        const finalY = doc.lastAutoTable.finalY + 20;
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("Work for Excellence. Achieve More! TNCDC Team.", pageWidth / 2, pageHeight - 20, { align: 'center' });

        // 7. Save the PDF
        const filename = `Payslip_${record.staffName.replace(/\s+/g, '_')}_${record.month}_${record.year}.pdf`;
        doc.save(filename);
        
        return true;
    } catch (error) {
        console.error("Payslip Generator Error:", error);
        throw error;
    }
};
