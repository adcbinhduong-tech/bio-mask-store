@echo off
title Dang nhap GitHub CLI
echo ============================================================
echo   DANG NHAP TAI KHOAN GITHUB (adcbinhduong-tech)
echo ============================================================
echo.

:: 1. Bo sung GitHub CLI vao PATH
set "PATH=%LOCALAPPDATA%\Programs\gh;%PATH%"

echo [*] Dang ket noi toi GitHub de lay ma xac thuc...
echo.
echo ============================================================
echo  HUONG DAN:
echo  1. Trinh duyet se mo trang https://github.com/login/device
echo  2. Copy ma code 8 ky tu hien o cua so nay va dan vao trinh duyet
echo  3. Nhan "Authorize github" de hoan tat!
echo ============================================================
echo.

gh auth login --hostname github.com --git-protocol https --web

echo.
echo [*] Kiem tra trang thai dang nhap sau khi xac thuc:
gh auth status

echo.
echo [*] Tu dong cau hinh Git credential:
gh auth setup-git

echo.
echo ============================================================
echo  [HOAN TAT] Ban da dang nhap thanh cong vao GitHub!
echo ============================================================
echo.
pause
