// Dữ liệu mẫu cho admin
let adminData = {
    orders: [
        {
            id: 1,
            customerName: "Nguyễn Văn A",
            phone: "0123456789",
            items: [
                { name: "Phở bò", quantity: 2, price: 85000 },
                { name: "Gỏi cuốn", quantity: 1, price: 45000 }
            ],
            total: 215000,
            status: "pending",
            orderTime: "2024-01-20 12:30",
            deliveryAddress: "123 Nguyễn Huệ, Hà Nội"
        },
        {
            id: 2,
            customerName: "Trần Thị B",
            phone: "0987654321",
            items: [
                { name: "Bún chả", quantity: 1, price: 75000 },
                { name: "Chè hạt sen", quantity: 1, price: 35000 }
            ],
            total: 110000,
            status: "completed",
            orderTime: "2024-01-20 11:15",
            deliveryAddress: "456 Trần Phú, Hà Nội"
        }
    ],
    bookings: [
        {
            id: 1,
            customerName: "Lê Văn C",
            phone: "0123456789",
            date: "2024-01-21",
            time: "19:00",
            guestCount: 4,
            tableType: "VIP",
            status: "confirmed",
            specialRequests: "Bàn gần cửa sổ"
        },
        {
            id: 2,
            customerName: "Phạm Thị D",
            phone: "0987654321",
            date: "2024-01-22",
            time: "18:30",
            guestCount: 2,
            tableType: "Standard",
            status: "pending",
            specialRequests: ""
        }
    ],
    tables: [
        { id: 1, name: "Bàn 1", capacity: 4, status: "available", type: "Standard" },
        { id: 2, name: "Bàn 2", capacity: 6, status: "occupied", type: "VIP" },
        { id: 3, name: "Bàn 3", capacity: 2, status: "reserved", type: "Standard" },
        { id: 4, name: "Bàn 4", capacity: 8, status: "available", type: "VIP" }
    ],
    menuItems: [
        { id: 1, name: "Phở bò", price: 85000, category: "mainDishes", description: "Phở bò truyền thống", status: "available" },
        { id: 2, name: "Bún chả", price: 75000, category: "mainDishes", description: "Bún chả Hà Nội", status: "available" },
        { id: 3, name: "Gỏi cuốn", price: 45000, category: "appetizers", description: "Gỏi cuốn tôm thịt", status: "available" }
    ],
    staff: [
        { id: 1, name: "Nguyễn Văn E", position: "Nhân viên phục vụ", phone: "0123456789", email: "nguyen.e@restaurant.com", status: "active" },
        { id: 2, name: "Trần Thị F", position: "Đầu bếp", phone: "0987654321", email: "tran.f@restaurant.com", status: "active" },
        { id: 3, name: "Lê Văn G", position: "Thu ngân", phone: "0123456780", email: "le.g@restaurant.com", status: "inactive" }
    ]
};

// Biến toàn cục
let currentEditItem = null;
let currentEditType = null;

// Khởi tạo trang admin
document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin();
    loadDashboard();
    initializeEventListeners();
    initializeCharts();
});

// Khởi tạo admin
function initializeAdmin() {
    // Kiểm tra quyền admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Load dữ liệu từ localStorage nếu có
    const savedData = localStorage.getItem('adminData');
    if (savedData) {
        adminData = JSON.parse(savedData);
    }
}

// Khởi tạo event listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.sidebar-link[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.closest('.sidebar-link').getAttribute('data-target');
            showSection(target);
            
            // Update active state
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            e.target.closest('.sidebar-link').classList.add('active');
        });
    });
}

// Hiển thị section
function showSection(sectionId) {
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
        case 'reports':
            loadReports();
            break;
    }
}

// Load dashboard
function loadDashboard() {
    updateStatistics();
    loadNotifications();
}

// Cập nhật thống kê
function updateStatistics() {
    const today = new Date().toISOString().split('T')[0];
    
    // Đơn hàng hôm nay
    const todayOrders = adminData.orders.filter(order => 
        order.orderTime.split(' ')[0] === today
    );
    
    // Doanh thu hôm nay
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Đặt bàn hôm nay
    const todayBookings = adminData.bookings.filter(booking => 
        booking.date === today
    );
    
    // Khách hàng mới (đơn giản: đếm đơn hàng mới)
    const newCustomers = todayOrders.length;
    
    // Cập nhật UI
    updateStatCard('todayOrders', todayOrders.length);
    updateStatCard('todayRevenue', formatPrice(todayRevenue));
    updateStatCard('todayBookings', todayBookings.length);
    updateStatCard('newCustomers', newCustomers);
}

// Cập nhật card thống kê
function updateStatCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Load thông báo
function loadNotifications() {
    const container = document.getElementById('notifications');
    if (!container) return;
    
    const notifications = [
        {
            title: "Yêu cầu đặt bàn mới",
            time: "3 phút trước",
            customer: "Nguyễn Văn A"
        },
        {
            title: "Đơn hàng hoàn thành",
            time: "10 phút trước",
            customer: "Trần Thị B"
        }
    ];
    
    container.innerHTML = notifications.map(notification => `
        <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex justify-content-between">
                <h6 class="mb-1">${notification.title}</h6>
                <small>${notification.time}</small>
            </div>
            <small>Khách hàng: ${notification.customer}</small>
        </a>
    `).join('');
}

// ==================== ORDERS MANAGEMENT ====================
function loadOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.phone}</td>
            <td>${order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}</td>
            <td>${formatPrice(order.total)}</td>
            <td>${order.orderTime}</td>
            <td>${getStatusBadge(order.status, 'order')}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-warning me-1" onclick="editOrder(${order.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${order.id}, 'order')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddOrderModal() {
    currentEditItem = null;
    currentEditType = 'order';
    
    document.getElementById('orderModalTitle').textContent = 'Thêm đơn hàng mới';
    document.getElementById('orderId').value = '';
    document.getElementById('orderForm').reset();
    
    // Reset order items
    const orderItems = document.getElementById('orderItems');
    orderItems.innerHTML = `
        <div class="row mb-2">
            <div class="col-md-6">
                <select class="form-select" name="itemName">
                    <option value="">Chọn món</option>
                    <option value="Phở bò">Phở bò</option>
                    <option value="Bún chả">Bún chả</option>
                    <option value="Gỏi cuốn">Gỏi cuốn</option>
                </select>
            </div>
            <div class="col-md-3">
                <input type="number" class="form-control" name="quantity" placeholder="SL" min="1">
            </div>
            <div class="col-md-3">
                <button type="button" class="btn btn-danger btn-sm" onclick="removeOrderItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    new bootstrap.Modal(document.getElementById('orderModal')).show();
}

function editOrder(id) {
    const order = adminData.orders.find(o => o.id === id);
    if (!order) return;
    
    currentEditItem = order;
    currentEditType = 'order';
    
    document.getElementById('orderModalTitle').textContent = 'Sửa đơn hàng';
    document.getElementById('orderId').value = order.id;
    document.getElementById('customerName').value = order.customerName;
    document.getElementById('customerPhone').value = order.phone;
    document.getElementById('deliveryAddress').value = order.deliveryAddress;
    document.getElementById('orderStatus').value = order.status;
    
    // Load order items
    const orderItems = document.getElementById('orderItems');
    orderItems.innerHTML = '';
    order.items.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'row mb-2';
        itemRow.innerHTML = `
            <div class="col-md-6">
                <select class="form-select" name="itemName">
                    <option value="">Chọn món</option>
                    <option value="Phở bò" ${item.name === 'Phở bò' ? 'selected' : ''}>Phở bò</option>
                    <option value="Bún chả" ${item.name === 'Bún chả' ? 'selected' : ''}>Bún chả</option>
                    <option value="Gỏi cuốn" ${item.name === 'Gỏi cuốn' ? 'selected' : ''}>Gỏi cuốn</option>
                </select>
            </div>
            <div class="col-md-3">
                <input type="number" class="form-control" name="quantity" placeholder="SL" min="1" value="${item.quantity}">
            </div>
            <div class="col-md-3">
                <button type="button" class="btn btn-danger btn-sm" onclick="removeOrderItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        orderItems.appendChild(itemRow);
    });
    
    new bootstrap.Modal(document.getElementById('orderModal')).show();
}

function saveOrder() {
    const id = document.getElementById('orderId').value;
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const status = document.getElementById('orderStatus').value;
    
    if (!customerName || !customerPhone || !deliveryAddress) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Collect order items
    const itemRows = document.querySelectorAll('#orderItems .row');
    const items = [];
    let total = 0;
    
    itemRows.forEach(row => {
        const itemName = row.querySelector('select[name="itemName"]').value;
        const quantity = parseInt(row.querySelector('input[name="quantity"]').value);
        
        if (itemName && quantity) {
            const price = getItemPrice(itemName);
            items.push({
                name: itemName,
                quantity: quantity,
                price: price
            });
            total += price * quantity;
        }
    });
    
    if (items.length === 0) {
        alert('Vui lòng thêm ít nhất một món ăn!');
        return;
    }
    
    if (id) {
        // Edit existing order
        const orderIndex = adminData.orders.findIndex(o => o.id === parseInt(id));
        if (orderIndex !== -1) {
            adminData.orders[orderIndex] = {
                ...adminData.orders[orderIndex],
                customerName,
                phone: customerPhone,
                deliveryAddress,
                items,
                total,
                status
            };
        }
    } else {
        // Add new order
        const newOrder = {
            id: adminData.orders.length > 0 ? Math.max(...adminData.orders.map(o => o.id)) + 1 : 1,
            customerName,
            phone: customerPhone,
            deliveryAddress,
            items,
            total,
            status,
            orderTime: new Date().toLocaleString('vi-VN')
        };
        adminData.orders.push(newOrder);
    }
    
    saveData();
    loadOrders();
    updateStatistics();
    bootstrap.Modal.getInstance(document.getElementById('orderModal')).hide();
    showNotification('Đơn hàng đã được lưu thành công!', 'success');
}

function addOrderItem() {
    const orderItems = document.getElementById('orderItems');
    const newItem = document.createElement('div');
    newItem.className = 'row mb-2';
    newItem.innerHTML = `
        <div class="col-md-6">
            <select class="form-select" name="itemName">
                <option value="">Chọn món</option>
                <option value="Phở bò">Phở bò</option>
                <option value="Bún chả">Bún chả</option>
                <option value="Gỏi cuốn">Gỏi cuốn</option>
            </select>
        </div>
        <div class="col-md-3">
            <input type="number" class="form-control" name="quantity" placeholder="SL" min="1">
        </div>
        <div class="col-md-3">
            <button type="button" class="btn btn-danger btn-sm" onclick="removeOrderItem(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    orderItems.appendChild(newItem);
}

function removeOrderItem(button) {
    button.closest('.row').remove();
}

// ==================== BOOKINGS MANAGEMENT ====================
function loadBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${booking.id}</td>
            <td>${booking.customerName}</td>
            <td>${booking.phone}</td>
            <td>${booking.date} ${booking.time}</td>
            <td>${booking.guestCount} người</td>
            <td>${booking.tableType}</td>
            <td>${getStatusBadge(booking.status, 'booking')}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-warning me-1" onclick="editBooking(${booking.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${booking.id}, 'booking')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddBookingModal() {
    currentEditItem = null;
    currentEditType = 'booking';
    
    document.getElementById('bookingModalTitle').textContent = 'Thêm đặt bàn mới';
    document.getElementById('bookingId').value = '';
    document.getElementById('bookingForm').reset();
    new bootstrap.Modal(document.getElementById('bookingModal')).show();
}

function editBooking(id) {
    const booking = adminData.bookings.find(b => b.id === id);
    if (!booking) return;
    
    currentEditItem = booking;
    currentEditType = 'booking';
    
    document.getElementById('bookingModalTitle').textContent = 'Sửa đặt bàn';
    document.getElementById('bookingId').value = booking.id;
    document.getElementById('bookingCustomerName').value = booking.customerName;
    document.getElementById('bookingCustomerPhone').value = booking.phone;
    document.getElementById('bookingDate').value = booking.date;
    document.getElementById('bookingTime').value = booking.time;
    document.getElementById('guestCount').value = booking.guestCount;
    document.getElementById('tableType').value = booking.tableType;
    document.getElementById('specialRequests').value = booking.specialRequests;
    document.getElementById('bookingStatus').value = booking.status;
    
    new bootstrap.Modal(document.getElementById('bookingModal')).show();
}

function saveBooking() {
    const id = document.getElementById('bookingId').value;
    const customerName = document.getElementById('bookingCustomerName').value;
    const customerPhone = document.getElementById('bookingCustomerPhone').value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const guestCount = document.getElementById('guestCount').value;
    const tableType = document.getElementById('tableType').value;
    const specialRequests = document.getElementById('specialRequests').value;
    const status = document.getElementById('bookingStatus').value;
    
    if (!customerName || !customerPhone || !date || !time || !guestCount) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (id) {
        // Edit existing booking
        const bookingIndex = adminData.bookings.findIndex(b => b.id === parseInt(id));
        if (bookingIndex !== -1) {
            adminData.bookings[bookingIndex] = {
                ...adminData.bookings[bookingIndex],
                customerName,
                phone: customerPhone,
                date,
                time,
                guestCount: parseInt(guestCount),
                tableType,
                specialRequests,
                status
            };
        }
    } else {
        // Add new booking
        const newBooking = {
            id: adminData.bookings.length > 0 ? Math.max(...adminData.bookings.map(b => b.id)) + 1 : 1,
            customerName,
            phone: customerPhone,
            date,
            time,
            guestCount: parseInt(guestCount),
            tableType,
            specialRequests,
            status
        };
        adminData.bookings.push(newBooking);
    }
    
    saveData();
    loadBookings();
    updateStatistics();
    bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
    showNotification('Đặt bàn đã được lưu thành công!', 'success');
}

// ==================== TABLES MANAGEMENT ====================
function loadTables() {
    const tbody = document.getElementById('tablesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.tables.forEach(table => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${table.name}</td>
            <td>${table.capacity} người</td>
            <td>${table.type}</td>
            <td>${getStatusBadge(table.status, 'table')}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-warning me-1" onclick="editTable(${table.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${table.id}, 'table')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddTableModal() {
    currentEditItem = null;
    currentEditType = 'table';
    
    document.getElementById('tableModalTitle').textContent = 'Thêm bàn mới';
    document.getElementById('tableId').value = '';
    document.getElementById('tableForm').reset();
    new bootstrap.Modal(document.getElementById('tableModal')).show();
}

function editTable(id) {
    const table = adminData.tables.find(t => t.id === id);
    if (!table) return;
    
    currentEditItem = table;
    currentEditType = 'table';
    
    document.getElementById('tableModalTitle').textContent = 'Sửa bàn';
    document.getElementById('tableId').value = table.id;
    document.getElementById('tableName').value = table.name;
    document.getElementById('tableCapacity').value = table.capacity;
    document.getElementById('tableTypeSelect').value = table.type;
    document.getElementById('tableStatus').value = table.status;
    
    new bootstrap.Modal(document.getElementById('tableModal')).show();
}

function saveTable() {
    const id = document.getElementById('tableId').value;
    const name = document.getElementById('tableName').value;
    const capacity = document.getElementById('tableCapacity').value;
    const type = document.getElementById('tableTypeSelect').value;
    const status = document.getElementById('tableStatus').value;
    
    if (!name || !capacity) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (id) {
        // Edit existing table
        const tableIndex = adminData.tables.findIndex(t => t.id === parseInt(id));
        if (tableIndex !== -1) {
            adminData.tables[tableIndex] = {
                ...adminData.tables[tableIndex],
                name,
                capacity: parseInt(capacity),
                type,
                status
            };
        }
    } else {
        // Add new table
        const newTable = {
            id: adminData.tables.length > 0 ? Math.max(...adminData.tables.map(t => t.id)) + 1 : 1,
            name,
            capacity: parseInt(capacity),
            type,
            status
        };
        adminData.tables.push(newTable);
    }
    
    saveData();
    loadTables();
    bootstrap.Modal.getInstance(document.getElementById('tableModal')).hide();
    showNotification('Bàn đã được lưu thành công!', 'success');
}

// ==================== MENU MANAGEMENT ====================
function loadMenuItems() {
    const tbody = document.getElementById('menuTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.menuItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${formatPrice(item.price)}</td>
            <td>${getCategoryName(item.category)}</td>
            <td>${item.description}</td>
            <td>${getStatusBadge(item.status, 'menu')}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-warning me-1" onclick="editMenuItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id}, 'menu')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddMenuItemModal() {
    currentEditItem = null;
    currentEditType = 'menu';
    
    document.getElementById('menuItemModalTitle').textContent = 'Thêm món ăn mới';
    document.getElementById('menuItemId').value = '';
    document.getElementById('menuItemForm').reset();
    new bootstrap.Modal(document.getElementById('menuItemModal')).show();
}

function editMenuItem(id) {
    const item = adminData.menuItems.find(m => m.id === id);
    if (!item) return;
    
    currentEditItem = item;
    currentEditType = 'menu';
    
    document.getElementById('menuItemModalTitle').textContent = 'Sửa món ăn';
    document.getElementById('menuItemId').value = item.id;
    document.getElementById('menuItemName').value = item.name;
    document.getElementById('menuItemPrice').value = item.price;
    document.getElementById('menuItemCategory').value = item.category;
    document.getElementById('menuItemDescription').value = item.description;
    document.getElementById('menuItemStatus').value = item.status;
    
    new bootstrap.Modal(document.getElementById('menuItemModal')).show();
}

function saveMenuItem() {
    const id = document.getElementById('menuItemId').value;
    const name = document.getElementById('menuItemName').value;
    const price = document.getElementById('menuItemPrice').value;
    const category = document.getElementById('menuItemCategory').value;
    const description = document.getElementById('menuItemDescription').value;
    const status = document.getElementById('menuItemStatus').value;
    
    if (!name || !price) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (id) {
        // Edit existing menu item
        const itemIndex = adminData.menuItems.findIndex(m => m.id === parseInt(id));
        if (itemIndex !== -1) {
            adminData.menuItems[itemIndex] = {
                ...adminData.menuItems[itemIndex],
                name,
                price: parseInt(price),
                category,
                description,
                status
            };
        }
    } else {
        // Add new menu item
        const newItem = {
            id: adminData.menuItems.length > 0 ? Math.max(...adminData.menuItems.map(m => m.id)) + 1 : 1,
            name,
            price: parseInt(price),
            category,
            description,
            status
        };
        adminData.menuItems.push(newItem);
    }
    
    saveData();
    loadMenuItems();
    bootstrap.Modal.getInstance(document.getElementById('menuItemModal')).hide();
    showNotification('Món ăn đã được lưu thành công!', 'success');
}

// ==================== STAFF MANAGEMENT ====================
function loadStaff() {
    const tbody = document.getElementById('staffTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.staff.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.position}</td>
            <td>${member.phone}</td>
            <td>${member.email || '-'}</td>
            <td>${getStatusBadge(member.status, 'staff')}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-warning me-1" onclick="editStaff(${member.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${member.id}, 'staff')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddStaffModal() {
    currentEditItem = null;
    currentEditType = 'staff';
    
    document.getElementById('staffModalTitle').textContent = 'Thêm nhân viên mới';
    document.getElementById('staffId').value = '';
    document.getElementById('staffForm').reset();
    new bootstrap.Modal(document.getElementById('staffModal')).show();
}

function editStaff(id) {
    const member = adminData.staff.find(s => s.id === id);
    if (!member) return;
    
    currentEditItem = member;
    currentEditType = 'staff';
    
    document.getElementById('staffModalTitle').textContent = 'Sửa nhân viên';
    document.getElementById('staffId').value = member.id;
    document.getElementById('staffName').value = member.name;
    document.getElementById('staffPosition').value = member.position;
    document.getElementById('staffPhone').value = member.phone;
    document.getElementById('staffEmail').value = member.email || '';
    document.getElementById('staffStatus').value = member.status;
    
    new bootstrap.Modal(document.getElementById('staffModal')).show();
}

function saveStaff() {
    const id = document.getElementById('staffId').value;
    const name = document.getElementById('staffName').value;
    const position = document.getElementById('staffPosition').value;
    const phone = document.getElementById('staffPhone').value;
    const email = document.getElementById('staffEmail').value;
    const status = document.getElementById('staffStatus').value;
    
    if (!name || !position || !phone) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (id) {
        // Edit existing staff
        const staffIndex = adminData.staff.findIndex(s => s.id === parseInt(id));
        if (staffIndex !== -1) {
            adminData.staff[staffIndex] = {
                ...adminData.staff[staffIndex],
                name,
                position,
                phone,
                email,
                status
            };
        }
    } else {
        // Add new staff
        const newStaff = {
            id: adminData.staff.length > 0 ? Math.max(...adminData.staff.map(s => s.id)) + 1 : 1,
            name,
            position,
            phone,
            email,
            status
        };
        adminData.staff.push(newStaff);
    }
    
    saveData();
    loadStaff();
    bootstrap.Modal.getInstance(document.getElementById('staffModal')).hide();
    showNotification('Nhân viên đã được lưu thành công!', 'success');
}

// ==================== DELETE FUNCTIONALITY ====================
function deleteItem(id, type) {
    if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
        switch (type) {
            case 'order':
                adminData.orders = adminData.orders.filter(o => o.id !== id);
                loadOrders();
                break;
            case 'booking':
                adminData.bookings = adminData.bookings.filter(b => b.id !== id);
                loadBookings();
                break;
            case 'table':
                adminData.tables = adminData.tables.filter(t => t.id !== id);
                loadTables();
                break;
            case 'menu':
                adminData.menuItems = adminData.menuItems.filter(m => m.id !== id);
                loadMenuItems();
                break;
            case 'staff':
                adminData.staff = adminData.staff.filter(s => s.id !== id);
                loadStaff();
                break;
        }
        
        saveData();
        updateStatistics();
        showNotification('Đã xóa thành công!', 'success');
    }
}

// ==================== UTILITY FUNCTIONS ====================
function getStatusBadge(status, type) {
    const statusMap = {
        order: {
            pending: { text: 'Chờ xử lý', class: 'bg-warning' },
            processing: { text: 'Đang xử lý', class: 'bg-info' },
            completed: { text: 'Hoàn thành', class: 'bg-success' },
            cancelled: { text: 'Đã hủy', class: 'bg-danger' }
        },
        booking: {
            pending: { text: 'Chờ xác nhận', class: 'bg-warning' },
            confirmed: { text: 'Đã xác nhận', class: 'bg-success' },
            cancelled: { text: 'Đã hủy', class: 'bg-danger' }
        },
        table: {
            available: { text: 'Trống', class: 'bg-success' },
            occupied: { text: 'Có khách', class: 'bg-info' },
            reserved: { text: 'Đã đặt', class: 'bg-warning' },
            maintenance: { text: 'Bảo trì', class: 'bg-danger' }
        },
        menu: {
            available: { text: 'Còn món', class: 'bg-success' },
            unavailable: { text: 'Hết món', class: 'bg-danger' }
        },
        staff: {
            active: { text: 'Đang làm việc', class: 'bg-success' },
            inactive: { text: 'Nghỉ việc', class: 'bg-danger' }
        }
    };
    
    const statusInfo = statusMap[type][status];
    return `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;
}

function getCategoryName(category) {
    const categories = {
        appetizers: 'Khai vị',
        mainDishes: 'Món chính',
        desserts: 'Tráng miệng',
        drinks: 'Đồ uống'
    };
    return categories[category] || category;
}

function getItemPrice(itemName) {
    const item = adminData.menuItems.find(m => m.name === itemName);
    return item ? item.price : 0;
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function saveData() {
    localStorage.setItem('adminData', JSON.stringify(adminData));
}

function showNotification(message, type = 'info') {
    // Tạo toast notification
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    document.body.appendChild(toastContainer);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Xóa toast sau khi ẩn
    toast.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(toastContainer);
    });
}

function refreshData() {
    loadAllData();
    showNotification('Dữ liệu đã được làm mới!', 'info');
}

function loadAllData() {
    loadOrders();
    loadBookings();
    loadTables();
    loadMenuItems();
    loadStaff();
    updateStatistics();
}

function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('userRole');
        window.location.href = 'login.html';
    }
}

// ==================== REPORTS ====================
function loadReports() {
    generateRevenueChart();
    generateOrderChart();
    generatePopularItems();
}

function generateRevenueChart() {
    const ctx = document.getElementById('revenueChartReport');
    if (!ctx) return;
    
    new Chart(ctx, {
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

function generateOrderChart() {
    const ctx = document.getElementById('topDishesChartReport');
    if (!ctx) return;
    
    new Chart(ctx, {
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

function generatePopularItems() {
    // Có thể thêm logic để tính toán món ăn phổ biến từ dữ liệu đơn hàng
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

// ==================== EXPORT FUNCTIONS ====================
function exportReport(type) {
    let data = [];
    let filename = '';
    
    switch (type) {
        case 'orders':
            data = adminData.orders;
            filename = 'don-hang.csv';
            break;
        case 'revenue':
            data = [
                { Tháng: 'T1', 'Doanh thu': 150000000 },
                { Tháng: 'T2', 'Doanh thu': 180000000 },
                { Tháng: 'T3', 'Doanh thu': 220000000 }
            ];
            filename = 'doanh-thu.csv';
            break;
        case 'bookings':
            data = adminData.bookings;
            filename = 'dat-ban.csv';
            break;
    }
    
    // Tạo file CSV đơn giản
    const csvContent = convertToCSV(data);
    downloadCSV(csvContent, filename);
    showNotification('Báo cáo đã được xuất thành công!', 'success');
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            return `"${value}"`;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
} 