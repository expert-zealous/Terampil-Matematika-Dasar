# Terampil Matematika Dasar — Expert Zealous

Aplikasi latihan operasi hitung bilangan bulat: penjumlahan, pengurangan, perkalian, pembagian.
Tampilan neon (merah marun • gold • biru tua), keyboard virtual, mode tes berlevel, dan cetak PDF 2 lembar per halaman.

---

## ✅ CARA PALING MUDAH — Klik Ganda Saja

Buka file ini:

```
BUKA-APLIKASI-OFFLINE.html
```

**Klik ganda file tersebut → aplikasi langsung jalan.**

- Tidak perlu install apa pun
- Tidak perlu internet
- Tidak perlu server
- Logo sudah tertanam di dalam file (tidak butuh file gambar terpisah)
- File ini **berdiri sendiri** — boleh dipindah/dicopy ke mana saja, tetap jalan

> Ini adalah file yang harus Anda pakai sehari-hari untuk mengajar.

---

## ❓ Kenapa `index.html` yang lain tampil "Memuat aplikasi..." terus?

File `index.html` di folder utama dan di folder `dist/` adalah versi **React**.
Browser modern **memblokir** aplikasi React yang dibuka lewat klik ganda (protokol `file://`)
karena alasan keamanan — ini kebijakan browser, bukan kerusakan aplikasi.

Versi React hanya bisa jalan lewat web server. **Solusi: gunakan `BUKA-APLIKASI-OFFLINE.html`** di atas.

---

## 🌐 Menjalankan Versi React (opsional, untuk pengembang)

Butuh Node.js (https://nodejs.org).

```bash
npm install
npm run dev
```

Buka URL yang muncul, biasanya http://localhost:5173

Atau versi produksi:

```bash
npm run build
npx serve dist
```

Pengguna Windows juga bisa klik ganda `Buka_Aplikasi.bat`.

---

## 📚 Fitur

**Dashboard atas**
- Tab **Latihan** dan **Tes**
- Pilihan operasi: penjumlahan / pengurangan / perkalian / pembagian / acak semua
- Jenis bilangan: **Asli** atau **Bulat** (mendukung angka negatif)
- Interval angka bebas diatur (minimum – maksimum)
- Tombol **Soal Baru** dan **Cetak PDF**
- Statistik langsung: Benar / Salah / Sisa

**Lembar soal**
- 10 soal dalam 2 kolom
- Nomor soal berbentuk **kotak tumpuk ganda**
- Kotak jawaban besar, angka jelas terlihat
- Benar → ✅ centang hijau menyala | Salah → ❌ silang merah + animasi goyang

**Keyboard virtual** (di bawah soal, tidak menutupi)
- Angka 0–9, tombol hapus ⌫, tombol minus −, tombol OK
- Keyboard fisik komputer juga bisa dipakai

**Mode Tes**
- Level 1 Penjumlahan → Level 2 Pengurangan → Level 3 Perkalian → Level 4 Pembagian → Level 5 Campuran acak
- Bintang ★ sesuai level (Level 1 = 1 bintang, dst.)
- Lulus minimal 8/10 untuk membuka level berikutnya
- Progres tersimpan otomatis di browser

**Cetak PDF**
- **Hitam-putih murni** — hemat tinta, tajam saat diprint
- **1 halaman A4 = 2 lembar soal identik**, dipisah garis potong ✂
- Tinggal gunting di tengah → dapat 2 lembar untuk 2 siswa
- Kotak jawaban kosong (tanpa tanda tanya) supaya tulisan siswa jelas
- Kop lengkap: logo Expert Zealous, kolom Nama / Kelas / Nilai

---

© Expert Zealous — Jagonya Les Private Matematika
