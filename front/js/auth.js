import { apiUrl } from './config.js';
import { esEmailValido } from './utils.js';

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
            body: JSON.stringify({ username, password }),
            // credentials: 'include'  // Incluye las cookies si es necesario
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (response.ok && data.token) {
            // Almacenar el token y otros datos en localStorage
            localStorage.setItem('authToken', data.token);
            window.location.href = '/front/home.html'; // Redirigir a la página principal //TODO: Cambiar en produccion
            console.log('Inicio de sesión exitoso:', data);
        } else {
            alert('Error en el inicio de sesión: ' + (data.error || 'Desconocido'));
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud de inicio de sesión.');
    }
}

async function getUserData() {
    // console.log('Obteniendo datos del usuario...');
    const authToken = `bearer: ${localStorage.getItem('authToken')}`;
    console.log('Token de autenticación:', authToken);
    try {
        const response = await fetch(`${apiUrl}/auth/profile`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`,
            }
        });

        if (!response.ok) {
            // Si la respuesta no es exitosa, lanzamos un error
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al obtener los datos del usuario');
        }

        const data = await response.json();
        console.log('Datos del usuario:', data.message);

        // Aquí actualizamos los elementos del DOM con los datos obtenidos
        document.getElementById('username').textContent = data.message.username || '-';
        document.getElementById('email').textContent = `Email: ${data.message.email || '-'}`;
        document.getElementById('location').textContent = `Ubicación: ${data.message.place || '-'}`;
        document.getElementById('registration-date').textContent = `Fecha de Registro: ${data.message.createdat || '-'}`;
        
        document.getElementById('editName').setAttribute('placeholder', data.message.name || '');
        document.getElementById('editPhoneNumber').setAttribute('placeholder', data.message.phoneNumber || '');
        document.getElementById('editBio').setAttribute('placeholder', data.message.bio || '');
        document.getElementById('editUsername').setAttribute('placeholder', data.message.username || '');
        document.getElementById('editEmail').setAttribute('placeholder', data.message.email || '');
        document.getElementById('editLocation').setAttribute('placeholder', data.message.place || '');

        // Si tienes una URL de imagen de perfil, puedes asignarla también
        // Si no, se usará una imagen predeterminada
        const profileImage = document.getElementById('profile-image');
        if (data.message.profileImage) {
            profileImage.src = data.message.profileImage;
        }

    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al obtener los datos del usuario.');
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

    const esEmailValido = esEmailValido(userData.email);

    if (!esEmailValido) {
        alert('Por favor, ingresa un email válido');
        return;
    }

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
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un problema al registrar al usuario');
    }
}

async function EditProfile() {
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const username = document.getElementById('editUsername').value;
    const place = document.getElementById('editLocation').value;
    const phoneNumber = document.getElementById('editPhoneNumber').value;
    const bio = document.getElementById('editBio').value;
    const profileImage = document.getElementById('editProfileImage').files[0];
    const profileImageBase64 = await getBase64FromFile(profileImage);

    const phoneNumberValid = esNumeroChilenoValido(phoneNumber);
    const emailValid = esEmailValido(email);

    if (!emailValid) {
        alert('Por favor, ingresa un email válido');
        return;
    }
    if (!phoneNumberValid) {
        alert('Por favor, ingresa un número de teléfono válido');
        return;
    }

    try {
        // Obtener el token de autenticación desde localStorage
        const authToken = `Bearer ${localStorage.getItem('authToken')}`;
        
        // Realizar la solicitud para actualizar el perfil
        const response = await fetch(`${apiUrl}/auth/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken,
            },
            body: JSON.stringify({ name, emailValid, username, place, phoneNumberValid, bio, profileImageBase64 }),
        });

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el perfil.');
        }

        const data = await response.json();
        console.log('Perfil actualizado:', data);

        // Actualizar la información visible en la página
        document.getElementById('username').innerText = username;
        document.getElementById('email').innerText = `Email: ${email}`;
        document.getElementById('location').innerText = `Ubicación: ${location}`;

        alert('Perfil actualizado con éxito');
        // Cerrar el modal después de guardar los cambios
        document.getElementById('myModal').style.display = "none";

    } catch (error) {
        console.error(error);
        alert('Error al actualizar el perfil.');
    }
}


async function logout() {
    // Elimina la cookie de sesión
    
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // También puedes eliminar el token de localStorage si lo estás usando
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUsername');
    localStorage.removeItem('authName');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authId');
    
    // Redirige al usuario a la página de login
    window.location.href = "/front/home.html"; //TODO: Cambiar en produccion
}

document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            console.log('Cerrando sesión...');
            logout();
        });
    } else {
        console.log('Botón de logout no encontrado');
    }
});

function modal() {
    const modal = document.getElementById("myModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalBtn = document.getElementsByClassName("close")[0];
    const saveProfileBtn = document.getElementById("saveChangesBtn");

    // Abre el modal
    openModalBtn.onclick = function() {
        modal.style.display = "block";
    }

    // Cierra el modal cuando se hace clic en la "X"
    closeModalBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Cierra el modal si se hace clic fuera del contenido del modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Agregar el evento para guardar cambios
    if (saveProfileBtn) {
        saveProfileBtn.onclick = function() {
            EditProfile();
        }
    }
}


$(document).ready(function() {
    console.log('Document ready');
    console.log('Path:', window.location.pathname);
    const currentPath = window.location.pathname;

    if (currentPath === '/front/registrar.html' || currentPath === '/registro') {
        document.getElementById('botonRegistrarse').addEventListener('click', function(event) {
            registerUser(event);
        });
    }
    if (currentPath === '/front/login.html' || currentPath === '/Login') {
        document.getElementById('botonLogin').addEventListener('click', function(event) {
            loginUser(event);
        });
    }
    if (currentPath === '/front/perfil.html' || currentPath === '/perfil') {
        getUserData();
        modal();  // Asegurarse de que el modal esté inicializado

        const editProfileForm = document.getElementById('editarPerfilModal');
        if (editProfileForm) {
            const saveProfileBtn = document.getElementById('saveChangesBtn');  // Asegurarse de que este botón esté vinculado
            if (saveProfileBtn) {
                saveProfileBtn.addEventListener('click', async () => {
                    EditProfile();  // Guardar cambios al hacer clic
                });
            }
        }
    }
});