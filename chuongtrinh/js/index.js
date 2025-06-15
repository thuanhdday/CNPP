// Dữ liệu mẫu nhà hàng
const restaurants = [
    {
        id: 1,
        name: "Nhà hàng Việt Nam",
        image: "images/restaurant1.jpg",
        cuisine: "vietnamese",
        location: "Hoàn Kiếm",
        rating: 4.5,
        price: "200,000 - 500,000",
        discount: "20%",
        features: ["WiFi", "Parking", "Delivery"]
    },
    {
        id: 2,
        name: "Nhà hàng Á Châu",
        image: "images/restaurant2.jpg",
        cuisine: "asian",
        location: "Ba Đình",
        rating: 4.2,
        price: "300,000 - 800,000",
        discount: "15%",
        features: ["WiFi", "Parking"]
    },
    {
        id: 3,
        name: "Nhà hàng Âu Châu",
        image: "images/restaurant3.jpg",
        cuisine: "european",
        location: "Đống Đa",
        rating: 4.8,
        price: "500,000 - 1,200,000",
        discount: "10%",
        features: ["WiFi", "Parking", "Delivery", "Reservation"]
    }
];

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    initializeSearch();
    loadRestaurants();
    initializeFilters();
});

// Khởi tạo tìm kiếm
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterRestaurants(query);
        });
    }
}

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
}

// Lọc nhà hàng
function filterRestaurants(query = '') {
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    restaurantCards.forEach(card => {
        const name = card.querySelector('.restaurant-name').textContent.toLowerCase();
        if (name.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Áp dụng bộ lọc
function applyFilters() {
    const activeCuisine = document.querySelector('.cuisine-tag.active').dataset.cuisine;
    const selectedRating = document.querySelector('input[name="rating"]:checked').id;
    const priceMin = document.getElementById('priceMin')?.value;
    const priceMax = document.getElementById('priceMax')?.value;

    const filteredRestaurants = restaurants.filter(restaurant => {
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

        // Lọc theo giá (nếu có)
        if (priceMin || priceMax) {
            const price = parseInt(restaurant.price.split('-')[0].replace(/[^\d]/g, ''));
            if (priceMin && price < parseInt(priceMin)) return false;
            if (priceMax && price > parseInt(priceMax)) return false;
        }

        return true;
    });

    displayRestaurants(filteredRestaurants);
}

// Hiển thị danh sách nhà hàng
function displayRestaurants(restaurantsToShow = restaurants) {
    const container = document.getElementById('restaurantsContainer');
    if (!container) return;

    container.innerHTML = '';

    restaurantsToShow.forEach(restaurant => {
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
                <h5 class="restaurant-name">${restaurant.name}</h5>
                <div class="restaurant-rating">
                    ${'★'.repeat(Math.floor(restaurant.rating))}${restaurant.rating % 1 !== 0 ? '☆' : ''} ${restaurant.rating}
                </div>
                <p class="restaurant-price">${restaurant.price}</p>
                ${restaurant.discount ? `<span class="restaurant-discount">Giảm ${restaurant.discount}</span>` : ''}
                <div class="restaurant-features">
                    ${restaurant.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    return card;
}

// Xem chi tiết nhà hàng
function viewRestaurant(id) {
    window.location.href = `restaurant-detail.html?id=${id}`;
}

// Tải nhà hàng ban đầu
function loadRestaurants() {
    displayRestaurants();
}

// Xử lý tìm kiếm nâng cao
function advancedSearch() {
    const location = document.getElementById('locationSelect')?.value;
    const cuisine = document.getElementById('cuisineSelect')?.value;
    const priceRange = document.getElementById('priceRange')?.value;

    // Thực hiện tìm kiếm dựa trên các tiêu chí
    console.log('Tìm kiếm với:', { location, cuisine, priceRange });
    
    // Có thể gọi API hoặc lọc dữ liệu local
    alert('Chức năng tìm kiếm nâng cao đang được phát triển!');
}

// Xử lý đặt bàn nhanh
function quickBooking(restaurantId) {
    window.location.href = `booking.html?restaurant=${restaurantId}`;
}

// Xử lý đánh giá nhà hàng
function rateRestaurant(restaurantId, rating) {
    // Gửi đánh giá lên server
    console.log(`Đánh giá nhà hàng ${restaurantId} với ${rating} sao`);
    alert('Cảm ơn bạn đã đánh giá!');
}

// Xử lý yêu thích nhà hàng
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
    const heartIcon = document.querySelector(`[data-restaurant="${restaurantId}"] .heart-icon`);
    if (heartIcon) {
        heartIcon.classList.toggle('text-danger');
    }
} 