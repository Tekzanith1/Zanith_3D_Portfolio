# sync_latest.ps1
# This script performs an update from the latest zip in the 'Automation_code_latest_date' folder.
# It automatically backs up the current state before overwriting.

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$zipDir = Join-Path $ProjectRoot "Automation_code_latest_date"
$backupDir = Join-Path $ProjectRoot "backup_old"

# 1. Find the latest zip
$latestZip = Get-ChildItem -Path $zipDir -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($null -eq $latestZip) {
    Write-Error "❌ No zip files found in $zipDir"
    exit
}

Write-Host "Found latest zip: $($latestZip.Name)" -ForegroundColor Cyan

# 2. Create Backup
Write-Host "Backing up current code to $backupDir..." -ForegroundColor Cyan
if (Test-Path $backupDir) { Remove-Item -Path $backupDir -Recurse -Force }
New-Item -ItemType Directory -Path $backupDir

$excludeFromBackup = @(
    "Automation_code_latest_date",
    "backup_old",
    ".pytest_cache",
    "__pycache__",
    "temp_latest",
    ".git"
)

Get-ChildItem -Path $ProjectRoot -Exclude $excludeFromBackup | Copy-Item -Destination $backupDir -Recurse -Force

# 3. Extract Latest Zip
Write-Host "Extracting latest update..." -ForegroundColor Yellow
Expand-Archive -Path $latestZip.FullName -DestinationPath $ProjectRoot -Force

Write-Host "Update completed successfully!" -ForegroundColor Green
Write-Host "If anything broke, run 'rollback.ps1' to restore." -ForegroundColor White
