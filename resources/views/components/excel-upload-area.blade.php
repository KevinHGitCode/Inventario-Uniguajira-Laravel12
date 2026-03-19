@props([
    'areaId',
    'inputId',
    'accept' => '.xlsx,.xls',
    'prompt' => 'Arrastra y suelta un archivo aqui o haz clic para seleccionar',
    'buttonText' => 'Seleccionar archivo',
    'iconClass' => 'fas fa-file-excel',
    'multiple' => false,
])

<div id="{{ $areaId }}" class="excel-upload-area">
    <div class="excel-upload-panel">
        <div class="excel-upload-icon-box">
            <i class="{{ $iconClass }} excel-upload-icon"></i>
        </div>

        <div class="excel-upload-content">
            <p class="excel-upload-tag">Carga desde Excel</p>
            <p class="excel-upload-prompt">{{ $prompt }}</p>
            <p class="excel-upload-hint">Formatos admitidos: <strong>{{ str_replace(',', ', ', $accept) }}</strong></p>
        </div>

        <div class="excel-upload-actions">
            <button
                type="button"
                class="excel-upload-select-btn"
                data-excel-select-trigger="true"
            >
                <i class="fas fa-arrow-up-from-bracket"></i>
                {{ $buttonText }}
            </button>
            <span class="excel-upload-footnote">o arrastra tu archivo</span>
        </div>
    </div>

    <input
        type="file"
        id="{{ $inputId }}"
        accept="{{ $accept }}"
        class="excel-upload-input"
        @if($multiple) multiple @endif
    />
</div>
