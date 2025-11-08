// Inicializar el formulario de edición de perfil
let editarPerfil = () => inicializarFormularioAjax('#formEditarPerfil', {
    closeModalOnSuccess: true,
    onSuccess: (response) => {
        showToast(response);
        loadContent('/profile');
    }
});

// Inicializar el formulario de cambio de contraseña
inicializarFormularioAjax('#formCambiarContraseña', {
    closeModalOnSuccess: true,
    onSuccess: (response) => {
        showToast(response)
        logout(); // Redirigir a la página de inicio de sesión después de cambiar la contraseña
    }
});
