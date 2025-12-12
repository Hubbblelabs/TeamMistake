@echo off
REM Admin Dashboard Setup Script for Windows
REM This script helps you create your first admin user

echo.
echo ============================================
echo TeamMistake Admin Dashboard Setup
echo ============================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo Error: .env.local file not found!
    echo Please copy .env.example to .env.local and fill in the values
    echo Example: copy .env.example .env.local
    pause
    exit /b 1
)

echo Please enter your admin details:
echo.

set /p ADMIN_EMAIL="Admin Email: "
set /p ADMIN_NAME="Admin Name: "
set /p ADMIN_PASSWORD="Admin Password: "
set /p ADMIN_SECRET="Admin Setup Secret (from .env.local): "

echo.
echo Creating admin user with:
echo   Email: %ADMIN_EMAIL%
echo   Name: %ADMIN_NAME%
echo.

set /p CONFIRM="Is this correct? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo Cancelled.
    pause
    exit /b 0
)

echo.
echo Checking if development server is running...

REM Try to ping the server
curl -s http://localhost:3000 > nul 2>&1
if errorlevel 1 (
    echo.
    echo Warning: Development server might not be running!
    echo Please make sure to start it with: npm run dev
    echo.
    pause
)

echo.
echo Creating admin user...
echo.

curl -X POST http://localhost:3000/api/admin/setup ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%ADMIN_EMAIL%\",\"password\":\"%ADMIN_PASSWORD%\",\"name\":\"%ADMIN_NAME%\",\"secret\":\"%ADMIN_SECRET%\"}"

echo.
echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo If successful, you can now login at:
echo http://localhost:3000/admin/login
echo.
echo Email: %ADMIN_EMAIL%
echo Password: (the one you entered)
echo.
echo Important: For security, consider disabling the
echo /api/admin/setup endpoint after creating your admin user.
echo.
pause
