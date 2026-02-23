// scripts boton reporte---------------------------->>>>>>>
function generatePDF() {

    let jsPDF;
    if (window.jspdf && window.jspdf.jsPDF) {
        jsPDF = window.jspdf.jsPDF;
    } else if (window.jsPDF) {
        jsPDF = window.jsPDF;
    } else {
        alert('Error: No se puede acceder a jsPDF');
        return;
    }

    try {
        const doc = new jsPDF();

        // Cargar la imagen
        const img = new Image();
        img.src = 'assets/images/logoUniguajira.png'; // Ruta de la imagen

        img.onload = function() {
            // Agregar imagen al encabezado
            doc.addImage(img, 'WEBP', 10, 10, 50, 20);

            const titleY = 45;
            doc.setFontSize(16);
            doc.text('Reporte de Historial', 20, titleY);
            doc.setFontSize(12);
            doc.text('Fecha de generación: ' + new Date().toLocaleDateString(), 20, titleY + 15);

            const table = document.querySelector('.record-table');
            if (!table) {
                console.error('No se encontró la tabla de historial.');
                showToast({ 
                    success: false, 
                    message: 'Error: No se encontró la tabla de historial.' 
                });
                return;
            }

            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
            
            // CAMBIO PRINCIPAL: Solo incluir filas visibles (no ocultas por filtros)
            const visibleRows = Array.from(table.querySelectorAll('tbody tr')).filter(row => {
                return row.style.display !== 'none'; // Solo filas que no están ocultas
            });

            const rows = visibleRows.map(row => {
                return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim());
            });

            // Agregar información sobre filtros aplicados
            let filterInfo = '';
            const totalRows = table.querySelectorAll('tbody tr').length;
            const visibleRowsCount = visibleRows.length;
            
            if (visibleRowsCount < totalRows) {
                filterInfo = `Registros mostrados: ${visibleRowsCount} de ${totalRows} (filtros aplicados)`;
                doc.setFontSize(10);
                doc.text(filterInfo, 20, titleY + 25);
            }

            // Agregar información de filtros de fecha si están aplicados
            const dateFrom = document.getElementById('dateFrom').value;
            const dateTo = document.getElementById('dateTo').value;
            if (dateFrom || dateTo) {
                let dateFilterText = 'Filtro de fechas: ';
                if (dateFrom && dateTo) {
                    dateFilterText += `${dateFrom} a ${dateTo}`;
                } else if (dateFrom) {
                    dateFilterText += `desde ${dateFrom}`;
                } else {
                    dateFilterText += `hasta ${dateTo}`;
                }
                doc.setFontSize(10);
                doc.text(dateFilterText, 20, titleY + (filterInfo ? 35 : 25));
            }

            // Verificar si hay datos para mostrar
            if (rows.length === 0) {
                doc.setFontSize(12);
                doc.text('No hay registros que coincidan con los filtros aplicados.', 20, titleY + 40);
            } else {
                doc.autoTable({
                    head: [headers],
                    body: rows,
                    startY: titleY + (filterInfo || (dateFrom || dateTo) ? 45 : 30),
                });
            }

            doc.save('historial_reporte.pdf');
            console.log('✅ PDF generado exitosamente con filtros aplicados');
            showToast({ 
                success: true, 
                message: 'PDF generado exitosamente' 
            });
        };

        img.onerror = function() {
            console.error('❌ Error al cargar la imagen.');
            showToast({ 
                success: false, 
                message: 'Error al cargar la imagen del logo' 
            });
        };

    } catch (error) {
        console.error('❌ Error al generar PDF:', error);
        showToast({ 
            success: false, 
            message: 'Error al generar PDF: ' + error.message 
        });
    }
}