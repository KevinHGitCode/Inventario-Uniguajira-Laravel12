function initFoldersFunctions() {

    // Inicializar formulario para crear grupo
    // ruta del form: /api/folders/create
    inicializarFormularioAjax('#formCrearCarpeta', {
        closeModalOnSuccess: true,
        resetOnSuccess: true,
        onSuccess: (response) => {
            showToast(response);
            loadContent('/reports', false);
        }
    });

    // Inicializar formulario para renombrar grupo
    // ruta del form: /api/folders/rename
    inicializarFormularioAjax('#formRenombrarCarpeta', {
        closeModalOnSuccess: true,
        onSuccess: (response) => {
            showToast(response);
            loadContent('/reports', false);
        }
    });
}

// TODO: comentado porque hacia interferencia con inventario
// function mostrarModalCrearInventario() {
//     mostrarModal('#modalCrearCarpeta');
// }

function btnRenombrarCarpeta() {
    console.log(selectedItem); // mensaje de depuración
    const id = selectedItem.id;
    const nombreActual = selectedItem.name;
    document.getElementById("carpetaRenombrarId").value = id;
    document.getElementById("carpetaRenombrarNombre").value = nombreActual;

    mostrarModal('#modalRenombrarCarpeta');
}

// eliminarGrupo()
function btnEliminarCarpeta() {
    const idFolder = selectedItem.id;

    eliminarRegistro({
        url: `/api/folders/delete/${idFolder}`,
        onSuccess: (response) => {
            if (response.success) {
                loadContent('/reports', false);
            }
            showToast(response);
        }
    });
}

let currentFolderId = null;

// Tu función abrirCarpeta actualizada
function abrirCarpeta(idFolder, scrollUpRequired = true) {
    // AGREGAR: Guardar el ID de la carpeta actual
    currentFolderId = idFolder;
    
    const divFolders = document.getElementById('folders');
    const divReports = document.getElementById('report-content');
    const divContent = document.getElementById('report-content-item');

    // Actualizar TODOS los campos ocultos de folder_id en los modales
    updateAllFolderIdFields(idFolder);

    // Tu código existente
    console.log(divReports);
    divContent.innerHTML = '<p>Cargando reportes...</p>';
    divFolders.classList.add('hidden');
    divReports.classList.remove('hidden');

    fetch(`/api/reports/getAll/${idFolder}`)
    .then(res => res.text())
    .then(html => {
        divContent.innerHTML = html;
        iniciarBusqueda('searchReport');
                     
        if (scrollUpRequired)
            window.scrollTo(0, 0);
    })
    .catch(error => {
        console.error('Error:', error);
        divContent.innerHTML = '<p>Error al cargar los reportes</p>';
    });
}

// Tu función cerrarCarpeta actualizada
function cerrarCarpeta() {
    // AGREGAR: Limpiar el ID de la carpeta actual
    currentFolderId = null;
    
    // Limpiar todos los campos de folder_id
    updateAllFolderIdFields('');
    
    // Tu código existente
    document.getElementById('report-content').classList.add('hidden');
    document.getElementById('folders').classList.remove('hidden');
}

function updateAllFolderIdFields(folderId) {
    // Lista de todos los IDs de campos folder_id en tus modales
    const folderIdFields = [
        'folder_id_crear_reporte', // El que ya tienes
        'folderIdInventario',      // Para modal de inventario
        'folderIdGrupo',           // Para modal de grupo
        'folderIdTodosLosInventarios', // Para modal de todos los inventarios
        'folderIdDeBienes', // Para modal de reporte de bienes
        'folderIdDeEquipos', // Para modal de reporte de equipos

    ];
    
    folderIdFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = folderId;
        }
    });
}