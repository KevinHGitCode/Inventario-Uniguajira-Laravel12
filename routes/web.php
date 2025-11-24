<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    HomeController,
    TaskController,
    GoodsController,
    GroupController,
    InventoryController,
    ReportController,
    UserController,
    RecordController
};

// redirect to home
Route::get('/', function () {
    return redirect()->route('home.index');
});

Route::get('home', [HomeController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('home.index');

// profile
Route::get('profile', function () {
    return 'Profile route';
})->name('profile');

// routes.index
Route::middleware('auth')->group(function () {
    Route::get('goods', [GoodsController::class, 'index'])->name('goods.index');
    // Route::get('inventories', [InventoryController::class, 'index'])->name('inventories.index');
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('records', [RecordController::class, 'index'])->name('records.index');
});

// routes for goods
Route::prefix('api/goods')->middleware('auth')->group(function () {
    Route::post('create', [GoodsController::class, 'store'])->name('goods.store');
    Route::post('update', [GoodsController::class, 'update'])->name('goods.update');
    Route::delete('delete/{id}', [GoodsController::class, 'destroy'])->name('goods.destroy');
});


// API para las tareas
Route::prefix('api/tasks')->middleware('auth')->group(function () {
    Route::patch('toggle', [TaskController::class, 'toggle']);
    Route::delete('delete/{id}', [TaskController::class, 'destroy']);
    Route::post('store', [TaskController::class, 'store'])->name('tasks.store');
    Route::put('update', [TaskController::class, 'update'])->name('tasks.update');
});

// 1. Grupos
Route::get('/inventory/groups', [GroupController::class, 'index'])
    ->middleware('auth')
    ->name('inventory.groups');

// INVENTARIO (USANDO UN SOLO CONTROLADOR)
Route::controller(InventoryController::class)->group(function () {

    // 2. Inventarios por grupo
    Route::get('/inventory/{group}/inventories', 'index')
        ->middleware('auth')
        ->name('inventory.inventories');

    // 3. Bienes por inventario
    Route::get('/inventory/{inventory}/goods', 'goodsIndex')
        ->middleware('auth')
        ->name('inventory.goods');

    // 4. Bienes seriales por bien en inventario
    Route::get('/inventory/{inventoryId}/goods/{assetId}/serials', 'serialsIndex')
        ->middleware('auth')
        ->name('inventory.serials');

});

Route::post('/api/inventories/updateEstado', [InventoryController::class, 'updateEstado'])
    ->name('inventories.updateEstado');


// API para inventarios (crear, renombrar, actualizar responsable, eliminar)
Route::prefix('api/inventories')->middleware('auth')->group(function () {
    Route::post('create', [InventoryController::class, 'create'])->name('inventories.create');
    Route::post('rename', [InventoryController::class, 'rename'])->name('inventories.rename');
    Route::post('updateResponsable', [InventoryController::class, 'updateResponsable'])->name('inventories.updateResponsable');
    Route::delete('delete/{id}', [InventoryController::class, 'delete'])->name('inventories.delete');
});


// API para grupos (crear, renombrar, eliminar)
Route::prefix('api/groups')->middleware('auth')->group(function () {
    Route::post('create', [GroupController::class, 'store'])->name('groups.create');
    Route::post('rename', [GroupController::class, 'update'])->name('groups.rename');
    Route::delete('delete/{id}', [GroupController::class, 'destroy'])->name('groups.delete');
});

