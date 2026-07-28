#!/usr/bin/env bash
# Terampil Matematika Dasar - Launcher untuk macOS / Linux
set -e

echo ""
echo "============================================================"
echo "  TERAMPIL MATEMATIKA DASAR - Memulai server lokal..."
echo "============================================================"
echo ""

# Masuk ke folder script
cd "$(dirname "$0")"

# Cek Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "  [!] Node.js tidak ditemukan."
  echo "      Download di: https://nodejs.org"
  echo ""
  read -p "Tekan ENTER untuk keluar..." _
  exit 1
fi

# Install dependensi jika belum ada
if [ ! -d "node_modules" ]; then
  echo "  [*] Menginstall dependensi untuk pertama kali..."
  echo "      (hanya perlu dilakukan sekali)"
  echo ""
  npm install
  echo ""
fi

# Build jika dist belum ada
if [ ! -d "dist" ]; then
  echo "  [*] Membangun aplikasi..."
  npm run build
  echo ""
fi

echo "  [*] Menjalankan web server lokal..."
echo "  [*] Aplikasi akan otomatis terbuka di browser."
echo "  [*] JANGAN TUTUP jendela ini selama aplikasi dipakai."
echo ""
echo "============================================================"
echo ""

# Buka browser di background (macOS = open, Linux = xdg-open)
(
  sleep 2
  if command -v open >/dev/null 2>&1; then
    open http://localhost:5173
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open http://localhost:5173
  fi
) &

npm run dev
