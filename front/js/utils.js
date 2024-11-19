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
// export function formatearFecha(fecha) {
//     const dateObj = new Date(fecha); // Convertir la cadena a un objeto Date
//     const day = String(dateObj.getDate() + 1).padStart(2, '0'); // Obtener el día con 2 dígitos
//     const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Obtener el mes con 2 dígitos
//     const year = dateObj.getFullYear(); // Obtener el año

//     return `${day}-${month}-${year}`; // Formato dd-mm-yyyy
// }