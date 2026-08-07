# Script cấu hình Windows Firewall cho WebAtlas
# Mở Port 80 (WebGIS) và Port 5432 (PostGIS Database) cho các máy khác trong mạng kết nối.

Write-Host "Đang cấu hình Windows Firewall cho WebAtlas..." -ForegroundColor Cyan

# Mở Port 80 cho HTTP WebGIS
New-NetFirewallRule -DisplayName "WebAtlas WebGIS (Port 80)" `
                    -Direction Inbound `
                    -LocalPort 80 `
                    -Protocol TCP `
                    -Action Allow `
                    -Enabled True `
                    -ErrorAction SilentlyContinue

# Mở Port 5432 cho PostgreSQL/PostGIS Database
New-NetFirewallRule -DisplayName "WebAtlas PostGIS Database (Port 5432)" `
                    -Direction Inbound `
                    -LocalPort 5432 `
                    -Protocol TCP `
                    -Action Allow `
                    -Enabled True `
                    -ErrorAction SilentlyContinue

Write-Host "Cấu hình Firewall hoàn tất! Cổng 80 và 5432 đã sẵn sàng nhận kết nối." -ForegroundColor Green
