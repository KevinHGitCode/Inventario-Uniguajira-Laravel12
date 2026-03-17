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

// ── Renderizar tabla de previsualización ──────────────────────────────────────

function globalExcelRenderizarTabla(rows) {
    const tbody = document.getElementById('globalPreviewBody');
    tbody.innerHTML = '';

    rows.forEach((row, i) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #eee';

        const tipoNorm = row.tipo.toLowerCase() === 'cantidad' ? 'Cantidad' : 'Serial';

        // Indicador visual de si tiene localización
        const locBadge = row.localizacion
            ? `<span style="background:#e8f5e9; color:#1B5E20; padding:2px 6px; border-radius:4px; font-size:0.8rem;">
                   <i class="fas fa-map-marker-alt"></i> ${row.localizacion}
               </span>`
            : `<span style="color:#aaa; font-size:0.8rem;">— solo catálogo</span>`;

        tr.innerHTML = `
            <td style="padding:6px 8px;">${row.bien}</td>
            <td style="padding:6px 8px;">${tipoNorm}</td>
            <td style="padding:6px 8px;">${locBadge}</td>
            <td style="padding:6px 8px;">${tipoNorm === 'Serial' ? (row.serial || '<em style="color:#aaa">vacío</em>') : '—'}</td>
            <td style="padding:6px 8px;">${tipoNorm === 'Cantidad' ? (row.cantidad || '1') : '—'}</td>
            <td style="padding:6px 8px;">${row.marca}</td>
            <td style="padding:6px 8px;">${row.modelo}</td>
            <td style="padding:6px 8px;">${row.estado || 'activo'}</td>
            <td style="padding:6px 8px;">
                <i class="fas fa-times" style="cursor:pointer; color:#c62828;"
                   onclick="globalExcelEliminarFila(${i})" title="Eliminar fila"></i>
            </td>
        `;

        tbody.appendChild(tr);
    });

    const table = document.getElementById('globalPreviewTable');
    table.classList.remove('hidden');
    table.dataset.rows = JSON.stringify(rows);

    globalExcelActualizarBoton();
}

// ── Eliminar fila ─────────────────────────────────────────────────────────────

function globalExcelEliminarFila(idx) {
    const table = document.getElementById('globalPreviewTable');
    const rows  = JSON.parse(table.dataset.rows || '[]');
    rows.splice(idx, 1);
    globalExcelRenderizarTabla(rows);
}

// ── Enviar datos al backend ───────────────────────────────────────────────────

async function globalExcelEnviarDatos() {
    const table = document.getElementById('globalPreviewTable');
    const rows  = JSON.parse(table.dataset.rows || '[]');

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

        // Mostrar advertencias (inventarios no encontrados, seriales duplicados, etc.)
        if (data.errors && data.errors.length) {
            const list = document.getElementById('globalErrorItems');
            data.errors.forEach(err => {
                const li = document.createElement('li');
                li.textContent = err;
                list.appendChild(li);
            });
            document.getElementById('globalErrorList').style.display = 'block';
        }

        if (data.success) {
            // Recargar catálogo de bienes
            loadContent('/goods', { onSuccess: () => { if (typeof initFormsBien === 'function') initFormsBien(); } });
            globalExcelLimpiarUI();
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
    if (table) {
        table.classList.add('hidden');
        table.dataset.rows = '[]';
    }

    document.getElementById('globalErrorList').style.display = 'none';
    document.getElementById('globalErrorItems').innerHTML    = '';

    globalExcelActualizarBoton();
}

// ── Estado del botón Enviar ───────────────────────────────────────────────────

function globalExcelActualizarBoton() {
    const btn  = document.getElementById('btnEnviarExcelGlobal');
    const rows = JSON.parse(document.getElementById('globalPreviewTable')?.dataset?.rows || '[]');
    if (btn) btn.disabled = rows.length === 0;
}

// ── Exponer funciones en window (necesario para llamadas inline desde HTML) ───
window.initFormsGlobalExcel        = initFormsGlobalExcel;
window.globalExcelHandleFileUpload = globalExcelHandleFileUpload;
window.globalExcelDescargarPlantilla = globalExcelDescargarPlantilla;
window.globalExcelEliminarFila     = globalExcelEliminarFila;
window.globalExcelEnviarDatos      = globalExcelEnviarDatos;
window.globalExcelLimpiarUI        = globalExcelLimpiarUI;
