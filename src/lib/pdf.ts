import { jsPDF } from 'jspdf';
import type { Problem } from './types';
import { OP_SYMBOL } from './types';
import { formatNum } from './generator';

const NAVY: [number, number, number] = [13, 22, 55];
const GOLD: [number, number, number] = [240, 180, 41];
const MAROON: [number, number, number] = [140, 26, 53];
const INK: [number, number, number] = [32, 34, 48];
const GREY: [number, number, number] = [110, 116, 140];

export interface PdfMeta {
  title: string;
  subtitle: string;
}

function drawHeader(doc: jsPDF, meta: PdfMeta) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setFillColor(...MAROON);
  doc.rect(0, 32, 210, 1.6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(...GOLD);
  doc.text('TERAMPIL MATEMATIKA DASAR', 105, 12.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(235, 238, 252);
  doc.text(meta.subtitle, 105, 20, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setTextColor(190, 197, 226);
  doc.text(meta.title, 105, 26.5, { align: 'center' });

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.7);
  doc.line(14, 36.5, 196, 36.5);
}

function identityFields(doc: jsPDF) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  doc.text('Nama', 14, 46);
  doc.line(28, 46.5, 110, 46.5);
  doc.text('Kelas', 118, 46);
  doc.line(132, 46.5, 150, 46.5);
  doc.text('Tanggal', 156, 46);
  doc.line(174, 46.5, 196, 46.5);
}

function exprText(p: Problem): string {
  return `${formatNum(p.a)} ${OP_SYMBOL[p.op]} ${formatNum(p.b)} =`;
}

export function exportProblemsPdf(problems: Problem[], meta: PdfMeta) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // ---------- Halaman 1 : Lembar Soal ----------
  drawHeader(doc, meta);
  identityFields(doc);

  const startY = 66;
  const rowH = 30;
  const colX = [14, 112];

  problems.forEach((p, i) => {
    const x = colX[i % 2];
    const y = startY + rowH * Math.floor(i / 2);

    // nomor soal
    doc.setFillColor(...MAROON);
    doc.circle(x + 4, y - 3, 4.6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(String(i + 1), x + 4, y - 1.4, { align: 'center' });

    // ekspresi
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...INK);
    doc.text(exprText(p), x + 12, y);

    // kotak jawaban
    doc.setDrawColor(...NAVY);
    doc.setLineWidth(0.65);
    doc.setFillColor(250, 250, 253);
    doc.roundedRect(x + 56, y - 8.6, 28, 12.5, 2.2, 2.2, 'FD');

    // aksen gold kecil
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(x + 12, y + 5.5, x + 50, y + 5.5);
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(...GREY);
  doc.text('Kerjakan dengan teliti. Tulis jawabanmu di dalam kotak yang tersedia.', 105, 226, { align: 'center' });
  doc.text('Dibuat dengan Terampil Matematika Dasar — Lembar Latihan Operasi Hitung Bilangan Bulat', 105, 288, { align: 'center' });

  // ---------- Halaman 2 : Kunci Jawaban ----------
  doc.addPage();
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setFillColor(...GOLD);
  doc.rect(0, 24, 210, 1.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...GOLD);
  doc.text('KUNCI JAWABAN', 105, 14.5, { align: 'center' });

  const kStartY = 42;
  const kRowH = 22;
  problems.forEach((p, i) => {
    const x = colX[i % 2];
    const y = kStartY + kRowH * Math.floor(i / 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...GREY);
    doc.text(`${i + 1}.`, x + 2, y);
    doc.setTextColor(...INK);
    doc.setFontSize(12);
    doc.text(`${exprText(p)} ${p.answer}`, x + 12, y);
    doc.setDrawColor(222, 226, 240);
    doc.setLineWidth(0.3);
    doc.line(x + 12, y + 3, x + 80, y + 3);
  });

  doc.save('terampil-matematika-dasar-soal.pdf');
}
