"use client";

import { Download } from "lucide-react";
import { jsPDF } from "jspdf";

type PrescriptionItem = {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
};

type PrescriptionDownloadButtonProps = {
  prescriptionId: string;
  patientName: string;
  phone: string;
  treatment: string;
  appointmentDate: string;
  doctorName: string;
  issuedDate: string;
  items: PrescriptionItem[];
};

type RGB = [number, number, number];

export function PrescriptionDownloadButton({
  prescriptionId,
  patientName,
  phone,
  treatment,
  appointmentDate,
  doctorName,
  issuedDate,
  items,
}: PrescriptionDownloadButtonProps) {
  const handleDownload = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // =========================================================================
    // COLORS
    // =========================================================================

    const colors: Record<string, RGB> = {
      teal: [61, 190, 187],
      tealDark: [31, 154, 153],
      tealLight: [111, 207, 204],

      navy: [38, 76, 101],
      text: [50, 69, 82],
      muted: [91, 111, 122],

      white: [255, 255, 255],

      line: [91, 119, 132],
      separator: [220, 230, 229],

      tableHeader: [239, 247, 246],

      footer: [239, 241, 240],
      shadow: [222, 232, 231],
    };

    // =========================================================================
    // PAGE / SHEET
    // =========================================================================

    const sheetX = 72;
    const sheetY = 48;

    const sheetWidth = pageWidth - 105;
    const sheetHeight = pageHeight - 96;

    const contentX = sheetX + 30;
    const contentRight = sheetX + sheetWidth - 30;

    const contentWidth = contentRight - contentX;

    const headerHeight = 94;
    const footerHeight = 38;

    // =========================================================================
    // MEDICATION LAYOUT
    // =========================================================================

    const numberX = contentX + 5;
    const medicationX = contentX + 28;

    const dosageX = contentX + 225;
    const scheduleX = contentX + 325;

    const medicationWidth = 175;
    const dosageWidth = 72;
    const scheduleWidth = 92;

    const medicationFontSize = 10.5;
    const bodyFontSize = 9;
    const instructionFontSize = 8;

    const medicationLineHeight = 12;
    const bodyLineHeight = 11;
    const instructionLineHeight = 10;

    // =========================================================================
    // BASIC HELPERS
    // =========================================================================

    const setFont = (style: "normal" | "bold", size: number, color: RGB) => {
      doc.setFont("helvetica", style);

      doc.setFontSize(size);

      doc.setTextColor(color[0], color[1], color[2]);
    };

    const drawLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: RGB = colors.line,
      width = 0.7,
    ) => {
      doc.setDrawColor(color[0], color[1], color[2]);

      doc.setLineWidth(width);

      doc.line(x1, y1, x2, y2);
    };

    // =========================================================================
    // PAGE BACKGROUND
    // =========================================================================

    const drawPageBackground = () => {
      // White page
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);

      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Left turquoise strip
      doc.setFillColor(colors.teal[0], colors.teal[1], colors.teal[2]);

      doc.rect(0, 0, 86, pageHeight, "F");

      // Bottom-left diagonal
      doc.triangle(0, pageHeight, 0, pageHeight - 155, 125, pageHeight, "F");

      // Sheet shadow
      doc.setFillColor(colors.shadow[0], colors.shadow[1], colors.shadow[2]);

      doc.roundedRect(
        sheetX + 5,
        sheetY + 5,
        sheetWidth,
        sheetHeight,
        2,
        2,
        "F",
      );

      // White sheet
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);

      doc.rect(sheetX, sheetY, sheetWidth, sheetHeight, "F");
    };

    // =========================================================================
    // HEADER
    // =========================================================================

    const drawHeader = () => {
      // Main turquoise
      doc.setFillColor(colors.teal[0], colors.teal[1], colors.teal[2]);

      doc.rect(sheetX, sheetY, sheetWidth, headerHeight, "F");

      // Dark turquoise left section
      doc.setFillColor(
        colors.tealDark[0],
        colors.tealDark[1],
        colors.tealDark[2],
      );

      doc.rect(sheetX, sheetY, 275, headerHeight, "F");

      // Decorative diagonal 1
      doc.setFillColor(
        colors.tealLight[0],
        colors.tealLight[1],
        colors.tealLight[2],
      );

      doc.triangle(
        sheetX + 275,
        sheetY,
        sheetX + 330,
        sheetY,
        sheetX + 285,
        sheetY + headerHeight,
        "F",
      );

      // Decorative diagonal 2
      doc.setFillColor(188, 229, 227);

      doc.triangle(
        sheetX + 330,
        sheetY,
        sheetX + 375,
        sheetY,
        sheetX + 325,
        sheetY + headerHeight,
        "F",
      );

      // Decorative diagonal 3
      doc.setFillColor(222, 244, 243);

      doc.triangle(
        sheetX + 375,
        sheetY,
        sheetX + 425,
        sheetY,
        sheetX + 375,
        sheetY + headerHeight,
        "F",
      );

      // -----------------------------------------------------------------------
      // Doctor name
      // -----------------------------------------------------------------------

      setFont("bold", 20, colors.white);

      doc.text("Dr.", sheetX + 30, sheetY + 40);

      const drWidth = doc.getTextWidth("Dr.");

      setFont("normal", 20, colors.white);

      doc.text(
        doctorName || "Doctor Name",
        sheetX + 30 + drWidth + 6,
        sheetY + 40,
      );

      // -----------------------------------------------------------------------
      // Specialty
      // -----------------------------------------------------------------------

      setFont("bold", 7.5, colors.white);

      doc.setCharSpace(2.5);

      doc.text("D E N T A L   C A R E", sheetX + 30, sheetY + 57);

      doc.setCharSpace(0);

      // -----------------------------------------------------------------------
      // Medical icon
      // -----------------------------------------------------------------------

      const iconCenterX = sheetX + sheetWidth - 67;

      const iconCenterY = sheetY + 47;

      doc.setFillColor(colors.teal[0], colors.teal[1], colors.teal[2]);

      doc.circle(iconCenterX, iconCenterY, 30, "F");

      doc.setDrawColor(colors.white[0], colors.white[1], colors.white[2]);

      doc.setLineWidth(2);

      doc.line(
        iconCenterX - 12,
        iconCenterY - 12,
        iconCenterX - 9,
        iconCenterY + 9,
      );

      doc.line(
        iconCenterX + 12,
        iconCenterY - 12,
        iconCenterX + 9,
        iconCenterY + 9,
      );

      doc.line(
        iconCenterX - 9,
        iconCenterY + 9,
        iconCenterX + 9,
        iconCenterY + 9,
      );

      doc.circle(iconCenterX + 13, iconCenterY + 10, 4, "S");
    };

    // =========================================================================
    // FOOTER
    // =========================================================================

    const drawFooter = () => {
      const footerY = sheetY + sheetHeight - footerHeight;

      doc.setFillColor(colors.footer[0], colors.footer[1], colors.footer[2]);

      doc.rect(sheetX + 1, footerY, sheetWidth - 2, footerHeight, "F");

      // Clinic
      setFont("bold", 9, colors.navy);

      doc.setCharSpace(2);

      doc.text("DR. MEHTA DENTAL", contentX, footerY + 24);

      doc.setCharSpace(0);

      // Address
      setFont("normal", 7, colors.muted);

      doc.text(
        "12 Wellness Avenue, Dental District, Bengaluru",
        contentX + 155,
        footerY + 22,
      );

      // Phone
      doc.text("+91 98765 43210", contentRight - 95, footerY + 22);
    };

    // =========================================================================
    // PATIENT FIELD
    // =========================================================================

    const drawField = (
      label: string,
      value: string,
      x: number,
      y: number,
      width: number,
    ) => {
      setFont("bold", 8.5, colors.navy);

      doc.text(label, x, y);

      const labelWidth = doc.getTextWidth(label);

      const valueX = x + labelWidth + 7;

      const valueWidth = Math.max(width - labelWidth - 7, 20);

      setFont("normal", 9, colors.text);

      const valueLines = doc.splitTextToSize(value || "", valueWidth);

      doc.text(valueLines[0] || "", valueX, y);

      drawLine(valueX, y + 5, x + width, y + 5, colors.line, 0.65);
    };

    // =========================================================================
    // PATIENT INFORMATION
    // =========================================================================

    const drawPatientInformation = () => {
      const infoTop = sheetY + headerHeight + 38;

      // Patient name
      drawField("Patient Name:", patientName, contentX, infoTop, 280);

      // Date
      drawField("Date:", issuedDate, contentRight - 120, infoTop, 120);

      // Phone
      drawField("Phone:", phone, contentX, infoTop + 32, 165);

      // Appointment
      drawField(
        "Appointment:",
        appointmentDate,
        contentX + 180,
        infoTop + 32,
        185,
      );

      // Diagnosis
      drawField("Diagnosis:", treatment, contentX, infoTop + 64, contentWidth);

      return infoTop;
    };

    // =========================================================================
    // RX
    // =========================================================================

    const drawRx = (infoTop: number) => {
      const rxY = infoTop + 145;

      setFont("bold", 46, colors.navy);

      doc.text("R", contentX, rxY);

      setFont("bold", 30, colors.navy);

      doc.text("x", contentX + 25, rxY + 15);

      return rxY + 48;
    };

    // =========================================================================
    // TABLE HEADER
    // =========================================================================

    const drawMedicationTableHeader = (y: number, continuation = false) => {
      let currentY = y;

      // Continuation label
      if (continuation) {
        setFont("bold", 8, colors.muted);

        doc.text("PRESCRIPTION CONTINUED", contentX, currentY);

        currentY += 17;
      }

      const headerHeight = 28;

      // Background
      doc.setFillColor(
        colors.tableHeader[0],
        colors.tableHeader[1],
        colors.tableHeader[2],
      );

      doc.roundedRect(
        contentX,
        currentY,
        contentWidth,
        headerHeight,
        4,
        4,
        "F",
      );

      // Header labels
      setFont("bold", 7.5, colors.navy);

      doc.text("MEDICINE", medicationX, currentY + 18);

      doc.text("DOSAGE", dosageX, currentY + 18);

      doc.text("SCHEDULE", scheduleX, currentY + 18);

      return currentY + headerHeight + 12;
    };

    // =========================================================================
    // CALCULATE MEDICATION ROW
    // =========================================================================

    const calculateMedicationRow = (item: PrescriptionItem) => {
      // Medication
      setFont("bold", medicationFontSize, colors.navy);

      const medicationLines = doc.splitTextToSize(
        item.medication || "Medication",
        medicationWidth,
      );

      // Dosage
      setFont("normal", bodyFontSize, colors.text);

      const dosageLines = doc.splitTextToSize(item.dosage || "—", dosageWidth);

      // Schedule
      const schedule = [item.frequency, item.duration]
        .filter(Boolean)
        .join(" • ");

      const scheduleLines = doc.splitTextToSize(schedule || "—", scheduleWidth);

      // Instructions
      const instructionLines = item.instructions
        ? doc.splitTextToSize(item.instructions, contentRight - medicationX)
        : [];

      // Heights
      const medicationHeight = medicationLines.length * medicationLineHeight;

      const dosageHeight = dosageLines.length * bodyLineHeight;

      const scheduleHeight = scheduleLines.length * bodyLineHeight;

      const instructionHeight =
        instructionLines.length > 0
          ? 17 + instructionLines.length * instructionLineHeight
          : 0;

      const mainContentHeight = Math.max(
        medicationHeight,
        dosageHeight,
        scheduleHeight,
      );

      // Dynamic row height
      const rowHeight = Math.max(
        52,
        mainContentHeight + instructionHeight + 14,
      );

      return {
        medicationLines,
        dosageLines,
        scheduleLines,
        instructionLines,
        rowHeight,
        mainContentHeight,
      };
    };

    // =========================================================================
    // DRAW MEDICATION ROW
    // =========================================================================

    const drawMedicationRow = (
      item: PrescriptionItem,
      index: number,
      y: number,
      isLast: boolean,
    ) => {
      const row = calculateMedicationRow(item);

      // -----------------------------------------------------------------------
      // Number
      // -----------------------------------------------------------------------

      setFont("bold", 8.5, colors.tealDark);

      doc.text(`${index + 1}.`, numberX, y + 3);

      // -----------------------------------------------------------------------
      // Medicine
      // -----------------------------------------------------------------------

      setFont("bold", medicationFontSize, colors.navy);

      doc.text(row.medicationLines, medicationX, y + 3);

      // -----------------------------------------------------------------------
      // Dosage
      // -----------------------------------------------------------------------

      setFont("normal", bodyFontSize, colors.text);

      doc.text(row.dosageLines, dosageX, y + 3);

      // -----------------------------------------------------------------------
      // Schedule
      // -----------------------------------------------------------------------

      setFont("normal", bodyFontSize, colors.text);

      doc.text(row.scheduleLines, scheduleX, y + 3);

      // -----------------------------------------------------------------------
      // Instructions
      // -----------------------------------------------------------------------

      if (row.instructionLines.length > 0) {
        setFont("normal", instructionFontSize, colors.muted);

        const instructionY = y + row.mainContentHeight + 8;

        doc.text(row.instructionLines, medicationX, instructionY);
      }

      // -----------------------------------------------------------------------
      // Separator
      // -----------------------------------------------------------------------

      if (!isLast) {
        drawLine(
          medicationX,
          y + row.rowHeight - 5,
          contentRight,
          y + row.rowHeight - 5,
          colors.separator,
          0.5,
        );
      }

      return row.rowHeight;
    };

    // =========================================================================
    // SIGNATURE
    // =========================================================================

    const drawSignature = () => {
      const footerY = sheetY + sheetHeight - footerHeight;

      const signatureY = footerY - 45;

      const signatureX = contentRight - 125;

      drawLine(
        signatureX,
        signatureY,
        contentRight,
        signatureY,
        colors.line,
        0.7,
      );

      setFont("normal", 8.5, colors.navy);

      doc.text("Signature", signatureX + 38, signatureY + 17);
    };

    // =========================================================================
    // MEDICATION BOTTOM LIMIT
    // =========================================================================

    const getMedicationBottom = () => {
      const footerY = sheetY + sheetHeight - footerHeight;

      // Leave space for signature.
      return footerY - 65;
    };

    // =========================================================================
    // PAGE 1
    // =========================================================================

    drawPageBackground();

    drawHeader();

    const infoTop = drawPatientInformation();

    const rxBottom = drawRx(infoTop);

    let currentY = drawMedicationTableHeader(rxBottom, false);

    // =========================================================================
    // MEDICATIONS
    // =========================================================================

    if (items.length > 0) {
      items.forEach((item, index) => {
        const row = calculateMedicationRow(item);

        const isLast = index === items.length - 1;

        // -------------------------------------------------------------------
        // Row doesn't fit on current page
        // -------------------------------------------------------------------

        if (currentY + row.rowHeight > getMedicationBottom()) {
          // Finish current page without signature.
          drawFooter();

          // ---------------------------------------------------------------
          // New page
          // ---------------------------------------------------------------

          doc.addPage();

          drawPageBackground();

          drawHeader();

          // Table starts underneath header
          currentY = drawMedicationTableHeader(
            sheetY + headerHeight + 28,
            true,
          );
        }

        // -------------------------------------------------------------------
        // Draw row
        // -------------------------------------------------------------------

        const drawnHeight = drawMedicationRow(item, index, currentY, isLast);

        currentY += drawnHeight;
      });
    } else {
      setFont("normal", 10, colors.muted);

      doc.text("No medication items listed.", medicationX, currentY + 5);
    }

    // =========================================================================
    // FINAL PAGE
    // =========================================================================

    drawSignature();

    drawFooter();

    // =========================================================================
    // SAVE
    // =========================================================================

    doc.save(`prescription-${prescriptionId}.pdf`);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </button>
  );
}
