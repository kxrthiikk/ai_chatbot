@echo off
echo ========================================
echo    Dental WhatsApp Bot - Ngrok Setup
echo ========================================
echo.

echo [1/4] Starting Rasa Server...
cd rasa
start "Rasa Server" cmd /k "py -3.10 -m rasa run --enable-api --cors \"*\" --port 5005"
echo Rasa server started on port 5005
echo.

echo [2/4] Starting Node.js Backend...
cd ..\backend
start "Node.js Backend" cmd /k "npm start"
echo Backend server started on port 3000
echo.

echo [3/4] Ngrok Setup...
echo.
echo Please download ngrok from https://ngrok.com/download
echo Extract ngrok.exe to this directory
echo.
echo Then run: ngrok http 3000
echo.
echo This will give you a public URL like: https://abc123.ngrok.io
echo.

echo [4/4] Meta Webhook Configuration...
echo.
echo Use the ngrok URL in your Meta webhook:
echo.
echo Webhook URL: https://abc123.ngrok.io/api/whatsapp/webhook
echo Verify Token: (use your custom token from .env file)
echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Services running:
echo - Rasa: http://localhost:5005
echo - Backend: http://localhost:3000
echo - Ngrok: (run ngrok http 3000 to get public URL)
echo.
echo Next steps:
echo 1. Download and run ngrok
echo 2. Configure Meta webhook with ngrok URL
echo 3. Test the integration
echo.
pause
