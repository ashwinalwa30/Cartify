const apiUrl = 'https://dummyjson.com/products?limit=50';
let products = [];
const grid = document.getElementById('product-grid');

async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        products = data.products;
        renderProducts();
    } catch (error) {
        grid.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

function renderProducts() {
    grid.innerHTML = '';
    if (products.length === 0) {
        grid.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
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

fetchProducts();
