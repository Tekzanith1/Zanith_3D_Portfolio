@echo off
setlocal enabledelayedexpansion
pushd %~dp0..
TITLE One-Click System Setup
color 0B

echo ===================================================
echo     Full System Installer for Automation Project
echo ===================================================
echo.
echo This script will automatically download and install:
echo 1. Python 3.12 (For running the automation)
echo 2. Node.js LTS (Requested runtime)
echo 3. Visual Studio Code (Code Editor)
echo 4. VS Code Extensions (Python tools)
echo 5. Python Libraries (Project dependencies)
echo.

:: Request Admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [INFO] Requesting Administrative privileges...
    powershell -Command "Start-Process '%~dpnx0' -Verb RunAs"
    exit /b
)

set "TEMP_DIR=%~dp0.installers"
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

echo [1/5] Checking for Python 3.12...
set "PYTHON_INSTALLED=0"
if exist "C:\Program Files\Python312\python.exe" set "PYTHON_INSTALLED=1"
python --version >nul 2>&1
if %errorlevel% equ 0 set "PYTHON_INSTALLED=1"

if "!PYTHON_INSTALLED!"=="1" (
    echo [SKIP] Python is already installed.
) else (
    echo [INFO] Python not found. Downloading and Installing...
    set "PYTHON_EXE=%TEMP_DIR%\installer_python.exe"
    if not exist "!PYTHON_EXE!" (
        powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.12.2/python-3.12.2-amd64.exe' -OutFile '!PYTHON_EXE!'"
    )
    echo Installing Python... (This may take a minute)
    "!PYTHON_EXE!" /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
)

echo [2/5] Checking for Node.js...
node -v >nul 2>&1
if %errorlevel% equ 0 (
    echo [SKIP] Node.js is already installed.
) else (
    echo [INFO] Node.js not found. Downloading and Installing...
    set "NODE_MSI=%TEMP_DIR%\installer_node.msi"
    if not exist "!NODE_MSI!" (
        powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile '!NODE_MSI!'"
    )
    echo Installing Node.js...
    msiexec /i "!NODE_MSI!" /quiet /norestart
)

echo [3/5] Checking for Visual Studio Code...
set "VSCODE_INSTALLED=0"
if exist "C:\Program Files\Microsoft VS Code\bin\code.cmd" set "VSCODE_INSTALLED=1"
if exist "%LocalAppData%\Programs\Microsoft VS Code\bin\code.cmd" set "VSCODE_INSTALLED=1"
code --version >nul 2>&1
if %errorlevel% equ 0 set "VSCODE_INSTALLED=1"

if "!VSCODE_INSTALLED!"=="1" (
    echo [SKIP] VS Code is already installed.
) else (
    echo [INFO] VS Code not found. Downloading and Installing...
    set "VSCODE_EXE=%TEMP_DIR%\installer_vscode.exe"
    if not exist "!VSCODE_EXE!" (
        powershell -Command "Invoke-WebRequest -Uri 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64' -OutFile '!VSCODE_EXE!'"
    )
    echo Installing VS Code...
    "!VSCODE_EXE!" /verysilent /mergetasks=!runcode,addcontextmenufiles,addcontextmenufolders,addtopath
)

echo.
echo Locating installed applications and refreshing PATH...

:: Try to refresh PATH for the current session
set "PATH=%PATH%;C:\Program Files\Python312;C:\Program Files\Python312\Scripts;C:\Program Files\Microsoft VS Code\bin;%LocalAppData%\Programs\Microsoft VS Code\bin"

set "PY_CMD=python"
if exist "C:\Program Files\Python312\python.exe" (
    set "PY_CMD="C:\Program Files\Python312\python.exe""
) else (
    where python >nul 2>&1
    if !errorlevel! neq 0 (
        echo [WARNING] Python executable not found in standard paths. Trying 'py'...
        set "PY_CMD=py"
    )
)

set "CODE_CMD=code"
where code >nul 2>&1
if !errorlevel! neq 0 (
    if exist "C:\Program Files\Microsoft VS Code\bin\code.cmd" (
        set "CODE_CMD="C:\Program Files\Microsoft VS Code\bin\code.cmd""
    ) else if exist "%LocalAppData%\Programs\Microsoft VS Code\bin\code.cmd" (
        set "CODE_CMD="%LocalAppData%\Programs\Microsoft VS Code\bin\code.cmd""
    )
)

echo [4/5] Installing VS Code Extensions...
call "!CODE_CMD!" --install-extension ms-python.python --force
call "!CODE_CMD!" --install-extension ms-python.vscode-pylance --force

echo [5/5] Installing Python Dependencies...
call "!PY_CMD!" -m pip install --upgrade pip
call "!PY_CMD!" -m pip install -r "requirements.txt"

echo.
echo Cleaning up temporary installers...
rmdir /s /q "%TEMP_DIR%"

echo ===================================================
echo   [SUCCESS] Setup Complete! 
echo   All applications, extensions, and libraries 
echo   have been installed.
echo.
echo   IMPORTANT: Please restart your computer or 
echo   close and reopen your terminal to ensure all 
echo   new applications are fully recognized.
echo ===================================================
popd
pause
