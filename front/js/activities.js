async function obtenerActividades() {
    const spinner = document.getElementById('spinner');
    try {
        // Mostrar el spinner mientras se cargan las actividades
        spinner.classList.add('show');

        // Realizar la solicitud a la API
        const response = await fetch('http://localhost:8080/activities/');

        // Comprobar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        // Obtener el JSON de la respuesta
        const data = await response.json();
        console.log(data); // Verificar la respuesta completa

        // Asegúrate de que 'Actividades' sea un arreglo
        const actividades = data.Actividades; // Cambia 'data.Actividades' según la estructura de tu respuesta
        if (!Array.isArray(actividades)) {
            throw new TypeError('La respuesta no es un arreglo.');
        }

        const carouselContent = document.getElementById('carouselContent');
        carouselContent.innerHTML = ''; // Limpiar el carrusel

        // Iterar sobre las actividades y crear los elementos del carrusel
        for (const actividad of actividades) {
            try {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                itemDiv.innerHTML = `
                <div class="item">
                    <a class="position-relative d-block overflow-hidden" href="">
                        <img class="img-fluid" src="data:image/png;base64,${actividad.image}" alt="${actividad.name}">
                        <div class="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">${actividad.name}</div>
                        <div class="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">${actividad.description}</div>
                    </a>
                </div>
                `;
                carouselContent.appendChild(itemDiv);
            } catch (error) {
                console.error('Error al convertir la imagen a Base64:', error);
            }
        }

        // Inicializar el carrusel después de agregar los elementos
        $('.owl-carousel').owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            responsive: {
                0: { items: 1 },
                600: { items: 3 },
                1000: { items: 4 }
            }
        });
    } catch (error) {
        console.error('Error al obtener las actividades:', error);
        alert('Ocurrió un error al cargar las actividades. Por favor, intenta de nuevo más tarde.');
    } finally {
        // Ocultar el spinner
        spinner.classList.remove('show');
    }
}


$(document).ready(function() {
    obtenerActividades();
});