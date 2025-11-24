@props(['mode' => 'create'])

@php
    $isRename = $mode === 'rename';

    $modalId = $isRename ? 'modalRenombrarGrupo' : 'modalCrearGrupo';
    $formId = $isRename ? 'formRenombrarGrupo' : 'formCrearGrupo';

    $title = $isRename ? 'Renombrar Grupo' : 'Nuevo Grupo';

    // Usamos las rutas de API que el JS espera
    $route = $isRename ? url('/api/groups/rename') : url('/api/groups/create');
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

            @if($isRename)
                <input type="hidden" name="id" id="grupoRenombrarId" />
            @endif

            <div>
                <label for="{{ $isRename ? 'grupoRenombrarNombre' : 'nombreGrupo' }}">{{ $isRename ? 'Nuevo Nombre:' : 'Nombre del grupo:' }}</label>
                <input
                    type="text"
                    name="nombre"
                    id="{{ $isRename ? 'grupoRenombrarNombre' : 'nombreGrupo' }}"
                    required
                />
            </div>

            <div class="form-actions">
                <button type="submit" id="{{ $isRename ? '' : 'create-btn-grupo' }}" class="btn submit-btn">
                    {{ $isRename ? 'Guardar Cambios' : 'Guardar' }}
                </button>
            </div>
        </form>

    </div>
</div>

@once
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof initGroupFunctions === 'function') {
                initGroupFunctions();
            }
        });
    </script>
@endonce
