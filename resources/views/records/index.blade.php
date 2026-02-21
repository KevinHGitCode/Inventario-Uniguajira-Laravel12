@extends('layouts.app')

@section('title', 'Historial')

@section('content')
<div class="content">

    <div class="inventory-header"
        style= "margin-bottom: 20px">
        <h1>Historial</h1>
    </div>
    

    <div>
        {{-- Botones --}}
        {{-- <div style="display: flex; gap: 8px; flex-shrink: 0;">
            <button
                onclick="exportLogs()"
                style="
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 8px 14px;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    cursor: pointer;
                    transition: background .15s;
                "
                onmouseover="this.style.background='#f9fafb'"
                onmouseout="this.style.background='#ffffff'"
            >
                <i class="fa-solid fa-file-export" style="color: #6b7280;"></i>
                Exportar CSV
            </button> --}}

            {{-- <button
                onclick="refreshLogs()"
                style="
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 8px 14px;
                    background: #111827;
                    border: 1px solid #111827;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #ffffff;
                    cursor: pointer;
                    transition: background .15s;
                "
                onmouseover="this.style.background='#374151'"
                onmouseout="this.style.background='#111827'"
            >
                <i class="fa-solid fa-rotate"></i>
                Actualizar
            </button> --}}
        </div>

    </div>

    {{-- ── Contenido dinámico (stats + filtros + tabla) ────────────── --}}
    <div id="records-content">
        @include('records._table')
    </div>

</div>

{{-- ── Scripts ──────────────────────────────────────────────────── --}}
@once
<script>
    async function refreshLogs() {
        try {
            const params = new URLSearchParams(window.location.search);

            const response = await fetch(`${window.location.pathname}?${params}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            if (!response.ok) throw new Error('Error al refrescar registros');

            const html = await response.text();
            document.getElementById('records-content').innerHTML = html;

            initRecordsFunctions();

            showToast({ type: 'success', message: 'Registros actualizados' });

        } catch (error) {
            console.error(error);
            showToast({ type: 'error', message: 'No se pudo actualizar la vista' });
        }
    }

    function initRecordsFunctions() {
        const filterForm = document.getElementById('filterForm');

        if (filterForm) {
            filterForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const formData  = new FormData(this);
                const params    = new URLSearchParams(formData);
                const search    = document.getElementById('searchInput');

                if (search && search.value) params.set('search', search.value);

                window.history.pushState({}, '', `${window.location.pathname}?${params}`);
                refreshLogs();
            });
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let timeout;
            searchInput.addEventListener('input', function () {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const params = new URLSearchParams(window.location.search);
                    this.value ? params.set('search', this.value) : params.delete('search');
                    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
                    refreshLogs();
                }, 500);
            });
        }
    }

    function exportLogs() {
        const params = new URLSearchParams(window.location.search);
        window.location.href = `/api/records/export?${params}`;
    }

    document.addEventListener('DOMContentLoaded', () => {
        initRecordsFunctions();
    });
</script>
@endonce

@endsection