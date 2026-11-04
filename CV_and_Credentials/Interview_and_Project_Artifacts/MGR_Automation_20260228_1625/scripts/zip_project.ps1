# zip_project.ps1
# Zips the current codebase for distribution, excluding temporary and backup files.

# Set the project root to the parent of this scripts folder
$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$zipDir = Join-Path $ProjectRoot "Automation_code_latest_date"
if (!(Test-Path $zipDir)) { New-Item -ItemType Directory -Path $zipDir }

$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$zipFile = Join-Path $zipDir "MGR_Automation_$timestamp.zip"

$excludeList = @(
    "Automation_code_latest_date",
    "backup_old",
    ".pytest_cache",
    "__pycache__",
    "temp_latest",
    "master_failure.png",
    ".git",
    "msedgedriver.exe"
)

Write-Host "Creating zip file: $zipFile" -ForegroundColor Cyan

# Navigate to project root to zip contents correctly
Push-Location $ProjectRoot
Get-ChildItem -Path . -Exclude $excludeList | Compress-Archive -DestinationPath $zipFile -Force
Pop-Location

Write-Host "Zip file created successfully!" -ForegroundColor Green
