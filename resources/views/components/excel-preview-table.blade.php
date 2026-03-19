@props([
    'title' => 'Previsualización',
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
    'wrapperClass' => '',
])

@php
    $resolvedColumns = collect($columns)->map(function ($column) {
        return is_array($column) ? $column : ['label' => $column];
    });
@endphp

<section class="excel-preview-section {{ $wrapperClass }}">
    <div class="excel-preview-card">
        <div class="excel-preview-header">
            <div class="excel-preview-header-left">
                <p class="excel-preview-tag">Revision</p>
                <div class="excel-preview-title-row">
                    <h3 class="excel-preview-title">{{ $title }}</h3>
                    <span class="excel-preview-badge">Editable</span>
                </div>
                <p class="excel-preview-subtitle">Revisa los datos, corrige celdas si hace falta y luego confirma el envio.</p>
            </div>

            @if($clearButtonId || $submitButtonId)
                <div class="excel-preview-actions">
                    @if($clearButtonId)
                        <button id="{{ $clearButtonId }}" type="button" class="excel-preview-clear-btn">
                            <i class="fas fa-times"></i>
                            {{ $clearButtonText }}
                        </button>
                    @endif

                    @if($submitButtonId)
                        <button id="{{ $submitButtonId }}" type="button" class="excel-preview-submit-btn" disabled>
                            <i class="fas fa-paper-plane"></i>
                            {{ $submitButtonText }}
                        </button>
                    @endif
                </div>
            @endif
        </div>

        <div id="{{ $containerId }}" class="excel-preview-table-container">
            <div class="excel-preview-table-scroll">
                <table id="{{ $tableId }}" class="excel-preview-table hidden">
                    <thead class="excel-preview-table-head">
                        <tr>
                        @foreach($resolvedColumns as $column)
                            <th class="excel-preview-table-th">{{ $column['label'] ?? '' }}</th>
                        @endforeach
                        </tr>
                    </thead>
                    <tbody id="{{ $bodyId }}" class="excel-preview-table-body"></tbody>
                </table>
            </div>
        </div>

        @if($errorListId && $errorItemsId)
            <div id="{{ $errorListId }}" class="excel-error-list hidden">
                <div class="excel-error-title">
                    <i class="fas fa-exclamation-circle"></i>
                    <h4>{{ $errorTitle }}</h4>
                </div>
                <ul id="{{ $errorItemsId }}" class="excel-error-items"></ul>
            </div>
        @endif

    </div>
</section>
