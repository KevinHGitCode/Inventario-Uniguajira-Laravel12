@props(['mode' => 'create', 'group_id' => null])

@php
    $isRename = $mode === 'rename';

    if ($isRename) {
        $modalId = 'modalRenombrarInventario';
        $formId = 'formRenombrarInventario';
        $title = 'Renombrar Inventario';
        $route = url('/api/inventories/rename');
    } else {
        $modalId = 'modalCrearInventario';
        $formId = 'formCrearInventario';
        $title = 'Nuevo Inventario';
        $route = url('/api/inventories/create');
    }
@endphp

<div id="{{ $modalId }}" class="modal">
    <div class="modal-content {{ $isRename ? 'modal-content-small' : 'modal-content-medium' }}">

        <span class="close" onclick="ocultarModal('#{{ $modalId }}')">&times;</span>

        <h2>{{ $title }}</h2>

        <form
            id="{{ $formId }}"
            action="{{ $route }}"
            method="POST"
            autocomplete="off"
        >
            @csrf

            @if(!$isRename)
                <input type="hidden" name="grupo_id" id="grupo_id_crear_inventario" value="{{ $group_id }}" required />

                <div>
                    <label for="nombreInventario">Nombre del inventario:</label>
                    <input type="text" name="nombre" id="nombreInventario" required />
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn submit-btn">Guardar</button>
                </div>

            @elseif($isRename)
                <input type="hidden" name="inventory_id" id="renombrarInventarioId" />

                <div>
                    <label for="renombrarInventarioNombre">Nombre del inventario:</label>
                    <input type="text" name="nombre" id="renombrarInventarioNombre" required />
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn submit-btn">Guardar Cambios</button>
                </div>

            @endif

        </form>

    </div>
</div>
