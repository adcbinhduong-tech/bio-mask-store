@echo off
title BIOCELLA - Day ma nguon len GitHub adcbinhduong-tech
echo ============================================================
echo   BIOCELLA - PUSH DU AN LEN GITHUB (adcbinhduong-tech)
echo ============================================================
echo.

:: 1. Thiet lap duong dan den repository GitHub cua ban
set REPO_URL=https://github.com/adcbinhduong-tech/bio-mask-store.git

:: 2. Kiem tra va gan remote origin
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Dang thiet lap remote origin: %REPO_URL%
    git remote add origin %REPO_URL%
) else (
    echo [*] Remote origin hien tai:
    git remote -v
)

:: 3. Them cac thay doi moi (luon bao dam bo qua file .env theo .gitignore)
echo.
echo [*] Kiem tra trang thai Git...
git add .
git status -s

:: 4. Day code len nhanh main
echo.
echo [*] Dang day code len GitHub nhanh main...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo [THANH CONG] Ma nguon da duoc day len GitHub thanh cong!
    echo Truy cap: https://github.com/adcbinhduong-tech/bio-mask-store
    echo ============================================================
) else (
    echo.
    echo ============================================================
    echo [HUONG DAN KHAC PHUC]:
    echo 1. Hay dam bao ban da tao Repository ten 'bio-mask-store' tai:
    echo    https://github.com/new
    echo 2. Khi trinh duyet bat len yeu cau xac thuc GitHub, chon 'Sign in with your browser'.
    echo ============================================================
)

echo.
pause
