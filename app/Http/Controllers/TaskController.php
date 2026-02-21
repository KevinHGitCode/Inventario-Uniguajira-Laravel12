<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use App\Helpers\ActivityLogger;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date|after_or_equal:today'
        ], [
            'date.after_or_equal' => 'La fecha de la tarea no puede ser anterior al día de hoy.'
        ]);

        $task = Task::create([
            'name' => $request->name,
            'description' => $request->description,
            'date' => $request->date,
            'user_id' => Auth::id(),
            'status' => 'pending'
        ]);

        // ✅ Registrar actividad
        ActivityLogger::created(Task::class, $task->id, $task->name);

        return response()->json(['success' => true]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date|after_or_equal:today'
        ], [
            'date.after_or_equal' => 'La fecha de la tarea no puede ser anterior al día de hoy.'
        ]);

        $task = Task::findOrFail($request->id);

        // ✅ Guardar valores anteriores
        $oldValues = [
            'name' => $task->name,
            'description' => $task->description,
            'date' => $task->date,
        ];

        $task->update([
            'name' => $request->name,
            'description' => $request->description,
            'date' => $request->date
        ]);

        // ✅ Registrar actividad
        ActivityLogger::updated(
            Task::class,
            $task->id,
            $task->name,
            $oldValues,
            [
                'name' => $task->name,
                'description' => $task->description,
                'date' => $task->date,
            ]
        );

        return response()->json(['success' => true]);
    }

    public function toggle(Request $request)
    {
        $task = Task::findOrFail($request->id);
        
        $oldStatus = $task->status;
        $task->status = $task->status === 'pending' ? 'completed' : 'pending';
        $task->save();

        // ✅ Registrar actividad de cambio de estado
        ActivityLogger::updated(
            Task::class,
            $task->id,
            $task->name,
            ['status' => $oldStatus],
            ['status' => $task->status]
        );

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $taskName = $task->name; // Guardar antes de eliminar

        $task->delete();

        // ✅ Registrar actividad
        ActivityLogger::deleted(Task::class, $id, $taskName);

        return response()->json(['success' => true]);
    }
}