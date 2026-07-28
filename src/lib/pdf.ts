import { jsPDF } from 'jspdf';
import type { Problem } from './types';
import { OP_SYMBOL } from './types';
import { formatNum } from './generator';

/**
 * PDF hitam–putih, 1 halaman A4 LANDSCAPE berisi 2 lembar soal (atas & bawah).
 * Ditengah ada garis potong putus-putus sehingga bisa digunting jadi 2 lembar.
 * Logo dimuat dari /logo.png yang sudah ada di folder public/.
 */

const BLACK = 0;
const DARK  = 55;
const MID   = 130;
const LIGHT = 195;

export interface PdfMeta {
  title: string;
  subtitle: string;
}

function exprText(p: Problem): string {
  return `${formatNum(p.a)} ${OP_SYMBOL[p.op]} ${formatNum(p.b)} =`;
}

/** Memuat logo dari <img> yang sudah ada di DOM, konversi ke dataURL via canvas. */
async function getLogoDataUrl(): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width  = img.naturalWidth  || img.width  || 300;
        canvas.height = img.naturalHeight || img.height || 150;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    /* coba path relatif agar bekerja baik via localhost maupun produksi */
    img.src = (window.location.href.startsWith('file:')
      ? './logo.png'          // saat dibuka via file://
      : '/logo.png');          // saat via server
    /* timeout 3 detik */
    setTimeout(() => resolve(null), 3000);
  });
}

/**
 * Menggambar satu lembar soal (setengah halaman A4 landscape).
 *
 * @param doc       jsPDF instance
 * @param problems  10 soal yang akan digambar
 * @param meta      judul & subjudul
 * @param startY    koordinat Y awal area gambar (mm)
 * @param endY      koordinat Y akhir area gambar (mm)
 * @param logoData  dataURL logo, atau null jika gagal dimuat
 */
function drawSheet(
  doc: jsPDF,
  problems: Problem[],
  meta: PdfMeta,
  startY: number,
  endY: number,
  logoData: string | null,
) {
  const pageW = 297; // A4 landscape width
  const padL  = 12;
  const padR  = 12;
  const innerW = pageW - padL - padR;

  /* ---- bingkai lembar ---- */
  doc.setDrawColor(BLACK);
  doc.setLineWidth(0.5);
  doc.rect(padL, startY + 2, innerW, endY - startY - 4);

  /* ---- KOP ---- */
  const kopY = startY + 5;

  // Logo (kiri kop)
  if (logoData) {
    try {
      // tinggi logo 12 mm, rasio 2:1
      doc.addImage(logoData, 'PNG', padL + 2, kopY, 24, 12);
    } catch { /* abaikan jika gagal */ }
  }

  // Teks "TERAMPIL MATEMATIKA DASAR" (tengah atas)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(BLACK);
  doc.text('TERAMPIL MATEMATIKA DASAR', pageW / 2, kopY + 5, { align: 'center' });

  // Subjudul operasi & meta
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(DARK);
  doc.text(meta.subtitle, pageW / 2, kopY + 9.5, { align: 'center' });

  // "Expert Zealous" di kanan kop
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(DARK);
  doc.text('Expert Zealous', pageW - padR - 2, kopY + 4.5, { align: 'right' });
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(MID);
  doc.text('Jagonya Les Private Matematika', pageW - padR - 2, kopY + 8.5, { align: 'right' });

  /* garis bawah kop */
  const kopLineY = kopY + 13;
  doc.setDrawColor(BLACK);
  doc.setLineWidth(0.45);
  doc.line(padL + 2, kopLineY, pageW - padR - 2, kopLineY);

  /* ---- Identitas ---- */
  const idY = kopLineY + 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(BLACK);

  // Nama
  doc.text('Nama', padL + 4, idY);
  doc.setLineWidth(0.3);
  doc.line(padL + 16, idY + 0.5, padL + 88, idY + 0.5);

  // Kelas
  doc.text('Kelas', padL + 92, idY);
  doc.line(padL + 105, idY + 0.5, padL + 138, idY + 0.5);

  // Tanggal
  doc.text('Tanggal', padL + 142, idY);
  doc.line(padL + 158, idY + 0.5, padL + 192, idY + 0.5);

  // Kotak Nilai
  doc.setLineWidth(0.45);
  doc.rect(padL + 195, kopLineY + 1, 20, 11);
  doc.setFontSize(7);
  doc.setTextColor(MID);
  doc.text('Nilai', padL + 205, kopLineY + 6, { align: 'center' });

  /* garis bawah identitas */
  const idLineY = idY + 3;
  doc.setDrawColor(LIGHT);
  doc.setLineWidth(0.25);
  doc.line(padL + 2, idLineY, pageW - padR - 2, idLineY);

  /* ---- Soal 2 kolom ---- */
  const soalStartY = idLineY + 4;
  const colW       = (innerW - 6) / 2;
  const col1X      = padL + 2;
  const col2X      = padL + 2 + colW + 6;

  // Hitung tinggi baris agar 5 soal muat dalam sisa ruang
  const availH = endY - 6 - soalStartY;  // sisa ruang untuk 5 baris soal
  const rowH   = availH / 5;

  problems.forEach((p, idx) => {
    const col   = idx < 5 ? 0 : 1;
    const row   = idx < 5 ? idx : idx - 5;
    const x     = col === 0 ? col1X : col2X;
    const y     = soalStartY + row * rowH;

    /* --- nomor soal: kotak tumpuk ganda (overlapping squares) --- */
    doc.setDrawColor(BLACK);
    doc.setFillColor(255, 255, 255); // isi kotak putih bersih
    doc.setLineWidth(0.35);

    const numSize = 7.5; // ukuran kotak nomor
    const offsetDiff = 1.3; // pergeseran tumpukan kotak belakang

    // 1. Kotak belakang (geser ke atas-kanan)
    doc.rect(x + 2 + offsetDiff, y + 0.5 - offsetDiff, numSize, numSize, 'S');

    // 2. Kotak depan
    doc.rect(x + 2, y + 0.5, numSize, numSize, 'S');

    // 3. Teks nomor (01, 02, dst.) di tengah kotak depan
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(BLACK);
    const numStr = String(idx + 1).padStart(2, '0');
    doc.text(numStr, x + 2 + numSize / 2, y + 0.5 + 5.6, { align: 'center' });

    /* --- ekspresi soal --- */
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(BLACK);
    doc.text(exprText(p), x + 14, y + 5.5);

    /* --- kotak jawaban kosong --- */
    const exprW = doc.getTextWidth(exprText(p));
    const boxX  = x + 16 + exprW;
    doc.setDrawColor(BLACK);
    doc.setLineWidth(0.55);
    doc.roundedRect(boxX, y - 0.5, 20, 9, 1.2, 1.2, 'S');
  });
}

export async function exportProblemsPdf(problems: Problem[], meta: PdfMeta) {
  /* muat logo lebih dulu (async), jika gagal tetap lanjut */
  const logoData = await getLogoDataUrl();

  /* A4 LANDSCAPE: 297 × 210 mm */
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
  const pageH = 210;
  const half  = pageH / 2; // 105 mm

  /* Lembar 1 — area atas (y: 0 → 105 mm) */
  drawSheet(doc, problems, meta, 0, half, logoData);

  /* Garis potong di tengah */
  doc.setDrawColor(MID);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([3, 2], 0);
  doc.line(8, half, 289, half);
  doc.setLineDashPattern([], 0);

  // Label gunting
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(MID);
  doc.text('✂  Garis Potong', 148.5, half - 1, { align: 'center' });

  /* Lembar 2 — area bawah (y: 105 → 210 mm) */
  drawSheet(doc, problems, meta, half, pageH, logoData);

  doc.save('terampil-matematika-dasar-soal.pdf');
}
