const apiUrl = 'https://dummyjson.com/products?limit=50';
let products = [];
let favorites = JSON.parse(localStorage.getItem('cartify_favorites')) || [];
let showOnlyFavorites = false;
const grid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');
const favBtn = document.getElementById('favorites-btn');
const themeBtn = document.getElementById('theme-btn');

async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        products = data.products;
        setupCategories();
        renderProducts();
    } catch (error) {
        grid.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

function setupCategories() {
    const categories = [];
    products.forEach(product => {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function renderProducts() {
    grid.innerHTML = '';
    
    let filtered = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesCategory = categoryFilter.value === 'all' || product.category === categoryFilter.value;
        const matchesFavorites = !showOnlyFavorites || favorites.includes(product.id);
        return matchesSearch && matchesCategory && matchesFavorites;
    });

    if (sortSelect.value === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortSelect.value === 'name-asc') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortSelect.value === 'name-desc') {
        filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<p>No products found.</p>';
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = product.image || product.thumbnail;
        img.alt = product.title;

        const title = document.createElement('h3');
        title.textContent = product.title;

        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = '$' + product.price.toFixed(2);

        const category = document.createElement('p');
        category.className = 'category';
        category.textContent = product.category;

        const button = document.createElement('button');
        button.className = 'fav-btn';
        if (favorites.includes(product.id)) {
            button.classList.add('active');
            button.textContent = 'Remove Favorite';
        } else {
            button.textContent = 'Add Favorite';
        }
        button.addEventListener('click', () => toggleFavorite(product.id, button));

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(category);
        grid.appendChild(card);
    });
}

function toggleFavorite(id, button) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        button.classList.remove('active');
        button.textContent = 'Add Favorite';
    } else {
        favorites.push(id);
        button.classList.add('active');
        button.textContent = 'Remove Favorite';
    }
    localStorage.setItem('cartify_favorites', JSON.stringify(favorites));
    if (showOnlyFavorites) {
        renderProducts();
    }
}

searchInput.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);
sortSelect.addEventListener('change', renderProducts);

favBtn.addEventListener('click', () => {
    showOnlyFavorites = !showOnlyFavorites;
    if (showOnlyFavorites) {
        favBtn.textContent = 'Show All Products';
    } else {
        favBtn.textContent = 'Show Favorites';
    }
    renderProducts();
});

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('cartify_theme', isDark ? 'dark' : 'light');
});

if (localStorage.getItem('cartify_theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

fetchProducts();
