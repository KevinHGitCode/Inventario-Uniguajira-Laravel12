// Inicializa las funciones relacionadas con bienes seriales del inventario
function initGoodsSerialsInventoryFunctions() {

    // Inicializa el formulario para editar un bien serial
    inicializarFormularioAjax('#formEditarBienSerial', {
        closeModalOnSuccess: true,
        resetOnSuccess: true,
        onSuccess: (response) => {
            showToast(response);

            const url = document.getElementById('good-serial-inventory-name').getAttribute('data-url');
            loadContent(url,
                { onSuccess: () => initGoodsSerialsInventoryFunctions() }
            );
        }
    });

    // Inicializa el formulario para dar de baja un serial
    inicializarFormularioAjax('#formDarDeBajaBienSerial', {
        closeModalOnSuccess: true,
        resetOnSuccess: true,
        onSuccess: (response) => {
            showToast(response);

            const url = document.getElementById('good-serial-inventory-name').getAttribute('data-url');
            loadContent(url,
                { onSuccess: () => initGoodsSerialsInventoryFunctions() }
            );
        }
    });

    // ------------------------------------------------------------

    // Inicializar la búsqueda de inventarios
    iniciarBusqueda('searchGoodsSerialsInventory');

    console.log('Funciones de bienes seriales del inventario inicializadas');
}


// Editar bien seleccionado
function btnEditarBienSerial() {
    if (!selectedItem || selectedItem.type !== 'serial-good') {
        showToast({ success: false, message: 'No se ha seleccionado un bien serial' });
        return;
    }

    // Obtener el elemento seleccionado
    const card = selectedItem.element;

    // Establecer los valores en el formulario
    document.getElementById('editBienEquipoId').value = card.dataset.id;
    document.getElementById('editNombreBien').value = card.dataset.name;
    document.getElementById('editDescripcionBien').value = card.dataset.description || '';
    document.getElementById('editMarcaBien').value = card.dataset.brand || '';
    document.getElementById('editModeloBien').value = card.dataset.model || '';
    document.getElementById('editSerialBien').value = card.dataset.serial || '';
    document.getElementById('editEstadoBien').value = card.dataset.status || 'activo';
    document.getElementById('editColorBien').value = card.dataset.color || '';
    document.getElementById('editCondicionBien').value = card.dataset.condition || '';
    document.getElementById('editFechaIngresoBien').value = card.dataset.entryDate || '';

    // Mostrar el modal de edición
    mostrarModal('#modalEditarBienSerial');
}


function btnEliminarBienSerial() {
    const idBienSerial = selectedItem.id;

    eliminarRegistro({
        url: `/api/goods-inventory/delete-serial/${idBienSerial}`,
        onSuccess: (response) => {
            showToast(response);

            const url = document.getElementById('good-serial-inventory-name').getAttribute('data-url');
            loadContent(url,
                { onSuccess: () => initGoodsSerialsInventoryFunctions() }
            );
        }
    });
}


// Dar de baja bien serial
function btnDarDeBajaBienSerial() {
    if (!selectedItem || selectedItem.type !== 'serial-good') {
        showToast({ success: false, message: 'No se ha seleccionado un bien serial' });
        return;
    }

    const card = selectedItem.element;

    // Campos hidden
    document.getElementById('darDeBajaSerialEquipoId').value = card.dataset.id;
    document.getElementById('darDeBajaSerialInventarioId').value = card.dataset.inventoryId;

    // Nombre fila completa
    document.getElementById('darDeBajaSerialNombreBien').value = card.dataset.name;

    // 2 columnas
    document.getElementById('darDeBajaSerialSerial').value = card.dataset.serial || '';
    document.getElementById('darDeBajaSerialEstado').value = card.dataset.status || '';

    document.getElementById('darDeBajaSerialMarca').value = card.dataset.brand || '';
    document.getElementById('darDeBajaSerialModelo').value = card.dataset.model || '';

    document.getElementById('darDeBajaSerialColor').value = card.dataset.color || '';
    document.getElementById('darDeBajaSerialCondicion').value = card.dataset.condition || '';

    // Fechas
    document.getElementById('darDeBajaSerialFechaIngreso').value = card.dataset.entryDate || '';
    document.getElementById('darDeBajaSerialFechaSalida').value = new Date().toISOString().slice(0, 10);

    // Descripción (fila completa)
    document.getElementById('darDeBajaSerialDescripcion').value = card.dataset.description || '';

    // Motivo
    document.getElementById('darDeBajaSerialMotivo').value = '';

    mostrarModal('#modalDarDeBajaBienSerial');
}
