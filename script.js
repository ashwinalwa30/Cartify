const apiUrl = 'https://dummyjson.com/products?limit=50';
let products = [];
const grid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

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
        return matchesSearch && matchesCategory;
    });

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

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(category);
        grid.appendChild(card);
    });
}

searchInput.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);

fetchProducts();
