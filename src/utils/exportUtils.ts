import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

export function exportToText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(title: string, content: string, metadata?: { institution?: string; student?: string; course?: string }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxLineWidth = pageWidth - margin * 2;

  let y = margin;

  // Header banner on first page
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(0, 0, pageWidth, 8, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Slate 900
  const titleLines = doc.splitTextToSize(title.toUpperCase(), maxLineWidth);
  doc.text(titleLines, pageWidth / 2, y + 10, { align: 'center' });
  y += 15 + titleLines.length * 6;

  // Metadata block if provided
  if (metadata) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    if (metadata.institution) {
      doc.text(`Instituição: ${metadata.institution}`, margin, y);
      y += 5;
    }
    if (metadata.course) {
      doc.text(`Curso: ${metadata.course}`, margin, y);
      y += 5;
    }
    if (metadata.student) {
      doc.text(`Estudante: ${metadata.student}`, margin, y);
      y += 5;
    }
    doc.text(`Data: ${new Date().toLocaleDateString('pt-MZ')}`, margin, y);
    y += 8;

    // Divider line
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  // Parse markdown-like content into lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);

  const rawLines = content.split('\n');

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();

    // Check page overflow
    if (y > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      // Header for subsequent pages
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Way Estudantes AI — ${title.slice(0, 40)}`, margin, y);
      y += 8;
    }

    if (!trimmed) {
      y += 4;
      continue;
    }

    // Heading 1 (### or ## or #)
    if (trimmed.startsWith('# ')) {
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      const hLines = doc.splitTextToSize(trimmed.replace(/^#\s+/, ''), maxLineWidth);
      doc.text(hLines, margin, y);
      y += hLines.length * 6 + 2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
    } else if (trimmed.startsWith('## ')) {
      y += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      const hLines = doc.splitTextToSize(trimmed.replace(/^##\s+/, ''), maxLineWidth);
      doc.text(hLines, margin, y);
      y += hLines.length * 5 + 2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
    } else if (trimmed.startsWith('### ')) {
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);
      const hLines = doc.splitTextToSize(trimmed.replace(/^###\s+/, ''), maxLineWidth);
      doc.text(hLines, margin, y);
      y += hLines.length * 5 + 1;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
    } else {
      // Regular paragraph or bullet
      let cleanText = trimmed;
      let indent = margin;
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        cleanText = '• ' + trimmed.substring(2);
        indent = margin + 3;
      }

      // Remove markdown bold asterisks for clean text in jsPDF
      cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1');

      const pLines = doc.splitTextToSize(cleanText, maxLineWidth - (indent - margin));
      doc.text(pLines, indent, y);
      y += pLines.length * 5 + 1;
    }
  }

  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${pageCount} — Gerado por Way Estudantes AI (Moçambique)`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  doc.save(`${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_WayEstudantesAI.pdf`);
}

export async function exportToDocx(title: string, content: string, metadata?: { institution?: string; student?: string; course?: string }) {
  const paragraphs: Paragraph[] = [];

  // Title
  paragraphs.push(
    new Paragraph({
      text: title.toUpperCase(),
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200, before: 100 },
    })
  );

  // Metadata
  if (metadata) {
    if (metadata.institution) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: `Instituição: ${metadata.institution}`, bold: true, color: '475569' })],
        })
      );
    }
    if (metadata.course) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: `Curso: ${metadata.course}`, color: '475569' })],
        })
      );
    }
    if (metadata.student) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: `Autor(a): ${metadata.student}`, color: '475569' })],
          spacing: { after: 200 },
        })
      );
    }
  }

  // Parse lines
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ text: '' }));
      continue;
    }

    if (trimmed.startsWith('# ')) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.replace(/^#\s+/, ''),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (trimmed.startsWith('## ')) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.replace(/^##\s+/, ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 80 },
        })
      );
    } else if (trimmed.startsWith('### ')) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.replace(/^###\s+/, ''),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 140, after: 60 },
        })
      );
    } else {
      // Check bullets or bold parts
      const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
      const clean = isBullet ? trimmed.substring(2) : trimmed;

      paragraphs.push(
        new Paragraph({
          text: clean.replace(/\*\*(.*?)\*\*/g, '$1'),
          bullet: isBullet ? { level: 0 } : undefined,
          spacing: { after: 80 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_WayEstudantesAI.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
