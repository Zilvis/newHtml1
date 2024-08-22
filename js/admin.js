// Prisijungimo forma
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://35.228.181.251:8080/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, password })
        });

        if (response.ok) {
            const token = await response.text();
            document.cookie = `authToken=${token}; path=/`;
            displayLoginResult('Login successful!');
            showAdminFunctions();
            loadItems(); // Įkeliam prekes po prisijungimo
        } else {
            displayLoginResult('Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        displayLoginResult('An error occurred during login.');
    }
});

// Rodyti administravimo funkcijas tik prisijungus
function showAdminFunctions() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminFunctions').style.display = 'block';
}

// Gauti tokeną iš cookies
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Patikrinti ar vartotojas prisijungęs, įkeliant puslapį
window.onload = function() {
    const token = getCookie('authToken');
    if (token) {
        showAdminFunctions();
        loadItems(); // Įkeliam prekes jei vartotojas jau prisijungęs
    }
}

// Atsijungimo mygtuko funkcionalumas
document.getElementById('logoutButton').addEventListener('click', function() {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    location.reload(); // Perkrauna puslapį, kad grąžintų vartotoją į prisijungimo formą
});

// Įkelti prekes iš serverio
async function loadItems() {
    const token = getCookie('authToken');
    if (!token) {
        displayResult('No authorization token found.');
        return;
    }

    try {
        const response = await fetch('http://35.228.181.251:8080/item/getAll?offset=0&limit=110', {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ offset: 0, limit: 10 }) // Galite pakeisti filtravimą pagal poreikį
        });

        if (response.ok) {
            const items = await response.json();
            displayItems(items);
        } else {
            displayResult('Failed to load items.');
        }
    } catch (error) {
        console.error('Error:', error);
        displayResult('An error occurred while loading items.');
    }
}

// Rodyti prekes sąraše
function displayItems(items) {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = ''; // Išvalome esamą sąrašą

    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card', 'clearfix');

        itemCard.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Price: €${item.price}</p>
            <button onclick="deleteItem(${item.id})">Delete</button>
            <button onclick="editItem(${item.id})">Edit</button>
        `;

        itemsList.appendChild(itemCard);
    });
}

// Įdėti naują prekę
document.getElementById('addItemForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const token = getCookie('authToken');
    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const price = document.getElementById('itemPrice').value;

    try {
        const response = await fetch(`http://35.228.181.251:8080/item/new/Sergejus`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price })
        });

        if (response.ok) {
            displayResult('Item added successfully.');
            loadItems(); // Perkrauna prekių sąrašą po naujos prekės pridėjimo
        } else {
            displayResult('Failed to add item.');
        }
    } catch (error) {
        console.error('Error:', error);
        displayResult('An error occurred while adding item.');
    }
});

// Atnaujinti prekę
document.getElementById('updateItemForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const token = getCookie('authToken');
    const id = document.getElementById('updateItemId').value;
    const name = document.getElementById('updateItemName').value;
    const description = document.getElementById('updateItemDescription').value;
    const price = document.getElementById('updateItemPrice').value;

    try {
        const response = await fetch(`http://localhost:8080/new/admin/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price })
        });

        if (response.ok) {
            displayResult('Item updated successfully.');
            loadItems(); // Perkrauna prekių sąrašą po atnaujinimo
        } else {
            displayResult('Failed to update item.');
        }
    } catch (error) {
        console.error('Error:', error);
        displayResult('An error occurred while updating item.');
    }
});

// Ištrinti prekę
async function deleteItem(id) {
    const token = getCookie('authToken');

    try {
        const response = await fetch(`http://localhost:8080/delete/admin/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            displayResult('Item deleted successfully.');
            loadItems(); // Perkrauna prekių sąrašą po ištrynimo
        } else {
            displayResult('Failed to delete item.');
        }
    } catch (error) {
        console.error('Error:', error);
        displayResult('An error occurred while deleting item.');
    }
}

// Rodyti rezultatų žinutę
function displayResult(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
}

// Rodyti prisijungimo rezultatą
function displayLoginResult(message) {
    const loginResultDiv = document.getElementById('loginResult');
    loginResultDiv.textContent = message;
}
