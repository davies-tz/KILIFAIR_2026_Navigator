@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js/npm was not found. Install Node.js first, then run this file again.
  pause
  exit /b 1
)

if not exist ".env" (
  echo Creating .env from .env.example...
  copy ".env.example" ".env" >nul
)

echo Installing dependencies if needed...
if not exist "node_modules" (
  call npm.cmd install --legacy-peer-deps
  if errorlevel 1 goto error
)

echo Preparing database from Prisma schema...
call npm.cmd run prisma:generate
if errorlevel 1 goto error

call npx.cmd prisma db push
if errorlevel 1 goto error

call npm.cmd run prisma:seed
if errorlevel 1 goto error

echo Starting KILIFAIR Navigator...
echo Open http://localhost:3000 in your browser.
call npm.cmd run dev
if errorlevel 1 goto error

goto done

:error
echo.
echo The app could not start. Read the error message above.
echo Common cause: PostgreSQL is not running or DATABASE_URL in .env is wrong.
pause
exit /b 1

:done
pause
endlocal
