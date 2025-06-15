Dưới đây là bản **README.md** tóm tắt toàn bộ nội dung tài liệu của bạn, chuẩn định dạng, dễ dùng cho GitHub:

---

# Hệ Thống Đặt Bàn & Đặt Món Trực Tuyến Cho Nhà Hàng

## Thông Tin Đề Tài

* **Tên đề tài**: Phần mềm hỗ trợ đặt bàn trước, đặt đồ ăn cho quán ăn
* **Sinh viên thực hiện**:

  * Hoàng Đức Thuần - MSV: K215480106046
  * Vi Thành Văn - MSV: K215480106055
* **Lớp**: K57KMT
* **Giáo viên hướng dẫn**: Nguyễn Thị Hương
* **Ngành**: Kỹ thuật máy tính

## Giới Thiệu

Phần mềm giúp khách hàng có thể:

* Đặt bàn trực tuyến, đặt món trước khi đến.
* Xem menu chi tiết, đặt cọc, thanh toán online.
* Nhận thông báo về tình trạng bàn, món ăn.

Hệ thống hỗ trợ:

* Quản lý bàn, món ăn, đơn hàng.
* Thống kê doanh thu, đánh giá khách hàng.
* Hoạt động trên Web và ứng dụng di động.

## Công Nghệ Sử Dụng

* **Frontend**: HTML, CSS, JavaScript
* **Backend**: MySQL
* **Hệ quản trị CSDL**: MySQL
* **Môi trường chạy**: Website / Ứng dụng di động

## Chức Năng Chính

### Người Dùng

* Đăng ký/Đăng nhập
* Đặt bàn theo ngày/giờ/số lượng người
* Chọn và đặt món ăn trước
* Thanh toán và nhận thông báo
* Đánh giá và phản hồi

### Quản Trị Viên (Admin)

* Quản lý bàn: Thêm/Sửa/Xóa/Trạng thái
* Quản lý món ăn: Thêm/Sửa/Xóa/Giá/Trạng thái
* Quản lý đặt chỗ: Xác nhận/Hủy/Điều chỉnh
* Thống kê doanh thu, lượng khách, món ăn bán chạy
* Quản lý nhân viên và phân quyền
* Xử lý phản hồi khách hàng

## Cơ Sở Dữ Liệu (MySQL)

### Các bảng chính:

* `KhachHang` (Thông tin khách)
* `Ban` (Thông tin bàn ăn)
* `DatCho` (Lượt đặt bàn)
* `MonAn` (Danh sách món ăn)
* `ChiTietDatMon` (Chi tiết đơn món)
* `NguyenLieu`, `TuyChonNguyenLieu` (Nguyên liệu)
* `ThanhToan` (Thông tin thanh toán)
* `GiamGia` (Mã giảm giá)
* `BaoCao` (Thống kê - báo cáo)

### Các stored procedures & triggers:

* Phân quyền
* Thống kê doanh thu
* Thống kê món ăn bán chạy
* Kiểm tra bàn trống
* Cập nhật tổng tiền đơn hàng
* Trigger kiểm tra nguyên liệu, huỷ đơn quá giờ, ghi log thao tác

## Kiểm Thử & Giao Diện

* Trang chủ
* Trang đăng ký / đăng nhập
* Dashboard quản trị
* Menu món ăn
* Lịch sử đặt bàn/đơn hàng
* Đánh giá và phản hồi
* Trang nhân viên
* Trang đặt bàn
* Hồ sơ người dùng

## Kết Luận & Hướng Phát Triển

* Tăng cường AI gợi ý món ăn
* Ứng dụng di động Android/iOS riêng
* Hệ thống quản lý kho nguyên liệu
* Tích hợp các cổng thanh toán phổ biến
* Chuyển lên cloud đảm bảo mở rộng & bảo mật

## Tài Liệu Tham Khảo

* [MDN Web Docs](https://developer.mozilla.org/)
* [W3Schools](https://www.w3schools.com/)
* [React](https://react.dev/)
* [Vue.js](https://vuejs.org/)
* [Node.js](https://nodejs.org/)
* [MySQL](https://dev.mysql.com/doc/)
* [Git & GitHub](https://guides.github.com/)

---

## Ghi chú

> Cảm ơn cô **Nguyễn Thị Hương** và các thầy cô bộ môn đã hướng dẫn và tạo điều kiện cho nhóm hoàn thành đồ án này.

