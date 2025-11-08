// Objeto que almacenará los datos de grupos e inventarios
const datosInventarios = {
    grupos: [],
    inventariosPorGrupo: {}
};

// Función para cargar los grupos cuando se abre el modal
function cargarGrupos() {
    // Si ya tenemos los grupos en caché, no hacer petición nuevamente
    if (datosInventarios.grupos.length > 0) {
        return Promise.resolve(datosInventarios.grupos);
    }
    
    // Hacer una petición AJAX para obtener los grupos
    return fetch('/api/groups/getAll')
        .then(response => response.json())
        .then(data => {
            datosInventarios.grupos = data;
            
            // Array con los IDs de ambos selects de grupos
            const selectGruposIds = ['grupoSeleccionado', 'grupoSeleccionadoOfGrupo'];
            
            // Llenar ambos selects de grupos
            selectGruposIds.forEach(selectId => {
                const selectGrupos = document.getElementById(selectId);
                if (selectGrupos) {
                    selectGrupos.innerHTML = '<option value="">Seleccione un grupo</option>';
                    
                    data.forEach(grupo => {
                        const option = document.createElement('option');
                        option.value = grupo.id;
                        option.textContent = grupo.nombre;
                        selectGrupos.appendChild(option);
                    });
                }
            });
            
            return data;
        })
        .catch(error => {
            console.error('Error al cargar los grupos:', error);
            alert('Error al cargar los grupos. Por favor, inténtelo de nuevo.');
            throw error;
        });
}

// Función para cargar los inventarios de un grupo específico
function cargarInventariosPorGrupo(grupoId) {
    // Si ya tenemos los inventarios de este grupo en caché, los usamos
    if (datosInventarios.inventariosPorGrupo[grupoId]) {
        actualizarSelectInventarios(datosInventarios.inventariosPorGrupo[grupoId]);
        return;
    }
    
    // Si no, hacemos la petición para obtenerlos
    fetch(`/api/inventories/getByGroupId/${grupoId}`)
        .then(response => response.json())
        .then(data => {
            // Guardar en caché
            datosInventarios.inventariosPorGrupo[grupoId] = data;
            
            // Actualizar el select
            actualizarSelectInventarios(data);
        })
        .catch(error => {
            console.error('Error al cargar los inventarios:', error);
            alert('Error al cargar los inventarios. Por favor, inténtelo de nuevo.');
        });
}

// Función para actualizar el select de inventarios
function actualizarSelectInventarios(inventarios) {
    const selectInventarios = document.getElementById('inventarioSeleccionado');
    
    // Habilitar el select si hay inventarios
    if (inventarios && inventarios.length > 0) {
        selectInventarios.disabled = false;
        
        // Limpiar opciones anteriores
        selectInventarios.innerHTML = '<option value="">Seleccione un inventario</option>';
        
        // Añadir nuevas opciones
        inventarios.forEach(inventario => {
            const option = document.createElement('option');
            option.value = inventario.id;
            option.textContent = inventario.nombre;
            selectInventarios.appendChild(option);
        });
    } else {
        // Si no hay inventarios, deshabilitar y mostrar mensaje
        selectInventarios.disabled = true;
        selectInventarios.innerHTML = '<option value="">No hay inventarios disponibles para este grupo</option>';
    }
}

// Función que se llama cuando se abre cualquier modal de reportes
function inicializarModalReporte(modalId) {
    // Cargar grupos automáticamente cuando se abre cualquier modal
    cargarGrupos();
    
    // Si es el modal de inventario, resetear el select de inventarios
    if (modalId === '#modalCrearReporteDeUnInventario') {
        const selectInventarios = document.getElementById('inventarioSeleccionado');
        if (selectInventarios) {
            selectInventarios.disabled = true;
            selectInventarios.innerHTML = '<option value="">Primero seleccione un grupo</option>';
        }
    }
}

// Función para inicializar los formularios de reportes
function initFormsReporte() {
    // Inicializar formulario de reporte de inventario
    inicializarFormularioAjax('#formReporteDeUnInventario', {
        resetOnSuccess: true,
        closeModalOnSuccess: true,
        customBody: (form) => {
            const formData = new FormData(form);
            formData.set('nombreReporte', document.getElementById('nombreReporte').value);
            formData.set('tipoReporte', 'inventario');
            formData.set('folder_id', currentFolderId || document.getElementById('folderIdInventario')?.value);
            return formData;
        },
        onSuccess: (response) => {
            showToast(response);
            if (currentFolderId) {
                abrirCarpeta(currentFolderId, false);
            }
        }
    });

    // Inicializar formulario de reporte de grupo
    inicializarFormularioAjax('#formReporteDeUnGrupo', {
        resetOnSuccess: true,
        closeModalOnSuccess: true,
        customBody: (form) => {
            const formData = new FormData(form);
            formData.set('nombreReporte', document.getElementById('nombreReporteOfGrupo').value);
            formData.set('tipoReporte', 'grupo');
            formData.set('folder_id', currentFolderId || document.getElementById('folderIdGrupo')?.value);
            return formData;
        },
        onSuccess: (response) => {
            showToast(response);
            if (currentFolderId) {
                abrirCarpeta(currentFolderId, false);
            }
        }
    });

    // Inicializar formulario de reporte de todos los inventarios
    inicializarFormularioAjax('#formReporteDeTodosLosInventarios', {
        resetOnSuccess: true,
        closeModalOnSuccess: true,
        customBody: (form) => {
            const formData = new FormData(form);
            formData.set('nombreReporte', document.getElementById('nombreReporteDeTodosLosInventarios').value);
            formData.set('tipoReporte', 'allInventories');
            formData.set('folder_id', currentFolderId || document.getElementById('folderIdTodosLosInventarios')?.value);
            return formData;
        },
        onSuccess: (response) => {
            showToast(response);
            if (currentFolderId) {
                abrirCarpeta(currentFolderId, false);
            }
        }
    });

    // Inicializar formulario de reporte de bienes
    inicializarFormularioAjax('#formReporteDeBienes', {
        resetOnSuccess: true,
        closeModalOnSuccess: true,
        customBody: (form) => {
            const formData = new FormData(form);
            formData.set('nombreReporte', document.getElementById('nombreReporteDeBienes').value);
            formData.set('tipoReporte', 'goods');
            formData.set('folder_id', currentFolderId || document.getElementById('folderIdDeBienes')?.value);
            return formData;
        },
        onSuccess: (response) => {
            showToast(response);
            if (currentFolderId) {
                abrirCarpeta(currentFolderId, false);
            }
        }
    });

    // Inicializar formulario de reporte de equipos
    inicializarFormularioAjax('#formReporteDeEquipos', {
        resetOnSuccess: true,
        closeModalOnSuccess: true,
        customBody: (form) => {
            const formData = new FormData(form);
            formData.set('nombreReporte', document.getElementById('nombreReporteDeEquipos').value);
            formData.set('tipoReporte', 'serial');
            formData.set('folder_id', currentFolderId || document.getElementById('folderIdDeEquipos')?.value);
            return formData;
        },
        onSuccess: (response) => {
            showToast(response);
            if (currentFolderId) {
                abrirCarpeta(currentFolderId, false);
            }
        }
    });
}

// Configurar event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para cuando cambia el grupo seleccionado (solo para modal de inventario)
    const selectGrupo = document.getElementById('grupoSeleccionado');
    if (selectGrupo) {
        selectGrupo.addEventListener('change', function() {
            const grupoId = this.value;
            const selectInventarios = document.getElementById('inventarioSeleccionado');
            
            if (grupoId) {
                cargarInventariosPorGrupo(grupoId);
            } else {
                // Si no hay grupo seleccionado, deshabilitar el select de inventarios
                selectInventarios.disabled = true;
                selectInventarios.innerHTML = '<option value="">Primero seleccione un grupo</option>';
            }
        });
    }
    
    // Inicializar formularios de reportes
    initFormsReporte();
});

function mostrarModalReporte(modalId) {
    if (!currentFolderId) {
        alert('Error: Debes estar dentro de una carpeta para crear reportes');
        return;
    }
    
    // Asegurar que los campos folder_id están actualizados antes de mostrar el modal
    updateAllFolderIdFields(currentFolderId);
    
    // Mostrar el modal
    mostrarModal(modalId);
}


function downloadReport(reportId, reportName) {
    // Prevenir la propagación del evento para evitar conflictos con el onclick del card
    event.stopPropagation();
    
    // Mostrar indicador de carga
    const button = event.target.closest('button');
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Descargando...';
    button.disabled = true;
    
    // Hacer petición fetch para descargar el reporte
    const formData = new FormData();
    formData.append('report_id', reportId);
    
    return fetch('/api/reports/download', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.blob();
    })
    .then(blob => {
        // Crear URL del blob y descargar
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportName}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Limpiar recursos
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return true;
    })
    .catch(error => {
        console.error('Error al descargar el reporte:', error);
        alert('Error al descargar el reporte. Por favor, inténtelo de nuevo.');
        throw error;
    })
    .finally(() => {
        // Restaurar botón
        button.innerHTML = originalContent;
        button.disabled = false;
    });
}


function initReportsFunctions() {
    // Inicializar formulario para renombrar reporte
    // ruta del form: /api/reports/rename
    inicializarFormularioAjax('#formRenombrarReporte', {
        closeModalOnSuccess: true,
        onSuccess: (response) => {
            showToast(response);
            loadContent('/reports', false);
        }
    });
}


function btnRenombrarReporte() {
    console.log(selectedItem); // mensaje de depuración
    const id = selectedItem.id;
    const nombreActual = selectedItem.name;
    document.getElementById("reporteRenombrarId").value = id;
    document.getElementById("reporteRenombrarNombre").value = nombreActual;

    mostrarModal('#modalRenombrarReporte');
}

// eliminarGrupo()
function btnEliminarReporte() {
    const idReport = selectedItem.id;

    eliminarRegistro({
        url: `/api/reports/delete/${idReport}`,
        onSuccess: (response) => {
            if (response.success) {
                loadContent('/reports', false);
            }
            showToast(response);
        }
    });
}