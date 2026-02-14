<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

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

        Task::create([
            'name' => $request->name,
            'description' => $request->description,
            'date' => $request->date,
            'user_id' => Auth::id(),
            'status' => 'pending'
        ]);

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
        $task->update([
            'name' => $request->name,
            'description' => $request->description,
            'date' => $request->date
        ]);

        return response()->json(['success' => true]);
    }

    public function toggle(Request $request)
    {
        $task = Task::findOrFail($request->id);
        $task->status = $task->status === 'pending' ? 'completed' : 'pending';
        $task->save();

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        Task::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}