@echo off
echo ========================================
echo    Getting Ngrok URL for Webhook
echo ========================================
echo.

echo Checking ngrok tunnels...
timeout /t 3 /nobreak >nul

echo.
echo If ngrok is running, you should see a URL like:
echo https://abc123.ngrok.io
echo.
echo Open your browser and go to: http://localhost:4040
echo This will show you the ngrok dashboard with your public URL.
echo.

echo ========================================
echo    Meta Webhook Configuration
echo ========================================
echo.
echo Once you have your ngrok URL, configure Meta webhook:
echo.
echo 1. Go to Meta Developer Console
echo 2. Navigate to your WhatsApp Business app
echo 3. Go to "Configuration" → "Webhooks"
echo 4. Click "Configure"
echo 5. Enter the following:
echo    - Webhook URL: https://YOUR-NGROK-URL.ngrok.io/api/whatsapp/webhook
echo    - Verify Token: (use the value from your .env file)
echo 6. Select these fields:
echo    - ✅ messages
echo    - ✅ message_deliveries
echo    - ✅ message_reads
echo 7. Click "Verify and Save"
echo.

echo ========================================
echo    Testing Your Webhook
echo ========================================
echo.
echo To test your webhook, you can:
echo.
echo 1. Send a message to your WhatsApp Business number
echo 2. Check your server logs for incoming messages
echo 3. Verify responses are sent back
echo.

echo ========================================
echo    Services Status
echo ========================================
echo.
echo Checking if services are running...
netstat -an | findstr ":3000" >nul && echo ✅ Backend (port 3000) - Running || echo ❌ Backend (port 3000) - Not running
netstat -an | findstr ":5005" >nul && echo ✅ Rasa (port 5005) - Running || echo ❌ Rasa (port 5005) - Not running
netstat -an | findstr ":4040" >nul && echo ✅ Ngrok (port 4040) - Running || echo ❌ Ngrok (port 4040) - Not running
echo.

pause
