function initFormsBien() {
    inicializarFormularioAjax('#formCrearBien', {
        resetOnSuccess: true,
        closeModalOnSuccess: true,
        onSuccess: (response) => {
            showToast(response);
            loadContent('/goods', {
                onSuccess: () => initFormsBien()
            });
        }
    });

    inicializarFormularioAjax('#formActualizarBien', {
        closeModalOnSuccess: true,
        onSuccess: (response) => {
            loadContent('/goods', {
                onSuccess: () => initFormsBien()
            });
            showToast(response);
        }
    });

    iniciarBusqueda('searchGood');
}

function eliminarBien(id) {
    eliminarRegistro({
        url: `/api/goods/delete/${id}`,
        onSuccess: (response) => {
            loadContent('/goods', {
                onSuccess: () => initFormsBien()
            });
            showToast(response);
        }
    });
}

function btnEditarBien(id, nombre) {
    // Configurar los valores iniciales del formulario
    document.getElementById("actualizarId").value = id;
    document.getElementById("actualizarNombreBien").value = nombre;
    document.getElementById("actualizarImagenBien").value = ""; // Limpiar imagen seleccionada

    // Mostrar el modal
    mostrarModal('#modalActualizarBien')
}
