{{-- Modal Confirmar Eliminación - Centrado con sistema de la app --}}

<div id="modalConfirmarEliminar" class="modal">
    <div class="modal-content modal-content-small">

        <span class="close" onclick="ocultarModal('#modalConfirmarEliminar')">&times;</span>

        <h2 style="color: #dc2626;">
            <i class="fas fa-triangle-exclamation" style="margin-right: 8px; font-size: 20px;"></i>
            Eliminar Usuario
        </h2>

        <div style="margin: 16px 0 24px;">
            <p style="margin: 0 0 8px; font-size: 15px; color: #111827;">
                ¿Estás seguro de eliminar este usuario?
            </p>
            <p style="margin: 0; font-size: 13px; color: #6b7280;">
                Esta acción no se puede deshacer.
            </p>
        </div>

        <div class="form-actions" style="gap: 10px; display: flex;">
            <button
                id="btnConfirmarEliminar"
                data-id=""
                class="btn submit-btn"
                style="background: #dc2626;"
                onclick="eliminarUser(this)"
            >
                <i class="fas fa-trash"></i> Eliminar
            </button>
            <button
                type="button"
                class="btn"
                style="background: #6b7280; color: #fff; border-radius: 8px; padding: 8px 16px; border: none; cursor: pointer; font-weight: 600;"
                onclick="ocultarModal('#modalConfirmarEliminar')"
            >
                Cancelar
            </button>
        </div>

    </div>
</div>