<?php

use App\Models\Group;
use App\Models\Inventory;

describe('Vista de carga Excel por inventario', function () {

    it('el administrador puede acceder a la vista dedicada de carga Excel del inventario', function () {
        $group = Group::create(['name' => 'Grupo Excel']);
        $inventory = Inventory::create([
            'name' => 'Salon 101',
            'responsible' => 'Coordinacion',
            'conservation_status' => 'good',
            'group_id' => $group->id,
        ]);

        $this->actingAs(adminUser())
            ->get(route('inventory.goods.excel-upload', [
                'groupId' => $group->id,
                'inventoryId' => $inventory->id,
            ]))
            ->assertStatus(200)
            ->assertSee('Carga masiva de bienes')
            ->assertSee('Salon 101')
            ->assertSee('invExcelFileInput')
            ->assertSee('btnEnviarExcelInventario');
    });

    it('retorna 404 si el inventario no pertenece al grupo indicado', function () {
        $group = Group::create(['name' => 'Grupo Uno']);
        $otherGroup = Group::create(['name' => 'Grupo Dos']);
        $inventory = Inventory::create([
            'name' => 'Salon 102',
            'responsible' => 'Coordinacion',
            'conservation_status' => 'good',
            'group_id' => $group->id,
        ]);

        $this->actingAs(adminUser())
            ->get(route('inventory.goods.excel-upload', [
                'groupId' => $otherGroup->id,
                'inventoryId' => $inventory->id,
            ]))
            ->assertStatus(404);
    });
});
