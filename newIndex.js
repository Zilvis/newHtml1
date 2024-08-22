var offset = 0;
var limit = 12;
var url = 'http://35.228.181.251:8080/item';

let productListHTML = document.querySelector('.productList');
let productList = [];

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

const addDataToHtml = (productList) => {
    productListHTML.innerHTML = '';  // Clear previous HTML
    if (productList.length > 0) {
        productList.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img onclick="redirectToDetailsPage(${product.id})" src="${product.imageUrl}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.price} €</div>
                <button class="addToCart"><i class="fa-solid fa-cart-shopping" style="margin-right: 10px;"></i>į krepšelį</button>    
             
            `;
            productListHTML.appendChild(newProduct);
        });
    }
};

const redirectToDetailsPage = (productId) => {
    window.location.href = `newFull.html?id=${productId}`;
};

(async () => {
    productList = await getPosts();
    addDataToHtml(productList);
})();

/* Pilnos uzkrovimas */

const loadProductDetails = () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    fetch(`http://35.228.181.251:8080/item/${productId}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                document.getElementById('productDetails').innerHTML = '<p>Produktas nerastas.</p>';
                throw new Error('Produktas nerastas.');
            } else {
                throw new Error('Nepavyko užkrauti produkto informacijos.');
            }
        })
        .then(product => {
            document.getElementById('productDetails').innerHTML = `
                <div class="fullLeft">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="fullRight">
                    <h2>${product.name}</h2>
                    <ul>
                        <li>Kategorija: ${product.category}</li>
                        <li>Kaina ${product.price} EUR</li>
                        <li>${product.description}</li>
                    </ul>
                    <div class="button-container">
                        <button class="fullBtn"><i class="fa-solid fa-cart-shopping" style="margin-right: 10px;"></i>Į krepšelį</button>
                        <button class="fullBtn"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="fullBtn"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Klaida:', error);
            document.getElementById('productDetails').innerHTML = '<p>Įvyko klaida kraunant produkto duomenis.</p>';
        });
};
