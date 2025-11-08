/**
 * Manejador simplificado para operaciones de eliminación mediante AJAX
 * Esta función permite realizar eliminaciones con confirmación y acciones personalizadas
 * 
 * @param {Object} options - Opciones de configuración
 * @param {string} options.url - URL para la petición de eliminación (obligatorio)
 * @param {boolean} options.showConfirm - Mostrar diálogo de confirmación antes de eliminar (default: true)
 * @param {string} options.confirmTitle - Título del mensaje de confirmación (default: '¿Estás seguro?')
 * @param {string} options.confirmText - Texto del mensaje de confirmación (default: '¡Esta acción no se puede deshacer!')
 * @param {Function} options.onSuccess - Función llamada cuando el servidor responde exitosamente
 * @param {Function} options.onError - Función llamada cuando ocurre un error
 */
function eliminarRegistro(options) {
    // Valores por defecto
    const config = {
        showConfirm: true,
        confirmTitle: '¿Estás seguro?',
        confirmText: '¡Esta acción no se puede deshacer!',
        onSuccess: response => showToast(response),
        onError: error => showToast(error),
        ...options
    };

    // Validación de la URL
    if (!config.url) {
        throw new Error('La URL de eliminación es obligatoria');
    }

    // Función para realizar la petición
    const realizarPeticion = () => {
        fetch(config.url, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                config.onSuccess(response);
            } else {
                config.onError(response);
            }
        })
        .catch(error => {
            config.onError(error);
        });
    };

    // Si se requiere confirmación, mostrar diálogo
    if (config.showConfirm) {
        Swal.fire({
            title: config.confirmTitle,
            text: config.confirmText,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                realizarPeticion();
            }
        });
    } else {
        // Si no se requiere confirmación, realizar la petición directamente
        realizarPeticion();
    }
}