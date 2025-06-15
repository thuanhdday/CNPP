#!/bin/bash

echo "============================================================"
echo "🍽️  RESTAURANT WEBSITE SERVER"
echo "============================================================"
echo ""
echo "🚀 Đang khởi động server..."
echo ""

# Kiểm tra Python
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ Không tìm thấy Python. Vui lòng cài đặt Python 3.6 trở lên."
        echo "📥 Tải Python tại: https://www.python.org/downloads/"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

# Kiểm tra version Python
$PYTHON_CMD --version

# Chạy server
$PYTHON_CMD app.py

echo ""
echo "✅ Server đã dừng." 