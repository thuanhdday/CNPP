// Tạo time slots
function generateTimeSlots() {
    const timeSlots = document.getElementById('timeSlots');
    const openTime = 10; // 10 AM
    const closeTime = 22; // 10 PM
    
    for (let hour = openTime; hour < closeTime; hour++) {
        for (let minutes of ['00', '30']) {
            const time = `${hour}:${minutes}`;
            const slot = document.createElement('span');
            slot.className = 'time-slot';
            slot.dataset.time = time;
            slot.textContent = time;
            slot.onclick = () => selectTimeSlot(slot);
            timeSlots.appendChild(slot);
        }
    }
}

// Xử lý chọn time slot
function selectTimeSlot(slot) {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
}

// Xử lý chọn loại bàn
document.querySelectorAll('.table-type').forEach(table => {
    table.addEventListener('click', () => {
        document.querySelectorAll('.table-type').forEach(t => t.classList.remove('selected'));
        table.classList.add('selected');
    });
});

// Validate form
function validateForm() {
    const date = document.getElementById('bookingDate').value;
    const guestCount = document.getElementById('guestCount').value;
    const selectedTable = document.querySelector('.table-type.selected');
    const selectedTime = document.querySelector('.time-slot.selected');

    if (!date) {
        alert('Vui lòng chọn ngày đặt bàn');
        return false;
    }
    if (!guestCount) {
        alert('Vui lòng chọn số người');
        return false;
    }
    if (!selectedTable) {
        alert('Vui lòng chọn loại bàn');
        return false;
    }
    if (!selectedTime) {
        alert('Vui lòng chọn giờ đặt bàn');
        return false;
    }

    return true;
}

// Xử lý submit form
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const bookingData = {
        date: document.getElementById('bookingDate').value,
        time: document.querySelector('.time-slot.selected').dataset.time,
        guestCount: document.getElementById('guestCount').value,
        tableType: document.querySelector('.table-type.selected').dataset.type,
        specialRequests: {
            birthday: document.getElementById('birthday').checked,
            anniversary: document.getElementById('anniversary').checked,
            business: document.getElementById('business').checked,
            custom: document.getElementById('customRequest').value
        }
    };

    // Hiển thị thông tin xác nhận
    const confirmationDetails = document.getElementById('confirmationDetails');
    confirmationDetails.innerHTML = `
        <strong>Ngày:</strong> ${bookingData.date}<br>
        <strong>Giờ:</strong> ${bookingData.time}<br>
        <strong>Số người:</strong> ${bookingData.guestCount}<br>
        <strong>Loại bàn:</strong> ${bookingData.tableType}<br>
    `;

    // Tạo QR code (sử dụng thư viện QRCode.js)
    const qr = new QRCode(document.getElementById('bookingQR'), {
        text: JSON.stringify(bookingData),
        width: 128,
        height: 128
    });

    // Hiển thị modal xác nhận
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
});

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    generateTimeSlots();
}); 