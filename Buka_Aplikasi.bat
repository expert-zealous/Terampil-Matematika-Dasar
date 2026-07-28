@echo off
title Terampil Matematika Dasar
color 0E
cls
echo.
echo   ============================================================
echo      TERAMPIL MATEMATIKA DASAR - Memulai server lokal...
echo   ============================================================
echo.

REM Cek apakah Node.js terinstall
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   [!] Node.js tidak ditemukan.
    echo       Download di: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Masuk ke folder script
cd /d "%~dp0"

REM Cek apakah node_modules sudah ada, kalau belum install
if not exist "node_modules" (
    echo   [*] Menginstall dependensi untuk pertama kali...
    echo       (hanya perlu dilakukan sekali, tunggu beberapa menit)
    echo.
    call npm install
    echo.
)

REM Build kalau dist belum ada
if not exist "dist" (
    echo   [*] Membangun aplikasi...
    call npm run build
    echo.
)

echo   [*] Menjalankan web server lokal...
echo   [*] Aplikasi akan otomatis terbuka di browser.
echo   [*] JANGAN TUTUP jendela ini selama aplikasi dipakai.
echo.
echo   ============================================================
echo.

REM Jalankan dev server yang akan auto-open browser
start "" http://localhost:5173
call npm run dev

pause
