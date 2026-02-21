@extends('layouts.app')

@section('title', 'Usuarios')

@section('content')
<div class="content">

    <div class="inventory-header">
        <h1>Usuarios</h1>
    </div>

    {{-- Top Bar: buscador con id que user.js espera + botón crear --}}
    <x-generals.top-bar
        id="searchInput"
        placeholder="Buscar usuario..."
        modal="#modalCrearUsuario"
    />

    {{-- Lista de usuarios --}}
    @if($users->isEmpty())
        <div class="empty-state">
            <i class="fas fa-users fa-3x"></i>
            <p>No hay usuarios registrados</p>
        </div>
    @else
        <div class="card-grid" id="tableBody">
            @foreach ($users as $user)
                @php $isAdmin = $user->role === 'administrador'; @endphp
                <div class="card card-item" style="cursor: default;">

                    {{-- Avatar / ícono --}}
                    <div class="card-left">
                        <div style="
                            width: 42px; height: 42px;
                            border-radius: 50%;
                            background: {{ $isAdmin ? '#ede9fe' : '#dbeafe' }};
                            display: flex; align-items: center; justify-content: center;
                            flex-shrink: 0;
                        ">
                            <i class="fas fa-user" style="
                                color: {{ $isAdmin ? '#5b21b6' : '#1e40af' }};
                                font-size: 16px;
                            "></i>
                        </div>
                    </div>

                    {{-- Info --}}
                    <div class="card-center">
                        <div class="title name-item" style="display: flex; align-items: center; gap: 8px;">
                            {{ $user->name }}
                            <span style="
                                display: inline-flex; align-items: center;
                                padding: 2px 10px;
                                border-radius: 999px;
                                font-size: 11px; font-weight: 600;
                                background: {{ $isAdmin ? '#ede9fe' : '#dbeafe' }};
                                color: {{ $isAdmin ? '#5b21b6' : '#1e40af' }};
                            ">{{ ucfirst($user->role) }}</span>
                        </div>
                        <div class="stats">
                            <span class="stat-item">
                                <i class="fas fa-at"></i>
                                {{ $user->username }}
                            </span>
                            <span class="stat-item hide-on-mobile">
                                <i class="fas fa-envelope"></i>
                                {{ $user->email }}
                            </span>
                            <span class="stat-item hide-on-mobile">
                                <i class="fas fa-calendar-alt"></i>
                                {{ $user->created_at?->format('d/m/Y') }}
                            </span>
                        </div>
                    </div>

                    {{-- Acciones --}}
                    <div class="card-right" style="display: flex; gap: 8px; align-items: center;">
                        <button
                            class="btn-open"
                            title="Editar usuario"
                            data-id="{{ $user->id }}"
                            data-nombre="{{ $user->name }}"
                            data-nombre-usuario="{{ $user->username }}"
                            data-email="{{ $user->email }}"
                            data-role="{{ $user->role }}"
                            onclick="btnEditarUser(this)"
                            style="padding: 7px 12px;"
                        >
                            <i class="fas fa-pen"></i>
                        </button>

                        <button
                            title="Eliminar usuario"
                            onclick="mostrarConfirmacion({{ $user->id }})"
                            style="
                                padding: 7px 12px;
                                background: #fee2e2;
                                color: #dc2626;
                                border: none;
                                border-radius: 8px;
                                cursor: pointer;
                                font-size: 13px;
                                transition: background 0.2s;
                            "
                            onmouseover="this.style.background='#fecaca'"
                            onmouseout="this.style.background='#fee2e2'"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>

                </div>
            @endforeach
        </div>
    @endif

    {{-- MODALES --}}
    @include('users.modal-crear')
    @include('users.modal-editar')
    @include('users.modal-confirmar-eliminar')

    @once
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                initUserFunctions();
            });
        </script>
    @endonce

</div>
@endsection