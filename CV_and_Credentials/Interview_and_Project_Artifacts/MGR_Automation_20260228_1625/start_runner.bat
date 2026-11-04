@echo off
echo Installing UI dependencies...
python -m pip install flask

echo.
echo ========================================================
echo   Starting MGR Automation Runner
echo   Open your browser to: http://localhost:5000
echo ========================================================
python "%~dp0app.py"
pause