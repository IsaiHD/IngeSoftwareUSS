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
