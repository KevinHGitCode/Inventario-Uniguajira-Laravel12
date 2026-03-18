@extends('layouts.app')

@section('title', 'Carga Global con Inventario')

@section('content')
<div class="content space-y-6">

    {{-- Encabezado de página --}}
    <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
            <h3 class="text-2xl font-semibold text-slate-800">Cargar bienes al catalogo y asignar a inventarios</h3>
        </div>

        <div class="flex shrink-0 items-center gap-2">
            <button
                type="button"
                title="Descargar plantilla"
                onclick="globalExcelDescargarPlantilla()"
                class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 hover:ring-emerald-300"
            >
                <i class="fas fa-download text-sm"></i>
            </button>
            <button
                type="button"
                title="Volver a bienes"
                onclick="loadContent('/goods', { onSuccess: () => { if (typeof initFormsBien === 'function') initFormsBien(); } })"
                class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-200 hover:ring-slate-300"
            >
                <i class="fas fa-arrow-left text-sm"></i>
            </button>
        </div>
    </div>

    {{-- Descripción --}}
    <p class="max-w-4xl rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-600 shadow-sm">
        Sube un Excel con los bienes. Si la columna <b>Localizacion</b> tiene el nombre
        de un inventario, el bien se asignara automaticamente a ese inventario.
        El nombre es <b>case-insensitive</b> (mayusculas/minusculas no importan).
    </p>

    <x-excel-upload-area
        area-id="global-excel-upload-area"
        input-id="globalExcelFileInput"
        accept=".xlsx,.xls"
        prompt="Arrastra y suelta un archivo aqui o haz clic para seleccionar"
        button-text="Seleccionar archivo"
    />

    <x-excel-preview-table
        title="Previsualizacion de datos"
        container-id="global-excel-preview-table"
        table-id="globalPreviewTable"
        body-id="globalPreviewBody"
        :columns="[
            ['label' => 'Bien'],
            ['label' => 'Tipo'],
            ['label' => 'Localizacion'],
            ['label' => 'Serial'],
            ['label' => 'Cantidad'],
            ['label' => 'Marca'],
            ['label' => 'Modelo'],
            ['label' => 'Estado'],
            ['label' => ''],
        ]"
        clear-button-id="btnLimpiarExcelGlobal"
        submit-button-id="btnEnviarExcelGlobal"
        error-list-id="globalErrorList"
        error-items-id="globalErrorItems"
        error-title="Advertencias:"
        wrapper-class="mt-0"
    />

    @once
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                if (typeof initFormsGlobalExcel === 'function') {
                    initFormsGlobalExcel();
                }
            });
        </script>
    @endonce

</div>
@endsection
