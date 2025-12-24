<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Task;

class HomeViewTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_sees_task_controls()
    {
        $user = User::factory()->create();
        $user->role = 'administrador';
        $user->save();

        // Crear tareas pendientes y completadas
        Task::create([
            'name' => 'Tarea pendiente',
            'description' => 'Descripcion',
            'date' => now(),
            'status' => 'pending',
            'user_id' => $user->id,
        ]);

        Task::create([
            'name' => 'Tarea completada',
            'description' => 'Descripcion',
            'date' => now(),
            'status' => 'completed',
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get(route('home.index'));

        $response->assertStatus(200)
            ->assertSee('Tareas pendientes')
            ->assertSee('add-task-button')
            ->assertSee('task-checkbox')
            ->assertSee('task-trash-button')
            ->assertSee('Tareas completadas');
    }

    public function test_consultant_sees_only_consultor_info()
    {
        $user = User::factory()->create();
        $user->role = 'consultor';
        $user->save();

        $response = $this->actingAs($user)->get(route('home.index'));

        $response->assertStatus(200)
            ->assertSee('Información del Consultor')
            ->assertDontSee('add-task-button')
            ->assertDontSee('Tareas pendientes');
    }
}
