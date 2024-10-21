async function eliminarActividad(id) {
    const spinner = document.getElementById('spinner');
    try {
        spinner.classList.add('show');

        const response = await fetch(`https://alla.ns.cloudflare.com:443/activities/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        console.log('Actividad eliminada:', id);
        alert('Actividad eliminada exitosamente');
    } catch (error) {
        console.error('Error al eliminar la actividad:', error);
        alert('Error al eliminar la actividad.');
    } finally {
        spinner.classList.remove('show');
    }
}

// Ejemplo de cómo usar la función
// eliminarActividad(1);
