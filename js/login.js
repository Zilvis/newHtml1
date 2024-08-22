document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://35.228.181.251:8080/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, password }),
        });

        if (response.ok) {
            const textData = await response.text();
            
            // Bandoma išanalizuoti, ar atsakymas yra JSON
            try {
                const jsonData = JSON.parse(textData);
                setCookie('Authorization', textData, 1);
                console.log('Login successful', jsonData);
                
            } catch (e) {
                // Jei atsakymas nėra JSON, tikriausiai tai yra JWT arba kita tekstinė informacija
                console.log('Login successful, received token or text:', textData);
                // Galite išsaugoti token (pvz., į localStorage) ir naudoti jį vėliau
                // localStorage.setItem('authToken', textData);
            }
        } else {
            const errorText = await response.text();
            console.log('Error:', errorText);
            document.getElementById('error-message').textContent = 'Login failed: ' + errorText;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
    }
});

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

