# PowerShell script to create a new branch for a task group
# Usage: .\scripts\create-task-branch.ps1 -TaskNumber [number] -Description "[description]"
# Example: .\scripts\create-task-branch.ps1 -TaskNumber 1 -Description "Core Animation Setup"

param(
    [Parameter(Mandatory=$true)]
    [int]$TaskNumber,
    
    [Parameter(Mandatory=$true)]
    [string]$Description
)

# Convert description to kebab-case
$kebabDescription = $Description.ToLower() -replace '\s+', '-'
$branchName = "task-group-$TaskNumber-$kebabDescription"

# Ensure we're on master/main
$currentBranch = git branch --show-current
if ($currentBranch -ne "master" -and $currentBranch -ne "main") {
    Write-Warning "Not on master/main branch. Current branch: $currentBranch"
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Pull latest changes
Write-Host "Pulling latest changes from master..." -ForegroundColor Cyan
try {
    git pull origin master 2>$null
} catch {
    try {
        git pull origin main 2>$null
    } catch {
        Write-Host "No remote branch found, continuing..." -ForegroundColor Yellow
    }
}

# Create and checkout new branch
Write-Host "Creating branch: $branchName" -ForegroundColor Cyan
git checkout -b $branchName

Write-Host ""
Write-Host "✅ Branch created: $branchName" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Complete the task group work"
Write-Host "2. Test: npm run build"
Write-Host "3. Commit: git add -A; git commit -m 'feat: Task Group $TaskNumber - $Description'"
Write-Host "4. Push: git push -u origin $branchName"
Write-Host "5. Create PR: gh pr create --title 'Task Group $TaskNumber: $Description'"

