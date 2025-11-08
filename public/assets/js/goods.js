function initFormsBien() {
    // inicializar formulario de crear bien
    inicializarFormularioAjax('#formCrearBien', {
        resetOnSuccess: true,
        closeModalOnSuccess: true,
        onSuccess: (response) => {

            window.globalAutocomplete.recargarDatos(); // Usar window.globalAutocomplete

            showToast(response);
            loadContent('/goods', false);
        }
    });

    // inicializar formulario de actualizar bien
    inicializarFormularioAjax('#formActualizarBien', {
        closeModalOnSuccess: true,
        onSuccess: (response) => {

            window.globalAutocomplete.recargarDatos(); // Usar window.globalAutocomplete

            showToast(response);
            loadContent('/goods', false);
        }
    });
}

function eliminarBien(id) {
    eliminarRegistro({
        url: `/api/goods/delete/${id}`,
        onSuccess: (response) => {
            window.globalAutocomplete.recargarDatos(); // Usar window.globalAutocomplete
            loadContent('/goods', false);
            showToast(response);
        }
    });
}

function ActualizarBien(id, nombre) {
    // Configurar los valores iniciales del formulario
    document.getElementById("actualizarId").value = id;
    document.getElementById("actualizarNombreBien").value = nombre;
    document.getElementById("actualizarImagenBien").value = ""; // Limpiar imagen seleccionada

    // Mostrar el modal
    mostrarModal('#modalActualizarBien')
}