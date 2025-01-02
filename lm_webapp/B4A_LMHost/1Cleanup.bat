@echo off
REM Define the project directory as the directory where the batch file resides
set "PROJECT_DIR=%~dp0"

 
copy "%PROJECT_DIR%Objects\*.apk" "%PROJECT_DIR%"


REM Delete the folders
echo Deleting folders...
rd /s /q "%PROJECT_DIR%Objects"
rd /s /q "%PROJECT_DIR%AutoBackups"

echo Done.
pause
