/**
 * Inicializa la funcionalidad de búsqueda en tiempo real para filtrar elementos.
 */
function iniciarBusqueda(searchInputID) {
    // Obtiene el campo de entrada para la búsqueda
    const searchInput = document.getElementById(searchInputID);
    if (!searchInput) {
        // Muestra una advertencia si no se encuentra el campo de búsqueda
        console.warn("No se encontró el campo de búsqueda.");
        return;
    }

    // Agrega un evento para detectar cuando el usuario escribe en el campo de búsqueda
    searchInput.addEventListener('keyup', function () {
        // Convierte el texto ingresado a minúsculas para una búsqueda insensible a mayúsculas
        const filter = searchInput.value.toLowerCase();
        // Obtiene todas las tarjetas de bienes
        const cards = document.querySelectorAll(".card-item");

        // Itera sobre cada tarjeta y verifica si coincide con el texto de búsqueda
        cards.forEach(item => {
            const text = item.querySelector(".name-item").textContent.toLowerCase();
            // Muestra u oculta la tarjeta según si coincide con el filtro
            item.style.display = text.includes(filter) ? '' : 'none';
        });
    });
}


function activarBusquedaEnTabla() {
    // Obtiene el campo de entrada para la búsqueda
    const searchInput = document.getElementById('searchUserInput');
    if (!searchInput) {
        console.warn("No se encontró el campo de búsqueda.");
        return;
    }

    // Agrega un evento para detectar cuando el usuario escribe en el campo de búsqueda
    searchInput.addEventListener('keyup', function () {
        const filter = searchInput.value.toLowerCase();
        // Obtiene todas las filas de la tabla
        const rows = document.querySelectorAll("table tbody tr");

        // Itera sobre cada fila y verifica si coincide con el texto de búsqueda
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            // Muestra u oculta la fila según si coincide con el filtro
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    });
}