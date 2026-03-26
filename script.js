const apiUrl = 'https://dummyjson.com/products?limit=50';
let products = [];

async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        products = data.products;
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

fetchProducts();
