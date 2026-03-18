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
    class="excel-upload-area group relative cursor-pointer overflow-hidden rounded-[30px] border border-dashed border-slate-300/80 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,1),_rgba(248,250,252,1))] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-[0_30px_70px_-38px_rgba(22,163,74,0.28)]"
>
    <div class="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent"></div>
    <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-8">
        <div class="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[22px] bg-emerald-100 text-emerald-700 shadow-inner ring-1 ring-emerald-200 lg:mx-0">
            <i class="{{ $iconClass }} text-[1.9rem]"></i>
        </div>

        <div class="text-center lg:text-left">
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700/80">Carga desde Excel</p>
            <p class="mt-3 text-xl font-semibold leading-tight text-slate-900 sm:text-2xl">
                {{ $prompt }}
            </p>
            <p class="mt-3 text-sm leading-6 text-slate-500">
                Formatos admitidos: <span class="font-semibold text-slate-700">{{ str_replace(',', ', ', $accept) }}</span>
            </p>
        </div>

        <div class="flex flex-col items-center gap-3 lg:items-end">
            <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                data-excel-select-trigger="true"
            >
                <i class="fas fa-arrow-up-from-bracket text-sm"></i>
                {{ $buttonText }}
            </button>
            <span class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">o arrastra tu archivo</span>
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
