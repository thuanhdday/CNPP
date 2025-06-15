# 🍽️ Restaurant Website

Website nhà hàng với đầy đủ chức năng đặt bàn, quản lý đơn hàng và giao diện admin.

## 🚀 Cách chạy chương trình

### Yêu cầu hệ thống
- Python 3.6 trở lên
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)

### Cách 1: Chạy bằng Python (Khuyến nghị)

1. **Mở terminal/command prompt**
2. **Di chuyển đến thư mục dự án**
   ```bash
   cd đường/dẫn/đến/thư/mục/dự/án
   ```

3. **Chạy server**
   ```bash
   python app.py
   ```
   hoặc
   ```bash
   python3 app.py
   ```

4. **Trình duyệt sẽ tự động mở** tại địa chỉ: `http://localhost:8000`

### Cách 2: Chạy bằng HTTP Server đơn giản

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Sau đó mở trình duyệt và truy cập: `http://localhost:8000`

## 📋 Các trang chính

- **Trang chủ**: `http://localhost:8000/`
- **Đăng nhập**: `http://localhost:8000/login`
- **Đăng ký**: `http://localhost:8000/register`
- **Admin**: `http://localhost:8000/admin`
- **Danh sách nhà hàng**: `http://localhost:8000/restaurants-list.html`
- **Chi tiết nhà hàng**: `http://localhost:8000/restaurant-detail.html`
- **Đặt bàn**: `http://localhost:8000/booking.html`

## 🔑 Tài khoản test

### Tài khoản Admin
- **Email**: `admin1@gmail.com` | **Mật khẩu**: `Admin123`
- **Email**: `admin2@gmail.com` | **Mật khẩu**: `Admin123`

### Tài khoản User
- **Email**: `user1@gmail.com` | **Mật khẩu**: `User1234`
- **Email**: `user2@gmail.com` | **Mật khẩu**: `User1234`

## 🛠️ Tính năng chính

### Cho khách hàng
- ✅ Xem danh sách nhà hàng
- ✅ Tìm kiếm và lọc nhà hàng
- ✅ Xem chi tiết nhà hàng và menu
- ✅ Đặt bàn trực tuyến
- ✅ Đánh giá nhà hàng
- ✅ Yêu thích nhà hàng
- ✅ Đăng ký/Đăng nhập

### Cho Admin
- ✅ Dashboard thống kê
- ✅ Quản lý đơn hàng
- ✅ Quản lý đặt bàn
- ✅ Quản lý bàn
- ✅ Quản lý nhân viên
- ✅ Báo cáo doanh thu

## 📁 Cấu trúc thư mục

```
restaurant-website/
├── app.py                 # Server Python chính
├── requirements.txt       # Yêu cầu hệ thống
├── README.md             # Hướng dẫn sử dụng
├── index.html            # Trang chủ
├── login.html            # Trang đăng nhập
├── register.html         # Trang đăng ký
├── admin.html            # Trang admin
├── booking.html          # Trang đặt bàn
├── restaurants-list.html # Danh sách nhà hàng
├── restaurant-detail.html # Chi tiết nhà hàng
├── js/                   # Thư mục JavaScript
│   ├── common.js         # Logic chung
│   ├── index.js          # Logic trang chủ
│   ├── restaurants-list.js # Logic danh sách nhà hàng
│   ├── restaurant-detail.js # Logic chi tiết nhà hàng
│   ├── admin.js          # Logic admin
│   └── booking.js        # Logic đặt bàn
├── css/                  # Thư mục CSS
│   ├── style.css         # CSS chính
│   └── booking.css       # CSS đặt bàn
└── images/               # Thư mục hình ảnh
```

## 🎯 Hướng dẫn sử dụng

### 1. Đăng nhập
1. Truy cập trang đăng nhập
2. Sử dụng tài khoản test có sẵn
3. Click vào tài khoản để auto-fill hoặc copy thông tin

### 2. Khám phá website
1. **Tài khoản User**: Xem nhà hàng, đặt bàn, đánh giá
2. **Tài khoản Admin**: Quản lý hệ thống, xem thống kê

### 3. Dừng server
- Nhấn `Ctrl+C` trong terminal để dừng server

## 🔧 Tùy chỉnh

### Thay đổi port
Sửa file `app.py`, dòng:
```python
server = RestaurantServer(port=8000)  # Thay đổi số port
```

### Thêm tài khoản test
Sửa file `app.py`, phần `users` trong hàm `handle_api_request`:
```python
users = {
    "email@example.com": {"password": "password", "role": "admin", "name": "Tên người dùng"},
    # Thêm tài khoản mới ở đây
}
```

## 🐛 Xử lý lỗi

### Lỗi "Port already in use"
- Thay đổi port trong file `app.py`
- Hoặc dừng ứng dụng đang sử dụng port đó

### Lỗi "File not found"
- Kiểm tra cấu trúc thư mục
- Đảm bảo tất cả file HTML, CSS, JS đều có mặt

### Lỗi Python version
- Cài đặt Python 3.6 trở lên
- Kiểm tra bằng lệnh: `python --version`

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Python version (>= 3.6)
2. Cấu trúc thư mục đúng
3. Tất cả file cần thiết có mặt
4. Port 8000 không bị sử dụng

## 🎉 Chúc bạn sử dụng vui vẻ!

Website nhà hàng với đầy đủ chức năng, sẵn sàng để demo và phát triển thêm. 