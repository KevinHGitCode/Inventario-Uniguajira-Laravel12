@extends('layouts.app')

@section('title', 'Carga Masiva de Bienes')

@section('content')
<div class="content">

    <div class="goods-header">
        <div>
            <h3>Carga masiva de bienes</h3>
            <span id="inventory-name" class="location" data-id="{{ $inventory->id }}" data-group-id="{{ $inventory->group_id }}">
                {{ $inventory->name }}
            </span>
            @if ($inventory->responsible)
                <span class="sub-info">Responsable: {{ $inventory->responsible }}</span>
            @endif
        </div>

        <div class="flex gap-5">
            <label class="excel-upload-btn" title="Descargar plantilla Excel"
                onclick="descargarPlantillaInventario()">
                <i class="fas fa-download"></i>
            </label>
            <label class="excel-upload-btn" title="Volver al inventario"
                onclick="loadContent('{{ route('inventory.goods', ['groupId' => $inventory->group_id, 'inventoryId' => $inventory->id]) }}', { onSuccess: () => initGoodsInventoryFunctions() })">
                <i class="fas fa-arrow-left"></i>
            </label>
        </div>
    </div>

    <p style="color: #555; font-size: 0.9rem; margin-bottom: 1rem;">
        Sube un archivo Excel con los bienes a agregar a este inventario.
        Los bienes que no existan en el catalogo seran creados automaticamente.
    </p>

    <div id="inv-excel-upload-area" class="excel-upload-area"
        style="border: 2px dashed #ccc; padding: 20px; text-align: center; border-radius: 8px; cursor: pointer;"
        onclick="document.getElementById('invExcelFileInput').click()">
        <i class="fas fa-file-excel fa-2x" style="color: #1B5E20; margin-bottom: 8px;"></i>
        <p>Arrastra y suelta un archivo aqui o haz clic para seleccionar</p>
        <input type="file" id="invExcelFileInput" accept=".xlsx,.xls"
            class="hidden" onchange="invHandleFileUpload(event)" />
        <button type="button" class="select-btn" onclick="event.stopPropagation(); document.getElementById('invExcelFileInput').click()">
            Seleccionar archivo
        </button>
    </div>

    <div style="margin-top: 1.5rem;">
        <h3>Previsualizacion</h3>
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

    @once
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                if (typeof invLimpiarUI === 'function') {
                    invLimpiarUI();
                }
            });
        </script>
    @endonce

</div>
@endsection
