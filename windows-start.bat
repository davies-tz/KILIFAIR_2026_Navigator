@echo off
setlocal
cd /d "%~dp0"

echo ==============================================
echo  KILIFAIR 2026 Navigator - Windows Start
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js LTS first.
  pause
  exit /b 1
)

where docker >nul 2>nul
if errorlevel 1 (
  echo Docker was not found. This script can still work if you already have PostgreSQL running.
  echo If PostgreSQL is not installed, install Docker Desktop or PostgreSQL first.
) else (
  docker info >nul 2>nul
  if not errorlevel 1 (
    docker ps -a --format "{{.Names}}" | findstr /x "kilifair-postgres" >nul
    if errorlevel 1 (
      echo Creating PostgreSQL container kilifair-postgres...
      docker run --name kilifair-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=kilifair123 -e POSTGRES_DB=kilifair -p 5432:5432 -d postgres:16
    ) else (
      echo Starting existing PostgreSQL container kilifair-postgres...
      docker start kilifair-postgres >nul 2>nul
    )
    echo Waiting for PostgreSQL to become ready...
    timeout /t 5 /nobreak >nul
  ) else (
    echo Docker Desktop is installed but not running. Open Docker Desktop, then run this again.
  )
)

if not exist ".env" (
  echo Creating .env from .env.example...
  copy ".env.example" ".env" >nul
)

echo Installing dependencies...
call npm.cmd install --legacy-peer-deps
if errorlevel 1 goto error

echo Generating Prisma client...
call npx.cmd prisma generate
if errorlevel 1 goto error

echo Preparing database tables...
call npx.cmd prisma db push
if errorlevel 1 goto error

echo Seeding KILIFAIR exhibitors and booths...
call npm.cmd run prisma:seed
if errorlevel 1 goto error

echo.
echo Starting app. Open http://localhost:3000
echo.
call npm.cmd run dev
if errorlevel 1 goto error

goto done

:error
echo.
echo The app could not start. Read the error above.
echo Most common fixes:
echo 1. Make sure .env DATABASE_URL uses: postgresql://postgres:kilifair123@localhost:5432/kilifair
echo 2. Make sure Docker Desktop is running if you rely on Docker PostgreSQL.
echo 3. If PowerShell blocks npm/npx, use this .bat file or run npm.cmd/npx.cmd.
pause
exit /b 1

:done
pause
endlocal
