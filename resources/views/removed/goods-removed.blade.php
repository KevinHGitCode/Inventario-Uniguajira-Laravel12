@extends('layouts.app')

@section('title', 'Bienes Dados de Baja')

@section('content')
<div id="goods-removed" class="content">

    <div class="inventory-header">
        <h1>Bienes Dados de Baja</h1>
    </div>

    <x-generals.top-bar
        id="searchRemovedGoods"
        placeholder="Buscar por nombre o motivo..."
        :canCreate="false"
    />

    @if($removedAssets->isEmpty())
        <div class="empty-state">
            <i class="fas fa-check-circle fa-3x"></i>
            <p>No hay bienes dados de baja</p>
        </div>
    @else
        <div class="bienes-grid">
            @foreach($removedAssets as $asset)
                <div class="bien-card card-item"
                    data-search="{{ strtolower($asset->asset_name . ' ' . $asset->reason) }}"
                    onclick="btnViewRemovedDetails({{ $asset->id }})"
                    style="cursor: pointer;">

                    {{-- Imagen --}}
                    <img
                        src="{{ asset('storage/' . ($asset->image ?? 'assets/uploads/img/goods/default.jpg')) }}"
                        class="bien-image"
                        onerror="this.src='{{ asset('assets/uploads/img/goods/default.jpg') }}'"
                    />

                    {{-- Info --}}
                    <div class="bien-info">
                        <h3 class="name-item">
                            {{ $asset->asset_name }}
                            <img
                                src="{{ asset('assets/icons/' . ($asset->type === 'Cantidad' ? 'bienCantidad.svg' : 'bienSerial.svg')) }}"
                                class="bien-icon"
                            />
                        </h3>

                        {{-- ✅ MODIFICACIÓN: Si es serial, no mostrar cantidad --}}
                        @if($asset->type === 'Cantidad')
                            <p><b>Cantidad:</b> {{ $asset->quantity }}</p>
                        @else
                            <p><b>Serial:</b> {{ $asset->serial ?? 'N/A' }}</p>
                        @endif
                        {{-- ✅ FIN MODIFICACIÓN --}}

                        <p><b>Inventario:</b> {{ $asset->inventory_name }}</p>
                        <p><b>Grupo:</b> {{ $asset->group_name }}</p>
                        <p><b>Motivo:</b> {{ Str::limit($asset->reason, 50) }}</p>
                        <p><b>Usuario:</b> {{ $asset->removed_by_user ?? 'N/A' }}</p>
                        <p><b>Fecha:</b> {{ \Carbon\Carbon::parse($asset->removed_at)->format('d/m/Y H:i') }}</p>
                    </div>
                </div>
            @endforeach
        </div>
    @endif

</div>

{{-- =========================
    MODAL FLYOUT (PANEL DERECHO)
========================= --}}
<div id="modalRemovedDetails" class="modal">
    <div id="removedFlyoutPanel" class="modal-content flyout-panel">
        <span class="close" onclick="ocultarModal('#modalRemovedDetails')">&times;</span>
        <h2>Detalles del Bien Dado de Baja</h2>

        <div id="removedDetailsContent" class="form-container"></div>
    </div>
</div>

{{-- ✅ ESTILOS DEL MODAL CON ANIMACIÓN --}}
@once
<style>
    /* ✅ Overlay full screen - OCUPA TODA LA PANTALLA */
    #modalRemovedDetails {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        min-height: 100vh !important;
        max-height: 100vh !important;
        background: rgba(0,0,0,0.45);
        z-index: 9999 !important;
        margin: 0 !important;
        padding: 0 !important;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    /* Cuando el modal se muestra */
    #modalRemovedDetails[style*="display: block"],
    #modalRemovedDetails.show,
    #modalRemovedDetails.active,
    #modalRemovedDetails.open {
        opacity: 1 !important;
        visibility: visible !important;
    }

    /* ✅ Panel derecho con animación - OCUPA TODO EL ALTO */
    #modalRemovedDetails .flyout-panel {
        position: fixed !important;
        top: 0 !important;
        bottom: 0 !important;
        right: 0 !important;

        height: 100vh !important;
        min-height: 100vh !important;
        max-height: 100vh !important;
        width: 42% !important;
        max-width: 700px !important;
        min-width: 420px !important;

        background: white !important;
        border-radius: 0 !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        margin: 0 !important;
        padding: 30px 25px !important;
        box-sizing: border-box !important;

        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;

        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    }

    /* ✅ Cuando el modal está visible, el panel entra desde la derecha */
    #modalRemovedDetails[style*="display: block"] .flyout-panel,
    #modalRemovedDetails.show .flyout-panel,
    #modalRemovedDetails.active .flyout-panel,
    #modalRemovedDetails.open .flyout-panel {
        transform: translateX(0) !important;
    }

    /* Estilos para el botón de cerrar */
    #modalRemovedDetails .flyout-panel .close {
        position: absolute;
        top: 20px;
        right: 25px;
        font-size: 28px;
        font-weight: bold;
        color: #aaa;
        cursor: pointer;
        line-height: 1;
        z-index: 10;
    }

    #modalRemovedDetails .flyout-panel .close:hover {
        color: #000;
    }

    #modalRemovedDetails .flyout-panel h2 {
        margin-top: 0;
        margin-bottom: 20px;
        padding-right: 40px;
    }
</style>
@endonce

@once
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            initRemovedGoodsFunctions();
        });
    </script>
@endonce

</div>
@endsection