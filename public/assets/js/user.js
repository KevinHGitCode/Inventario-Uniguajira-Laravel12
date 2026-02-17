function initUserFunctions() {

    // ==========================
    // FORM CREAR
    // ==========================
    inicializarFormularioAjax('#formCrearUser', {
        resetOnSuccess: true,
        closeModalOnSuccess: true,
        onSuccess: (response) => {
            showToast(response);
            
            // ✅ Actualizar vista sin recargar
            refreshUsers();
        }
    });

    // ==========================
    // FORM EDITAR
    // ==========================
    inicializarFormularioAjax('#formEditarUser', {
        closeModalOnSuccess: true,
        onSuccess: (response) => {
            showToast(response);
            
            // ✅ Actualizar vista sin recargar
            refreshUsers();
        }
    });

    // ==========================
    // BUSCADOR (filtrado front)
    // ==========================
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const filter = this.value.toLowerCase();
            const rows = document.querySelectorAll('#tableBody tr');

            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }

    // ==========================
    // FIX: Bootstrap modal bug
    // (cuando se queda pegado)
    // ==========================
    const modalConfirm = document.getElementById('modalConfirmarEliminar');

    if (modalConfirm) {
        modalConfirm.addEventListener('hidden.bs.modal', function () {
            // 🔥 Elimina el backdrop si queda pegado
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

            // 🔥 Devuelve scroll normal
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('padding-right');
        });
    }
}

// ==========================
// ✅ FUNCIÓN DE REFRESH (NUEVA)
// ==========================
async function refreshUsers() {
    try {
        const response = await fetch(window.location.pathname, {
            headers: { "X-Requested-With": "XMLHttpRequest" }
        });
        
        if (!response.ok) throw new Error('Error al refrescar usuarios');
        
        const html = await response.text();
        const container = document.getElementById('users-content');
        container.innerHTML = html;
        
        // Reinicializar funciones después del refresh
        initUserFunctions();
        
    } catch (error) {
        console.error(error);
        showToast({
            type: 'error',
            message: 'No se pudo actualizar la vista'
        });
    }
}

// ==========================
// ABRIR MODAL EDITAR
// ==========================
function btnEditarUser(element) {

    const id = element.getAttribute('data-id');
    const nombre = element.getAttribute('data-nombre');
    const nombreUsuario = element.getAttribute('data-nombre-usuario');
    const email = element.getAttribute('data-email');
    const rol = element.getAttribute('data-role');

    document.getElementById('edit-id').value = id;
    document.getElementById('edit-nombre').value = nombre;
    document.getElementById('edit-nombre_usuario').value = nombreUsuario;
    document.getElementById('edit-email').value = email;

    // Rol (select)
    const roleSelect = document.getElementById('edit-role');
    if (roleSelect && rol) {
        roleSelect.value = rol;
    }

    mostrarModal('#modalEditarUsuario');
}

// ==========================
// ABRIR MODAL CONFIRMAR
// ==========================
function mostrarConfirmacion(userId) {
    const btnConfirmar = document.getElementById('btnConfirmarEliminar');

    btnConfirmar.setAttribute('data-id', userId);

    mostrarModal('#modalConfirmarEliminar');
}

// ==========================
// ELIMINAR USUARIO
// ==========================
function eliminarUser(element) {

    const id = element.getAttribute('data-id');

    eliminarRegistro({
        url: `/api/users/delete/${id}`,
        showConfirm: false,
        onSuccess: (response) => {

            // ✅ Cerrar modal SIEMPRE
            ocultarModal('#modalConfirmarEliminar');

            // 🔥 Por si queda pegado el backdrop
            setTimeout(() => {
                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                document.body.classList.remove('modal-open');
                document.body.style.removeProperty('padding-right');
            }, 150);

            showToast(response);

            // ✅ Actualizar vista sin recargar
            refreshUsers();
        }
    });
}