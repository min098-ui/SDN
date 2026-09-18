# Script khởi động nhanh toàn bộ demo
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  DEMO: SLOT 5 (NESTJS) & SLOT 6 (NEXT.JS REST API)      " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Kiểm tra Docker
Write-Host "`n[1/3] Kiểm tra PostgreSQL Database..." -ForegroundColor Green
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Docker đang chạy, tiến hành khởi động PostgreSQL container..." -ForegroundColor Cyan
    docker compose up -d
} else {
    Write-Host "LƯU Ý: Docker Desktop chưa bật." -ForegroundColor Yellow
    Write-Host "Nếu bạn dùng Cloud PostgreSQL (Neon/Supabase), vui lòng đảm bảo đã cập nhật DATABASE_URL trong .env" -ForegroundColor Gray
}

# 2. Hướng dẫn mở 2 terminal
Write-Host "`n[2/3] Để chạy NestJS (Slot 5):" -ForegroundColor Green
Write-Host "   cd slot5-nestjs-api" -ForegroundColor White
Write-Host "   npx prisma migrate dev --name init" -ForegroundColor White
Write-Host "   npm run start:dev" -ForegroundColor White
Write-Host "   --> Truy cập Swagger UI: http://localhost:3001/api" -ForegroundColor Cyan

Write-Host "`n[3/3] Để chạy Next.js (Slot 6):" -ForegroundColor Green
Write-Host "   cd slot6-nextjs-api" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   --> Truy cập Dashboard & API: http://localhost:3000" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
