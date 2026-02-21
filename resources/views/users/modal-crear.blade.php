@once
<style>
    /* ── Flyout Modal ─────────────────────────────────────────────── */
    .modal.flyout-modal {
        position: fixed !important;
        top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
        width: 100vw !important; height: 100vh !important;
        background: rgba(0, 0, 0, 0.45);
        z-index: 9999 !important;
        margin: 0 !important; padding: 0 !important;
        opacity: 0; visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    .modal.flyout-modal.active {
        opacity: 1 !important; visibility: visible !important;
    }
    .modal.flyout-modal > .flyout-panel {
        position: fixed !important;
        top: 0; right: 0; bottom: 0;
        height: 100vh !important;
        width: 42% !important; max-width: 680px !important; min-width: 380px !important;
        background: #fff;
        border-radius: 0 !important;
        overflow-y: auto; overflow-x: hidden;
        margin: 0 !important; padding: 30px 28px !important;
        box-sizing: border-box !important;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
        box-shadow: -4px 0 24px rgba(0, 0, 0, 0.14);
    }
    .modal.flyout-modal.active > .flyout-panel {
        transform: translateX(0) !important;
    }
    .flyout-panel > .close {
        position: absolute; top: 18px; right: 22px;
        font-size: 26px; font-weight: 700; color: #9ca3af;
        cursor: pointer; line-height: 1; background: none;
        border: none; padding: 0; transition: color 0.2s; z-index: 10;
    }
    .flyout-panel > .close:hover { color: #111827; }
    .flyout-panel > h2 { margin: 0 0 22px; padding-right: 40px; font-size: 20px; font-weight: 700; }
    @media (max-width: 768px) {
        .modal.flyout-modal > .flyout-panel { width: 92% !important; min-width: 0 !important; }
    }
</style>
@endonce

<div id="modalCrearUsuario" class="modal flyout-modal">
    <div class="flyout-panel">
        <span class="close" onclick="ocultarModal('#modalCrearUsuario')">&times;</span>
        <h2>Nuevo Usuario</h2>

        <form id="formCrearUser" class="form-container" method="POST"
            action="{{ url('/api/users/store') }}" autocomplete="off">
            @csrf

            <div class="form-section">
                <div class="section-header">Datos del Usuario</div>

                <div class="form-fields-grid">
                    <div class="form-field-full">
                        <label for="create-nombre" class="form-label">Nombre Completo:</label>
                        <input type="text" id="create-nombre" name="name"
                            class="form-input" placeholder="Juan Pérez" required />
                    </div>
                    <div>
                        <label for="create-username" class="form-label">Nombre de Usuario:</label>
                        <input type="text" id="create-username" name="username"
                            class="form-input" placeholder="juanperez" required />
                    </div>
                    <div>
                        <label for="create-email" class="form-label">Correo Electrónico:</label>
                        <input type="email" id="create-email" name="email"
                            class="form-input" placeholder="juan@example.com" required />
                    </div>
                    <div>
                        <label for="create-password" class="form-label">Contraseña:</label>
                        <input type="password" id="create-password" name="password"
                            class="form-input" placeholder="Mínimo 6 caracteres" required />
                    </div>
                    <div>
                        <label for="create-role" class="form-label">Rol:</label>
                        <select id="create-role" name="role" class="form-input" required>
                            <option value="">Selecciona un rol</option>
                            <option value="administrador">Administrador</option>
                            <option value="consultor">Consultor</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-actions" style="margin-top: 20px;">
                <button type="submit" class="btn submit-btn">
                    <i class="fas fa-floppy-disk"></i> Guardar
                </button>
            </div>
        </form>
    </div>
</div>