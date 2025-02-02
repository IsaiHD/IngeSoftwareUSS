import { apiUrl } from './config.js';
import { convertirImagenABase64 } from './utils.js';

async function obtenerActividades() {
    const spinner = document.getElementById('ImagesTextContent');
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

        // Asegúrate de que 'Actividades' sea un arreglo
        const actividades = data.Actividades; // Cambia 'data.Actividades' según la estructura de tu respuesta
        console.log(actividades); // Verificar la respuesta completa
        if (!Array.isArray(actividades)) {
            throw new TypeError('La respuesta no es un arreglo.');
        }

        const carouselContent = document.getElementById('ImagesTextContent');
        carouselContent.innerHTML = ''; // Limpiar el carrusel

        // Iterar sobre las actividades y crear los elementos del carrusel
        // Suponiendo que ya tienes el array de actividades
        for (const actividad of actividades) {
            try {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('activity-card');  // Clase para el contenedor de la tarjeta
        
                // Eliminar las clases aleatorias de tamaño
                // No agregamos 'large' o 'extra-large'
        
                itemDiv.innerHTML = `
                    <a class="position-relative d-block overflow-hidden">
                        <!-- Imagen de la actividad -->
                        <img class="img-fluid" src="data:image/png;base64,${actividad.image}" alt="${actividad.name}">
                        
                        <!-- Título de la actividad -->
                        <div class="activity-title bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">
                            ${actividad.name}
                        </div>

                        <!-- Usuario de la actividad -->
                        <div class="activity-description bg-white text-primary fw-bold position-absolute bottom-0 start-0 m-3 py-1 px-2">
                            ${actividad.user[0].name || 'Usuario no disponible'}
                        </div>
                        
                        <!-- Descripción corta -->
                        <div class="activity-description bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">
                            ${actividad.description}
                        </div>
                    </a>
                `;
        
                // Agregar la tarjeta al contenedor principal (ImagesTextContent)
                document.getElementById('ImagesTextContent').appendChild(itemDiv);
        
                itemDiv.querySelector('a').addEventListener('click', (event) => {
                    event.preventDefault();
                    // Mostrar el modal con los datos de la actividad seleccionada
                    showModal(actividad);
                });
                
                
                
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

async function buscarActividadesPorNombre(nombre) {
    const spinner = document.getElementById('ImagesTextContent');
    try {
        // Mostrar el spinner mientras se cargan las actividades
        spinner.classList.add('show');

        // Realizar la solicitud a la API para buscar actividades por nombre
        const response = await fetch(`${apiUrl}/activities/name`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: nombre }), // Pasar el nombre de la actividad
        });

        // Comprobar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        // Obtener el JSON de la respuesta
        const data = await response.json();

        // Asegúrate de que 'Actividades' sea un arreglo
        const actividades = data.Actividades;
        console.log(actividades); // Verificar la respuesta completa
        if (!Array.isArray(actividades)) {
            throw new TypeError('La respuesta no es un arreglo.');
        }

        const carouselContent = document.getElementById('ImagesTextContent');
        carouselContent.innerHTML = ''; // Limpiar el carrusel

        // Verificar si no se encontraron actividades
        if (actividades.length === 0) {
            // Mostrar la alerta estilizada si no se encontraron actividades
            swal.fire({
                title: 'No se encontraron actividades',
                text: 'Intenta con otro nombre o revisa la ortografía.',
                icon: 'info',
                customClass: {
                    popup: 'swal-popup-custom'
                },
            });
        }

        // Iterar sobre las actividades y crear los elementos del carrusel
        for (const actividad of actividades) {
            try {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('activity-card');  // Clase para el contenedor de la tarjeta

                itemDiv.innerHTML = `
                    <a class="position-relative d-block overflow-hidden">
                        <img class="img-fluid" src="data:image/png;base64,${actividad.image}" alt="${actividad.name}">
                        <div class="activity-title bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">
                            ${actividad.name}
                        </div>
                        <div class="activity-description bg-white text-primary fw-bold position-absolute bottom-0 start-0 m-3 py-1 px-2">
                            ${actividad.user[0].name || 'Usuario no disponible'}
                        </div>
                        <div class="activity-description bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">
                            ${actividad.description}
                        </div>
                    </a>
                `;
                document.getElementById('ImagesTextContent').appendChild(itemDiv);

                itemDiv.querySelector('a').addEventListener('click', (event) => {
                    event.preventDefault();
                    // Mostrar el modal con los datos de la actividad seleccionada
                    showModal(actividad);
                });

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

async function obtenerActividadesPorUsuario() {
    const spinner = document.getElementById('ImagesTextContent');
    const authToken = `bearer: ${localStorage.getItem('authToken')}`;
    try {
        // Mostrar el spinner mientras se cargan las actividades
        spinner.classList.add('show');

        // Realizar la solicitud a la API
        const response = await fetch(`${apiUrl}/activities/user`, {
            headers: {
                'Content-Type': 'application/json', // Asegúrate de que el servidor acepta JSON
                'Authorization': authToken
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
        const actividades = data.activities; // Cambia 'data.Actividades' según la estructura de tu respuesta
        if (!Array.isArray(actividades)) {
            throw new TypeError('La respuesta no es un arreglo.');
        }

        const carouselContent = document.getElementById('ImagesTextContent');
        carouselContent.innerHTML = ''; // Limpiar el carrusel

        // Iterar sobre las actividades y crear los elementos del carrusel
        for (const actividad of actividades) {
            try {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('activity-card');  // Clase para el contenedor de la tarjeta
        
                // Eliminar las clases aleatorias de tamaño
                // No agregamos 'large' o 'extra-large'
        
                itemDiv.innerHTML = `
                    <a class="position-relative d-block overflow-hidden">
                        <!-- Imagen de la actividad -->
                        <img class="img-fluid" src="data:image/png;base64,${actividad.image}" alt="${actividad.name}">
                        
                        <!-- Título de la actividad -->
                        <div class="activity-title bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">
                            ${actividad.name}
                        </div>
                        
                        <!-- Descripción corta -->
                        <div class="activity-description bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">
                            ${actividad.description}
                        </div>
                    </a>
                `;
        
                // Agregar la tarjeta al contenedor principal (ImagesTextContent)
                document.getElementById('ImagesTextContent').appendChild(itemDiv);
        
                // Agregar el evento click para mostrar el modal
                itemDiv.querySelector('a').addEventListener('click', (event) => {
                    event.preventDefault();
                    // Mostrar el modal con los datos de la actividad seleccionada
                    showModal(actividad);
                });
                   
            } catch (error) {
                console.error('Error al crear la tarjeta de actividad:', error);
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
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        
        const data = await response.json();
        const categorias = data.Categorias; 
        if (!Array.isArray(categorias)) {
            throw new TypeError('La respuesta no contiene un arreglo de categorías.');
        }

        const selectElement = document.getElementById("select1");
        selectElement.innerHTML = ''; // Limpiar el select

        // Añadir opción predeterminada
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.id = "default-option"; // Asignar id específico
        defaultOption.textContent = "Selecciona una categoría...";
        selectElement.appendChild(defaultOption);

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

async function cargarSubCategorias(idCategoria) {
    if (!idCategoria) {
        console.error('Selecciona una categoria válida.');
        return;
    }
    try {
        const response = await fetch(`${apiUrl}/subcategories/${idCategoria}`, {
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
        const subcategorias = data.SubCategorias; 
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

async function inicializarCategoriasYSubcategorias() {
    await cargarCategorias(); // Cargar las categorías desde la BD

    const select1 = document.getElementById('select1');

    // Añadir evento para cargar subcategorías solo cuando haya datos disponibles
    select1.addEventListener('change', async function() {
        const categoriaId = select1.value;
        console.log('Categoría seleccionada:', categoriaId.value);

        // Solo hacer la solicitud si se ha seleccionado una categoría válida
        if (categoriaId && categoriaId !== " ") { // Verifica si se ha seleccionado una categoría válida
            await cargarSubCategorias(categoriaId); // Carga las subcategorías si se seleccionó una categoría válida
        } else {
            // Limpia las subcategorías cuando se selecciona la opción por defecto
            document.getElementById('select2').innerHTML = '<option>Selecciona una subcategoría...</option>';
        }
    });
}

async function updateActivity(id) {
    // Obtener los valores de los campos del formulario
    const name = document.getElementById("modalActivityName").value;
    const description = document.getElementById("modalActivityDescription").value;
    const startDate = document.getElementById("modalStartDate").value;
    const endDate = document.getElementById("modalEndDate").value;
    const place = document.getElementById("modalPlace").value;

    console.log(name, description, startDate, endDate, place);
    // Crear un objeto con solo los valores no vacíos
    const authToken = localStorage.getItem('authToken');

    const bodyData = {
        name,
        description,
        startDate,
        endDate,
        place,
    };

    try {
        const response = await fetch(`${apiUrl}/activities/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer: ${authToken}`, // Usar el encabezado correcto
            },
            body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la actividad');
        }

        const updatedActivity = await response.json();
        console.log("Actividad actualizada:", updatedActivity);
        window.location.reload();
        // Puedes agregar un mensaje al usuario o redirigir a otra página si lo deseas
    } catch (error) {
        console.error('Error:', error);
        alert("Hubo un error al actualizar la actividad.");
    }
}

async function eliminarActividad(id) {
    const authToken = localStorage.getItem('authToken');
    
    const modalElement = document.getElementById('activityModal');
    const modal = bootstrap.Modal.getInstance(modalElement);  // Obtener la instancia del modal actual
    modal.hide();

    // Mostrar alerta de confirmación
    const confirmar = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal-popup-custom'
        },
    });

    if (!confirmar.isConfirmed) {
        console.log('Eliminación cancelada.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/activities/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            Swal.fire('Eliminado', 'La actividad ha sido eliminada con éxito.', 'success');
            // Aquí puedes actualizar la lista de actividades si es necesario
            window.location.reload();
        } else {
            const errorData = await response.json();
            Swal.fire('Error', `No se pudo eliminar la actividad: ${errorData.message}`, 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Ocurrió un error al intentar eliminar la actividad.', 'error');
        console.error(error);
    }
}

async function crearActividad() {
    try {
        // Recoger los datos del formulario
        const name = document.getElementById('nombre').value;
        const place = document.getElementById('place').value;
        const description = document.getElementById('descripcion').value;
        const category = document.getElementById('select1').options[document.getElementById('select1').selectedIndex].text;
        const subCategory = document.getElementById('select2').options[document.getElementById('select2').selectedIndex].text;
        const startDate = document.getElementById('fechaInicio').value;
        const endDate = document.getElementById('fechaFin').value;  

        const imageFile = document.getElementById('archivo').files[0];
        // Convertir la imagen a base64
        const imageBase64 = await convertirImagenABase64(imageFile);

        // Crear el objeto actividad
        const actividad = {
            name,
            description,
            category,
            subCategory,
            image: imageBase64,
            startDate,
            endDate,
            place
        };


        // Enviar la solicitud POST a la API
        const response = await fetch(`${apiUrl}/activities/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer: ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(actividad)
        });

        // Verificar la respuesta
        if (!response.ok) {
            throw new Error(`Error en la creación de la actividad: ${response.status}`);s
        }

        const data = await response.json();
        window.location.reload();
        alert('Actividad creada exitosamente');
    } catch (error) {
        console.error('Error al crear la actividad:', error);
        alert('Ocurrió un error al crear la actividad. Por favor, intenta de nuevo.');
    }
}

async function obtenerActividadesPorCategoria(categoryId) {
    const spinner = document.getElementById('ImagesTextContent');
    try {
        // Mostrar el spinner mientras se cargan las actividades
        spinner.classList.add('show');
        console.log(categoryId);

        // Realizar la solicitud a la API para obtener actividades por categoría
        const response = await fetch(`${apiUrl}/activities/type`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Asegúrate de que el servidor acepta JSON
            },
            body: JSON.stringify({type: categoryId})
        });

        // Comprobar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        // Obtener el JSON de la respuesta
        const data = await response.json();

        // Asegúrate de que 'Actividades' sea un arreglo
        const actividades = data.Actividades; // Cambia 'data.Actividades' según la estructura de tu respuesta
        console.log(actividades); // Verificar la respuesta completa
        if (!Array.isArray(actividades)) {
            throw new TypeError('La respuesta no es un arreglo.');
        }

        const carouselContent = document.getElementById('ImagesTextContent');
        carouselContent.innerHTML = ''; // Limpiar el carrusel

        // Iterar sobre las actividades y crear los elementos del carrusel
        // Suponiendo que ya tienes el array de actividades
        for (const actividad of actividades) {
            try {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('activity-card');  // Clase para el contenedor de la tarjeta

                // Eliminar las clases aleatorias de tamaño
                // No agregamos 'large' o 'extra-large'

                itemDiv.innerHTML = `
                    <a class="position-relative d-block overflow-hidden">
                        <!-- Imagen de la actividad -->
                        <img class="img-fluid" src="data:image/png;base64,${actividad.image}" alt="${actividad.name}">
                        
                        <!-- Título de la actividad -->
                        <div class="activity-title bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">
                            ${actividad.name}
                        </div>

                        <!-- Usuario de la actividad -->
                        <div class="activity-description bg-white text-primary fw-bold position-absolute bottom-0 start-0 m-3 py-1 px-2">
                            ${actividad.user[0].name || 'Usuario no disponible'}
                        </div>
                        
                        <!-- Descripción corta -->
                        <div class="activity-description bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">
                            ${actividad.description}
                        </div>
                    </a>
                `;

                // Agregar la tarjeta al contenedor principal (ImagesTextContent)
                document.getElementById('ImagesTextContent').appendChild(itemDiv);

                itemDiv.querySelector('a').addEventListener('click', (event) => {
                    event.preventDefault();
                    // Mostrar el modal con los datos de la actividad seleccionada
                    showModal(actividad);
                });
                
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

$(document).ready(function() {
    console.log(window.location.pathname);
    // console.log(apiUrl);
    const currentPath = window.location.pathname;
    
    if (currentPath === '/front/home.html' || currentPath === '/home') {
        obtenerActividades();
        document.getElementById('search-btn').addEventListener('click', async () => {
            const nombre = document.getElementById('search-input').value.trim();
            console.log(nombre);
            if (nombre) {
              // Si hay texto, busca las actividades por nombre
              buscarActividadesPorNombre(nombre);
            } else {
              // Si no hay texto, muestra todas las actividades
              obtenerActividades();
            }
          });
    }
    
    if (currentPath === '/front/mis-actividades.html' || currentPath === '/mis-actividades') {
        const modalElement = document.getElementById('activityModal');
        obtenerActividadesPorUsuario();
        const eliminarActividadBtn = document.getElementById('eliminaractividad');

        eliminarActividadBtn.addEventListener('click', function() {
            const id = modalElement.dataset.id;
            eliminarActividad(id);
            
        });

        const confirmarEdicion = document.getElementById('editButton');
        confirmarEdicion.addEventListener('click', function(event){

            if (confirmarEdicion.innerText === 'Editar') {
                const id = modalElement.dataset.id;
                updateActivity(id);
            }
        });
    }

    if (currentPath == '/front/crear-actividad.html' || currentPath === '/crear-actividad') {
        const tipoSelector = document.getElementById('tipo');
        const formFields = document.getElementById('formFields');

        const crearActividadBtn = document.getElementById('submitButton');
        
        // Evento para mostrar campos y cargar categorías/subcategorías si se selecciona "Actividad"
        tipoSelector.addEventListener('change', function() {
            const selectedType = tipoSelector.value;
            if (selectedType === 'actividad') {
                formFields.style.display = 'block';
                inicializarCategoriasYSubcategorias();
                
                // Cambia el evento `change` para que pase el `id` de la categoría seleccionada
                document.getElementById('select1').addEventListener('change', function() {
                    cargarSubCategorias(this.value); // Pasa el `id` de la categoría
                });
            } else {
                formFields.style.display = 'none';
            }
        });

        crearActividadBtn.addEventListener('click', function(){
            crearActividad();
        });
    }

    if (currentPath === '/front/categorias.html' || currentPath === '/categorias') {
        cargarCategorias();

        const selectElement = document.getElementById('select1');
        // Verificamos si selectElement existe y si la opción seleccionada tiene el texto 'Selecciona una categoría...'
        if (selectElement === null) {
            return; // Si el select no existe, no hacemos nada
        }

        selectElement.addEventListener('change', function() {
            const selectedIndex = selectElement.selectedIndex;

            // Obtener el texto de la opción seleccionada
                const selectedOptionText = selectElement.options[selectedIndex].text;   
                console.log(selectedOptionText);
        
                if (selectedOptionText === 'Selecciona una categoría...') {
                    Swal.fire({
                        title: 'Atención',
                        text: 'Selecciona una Categoría para ver las actividades',
                        icon: 'warning',  // Usar "warning" en lugar de "Attention"
                        showCancelButton: true,
                        confirmButtonText: 'Aceptar',
                        customClass: {
                            popup: 'swal-popup-custom'
                        },
                    });
                    return;
                }
            const categoryId = selectElement.value;
            obtenerActividadesPorCategoria(categoryId);
        });
    }
});

document.getElementById('modal').addEventListener('click', (event) => {
    if (event.target === document.getElementById('modal')) {
        document.getElementById('modal').classList.remove('show');
    }
});

// Cerrar el modal
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('modal').classList.remove('show');
});
