@extends('layouts.app')

@section('title', 'Usuarios')

@section('content')
<div class="content">

    {{-- ✅ Contenedor para refresh AJAX --}}
    <div id="users-content">

        {{-- Header --}}
        <div class="inventory-header" style="margin-bottom: 20px;">
            <div>
                <h1 style="font-size: 28px; font-weight: 700; margin: 0;">
                    Usuarios Registrados
                </h1>
                <p style="margin: 6px 0 0; color: #6b7280; font-size: 14px;">
                    Gestiona los usuarios del sistema
                </p>
            </div>

            <div class="inventory-controls" style="margin-top: 18px; display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                {{-- Buscador --}}
                <div class="search-control" style="flex: 1; min-width: 240px;">
                    <label for="searchInput" style="display:block; font-size: 12px; color:#6b7280; margin-bottom: 6px;">
                        Buscar
                    </label>
                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Buscar usuario..."
                        style="
                            width: 100%;
                            padding: 10px 12px;
                            border: 1px solid #e5e7eb;
                            border-radius: 10px;
                            outline: none;
                            background: white;
                            font-size: 14px;
                        "
                    >
                </div>

                {{-- Acciones --}}
                <div class="actions-control" style="display:flex; gap:10px;">
                    <button
                        class="btn btn-primary"
                        onclick="mostrarModal('#modalCrearUsuario')"
                        style="
                            display:inline-flex;
                            align-items:center;
                            gap:8px;
                            padding: 10px 14px;
                            border-radius: 10px;
                            font-weight: 600;
                        "
                    >
                        <i class="fa-solid fa-plus"></i>
                        Nuevo Usuario
                    </button>
                </div>
            </div>
        </div>

        {{-- Table Container --}}
        <div class="inventory-table-container" style="
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(0,0,0,0.04);
        ">
            <table class="inventory-table" style="width:100%; border-collapse: collapse;">
                <thead style="background:#f9fafb;">
                    <tr>
                        <th style="padding:14px 16px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase;">ID</th>
                        <th style="padding:14px 16px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase;">Nombre</th>
                        <th style="padding:14px 16px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase;">Usuario</th>
                        <th style="padding:14px 16px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase;">Email</th>
                        <th style="padding:14px 16px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase;">Rol</th>
                        <th style="padding:14px 16px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase;">Registrado</th>
                        <th style="padding:14px 16px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase;">Acciones</th>
                    </tr>
                </thead>

                <tbody id="tableBody">
                    @forelse($users as $user)
                        <tr style="border-top:1px solid #e5e7eb;">
                            <td style="padding:14px 16px; font-size:14px; font-weight:600;">
                                #{{ $user->id }}
                            </td>

                            <td style="padding:14px 16px; font-size:14px; font-weight:600;">
                                {{ $user->name }}
                            </td>

                            <td style="padding:14px 16px; font-size:14px; color:#374151;">
                                {{ $user->username }}
                            </td>

                            <td style="padding:14px 16px; font-size:14px; color:#6b7280;">
                                {{ $user->email }}
                            </td>

                            <td style="padding:14px 16px;">
                                @php
                                    $isAdmin = $user->role === 'administrador';
                                @endphp

                                <span style="
                                    display:inline-flex;
                                    align-items:center;
                                    padding: 4px 10px;
                                    border-radius: 999px;
                                    font-size: 12px;
                                    font-weight: 600;
                                    background: {{ $isAdmin ? '#ede9fe' : '#dbeafe' }};
                                    color: {{ $isAdmin ? '#5b21b6' : '#1e40af' }};
                                ">
                                    {{ ucfirst($user->role) }}
                                </span>
                            </td>

                            <td style="padding:14px 16px; font-size:14px; color:#6b7280;">
                                {{ $user->created_at?->format('d/m/Y') }}
                            </td>

                            <td class="actions" style="padding:14px 16px;">
                                <div style="display:flex; gap:10px; align-items:center;">
                                    <button
                                        class="btn btn-warning"
                                        data-id="{{ $user->id }}"
                                        data-nombre="{{ $user->name }}"
                                        data-nombre-usuario="{{ $user->username }}"
                                        data-email="{{ $user->email }}"
                                        data-role="{{ $user->role }}"
                                        onclick="btnEditarUser(this)"
                                        style="
                                            border-radius: 10px;
                                            padding: 8px 10px;
                                            display:inline-flex;
                                            align-items:center;
                                            justify-content:center;
                                        "
                                    >
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>

                                    <button
                                        class="btn btn-danger"
                                        onclick="mostrarConfirmacion({{ $user->id }})"
                                        style="
                                            border-radius: 10px;
                                            padding: 8px 10px;
                                            display:inline-flex;
                                            align-items:center;
                                            justify-content:center;
                                        "
                                    >
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr style="border-top:1px solid #e5e7eb;">
                            <td colspan="7" style="padding: 30px; text-align:center; color:#6b7280;">
                                <i class="fa-regular fa-folder-open" style="margin-right:6px;"></i>
                                No hay usuarios registrados.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

    </div>
    {{-- ✅ Fin del contenedor users-content --}}

    {{-- MODALES --}}
    @include('users.modal-crear')
    @include('users.modal-editar')
    @include('users.modal-confirmar-eliminar')

    {{-- ✅ INICIALIZACIÓN --}}
    @once
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                initUserFunctions();
            });
        </script>
    @endonce

</div>
@endsection