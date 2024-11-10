// utils.js

// Función para convertir una imagen a Base64
export function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Evento cuando la imagen ha sido leída y convertida
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1]; // Eliminar el prefijo "data:image/*;base64,"
            resolve(base64String);
        };

        // Evento para manejar errores de lectura
        reader.onerror = error => reject(error);

        // Leer la imagen como DataURL (que incluye el prefijo y el contenido en Base64)
        reader.readAsDataURL(file);
    });
}
