(async function() {
    const spinner = document.getElementById('spinner');
    async function obtenerActividadesPorTipo(tipo) {
        try {
            spinner.classList.add('show');
            const response = await fetch(`https://alla.ns.cloudflare.com:443/activities/type?type=${tipo}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            
            const data = await response.json();
            console.log(data); // Verificar los datos

            // Lógica para manejar los datos filtrados por tipo
        } catch (error) {
            console.error('Error al obtener actividades por tipo:', error);
        } finally {
            spinner.classList.remove('show');
        }
    }
    // Ejemplo de llamada: obtenerActividadesPorTipo('Tipo de ejemplo');
})();
