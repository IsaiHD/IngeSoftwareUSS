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



$(document).ready(function() {
    console.log(window.location.pathname);

    if (window.location.pathname == '/index.html') {
        obtenerActividades();

    }else if (window.location.pathname === '/front/crudactividad.html') {
        cargarCategorias();

    }

});
