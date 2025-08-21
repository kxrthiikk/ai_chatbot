@echo off
echo ========================================
echo    Dental WhatsApp Bot - Nginx Setup
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

echo [3/4] Nginx Configuration...
echo.
echo Please install nginx and configure it with the nginx.conf file
echo.
echo Steps:
echo 1. Download nginx from http://nginx.org/en/download.html
echo 2. Extract to C:\nginx
echo 3. Copy nginx.conf to C:\nginx\conf\nginx.conf
echo 4. Update the server_name in nginx.conf with your domain
echo 5. Run: C:\nginx\nginx.exe
echo.

echo [4/4] Meta Webhook Configuration...
echo.
echo Once nginx is running, configure your Meta webhook:
echo.
echo Webhook URL: https://your-domain.com/api/whatsapp/webhook
echo Verify Token: (use your custom token)
echo.
echo For testing, you can also use ngrok:
echo 1. Download ngrok from https://ngrok.com
echo 2. Run: ngrok http 80
echo 3. Use the ngrok URL as your webhook
echo.

echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Services running:
echo - Rasa: http://localhost:5005
echo - Backend: http://localhost:3000
echo - Nginx: http://localhost:80
echo.
echo Next steps:
echo 1. Configure nginx with your domain
echo 2. Set up SSL certificates
echo 3. Configure Meta webhook
echo 4. Test the integration
echo.
pause
