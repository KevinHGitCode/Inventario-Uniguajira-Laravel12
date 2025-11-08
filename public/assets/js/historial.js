function iniciarBusquedaHistorial(searchInputID) {
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

function activarBusquedaEnTablaHistorial() {
    const searchInput = document.getElementById('searchRecordInput');
    searchInput.addEventListener('keyup', function () {
        const filter = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll("table tbody tr");

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    });
}

// Función para convertir fecha string a objeto Date
function parseDateTime(dateTimeString) {
    // Formato esperado: "2025-06-12 03:14:10"
    const [datePart, timePart] = dateTimeString.split(' ');
    return new Date(datePart + 'T' + timePart);
}

// Función para verificar si una fecha está en el rango especificado
function isDateInRange(dateTimeString, dateFrom, dateTo) {
    if (!dateFrom && !dateTo) return true;
    
    const recordDate = parseDateTime(dateTimeString);
    
    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0); // Inicio del día
        if (recordDate < fromDate) return false;
    }
    
    if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // Final del día
        if (recordDate > toDate) return false;
    }
    
    return true;
}

// Función para inicializar todo
function inicializarHistorial() {
    iniciarBusquedaHistorial('searchRecordInput');
    activarBusquedaEnTablaHistorial();
    
    // Asegurarse de que la estructura del contenedor de búsqueda sea correcta
    const searchInput = document.getElementById('searchRecordInput');
    if (searchInput && !searchInput.parentElement.classList.contains('search-container')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'search-container';
        wrapper.style.position = 'relative';
        searchInput.parentNode.insertBefore(wrapper, searchInput);
        wrapper.appendChild(searchInput);
    }

    // Cargar usuarios en la sección de filtros - SOLUCIONADO: Evitar duplicados
    const userListContainer = document.getElementById('userList');
    if (userListContainer && window.allUserNames) {
        // Limpiar contenedor primero para evitar duplicados
        userListContainer.innerHTML = '';
        
        // Usar Set para eliminar usuarios duplicados
        const uniqueUsers = [...new Set(window.allUserNames)];
        
        uniqueUsers.forEach(userName => {
            const userCheckbox = document.createElement('label');
            userCheckbox.className = 'checkbox-container';
            userCheckbox.innerHTML = `
                <input type="checkbox" class="user-checkbox" value="${userName}">
                <span class="checkmark"></span>
                <span class="checkbox-label">${userName}</span>
            `;
            userListContainer.appendChild(userCheckbox);
        });
        
        console.log(`✅ Usuarios cargados: ${uniqueUsers.length} únicos de ${window.allUserNames.length} totales`);
    }
}

// Función para alternar todos los checkboxes de usuarios cuando se cambia "Todos los usuarios"
function toggleAllUsers() {
    const allUsersCheckbox = document.getElementById('allUsers');
    const userCheckboxes = document.querySelectorAll('.user-checkbox');
    userCheckboxes.forEach(cb => {
        cb.checked = allUsersCheckbox.checked;
    });
}

// Función para alternar todos los checkboxes de acciones cuando se cambia "Todas las acciones"
function toggleAllActions() {
    const allActionsCheckbox = document.getElementById('allActions');
    const actionCheckboxes = document.querySelectorAll('.action-checkbox');
    actionCheckboxes.forEach(cb => {
        cb.checked = allActionsCheckbox.checked;
    });
}

// Sincronizar el checkbox "Todas las acciones" si cambia algún checkbox de acción
function updateActionSelection() {
    const allActionsCheckbox = document.getElementById('allActions');
    const actionCheckboxes = document.querySelectorAll('.action-checkbox');
    const allChecked = Array.from(actionCheckboxes).every(cb => cb.checked);
    allActionsCheckbox.checked = allChecked;
}

// Sincronizar el checkbox "Todos los usuarios" si cambia algún checkbox de usuario
function updateUserSelection() {
    const allUsersCheckbox = document.getElementById('allUsers');
    const userCheckboxes = document.querySelectorAll('.user-checkbox');
    const allChecked = Array.from(userCheckboxes).every(cb => cb.checked);
    allUsersCheckbox.checked = allChecked;
}

// NUEVA FUNCIÓN: Aplicar filtros a la tabla de historial incluyendo fechas
function applyFilters() {
    const userCheckboxes = document.querySelectorAll('.user-checkbox');
    const actionCheckboxes = document.querySelectorAll('.action-checkbox');
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;

    // Validar rango de fechas
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
        showToast({ 
            success: false, 
            message: 'La fecha "Desde" no puede ser posterior a la fecha "Hasta"' 
        });
        return;
    }

    const selectedUsers = Array.from(userCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const selectedActions = Array.from(actionCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const rows = document.querySelectorAll('.record-table tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const userCell = row.cells[1].textContent.trim();
        const actionCell = row.cells[2].textContent.trim();
        const dateTimeCell = row.cells[6].textContent.trim(); // Columna de fecha y hora

        // Verificar filtros
        const userMatch = selectedUsers.length === 0 || selectedUsers.includes(userCell);
        const actionMatch = selectedActions.length === 0 || selectedActions.includes(actionCell);
        const dateMatch = isDateInRange(dateTimeCell, dateFrom, dateTo);

        if (userMatch && actionMatch && dateMatch) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // Mostrar información de resultados
    console.log(`✅ Filtros aplicados: ${visibleCount} registros visibles de ${rows.length} totales`);
    
    // Mostrar notificación temporal
    showFilterNotification(visibleCount, rows.length);

    // Cerrar el modal después de aplicar los filtros
    ocultarModal('#Modalfiltrarhistorial')
}

// Función para mostrar notificación usando el sistema existente
function showFilterNotification(visible, total) {
    showToast({ 
        success: true, 
        message: `Filtros aplicados: ${visible} de ${total} registros visibles` 
    });
}

// Limpiar todos los filtros y mostrar todas las filas
function clearFilters() {
    // Desmarcar todos los checkboxes de usuarios y el de 'todos'
    const allUsersCheckbox = document.getElementById('allUsers');
    allUsersCheckbox.checked = false;
    document.querySelectorAll('.user-checkbox').forEach(cb => { cb.checked = false; });

    // Desmarcar todos los checkboxes de acciones y el de 'todos'
    const allActionsCheckbox = document.getElementById('allActions');
    allActionsCheckbox.checked = false;
    document.querySelectorAll('.action-checkbox').forEach(cb => { cb.checked = false; });

    // Limpiar campos de fecha
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';

    // Mostrar todas las filas
    const rows = document.querySelectorAll('.record-table tbody tr');
    rows.forEach(row => {
        row.style.display = '';
    });

    console.log(`✅ Filtros limpiados: ${rows.length} registros visibles`);
    
    // Mostrar notificación de filtros limpiados
    showToast({ 
        success: true, 
        message: `Filtros limpiados: ${rows.length} registros visibles` 
    });

    // Cerrar el modal
    ocultarModal('#Modalfiltrarhistorial')
}

// scripts boton reporte---------------------------->>>>>>>
function generatePDF() {

    let jsPDF;
    if (window.jspdf && window.jspdf.jsPDF) {
        jsPDF = window.jspdf.jsPDF;
    } else if (window.jsPDF) {
        jsPDF = window.jsPDF;
    } else {
        alert('Error: No se puede acceder a jsPDF');
        return;
    }

    try {
        const doc = new jsPDF();

        // Cargar la imagen
        const img = new Image();
        img.src = 'assets/images/logoUniguajira.png'; // Ruta de la imagen

        img.onload = function() {
            // Agregar imagen al encabezado
            doc.addImage(img, 'WEBP', 10, 10, 50, 20);

            const titleY = 45;
            doc.setFontSize(16);
            doc.text('Reporte de Historial', 20, titleY);
            doc.setFontSize(12);
            doc.text('Fecha de generación: ' + new Date().toLocaleDateString(), 20, titleY + 15);

            const table = document.querySelector('.record-table');
            if (!table) {
                console.error('No se encontró la tabla de historial.');
                showToast({ 
                    success: false, 
                    message: 'Error: No se encontró la tabla de historial.' 
                });
                return;
            }

            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
            
            // CAMBIO PRINCIPAL: Solo incluir filas visibles (no ocultas por filtros)
            const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => {
                return row.style.display !== 'none'; // Solo filas que no están ocultas
            });

            const rows = visibleRows.map(row => {
                return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim());
            });

            // Agregar información sobre filtros aplicados
            let filterInfo = '';
            const totalRows = table.querySelectorAll('tbody tr').length;
            const visibleRowsCount = visibleRows.length;
            
            if (visibleRowsCount < totalRows) {
                filterInfo = `Registros mostrados: ${visibleRowsCount} de ${totalRows} (filtros aplicados)`;
                doc.setFontSize(10);
                doc.text(filterInfo, 20, titleY + 25);
            }

            // Agregar información de filtros de fecha si están aplicados
            const dateFrom = document.getElementById('dateFrom').value;
            const dateTo = document.getElementById('dateTo').value;
            if (dateFrom || dateTo) {
                let dateFilterText = 'Filtro de fechas: ';
                if (dateFrom && dateTo) {
                    dateFilterText += `${dateFrom} a ${dateTo}`;
                } else if (dateFrom) {
                    dateFilterText += `desde ${dateFrom}`;
                } else {
                    dateFilterText += `hasta ${dateTo}`;
                }
                doc.setFontSize(10);
                doc.text(dateFilterText, 20, titleY + (filterInfo ? 35 : 25));
            }

            // Verificar si hay datos para mostrar
            if (rows.length === 0) {
                doc.setFontSize(12);
                doc.text('No hay registros que coincidan con los filtros aplicados.', 20, titleY + 40);
            } else {
                doc.autoTable({
                    head: [headers],
                    body: rows,
                    startY: titleY + (filterInfo || (dateFrom || dateTo) ? 45 : 30),
                });
            }

            doc.save('historial_reporte.pdf');
            console.log('✅ PDF generado exitosamente con filtros aplicados');
            showToast({ 
                success: true, 
                message: 'PDF generado exitosamente' 
            });
        };

        img.onerror = function() {
            console.error('❌ Error al cargar la imagen.');
            showToast({ 
                success: false, 
                message: 'Error al cargar la imagen del logo' 
            });
        };

    } catch (error) {
        console.error('❌ Error al generar PDF:', error);
        showToast({ 
            success: false, 
            message: 'Error al generar PDF: ' + error.message 
        });
    }
}