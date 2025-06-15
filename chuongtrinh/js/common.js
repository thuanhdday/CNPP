// Load header
async function loadHeader() {
    try {
        // Kiểm tra xem đã có header chưa
        if (!document.getElementById('header')) {
            // Tạo div header nếu chưa có
            const headerDiv = document.createElement('div');
            headerDiv.id = 'header';
            document.body.insertBefore(headerDiv, document.body.firstChild);
        }

        // Load nội dung header
        const response = await fetch('header.html');
        const html = await response.text();
        
        // Chèn nội dung header
        document.getElementById('header').innerHTML = html;

        // Lấy các thẻ script từ header content
        const headerContent = document.createElement('div');
        headerContent.innerHTML = html;
        const scripts = headerContent.getElementsByTagName('script');

        // Thực thi các script trong header
        Array.from(scripts).forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.head.appendChild(newScript);
        });

        // Đánh dấu menu active
        setActiveMenu();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

// Đánh dấu menu active dựa trên URL hiện tại
function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Format giá tiền
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
}); 