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


async function crearActividad() {
    try {
        // Recoger los datos del formulario
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const subCategory = document.getElementById('subCategory').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const place = document.getElementById('place').value;
        const imageFile = document.getElementById('image').files[0];

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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(actividad)
        });

        // Verificar la respuesta
        if (!response.ok) {
            throw new Error(`Error en la creación de la actividad: ${response.status}`);
        }

        const data = await response.json();
        console.log('Actividad creada exitosamente:', data);
        alert('Actividad creada exitosamente');
    } catch (error) {
        console.error('Error al crear la actividad:', error);
        alert('Ocurrió un error al crear la actividad. Por favor, intenta de nuevo.');
    }
}

$(document).ready(function() {
    console.log(window.location.pathname);
    console.log(apiUrl);
    if (window.location.pathname == '/front/index.html') {
        obtenerActividades();

    }else if (window.location.pathname == '/front/crudactividad.html') {
        const tipoSelector = document.getElementById('tipo');
        const formFields = document.getElementById('formFields');

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
    }
});
