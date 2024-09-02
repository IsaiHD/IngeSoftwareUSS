//Fecha actual
const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses del 1 al 12
    const day = String(now.getDate()).padStart(2, '0'); // Día del mes
    return `${year}-${month}-${day}`;
    console.log(getCurrentDate);
};


// Listar eventos y poblar el menú desplegable de tipos de eventos
const populateEventTypes = () => {
    const eventTypes = [
        { value: 'conference', text: 'Conferencia' },
        { value: 'workshop', text: 'Taller' },
        { value: 'webinar', text: 'Webinar' },
        { value: 'meeting', text: 'Reunión' },
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

// Función para editar un evento
const editEvent = async (eventId) => {
    try {
        const response = await fetch(`http://localhost:8080/activities/${eventId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        document.getElementById('eventId').value = data.activity.id;
        document.getElementById('eventTitle').value = data.activity.name;
        document.getElementById('eventDate').value = data.activity.startDate.split('T')[0];
        document.getElementById('eventLocation').value = data.activity.place;
        document.getElementById('eventDescription').value = data.activity.description;
        document.getElementById('eventType').value = data.activity.type;

        // Muestra el botón de eliminar solo si el evento tiene un ID
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.style.display = 'inline-block';
        deleteButton.onclick = () => deleteEvent(eventId);

        // Muestra el formulario de edición
        toggleEventForm();
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
        alert('Error al cargar los detalles del evento');
    }
};

// Función para crear o actualizar un evento
// Función para crear un nuevo evento
const createData = async () => {
    try {
        // Obtén los valores del formulario
        const name = document.getElementById('eventTitle').value;
        const startDate = getCurrentDate;
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
