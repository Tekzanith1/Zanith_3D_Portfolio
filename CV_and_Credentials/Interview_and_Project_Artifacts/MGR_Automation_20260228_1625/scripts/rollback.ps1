# rollback.ps1
# Restores the codebase from the 'backup_old' folder created during the last update.

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$backupDir = Join-Path $ProjectRoot "backup_old"

if (!(Test-Path $backupDir)) {
    Write-Error "No backup folder found in $backupDir. Cannot rollback."
    exit
}

Write-Host "Rolling back to previous version..." -ForegroundColor Yellow

$excludeFromRollback = @(
    "Automation_code_latest_date",
    "backup_old",
    ".pytest_cache",
    "__pycache__",
    "temp_latest",
    ".git"
)

Get-ChildItem -Path $backupDir -Exclude $excludeFromRollback | Copy-Item -Destination $ProjectRoot -Recurse -Force

Write-Host "Rollback completed successfully!" -ForegroundColor Green
