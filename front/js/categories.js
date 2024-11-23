import { apiUrl } from './config.js';

async function loadCategories() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error al obtener categorías');

        const data = await response.json();
        if (!data.Categorias || !Array.isArray(data.Categorias)) {
            throw new Error('Formato de respuesta inválido');
        }

        const categories = data.Categorias;
        const categorySection = document.querySelector('.row.g-4');
        categorySection.innerHTML = ''; // Limpia contenido existente

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'col-lg-4 col-sm-6 wow fadeInUp';
            categoryDiv.setAttribute('data-wow-delay', '0.1s');
            
            categoryDiv.innerHTML = `
                <a href="#" class="category-link">
                    <div class="service-item rounded pt-3">
                        <div class="p-4">
                            <i class="fa fa-3x fa-tags text-primary mb-4"></i>
                            <h5>${category.name}</h5>
                            <p>Explora actividades en la categoría ${category.name}.</p>
                        </div>
                    </div>
                </a>
            `;

            // Agregar evento de clic dinámicamente
            const linkElement = categoryDiv.querySelector('.category-link');
            linkElement.addEventListener('click', (event) => {
                event.preventDefault(); // Evita el comportamiento predeterminado del enlace
                selectCategory(category.name);
            });

            categorySection.appendChild(categoryDiv);
        });
    } catch (error) {
        console.error(error);
        alert(`Error al cargar las categorías: ${error.message}`);
    }
}

function selectCategory(categoryName) {
    document.getElementById('categoriaTitulo').innerText = categoryName;
    alert(`Seleccionaste la categoría: ${categoryName}`);
}

document.addEventListener('DOMContentLoaded', loadCategories);

