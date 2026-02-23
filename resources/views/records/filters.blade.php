<div class="filtro_padre">
    <form id="filterForm" class="filtro">

        <div class="filtro_container">
            <label for="filter-user" class="filtro_text">
                Usuario
            </label>
            <select id="filter-user" name="user_id" class="filtro_select">
                <option>Todos los usuarios</option>
                @foreach($users as $user)
                    <option value="{{ $user->id }}" {{ request('user_id') == $user->id ? 'selected' : '' }}>
                        {{ $user->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="filtro_container">
            <label for="filter-action" class="filtro_text">
                Acción
            </label>
            <select id="filter-action" name="action" class="filtro_select">
                <option value="">Todas</option>
                @foreach($actions as $action)
                    <option value="{{ $action }}" {{ request('action') == $action ? 'selected' : '' }}>
                        {{ ucfirst($action) }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="filtro_container">
            <label for="filter-model" class="filtro_text">
                Módulo
            </label>
            <select id="filter-model" name="model" class="filtro_select">
                <option value="">Todos</option>
                @foreach($models as $model)
                    <option value="{{ $model }}" {{ request('model') == $model ? 'selected' : '' }}>
                        {{ $model }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="filtro_container">
            <label for="filter-date-from" class="filtro_text">
                Desde
            </label>
            <input type="date" id="filter-date-from" name="date_from"
                class="filtro_select"
                value="{{ request('date_from') }}">
        </div>

        <div class="filtro_container">
            <label for="filter-date-to" class="filtro_text">
                Hasta
            </label>
            <input type="date" id="filter-date-to" name="date_to"
                class="filtro_select"
                value="{{ request('date_to') }}">
        </div>

        <div class="btn_contendor">
            <button type="submit" class="btn_filtrar">
                <label class="btn_text"> Filtrar </label>
            </button>
        </div>

    </form>
</div>