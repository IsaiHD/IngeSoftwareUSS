async function crearActividad(actividadData) {
    const spinner = document.getElementById('spinner');
    try {
        spinner.classList.add('show');

        const response = await fetch('https://alla.ns.cloudflare.com:443/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(actividadData)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log('Actividad creada:', data);
        alert('Actividad creada exitosamente');
    } catch (error) {
        console.error('Error al crear la actividad:', error);
        alert('Error al crear la actividad.');
    } finally {
        spinner.classList.remove('show');
    }
}

// Ejemplo de cómo usar la función
// const nuevaActividad = { name: 'Nueva Actividad', description: 'Descripción', image: 'base64...' };
// crearActividad(nuevaActividad);
