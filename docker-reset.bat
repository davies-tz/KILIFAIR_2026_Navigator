@echo off
setlocal
cd /d "%~dp0"

echo This will stop Docker containers and delete the local PostgreSQL Docker volume.
echo Your seeded demo data will be recreated next time you run docker-start.bat.
choice /C YN /M "Reset Docker database"
if errorlevel 2 (
  echo Reset cancelled.
  pause
  exit /b 0
)

docker compose down -v
echo Docker database reset complete.
pause
endlocal
