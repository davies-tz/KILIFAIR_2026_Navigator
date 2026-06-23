@echo off
setlocal
cd /d "%~dp0"

echo Stopping KILIFAIR Navigator containers...
docker compose down
if errorlevel 1 (
  echo.
  echo Docker could not stop the containers. Try running this file as administrator.
)

pause
endlocal
