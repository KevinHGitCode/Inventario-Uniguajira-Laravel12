{{-- Modal Crear Usuario --}}
<div class="modal fade" id="modalCrearUsuario" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Crear Usuario</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <form id="formCrearUser" method="POST" action="{{ url('/api/users/store') }}">
                @csrf

                <div class="modal-body">

                    <div style="margin-bottom: 14px;">
                        <label for="create-nombre" class="form-label">Nombre Completo</label>
                        <input
                            type="text"
                            id="create-nombre"
                            name="name"
                            class="form-control"
                            placeholder="Juan Pérez"
                            required
                        >
                    </div>

                    <div style="margin-bottom: 14px;">
                        <label for="create-username" class="form-label">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="create-username"
                            name="username"
                            class="form-control"
                            placeholder="juanperez"
                            required
                        >
                    </div>

                    <div style="margin-bottom: 14px;">
                        <label for="create-email" class="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            id="create-email"
                            name="email"
                            class="form-control"
                            placeholder="juan@example.com"
                            required
                        >
                    </div>

                    <div style="margin-bottom: 14px;">
                        <label for="create-password" class="form-label">Contraseña</label>
                        <input
                            type="password"
                            id="create-password"
                            name="password"
                            class="form-control"
                            placeholder="Mínimo 6 caracteres"
                            required
                        >
                    </div>

                    <div style="margin-bottom: 6px;">
                        <label for="create-role" class="form-label">Rol</label>
                        <select id="create-role" name="role" class="form-select" required>
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
                        <i class="fa-solid fa-floppy-disk"></i> Guardar
                    </button>
                </div>

            </form>

        </div>
    </div>
</div>
