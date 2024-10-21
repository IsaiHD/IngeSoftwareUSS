(async function() {
    const spinner = document.getElementById('spinner');
    async function obtenerActividadesPorUsuario() {
        try {
            spinner.classList.add('show');
            const response = await fetch('https://alla.ns.cloudflare.com:443/activities/user');
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            
            const data = await response.json();
            console.log(data); // Verificar los datos

            // Lógica para manejar las actividades por usuario
        } catch (error) {
            console.error('Error al obtener actividades por usuario:', error);
        } finally {
            spinner.classList.remove('show');
        }
    }
    obtenerActividadesPorUsuario();
})();
