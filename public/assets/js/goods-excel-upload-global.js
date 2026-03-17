// ──────────────────────────────────────────────────────────────────────────────
// goods-excel-upload-global.js
// Carga masiva de bienes al catálogo global con asignación opcional a inventario
// via columna "Localización" (búsqueda case-insensitive en el backend)
// ──────────────────────────────────────────────────────────────────────────────

// Llamada al inicializar la vista (espejo de initFormsBien para esta página)
function initFormsGlobalExcel() {
    globalExcelLimpiarUI();
}

// ── Manejo del archivo ────────────────────────────────────────────────────────

function globalExcelHandleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.xlsx', '.xls'].includes(ext)) {
        showToast({ success: false, message: 'Formato inválido. Use .xlsx o .xls' });
        return;
    }

    globalExcelLeerArchivo(file);
}

// ── Leer y parsear Excel con SheetJS (XLSX disponible globalmente) ─────────────

function globalExcelLeerArchivo(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheet    = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

            const rows = globalExcelParsearFilas(jsonData);
            if (!rows) return; // error ya notificado

            if (!rows.length) {
                showToast({ success: false, message: 'No se encontraron datos válidos.' });
                return;
            }

            globalExcelRenderizarTabla(rows);
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

function globalExcelParsearFilas(jsonData) {
    if (!jsonData.length) return [];

    // Normalizar encabezados (quitar asteriscos, espacios y pasar a minúsculas)
    const rawHeaders = jsonData[0].map(h => String(h).toLowerCase().trim().replace(/\*/g, ''));

    // Columnas mínimas requeridas
    if (!rawHeaders.includes('bien')) {
        showToast({ success: false, message: 'El archivo debe tener al menos la columna "Bien".' });
        return null;
    }

    // Mapa flexible de columnas por nombre
    const col = (name) => rawHeaders.indexOf(name);

    const idx = {
        bien:         col('bien'),
        tipo:         col('tipo'),
        localizacion: col('localizacion') >= 0 ? col('localizacion') : col('localización'),
        serial:       col('serial'),
        cantidad:     col('cantidad'),
        marca:        col('marca'),
        modelo:       col('modelo'),
        descripcion:  col('descripcion') >= 0 ? col('descripcion') : col('descripción'),
        estado:       col('estado'),
        color:        col('color'),
        condiciones:  col('condiciones'),
        fecha:        col('fecha ingreso') >= 0 ? col('fecha ingreso') : col('fecha_ingreso'),
    };

    const rows = [];

    jsonData.slice(1).forEach((row, i) => {
        const bien = String(row[idx.bien] ?? '').trim();
        if (!bien || bien.toLowerCase() === 'n/a') return;

        rows.push({
            bien,
            tipo:         idx.tipo         >= 0 ? String(row[idx.tipo]         ?? 'Serial').trim()  : 'Serial',
            localizacion: idx.localizacion  >= 0 ? String(row[idx.localizacion] ?? '').trim()        : '',
            serial:       idx.serial        >= 0 ? String(row[idx.serial]       ?? '').trim()        : '',
            cantidad:     idx.cantidad      >= 0 ? String(row[idx.cantidad]     ?? '1').trim()       : '1',
            marca:        idx.marca         >= 0 ? String(row[idx.marca]        ?? '').trim()        : '',
            modelo:       idx.modelo        >= 0 ? String(row[idx.modelo]       ?? '').trim()        : '',
            descripcion:  idx.descripcion   >= 0 ? String(row[idx.descripcion]  ?? '').trim()        : '',
            estado:       idx.estado        >= 0 ? String(row[idx.estado]       ?? 'activo').trim()  : 'activo',
            color:        idx.color         >= 0 ? String(row[idx.color]        ?? '').trim()        : '',
            condiciones:  idx.condiciones   >= 0 ? String(row[idx.condiciones]  ?? '').trim()        : '',
            fecha_ingreso: idx.fecha        >= 0 ? String(row[idx.fecha]        ?? '').trim()        : '',
        });
    });

    return rows;
}

// ── Inyectar estilos de celdas editables (una sola vez) ───────────────────────

(function globalExcelInjectStyles() {
    if (document.getElementById('global-excel-edit-styles')) return;
    const s = document.createElement('style');
    s.id = 'global-excel-edit-styles';
    s.textContent = `
        .g-edit-cell {
            min-width: 60px; padding: 2px 5px; border-radius: 4px;
            border: 1px solid transparent; cursor: text; display: inline-block;
            width: 100%; box-sizing: border-box; font-size: 0.85rem;
        }
        .g-edit-cell:focus {
            border-color: #1B5E20; background: #f0faf0;
            outline: none; box-shadow: 0 0 0 2px #c8e6c9;
        }
        .g-edit-cell:hover { border-color: #ccc; }
        .g-edit-cell-disabled {
            min-width: 60px; padding: 2px 5px; font-size: 0.85rem;
            color: #bbb; font-style: italic;
        }
        .g-edit-select {
            border: 1px solid #ddd; border-radius: 4px;
            padding: 2px 4px; font-size: 0.82rem; background: #fff;
            cursor: pointer; width: 100%;
        }
        .g-edit-select:focus { border-color: #1B5E20; outline: none; }
        #globalPreviewBody tr:hover td { background: #fafafa; }
        #globalPreviewBody tr.loc-error td { background: #fff3f3; }
        #globalPreviewBody tr.loc-error .g-edit-cell[data-field="localizacion"] {
            border-color: #c62828; background: #ffebee;
        }
    `;
    document.head.appendChild(s);
})();

// ── Renderizar tabla de previsualización (celdas editables) ───────────────────

function globalExcelRenderizarTabla(rows) {
    const tbody = document.getElementById('globalPreviewBody');
    tbody.innerHTML = '';

    rows.forEach((row) => {
        const tipoNorm  = row.tipo.toLowerCase() === 'cantidad' ? 'Cantidad' : 'Serial';
        const esSerial  = tipoNorm === 'Serial';
        const estadoVal = row.estado === 'inactivo' ? 'inactivo' : 'activo';

        // Serial editable solo si tipo Serial; Cantidad editable solo si tipo Cantidad
        const serialCell   = esSerial
            ? `<div class="g-edit-cell" contenteditable="plaintext-only" data-field="serial">${row.serial ?? ''}</div>`
            : `<span class="g-edit-cell-disabled" data-field="serial">—</span>`;

        const cantidadCell = !esSerial
            ? `<div class="g-edit-cell" contenteditable="plaintext-only" data-field="cantidad">${row.cantidad || '1'}</div>`
            : `<span class="g-edit-cell-disabled" data-field="cantidad">—</span>`;

        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #eee';

        tr.innerHTML = `
            <td style="padding:4px 6px;">
                <div class="g-edit-cell" contenteditable="plaintext-only" data-field="bien">${row.bien}</div>
            </td>
            <td style="padding:4px 6px;">
                <span data-field="tipo" style="font-size:0.85rem;">${tipoNorm}</span>
            </td>
            <td style="padding:4px 6px;">
                <div class="g-edit-cell" contenteditable="plaintext-only" data-field="localizacion"
                     title="Nombre del inventario (opcional)">${row.localizacion ?? ''}</div>
            </td>
            <td style="padding:4px 6px;">${serialCell}</td>
            <td style="padding:4px 6px;">${cantidadCell}</td>
            <td style="padding:4px 6px;">
                <div class="g-edit-cell" contenteditable="plaintext-only" data-field="marca">${row.marca ?? ''}</div>
            </td>
            <td style="padding:4px 6px;">
                <div class="g-edit-cell" contenteditable="plaintext-only" data-field="modelo">${row.modelo ?? ''}</div>
            </td>
            <td style="padding:4px 6px;">
                <select class="g-edit-select" data-field="estado">
                    <option value="activo"   ${estadoVal === 'activo'   ? 'selected' : ''}>activo</option>
                    <option value="inactivo" ${estadoVal === 'inactivo' ? 'selected' : ''}>inactivo</option>
                </select>
            </td>
            <td style="padding:4px 10px; text-align:center;">
                <i class="fas fa-times" style="cursor:pointer; color:#c62828;"
                   onclick="globalExcelEliminarFila(this)" title="Eliminar fila"></i>
            </td>
        `;

        tbody.appendChild(tr);
    });

    document.getElementById('globalPreviewTable').classList.remove('hidden');
    globalExcelActualizarBoton();
}

// ── Leer filas desde el DOM (respeta ediciones manuales) ─────────────────────

function globalExcelLeerFilasDeDOM() {
    const tbody = document.getElementById('globalPreviewBody');
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
            localizacion: get('localizacion'),
            serial:       esSerial  ? get('serial')            : null,
            cantidad:     !esSerial ? (get('cantidad') || '1') : null,
            marca:        get('marca'),
            modelo:       get('modelo'),
            estado:       get('estado'),
        });
    });

    return rows;
}

// ── Resaltar filas con localización no encontrada ─────────────────────────────

function globalExcelResaltarErroresLocalizacion(errors) {
    const tbody = document.getElementById('globalPreviewBody');
    if (!tbody) return;

    // Limpia resaltados previos
    tbody.querySelectorAll('tr.loc-error').forEach(tr => tr.classList.remove('loc-error'));

    errors.forEach(err => {
        // El backend devuelve: "Fila X: inventario 'nombre' no encontrado ..."
        const match = err.match(/inventario '([^']+)' no encontrado/i);
        if (!match) return;

        const locFallida = match[1].toLowerCase().trim();

        tbody.querySelectorAll('tr').forEach(tr => {
            const locEl = tr.querySelector('[data-field="localizacion"]');
            if (locEl && locEl.textContent.trim().toLowerCase() === locFallida) {
                tr.classList.add('loc-error');
                locEl.title = `"${match[1]}" no existe en el sistema`;
            }
        });
    });
}

// ── Eliminar fila ─────────────────────────────────────────────────────────────

function globalExcelEliminarFila(btn) {
    btn.closest('tr').remove();
    globalExcelActualizarBoton();
}

// ── Enviar datos al backend ───────────────────────────────────────────────────

async function globalExcelEnviarDatos() {
    const rows = globalExcelLeerFilasDeDOM();

    if (!rows.length) return;

    const btn = document.getElementById('btnEnviarExcelGlobal');
    btn.disabled  = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    document.getElementById('globalErrorList').style.display = 'none';
    document.getElementById('globalErrorItems').innerHTML    = '';

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        const response  = await fetch('/api/goods/batchCreateGlobal', {
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

        // Mostrar advertencias y resaltar filas con localización no encontrada
        if (data.errors && data.errors.length) {
            const list = document.getElementById('globalErrorItems');
            const locErrors = [];

            data.errors.forEach(err => {
                const li = document.createElement('li');
                li.textContent = err;
                // Resalta en rojo las filas cuya localización no existe
                if (/no encontrado/i.test(err)) {
                    li.style.fontWeight = 'bold';
                    locErrors.push(err);
                }
                list.appendChild(li);
            });

            document.getElementById('globalErrorList').style.display = 'block';
            if (locErrors.length) globalExcelResaltarErroresLocalizacion(locErrors);
        }

        if (data.success) {
            // Solo redirige si no hubo errores de localización (filas corregibles visibles)
            const tieneLocErrors = (data.errors || []).some(e => /no encontrado/i.test(e));
            if (!tieneLocErrors) {
                loadContent('/goods', { onSuccess: () => { if (typeof initFormsBien === 'function') initFormsBien(); } });
                globalExcelLimpiarUI();
            }
        }

    } catch (err) {
        console.error(err);
        showToast({ success: false, message: 'Error de conexión.' });
    } finally {
        btn.disabled  = false;
        btn.innerHTML = 'Enviar';
        globalExcelActualizarBoton();
    }
}

// ── Descargar plantilla ───────────────────────────────────────────────────────
// Genera el Excel en el cliente con SheetJS (sin petición al servidor)

function globalExcelDescargarPlantilla() {
    const wb = XLSX.utils.book_new();

    const headers = [
        'Bien', 'Tipo', 'Localizacion', 'Serial', 'Cantidad',
        'Marca', 'Modelo', 'Descripcion', 'Estado', 'Color', 'Condiciones', 'Fecha Ingreso'
    ];

    const ejemplos = [
        ['AIRE ACONDICIONADO MINI SPLIT', 'Serial',   'Sala de Sistemas',  'ABC-001', '',  'Samsung', 'AS24UBAN', '', 'activo', 'Blanco', 'Buen estado', new Date().toISOString().split('T')[0]],
        ['SILLA ERGONOMICA',              'Cantidad',  'Sala de Profesores', '',       '5', 'Rimax',   '',          '', '',       '',        '',            ''],
        ['COMPUTADOR PORTATIL',           'Serial',   '',                  'XYZ-002', '',  'Lenovo',  'ThinkPad',  '', 'activo', 'Negro',  '',            ''],
    ];

    const wsData = [headers, ...ejemplos];
    const ws     = XLSX.utils.aoa_to_sheet(wsData);

    // Ancho de columnas
    ws['!cols'] = [
        {wch:30},{wch:12},{wch:25},{wch:18},{wch:10},
        {wch:16},{wch:16},{wch:25},{wch:18},{wch:12},{wch:25},{wch:14}
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
    XLSX.writeFile(wb, 'Plantilla_Carga_Global.xlsx');
}

// ── Limpiar UI ────────────────────────────────────────────────────────────────

function globalExcelLimpiarUI() {
    const input = document.getElementById('globalExcelFileInput');
    if (input) input.value = '';

    const tbody = document.getElementById('globalPreviewBody');
    if (tbody) tbody.innerHTML = '';

    const table = document.getElementById('globalPreviewTable');
    if (table) table.classList.add('hidden');

    document.getElementById('globalErrorList').style.display = 'none';
    document.getElementById('globalErrorItems').innerHTML    = '';

    globalExcelActualizarBoton();
}

// ── Estado del botón Enviar ───────────────────────────────────────────────────

function globalExcelActualizarBoton() {
    const btn   = document.getElementById('btnEnviarExcelGlobal');
    const count = document.getElementById('globalPreviewBody')?.querySelectorAll('tr').length ?? 0;
    if (btn) btn.disabled = count === 0;
}

// ── Exponer funciones en window (necesario para llamadas inline desde HTML) ───
window.initFormsGlobalExcel        = initFormsGlobalExcel;
window.globalExcelHandleFileUpload = globalExcelHandleFileUpload;
window.globalExcelDescargarPlantilla = globalExcelDescargarPlantilla;
window.globalExcelEliminarFila     = globalExcelEliminarFila;
window.globalExcelEnviarDatos      = globalExcelEnviarDatos;
window.globalExcelLimpiarUI        = globalExcelLimpiarUI;
