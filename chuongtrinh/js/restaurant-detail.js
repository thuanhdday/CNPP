// Dữ liệu mẫu nhà hàng
const restaurantData = {
    1: {
        id: 1,
        name: "Nhà hàng Việt Nam",
        image: "images/restaurant1.jpg",
        images: [
            "images/restaurant1.jpg",
            "images/restaurant1-2.jpg",
            "images/restaurant1-3.jpg"
        ],
        cuisine: "vietnamese",
        location: "Hoàn Kiếm",
        address: "123 Nguyễn Huệ, Hoàn Kiếm, Hà Nội",
        phone: "024-1234-5678",
        rating: 4.5,
        reviewCount: 128,
        price: "200,000 - 500,000",
        priceMin: 200000,
        priceMax: 500000,
        discount: "20%",
        features: ["WiFi", "Parking", "Delivery"],
        description: "Nhà hàng phục vụ các món ăn truyền thống Việt Nam với không gian ấm cúng và phục vụ chu đáo.",
        openingHours: {
            monday: "10:00 - 22:00",
            tuesday: "10:00 - 22:00",
            wednesday: "10:00 - 22:00",
            thursday: "10:00 - 22:00",
            friday: "10:00 - 23:00",
            saturday: "10:00 - 23:00",
            sunday: "10:00 - 22:00"
        },
        menu: {
            appetizers: [
                { id: 1, name: "Gỏi cuốn", price: 45000, description: "Gỏi cuốn tôm thịt với rau sống", image: "images/goi-cuon.jpg" },
                { id: 2, name: "Chả giò", price: 55000, description: "Chả giò truyền thống", image: "images/cha-gio.jpg" }
            ],
            mainDishes: [
                { id: 3, name: "Phở bò", price: 85000, description: "Phở bò truyền thống", image: "images/pho-bo.jpg" },
                { id: 4, name: "Bún chả", price: 75000, description: "Bún chả Hà Nội", image: "images/bun-cha.jpg" },
                { id: 5, name: "Cơm tấm", price: 65000, description: "Cơm tấm sườn nướng", image: "images/com-tam.jpg" }
            ],
            desserts: [
                { id: 6, name: "Chè hạt sen", price: 35000, description: "Chè hạt sen long nhãn", image: "images/che-hat-sen.jpg" },
                { id: 7, name: "Bánh flan", price: 30000, description: "Bánh flan truyền thống", image: "images/banh-flan.jpg" }
            ]
        },
        reviews: [
            {
                id: 1,
                user: "Nguyễn Văn A",
                rating: 5,
                comment: "Món ăn rất ngon, phục vụ chu đáo!",
                date: "2024-01-15"
            },
            {
                id: 2,
                user: "Trần Thị B",
                rating: 4,
                comment: "Không gian đẹp, món ăn chất lượng",
                date: "2024-01-10"
            }
        ]
    }
};

let currentRestaurant = null;
let currentImageIndex = 0;

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadRestaurantDetail();
    initializeImageGallery();
    initializeReviewForm();
    initializeMenuTabs();
});

// Tải chi tiết nhà hàng
function loadRestaurantDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id') || 1;
    
    currentRestaurant = restaurantData[restaurantId];
    if (!currentRestaurant) {
        showError('Không tìm thấy thông tin nhà hàng');
        return;
    }

    displayRestaurantInfo();
    displayMenu();
    displayReviews();
    displayOpeningHours();
}

// Hiển thị thông tin nhà hàng
function displayRestaurantInfo() {
    // Cập nhật tiêu đề trang
    document.title = `${currentRestaurant.name} - Chi tiết nhà hàng`;
    
    // Cập nhật thông tin cơ bản
    const nameElement = document.getElementById('restaurantName');
    if (nameElement) nameElement.textContent = currentRestaurant.name;
    
    const ratingElement = document.getElementById('restaurantRating');
    if (ratingElement) {
        ratingElement.innerHTML = `
            ${'★'.repeat(Math.floor(currentRestaurant.rating))}${currentRestaurant.rating % 1 !== 0 ? '☆' : ''} 
            ${currentRestaurant.rating} (${currentRestaurant.reviewCount} đánh giá)
        `;
    }
    
    const priceElement = document.getElementById('restaurantPrice');
    if (priceElement) priceElement.textContent = currentRestaurant.price;
    
    const descriptionElement = document.getElementById('restaurantDescription');
    if (descriptionElement) descriptionElement.textContent = currentRestaurant.description;
    
    const addressElement = document.getElementById('restaurantAddress');
    if (addressElement) addressElement.textContent = currentRestaurant.address;
    
    const phoneElement = document.getElementById('restaurantPhone');
    if (phoneElement) phoneElement.textContent = currentRestaurant.phone;
    
    // Hiển thị hình ảnh chính
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = currentRestaurant.images[0];
        mainImage.alt = currentRestaurant.name;
    }
    
    // Hiển thị gallery hình ảnh
    displayImageGallery();
    
    // Hiển thị features
    displayFeatures();
}

// Hiển thị gallery hình ảnh
function displayImageGallery() {
    const galleryContainer = document.getElementById('imageGallery');
    if (!galleryContainer) return;
    
    galleryContainer.innerHTML = '';
    currentRestaurant.images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = `${currentRestaurant.name} - Hình ${index + 1}`;
        img.className = 'gallery-thumbnail';
        img.onclick = () => showImage(index);
        galleryContainer.appendChild(img);
    });
}

// Hiển thị features
function displayFeatures() {
    const featuresContainer = document.getElementById('restaurantFeatures');
    if (!featuresContainer) return;
    
    featuresContainer.innerHTML = currentRestaurant.features.map(feature => 
        `<span class="badge bg-primary me-2">${feature}</span>`
    ).join('');
}

// Khởi tạo gallery hình ảnh
function initializeImageGallery() {
    // Xử lý click vào hình ảnh chính để mở modal
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.onclick = () => openImageModal();
    }
    
    // Xử lý nút prev/next
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    
    if (prevBtn) prevBtn.onclick = () => previousImage();
    if (nextBtn) nextBtn.onclick = () => nextImage();
}

// Hiển thị hình ảnh
function showImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = currentRestaurant.images[index];
    }
}

// Hình ảnh trước
function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + currentRestaurant.images.length) % currentRestaurant.images.length;
    showImage(currentImageIndex);
}

// Hình ảnh tiếp theo
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % currentRestaurant.images.length;
    showImage(currentImageIndex);
}

// Mở modal hình ảnh
function openImageModal() {
    // Tạo modal để xem hình ảnh lớn
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${currentRestaurant.name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="${currentRestaurant.images[currentImageIndex]}" class="img-fluid" alt="${currentRestaurant.name}">
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

// Hiển thị menu
function displayMenu() {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;
    
    Object.keys(currentRestaurant.menu).forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'menu-category mb-4';
        categoryContainer.innerHTML = `
            <h4 class="mb-3">${getCategoryName(category)}</h4>
            <div class="row">
                ${currentRestaurant.menu[category].map(item => createMenuItem(item)).join('')}
            </div>
        `;
        menuContainer.appendChild(categoryContainer);
    });
}

// Tạo item menu
function createMenuItem(item) {
    return `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="menu-item card h-100">
                <img src="${item.image}" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h6 class="card-title">${item.name}</h6>
                    <p class="card-text small text-muted">${item.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-primary fw-bold">${formatPrice(item.price)}</span>
                        <button class="btn btn-sm btn-outline-primary" onclick="addToCart(${item.id})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Lấy tên danh mục
function getCategoryName(category) {
    const names = {
        appetizers: "Khai vị",
        mainDishes: "Món chính",
        desserts: "Tráng miệng"
    };
    return names[category] || category;
}

// Khởi tạo tabs menu
function initializeMenuTabs() {
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-bs-target');
            showMenuTab(target);
        });
    });
}

// Hiển thị tab menu
function showMenuTab(target) {
    // Ẩn tất cả tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active');
    });
    
    // Hiển thị tab được chọn
    const targetPane = document.querySelector(target);
    if (targetPane) {
        targetPane.classList.add('show', 'active');
    }
}

// Hiển thị giờ mở cửa
function displayOpeningHours() {
    const hoursContainer = document.getElementById('openingHours');
    if (!hoursContainer) return;
    
    const days = {
        monday: 'Thứ 2',
        tuesday: 'Thứ 3',
        wednesday: 'Thứ 4',
        thursday: 'Thứ 5',
        friday: 'Thứ 6',
        saturday: 'Thứ 7',
        sunday: 'Chủ nhật'
    };
    
    hoursContainer.innerHTML = Object.keys(currentRestaurant.openingHours).map(day => 
        `<div class="d-flex justify-content-between">
            <span>${days[day]}</span>
            <span>${currentRestaurant.openingHours[day]}</span>
        </div>`
    ).join('');
}

// Hiển thị đánh giá
function displayReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (!reviewsContainer) return;
    
    if (currentRestaurant.reviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="text-muted">Chưa có đánh giá nào.</p>';
        return;
    }
    
    reviewsContainer.innerHTML = currentRestaurant.reviews.map(review => createReviewItem(review)).join('');
}

// Tạo item đánh giá
function createReviewItem(review) {
    return `
        <div class="review-item border-bottom pb-3 mb-3">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${review.user}</h6>
                    <div class="text-warning mb-2">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
                <small class="text-muted">${formatDate(review.date)}</small>
            </div>
            <p class="mb-0">${review.comment}</p>
        </div>
    `;
}

// Khởi tạo form đánh giá
function initializeReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', submitReview);
    }
    
    // Xử lý rating stars
    const ratingStars = document.querySelectorAll('.rating-star');
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', () => selectRating(index + 1));
    });
}

// Chọn rating
function selectRating(rating) {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('text-warning');
        } else {
            star.classList.remove('text-warning');
        }
    });
    
    document.getElementById('selectedRating').value = rating;
}

// Gửi đánh giá
function submitReview(e) {
    e.preventDefault();
    
    const rating = document.getElementById('selectedRating').value;
    const comment = document.getElementById('reviewComment').value;
    
    if (!rating || !comment) {
        alert('Vui lòng chọn đánh giá và viết nhận xét');
        return;
    }
    
    // Tạo đánh giá mới
    const newReview = {
        id: currentRestaurant.reviews.length + 1,
        user: "Khách hàng",
        rating: parseInt(rating),
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    };
    
    // Thêm vào danh sách đánh giá
    currentRestaurant.reviews.unshift(newReview);
    currentRestaurant.reviewCount++;
    
    // Cập nhật hiển thị
    displayReviews();
    updateRating();
    
    // Reset form
    document.getElementById('reviewForm').reset();
    document.querySelectorAll('.rating-star').forEach(star => {
        star.classList.remove('text-warning');
    });
    
    alert('Cảm ơn bạn đã đánh giá!');
}

// Cập nhật rating tổng
function updateRating() {
    const totalRating = currentRestaurant.reviews.reduce((sum, review) => sum + review.rating, 0);
    currentRestaurant.rating = (totalRating / currentRestaurant.reviews.length).toFixed(1);
    
    const ratingElement = document.getElementById('restaurantRating');
    if (ratingElement) {
        ratingElement.innerHTML = `
            ${'★'.repeat(Math.floor(currentRestaurant.rating))}${currentRestaurant.rating % 1 !== 0 ? '☆' : ''} 
            ${currentRestaurant.rating} (${currentRestaurant.reviewCount} đánh giá)
        `;
    }
}

// Thêm vào giỏ hàng
function addToCart(itemId) {
    // Tìm item trong menu
    let item = null;
    Object.keys(currentRestaurant.menu).forEach(category => {
        const found = currentRestaurant.menu[category].find(menuItem => menuItem.id === itemId);
        if (found) item = found;
    });
    
    if (!item) return;
    
    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Kiểm tra item đã có trong giỏ hàng chưa
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: item.name,
            price: item.price,
            quantity: 1,
            restaurantId: currentRestaurant.id,
            restaurantName: currentRestaurant.name
        });
    }
    
    // Lưu giỏ hàng
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Hiển thị thông báo
    showNotification(`${item.name} đã được thêm vào giỏ hàng!`);
}

// Hiển thị thông báo
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Đặt bàn
function bookTable() {
    window.location.href = `booking.html?restaurant=${currentRestaurant.id}`;
}

// Gọi điện
function callRestaurant() {
    window.location.href = `tel:${currentRestaurant.phone}`;
}

// Chia sẻ
function shareRestaurant() {
    if (navigator.share) {
        navigator.share({
            title: currentRestaurant.name,
            text: currentRestaurant.description,
            url: window.location.href
        });
    } else {
        // Fallback: copy URL
        navigator.clipboard.writeText(window.location.href);
        showNotification('Đã sao chép link vào clipboard!');
    }
}

// Yêu thích nhà hàng
function toggleFavorite() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(currentRestaurant.id);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(currentRestaurant.id);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Cập nhật UI
    const heartIcon = document.querySelector('.favorite-btn i');
    if (heartIcon) {
        heartIcon.classList.toggle('text-danger');
    }
    
    showNotification(index > -1 ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
}

// Format giá
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

// Format ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Hiển thị lỗi
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
        `;
    }
} 