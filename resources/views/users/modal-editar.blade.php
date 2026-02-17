{{-- Modal Editar Usuario --}}
<div class="modal fade" id="modalEditarUsuario" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Editar Usuario</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <form id="formEditarUser" method="POST" action="{{ url('/api/users/update') }}">
                @csrf

                <div class="modal-body">

                    {{-- ID oculto --}}
                    <input type="hidden" id="edit-id" name="id">

                    <div style="margin-bottom: 14px;">
                        <label for="edit-nombre" class="form-label">Nombre Completo</label>
                        <input
                            type="text"
                            id="edit-nombre"
                            name="name"
                            class="form-control"
                            required
                        >
                    </div>

                    <div style="margin-bottom: 14px;">
                        <label for="edit-nombre_usuario" class="form-label">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="edit-nombre_usuario"
                            name="username"
                            class="form-control"
                            required
                        >
                    </div>

                    <div style="margin-bottom: 14px;">
                        <label for="edit-email" class="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            id="edit-email"
                            name="email"
                            class="form-control"
                            required
                        >
                    </div>

                    <div style="margin-bottom: 14px;">
                        <label for="edit-password" class="form-label">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="edit-password"
                            name="password"
                            class="form-control"
                            placeholder="Dejar vacío para no cambiar"
                        >
                        <small style="color:#6b7280;">
                            Solo completa este campo si deseas cambiar la contraseña.
                        </small>
                    </div>

                    <div style="margin-bottom: 6px;">
                        <label for="edit-role" class="form-label">Rol</label>
                        <select id="edit-role" name="role" class="form-select" required>
                            <option value="">Selecciona un rol</option>
                            <option value="administrador">Administrador</option>
                            <option value="consultor">Consultor</option>
                        </select>
                    </div>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancelar
                    </button>

                    <button type="submit" class="btn btn-primary">
                        <i class="fa-solid fa-rotate"></i> Actualizar
                    </button>
                </div>

            </form>

        </div>
    </div>
</div>
