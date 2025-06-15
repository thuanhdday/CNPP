// Dữ liệu mẫu nhà hàng
let allRestaurants = [
    {
        id: 1,
        name: "Nhà hàng Việt Nam",
        image: "images/restaurant1.jpg",
        cuisine: "vietnamese",
        location: "hoan-kiem",
        rating: 4.5,
        price: "200,000 - 500,000",
        priceMin: 200000,
        priceMax: 500000,
        discount: "20%",
        features: ["WiFi", "Parking", "Delivery"],
        description: "Nhà hàng phục vụ các món ăn truyền thống Việt Nam"
    },
    {
        id: 2,
        name: "Nhà hàng Á Châu",
        image: "images/restaurant2.jpg",
        cuisine: "asian",
        location: "ba-dinh",
        rating: 4.2,
        price: "300,000 - 800,000",
        priceMin: 300000,
        priceMax: 800000,
        discount: "15%",
        features: ["WiFi", "Parking"],
        description: "Chuyên phục vụ các món ăn châu Á"
    },
    {
        id: 3,
        name: "Nhà hàng Âu Châu",
        image: "images/restaurant3.jpg",
        cuisine: "european",
        location: "dong-da",
        rating: 4.8,
        price: "500,000 - 1,200,000",
        priceMin: 500000,
        priceMax: 1200000,
        discount: "10%",
        features: ["WiFi", "Parking", "Delivery", "Reservation"],
        description: "Nhà hàng sang trọng phục vụ món Âu"
    },
    {
        id: 4,
        name: "Nhà hàng Hải sản",
        image: "images/restaurant4.jpg",
        cuisine: "seafood",
        location: "hai-ba-trung",
        rating: 4.6,
        price: "400,000 - 1,000,000",
        priceMin: 400000,
        priceMax: 1000000,
        discount: "25%",
        features: ["WiFi", "Parking", "Delivery"],
        description: "Chuyên về các món hải sản tươi ngon"
    }
];

let filteredRestaurants = [...allRestaurants];

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    initializeFilters();
    initializeSearch();
    initializeSorting();
    displayRestaurants();
    updateRestaurantCount();
});

// Khởi tạo bộ lọc
function initializeFilters() {
    // Lọc theo ẩm thực
    const cuisineTags = document.querySelectorAll('.cuisine-tag');
    cuisineTags.forEach(tag => {
        tag.addEventListener('click', () => {
            cuisineTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            applyFilters();
        });
    });

    // Lọc theo đánh giá
    const ratingFilters = document.querySelectorAll('input[name="rating"]');
    ratingFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    // Lọc theo giá
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    if (priceMin && priceMax) {
        priceMin.addEventListener('input', applyFilters);
        priceMax.addEventListener('input', applyFilters);
    }

    // Lọc theo khu vực
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.addEventListener('change', applyFilters);
    }
}

// Khởi tạo tìm kiếm
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterBySearch(query);
        });
    }
}

// Khởi tạo sắp xếp
function initializeSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortRestaurants(e.target.value);
        });
    }
}

// Lọc theo tìm kiếm
function filterBySearch(query) {
    if (!query) {
        filteredRestaurants = [...allRestaurants];
    } else {
        filteredRestaurants = allRestaurants.filter(restaurant => 
            restaurant.name.toLowerCase().includes(query) ||
            restaurant.description.toLowerCase().includes(query)
        );
    }
    applyFilters();
}

// Áp dụng bộ lọc
function applyFilters() {
    const activeCuisine = document.querySelector('.cuisine-tag.active')?.dataset.cuisine || 'all';
    const selectedRating = document.querySelector('input[name="rating"]:checked')?.id || 'all';
    const priceMin = document.getElementById('priceMin')?.value;
    const priceMax = document.getElementById('priceMax')?.value;
    const location = document.getElementById('locationFilter')?.value || '';

    filteredRestaurants = filteredRestaurants.filter(restaurant => {
        // Lọc theo ẩm thực
        if (activeCuisine !== 'all' && restaurant.cuisine !== activeCuisine) {
            return false;
        }

        // Lọc theo đánh giá
        if (selectedRating === '4plus' && restaurant.rating < 4) {
            return false;
        }
        if (selectedRating === '3plus' && restaurant.rating < 3) {
            return false;
        }

        // Lọc theo giá
        if (priceMin && restaurant.priceMin < parseInt(priceMin)) {
            return false;
        }
        if (priceMax && restaurant.priceMax > parseInt(priceMax)) {
            return false;
        }

        // Lọc theo khu vực
        if (location && restaurant.location !== location) {
            return false;
        }

        return true;
    });

    displayRestaurants();
    updateRestaurantCount();
}

// Sắp xếp nhà hàng
function sortRestaurants(sortBy) {
    switch (sortBy) {
        case 'name':
            filteredRestaurants.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            filteredRestaurants.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-low':
            filteredRestaurants.sort((a, b) => a.priceMin - b.priceMin);
            break;
        case 'price-high':
            filteredRestaurants.sort((a, b) => b.priceMax - a.priceMax);
            break;
        default:
            break;
    }
    displayRestaurants();
}

// Hiển thị danh sách nhà hàng
function displayRestaurants() {
    const container = document.getElementById('restaurantsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (filteredRestaurants.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>Không tìm thấy nhà hàng nào</h4>
                <p class="text-muted">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
        `;
        return;
    }

    filteredRestaurants.forEach(restaurant => {
        const card = createRestaurantCard(restaurant);
        container.appendChild(card);
    });
}

// Tạo card nhà hàng
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4 mb-4';
    card.innerHTML = `
        <div class="restaurant-card" onclick="viewRestaurant(${restaurant.id})">
            <img src="${restaurant.image}" alt="${restaurant.name}" class="card-img-top">
            <div class="restaurant-info">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="restaurant-name mb-0">${restaurant.name}</h5>
                    <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); toggleFavorite(${restaurant.id})">
                        <i class="fas fa-heart heart-icon"></i>
                    </button>
                </div>
                <div class="restaurant-rating mb-2">
                    ${'★'.repeat(Math.floor(restaurant.rating))}${restaurant.rating % 1 !== 0 ? '☆' : ''} ${restaurant.rating}
                </div>
                <p class="restaurant-price mb-2">${restaurant.price}</p>
                ${restaurant.discount ? `<span class="restaurant-discount mb-2">Giảm ${restaurant.discount}</span>` : ''}
                <p class="text-muted small mb-2">${restaurant.description}</p>
                <div class="restaurant-features">
                    ${restaurant.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="mt-3">
                    <button class="btn btn-primary btn-sm me-2" onclick="event.stopPropagation(); quickBooking(${restaurant.id})">
                        <i class="fas fa-calendar-plus me-1"></i>Đặt bàn
                    </button>
                    <button class="btn btn-outline-primary btn-sm" onclick="event.stopPropagation(); viewRestaurant(${restaurant.id})">
                        <i class="fas fa-eye me-1"></i>Chi tiết
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
}

// Cập nhật số lượng nhà hàng
function updateRestaurantCount() {
    const countElement = document.getElementById('restaurantCount');
    if (countElement) {
        countElement.textContent = filteredRestaurants.length;
    }
}

// Xem chi tiết nhà hàng
function viewRestaurant(id) {
    window.location.href = `restaurant-detail.html?id=${id}`;
}

// Đặt bàn nhanh
function quickBooking(restaurantId) {
    window.location.href = `booking.html?restaurant=${restaurantId}`;
}

// Yêu thích nhà hàng
function toggleFavorite(restaurantId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(restaurantId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(restaurantId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Cập nhật UI
    const heartIcon = document.querySelector(`[onclick*="${restaurantId}"] .heart-icon`);
    if (heartIcon) {
        heartIcon.classList.toggle('text-danger');
    }
}

// Xóa bộ lọc
function clearFilters() {
    // Reset tất cả bộ lọc
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.cuisine-tag').forEach(tag => tag.classList.remove('active'));
    document.querySelector('.cuisine-tag[data-cuisine="all"]').classList.add('active');
    document.getElementById('locationFilter').value = '';
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    document.getElementById('all').checked = true;
    
    // Reset danh sách
    filteredRestaurants = [...allRestaurants];
    displayRestaurants();
    updateRestaurantCount();
}

// Xuất kết quả
function exportResults() {
    const data = filteredRestaurants.map(restaurant => ({
        Tên: restaurant.name,
        'Đánh giá': restaurant.rating,
        'Khoảng giá': restaurant.price,
        'Giảm giá': restaurant.discount || 'Không có',
        'Địa điểm': restaurant.location
    }));

    const csv = convertToCSV(data);
    downloadCSV(csv, 'danh-sach-nha-hang.csv');
}

// Chuyển đổi sang CSV
function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    return csvContent;
}

// Tải xuống CSV
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
} 