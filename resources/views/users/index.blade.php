@extends('layouts.app')

@section('title', 'Usuarios')

@section('content')
<div class="content">

    <div class="inventory-header">
        <h1>Usuarios</h1>
    </div>

    <div class="w-full max-w-7xl mx-auto px-4">
        {{-- Top Bar --}}
        <x-generals.top-bar
            id="searchInput"
            placeholder="Buscar usuario..."
            modal="#modalCrearUsuario"
        />

        {{-- Tabla de usuarios --}}
        @if($users->isEmpty())
            <div class="empty-state">
                <i class="fas fa-users fa-3x"></i>
                <p>No hay usuarios registrados</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="tabla w-full table-auto" id="tableBody">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-200">
                            <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide w-12">
                                N°
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-32">
                                Nombre
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-24">
                                Usuario
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide min-w-0 w-full">
                                Email
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-24">
                                Rol
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-24">
                                Registrado
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-28">
                                Último Acceso
                            </th>
                            <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide w-20">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($users as $user)
                            @php $isAdmin = $user->role === 'administrador'; @endphp
                            <tr class="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-100" data-search="{{ strtolower($user->name . ' ' . $user->username . ' ' . $user->email) }}">

                                {{-- # (ID) --}}
                                <td class="px-4 py-3 text-center whitespace-nowrap">
                                    <div class="text-sm text-gray-700 font-medium">
                                        {{ $user->id }}
                                    </div>
                                </td>

                                {{-- Nombre --}}
                                <td class="px-4 py-3">
                                    <div class="text-sm font-semibold text-gray-900">
                                        {{ $user->name }}
                                    </div>
                                </td>

                                {{-- Usuario --}}
                                <td class="px-4 py-3">
                                    <div class="text-sm text-gray-600">
                                        {{ $user->username }}
                                    </div>
                                </td>

                                {{-- Email --}}
                                <td class="px-4 py-3">
                                    <div class="text-sm text-gray-700">
                                        {{ $user->email }}
                                    </div>
                                </td>

                                {{-- Rol --}}
                                <td class="px-4 py-3">
                                    <span class="inline-flex align-items-center px-2.5 py-0.5 rounded-md text-xs font-semibold {{ $isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700' }} border {{ $isAdmin ? 'border-purple-200' : 'border-blue-200' }}">
                                        {{ ucfirst($user->role) }}
                                    </span>
                                </td>

                                {{-- Registrado --}}
                                <td class="px-4 py-3 whitespace-nowrap">
                                    <div class="text-sm text-gray-700">
                                        {{ $user->created_at?->format('d/m/Y') }}
                                    </div>
                                </td>

                                {{-- Último Acceso --}}
                                <td class="px-4 py-3 whitespace-nowrap">
                                    <div class="text-sm text-gray-700">
                                        @if($user->last_login_at)
                                            <div class="text-sm text-gray-700 font-medium">
                                                {{ $user->last_login_at->format('d/m/Y') }}
                                            </div>
                                            <div class="text-xs text-gray-400">
                                                {{ $user->last_login_at->format('g:i A') }}
                                            </div>
                                        @else
                                            <span class="text-gray-400 italic">Nunca</span>
                                        @endif
                                    </div>
                                </td>

                                {{-- Acciones --}}
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2 justify-center">
                                        <button
                                            class="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-700 text-white hover:bg-red-800 transition-colors duration-200"
                                            title="Editar usuario"
                                            data-id="{{ $user->id }}"
                                            data-nombre="{{ $user->name }}"
                                            data-nombre-usuario="{{ $user->username }}"
                                            data-email="{{ $user->email }}"
                                            data-role="{{ $user->role }}"
                                            onclick="btnEditarUser(this)"
                                        >
                                            <i class="fas fa-pen text-xs"></i>
                                        </button>

                                        <button
                                            class="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
                                            title="Eliminar usuario"
                                            onclick="mostrarConfirmacion({{ $user->id }})"
                                        >
                                            <i class="fas fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="py-16 text-center text-gray-400">
                                    <i class="fas fa-users text-5xl block mb-3 opacity-40"></i>
                                    <p class="m-0 text-base font-medium">No hay usuarios registrados</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        @endif
    </div>

    {{-- MODALES --}}
    @include('users.modal-crear')
    @include('users.modal-editar')
    @include('users.modal-confirmar-eliminar')

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            initUserFunctions();
        });
    </script>

</div>
@endsection