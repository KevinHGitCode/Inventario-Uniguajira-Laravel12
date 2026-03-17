@extends('layouts.app')

@section('title', 'Carga Global con Inventario')

@section('content')
<div class="content">

    <div class="goods-header">
        <h3>Cargar bienes al catálogo y asignar a inventarios</h3>

        <div class="flex gap-5">
            <label class="excel-upload-btn" title="Descargar plantilla"
                onclick="globalExcelDescargarPlantilla()">
                <i class="fas fa-download"></i>
            </label>
            <label class="excel-upload-btn" title="Volver a bienes"
                onclick="loadContent('/goods', { onSuccess: () => { if (typeof initFormsBien === 'function') initFormsBien(); } })">
                <i class="fas fa-arrow-left"></i>
            </label>
        </div>
    </div>

    <p style="color:#555; font-size:0.9rem; margin-bottom:1rem;">
        Sube un Excel con los bienes. Si la columna <b>Localización</b> tiene el nombre
        de un inventario, el bien se asignará automáticamente a ese inventario.
        El nombre es <b>case-insensitive</b> (mayúsculas/minúsculas no importan).
    </p>

    {{-- Zona de carga --}}
    <div id="global-excel-upload-area" class="excel-upload-area"
        style="border: 2px dashed #ccc; padding: 20px; text-align: center; border-radius: 8px; cursor: pointer;"
        onclick="document.getElementById('globalExcelFileInput').click()">
        <i class="fas fa-file-excel fa-2x" style="color: #1B5E20; margin-bottom: 8px;"></i>
        <p>Arrastra y suelta un archivo aquí o haz clic para seleccionar</p>
        <input type="file" id="globalExcelFileInput" accept=".xlsx,.xls"
            class="hidden" onchange="globalExcelHandleFileUpload(event)" />
        <button type="button" class="select-btn"
            onclick="event.stopPropagation(); document.getElementById('globalExcelFileInput').click()">
            Seleccionar archivo
        </button>
    </div>

    <br />

    {{-- Previsualización --}}
    <div>
        <h3>Previsualización de datos</h3>
        <div id="global-excel-preview-table" style="overflow-x:auto;">
            <table id="globalPreviewTable" class="hidden"
                style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                <thead>
                    <tr style="background:#1B5E20; color:#fff;">
                        <th style="padding:8px;">Bien</th>
                        <th style="padding:8px;">Tipo</th>
                        <th style="padding:8px;">Localización</th>
                        <th style="padding:8px;">Serial</th>
                        <th style="padding:8px;">Cantidad</th>
                        <th style="padding:8px;">Marca</th>
                        <th style="padding:8px;">Modelo</th>
                        <th style="padding:8px;">Estado</th>
                        <th style="padding:8px;"></th>
                    </tr>
                </thead>
                <tbody id="globalPreviewBody"></tbody>
            </table>
        </div>

        <div style="display:flex; gap:0.75rem; margin-top:1rem;">
            <button onclick="globalExcelLimpiarUI()" class="btn">Limpiar</button>
            <button id="btnEnviarExcelGlobal" class="btn create-btn"
                onclick="globalExcelEnviarDatos()" disabled>
                Enviar
            </button>
        </div>

        <div id="globalErrorList" style="margin-top:1rem; display:none;">
            <h4 style="color:#b71c1c;">Advertencias:</h4>
            <ul id="globalErrorItems" style="color:#b71c1c; font-size:0.85rem;"></ul>
        </div>
    </div>

</div>
@endsection
