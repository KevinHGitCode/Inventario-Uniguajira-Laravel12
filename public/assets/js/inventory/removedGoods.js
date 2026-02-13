// removedGoods.js
// Funciones para la gestión de bienes dados de baja

// Variables globales para filtros
let currentFilters = {
    type: 'all',
    group_id: '',
    inventory_id: '',
    date_from: '',
    date_to: ''
};

let filterOptions = {
    groups: [],
    inventories: []
};

function initRemovedGoodsFunctions() {
    // Inicializar búsqueda usando la función helper existente
    iniciarBusqueda('searchRemovedGoods');

    // Cargar opciones de filtrado
    loadFilterOptions();

    console.log("Funciones de bienes dados de baja inicializadas");
}

/**
 * Ver detalles completos de un bien dado de baja
 */
function btnViewRemovedDetails(id) {
    // Obtener los datos del bien desde el servidor
    fetch(`/removed/${id}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'text/html',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar los detalles');
        }
        return response.text();
    })
    .then(html => {
        document.getElementById('removedDetailsContent').innerHTML = html;
        mostrarModal('#modalRemovedDetails');
    })
    .catch(error => {
        console.error('Error:', error);
        showToast({
            success: false,
            message: 'Error al cargar los detalles del bien'
        });
    });
}

/**
 * Abrir modal de filtros
 */
function openFilterModal() {
    // Cargar valores actuales en el formulario
    document.getElementById('filterType').value = currentFilters.type;
    document.getElementById('filterGroup').value = currentFilters.group_id;
    document.getElementById('filterInventory').value = currentFilters.inventory_id;
    document.getElementById('filterDateFrom').value = currentFilters.date_from;
    document.getElementById('filterDateTo').value = currentFilters.date_to;

    // Actualizar inventarios según grupo seleccionado
    updateInventoryOptions(currentFilters.group_id);

    mostrarModal('#modalFilterRemoved');
}

/**
 * Cargar opciones de filtrado (grupos e inventarios)
 */
function loadFilterOptions() {
    fetch('/api/removed/filter-options', {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            filterOptions.groups = data.groups;
            filterOptions.inventories = data.inventories;
            populateFilterSelects();
        }
    })
    .catch(error => {
        console.error('Error al cargar opciones de filtro:', error);
    });
}

/**
 * Poblar los selects de filtro
 */
function populateFilterSelects() {
    const groupSelect = document.getElementById('filterGroup');
    const inventorySelect = document.getElementById('filterInventory');

    if (groupSelect && filterOptions.groups) {
        groupSelect.innerHTML = '<option value="">Todos los bloques</option>';
        filterOptions.groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            groupSelect.appendChild(option);
        });
    }

    if (inventorySelect && filterOptions.inventories) {
        inventorySelect.innerHTML = '<option value="">Todos los inventarios</option>';
        filterOptions.inventories.forEach(inventory => {
            const option = document.createElement('option');
            option.value = inventory.id;
            option.textContent = `${inventory.group_name} - ${inventory.name}`;
            option.setAttribute('data-group-id', inventory.group_id);
            inventorySelect.appendChild(option);
        });
    }
}

/**
 * Actualizar opciones de inventario según el grupo seleccionado
 */
function updateInventoryOptions(groupId) {
    const inventorySelect = document.getElementById('filterInventory');
    
    if (!inventorySelect) return;

    // Guardar el valor actual del inventario
    const currentInventoryId = inventorySelect.value;

    // Limpiar y agregar opción por defecto
    inventorySelect.innerHTML = '<option value="">Todos los inventarios</option>';

    // Filtrar inventarios por grupo
    const filteredInventories = groupId 
        ? filterOptions.inventories.filter(inv => inv.group_id == groupId)
        : filterOptions.inventories;

    // Poblar select
    filteredInventories.forEach(inventory => {
        const option = document.createElement('option');
        option.value = inventory.id;
        option.textContent = groupId ? inventory.name : `${inventory.group_name} - ${inventory.name}`;
        option.setAttribute('data-group-id', inventory.group_id);
        inventorySelect.appendChild(option);
    });

    // Restaurar valor si aún existe en las opciones filtradas
    if (currentInventoryId && filteredInventories.some(inv => inv.id == currentInventoryId)) {
        inventorySelect.value = currentInventoryId;
    }
}

/**
 * Aplicar filtros
 */
function applyFilters() {
    // Obtener valores del formulario
    currentFilters.type = document.getElementById('filterType').value;
    currentFilters.group_id = document.getElementById('filterGroup').value;
    currentFilters.inventory_id = document.getElementById('filterInventory').value;
    currentFilters.date_from = document.getElementById('filterDateFrom').value;
    currentFilters.date_to = document.getElementById('filterDateTo').value;

    // Construir query params
    const params = new URLSearchParams();
    
    if (currentFilters.type && currentFilters.type !== 'all') {
        params.append('type', currentFilters.type);
    }
    if (currentFilters.group_id) {
        params.append('group_id', currentFilters.group_id);
    }
    if (currentFilters.inventory_id) {
        params.append('inventory_id', currentFilters.inventory_id);
    }
    if (currentFilters.date_from) {
        params.append('date_from', currentFilters.date_from);
    }
    if (currentFilters.date_to) {
        params.append('date_to', currentFilters.date_to);
    }

    // Hacer la petición
    fetch(`/api/removed/filter?${params.toString()}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateRemovedAssetsList(data.data);
            ocultarModal('#modalFilterRemoved');
            updateFilterButton();
            
            showToast({
                success: true,
                message: `Filtro aplicado: ${data.count} bien(es) encontrado(s)`
            });
        }
    })
    .catch(error => {
        console.error('Error al aplicar filtros:', error);
        showToast({
            success: false,
            message: 'Error al aplicar los filtros'
        });
    });
}

/**
 * Limpiar filtros
 */
function clearFilters() {
    // Resetear filtros
    currentFilters = {
        type: 'all',
        group_id: '',
        inventory_id: '',
        date_from: '',
        date_to: ''
    };

    // Limpiar formulario
    document.getElementById('filterType').value = 'all';
    document.getElementById('filterGroup').value = '';
    document.getElementById('filterInventory').value = '';
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';

    // Recargar la lista completa
    window.location.reload();
}

/**
 * Actualizar la lista de bienes con los datos filtrados
 */
function updateRemovedAssetsList(assets) {
    const container = document.querySelector('.bienes-grid');
    
    if (!container) return;

    if (assets.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-filter fa-3x"></i>
                <p>No se encontraron bienes con los filtros aplicados</p>
            </div>
        `;
        return;
    }

    container.innerHTML = assets.map(asset => {
        const imageUrl = asset.image 
            ? `/storage/${asset.image}` 
            : '/assets/uploads/img/goods/default.jpg';
        
        const iconUrl = asset.type === 'Cantidad' 
            ? '/assets/icons/bienCantidad.svg' 
            : '/assets/icons/bienSerial.svg';

        const quantityInfo = asset.type === 'Cantidad'
            ? `<p><b>Cantidad:</b> ${asset.quantity}</p>`
            : `<p><b>Serial:</b> ${asset.serial ?? 'N/A'}</p>`;

        const removedAt = new Date(asset.removed_at).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="bien-card card-item"
                data-search="${asset.asset_name.toLowerCase()} ${asset.reason.toLowerCase()}"
                onclick="btnViewRemovedDetails(${asset.id})"
                style="cursor: pointer;">

                <img
                    src="${imageUrl}"
                    class="bien-image"
                    onerror="this.src='/assets/uploads/img/goods/default.jpg'"
                />

                <div class="bien-info">
                    <h3 class="name-item">
                        ${asset.asset_name}
                        <img src="${iconUrl}" class="bien-icon" />
                    </h3>

                    ${quantityInfo}
                    <p><b>Inventario:</b> ${asset.inventory_name}</p>
                    <p><b>Grupo:</b> ${asset.group_name}</p>
                    <p><b>Motivo:</b> ${asset.reason.substring(0, 50)}${asset.reason.length > 50 ? '...' : ''}</p>
                    <p><b>Usuario:</b> ${asset.removed_by_user ?? 'N/A'}</p>
                    <p><b>Fecha:</b> ${removedAt}</p>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Actualizar el botón de filtro según si hay filtros activos
 */
function updateFilterButton() {
    const filterBtn = document.getElementById('btnOpenFilter');
    const clearBtn = document.getElementById('btnClearFilter');
    
    if (!filterBtn || !clearBtn) return;

    const hasActiveFilters = 
        currentFilters.type !== 'all' ||
        currentFilters.group_id !== '' ||
        currentFilters.inventory_id !== '' ||
        currentFilters.date_from !== '' ||
        currentFilters.date_to !== '';

    if (hasActiveFilters) {
        filterBtn.classList.add('filter-active');
        clearBtn.style.display = 'inline-flex';
    } else {
        filterBtn.classList.remove('filter-active');
        clearBtn.style.display = 'none';
    }
}