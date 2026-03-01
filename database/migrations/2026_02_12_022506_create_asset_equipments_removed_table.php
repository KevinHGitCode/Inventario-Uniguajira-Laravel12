<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('asset_equipments_removed', function (Blueprint $table) {
            $table->id();
            $table->string('name');  // Nombre del bien
            $table->string('image')->nullable();  // Imagen del bien
            $table->text('description')->nullable();
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('serial');
            $table->enum('status', ['activo', 'inactivo', 'en_mantenimiento'])->default('activo');
            $table->string('color')->nullable();
            $table->text('technical_conditions')->nullable();
            $table->date('entry_date')->nullable();
            $table->date('exit_date')->nullable();
            $table->text('reason')->nullable();  // Motivo de la baja
            $table->foreignId('asset_id')->constrained('assets')->onDelete('cascade');
            $table->foreignId('inventory_id')->constrained('inventories')->onDelete('cascade');
            $table->foreignId('equipment_id')->nullable();  // ID del equipo original
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_equipments_removed');
    }
};