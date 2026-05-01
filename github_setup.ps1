Write-Host "🚀 Starting GitHub Setup Automation..." -ForegroundColor Cyan

# Initialize git
Write-Host "Initializing git repository..."
git init

# Add all files
Write-Host "Adding files..."
git add .

# Commit code
Write-Host "Committing code..."
git commit -m "Initial commit: Team Task Manager Full-Stack App"

# Rename branch to main
git branch -M main

# Ask for GitHub repository URL
$RepoUrl = Read-Host "🔗 Please enter your GitHub repository URL (e.g., https://github.com/username/repo.git)"

if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
    Write-Host "❌ Error: Repository URL cannot be empty. Exiting." -ForegroundColor Red
    exit 1
}

# Connect remote origin
Write-Host "Connecting to remote origin..."
git remote add origin $RepoUrl

# Push to GitHub automatically
Write-Host "Pushing to GitHub..."
git push -u origin main

Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
