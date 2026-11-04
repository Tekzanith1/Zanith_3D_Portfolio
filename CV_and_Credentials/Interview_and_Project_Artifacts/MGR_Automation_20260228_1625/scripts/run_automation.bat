@echo off
pushd %~dp0..
echo ===================================================
echo     Starting MGR Master Automation Workflow
echo ===================================================
echo Current Directory: %cd%
python master_workflow.py
echo ===================================================
echo Workflow completed. Check master_failure.png if it failed.
popd
pause
