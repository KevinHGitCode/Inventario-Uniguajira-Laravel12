@extends('layouts.app')

@section('title', 'Historial')

@section('content')
<div class="content">

    <div class="inventory-header"
        style= "margin-bottom: 20px">
        <h1>Historial</h1>
    </div>

    <div class="statistics_history">

        <div class="statistics_card">
            <div class= "statistics_text">
                <p class="m-0 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Total de registros
                </p>
                <p class="m-0 text-5xl font-bold text-gray-900 leading-none">
                    {{ number_format($logs->total()) }}
                </p>
            </div>
        </div>
    
        <div class="statistics_card">
            <div class= "statistics_text">
                <p class="m-0 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Acciones de hoy
                </p>
                <p class="m-0 text-5xl font-bold text-gray-900 leading-none">
                    {{ \App\Models\ActivityLog::whereDate('created_at', today())->count() }}
                </p>
            </div>
        </div>
    
        <div class="statistics_card">
            <div class= "statistics_text">
                <p class="m-0 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Usuarios activos
                </p>
                <p class="m-0 text-5xl font-bold text-gray-900 leading-none">
                    {{ \App\Models\ActivityLog::distinct('user_id')->whereDate('created_at', today())->count('user_id') }}
                </p>
            </div>
        </div>
    
        <div class="statistics_card">
            <div class= "statistics_text">
                <p class="m-0 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Esta semana
                </p>
                <p class="m-0 text-5xl font-bold text-gray-900 leading-none">
                    {{ \App\Models\ActivityLog::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count() }}
                </p>
            </div>
        </div>
    
    </div>
    
</div>

@endsection