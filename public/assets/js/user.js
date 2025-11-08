function initUserFunctions() {

    // Inicializar el formulario de creacion de usuario
    inicializarFormularioAjax('#formCrearUser', {
        resetOnSuccess: true,
        closeModalOnSuccess: true,
        onSuccess: (response) => {
            showToast(response);
            loadContent('/users');
        }
    });

    // Inicializar el formulario de edicion de usuario
    inicializarFormularioAjax('#formEditarUser', {
        closeModalOnSuccess: true,
        onSuccess: (response) => {
            showToast(response);
            loadContent('/users', false);
        }
    });
}

function btnEditarUser(element) {
    // Obtén los datos del usuario desde los atributos del botón
    const id = element.getAttribute('data-id');
    const nombre = element.getAttribute('data-nombre');
    const nombreUsuario = element.getAttribute('data-nombre-usuario');
    const email = element.getAttribute('data-email');
    // const rol = element.getAttribute('data-rol');

    // Llena los campos del formulario con los datos del usuario
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-nombre').value = nombre;
    document.getElementById('edit-nombre_usuario').value = nombreUsuario;
    document.getElementById('edit-email').value = email;

    mostrarModal('#modalEditarUsuario');
}


function mostrarConfirmacion(userId) {
    // Guardar ID del usuario a eliminar
    const btnConfirmar = document.getElementById('btnConfirmarEliminar');
    btnConfirmar.setAttribute('data-id', userId);
    console.log(btnConfirmar.getAttribute('data-id'))
    mostrarModal('#modalConfirmarEliminar');
}

function eliminarUser(element) {
    const id = element.getAttribute('data-id');
    eliminarRegistro({
        url: `/api/users/delete/${id}`,
        showConfirm: false,
        onSuccess: (response) => {
            ocultarModal('#modalConfirmarEliminar');
            showToast(response);
            loadContent('/users', false);
        }
    });
}
