#!/bin/bash

# Script to deploy portfolio to GitHub Pages
# Make sure you've created the repository on GitHub first!

echo "🚀 GitHub Pages Deployment Script"
echo "=================================="
echo ""
echo "Before running this script:"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository (e.g., 'kendcey-portfolio')"
echo "3. Make it PUBLIC (required for free GitHub Pages)"
echo "4. DO NOT initialize with README, .gitignore, or license"
echo ""
read -p "Have you created the repository? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please create the repository first, then run this script again."
    exit 1
fi

echo ""
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your repository name: " REPO_NAME

echo ""
echo "Setting up remote and pushing to GitHub..."
echo ""

# Add remote
git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git 2>/dev/null || git remote set-url origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Go to: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings/pages"
    echo "2. Under 'Source', select 'Deploy from a branch'"
    echo "3. Select 'main' branch and '/ (root)' folder"
    echo "4. Click 'Save'"
    echo ""
    echo "Your site will be live at:"
    echo "https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
    echo ""
    echo "⏳ It may take a few minutes for the site to be available."
else
    echo ""
    echo "❌ Error pushing to GitHub. Please check:"
    echo "   - Your repository exists on GitHub"
    echo "   - You have the correct permissions"
    echo "   - Your GitHub credentials are set up"
fi



