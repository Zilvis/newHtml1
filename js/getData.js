var offset = 0;
var limit = 12;
var url = 'http://35.228.181.251:8080/item';

let productListHTML = document.querySelector('.content');
let productList = [];

// Function to fetch products
async function getPosts() {     
    try {
        let response = await fetch(url + '/getAll' + `?offset=${offset}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',               
            },                    
        });

        if (response.status === 204) { 
            console.log("No Data");
            return [];
        } else if (response.status === 200) {
            return await response.json();
        } else {
            console.error('Unexpected response status:', response.status);
            return [];
        }

    } catch (error) {
        console.error('Error:', error);
        return [];
    }     
}

// Function to display products on the page
const addDataToHtml = (productList) => {
    productListHTML.innerHTML = '';  // Clear previous HTML
    if (productList.length > 0) {
        productList.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <div class="item">
                    <img src="${product.imageUrl}" alt="${product.name}"/>
                    <button onclick="showMoreInfo(${product.id})">Daugiau</button>
                    <p>${product.name}</p>
                    <ul>
                        <li><i class="fas fa-euro-sign"></i>Kaina: ${product.price} EUR</li>
                        <li><i class="fas fa-chair"></i>Kategorija: ${product.category}</li>
                    </ul>
                </div>
            `;
            productListHTML.appendChild(newProduct);
        });
    }
};

const showMoreInfo = (productId) => {
    const product = productList.find(p => p.id === productId);
    if (product) {
        const modalContainer = document.querySelector('.modal-container');
        modalContainer.innerHTML = `
            <div class="product-details">
                <h2>${product.name}</h2>
                <p><strong>Kaina:</strong> ${product.price} EUR</p>
                <p><strong>Kategorija:</strong> ${product.category}</p>
                <p><strong>Aprašymas:</strong> ${product.description || 'Nėra aprašymo.'}</p>
                <div class="button-container">
                    <button class="edit" onclick="editProduct(${product.id})">Redaguoti</button>
                    <button class="delete" onclick="deleteProduct(${product.id})">Ištrinti</button>
                </div>
            </div>
            <img src="${product.imageUrl}" alt="${product.name}"/>
        `;
        document.getElementById('moreInfo').style.display = 'block';
    }
};

const editProduct = (productId) => {
    alert('Redaguoti produktą: ' + productId);
    // Add your editing logic here
};

const deleteProduct = (productId) => {
    alert('Ištrinti produktą: ' + productId);
    // Add your deletion logic here
};

// Fetch and display products on page load
(async () => {
    productList = await getPosts();
    addDataToHtml(productList);
})();
