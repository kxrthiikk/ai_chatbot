@echo off
echo ========================================
echo    Dental WhatsApp Bot Setup Script
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend
echo Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend setup complete!
echo.
echo Please create a .env file in the backend directory
echo Copy env.example to .env and configure your settings
echo.

echo [2/4] Setting up Frontend...
echo Two frontend options available:
echo 1. Simple HTML frontend (frontend-simple) - No npm required
echo 2. React frontend (frontend-react) - Requires Node.js 18+
echo.
echo React frontend setup...
cd frontend-react
call npm install
if %errorlevel% neq 0 (
    echo Warning: React frontend setup failed, using HTML frontend only
) else (
    echo React frontend setup complete!
)
cd ..
echo Frontend setup complete!
echo.

echo [3/4] Setting up NLP (Rasa Alternative)...
cd ..\rasa
echo Checking Python version compatibility...
python --version
echo.
echo Note: Rasa requires Python 3.7-3.11. Python 3.13 is not supported.
echo Using lightweight NLP solution built into Node.js backend...
echo This approach uses simple keyword matching and pattern recognition.
echo No additional Python packages required.
echo.
echo NLP setup complete!
echo.

echo [4/4] Database Setup...
echo Please run the following command to set up the database:
echo mysql -u root -p ^< mysql/schema.sql
echo.

echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Set up MySQL database using mysql/schema.sql
echo 2. Configure .env file in backend directory
echo 3. Start the services:
echo    - Backend: cd backend ^& npm start
echo    - Frontend Options:
echo      * HTML: Open frontend-simple/index.html in your browser
echo      * React: cd frontend-react ^& npm start
echo    - Note: Rasa is replaced with built-in NLP in the Node.js backend
echo.
echo For detailed instructions, see README.md
echo.
pause
