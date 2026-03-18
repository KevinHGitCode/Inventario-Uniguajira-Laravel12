@extends('layouts.app')

@section('title', 'Subir Excel')

@section('content')
<div class="content space-y-6">

    {{-- Encabezado de página --}}
    <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
            <h3 class="text-2xl font-semibold text-slate-800">Cargar datos de bienes desde Excel</h3>
        </div>

        <div class="flex shrink-0 items-center gap-2">
            <button
                type="button"
                title="Descargar plantilla Excel"
                onclick="window.location.href='{{ route('goods.download-template') }}'"
                class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 hover:ring-emerald-300"
            >
                <i class="fas fa-download text-sm"></i>
            </button>
            <button
                type="button"
                title="Volver a la lista de bienes"
                onclick="loadContent('{{ route('goods.index') }}', { onSuccess: () => initFormsBien() })"
                class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-200 hover:ring-slate-300"
            >
                <i class="fas fa-arrow-left text-sm"></i>
            </button>
        </div>
    </div>

    {{-- Área de carga --}}
    <div
        id="excel-upload-area"
        class="group relative cursor-pointer overflow-hidden rounded-[30px] border border-dashed border-slate-300/80 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,1),_rgba(248,250,252,1))] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-[0_30px_70px_-38px_rgba(22,163,74,0.28)]"
    >
        <div class="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent"></div>
        <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-8">
            <div class="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[22px] bg-emerald-100 text-emerald-700 shadow-inner ring-1 ring-emerald-200 lg:mx-0">
                <i class="fas fa-file-excel text-[1.9rem]"></i>
            </div>

            <div class="text-center lg:text-left">
                <p class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700/80">Carga desde Excel</p>
                <p class="mt-3 text-xl font-semibold leading-tight text-slate-900 sm:text-2xl">
                    Arrastra y suelta un archivo aqui o haz clic para seleccionar
                </p>
                <p class="mt-3 text-sm leading-6 text-slate-500">
                    Formatos admitidos: <span class="font-semibold text-slate-700">.xlsx, .xls, .csv</span>
                </p>
            </div>

            <div class="flex flex-col items-center gap-3 lg:items-end">
                <button
                    id="btn-select-excel"
                    type="button"
                    onclick="document.getElementById('excelFileInput').click()"
                    class="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                >
                    <i class="fas fa-arrow-up-from-bracket text-sm"></i>
                    Seleccionar archivo
                </button>
                <span class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">o arrastra tu archivo</span>
            </div>
        </div>

        <input
            type="file"
            id="excelFileInput"
            accept=".xlsx, .xls, .csv"
            class="hidden"
            onchange="handleFileUpload(event)"
        />
    </div>

    {{-- Sección de previsualización --}}
    <section class="mt-0">
        <div class="overflow-hidden rounded-[30px] border border-slate-200 bg-white/95 shadow-[0_26px_70px_-42px_rgba(15,23,42,0.5)] ring-1 ring-slate-200/60 backdrop-blur">
            <div class="border-b border-slate-200 bg-slate-50/80 px-5 py-5 sm:px-6">
                <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div class="max-w-3xl">
                        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700/80">Revision</p>
                        <div class="mt-3 flex flex-wrap items-center gap-3">
                            <h3 class="text-2xl font-semibold text-slate-800 sm:text-3xl">Previsualizacion de datos</h3>
                            <span class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                Editable
                            </span>
                        </div>
                        <p class="mt-3 text-sm leading-6 text-slate-500">
                            Revisa los datos, corrige celdas si hace falta y luego confirma el envio.
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-3 lg:justify-end">
                        <button
                            type="button"
                            onclick="btnClearExcelUploadUI()"
                            class="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            Limpiar
                        </button>
                        <button
                            id="btnEnviarExcel"
                            type="button"
                            onclick="sendGoodsData()"
                            disabled
                            class="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>

            <div id="excel-preview-table" class="px-0">
                <div class="overflow-x-auto">
                    <table class="hidden w-full min-w-[540px] divide-y divide-slate-200 text-sm">
                        <thead class="bg-slate-900 text-white">
                            <tr>
                                <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">Bien</th>
                                <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">Tipo</th>
                                <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">Imagen</th>
                                <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-100"></th>
                            </tr>
                        </thead>
                        <tbody id="excel-preview-body" class="divide-y divide-slate-100 bg-white"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

</div>
    @include('goods.partials.excel-upload-content')
@endsection
