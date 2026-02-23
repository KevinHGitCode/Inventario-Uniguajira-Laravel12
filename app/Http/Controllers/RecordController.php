<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog;
use App\Models\User;
use Carbon\Carbon;

class RecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ActivityLog::with('user')->orderBy('created_at', 'desc');

        // Filtro por usuario
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filtro por acción
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Filtro por modelo
        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }

        // Filtro por fecha
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Búsqueda por descripción
        if ($request->filled('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $logs = $query->paginate(50);

        // Obtener datos para filtros
        $users = User::orderBy('name')->get();
        $actions = ActivityLog::select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action');
        $models = ActivityLog::select('model')
            ->distinct()
            ->whereNotNull('model')
            ->orderBy('model')
            ->pluck('model');

        // Si es AJAX, devolver solo la vista parcial
        if ($request->ajax()) {
            /** @var \Illuminate\View\View $view */
            $view = view('records.index', compact('logs', 'users', 'actions', 'models'));
            return $view->renderSections()['content'];
        }

        return view('records.index', compact('logs', 'users', 'actions', 'models'));
    }

    /**
     * Limpiar registros antiguos
     * DELETE /api/records/clean
     */
    public function clean(Request $request)
    {
        try {
            $days = $request->input('days', 30); // Por defecto eliminar registros de más de 30 días
            
            $deleted = ActivityLog::where('created_at', '<', Carbon::now()->subDays($days))->delete();

            return response()->json([
                'success' => true,
                'type' => 'success',
                'message' => "Se eliminaron {$deleted} registros antiguos.",
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'type' => 'error',
                'message' => 'Ocurrió un error al limpiar los registros.',
            ], 500);
        }
    }

    /**
     * Exportar registros a CSV
     */
    public function export(Request $request)
    {
        $query = ActivityLog::with('user')->orderBy('created_at', 'desc');

        // Aplicar mismos filtros que en index
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->get();

        $filename = 'historial_' . date('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($logs) {
            $file = fopen('php://output', 'w');
            
            // Encabezados
            fputcsv($file, ['ID', 'Usuario', 'Acción', 'Modelo', 'Descripción', 'IP', 'Fecha/Hora']);

            foreach ($logs as $log) {
                fputcsv($file, [
                    $log->id,
                    $log->user?->name ?? 'Sistema',
                    ucfirst($log->action),
                    $log->model ?? '-',
                    $log->description,
                    $log->ip_address ?? '-',
                    $log->created_at->format('d/m/Y H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}