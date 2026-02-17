{{-- Modal Confirmar Eliminación --}}
<div class="modal fade" id="modalConfirmarEliminar" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Confirmar Eliminación</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <div class="modal-body">
                <p style="margin:0; font-size:15px;">
                    ¿Estás seguro de eliminar este usuario?
                </p>
                <p style="margin-top:8px; font-size:13px; color:#6b7280;">
                    Esta acción no se puede deshacer.
                </p>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Cancelar
                </button>

                <button
                    type="button"
                    id="btnConfirmarEliminar"
                    data-id=""
                    class="btn btn-danger"
                    onclick="eliminarUser(this)">
                    <i class="fa-solid fa-trash"></i> Eliminar
                </button>
            </div>

        </div>
    </div>
</div>
