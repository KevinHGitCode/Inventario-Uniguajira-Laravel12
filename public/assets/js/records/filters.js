
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

