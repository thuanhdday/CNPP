// Dữ liệu mẫu
let orders = [
    { id: 1, customerName: "Nguyễn Văn A", phone: "0123456789", items: "Phở bò x2", total: 90000, status: "completed" },
    { id: 2, customerName: "Trần Thị B", phone: "0987654321", items: "Bún chả x1", total: 40000, status: "pending" }
];

let bookings = [
    { id: 1, customerName: "Lê Văn C", phone: "0111222333", dateTime: "2024-01-16 18:00", guestCount: 4, status: "confirmed" },
    { id: 2, customerName: "Phạm Thị D", phone: "0444555666", dateTime: "2024-01-17 19:30", guestCount: 6, status: "pending" }
];

let tables = [
    { id: 1, name: "B01", capacity: 4, status: "available" },
    { id: 2, name: "B02", capacity: 6, status: "occupied" }
];

let menuItems = [
    { id: 1, name: "Phở bò", price: 45000, category: "Món chính", status: "available" },
    { id: 2, name: "Bún chả", price: 40000, category: "Món chính", status: "available" }
];

let staff = [
    { id: 1, name: "Nguyễn Văn E", position: "Nhân viên phục vụ", phone: "0777888999", status: "active" },
    { id: 2, name: "Trần Thị F", position: "Đầu bếp", phone: "0666777888", status: "active" }
];

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin page loaded');
    loadAllData();
    setupEventListeners();
});

// Thiết lập event listeners
function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-link[data-target]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            showSection(target);
            
            // Update active state
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Hiển thị section
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Load dữ liệu cho section
    switch(sectionId) {
        case 'orders':
            loadOrders();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'tables':
            loadTables();
            break;
        case 'menu':
            loadMenuItems();
            break;
        case 'staff':
            loadStaff();
            break;
    }
}

// Load tất cả dữ liệu
function loadAllData() {
    loadOrders();
    loadBookings();
    loadTables();
    loadMenuItems();
    loadStaff();
}

// ==================== ORDERS MANAGEMENT ====================
function loadOrders() {
    console.log('Loading orders...');
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) {
        console.log('ordersTableBody not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.phone}</td>
            <td>${order.items}</td>
            <td>${formatCurrency(order.total)}</td>
            <td>${order.status}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editOrder(${order.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddOrderModal() {
    console.log('Showing add order modal');
    document.getElementById('orderModalTitle').textContent = 'Thêm đơn hàng mới';
    document.getElementById('orderForm').reset();
    new bootstrap.Modal(document.getElementById('orderModal')).show();
}

function editOrder(id) {
    console.log('Editing order:', id);
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    document.getElementById('orderModalTitle').textContent = 'Sửa đơn hàng';
    document.getElementById('customerName').value = order.customerName;
    document.getElementById('customerPhone').value = order.phone;
    document.getElementById('orderStatus').value = order.status;
    
    // Store order ID for saving
    document.getElementById('orderModal').setAttribute('data-edit-id', id);
    
    new bootstrap.Modal(document.getElementById('orderModal')).show();
}

function saveOrder() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const status = document.getElementById('orderStatus').value;
    const editId = document.getElementById('orderModal').getAttribute('data-edit-id');
    
    if (!customerName || !customerPhone) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (editId) {
        // Edit existing order
        const orderIndex = orders.findIndex(o => o.id === parseInt(editId));
        if (orderIndex !== -1) {
            orders[orderIndex] = {
                ...orders[orderIndex],
                customerName,
                phone: customerPhone,
                status
            };
        }
        document.getElementById('orderModal').removeAttribute('data-edit-id');
    } else {
        // Add new order
        const newOrder = {
            id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
            customerName,
            phone: customerPhone,
            items: "Phở bò x1",
            total: 45000,
            status
        };
        orders.push(newOrder);
    }
    
    loadOrders();
    bootstrap.Modal.getInstance(document.getElementById('orderModal')).hide();
    alert('Đơn hàng đã được lưu thành công!');
}

function deleteOrder(id) {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
        orders = orders.filter(o => o.id !== id);
        loadOrders();
        alert('Đã xóa đơn hàng thành công!');
    }
}

// ==================== BOOKINGS MANAGEMENT ====================
function loadBookings() {
    console.log('Loading bookings...');
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) {
        console.log('bookingsTableBody not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${booking.id}</td>
            <td>${booking.customerName}</td>
            <td>${booking.phone}</td>
            <td>${booking.dateTime}</td>
            <td>${booking.guestCount} người</td>
            <td>${booking.status}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editBooking(${booking.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteBooking(${booking.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddBookingModal() {
    console.log('Showing add booking modal');
    document.getElementById('bookingModalTitle').textContent = 'Thêm đặt bàn mới';
    document.getElementById('bookingForm').reset();
    new bootstrap.Modal(document.getElementById('bookingModal')).show();
}

function editBooking(id) {
    console.log('Editing booking:', id);
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    
    document.getElementById('bookingModalTitle').textContent = 'Sửa đặt bàn';
    document.getElementById('bookingCustomerName').value = booking.customerName;
    document.getElementById('bookingCustomerPhone').value = booking.phone;
    document.getElementById('guestCount').value = booking.guestCount;
    document.getElementById('bookingStatus').value = booking.status;
    
    document.getElementById('bookingModal').setAttribute('data-edit-id', id);
    
    new bootstrap.Modal(document.getElementById('bookingModal')).show();
}

function saveBooking() {
    const customerName = document.getElementById('bookingCustomerName').value;
    const customerPhone = document.getElementById('bookingCustomerPhone').value;
    const guestCount = document.getElementById('guestCount').value;
    const status = document.getElementById('bookingStatus').value;
    const editId = document.getElementById('bookingModal').getAttribute('data-edit-id');
    
    if (!customerName || !customerPhone || !guestCount) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (editId) {
        // Edit existing booking
        const bookingIndex = bookings.findIndex(b => b.id === parseInt(editId));
        if (bookingIndex !== -1) {
            bookings[bookingIndex] = {
                ...bookings[bookingIndex],
                customerName,
                phone: customerPhone,
                guestCount: parseInt(guestCount),
                status
            };
        }
        document.getElementById('bookingModal').removeAttribute('data-edit-id');
    } else {
        // Add new booking
        const newBooking = {
            id: bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1,
            customerName,
            phone: customerPhone,
            dateTime: new Date().toLocaleString('vi-VN'),
            guestCount: parseInt(guestCount),
            status
        };
        bookings.push(newBooking);
    }
    
    loadBookings();
    bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
    alert('Đặt bàn đã được lưu thành công!');
}

function deleteBooking(id) {
    if (confirm('Bạn có chắc chắn muốn xóa đặt bàn này?')) {
        bookings = bookings.filter(b => b.id !== id);
        loadBookings();
        alert('Đã xóa đặt bàn thành công!');
    }
}

// ==================== TABLES MANAGEMENT ====================
function loadTables() {
    console.log('Loading tables...');
    const tbody = document.getElementById('tablesTableBody');
    if (!tbody) {
        console.log('tablesTableBody not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    tables.forEach(table => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${table.name}</td>
            <td>${table.capacity} người</td>
            <td>${table.status}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editTable(${table.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTable(${table.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddTableModal() {
    console.log('Showing add table modal');
    document.getElementById('tableModalTitle').textContent = 'Thêm bàn mới';
    document.getElementById('tableForm').reset();
    new bootstrap.Modal(document.getElementById('tableModal')).show();
}

function editTable(id) {
    console.log('Editing table:', id);
    const table = tables.find(t => t.id === id);
    if (!table) return;
    
    document.getElementById('tableModalTitle').textContent = 'Sửa bàn';
    document.getElementById('tableName').value = table.name;
    document.getElementById('tableCapacity').value = table.capacity;
    document.getElementById('tableStatus').value = table.status;
    
    document.getElementById('tableModal').setAttribute('data-edit-id', id);
    
    new bootstrap.Modal(document.getElementById('tableModal')).show();
}

function saveTable() {
    const name = document.getElementById('tableName').value;
    const capacity = document.getElementById('tableCapacity').value;
    const status = document.getElementById('tableStatus').value;
    const editId = document.getElementById('tableModal').getAttribute('data-edit-id');
    
    if (!name || !capacity) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (editId) {
        // Edit existing table
        const tableIndex = tables.findIndex(t => t.id === parseInt(editId));
        if (tableIndex !== -1) {
            tables[tableIndex] = {
                ...tables[tableIndex],
                name,
                capacity: parseInt(capacity),
                status
            };
        }
        document.getElementById('tableModal').removeAttribute('data-edit-id');
    } else {
        // Add new table
        const newTable = {
            id: tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1,
            name,
            capacity: parseInt(capacity),
            status
        };
        tables.push(newTable);
    }
    
    loadTables();
    bootstrap.Modal.getInstance(document.getElementById('tableModal')).hide();
    alert('Bàn đã được lưu thành công!');
}

function deleteTable(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
        tables = tables.filter(t => t.id !== id);
        loadTables();
        alert('Đã xóa bàn thành công!');
    }
}

// ==================== MENU MANAGEMENT ====================
function loadMenuItems() {
    console.log('Loading menu items...');
    const tbody = document.getElementById('menuTableBody');
    if (!tbody) {
        console.log('menuTableBody not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    menuItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${item.category}</td>
            <td>${item.status}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editMenuItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteMenuItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddMenuItemModal() {
    console.log('Showing add menu item modal');
    document.getElementById('menuItemModalTitle').textContent = 'Thêm món ăn mới';
    document.getElementById('menuItemForm').reset();
    new bootstrap.Modal(document.getElementById('menuItemModal')).show();
}

function editMenuItem(id) {
    console.log('Editing menu item:', id);
    const item = menuItems.find(m => m.id === id);
    if (!item) return;
    
    document.getElementById('menuItemModalTitle').textContent = 'Sửa món ăn';
    document.getElementById('menuItemName').value = item.name;
    document.getElementById('menuItemPrice').value = item.price;
    document.getElementById('menuItemCategory').value = item.category;
    document.getElementById('menuItemStatus').value = item.status;
    
    document.getElementById('menuItemModal').setAttribute('data-edit-id', id);
    
    new bootstrap.Modal(document.getElementById('menuItemModal')).show();
}

function saveMenuItem() {
    const name = document.getElementById('menuItemName').value;
    const price = document.getElementById('menuItemPrice').value;
    const category = document.getElementById('menuItemCategory').value;
    const status = document.getElementById('menuItemStatus').value;
    const editId = document.getElementById('menuItemModal').getAttribute('data-edit-id');
    
    if (!name || !price) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (editId) {
        // Edit existing menu item
        const itemIndex = menuItems.findIndex(m => m.id === parseInt(editId));
        if (itemIndex !== -1) {
            menuItems[itemIndex] = {
                ...menuItems[itemIndex],
                name,
                price: parseInt(price),
                category,
                status
            };
        }
        document.getElementById('menuItemModal').removeAttribute('data-edit-id');
    } else {
        // Add new menu item
        const newItem = {
            id: menuItems.length > 0 ? Math.max(...menuItems.map(m => m.id)) + 1 : 1,
            name,
            price: parseInt(price),
            category,
            status
        };
        menuItems.push(newItem);
    }
    
    loadMenuItems();
    bootstrap.Modal.getInstance(document.getElementById('menuItemModal')).hide();
    alert('Món ăn đã được lưu thành công!');
}

function deleteMenuItem(id) {
    if (confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
        menuItems = menuItems.filter(m => m.id !== id);
        loadMenuItems();
        alert('Đã xóa món ăn thành công!');
    }
}

// ==================== STAFF MANAGEMENT ====================
function loadStaff() {
    console.log('Loading staff...');
    const tbody = document.getElementById('staffTableBody');
    if (!tbody) {
        console.log('staffTableBody not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    staff.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.position}</td>
            <td>${member.phone}</td>
            <td>${member.status}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editStaff(${member.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteStaff(${member.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddStaffModal() {
    console.log('Showing add staff modal');
    document.getElementById('staffModalTitle').textContent = 'Thêm nhân viên mới';
    document.getElementById('staffForm').reset();
    new bootstrap.Modal(document.getElementById('staffModal')).show();
}

function editStaff(id) {
    console.log('Editing staff:', id);
    const member = staff.find(s => s.id === id);
    if (!member) return;
    
    document.getElementById('staffModalTitle').textContent = 'Sửa nhân viên';
    document.getElementById('staffName').value = member.name;
    document.getElementById('staffPosition').value = member.position;
    document.getElementById('staffPhone').value = member.phone;
    document.getElementById('staffStatus').value = member.status;
    
    document.getElementById('staffModal').setAttribute('data-edit-id', id);
    
    new bootstrap.Modal(document.getElementById('staffModal')).show();
}

function saveStaff() {
    const name = document.getElementById('staffName').value;
    const position = document.getElementById('staffPosition').value;
    const phone = document.getElementById('staffPhone').value;
    const status = document.getElementById('staffStatus').value;
    const editId = document.getElementById('staffModal').getAttribute('data-edit-id');
    
    if (!name || !position || !phone) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (editId) {
        // Edit existing staff
        const staffIndex = staff.findIndex(s => s.id === parseInt(editId));
        if (staffIndex !== -1) {
            staff[staffIndex] = {
                ...staff[staffIndex],
                name,
                position,
                phone,
                status
            };
        }
        document.getElementById('staffModal').removeAttribute('data-edit-id');
    } else {
        // Add new staff
        const newStaff = {
            id: staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1,
            name,
            position,
            phone,
            status
        };
        staff.push(newStaff);
    }
    
    loadStaff();
    bootstrap.Modal.getInstance(document.getElementById('staffModal')).hide();
    alert('Nhân viên đã được lưu thành công!');
}

function deleteStaff(id) {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
        staff = staff.filter(s => s.id !== id);
        loadStaff();
        alert('Đã xóa nhân viên thành công!');
    }
}

// ==================== UTILITY FUNCTIONS ====================
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function refreshData() {
    loadAllData();
    alert('Dữ liệu đã được làm mới!');
}

function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        window.location.href = 'login.html';
    }
}

// ==================== CHARTS ====================
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
                datasets: [{
                    label: 'Doanh thu (triệu đồng)',
                    data: [150, 180, 220, 190, 250, 280],
                    borderColor: '#0d6efd',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Top Dishes Chart
    const dishesCtx = document.getElementById('topDishesChart');
    if (dishesCtx) {
        new Chart(dishesCtx, {
            type: 'bar',
            data: {
                labels: ['Phở bò', 'Cơm rang', 'Bún chả', 'Gà rang', 'Lẩu'],
                datasets: [{
                    label: 'Số lượng đã bán',
                    data: [150, 120, 100, 80, 60],
                    backgroundColor: '#28a745'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
} 