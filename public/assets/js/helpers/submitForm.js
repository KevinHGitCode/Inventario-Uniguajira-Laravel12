/**
 * Manejador de formularios para envío mediante AJAX simplificado
 * Esta función permite enviar cualquier formulario mediante AJAX y realizar acciones personalizadas
 * con la respuesta obtenida del servidor.
 * 
 * @param {string} formSelector - Selector CSS para identificar el/los formulario(s) (ej: ".FormularioAjax")
 * @param {Object} options - Opciones de configuración
 * @param {Function} options.onBefore - Función llamada antes de enviar la petición, puede modificar o validar datos
 * @param {Function} options.onSuccess - Función llamada cuando el servidor responde exitosamente
 * @param {Function} options.onError - Función llamada cuando ocurre un error
 * @param {boolean} options.showConfirm - Mostrar diálogo de confirmación antes de enviar (default: false)
 * @param {string} options.confirmMessage - Mensaje de confirmación personalizado
 * @param {boolean} options.resetOnSuccess - Resetear el formulario después de éxito (default: false)
 * @param {boolean} options.closeModalOnSuccess - Cerrar modal asociado (el modal contenedor a de tener la clase modal) (default: false)
 * @param {string} options.redirectOnSuccess - URL para redireccionar después de éxito
 * @param {Object} options.headers - Headers HTTP adicionales para la petición
 * @param {string} options.contentType - Tipo de contenido a enviar (default: null, se usará FormData)
 * @param {Object|Function} options.customBody - Objeto o función que retorna el body personalizado
 */
function inicializarFormularioAjax(formSelector, options = {}) {
    // Opciones por defecto
    const defaultOptions = {
        onBefore: null, // Nueva opción para ejecutar código antes del envío
        onSuccess: response => showToast(response),
        onError: error => showToast(error),
        showConfirm: false,
        confirmMessage: '¿Estás seguro de enviar este formulario?',
        resetOnSuccess: false,
        closeModalOnSuccess: false,
        redirectOnSuccess: null,
        headers: {}, // Nuevo: headers personalizados
        contentType: null, // Nuevo: tipo de contenido personalizado
        customBody: null // Nuevo: body personalizado (objeto o función)
    };
    
    // Combinar opciones default con las proporcionadas
    const settings = { ...defaultOptions, ...options };
    
    // Obtener todos los formularios que coinciden con el selector
    const formularios = document.querySelectorAll(formSelector);
    
    // Asignar el evento submit a cada formulario
    formularios.forEach(formulario => {
        // Remover eventos anteriores si existieran (para evitar duplicados)
        formulario.removeEventListener('submit', formSubmitHandler);
        
        // Agregar el nuevo manejador de eventos
        formulario.addEventListener('submit', formSubmitHandler);
    });
    
    /**
     * Manejador del evento submit
     * @param {Event} e - Evento submit
     */
    function formSubmitHandler(e) {
        e.preventDefault();
        
        // Mostrar confirmación si está habilitado
        if (settings.showConfirm && !confirm(settings.confirmMessage)) {
            return; // El usuario canceló el envío
        }
        
        // Referencia al formulario para usar en promesas
        const form = this;
        
        // Obtener método y acción del formulario
        const method = this.getAttribute('method') || 'POST';
        const action = this.getAttribute('action');
        
        // Preparar headers
        const headers = {
            // Headers predeterminados
            'X-Requested-With': 'XMLHttpRequest',
            ...settings.headers
        };
        
        // Preparar el body según las opciones
        let body;
        
        // Si hay una función o objeto customBody, usarlo
        if (settings.customBody) {
            if (typeof settings.customBody === 'function') {
                // Si es una función, ejecutarla pasando el formulario
                body = settings.customBody(form);
            } else {
                // Si es un objeto, usarlo directamente
                body = settings.customBody;
            }
            
            // Si se especificó un contentType y no está ya en los headers
            if (settings.contentType && !headers['Content-Type']) {
                headers['Content-Type'] = settings.contentType;
                
                // Si es application/json y el body no es string, convertirlo
                if (settings.contentType === 'application/json' && typeof body !== 'string') {
                    body = JSON.stringify(body);
                }
            }
        } else {
            // Comportamiento por defecto: usar FormData
            body = new FormData(form);
        }
        
        // Ejecutar callback onBefore si existe
        if (settings.onBefore && typeof settings.onBefore === 'function') {
            // El callback puede modificar o validar datos
            const beforeResult = settings.onBefore(form, { body, headers, method, action });
            
            // Si el callback retorna false explícitamente, detener el envío
            if (beforeResult === false) {
                return;
            }
            
            // Si el callback retorna un objeto, usarlo para actualizar la configuración
            if (beforeResult && typeof beforeResult === 'object') {
                // Permitir que onBefore modifique estos valores
                if (beforeResult.body !== undefined) body = beforeResult.body;
                if (beforeResult.headers !== undefined) Object.assign(headers, beforeResult.headers);
                if (beforeResult.method !== undefined) method = beforeResult.method;
                if (beforeResult.action !== undefined) action = beforeResult.action;
            }
        }
        
        // Configuración del fetch
        const fetchConfig = {
            method: method.toUpperCase(),
            headers,
            body,
            mode: 'cors',
            cache: 'no-cache'
        };
        
        // Mostrar indicador de carga
        toggleLoadingState(form, true);
        
        // Realizar la petición AJAX
        fetch(action, fetchConfig)
            .then(response => {
                return response.json()
                    .catch(e => {
                        // Este error aparece cuando una ruta del accion de un formulario no se cuentra
                        // Ocacionando que el servidor responda con la pagina de 404
                        // Este html no se puede parsear a JSON, por lo que se lanza un error
                        console.warn('No se pudo parsear el JSON, \n' + 
                            'posiblemente este retornando un html\n' + 
                            'Descripcion del error:', e);
                        return { success: false, message: 'Error al procesar la respuesta' };
                    });
            })
            .then(responseData => {

                if (responseData.success === true) {
                    // Acciones en caso de éxito
                    settings.onSuccess(responseData, form);
                    
                    // Resetear formulario si está configurado
                    if (settings.resetOnSuccess) 
                        form.reset();
                    
                    // Cerrar modal asociado si está configurado
                    if (settings.closeModalOnSuccess) {
                        const modal = form.closest('.modal');
                        if (modal) 
                            modal.classList.remove("active");
                    }
                    
                    // Redireccionar si está configurado
                    if (settings.redirectOnSuccess) 
                        window.location.href = settings.redirectOnSuccess;
                    
                } else {
                    // Acciones en caso de error
                    settings.onError(responseData, form);

                    // Si path existe, mostrar un error por consola
                    if (responseData.path) 
                        console.error(`Revise que la ruta ${responseData.path} exista.\nError al enviar el formulario ${formSelector}`);
                    
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                settings.onError(error, form);
            })
            .finally(() => {
                // Ocultar indicador de carga
                toggleLoadingState(form, false);
            });
    }
    
    /**
     * Alterna el estado de carga en el formulario
     * @param {HTMLFormElement} form - Formulario
     * @param {boolean} isLoading - Estado de carga
     */
    function toggleLoadingState(form, isLoading) {
        // Deshabilitar/habilitar los campos del formulario
        const formElements = form.querySelectorAll('input, select, textarea, button');
        formElements.forEach(element => {
            element.disabled = isLoading;
        });
        
        // Buscar un botón de envío para mostrar estado de carga
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
            const originalText = submitButton.dataset.originalText || submitButton.innerHTML;
            
            if (isLoading) {
                // Guardar texto original si no está guardado
                if (!submitButton.dataset.originalText) {
                    submitButton.dataset.originalText = originalText;
                }
                // Cambiar a texto de carga
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
            } else {
                // Restaurar texto original
                submitButton.innerHTML = originalText;
            }
        }
    }
    
    // Retornar la configuración actual para posibles usos externos
    return settings;
}