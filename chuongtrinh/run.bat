@echo off
echo ============================================================
echo 🍽️  RESTAURANT WEBSITE SERVER
echo ============================================================
echo.
echo 🚀 Đang khởi động server...
echo.

REM Kiểm tra Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Không tìm thấy Python. Vui lòng cài đặt Python 3.6 trở lên.
    echo 📥 Tải Python tại: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Chạy server
python app.py

echo.
echo ✅ Server đã dừng.
pause 