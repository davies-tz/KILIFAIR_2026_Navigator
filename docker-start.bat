@echo off
setlocal
cd /d "%~dp0"

where docker >nul 2>nul
if errorlevel 1 (
  echo Docker was not found. Install Docker Desktop first, then run this file again.
  pause
  exit /b 1
)

docker info >nul 2>nul
if errorlevel 1 (
  echo Docker is installed, but this window cannot connect to Docker Desktop.
  echo.
  echo Try this:
  echo 1. Open Docker Desktop and wait until it says "Engine running".
  echo 2. Right-click docker-start.bat and choose "Run as administrator".
  echo 3. If it still fails, restart Docker Desktop.
  echo.
  echo You can also use local-start.bat if PostgreSQL is already installed locally.
  echo.
  pause
  exit /b 1
)

echo Starting KILIFAIR Navigator with Docker...
docker compose up -d --build
if errorlevel 1 (
  echo.
  echo Docker stopped because of an error. Read the message above.
  echo.
  pause
  exit /b 1
)

echo.
echo KILIFAIR Navigator is starting in Docker.
echo Open this link in your browser:
echo http://localhost:3000
echo.
echo If the first page is slow, wait 20-40 seconds while Next.js compiles.
echo To see logs, run docker-logs.bat.
echo To stop the app, run docker-stop.bat.
echo.
pause
endlocal
