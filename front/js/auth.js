import { apiUrl } from './config.js';

// Función para manejar el inicio de sesión
async function loginUser(event) {
    event.preventDefault(); // Evita el envío del formulario tradicional

    const username = document.getElementById('loginnombre').value;
    const password = document.getElementById('logincontrasena').value;

    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            console.log('Inicio de sesión exitoso:', data);
            window.location.href = 'index.html';
        } else {
            alert('Error en el inicio de sesión: ' + data.error);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud de inicio de sesión.');
    }
}

// Función para manejar el registro de usuario
async function registerUser(event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    const userData = {
        name: document.getElementById('registrarnombre').value,
        email: document.getElementById('registraremail').value,
        username: document.getElementById('registrarusername').value,
        password: document.getElementById('registrarcontrasena').value,
    };

    if (!userData.name || !userData.email || !userData.username || !userData.password) {
        alert('Por favor, completa todos los campos');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'No se pudo registrar al usuario'}`);
            return;
        }

        const data = await response.json();
        alert('Registro exitoso');
        console.log('Usuario registrado:', data);
        window.location.href = 'Login.html';
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un problema al registrar al usuario');
    }
}

document.getElementById('botonRegistrarse').addEventListener('click', function(event) {
    console.log('Register button clicked');
    registerUser(event);
});
