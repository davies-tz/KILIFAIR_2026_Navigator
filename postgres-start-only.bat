@echo off
setlocal
where docker >nul 2>nul
if errorlevel 1 (
  echo Docker was not found. Install Docker Desktop first.
  pause
  exit /b 1
)

docker info >nul 2>nul
if errorlevel 1 (
  echo Docker Desktop is not running. Open Docker Desktop first.
  pause
  exit /b 1
)

docker ps -a --format "{{.Names}}" | findstr /x "kilifair-postgres" >nul
if errorlevel 1 (
  docker run --name kilifair-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=kilifair123 -e POSTGRES_DB=kilifair -p 5432:5432 -d postgres:16
) else (
  docker start kilifair-postgres
)

echo PostgreSQL is available at localhost:5432
echo DATABASE_URL="postgresql://postgres:kilifair123@localhost:5432/kilifair"
pause
endlocal
