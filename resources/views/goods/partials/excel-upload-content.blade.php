<div class="content excel-page">

    <div class="excel-page-header">
        <div>
            <h3 class="excel-page-title">Cargar bienes al catalogo desde Excel</h3>
        </div>

        <div class="excel-page-actions">
            <button type="button" title="Descargar plantilla Excel" onclick="window.location.href='{{ route('goods.download-template') }}'" class="excel-page-action-btn">
                <i class="fas fa-download"></i>
            </button>
            <button type="button" title="Volver a la lista de bienes" onclick="loadContent('{{ route('goods.index') }}', { onSuccess: () => initFormsBien() })" class="excel-page-action-btn">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>
    </div>

    <div class="excel-page-notice-wrapper">
        <p class="excel-page-notice">
            La plantilla del modulo <b>Bienes</b> solo admite dos columnas: <b>Nombre</b> y <b>Tipo</b>.
            El tipo puede escribirse como <b>Cantidad</b> o <b>Serial</b> sin importar mayusculas o minusculas.
        </p>
        <p class="excel-page-warning">
            Si alguna fila viene incompleta o con un tipo invalido, se mostrara en la previsualizacion para que
            puedas corregirla o descartarla antes de enviar.
        </p>
    </div>

    <x-excel-upload-area
        area-id="excel-upload-area"
        input-id="excelFileInput"
        accept=".xlsx,.xls,.csv"
        prompt="Arrastra y suelta un archivo aqui o haz clic para seleccionar"
        button-text="Seleccionar archivo"
    />

    <x-excel-preview-table
        title="Previsualización de datos"
        container-id="excel-preview-table"
        table-id="goodsPreviewTable"
        body-id="excel-preview-body"
        :columns="[
            ['label' => 'Nombre'],
            ['label' => 'Tipo'],
            ['label' => 'Estado'],
            ['label' => ''],
        ]"
        clear-button-id="btnLimpiarExcel"
        submit-button-id="btnEnviarExcel"
        error-list-id="goodsErrorList"
        error-items-id="goodsErrorItems"
        error-title="Observaciones:"
        wrapper-class=""
    />

    @once
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                if (typeof initGoodsExcelUpload === 'function') {
                    initGoodsExcelUpload();
                }
            });
        </script>
    @endonce

</div>
