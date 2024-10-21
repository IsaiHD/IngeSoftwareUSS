//Creando filtrado de busqueda
   // Función para obtener el valor del parámetro "query" en la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Mostrar el término de búsqueda y los resultados simulados
document.addEventListener("DOMContentLoaded", function() {
    const query = getQueryParam('query');
    const searchQueryElement = document.getElementById('search-query');
    const searchResultsElement = document.getElementById('search-results');

    if (query) {
        // Mostrar el término de búsqueda
        searchQueryElement.textContent = `Resultados para: "${query}"`;

        // Simular resultados de búsqueda (puedes reemplazar esto con datos reales)
        const results = [
            `Resultado 1 para "${query}"`,
            `Resultado 2 para "${query}"`,
            `Resultado 3 para "${query}"`,
        ];

        // Mostrar los resultados simulados
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.textContent = result;
            searchResultsElement.appendChild(resultItem);
        });
    } else {
        searchQueryElement.textContent = 'No se ha realizado ninguna búsqueda.';
    }
});
