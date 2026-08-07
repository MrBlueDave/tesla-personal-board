@echo off
echo ==================================================
echo Tesla Personal Board - Windows Automatic Installer
echo ==================================================

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js v18 or v20+ first.
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo NPM is not installed. Please install NPM first.
    exit /b 1
)

echo Ensuring data directory exists...
if not exist "data" mkdir "data"

if not exist "data\config.json" (
    echo Creating default data\config.json...
    echo { "masterPassword": "tesla" } > data\config.json
)

if not exist "data\user_profiles.json" (
    echo Creating default data\user_profiles.json...
    echo { "activePin": "0000", "profiles": { "0000": { "pin": "0000", "name": "Default User", "catalog": [], "hiddenPresets": [], "favorites": [], "hiddenCategories": [] } } } > data\user_profiles.json
)

echo Installing NPM dependencies...
call npm install
if errorlevel 1 (
    echo npm install failed!
    exit /b 1
)

echo Building production assets...
call npm run build
if errorlevel 1 (
    echo npm run build failed!
    exit /b 1
)

echo.
echo ==================================================
echo Setup completed successfully!
echo ==================================================
echo To start the production server:
echo   npm start
echo.
echo To start the development server:
echo   npm run dev
echo.
echo Default Master Password: tesla
echo ==================================================
