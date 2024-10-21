async function actualizarActividad(id, actividadData) {
    const spinner = document.getElementById('spinner');
    try {
        spinner.classList.add('show');

        const response = await fetch(`https://alla.ns.cloudflare.com:443/activities/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(actividadData)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log('Actividad actualizada:', data);
        alert('Actividad actualizada exitosamente');
    } catch (error) {
        console.error('Error al actualizar la actividad:', error);
        alert('Error al actualizar la actividad.');
    } finally {
        spinner.classList.remove('show');
    }
}

// Ejemplo de cómo usar la función
// const actividadActualizada = { name: 'Actividad Actualizada', description: 'Nueva descripción', image: 'nuevaBase64...' };
// actualizarActividad(1, actividadActualizada);
