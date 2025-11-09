<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Administrador',
                'username' => 'administrador',
                'email' => 'admin@email.com',
                'password' => Hash::make('1234'),
                'role' => 'administrador'
            ],
            [
                'name' => 'Luis',
                'username' => 'luis',
                'email' => 'luis@email.com',
                'password' => Hash::make('1234'),
                'role' => 'administrador'
            ],
            [
                'name' => 'Renzo',
                'username' => 'renzo',
                'email' => 'renzo@email.com',
                'password' => Hash::make('1234'),
                'role' => 'administrador'
            ],
            [
                'name' => 'Kevin',
                'username' => 'kevin',
                'email' => 'kevin@example.com',
                'password' => Hash::make('12345678'),
                'role' => 'administrador'],
            [
                'name' => 'Consultor',
                'username' => 'consultor',
                'email' => 'consultor@email.com',
                'password' => Hash::make('consul'),
                'role' => 'consultor'
            ],
            [
                'name' => 'Consultora',
                'username' => 'consultora',
                'email' => 'consultora@email.com',
                'password' => Hash::make('consul'),
                'role' => 'consultor'
            ],
            [
                'name' => 'Daniel',
                'username' => 'Danie1l6',
                'email' => 'daniel@email.com',
                'password' => Hash::make('1234'),
                'role' => 'administrador'
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
