// Configuración
const CONFIG = {
    validTypes: ['.xlsx', '.xls', '.csv'],
    requiredHeaders: ['bien', 'tipo'],
    optionalHeaders: ['imagen'],
    tipoMap: { 'cantidad': 1, 'serial': 2 },
    maxImageSize: 2 * 1024 * 1024, // 2MB por imagen
    maxTotalSize: 8 * 1024 * 1024  // 8MB total (límite PHP por defecto)
};

// Manejo de carga de archivo
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!CONFIG.validTypes.includes(fileExt)) {
        alert('Formato inválido. Use: ' + CONFIG.validTypes.join(', '));
        return;
    }

    loadDataFromExcel(file);
}

// Cargar y procesar Excel
async function loadDataFromExcel(file) {
    try {
        const data = await readExcelFile(file);
        const parsedData = parseExcelData(data);

        if (!parsedData.length) {
            showToast({ success: false, message: 'No hay datos válidos en el archivo.' });
            return;
        }

        const existingGoods = await fetchExistingGoods();
        const filteredData = filterDuplicates(parsedData, existingGoods);

        if (!filteredData.length) {
            showToast({ success: false, message: 'Todos los bienes ya existen en el sistema.' });
            return;
        }

        renderPreviewTable(filteredData);
        showToast({ success: true, message: `${filteredData.length} bien(es) listo(s) para enviar.` });

    } catch (error) {
        console.error('Error al procesar Excel:', error);
        showToast({ success: false, message: 'Error al procesar el archivo.' });
    }
}

// Leer archivo Excel
function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        reader.readAsBinaryString(file);
    });
}

// Parsear datos del Excel
function parseExcelData(jsonData) {
    if (!jsonData.length) return [];

    const headers = jsonData[0].map(h => h.toLowerCase().trim());

    // Validar encabezados requeridos
    const hasRequired = CONFIG.requiredHeaders.every(h => headers.includes(h));
    if (!hasRequired) {
        alert(`El archivo debe contener: ${CONFIG.requiredHeaders.join(', ')}`);
        return [];
    }

    const bienIdx = headers.indexOf('bien');
    const tipoIdx = headers.indexOf('tipo');
    const imagenIdx = headers.indexOf('imagen');

    // Procesar filas
    return jsonData.slice(1)
        .map(row => ({
            bien: row[bienIdx]?.toString().trim(),
            tipo: row[tipoIdx]?.toString().trim().toLowerCase(),
            imagen: imagenIdx >= 0 ? row[imagenIdx]?.toString().trim() : null
        }))
        .filter(item => {
            // Filtrar filas inválidas
            if (!item.bien || item.bien.toLowerCase() === 'n/a') return false;
            if (!CONFIG.tipoMap[item.tipo]) return false;
            return true;
        });
}

// Filtrar duplicados
function filterDuplicates(data, existingGoods) {
    const existing = new Set(existingGoods.map(g => g.toLowerCase()));
    return data.filter(item => !existing.has(item.bien.toLowerCase()));
}

// Obtener bienes existentes
async function fetchExistingGoods() {
    try {
        const response = await fetch('/api/goods/get/json');
        if (!response.ok) throw new Error('Error al consultar bienes');

        const data = await response.json();
        return data.map(item => item.bien);
    } catch (error) {
        console.error('Error al obtener bienes:', error);
        return [];
    }
}

// Renderizar tabla de previsualización
function renderPreviewTable(data) {
    const tbody = document.getElementById('excel-preview-body');
    tbody.innerHTML = '';

    data.forEach((item, index) => {
        const row = createPreviewRow(item, index);
        tbody.appendChild(row);
    });

    const table = document.querySelector('#excel-preview-table table');
    table.classList.remove('hidden');
    updateEnviarButtonState();
}

// Crear fila de previsualización
function createPreviewRow(item, index) {
    const tr = document.createElement('tr');

    // Columna Bien
    const tdBien = document.createElement('td');
    tdBien.textContent = item.bien;
    tr.appendChild(tdBien);

    // Columna Tipo
    const tdTipo = document.createElement('td');
    tdTipo.textContent = item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1);
    tr.appendChild(tdTipo);

    // Columna Imagen
    const tdImagen = document.createElement('td');
    const imageContainer = createImageUploadContainer(index);
    tdImagen.appendChild(imageContainer);
    tr.appendChild(tdImagen);

    // Columna Eliminar
    const tdTrash = document.createElement('td');
    const icon = document.createElement('i');
    icon.className = 'fas fa-times close-icon';
    icon.title = 'Eliminar';
    icon.onclick = () => {
        tr.remove();
        updateEnviarButtonState();
    };
    tdTrash.appendChild(icon);
    tr.appendChild(tdTrash);

    return tr;
}

// Crear contenedor de imagen con botón y preview
function createImageUploadContainer(index) {
    const container = document.createElement('div');
    container.className = 'image-upload-container';

    // Input oculto
    const imgInput = document.createElement('input');
    imgInput.type = 'file';
    imgInput.accept = 'image/*';
    imgInput.style.display = 'none';
    imgInput.dataset.index = index;
    imgInput.id = `img-input-${index}`;

    // Botón para seleccionar imagen (visible por defecto)
    const selectBtn = document.createElement('button');
    selectBtn.type = 'button';
    selectBtn.className = 'btn-select-image';
    selectBtn.innerHTML = '<i class="fas fa-image"></i> Seleccionar imagen';
    selectBtn.onclick = () => imgInput.click();

    // Contenedor de preview (oculto por defecto)
    const previewContainer = document.createElement('div');
    previewContainer.className = 'image-preview-container';
    previewContainer.style.display = 'none';

    // Indicador visual de imagen seleccionada
    const preview = document.createElement('span');
    preview.className = 'image-preview-indicator';
    preview.innerHTML = '<i class="fas fa-check-circle"></i> <span class="image-name"></span>';

    // Botón para cambiar imagen
    const changeBtn = document.createElement('button');
    changeBtn.type = 'button';
    changeBtn.className = 'btn-change-image';
    changeBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Cambiar';
    changeBtn.onclick = () => imgInput.click();

    previewContainer.appendChild(preview);
    previewContainer.appendChild(changeBtn);

    // Evento cuando se selecciona una imagen
    imgInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tamaño de imagen
        if (file.size > CONFIG.maxImageSize) {
            alert(`La imagen es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo permitido: 2MB`);
            imgInput.value = '';
            return;
        }

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('El archivo debe ser una imagen válida');
            imgInput.value = '';
            return;
        }

        // Mostrar nombre del archivo
        const fileName = file.name.length > 20
            ? file.name.substring(0, 17) + '...'
            : file.name;
        preview.querySelector('.image-name').textContent = fileName;

        // Actualizar UI: ocultar botón de seleccionar, mostrar preview
        selectBtn.style.display = 'none';
        previewContainer.style.display = 'flex';
    };

    container.appendChild(imgInput);
    container.appendChild(selectBtn);
    container.appendChild(previewContainer);

    return container;
}

// Enviar datos al servidor
async function sendGoodsData() {
    const rows = document.querySelectorAll('#excel-preview-body tr');
    if (!rows.length) return;

    const formData = new FormData();
    let totalSize = 0;
    const images = [];

    // Recopilar datos y calcular tamaño total
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        const bien = cells[0].textContent.trim();
        const tipo = cells[1].textContent.trim().toLowerCase();
        const imgInput = cells[2].querySelector('input[type="file"]');
        const imagen = imgInput?.files[0];

        const tipoEnum = CONFIG.tipoMap[tipo];

        if (bien && tipoEnum) {
            formData.append(`goods[${index}][nombre]`, bien);
            formData.append(`goods[${index}][tipo]`, tipoEnum);

            if (imagen) {
                totalSize += imagen.size;
                images.push({ index, file: imagen });
                formData.append(`goods_${index}_imagen`, imagen);
            }
        }
    });

    // Validar tamaño total
    if (totalSize > CONFIG.maxTotalSize) {
        const totalMB = (totalSize / 1024 / 1024).toFixed(2);
        const maxMB = (CONFIG.maxTotalSize / 1024 / 1024).toFixed(2);
        alert(`El tamaño total de las imágenes (${totalMB}MB) excede el límite permitido (${maxMB}MB).\n\nPor favor:\n- Reduce el número de imágenes\n- Usa imágenes más pequeñas\n- Envía en múltiples lotes`);
        return;
    }

    // Indicador de progreso
    const progressDiv = document.createElement('div');
    progressDiv.className = 'upload-progress active';
    progressDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo datos...';
    document.body.appendChild(progressDiv);

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        const response = await fetch('/api/goods/batchCreate', {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': csrfToken },
            body: formData
        });

        // Verificar si la respuesta es JSON válida
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Respuesta no JSON:', text);

            // Detectar error de límite PHP
            if (text.includes('POST Content-Length') || text.includes('exceeds the limit')) {
                throw new Error('El tamaño de los datos excede el límite del servidor. Reduce el número de imágenes o su tamaño.');
            }

            throw new Error('El servidor respondió con un formato inválido. Revisa la consola para más detalles.');
        }

        const data = await response.json();
        showToast(data);

        if (data.success) {
            window.globalAutocomplete?.recargarDatos();
            loadContent('/goods');
            btnClearExcelUploadUI();
        }

        progressDiv.remove();

    } catch (error) {
        console.error('Error:', error);
        showToast({
            success: false,
            message: error.message || 'Error de conexión.'
        });
        progressDiv.remove();
    }
}

// Limpiar UI
function btnClearExcelUploadUI() {
    document.getElementById('excelFileInput').value = '';
    document.getElementById('excel-preview-body').innerHTML = '';
    document.querySelector('#excel-preview-table table').classList.add('hidden');
    updateEnviarButtonState();
}

// Actualizar estado del botón enviar
function updateEnviarButtonState() {
    const btn = document.getElementById('btnEnviarExcel');
    const rowCount = document.querySelectorAll('#excel-preview-body tr').length;
    if (btn) btn.disabled = rowCount === 0;
}
