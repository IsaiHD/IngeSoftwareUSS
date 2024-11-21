import { apiUrl } from './config.js';
import { convertirImagenABase64, esEmailValido } from './utils.js';

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
        // console.log('Respuesta del servidor:', data);

        if (response.ok && data.token) {
            // Almacenar el token y otros datos en localStorage
            localStorage.setItem('authToken', data.token);
            window.location.href = '/front/home.html'; // Redirigir a la página principal //TODO: Cambiar en produccion
            // console.log('Inicio de sesión exitoso:', data);
        } else {
            alert('Error en el inicio de sesión: ' + (data.error || 'Desconocido'));
        }
    } catch (error) {
        // console.error('Error en la solicitud:', error);
        alert('Error en la solicitud de inicio de sesión.');
    }
}

async function getUserData() {
    // console.log('Obteniendo datos del usuario...');
    const authToken = `bearer: ${localStorage.getItem('authToken')}`;
    // console.log('Token de autenticación:', authToken);
    try {
        const response = await fetch(`${apiUrl}/auth/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`,
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al obtener los datos del usuario');
        }

        const data = await response.json();
        //mostrar imagen de perfil
        console.log('Datos del usuario:', data.message.image);

        // Actualizar datos del usuario en el DOM
        document.getElementById('username').textContent = data.message.username || '-';
        document.getElementById('email').textContent = `Email: ${data.message.email || '-'}`;
        document.getElementById('phone-number').textContent = `Teléfono: ${data.message.phonenumber || '-'}`;
        document.getElementById('location').textContent = `Ubicación: ${data.message.place || '-'}`;
        document.getElementById('biografia').textContent = `Bio: ${data.message.bio || '-'}`;
        document.getElementById('registration-date').textContent = `Fecha de Registro: ${data.message.createdat || '-'}`;

        // Actualizar los placeholders en los campos de edición
        document.getElementById('editName').setAttribute('placeholder', data.message.name || '');
        document.getElementById('editPhoneNumber').setAttribute('placeholder', data.message.phonenumber || '');
        document.getElementById('editBio').setAttribute('placeholder', data.message.bio || '');
        document.getElementById('editUsername').setAttribute('placeholder', data.message.username || '');
        document.getElementById('editEmail').setAttribute('placeholder', data.message.email || '');
        document.getElementById('editLocation').setAttribute('placeholder', data.message.place || '');

        // Obtener la imagen de perfil. Si no existe, asignar la imagen predeterminada
        const profileImage = document.getElementById('profile-image');
        if (data.message.profileImage) {
            // Si hay una imagen en los datos, usarla
            profileImage.src = `data:image/png;base64,${data.message.image}`;
            console.log('Imagen de perfil:', profileImage.src);
        } else {
            // Si no hay imagen, usar la imagen predeterminada
            profileImage.src = `data:image/png;base64,${data.message.image}`;
        }

    } catch (error) {
        // console.error('Error en la solicitud:', error);
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
        // console.log('Usuario registrado:', data);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un problema al registrar al usuario');
    }
}

async function EditProfile(image) {
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const username = document.getElementById('editUsername').value;
    const place = document.getElementById('editLocation').value;
    const phoneNumber = document.getElementById('editPhoneNumber').value;
    const bio = document.getElementById('editBio').value;
    // const profileImageInput = document.getElementById('editProfileImage').files[0];

    const profileImageBase64 = await convertirImagenABase64(image);

    const authToken = localStorage.getItem('authToken');

    // Solo si hay cambios, enviar los datos correspondientes
    const bodyData = {
        name,
        email,
        username,
        place,
        phoneNumber,
        bio,
        image: profileImageBase64,  // Si profileImageBase64 es vacío, no lo incluir
    };

    try {
        const response = await fetch(`${apiUrl}/auth/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer: ${authToken}`, // Usar el encabezado correcto
            },
            body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el perfil.');
        }

        const data = await response.json();
        // console.log('Perfil actualizado:', data);

        //refrescar la página para ver los cambios
        window.location.reload();

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
            // console.log('Cerrando sesión...');
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
    // const saveProfileBtn = document.getElementById("saveChangesBtn");

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

    // // Agregar el evento para guardar cambios
    // if (saveProfileBtn) {
    //     saveProfileBtn.onclick = function() {
    //         EditProfile();
    //     }
    // }
}


$(document).ready(function() {
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
            document.getElementById("profile-image").addEventListener("click", function() {
                const profileImageInput = document.getElementById("profile-image-input");
                const profileErrorMessage = document.getElementById("profile-error-message");
                const confirmChangesButton = document.getElementById("confirm-changes-button");
                
                
            
                // Se asegura de que solo se añada un listener al evento change
                profileImageInput.removeEventListener("change", handleFileChange); // Elimina el listener anterior, si existe.
                profileImageInput.addEventListener("change", handleFileChange);
            
                // Función para manejar la selección de un archivo
                function handleFileChange() {
                    const archivo = profileImageInput.files[0];
                    if (archivo) {
                        validarArchivo(archivo, mostrarPrevisualizacion);
                    }
                }
            
                // Función para validar el archivo
                function validarArchivo(archivo, callback) {
                    const tiposPermitidos = ["image/png", "image/jpeg"];
                    if (archivo && tiposPermitidos.includes(archivo.type)) {
                        profileErrorMessage.style.display = "none";  // Ocultar el mensaje de error
                        callback(archivo);
                    } else {
                        profileErrorMessage.style.display = "block";  // Mostrar el mensaje de error
                        profileImageInput.value = "";  // Limpiar el input
                    }
                }
            
                // Función para mostrar la previsualización de la imagen
                function mostrarPrevisualizacion(archivo) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById("profile-image").src = e.target.result; // Mostrar previsualización en la imagen
                        confirmChangesButton.style.display = "block"; // Mostrar el botón de confirmar
                    };
                    reader.readAsDataURL(archivo);
                }
            
                // Evento para confirmar los cambios
                confirmChangesButton.addEventListener("click", function() {
                    const imageFile = document.getElementById('profile-image-input').files[0];
                    console.log('Imagen seleccionada:', imageFile);
                    EditProfile(imageFile); // Llamar a la función EditProfile cuando se confirma
                });
            });
            
        getUserData();
        modal();  // Asegurarse de que el modal esté inicializado

        const saveProfileBtn = document.getElementById('saveChangesBtn');  // Asegurarse de que este botón esté vinculado
        saveProfileBtn.addEventListener('click', function(event) {
            event.preventDefault();
            EditProfile();
        });

        const confirmChangeImage = document.getElementById('confirm-changes-button-image');
        confirmChangeImage.addEventListener('click', function() {
            EditProfile();
        });
    }
});