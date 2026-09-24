@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d C:\Users\USER\Documents\GitHub\123

echo ============================================================
echo TAXGUARD - RESTORE GIT AND FREEZE M10
echo ============================================================

set "GIT="

for /d %%%%D in ("C:\Users\USER\AppData\Local\GitHubDesktop\app-*") do (
  if exist "%%%%D\resources\app\git\cmd\git.exe" set "GIT=%%%%D\resources\app\git\cmd\git.exe"
)

if not defined GIT if exist "C:\Program Files\Git\cmd\git.exe" set "GIT=C:\Program Files\Git\cmd\git.exe"
if not defined GIT if exist "C:\Program Files (x86)\Git\cmd\git.exe" set "GIT=C:\Program Files (x86)\Git\cmd\git.exe"

if not defined GIT (
  echo ERROR: Git executable was not found.
  echo Open GitHub Desktop once, then run this file again.
  goto :END
)

echo Git found:
echo !GIT!
"!GIT!" --version
if errorlevel 1 goto :END

echo ============================================================
echo VERIFY CURRENT BRANCH
echo ============================================================
"!GIT!" branch --show-current
"!GIT!" status

echo ============================================================
echo FREEZE M10
echo ============================================================
"!GIT!" add -A
if errorlevel 1 goto :END

"!GIT!" commit -m "Freeze M10 Evidence and Decision Provenance"
if errorlevel 1 goto :CHECK_EXISTING
goto :TAG

:CHECK_EXISTING
echo Commit returned non-zero. Checking whether working tree is already clean...
"!GIT!" status --porcelain

:TAG
"!GIT!" rev-parse taxguard-m10-frozen >nul 2>nul
if errorlevel 1 "!GIT!" tag taxguard-m10-frozen

"!GIT!" show-ref --verify --quiet refs/heads/taxguard-m11-development
if errorlevel 1 (
  "!GIT!" switch -c taxguard-m11-development
) else (
  "!GIT!" switch taxguard-m11-development
)
if errorlevel 1 goto :END

echo ============================================================
echo FINAL VERIFICATION
echo ============================================================
"!GIT!" log -1 --oneline
"!GIT!" tag --list taxguard-m10-frozen
"!GIT!" branch --show-current
"!GIT!" status

echo ============================================================
echo M10 FREEZE PROCESS FINISHED
echo ============================================================

:END
echo.
echo Press any key to close this script.
pause >nul
