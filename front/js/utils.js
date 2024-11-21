export function convertirImagenABase64(file, calidad = 0.5) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();

            img.onload = () => {
                // Crear un canvas para redimensionar la imagen
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Ajustar el tamaño del canvas al tamaño deseado (por defecto, tamaño original)
                const maxWidth = 800; // Cambia esto si deseas limitar el tamaño
                const maxHeight = 800;
                let width = img.width;
                let height = img.height;

                // Mantener la proporción al redimensionar
                if (width > maxWidth || height > maxHeight) {
                    if (width / height > maxWidth / maxHeight) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Dibujar la imagen en el canvas redimensionado
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir el canvas a Base64 con una calidad específica
                const base64String = canvas.toDataURL('image/jpeg', calidad).split(',')[1];
                resolve(base64String);
            };

            img.onerror = error => reject(error);

            // Cargar la imagen en el objeto Image
            img.src = reader.result;
        };

        reader.onerror = error => reject(error);

        // Leer el archivo como DataURL
        reader.readAsDataURL(file);
    });
}

export function esEmailValido(email) {
    // Expresión regular para validar emails
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function esNumeroChilenoValido(numero) {
    // Expresión regular para números chilenos válidos
    const regex = /^(?:\+56)?(?:\s?)(9\d{8}|2\d{7}|[3-7]\d{7})$/;
    return regex.test(numero);
}

document.addEventListener("DOMContentLoaded", function() {
    const profileImage = document.getElementById("profile-image");
    const profileImageInput = document.getElementById("profile-image-input");
    const profileErrorMessage = document.getElementById("profile-error-message");
    const confirmChangesButton = document.getElementById("confirm-changes-button");

    // Evento para abrir el selector de archivos al hacer clic en la imagen
    profileImage.addEventListener("click", function() {
        profileImageInput.click();
    });

    // Evento para manejar la selección de un archivo
    profileImageInput.addEventListener("change", function() {
        const archivo = profileImageInput.files[0];
        if (archivo) {
            validarArchivo(archivo, mostrarPrevisualizacion);
        }
    });

    // Función para validar el archivo
    function validarArchivo(archivo, callback) {
        const tiposPermitidos = ["image/png", "image/jpeg"];
        if (archivo && tiposPermitidos.includes(archivo.type)) {
            profileErrorMessage.style.display = "none";
            callback(archivo);
        } else {
            profileErrorMessage.style.display = "block";
            profileImageInput.value = ""; // Limpiar el input
        }
    }

    // Función para mostrar la previsualización de la imagen
    function mostrarPrevisualizacion(archivo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newProfileImageSrc = e.target.result; // Guardar la nueva imagen temporalmente
            confirmChangesButton.style.display = "block"; // Mostrar el botón de confirmar
        };
        reader.readAsDataURL(archivo);
    }

    // Evento para confirmar los cambios
    confirmChangesButton.addEventListener("click", function() {
        if (newProfileImageSrc) {
            profileImage.src = newProfileImageSrc; // Actualizar la imagen del perfil
            confirmChangesButton.style.display = "none"; // Ocultar el botón
            alert("Imagen actualizada exitosamente.");
        }
    });
});
