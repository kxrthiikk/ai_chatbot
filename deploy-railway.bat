@echo off
echo ========================================
echo    Railway Deployment Preparation
echo ========================================
echo.

echo [1/3] Checking Git status...
git status
echo.

echo [2/3] Adding Railway configuration files...
git add railway.json Procfile railway-deploy-guide.md
echo.

echo [3/3] Ready for Railway deployment!
echo.
echo Next steps:
echo 1. Commit and push to GitHub:
echo    git commit -m "Add Railway deployment configuration"
echo    git push origin main
echo.
echo 2. Go to https://railway.app/
echo 3. Sign up with GitHub
echo 4. Create new project from your repository
echo 5. Configure environment variables
echo 6. Deploy!
echo.
echo Your webhook URL will be:
echo https://your-app-name.railway.app/api/whatsapp/webhook
echo.

pause
