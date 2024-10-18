document.addEventListener('DOMContentLoaded', function () {
    // Realiza una solicitud a tu API de actividades
    fetch('/api/activities')
        .then(response => response.json())
        .then(activities => {
            displayActivities(activities);  // Llama a la función para mostrar las actividades
        })
        .catch(error => console.error('Error fetching activities:', error));
});

// Función para mostrar las actividades en el DOM
function displayActivities(activities) {
    const activitiesContainer = document.getElementById('carouselContent');  // Asegúrate de que el ID sea correcto
    
    activities.forEach(activity => {
        // Crea un nuevo elemento div con la actividad
        const activityItem = document.createElement('div');
        activityItem.classList.add('item');
        activityItem.innerHTML = `
            <a class="position-relative d-block overflow-hidden" href="">
                <img class="img-fluid" src="${activity.Image}" alt="${activity.Name}">
                <div class="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">${activity.Name}</div>
                <div class="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">${activity.Description}</div>
            </a>
        `;
        
        // Añade el nuevo item al contenedor del carrusel
        activitiesContainer.appendChild(activityItem);
    });

    // Aquí puedes inicializar el carrusel de nuevo si es necesario
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 3
    });
}
