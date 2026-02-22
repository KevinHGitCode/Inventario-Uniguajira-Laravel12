{{-- ── Estadísticas ─────────────────────────────────────────────── --}}
<div class="statistics_hisroty">

    <div class="bg-white border border-gray-200 rounded-xl p-4 h-40 flex flex-col justify-center items-center text-center">
        <p class="m-0 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Total de registros
        </p>
        <p class="m-0 text-5xl font-bold text-gray-900 leading-none">
            {{ number_format($logs->total()) }}
        </p>
    </div>

    <div class="bg-white border border-gray-200 border-l-4 border-l-gray-700 rounded-xl p-4 h-40 flex flex-col justify-center items-center text-center">
        <p class="m-0 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Acciones de hoy
        </p>
        <p class="m-0 text-5xl font-bold text-gray-900 leading-none">
            {{ \App\Models\ActivityLog::whereDate('created_at', today())->count() }}
        </p>
    </div>

    <div class="bg-white border border-gray-200 border-l-4 border-l-gray-500 rounded-xl p-4 h-40 flex flex-col justify-center items-center text-center">
        <p class="m-0 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Usuarios activos
        </p>
        <p class="m-0 text-5xl font-bold text-gray-900 leading-none">
            {{ \App\Models\ActivityLog::distinct('user_id')->whereDate('created_at', today())->count('user_id') }}
        </p>
    </div>

    <div class="bg-white border border-gray-200 border-l-4 border-l-gray-400 rounded-xl p-4 h-40 flex flex-col justify-center items-center text-center">
        <p class="m-0 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Esta semana
        </p>
        <p class="m-0 text-5xl font-bold text-gray-900 leading-none">
            {{ \App\Models\ActivityLog::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count() }}
        </p>
    </div>

</div>

{{-- ── Filtros ───────────────────────────────────────────────────── --}}
{{-- <div class="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-5">
    <form id="filterForm" class="row g-3 align-items-end">

        <div class="col-md-3">
            <label for="filter-user" class="form-label text-xs font-semibold text-gray-700">
                Usuario
            </label>
            <select id="filter-user" name="user_id" class="form-select form-select-sm">
                <option value="">Todos los usuarios</option>
                @foreach($users as $user)
                    <option value="{{ $user->id }}" {{ request('user_id') == $user->id ? 'selected' : '' }}>
                        {{ $user->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="col-md-2">
            <label for="filter-action" class="form-label text-xs font-semibold text-gray-700">
                Acción
            </label>
            <select id="filter-action" name="action" class="form-select form-select-sm">
                <option value="">Todas</option>
                @foreach($actions as $action)
                    <option value="{{ $action }}" {{ request('action') == $action ? 'selected' : '' }}>
                        {{ ucfirst($action) }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="col-md-2">
            <label for="filter-model" class="form-label text-xs font-semibold text-gray-700">
                Módulo
            </label>
            <select id="filter-model" name="model" class="form-select form-select-sm">
                <option value="">Todos</option>
                @foreach($models as $model)
                    <option value="{{ $model }}" {{ request('model') == $model ? 'selected' : '' }}>
                        {{ $model }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="col-md-2">
            <label for="filter-date-from" class="form-label text-xs font-semibold text-gray-700">
                Desde
            </label>
            <input type="date" id="filter-date-from" name="date_from"
                   class="form-control form-control-sm"
                   value="{{ request('date_from') }}">
        </div>

        <div class="col-md-2">
            <label for="filter-date-to" class="form-label text-xs font-semibold text-gray-700">
                Hasta
            </label>
            <input type="date" id="filter-date-to" name="date_to"
                   class="form-control form-control-sm"
                   value="{{ request('date_to') }}">
        </div>

        <div class="col-md-1">
            <button type="submit" class="btn btn-dark btn-sm w-100 rounded-lg">
                <i class="fa-solid fa-filter"></i>
            </button>
        </div>

    </form>
</div> --}}

{{-- ── Tabla de registros ───────────────────────────────────────── --}}
<div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <table class="w-full border-collapse">
        <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-14">
                    Tipo
                </th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Usuario
                </th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Descripción
                </th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-32">
                    Módulo
                </th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-36">
                    Fecha / Hora
                </th>
            </tr>
        </thead>

        <tbody>
            @forelse($logs as $log)
                <tr class="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-100">

                    {{-- Ícono --}}
                    <td class="px-4 py-3 text-center">
                        <div class="w-9 h-9 rounded-lg inline-flex items-center justify-center bg-gray-900">
                            <i class="fa-solid {{ $log->icon }} text-white text-sm"></i>
                        </div>
                    </td>

                    {{-- Usuario --}}
                    <td class="px-4 py-3">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {{ $log->user?->initials() ?? 'S' }}
                            </div>
                            <div>
                                <div class="text-sm font-semibold text-gray-900">
                                    {{ $log->user?->name ?? 'Sistema' }}
                                </div>
                                <div class="text-xs text-gray-400">
                                    {{ $log->user?->username ?? 'system' }}
                                </div>
                            </div>
                        </div>
                    </td>

                    {{-- Descripción --}}
                    <td class="px-4 py-3">
                        <div class="text-sm text-gray-700">
                            {{ $log->description }}
                        </div>
                        @if($log->old_values && $log->action === 'update')
                            <div class="mt-1 flex flex-wrap gap-1">
                                @foreach(array_keys($log->old_values) as $key)
                                    @if(isset($log->new_values[$key]) && $log->old_values[$key] != $log->new_values[$key])
                                        <span class="inline-block bg-gray-100 border border-gray-200 rounded px-1.5 py-px text-xs text-gray-500 font-mono">
                                            {{ $key }}: {{ Str::limit((string)$log->old_values[$key], 18) }} → {{ Str::limit((string)$log->new_values[$key], 18) }}
                                        </span>
                                    @endif
                                @endforeach
                            </div>
                        @endif
                    </td>

                    {{-- Módulo --}}
                    <td class="px-4 py-3">
                        @if($log->model)
                            <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                {{ $log->model }}
                            </span>
                        @else
                            <span class="text-gray-300">—</span>
                        @endif
                    </td>

                    {{-- Fecha / Hora --}}
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm text-gray-700 font-medium">
                            {{ $log->created_at->format('d/m/Y') }}
                        </div>
                        <div class="text-xs text-gray-400">
                            {{ $log->created_at->format('H:i:s') }}
                        </div>
                    </td>

                </tr>
            @empty
                <tr>
                    <td colspan="5" class="py-16 text-center text-gray-400">
                        <i class="fa-regular fa-folder-open text-5xl block mb-3 opacity-40"></i>
                        <p class="m-0 text-base font-medium">No hay registros de actividad</p>
                        <p class="mt-1.5 mb-0 text-sm opacity-70">Ajusta los filtros para ver resultados</p>
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    {{-- Paginación --}}
    @if($logs->hasPages())
        <div class="px-5 py-4 border-t border-gray-200 bg-gray-50">
            {{ $logs->links() }}
        </div>
    @endif
</div>