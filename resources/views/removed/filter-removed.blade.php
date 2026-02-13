{{-- =========================
    MODAL DE FILTROS
    Panel derecho flyout
========================= --}}

<div id="modalFilterRemoved" class="modal">
    <div class="modal-content flyout-panel">
        <span class="close" onclick="ocultarModal('#modalFilterRemoved')">&times;</span>
        <h2>Filtrar Bienes Dados de Baja</h2>

        <div class="form-container">
            {{-- Filtro por tipo --}}
            <div class="form-section">
                <div class="section-header">Tipo de Bien</div>
                <div class="form-fields-grid">
                    <div class="form-field-full">
                        <label class="form-label">Seleccione el tipo:</label>
                        <select id="filterType" class="form-input">
                            <option value="all">Todos los tipos</option>
                            <option value="Cantidad">Cantidad</option>
                            <option value="Serial">Serial</option>
                        </select>
                    </div>
                </div>
            </div>

            {{-- Filtro por ubicación --}}
            <div class="form-section">
                <div class="section-header">Ubicación</div>
                <div class="form-fields-grid">
                    <div>
                        <label class="form-label">Bloque:</label>
                        <select id="filterGroup" class="form-input" onchange="updateInventoryOptions(this.value)">
                            <option value="">Todos los bloques</option>
                        </select>
                    </div>

                    <div>
                        <label class="form-label">Inventario:</label>
                        <select id="filterInventory" class="form-input">
                            <option value="">Todos los inventarios</option>
                        </select>
                    </div>
                </div>
            </div>

            {{-- Filtro por fecha --}}
            <div class="form-section">
                <div class="section-header">Rango de Fechas</div>
                <div class="form-fields-grid">
                    <div>
                        <label class="form-label">Fecha Desde:</label>
                        <input type="date" id="filterDateFrom" class="form-input">
                    </div>

                    <div>
                        <label class="form-label">Fecha Hasta:</label>
                        <input type="date" id="filterDateTo" class="form-input">
                    </div>
                </div>
            </div>

            {{-- Botones de acción --}}
            <div class="form-section">
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button type="button" class="btn-submit" onclick="applyFilters()">
                        <i class="fas fa-check"></i> Aplicar Filtros
                    </button>
                    <button type="button" class="btn-cancel" onclick="ocultarModal('#modalFilterRemoved')">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>