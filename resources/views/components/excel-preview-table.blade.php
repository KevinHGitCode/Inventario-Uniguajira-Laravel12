@props([
    'title' => 'Previsualizacion',
    'containerId',
    'tableId',
    'bodyId',
    'columns' => [],
    'clearButtonId' => null,
    'clearButtonText' => 'Limpiar',
    'submitButtonId' => null,
    'submitButtonText' => 'Enviar',
    'errorListId' => null,
    'errorItemsId' => null,
    'errorTitle' => 'Errores',
    'wrapperClass' => 'mt-8',
    'wrapperStyle' => null,
])

@php
    $resolvedColumns = collect($columns)->map(function ($column) {
        return is_array($column) ? $column : ['label' => $column];
    });
@endphp

<section class="{{ $wrapperClass }}" @if($wrapperStyle) style="{{ $wrapperStyle }}" @endif>
    <div class="overflow-hidden rounded-[30px] border border-slate-200 bg-white/95 shadow-[0_26px_70px_-42px_rgba(15,23,42,0.5)] ring-1 ring-slate-200/60 backdrop-blur">
        <div class="border-b border-slate-200 bg-slate-50/80 px-5 py-5 sm:px-6">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div class="max-w-3xl">
                    <p class="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700/80">Revision</p>
                    <div class="mt-3 flex flex-wrap items-center gap-3">
                        <h3 class="text-2xl font-semibold text-slate-800 sm:text-3xl">{{ $title }}</h3>
                        <span class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            Editable
                        </span>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-slate-500">
                        Revisa los datos, corrige celdas si hace falta y luego confirma el envio.
                    </p>
                </div>

                @if($clearButtonId || $submitButtonId)
                    <div class="flex flex-wrap gap-3 lg:justify-end">
                        @if($clearButtonId)
                            <button
                                id="{{ $clearButtonId }}"
                                type="button"
                                class="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                            >
                                {{ $clearButtonText }}
                            </button>
                        @endif

                        @if($submitButtonId)
                            <button
                                id="{{ $submitButtonId }}"
                                type="button"
                                class="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                                disabled
                            >
                                {{ $submitButtonText }}
                            </button>
                        @endif
                    </div>
                @endif
            </div>
        </div>

    <div id="{{ $containerId }}" class="px-0">
        <div class="overflow-x-auto">
            <table id="{{ $tableId }}" class="hidden table w-full min-w-[820px] !mb-0 !border-0 !bg-transparent !shadow-none divide-y divide-slate-200 text-sm">
                <thead class="bg-slate-900 text-white">
                    <tr>
                    @foreach($resolvedColumns as $column)
                        <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">
                            {{ $column['label'] ?? '' }}
                        </th>
                    @endforeach
                    </tr>
                </thead>
                <tbody id="{{ $bodyId }}" class="divide-y divide-slate-100 bg-white"></tbody>
            </table>
        </div>
    </div>

    @if($errorListId && $errorItemsId)
        <div id="{{ $errorListId }}" class="m-5 hidden rounded-2xl border border-rose-200 bg-rose-50/80 p-4 shadow-sm">
            <h4 class="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">{{ $errorTitle }}</h4>
            <ul id="{{ $errorItemsId }}" class="mt-3 space-y-2"></ul>
        </div>
    @endif
</div>
</section>
