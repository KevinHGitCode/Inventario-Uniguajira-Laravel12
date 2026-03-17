<div id="modalExcelInventario" class="modal">
    <div class="modal-content modal-content-large scrollable-content">
        <span class="close" onclick="ocultarModal('#modalExcelInventario')">&times;</span>
        <h2>Carga masiva de bienes</h2>

        <div class="goods-header" style="display: flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
            <p style="color: #555; font-size: 0.9rem;">
                Sube un archivo Excel con los bienes a agregar a este inventario.<br>
                Los bienes que no existan en el catálogo serán creados automáticamente.
            </p>
            
            <button class="excel-upload-btn" title="Descargar plantilla Excel"
                onclick="descargarPlantillaInventario()"
                style="display:flex; flex-direction:column; align-items:center; gap:4px; flex-shrink:0;">
                <i class="fas fa-download"></i> 
                <span>Plantilla</span>
            </button>
        </div>

        {{-- Zona de carga --}}
        <div id="inv-excel-upload-area" class="excel-upload-area"
            style="border: 2px dashed #ccc; padding: 20px; text-align: center; border-radius: 8px; cursor: pointer;"
            onclick="document.getElementById('invExcelFileInput').click()">
            <i class="fas fa-file-excel fa-2x" style="color: #1B5E20; margin-bottom: 8px;"></i>
            <p>Arrastra y suelta un archivo aquí o haz clic para seleccionar</p>
            <input type="file" id="invExcelFileInput" accept=".xlsx,.xls"
                class="hidden" onchange="invHandleFileUpload(event)" />
            <button type="button" class="select-btn" onclick="event.stopPropagation(); document.getElementById('invExcelFileInput').click()">
                Seleccionar archivo
            </button>
        </div>

        {{-- Previsualización --}}
        <div style="margin-top: 1.5rem;">
            <h3>Previsualización</h3>
            <div id="inv-excel-preview-table" style="overflow-x: auto;">
                <table id="invPreviewTable" class="hidden" style="width:100%; border-collapse:collapse; font-size: 0.85rem;">
                    <thead>
                        <tr style="background:#1B5E20; color:#fff;">
                            <th style="padding:8px;">Bien</th>
                            <th style="padding:8px;">Tipo</th>
                            <th style="padding:8px;">Serial</th>
                            <th style="padding:8px;">Cantidad</th>
                            <th style="padding:8px;">Marca</th>
                            <th style="padding:8px;">Modelo</th>
                            <th style="padding:8px;">Estado</th>
                            <th style="padding:8px;"></th>
                        </tr>
                    </thead>
                    <tbody id="invPreviewBody"></tbody>
                </table>
            </div>

            <div style="margin-top: 1rem; display: flex; gap: 0.75rem;">
                <button onclick="invLimpiarUI()" class="btn">Limpiar</button>
                <button id="btnEnviarExcelInventario" class="btn create-btn"
                    onclick="invEnviarDatos()" disabled>
                    Enviar
                </button>
            </div>

            <div id="invErrorList" style="margin-top:1rem; display:none;">
                <h4 style="color:#b71c1c;">Errores:</h4>
                <ul id="invErrorItems" style="color:#b71c1c; font-size:0.85rem;"></ul>
            </div>
        </div>
    </div>
</div>
