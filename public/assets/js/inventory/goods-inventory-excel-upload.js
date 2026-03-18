// ──────────────────────────────────────────────────────────────────────────────
// goods-inventory-excel-upload.js
// Carga masiva de bienes a un inventario específico desde Excel
// ──────────────────────────────────────────────────────────────────────────────

const INV_EXCEL_CONFIG = {
    validTypes:      ['.xlsx', '.xls'],
    requiredHeaders: ['bien', 'tipo'],
    validEstados:    ['activo', 'inactivo', 'en_mantenimiento'],
};

// Navega a la vista de carga Excel del inventario actual
function btnAbrirModalExcelInventario() {
    const inventory = document.getElementById('inventory-name');
    if (!inventory) return;

    const groupId = inventory.getAttribute('data-group-id');
    const inventoryId = inventory.getAttribute('data-id');

    loadContent(
        `/group/${groupId}/inventory/${inventoryId}/excel-upload`,
        { onSuccess: () => invLimpiarUI() }
    );
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

// ── Inyectar estilos de celdas editables (una sola vez) ───────────────────────

(function invExcelInjectStyles() {
    if (document.getElementById('inv-excel-edit-styles')) return;
    const s = document.createElement('style');
    s.id = 'inv-excel-edit-styles';
    s.textContent = `
        .i-edit-cell {
            min-width: 55px; padding: 2px 5px; border-radius: 4px;
            border: 1px solid transparent; cursor: text; display: inline-block;
            width: 100%; box-sizing: border-box; font-size: 0.83rem;
        }
        .i-edit-cell:focus {
            border-color: #1B5E20; background: #f0faf0;
            outline: none; box-shadow: 0 0 0 2px #c8e6c9;
        }
        .i-edit-cell:hover { border-color: #ccc; }
        .i-edit-cell-disabled {
            min-width: 55px; padding: 2px 5px; font-size: 0.83rem;
            color: #bbb; font-style: italic;
        }
        .i-edit-select {
            border: 1px solid #ddd; border-radius: 4px;
            padding: 2px 4px; font-size: 0.82rem; background: #fff;
            cursor: pointer; width: 100%;
        }
        .i-edit-select:focus { border-color: #1B5E20; outline: none; }
        #invPreviewBody tr:hover td { background: #fafafa; }
    `;
    document.head.appendChild(s);
})();

// ── Renderizar tabla de previsualización (celdas editables) ───────────────────

function invRenderizarTabla(rows) {
    const tbody = document.getElementById('invPreviewBody');
    tbody.innerHTML = '';

    rows.forEach((row) => {
        const tipoNorm = row.tipo.toLowerCase() === 'cantidad' ? 'Cantidad' : 'Serial';
        const esSerial = tipoNorm === 'Serial';
        const estadoVal = row.estado === 'inactivo' ? 'inactivo' : 'activo';

        // Serial editable solo si tipo Serial; Cantidad editable solo si tipo Cantidad
        const serialCell   = esSerial
            ? `<div class="i-edit-cell" contenteditable="plaintext-only" data-field="serial">${row.serial ?? ''}</div>`
            : `<span class="i-edit-cell-disabled" data-field="serial">—</span>`;

        const cantidadCell = !esSerial
            ? `<div class="i-edit-cell" contenteditable="plaintext-only" data-field="cantidad">${row.cantidad || '1'}</div>`
            : `<span class="i-edit-cell-disabled" data-field="cantidad">—</span>`;

        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #eee';

        tr.innerHTML = `
            <td style="padding:4px 6px;">
                <div class="i-edit-cell" contenteditable="plaintext-only" data-field="bien">${row.bien}</div>
            </td>
            <td style="padding:4px 6px;">
                <span data-field="tipo" style="font-size:0.83rem;">${tipoNorm}</span>
            </td>
            <td style="padding:4px 6px;">${serialCell}</td>
            <td style="padding:4px 6px;">${cantidadCell}</td>
            <td style="padding:4px 6px;">
                <div class="i-edit-cell" contenteditable="plaintext-only" data-field="marca">${row.marca ?? ''}</div>
            </td>
            <td style="padding:4px 6px;">
                <div class="i-edit-cell" contenteditable="plaintext-only" data-field="modelo">${row.modelo ?? ''}</div>
            </td>
            <td style="padding:4px 6px;">
                <select class="i-edit-select" data-field="estado">
                    <option value="activo"   ${estadoVal === 'activo'   ? 'selected' : ''}>activo</option>
                    <option value="inactivo" ${estadoVal === 'inactivo' ? 'selected' : ''}>inactivo</option>
                </select>
            </td>
            <td style="padding:4px 10px; text-align:center;">
                <i class="fas fa-times" style="cursor:pointer; color:#c62828;"
                   onclick="invEliminarFila(this)" title="Eliminar fila"></i>
            </td>
        `;

        tbody.appendChild(tr);
    });

    document.getElementById('invPreviewTable').classList.remove('hidden');
    invActualizarBotonEnviar();
}

// ── Leer filas desde el DOM (respeta ediciones manuales) ─────────────────────

function invLeerFilasDeDOM() {
    const tbody = document.getElementById('invPreviewBody');
    const rows  = [];

    tbody.querySelectorAll('tr').forEach(tr => {
        const get = field => {
            const el = tr.querySelector(`[data-field="${field}"]`);
            if (!el) return '';
            return el.tagName === 'SELECT' ? el.value : el.textContent.trim();
        };

        const bien = get('bien');
        if (!bien) return;

        const tipo    = get('tipo'); // texto fijo: 'Serial' o 'Cantidad'
        const esSerial = tipo === 'Serial';

        rows.push({
            bien,
            tipo,
            serial:   esSerial  ? get('serial')            : null,
            cantidad: !esSerial ? (get('cantidad') || '1') : null,
            marca:    get('marca'),
            modelo:   get('modelo'),
            estado:   get('estado'),
        });
    });

    return rows;
}

// ── Eliminar fila de la previsualización ─────────────────────────────────────

function invEliminarFila(btn) {
    btn.closest('tr').remove();
    invActualizarBotonEnviar();
}

// ── Enviar datos al backend ───────────────────────────────────────────────────

async function invEnviarDatos() {
    const rows        = invLeerFilasDeDOM();
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
    if (table) table.classList.add('hidden');

    document.getElementById('invErrorList').style.display = 'none';
    document.getElementById('invErrorItems').innerHTML    = '';

    invActualizarBotonEnviar();
}

// ── Estado del botón Enviar ───────────────────────────────────────────────────

function invActualizarBotonEnviar() {
    const btn   = document.getElementById('btnEnviarExcelInventario');
    const count = document.getElementById('invPreviewBody')?.querySelectorAll('tr').length ?? 0;
    if (btn) btn.disabled = count === 0;
}
