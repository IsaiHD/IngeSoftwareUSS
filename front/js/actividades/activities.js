async function obtenerActividades() {
    const spinner = document.getElementById('spinner');
    const container = document.querySelector('.row.g-4'); // Contenedor de las actividades

    try {
        // Mostrar el spinner mientras se cargan las actividades
        spinner.classList.add('show');

        // Realizar la solicitud a la API
        const response = await fetch('https://alla.ns.cloudflare.com:443/activities');

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

        container.innerHTML = ''; // Limpiar el contenedor antes de agregar las actividades

        // Iterar sobre las actividades y crear los elementos correspondientes
        for (const actividad of actividades) {
            try {
                // Crear el div que contendrá la actividad
                const actividadDiv = document.createElement('div');
                actividadDiv.classList.add('col-lg-4', 'col-md-6', 'wow', 'fadeInUp');

                // Estructura HTML para cada actividad
                actividadDiv.innerHTML = `
                    <div class="package-item">
                        <div class="overflow-hidden">
                            <img class="img-fluid" src="data:image/png;base64,${actividad.image}" alt="${actividad.name}">
                        </div>
                        <div class="d-flex border-bottom">
                            <small class="flex-fill text-center border-end py-2">
                                <i class="fa fa-map-marker-alt text-primary me-2"></i>${actividad.name}
                            </small>
                            <small class="flex-fill text-center border-end py-2">
                                <i class="fa fa-calendar-alt text-primary me-2"></i>${actividad.date}
                            </small>
                            <small class="flex-fill text-center py-2">
                                <i class="fa fa-user text-primary me-2"></i>${actividad.people}
                            </small>
                        </div>
                        <div class="text-center p-4">
                            <h3 class="mb-0">${actividad.name}</h3>
                            <div class="mb-3">
                                <small class="fa fa-star text-primary"></small>
                                <small class="fa fa-star text-primary"></small>
                                <small class="fa fa-star text-primary"></small>
                                <small class="fa fa-star text-primary"></small>
                                <small class="fa fa-star text-primary"></small>
                            </div>
                            <p>${actividad.subcategory}</p>
                        </div>
                    </div>
                `;

                // Añadir la actividad al contenedor
                container.appendChild(actividadDiv);
            } catch (error) {
                console.error('Error al crear el elemento de la actividad:', error);
            }
        }
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
