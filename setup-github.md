# Quick Setup Guide

I've prepared everything! Here's what to do:

## Option 1: Use the automated script (Easiest)
1. Go to https://github.com/new
2. Create a repository named: `kendcey-portfolio` (or any name you prefer)
3. Make it **PUBLIC**
4. **DO NOT** check any boxes (no README, .gitignore, or license)
5. Click "Create repository"
6. Run: `./deploy-to-github.sh` in this folder
7. Follow the prompts

## Option 2: Manual commands
After creating the repo on GitHub, run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Then enable GitHub Pages:
1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: main, folder: / (root)
4. Save

Your site will be at: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
