#!/bin/bash

echo "🚀 Starting GitHub Setup Automation..."

# Initialize git
echo "Initializing git repository..."
git init

# Add all files
echo "Adding files..."
git add .

# Commit code
echo "Committing code..."
git commit -m "Initial commit: Team Task Manager Full-Stack App"

# Rename branch to main
git branch -M main

# Ask for GitHub repository URL
read -p "🔗 Please enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "❌ Error: Repository URL cannot be empty. Exiting."
  exit 1
fi

# Connect remote origin
echo "Connecting to remote origin..."
git remote add origin "$REPO_URL"

# Push to GitHub automatically
echo "Pushing to GitHub..."
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
