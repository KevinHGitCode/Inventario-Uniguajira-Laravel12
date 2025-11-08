function toggleExcelUploadUI() {
    const excelUploadUI = document.getElementById('excel-upload-content');
    const goodsContent = document.getElementById('bienes-grid');

    // Toggle class hidden
    excelUploadUI.classList.toggle('hidden');
    goodsContent.classList.toggle('hidden');
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['.xlsx', '.xls', '.csv'];
    const fileType = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validTypes.includes(fileType)) {
        alert('Por favor seleccione un archivo Excel válido (.xlsx, .xls, .csv)');
        return;
    }

    // Process the file
    loadDataFromExcel(file);
}

/**
 * Loads and processes data from an Excel file
 * @param {File} file - The Excel file to be processed
 * @description This function reads an Excel file and converts it to JSON format.
 * The reader.readAsBinaryString(file) method reads the contents of the file as a binary string,
 * which is then used by the XLSX library to parse the Excel data.
 * Once loaded, it accesses the first sheet and converts it to a JSON array.
 */
function loadDataFromExcel(file) {
    console.log('Iniciando carga del archivo Excel:', file.name);

    const reader = new FileReader();
    reader.onload = function(event) {
        console.log('Archivo leído correctamente, procesando datos...');
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        console.log('Primera hoja encontrada:', firstSheetName);

        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log('Datos convertidos a JSON:', jsonData);

        // Verificar encabezados requeridos
        const headers = jsonData[0];
        console.log('Encabezados encontrados:', headers);
        if (!headers || !headers.some(h => h.toLowerCase() === 'bien') || !headers.some(h => h.toLowerCase() === 'tipo')) {
            console.error('Encabezados requeridos no encontrados. Se requiere "bien" y "tipo".');
            alert('El archivo Excel debe contener los encabezados "bien" y "tipo" (no sensible a mayúsculas).');
            return;
        }

        const bienIndex = headers.findIndex(h => h.toLowerCase() === 'bien');
        const tipoIndex = headers.findIndex(h => h.toLowerCase() === 'tipo');
        const imagenIndex = headers.findIndex(h => h.toLowerCase() === 'imagen');

        // Obtener bienes existentes para validar duplicados
        const existingGoods = window.globalAutocomplete.getItems().map(item => item.bien.toLowerCase());

        // Refresh the list of existing goods before processing
        window.globalAutocomplete.recargarDatos();
        const updatedExistingGoods = window.globalAutocomplete.getItems().map(item => item.bien.toLowerCase());

        // Limpiar tabla de previsualización
        const previewBody = document.getElementById('excel-preview-body');
        previewBody.innerHTML = '';
        console.log('Tabla de previsualización limpiada.');

        // Procesar filas de datos
        jsonData.slice(1).forEach((row, index) => {
            const bien = row[bienIndex]?.trim();
            const tipo = row[tipoIndex]?.trim();
            const imagen = row[imagenIndex]?.trim();

            // Validar que el bien no sea N/A y no esté duplicado
            if (!bien || bien.toLowerCase() === 'n/a') {
                console.warn(`Fila ${index + 1} ignorada: bien inválido (${bien}).`);
                return;
            }

            // Check for duplicates against existing goods
            if (updatedExistingGoods.includes(bien.toLowerCase())) {
                console.warn(`Fila ${index + 1} ignorada: bien duplicado (${bien}).`);
                return;
            }

            console.log(`Procesando fila ${index + 1}:`, { bien, tipo, imagen });

            // Crear fila de la tabla
            const tr = document.createElement('tr');

            // Columna "Bien"
            const tdBien = document.createElement('td');
            tdBien.textContent = bien;
            tr.appendChild(tdBien);

            // Columna "Tipo"
            const tdTipo = document.createElement('td');
            tdTipo.textContent = tipo || 'N/A';
            tr.appendChild(tdTipo);

            // Columna "Imagen" (espacio para subir)
            const tdImagen = document.createElement('td');
            const imgInput = document.createElement('input');
            imgInput.type = 'file';
            imgInput.accept = 'image/*';
            imgInput.classList.add('image-upload-input');
            // IMPORTANTE: Agregar data-index para identificar la imagen
            imgInput.setAttribute('data-index', index);
            tdImagen.appendChild(imgInput);
            tr.appendChild(tdImagen);

            // Add a trash icon to each row for deletion
            const tdTrash = document.createElement('td');
            const closeIcon = document.createElement('i');
            closeIcon.classList.add('fas', 'fa-times', 'close-icon');
            closeIcon.title = 'Eliminar fila';
            closeIcon.onclick = function() {
                tr.remove();
                updateEnviarButtonState();
            };
            tdTrash.appendChild(closeIcon);
            tr.appendChild(tdTrash);

            // Agregar fila a la tabla
            previewBody.appendChild(tr);
            console.log('Fila agregada a la tabla:', tr);
        });

        // Mostrar tabla si tiene datos
        const table = document.querySelector('#excel-preview-table table');
        if (previewBody.children.length > 0) {
            table.classList.remove('hidden');
            console.log('Tabla de previsualización mostrada.');
        } else {
            table.classList.add('hidden');
            console.warn('No se encontraron datos válidos para mostrar en la tabla.');
        }

        // Show a toast if all rows are ignored
        if (previewBody.children.length === 0) {
            showToast({ success: false, message: 'Todos los datos del archivo Excel ya estan en el sistema.' });
        }

        updateEnviarButtonState();
    };

    reader.onerror = function() {
        showToast({ success: false, message: 'Ocurrió un error al leer el archivo. Intente nuevamente.' });
    };

    reader.readAsBinaryString(file);
    showToast({ success: true, message: 'Lectura del archivo iniciada.' });
}

function btnClearExcelUploadUI() {
    toggleExcelUploadUI();

    // Limpiar el input de archivo
    const excelFileInput = document.getElementById('excelFileInput');
    excelFileInput.value = '';

    // Limpiar la tabla de previsualización
    const previewBody = document.getElementById('excel-preview-body');
    previewBody.innerHTML = '';

    // Ocultar la tabla de previsualización
    const table = document.querySelector('#excel-preview-table table');
    table.classList.add('hidden');

    updateEnviarButtonState();
}

// FUNCIÓN CORREGIDA - Ahora maneja correctamente las imágenes
function sendGoodsData() {
    const rows = document.querySelectorAll('#excel-preview-body tr');
    const formData = new FormData();
    
    console.log('Iniciando envío de datos. Filas encontradas:', rows.length);

    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        const bien = cells[0]?.textContent.trim();
        const tipo = cells[1]?.textContent.trim();
        const imagenInput = cells[2]?.querySelector('input[type="file"]');
        const imagen = imagenInput?.files[0];

        const tipoEnum = mapTipoToEnum(tipo);
        
        console.log(`Procesando fila ${index}:`, {
            bien,
            tipo,
            tipoEnum,
            tieneImagen: !!imagen,
            nombreImagen: imagen?.name
        });

        if (bien && tipoEnum) {
            // Agregar datos del bien
            formData.append(`goods[${index}][nombre]`, bien);
            formData.append(`goods[${index}][tipo]`, tipoEnum);
            
            // CORRECCIÓN PRINCIPAL: Usar la clave correcta para las imágenes
            if (imagen) {
                // La clave debe coincidir con lo que espera el backend: goods_{index}_imagen
                formData.append(`goods_${index}_imagen`, imagen);
                console.log(`Imagen agregada con clave: goods_${index}_imagen`);
            }
        }
    });

    // Debug: Mostrar todo el contenido del FormData
    console.log('Contenido del FormData:');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]));
    }

    fetch('/api/goods/batchCreate', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            console.log('Respuesta recibida, status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Datos de respuesta:', data);
            showToast(data);
            if (data.success) {
                window.globalAutocomplete.recargarDatos();
                loadContent('/goods');
                btnClearExcelUploadUI();
            }
        })
        .catch(error => {
            console.error('Error en la petición:', error);
            showToast({ success: false, message: 'Error de conexión: ' + error.message });
        });
}

function mapTipoToEnum(tipo) {
    if (!tipo) return null;
    const tipoLower = tipo.toLowerCase();
    if (tipoLower === 'cantidad') return 1;
    if (tipoLower === 'serial') return 2;
    return null; // Invalid type
}

function collectGoodsData() {
    const rows = document.querySelectorAll('#excel-preview-body tr');
    const goods = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const bien = cells[0]?.textContent.trim();
        const tipo = cells[1]?.textContent.trim();
        const imagenInput = cells[2]?.querySelector('input[type="file"]');
        const imagen = imagenInput?.files[0]?.name || null;

        const tipoEnum = mapTipoToEnum(tipo);
        if (bien && tipoEnum) {
            goods.push({ nombre: bien, tipo: tipoEnum, imagen });
        }
    });

    return goods;
}

function updateEnviarButtonState() {
    const btn = document.getElementById('btnEnviarExcel');
    if (btn) {
        btn.disabled = collectGoodsData().length === 0;
    }
}