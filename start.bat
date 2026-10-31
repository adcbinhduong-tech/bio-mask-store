@echo off
title BIOCELLA Store - Khoi dong he thong Fullstack
echo ============================================================
echo   BIOCELLA - CUA HANG MAT NA SINH HOC MEN DUA BEN TRE
echo ============================================================

:: 1. Kiem tra va khoi dong MySQL tren cong 3306 neu chua chay
netstat -ano | findstr :3306 >nul
if %errorlevel% neq 0 (
    echo [MySQL] Dang khoi dong MySQL Server tren cong 3306...
    start /b "" "C:\Program Files\MariaDB 13.0\bin\mysqld.exe" --datadir="C:\Program Files\MariaDB 13.0\data"
    timeout /t 2 /nobreak >nul
)

:: 2. Chuyen den thu muc du an va chay npm start
cd /d "%~dp0"
echo [BIOCELLA] Dang khoi dong Express Fullstack Server tren Port 5000...
npm start
pause
