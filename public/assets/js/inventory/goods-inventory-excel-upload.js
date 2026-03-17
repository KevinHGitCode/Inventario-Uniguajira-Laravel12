// ──────────────────────────────────────────────────────────────────────────────
// goods-inventory-excel-upload.js
// Carga masiva de bienes a un inventario específico desde Excel
// ──────────────────────────────────────────────────────────────────────────────

const INV_EXCEL_CONFIG = {
    validTypes:      ['.xlsx', '.xls'],
    requiredHeaders: ['bien', 'tipo'],
    validEstados:    ['activo', 'inactivo', 'en_mantenimiento'],
};

// Abre el modal y limpia estado anterior
function btnAbrirModalExcelInventario() {
    invLimpiarUI();
    mostrarModal('#modalExcelInventario');
}

// ── Manejo del archivo ────────────────────────────────────────────────────────

function invHandleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!INV_EXCEL_CONFIG.validTypes.includes(ext)) {
        showToast({ success: false, message: 'Formato inválido. Use .xlsx o .xls' });
        return;
    }

    invLeerExcel(file);
}

// ── Leer y parsear Excel con SheetJS ─────────────────────────────────────────

function invLeerExcel(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const workbook  = XLSX.read(e.target.result, { type: 'binary' });
            const sheet     = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData  = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

            const rows = invParsearFilas(jsonData);
            if (!rows.length) {
                showToast({ success: false, message: 'No se encontraron datos válidos.' });
                return;
            }

            invRenderizarTabla(rows);
            showToast({ success: true, message: `${rows.length} fila(s) lista(s) para enviar.` });
        } catch (err) {
            console.error(err);
            showToast({ success: false, message: 'Error al leer el archivo Excel.' });
        }
    };

    reader.onerror = () => showToast({ success: false, message: 'Error al leer el archivo.' });
    reader.readAsBinaryString(file);
}

// ── Parsear filas ─────────────────────────────────────────────────────────────

function invParsearFilas(jsonData) {
    if (!jsonData.length) return [];

    // Normalizar encabezados (quitar asteriscos, espacios y pasar a minúsculas)
    const rawHeaders = jsonData[0].map(h => String(h).toLowerCase().trim().replace(/\*/g, ''));

    // Columnas requeridas
    const hasRequired = INV_EXCEL_CONFIG.requiredHeaders.every(h => rawHeaders.includes(h));
    if (!hasRequired) {
        showToast({
            success: false,
            message: `El archivo debe tener al menos las columnas: ${INV_EXCEL_CONFIG.requiredHeaders.join(', ')}`
        });
        return [];
    }

    // Índices de columnas (flexibles: busca por nombre)
    const idx = {
        bien:        rawHeaders.indexOf('bien'),
        tipo:        rawHeaders.indexOf('tipo'),
        serial:      rawHeaders.indexOf('serial'),
        cantidad:    rawHeaders.indexOf('cantidad'),
        marca:       rawHeaders.indexOf('marca'),
        modelo:      rawHeaders.indexOf('modelo'),
        descripcion: rawHeaders.indexOf('descripcion'),
        estado:      rawHeaders.indexOf('estado'),
        color:       rawHeaders.indexOf('color'),
        condiciones: rawHeaders.indexOf('condiciones'),
        fecha:       rawHeaders.indexOf('fecha ingreso'),
    };

    const rows = [];

    jsonData.slice(1).forEach((row, i) => {
        const bien = String(row[idx.bien] ?? '').trim();
        if (!bien || bien.toLowerCase() === 'n/a') return;

        const tipo = String(row[idx.tipo] ?? 'Serial').trim();

        rows.push({
            bien,
            tipo,
            serial:      idx.serial      >= 0 ? String(row[idx.serial]      ?? '').trim() : '',
            cantidad:    idx.cantidad     >= 0 ? String(row[idx.cantidad]     ?? '1').trim() : '1',
            marca:       idx.marca        >= 0 ? String(row[idx.marca]        ?? '').trim() : '',
            modelo:      idx.modelo       >= 0 ? String(row[idx.modelo]       ?? '').trim() : '',
            descripcion: idx.descripcion  >= 0 ? String(row[idx.descripcion]  ?? '').trim() : '',
            estado:      idx.estado       >= 0 ? String(row[idx.estado]       ?? 'activo').trim() : 'activo',
            color:       idx.color        >= 0 ? String(row[idx.color]        ?? '').trim() : '',
            condiciones: idx.condiciones  >= 0 ? String(row[idx.condiciones]  ?? '').trim() : '',
            fecha_ingreso: idx.fecha      >= 0 ? String(row[idx.fecha]        ?? '').trim() : '',
            _rowNum: i + 2, // para mensajes de error (fila en Excel = dato + 2)
        });
    });

    return rows;
}

// ── Renderizar tabla de previsualización ──────────────────────────────────────

function invRenderizarTabla(rows) {
    const tbody = document.getElementById('invPreviewBody');
    tbody.innerHTML = '';

    rows.forEach((row, i) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #eee';
        tr.dataset.rowIndex   = i;

        const tipoNorm = row.tipo.toLowerCase() === 'cantidad' ? 'Cantidad' : 'Serial';
        const principal = tipoNorm === 'Serial'
            ? (row.serial   || '<span style="color:#999">—</span>')
            : (row.cantidad || '1');

        tr.innerHTML = `
            <td style="padding:6px 8px;">${row.bien}</td>
            <td style="padding:6px 8px;">${tipoNorm}</td>
            <td style="padding:6px 8px;">${tipoNorm === 'Serial' ? (row.serial || '<em style="color:#aaa">vacío</em>') : '—'}</td>
            <td style="padding:6px 8px;">${tipoNorm === 'Cantidad' ? (row.cantidad || '1') : '—'}</td>
            <td style="padding:6px 8px;">${row.marca}</td>
            <td style="padding:6px 8px;">${row.modelo}</td>
            <td style="padding:6px 8px;">${row.estado || 'activo'}</td>
            <td style="padding:6px 8px;">
                <i class="fas fa-times" style="cursor:pointer; color:#c62828;"
                   onclick="invEliminarFila(this, ${i})" title="Eliminar fila"></i>
            </td>
        `;

        tbody.appendChild(tr);
    });

    document.getElementById('invPreviewTable').classList.remove('hidden');
    invActualizarBotonEnviar();

    // Guardar datos en el DOM para acceso al enviar
    document.getElementById('invPreviewTable').dataset.rows = JSON.stringify(rows);
}

// ── Eliminar fila de la previsualización ─────────────────────────────────────

function invEliminarFila(btn, idx) {
    const table   = document.getElementById('invPreviewTable');
    const rows    = JSON.parse(table.dataset.rows || '[]');
    rows.splice(idx, 1);
    invRenderizarTabla(rows);
}

// ── Enviar datos al backend ───────────────────────────────────────────────────

async function invEnviarDatos() {
    const table      = document.getElementById('invPreviewTable');
    const rows       = JSON.parse(table.dataset.rows || '[]');
    const inventoryId = document.getElementById('inventory-name')?.getAttribute('data-id');

    if (!rows.length || !inventoryId) return;

    const btn = document.getElementById('btnEnviarExcelInventario');
    btn.disabled  = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    // Ocultar errores previos
    document.getElementById('invErrorList').style.display = 'none';
    document.getElementById('invErrorItems').innerHTML    = '';

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        const response  = await fetch(`/api/goods-inventory/batchCreate/${inventoryId}`, {
            method:  'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Content-Type': 'application/json',
                'Accept':       'application/json',
            },
            body: JSON.stringify({ rows }),
        });

        const data = await response.json();
        showToast(data);

        // Mostrar errores parciales si los hay
        if (data.errors && data.errors.length) {
            const list = document.getElementById('invErrorItems');
            data.errors.forEach(err => {
                const li = document.createElement('li');
                li.textContent = err;
                list.appendChild(li);
            });
            document.getElementById('invErrorList').style.display = 'block';
        }

        if (data.success) {
            // Recargar la vista del inventario
            const groupId = document.getElementById('inventory-name')?.getAttribute('data-group-id');
            ocultarModal('#modalExcelInventario');
            loadContent(
                `/group/${groupId}/inventory/${inventoryId}`,
                { onSuccess: () => initGoodsInventoryFunctions() }
            );
        }

    } catch (err) {
        console.error(err);
        showToast({ success: false, message: 'Error de conexión.' });
    } finally {
        btn.disabled  = false;
        btn.innerHTML = 'Enviar';
        invActualizarBotonEnviar();
    }
}

// ── Descargar plantilla ───────────────────────────────────────────────────────

function descargarPlantillaInventario() {
    window.location.href = '/api/goods-inventory/download-template';
}

// ── Limpiar UI ────────────────────────────────────────────────────────────────

function invLimpiarUI() {
    const fileInput = document.getElementById('invExcelFileInput');
    if (fileInput) fileInput.value = '';

    const tbody = document.getElementById('invPreviewBody');
    if (tbody) tbody.innerHTML = '';

    const table = document.getElementById('invPreviewTable');
    if (table) {
        table.classList.add('hidden');
        table.dataset.rows = '[]';
    }

    document.getElementById('invErrorList').style.display = 'none';
    document.getElementById('invErrorItems').innerHTML    = '';

    invActualizarBotonEnviar();
}

// ── Estado del botón Enviar ───────────────────────────────────────────────────

function invActualizarBotonEnviar() {
    const btn  = document.getElementById('btnEnviarExcelInventario');
    const rows = JSON.parse(document.getElementById('invPreviewTable')?.dataset?.rows || '[]');
    if (btn) btn.disabled = rows.length === 0;
}
