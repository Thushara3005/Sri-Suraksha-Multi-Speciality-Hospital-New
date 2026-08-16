@echo off
setlocal enabledelayedexpansion

set "SOURCE=C:\Users\Admin\Downloads\WhatsApp Image 2026-08-14 at 14.21.03.jpeg"
set "DEST=d:\SriSurakshaHospital-Fresh\public\dr-triveni-reddy-new.png"

echo Checking source file...
if exist "!SOURCE!" (
    echo Source file found
    echo Copying file...
    copy "!SOURCE!" "!DEST!" /Y
    echo Checking destination...
    if exist "!DEST!" (
        echo SUCCESS - File copied
        dir "!DEST!"
    ) else (
        echo FAILED - Destination file not created
    )
) else (
    echo ERROR - Source file not found: !SOURCE!
)
pause
