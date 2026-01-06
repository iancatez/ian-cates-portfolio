# PowerShell script to create a PR for a task group branch
# Usage: .\scripts\create-pr.ps1 -TaskNumber [number] -Description "[description]"
# Example: .\scripts\create-pr.ps1 -TaskNumber 1 -Description "Core Animation Setup"

param(
    [Parameter(Mandatory=$true)]
    [int]$TaskNumber,
    
    [Parameter(Mandatory=$true)]
    [string]$Description
)

# Convert description to kebab-case
$kebabDescription = $Description.ToLower() -replace '\s+', '-'
$branchName = "task-group-$TaskNumber-$kebabDescription"

# Check if branch exists
$branchExists = git branch --list $branchName
if (-not $branchExists) {
    Write-Host "Error: Branch '$branchName' does not exist locally." -ForegroundColor Red
    Write-Host "Create the branch first using: .\scripts\create-task-branch.ps1 -TaskNumber $TaskNumber -Description '$Description'"
    exit 1
}

# Check if we're on the branch
$currentBranch = git branch --show-current
if ($currentBranch -ne $branchName) {
    Write-Host "Switching to branch: $branchName" -ForegroundColor Cyan
    git checkout $branchName
}

# Check if branch is pushed
$remoteBranch = git ls-remote --heads origin $branchName
if (-not $remoteBranch) {
    Write-Host "Pushing branch to remote..." -ForegroundColor Cyan
    git push -u origin $branchName
}

# Create PR body
$prBody = @"
## Task Group $TaskNumber: $Description

### Changes
- [List major changes implemented in this task group]

### Testing
- [x] Build succeeds (`npm run build`)
- [x] No TypeScript errors
- [x] Tested locally (`npm run dev`)
- [x] All acceptance criteria met

### Related
- Related to: Task Group $TaskNumber from AGENT_TASKS.md
"@

# Create PR using GitHub CLI
Write-Host "Creating Pull Request..." -ForegroundColor Cyan
try {
    gh pr create --title "Task Group $TaskNumber: $Description" --body $prBody --base master
    Write-Host ""
    Write-Host "✅ Pull Request created successfully!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "Error creating PR. You may need to:" -ForegroundColor Yellow
    Write-Host "1. Install GitHub CLI: https://cli.github.com/"
    Write-Host "2. Authenticate: gh auth login"
    Write-Host "3. Or create PR manually at: https://github.com/[owner]/[repo]/compare/master...$branchName"
}

