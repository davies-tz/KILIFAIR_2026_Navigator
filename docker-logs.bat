@echo off
setlocal
cd /d "%~dp0"

echo Showing KILIFAIR Navigator logs...
docker compose logs -f app
if errorlevel 1 (
  echo.
  echo Docker logs could not be opened. Try running this file as administrator.
  pause
)

endlocal
