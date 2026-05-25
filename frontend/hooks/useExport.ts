// useful for exporting analysis data
import jsPDF from "jspdf";
import type { AIFeedback } from "./useAIGrader";

// This hook takes the session data and generates a clean PDF report.
// jsPDF works entirely in the browser — no server needed.

export function useExportPDF() {
  function exportPDF({
    question,
    category,
    difficulty,
    transcript,
    feedback,
  }: {
    question: string;
    category: string;
    difficulty: string;
    transcript: string;
    feedback: AIFeedback;
  }) {
    const doc = new jsPDF();

    // jsPDF uses points (pt) as units. Page is 210mm wide.
    // Usable content area with 20mm margins = 170mm = ~481pt
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20; // current Y position, we move this down as we add content

    // ── Helper: add a new page if we're running out of space ──
    function checkNewPage(neededHeight: number) {
      if (y + neededHeight > 270) {
        doc.addPage();
        y = 20;
      }
    }

    // ── Header bar ──
    doc.setFillColor(109, 40, 217); // violet-700
    doc.rect(0, 0, pageWidth, 14, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("InterviewAI — Session Report", margin, 9.5);
    doc.text(new Date().toLocaleDateString(), pageWidth - margin, 9.5, { align: "right" });

    y = 24;

    // ── Title ──
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Interview Report", margin, y);
    y += 10;

    // ── Category + Difficulty badges (text-based) ──
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`${category}  ·  ${difficulty}`, margin, y);
    y += 12;

    // ── Divider ──
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // ── Score ──
    const scoreColor = feedback.score >= 8
      ? [16, 185, 129]   // emerald
      : feedback.score >= 5
      ? [245, 158, 11]   // amber
      : [239, 68, 68];   // rose

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Score", margin, y);

    doc.setFontSize(28);
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${feedback.score}`, margin, y + 10);

    doc.setFontSize(14);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("/ 10", margin + 14, y + 10);
    y += 22;

    // ── Question ──
    checkNewPage(30);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Question", margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85); // slate-700

    // splitTextToSize wraps long text to fit within contentWidth
    const questionLines = doc.splitTextToSize(question, contentWidth);
    checkNewPage(questionLines.length * 5 + 4);
    doc.text(questionLines, margin, y);
    y += questionLines.length * 5 + 10;

    // ── Transcript ──
    checkNewPage(30);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Your Answer (Transcript)", margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105); // slate-600

    const transcriptLines = doc.splitTextToSize(
      transcript || "No transcript recorded.",
      contentWidth
    );

    // Transcript can be long — paginate chunk by chunk
    for (const line of transcriptLines) {
      checkNewPage(6);
      doc.text(line, margin, y);
      y += 5.5;
    }
    y += 6;

    // ── What to Improve ──
    checkNewPage(30);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("What to Improve", margin, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);

    for (const item of feedback.improvements) {
      const bulletLines = doc.splitTextToSize(`• ${item}`, contentWidth - 4);
      checkNewPage(bulletLines.length * 5 + 4);
      doc.text(bulletLines, margin + 2, y);
      y += bulletLines.length * 5 + 3;
    }
    y += 4;

    // ── Example Strong Answer ──
    checkNewPage(30);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Example Strong Answer", margin, y);
    y += 7;

    // Light background box for the example
    const exampleLines = doc.splitTextToSize(feedback.exampleAnswer, contentWidth - 8);
    const boxHeight = exampleLines.length * 5.5 + 8;
    checkNewPage(boxHeight);

    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, "FD");

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(exampleLines, margin + 4, y + 7);
    y += boxHeight + 10;

    // ── Footer ──
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "normal");
      doc.text(
        `InterviewAI  ·  Page ${i} of ${pageCount}`,
        pageWidth / 2,
        287,
        { align: "center" }
      );
    }

    // ── Save ──
    // Filename uses the date so multiple reports don't overwrite each other
    const dateStr = new Date().toISOString().slice(0, 10);
    doc.save(`interview-report-${dateStr}.pdf`);
  }

  return { exportPDF };
}