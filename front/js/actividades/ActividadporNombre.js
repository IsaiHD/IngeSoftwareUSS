async function obtenerActividadPorNombre(nombre) {
    const spinner = document.getElementById('spinner');
    try {
        spinner.classList.add('show');

        const response = await fetch(`https://alla.ns.cloudflare.com:443/activities/name?name=${nombre}`);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        const actividades = data.Actividades || [];

        const carouselContent = document.getElementById('carouselContent');
        carouselContent.innerHTML = ''; // Limpiar el carrusel

        actividades.forEach(actividad => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.innerHTML = `
                <a class="position-relative d-block overflow-hidden" href="">
                    <img class="img-fluid" src="data:image/png;base64,${actividad.image}" alt="${actividad.name}">
                    <div class="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">${actividad.name}</div>
                    <div class="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">${actividad.description}</div>
                </a>
            `;
            carouselContent.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Error al obtener las actividades por nombre:', error);
        alert('Error al cargar las actividades.');
    } finally {
        spinner.classList.remove('show');
    }
}

// Llamar a la función en el evento adecuado
// obtenerActividadPorNombre('Nombre de actividad');
