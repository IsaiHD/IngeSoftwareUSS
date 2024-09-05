//Fecha actual
const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses del 1 al 12
    const day = String(now.getDate()).padStart(2, '0'); // Día del mes
    return `${year}-${month}-${day}`;
};

function showEditForm() {
    document.getElementById('editFormContainer').classList.remove('hidden');
}

function hideEditForm() {
    document.getElementById('editFormContainer').classList.add('hidden');
}

// Función para guardar los cambios en un evento
const saveData = async () => {
    try {
        // Obtén el ID del evento que estás editando
        const eventId = document.getElementById('eventId').value;
        // Obtén los valores del formulario de edición
        const name = document.getElementById('editEventTitle').value;
        const endDate = document.getElementById('editEventDate').value;
        const place = document.getElementById('editEventLocation').value;
        const description = document.getElementById('editEventDescription').value;
        const type = document.getElementById('editEventType').value;

        // Realiza la solicitud PUT al servidor para actualizar el evento
        const response = await fetch(`http://localhost:8080/activities/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
                startDate: getCurrentDate(),
                endDate,
                type,
                place,
            }),
        });

        // Verifica la respuesta del servidor
        if (!response.ok) {
            // Lee y muestra el contenido del error
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.error || response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
            alert('Evento actualizado exitosamente');
            hideEditForm(); // Oculta el formulario de edición
            fetchActivities(); // Recarga la lista de actividades
        } else {
            alert('No se pudo actualizar el evento');
        }
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
        alert('Error al actualizar el evento: ' + error.message);
    }
};



const editEvent = async (eventId) => {
    try {
        const response = await fetch(`http://localhost:8080/activities/${eventId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        document.getElementById('eventId').value = data.activity.id;
        document.getElementById('editEventTitle').value = data.activity.name;
        document.getElementById('editEventDate').value = data.activity.startDate.split('T')[0];
        document.getElementById('editEventLocation').value = data.activity.place;
        document.getElementById('editEventDescription').value = data.activity.description;
        document.getElementById('editEventType').value = data.activity.type;

        // Muestra el formulario de edición
        showEditForm();
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
        alert('Error al cargar los detalles del evento');
    }
}

// Listar eventos y poblar el menú desplegable de tipos de eventos
const populateEventTypes = () => {
    const eventTypes = [
        { value: 'Comida', text: 'Deporte' },
        { value: 'Arte', text: 'Académico' },
        { value: 'Salud', text: 'Ventas' },
        { value: 'Cultura', text: 'Tecnología' },
        { value: 'Networking', text: 'Otro'}
        // Agrega más tipos de eventos aquí si es necesario
    ];

    const selectElement = document.getElementById('eventType');
    
    eventTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.text;
        selectElement.appendChild(option);
    });
};

// Llama a la función para llenar el menú desplegable cuando se carga la página
document.addEventListener('DOMContentLoaded', populateEventTypes);

// Función para obtener y mostrar las actividades
const fetchActivities = async () => {
    try {
        const response = await fetch('http://localhost:8080/activities/');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        
        const data = await response.json();
        
        if (data.Actividades && data.Actividades.length > 0) {
            const displayArea = document.getElementById('displayArea');
            displayArea.innerHTML = ''; // Limpiar el área de visualización
            
            data.Actividades.forEach(activity => {
                const activityElement = document.createElement('div');
                activityElement.classList.add('activity');
                activityElement.innerHTML = `
                    <h3>${activity.name}</h3>
                    <p><strong>Descripción:</strong> ${activity.description}</p>
                    <p><strong>Fecha de Inicio:</strong> ${activity.startDate}</p>
                    <p><strong>Fecha de Fin:</strong> ${activity.endDate}</p>
                    <p><strong>Lugar:</strong> ${activity.place}</p>
                    <button onclick="editEvent(${activity.id})">Editar</button>
                    <button onclick="deleteEvent(${activity.id})">Eliminar</button>
                `;
                displayArea.appendChild(activityElement);
            });
        } else {
            document.getElementById('displayArea').innerText = 'No hay actividades para mostrar.';
        }
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
        document.getElementById('displayArea').innerText = 'Error al cargar actividades.';
    }
};

// Función para crear un nuevo evento
const createData = async () => {
    try {
        // Obtén los valores del formulario
        const name = document.getElementById('eventTitle').value;
        const startDate = getCurrentDate().toString();
        const endDate = document.getElementById('eventDate').value; 
        const place = document.getElementById('eventLocation').value;
        const description = document.getElementById('eventDescription').value;
        const type = document.getElementById('eventType').value;

        // Envia los datos al servidor para crear el nuevo evento
        const response = await fetch('http://localhost:8080/activities/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
                startDate,
                endDate,
                place,
                type
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        if (result.activity || result.success) {
            alert('Evento creado exitosamente');
            fetchActivities(); // Recarga la lista de actividades
            toggleEventForm(); // Oculta el formulario de edición
        } else {
            alert('No se pudo crear el evento');
        }
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
        alert('Error al crear el evento');
    }
};


// Función para eliminar un evento
window.deleteEvent = async (eventId) => {
    try {
        const response = await fetch(`http://localhost:8080/activities/${eventId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();

        if (result.success) {
            alert('Evento eliminado exitosamente');
            fetchActivities(); // Recarga la lista de actividades
        } else {
            alert('No se pudo eliminar el evento');
        }
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
        alert('Error al eliminar el evento');
    }
};

// Función para mostrar u ocultar el formulario de eventos
const toggleEventForm = () => {
    const formContainer = document.getElementById('eventFormContainer');
    formContainer.classList.toggle('hidden');

    // Limpiar el formulario si se oculta
    if (formContainer.classList.contains('hidden')) {
        document.getElementById('eventForm').reset();
        document.getElementById('deleteButton').style.display = 'none'; // Ocultar botón de eliminar
    }
};

// Configurar el formulario y eventos para guardado
const setupEventForm = () => {
    document.getElementById('eventForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        await saveData();
    });
};

// Llama a la función para obtener las actividades al cargar la página
document.addEventListener('DOMContentLoaded', fetchActivities);

// Llama a la función para configurar el formulario
setupEventForm();
