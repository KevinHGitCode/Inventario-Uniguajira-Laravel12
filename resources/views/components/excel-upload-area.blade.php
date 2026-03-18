@props([
    'areaId',
    'inputId',
    'accept' => '.xlsx,.xls',
    'prompt' => 'Arrastra y suelta un archivo aqui o haz clic para seleccionar',
    'buttonText' => 'Seleccionar archivo',
    'iconClass' => 'fas fa-file-excel',
    'multiple' => false,
])

<div
    id="{{ $areaId }}"
    class="group relative cursor-pointer rounded-2xl border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-slate-50 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50/80 hover:shadow-lg"
>
    <div class="flex flex-col items-center gap-5 px-8 py-10 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">

        {{-- Icono --}}
        <div class="flex shrink-0 h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200 group-hover:bg-emerald-200 group-hover:ring-emerald-300 transition-colors duration-200 mx-auto sm:mx-0">
            <i class="{{ $iconClass }} text-2xl"></i>
        </div>

        {{-- Texto --}}
        <div class="min-w-0 flex-1">
            <p class="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-600">Carga desde Excel</p>
            <p class="text-lg font-semibold text-slate-800 sm:text-xl">{{ $prompt }}</p>
            <p class="mt-1 text-sm text-slate-500">
                Formatos admitidos:
                <span class="font-semibold text-slate-700">{{ str_replace(',', ', ', $accept) }}</span>
            </p>
        </div>

        {{-- Acción --}}
        <div class="flex shrink-0 flex-col items-center gap-2 sm:items-end">
            <button
                type="button"
                class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                data-excel-select-trigger="true"
            >
                <i class="fas fa-arrow-up-from-bracket text-sm"></i>
                {{ $buttonText }}
            </button>
            <span class="text-xs font-medium text-slate-400">o arrastra tu archivo</span>
        </div>
    </div>

    <input
        type="file"
        id="{{ $inputId }}"
        accept="{{ $accept }}"
        class="hidden"
        @if($multiple) multiple @endif
    />
</div>
