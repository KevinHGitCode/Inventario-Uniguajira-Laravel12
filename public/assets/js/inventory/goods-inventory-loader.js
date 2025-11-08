// Función para cargar bienes del inventario desde JSON
async function cargarBienesInventario(idInventory) {
    const divContent = document.getElementById('goods-inventory-content');
    
    // Mostrar loader mientras carga
    divContent.innerHTML = '<p>Cargando bienes...</p>';
    
    try {
        // Realizar solicitud para obtener datos JSON
        const response = await fetch(`/api/get/goodsInventory/${idInventory}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const bienes = await response.json();
        
        // Limpiar el contenedor
        divContent.innerHTML = '';
        
        // Crear el contenedor principal para los bienes
        const bienesGrid = document.createElement('div');
        bienesGrid.className = 'bienes-grid';
        
        // Agregar inmediatamente el grid al DOM para que sea visible
        divContent.appendChild(bienesGrid);
        
        // Verificar si hay bienes
        if (bienes && bienes.length > 0) {
            
            // Obtener el rol del usuario de manera segura
            const userRol = getUserRol();
            
            // Determinar si el usuario puede seleccionar items (administradores o roles autorizados)
            const puedeSeleccionar = ['administrador'].includes(userRol);
            
            // Procesar todos los bienes de una vez
            bienes.forEach((bien) => {
                const bienElement = document.createElement('div');
                bienElement.className = 'bien-card card-item';
                
                // Siempre agregar los atributos data-* para mantener consistencia
                bienElement.dataset.id = bien.bien_id;
                bienElement.dataset.name = bien.bien;
                bienElement.dataset.cantidad = bien.cantidad;
                bienElement.dataset.type = 'good';
                bienElement.dataset.inventarioId = bien.inventario_id;
                bienElement.dataset.inventario = bien.inventario;
                bienElement.dataset.tipo = bien.tipo;
                bienElement.dataset.imagen = bien.imagen;
                
                // Agregar evento según el tipo de bien y permisos del usuario
                if (puedeSeleccionar && bien.tipo === 'Cantidad') {
                    bienElement.onclick = function() { toggleSelectItem(this); };
                } else if (puedeSeleccionar && bien.tipo !== 'Cantidad') {
                    bienElement.onclick = function() { deselectItem(this); };
                }
                
                // Crear la estructura HTML del bien
                bienElement.innerHTML = `
                    <img
                        src="${bien.imagen || 'assets/uploads/img/goods/default.jpg'}"
                        class="bien-image"
                        alt="${bien.bien || 'Bien sin nombre'}"
                    />
                    <div class="bien-info">
                        <h3 class="name-item">
                            ${bien.bien || 'Bien sin nombre'}
                            <img
                                src="assets/icons/${bien.tipo === 'Cantidad' ? 'bienCantidad.svg' : 'bienSerial.svg'}"
                                alt="Tipo ${bien.tipo || 'desconocido'}"
                                class="bien-icon"
                            />
                        </h3>
                        <p>
                            <b>Cantidad:</b>
                            ${bien.cantidad || '0'}
                        </p>
                    </div>
                    ${
                        bien.tipo === 'Serial'
                        ? `<div class="actions">
                                <a
                                    class="btn-detalle"
                                    style="margin-right: 10px;"
                                    title="Ver detalle"
                                    onclick="verDetalleBienSerialInventario('${idInventory}', '${bien.bien_id}')"
                                >
                                    <i class="fas fa-info-circle"></i>
                                </a>
                            </div>`
                        : ''
                    }
                `;
                
                // Agregar al contenedor de bienes
                bienesGrid.appendChild(bienElement);
            });
            
        } else {
            // Mostrar estado vacío si no hay bienes
            mostrarEstadoVacio(bienesGrid);
        }

    } catch (error) {
        // Limpiar el contenedor y mostrar mensaje de error
        divContent.innerHTML = '';
        const bienesGrid = document.createElement('div');
        bienesGrid.className = 'bienes-grid';
        divContent.appendChild(bienesGrid);
        
        // Mostrar mensaje de error estilizado
        const errorState = document.createElement('div');
        errorState.className = 'empty-state error-state';
        errorState.innerHTML = `
            <i class="fas fa-exclamation-triangle fa-3x"></i>
            <p>Error al cargar los bienes. Por favor, intente nuevamente.</p>
        `;
        bienesGrid.appendChild(errorState);
    }
}

// Función para mostrar estado vacío
function mostrarEstadoVacio(contenedor) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <i class="fas fa-box-open fa-3x"></i>
        <p>No hay bienes disponibles en este inventario.</p>
    `;
    contenedor.appendChild(emptyState);
}

function getUserRol() {
    // Obtener el rol desde la sesión global
    return window.sesion?.session_data?.user_rol || 'invitado';
}