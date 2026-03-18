@extends('layouts.app')

@section('title', 'Carga Masiva de Bienes')

@section('content')
<div class="content space-y-6">

    {{-- Encabezado de página --}}
    <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
            <h3 class="text-2xl font-semibold text-slate-800">Carga masiva de bienes</h3>
            <span
                id="inventory-name"
                class="inline-flex items-center gap-1.5 text-base font-normal text-slate-500"
                data-id="{{ $inventory->id }}"
                data-group-id="{{ $inventory->group_id }}"
            >
                <i class="fas fa-layer-group text-xs text-slate-400"></i>
                {{ $inventory->name }}
            </span>
            @if ($inventory->responsible)
                <p class="text-sm font-light text-slate-400">
                    <i class="fas fa-user mr-1 text-xs"></i>Responsable: {{ $inventory->responsible }}
                </p>
            @endif
        </div>

        <div class="flex shrink-0 items-center gap-2">
            <button
                type="button"
                title="Descargar plantilla Excel"
                onclick="descargarPlantillaInventario()"
                class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 hover:ring-emerald-300"
            >
                <i class="fas fa-download text-sm"></i>
            </button>
            <button
                type="button"
                title="Volver al inventario"
                onclick="loadContent('{{ route('inventory.goods', ['groupId' => $inventory->group_id, 'inventoryId' => $inventory->id]) }}', { onSuccess: () => initGoodsInventoryFunctions() })"
                class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-200 hover:ring-slate-300"
            >
                <i class="fas fa-arrow-left text-sm"></i>
            </button>
        </div>
    </div>

    {{-- Descripción --}}
    <p class="max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-600 shadow-sm">
        Sube un archivo Excel con los bienes a agregar a este inventario.
        Los bienes que no existan en el catalogo seran creados automaticamente.
    </p>


    <x-excel-upload-area
        area-id="inv-excel-upload-area"
        input-id="invExcelFileInput"
        accept=".xlsx,.xls"
        prompt="Arrastra y suelta un archivo aqui o haz clic para seleccionar"
        button-text="Seleccionar archivo"
    />

    <x-excel-preview-table
        title="Previsualizacion"
        container-id="inv-excel-preview-table"
        table-id="invPreviewTable"
        body-id="invPreviewBody"
        :columns="[
            ['label' => 'Bien'],
            ['label' => 'Tipo'],
            ['label' => 'Serial'],
            ['label' => 'Cantidad'],
            ['label' => 'Marca'],
            ['label' => 'Modelo'],
            ['label' => 'Estado'],
            ['label' => ''],
        ]"
        clear-button-id="btnLimpiarExcelInventario"
        submit-button-id="btnEnviarExcelInventario"
        error-list-id="invErrorList"
        error-items-id="invErrorItems"
        error-title="Errores:"
        wrapper-class="mt-0"
    />

    @once
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                if (typeof initInventoryExcelUploadView === 'function') {
                    initInventoryExcelUploadView();
                }
            });
        </script>
    @endonce

</div>
@endsection
