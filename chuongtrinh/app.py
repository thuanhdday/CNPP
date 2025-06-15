#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Restaurant Website Server
Chạy web server đơn giản để phục vụ website nhà hàng
"""

import os
import sys
import webbrowser
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, unquote
import json
import mimetypes

class RestaurantHTTPRequestHandler(SimpleHTTPRequestHandler):
    """Custom HTTP Request Handler cho website nhà hàng"""
    
    def __init__(self, *args, **kwargs):
        # Thêm các MIME types cho các file đặc biệt
        mimetypes.add_type('application/javascript', '.js')
        mimetypes.add_type('text/css', '.css')
        mimetypes.add_type('image/svg+xml', '.svg')
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        # Thêm CORS headers để cho phép cross-origin requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        """Xử lý GET requests"""
        # Parse URL
        parsed_path = urlparse(self.path)
        path = unquote(parsed_path.path)
        
        # Xử lý các routes đặc biệt
        if path == '/':
            path = '/index.html'
        elif path == '/admin':
            path = '/admin.html'
        elif path == '/login':
            path = '/login.html'
        elif path == '/register':
            path = '/register.html'
        
        # Kiểm tra file tồn tại
        file_path = os.path.join(os.getcwd(), path.lstrip('/'))
        
        if os.path.exists(file_path) and os.path.isfile(file_path):
            # Phục vụ file tĩnh
            super().do_GET()
        else:
            # File không tồn tại, trả về 404
            self.send_error(404, "File not found")
    
    def do_POST(self):
        """Xử lý POST requests cho API giả lập"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            response = self.handle_api_request(data)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self.send_error(500, f"Internal server error: {str(e)}")
    
    def handle_api_request(self, data):
        """Xử lý các API requests giả lập"""
        # Dữ liệu tài khoản mẫu
        users = {
            "admin1@gmail.com": {"password": "Admin123", "role": "admin", "name": "Admin 1"},
            "admin2@gmail.com": {"password": "Admin123", "role": "admin", "name": "Admin 2"},
            "user1@gmail.com": {"password": "User1234", "role": "user", "name": "User 1"},
            "user2@gmail.com": {"password": "User1234", "role": "user", "name": "User 2"}
        }
        
        # Xử lý đăng nhập
        if 'email' in data and 'password' in data:
            email = data['email']
            password = data['password']
            
            if email in users and users[email]['password'] == password:
                return {
                    "status": "success",
                    "message": "Đăng nhập thành công",
                    "user": {
                        "email": email,
                        "name": users[email]['name'],
                        "role": users[email]['role']
                    }
                }
            else:
                return {
                    "status": "error",
                    "message": "Email hoặc mật khẩu không đúng"
                }
        
        # Xử lý đăng ký
        if 'name' in data and 'email' in data and 'password' in data:
            return {
                "status": "success",
                "message": "Đăng ký thành công"
            }
        
        return {
            "status": "error",
            "message": "Invalid request"
        }

class RestaurantServer:
    """Server chính cho website nhà hàng"""
    
    def __init__(self, host='localhost', port=8000):
        self.host = host
        self.port = port
        self.server = None
        self.is_running = False
    
    def start(self):
        """Khởi động server"""
        try:
            # Tạo server
            self.server = HTTPServer((self.host, self.port), RestaurantHTTPRequestHandler)
            self.is_running = True
            
            print("=" * 60)
            print("🍽️  RESTAURANT WEBSITE SERVER")
            print("=" * 60)
            print(f"🌐 Server đang chạy tại: http://{self.host}:{self.port}")
            print(f"📁 Thư mục gốc: {os.getcwd()}")
            print("=" * 60)
            print("📋 Các trang chính:")
            print(f"   • Trang chủ: http://{self.host}:{self.port}/")
            print(f"   • Đăng nhập: http://{self.host}:{self.port}/login")
            print(f"   • Đăng ký: http://{self.host}:{self.port}/register")
            print(f"   • Admin: http://{self.host}:{self.port}/admin")
            print(f"   • Danh sách nhà hàng: http://{self.host}:{self.port}/restaurants-list.html")
            print(f"   • Đặt bàn: http://{self.host}:{self.port}/booking.html")
            print("=" * 60)
            print("🔑 Tài khoản test:")
            print("   • Admin: admin1@gmail.com / Admin123")
            print("   • Admin: admin2@gmail.com / Admin123")
            print("   • User: user1@gmail.com / User1234")
            print("   • User: user2@gmail.com / User1234")
            print("=" * 60)
            print("💡 Nhấn Ctrl+C để dừng server")
            print("=" * 60)
            
            # Mở trình duyệt tự động
            def open_browser():
                time.sleep(1)  # Đợi server khởi động
                webbrowser.open(f'http://{self.host}:{self.port}')
            
            threading.Thread(target=open_browser, daemon=True).start()
            
            # Chạy server
            self.server.serve_forever()
            
        except KeyboardInterrupt:
            print("\n🛑 Đang dừng server...")
            self.stop()
        except Exception as e:
            print(f"❌ Lỗi: {e}")
            self.stop()
    
    def stop(self):
        """Dừng server"""
        if self.server:
            self.server.shutdown()
            self.server.server_close()
            self.is_running = False
            print("✅ Server đã dừng")

def check_requirements():
    """Kiểm tra các yêu cầu cần thiết"""
    print("🔍 Kiểm tra yêu cầu hệ thống...")
    
    # Kiểm tra Python version
    if sys.version_info < (3, 6):
        print("❌ Cần Python 3.6 trở lên")
        return False
    
    # Kiểm tra các file cần thiết
    required_files = [
        'index.html',
        'login.html',
        'admin.html',
        'js/common.js'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Thiếu các file: {', '.join(missing_files)}")
        return False
    
    print("✅ Tất cả yêu cầu đã được đáp ứng")
    return True

def main():
    """Hàm chính"""
    print("🚀 Khởi động Restaurant Website Server...")
    
    # Kiểm tra yêu cầu
    if not check_requirements():
        print("❌ Không thể khởi động server")
        return
    
    # Khởi động server
    server = RestaurantServer()
    server.start()

if __name__ == "__main__":
    main() 