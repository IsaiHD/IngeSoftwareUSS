import { apiUrl } from './config.js';

async function obtenerActividades() {
    const spinner = document.getElementById('spinner');
    try {
        // Mostrar el spinner mientras se cargan las actividades
        spinner.classList.add('show');

        // Realizar la solicitud a la API
        const response = await fetch(`${apiUrl}/activities/`, {
            headers: {
                'Content-Type': 'application/json', // Asegúrate de que el servidor acepta JSON
            }
        });
        

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

        const carouselContent = document.getElementById('ImagesTextContent');
        carouselContent.innerHTML = ''; // Limpiar el carrusel

        // Iterar sobre las actividades y crear los elementos del carrusel
        for (const actividad of actividades) {
            try {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                itemDiv.innerHTML = `
                    <a class="position-relative d-block overflow-hidden" href="">
                        <img class="img-fluid" src="data:image/png;base64,${actividad.image}" alt>
                        <div class="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">${actividad.name}</div>
                        <div class="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">${actividad.description}</div>
                    </a>
                `;
                carouselContent.appendChild(itemDiv);
            } catch (error) {
                console.error('Error al convertir la imagen a Base64:', error);
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

async function cargarCategorias() {
    try {
        const response = await fetch(`${apiUrl}/categories/`, {
            headers: {
                'Content-Type': 'application/json', // Asegúrate de que el servidor acepta JSON
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data); // Para verificar la respuesta completa
        
        // Asegúrate de que 'Categorias' sea un arreglo en la respuesta
        const categorias = data.Categorias; 
        if (!Array.isArray(categorias)) {
            throw new TypeError('La respuesta no contiene un arreglo de categorías.');
        }

        const selectElement = document.getElementById("select1");
        selectElement.innerHTML = ''; // Limpiar el select

        // Iterar sobre las categorías y añadirlas al select
        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.name;
            selectElement.appendChild(option);
        });
        
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        alert("Ocurrió un error al cargar las categorías. Por favor, intenta de nuevo más tarde.");
    }
}

async function cargarSubCategorias() {
    try {
        const categoriaId = document.getElementById("select1").value;
        const response = await fetch(`${apiUrl}/categories/${categoriaId}`, {
            headers: {
                'Content-Type': 'application/json', // Asegúrate de que el servidor acepta JSON
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data); // Para verificar la respuesta completa
        
        // Asegúrate de que 'Subcategorias' sea un arreglo en la respuesta
        const subcategorias = data.Subcategorias; 
        if (!Array.isArray(subcategorias)) {
            throw new TypeError('La respuesta no contiene un arreglo de subcategorías.');
        }

        const selectElement = document.getElementById("select2");
        selectElement.innerHTML = ''; // Limpiar el select

        // Iterar sobre las subcategorías y añadirlas al select
        subcategorias.forEach(subcategoria => {
            const option = document.createElement("option");
            option.value = subcategoria.id;
            option.textContent = subcategoria.name;
            selectElement.appendChild(option);
        });
        
    } catch (error) {
        console.error("Error al obtener subcategorías:", error);
        alert("Ocurrió un error al cargar las subcategorías. Por favor, intenta de nuevo más tarde.");
    }
}



$(document).ready(function() {
    console.log(window.location.pathname);

    if (window.location.pathname == '/index.html') {
        obtenerActividades();

    }else if (window.location.pathname === '/front/crudactividad.html') {
        cargarCategorias();
        document.getElementById('select1').addEventListener('change', cargarSubCategorias);
    }

});


// ---------------------crudactividad-----------------------------


// Función para obtener todas las actividades
async function fetchActivities() {
    try {
        const response = await fetch(`${apiUrl}/`);
        if (!response.ok) throw new Error("Error al obtener actividades");
        const data = await response.json();
        console.log("Actividades obtenidas:", data.Actividades);
        // Aquí puedes manejar los datos para mostrarlos en tu HTML
        renderActivities(data.Actividades);
    } catch (error) {
        console.error(error.message);
    }
}

// Función para crear una nueva actividad
async function createActivity(activityData) {
    try {
        const response = await fetch(`${apiUrl}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(activityData),
        });
        if (!response.ok) throw new Error("Error al crear actividad");
        const data = await response.json();
        console.log("Actividad creada:", data.activity);
        alert("¡Actividad creada con éxito!");
        fetchActivities(); // Refrescar la lista de actividades
    } catch (error) {
        console.error(error.message);
        alert("Hubo un error al crear la actividad.");
    }
}

// Función para eliminar una actividad
async function deleteActivity(activityName) {
    try {
        const response = await fetch(`${apiUrl}/name`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: activityName }),
        });
        if (!response.ok) throw new Error("Error al eliminar actividad");
        const data = await response.json();
        console.log(data.message);
        alert("¡Actividad eliminada con éxito!");
        fetchActivities(); // Refrescar la lista de actividades
    } catch (error) {
        console.error(error.message);
        alert("Hubo un error al eliminar la actividad.");
    }
}

// Manejo de eventos para el formulario de creación de actividad
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault(); // Evitar que el formulario recargue la página

    // Obtener valores del formulario
    const activityData = {
        name: document.getElementById("nombreactividad").value,
        description: document.getElementById("descripcionctividad").value,
        category: document.getElementById("select1").value,
        subCategory: document.getElementById("subtipoactividad").value,
        image: document.getElementById("imagenactividades").files[0]?.name || "", // Obtener nombre del archivo
        startDate: document.getElementById("fechainicioactividad").value,
        endDate: document.getElementById("fechafinalctividad").value,
        place: document.getElementById("lugaractividad").value,
    };

    createActivity(activityData);
});

// Manejo de eventos para el botón de eliminación de actividad
// Asegura que la función esté disponible globalmente
window.confirmarYEliminar = function () {
    const activityName = document.getElementById("eliminaractividad").value;

    if (!activityName.trim()) {
        alert("Por favor, ingresa el nombre de una actividad.");
        return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar la actividad: "${activityName}"?`)) {
        deleteActivity(activityName);
    }
};

// 

// Función auxiliar para enviar la solicitud de eliminación al backend
//async function deleteActivity(activityName) {
//    try {
//        const response = await fetch("http://localhost:8080/activities/name", {
//            method: "DELETE",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify({ name: activityName }),
//        });
//
//        if (!response.ok) {
//            throw new Error("No se pudo eliminar la actividad.");
//        }
//
//        const data = await response.json();
//        alert(data.message); // Mostrar mensaje de éxito
//    } catch (error) {
//       console.error(error);
//        alert("Hubo un error al intentar eliminar la actividad.");
//    }
//}

// Función para renderizar las actividades en la página (puedes personalizarla según tu diseño)
function renderActivities(activities) {
    const activitiesContainer = document.querySelector(".activities-container");
    activitiesContainer.innerHTML = ""; // Limpiar el contenedor
    activities.forEach((activity) => {
        const activityCard = document.createElement("div");
        activityCard.classList.add("activity-card");
        activityCard.innerHTML = `
            <h3>${activity.name}</h3>
            <p>${activity.description}</p>
            <p><strong>Lugar:</strong> ${activity.place}</p>
            <p><strong>Fecha:</strong> ${activity.startDate} - ${activity.endDate}</p>
        `;
        activitiesContainer.appendChild(activityCard);
    });
}

// Cargar actividades al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    fetchActivities();
});
