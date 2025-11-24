<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\Inventory;
use App\Models\Asset;
use App\Models\AssetEquipment;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{

    // ------------------------------
    // 1. Mostrar TODOS LOS GRUPOS
    // ------------------------------
    public function groupIndex(Request $request)
    {
        $groups = Group::withCount('inventories')->get();

        if ($request->ajax()) {
            return view('inventories.groups', compact('groups'))
                ->renderSections()['content'];
        }

        return view('inventories.groups', compact('groups'));
    }

    // ------------------------------
    // 2. Inventarios de un grupo
    // ------------------------------
    public function inventoryIndex(Request $request, $groupId)
    {
        $group = Group::findOrFail($groupId);

        $inventories = Inventory::where('group_id', $groupId)
            ->select('inventories.*')

            // === COUNT OF DISTINCT ASSETS ===
            ->selectRaw("
                (
                    SELECT COUNT(DISTINCT a.id)
                    FROM asset_inventory ai
                    LEFT JOIN assets a ON ai.asset_id = a.id
                    WHERE ai.inventory_id = inventories.id
                ) AS total_asset_types
            ")

            // === TOTAL AMOUNT = SUM(quantity) + COUNT(serials) ===
            ->selectRaw("
                (
                    SELECT
                        COALESCE((
                            SELECT SUM(aq.quantity)
                            FROM asset_quantities aq
                            WHERE aq.asset_inventory_id IN (
                                SELECT ai2.id
                                FROM asset_inventory ai2
                                WHERE ai2.inventory_id = inventories.id
                            )
                        ), 0)
                        +
                        COALESCE((
                            SELECT COUNT(ae.id)
                            FROM asset_equipments ae
                            WHERE ae.asset_inventory_id IN (
                                SELECT ai3.id
                                FROM asset_inventory ai3
                                WHERE ai3.inventory_id = inventories.id
                            )
                        ), 0)
                ) AS total_assets
            ")

            ->get();

        if ($request->ajax()) {
            return view('inventories.inventories', compact('group', 'inventories'))
                ->renderSections()['content'];
        }

        return view('inventories.inventories', compact('group', 'inventories'));
    }

    // ------------------------------
    // 3. Bienes dentro de un inventario
    // ------------------------------
    public function goodsIndex(Request $request, $inventoryId)
    {
        $inventory = Inventory::findOrFail($inventoryId);

        $assets = DB::table('inventory_goods_view')
            ->where('inventory_id', $inventoryId)
            ->get();

        if ($request->ajax()) {
            return view('inventories.goods-inventory', compact('inventory', 'assets'))
                ->renderSections()['content'];
        }

        return view('inventories.goods-inventory', compact('inventory', 'assets'));
    }

    // -----------------------------------
    // 4. Bienes tipo serial (detalles)
    // -----------------------------------
    public function serialsIndex(Request $request, $inventoryId, $assetId)
    {
        $inventory = Inventory::findOrFail($inventoryId);

        $serials = DB::table('serial_goods_view')
            ->where('inventory_id', $inventoryId)
            ->where('asset_id', $assetId)
            ->get();

        if ($request->ajax()) {
            return view('inventories.serials-goods-inventory',
                compact('inventory', 'serials')
            )->renderSections()['content'];
        }

        return view('inventories.serials-goods-inventory',
            compact('inventory', 'serials')
        );
    }


    // ------------------------------
    // 5. Página principal Inventarios
    // ------------------------------
    public function index(Request $request)
    {
        if ($request->ajax()) {
            return view('inventories.index')->renderSections()['content'];
        }

        return view('inventories.index');
    }


    public function updateEstado(Request $request)
    {
        $request->validate([
            'id_inventario' => 'required|integer|exists:inventories,id',
            'estado' => 'required|integer|in:1,2,3'
        ]);

        $inventory = Inventory::findOrFail($request->id_inventario);

        $inventory->conservation_status = $request->estado; // bueno=1, regular=2, malo=3
        $inventory->updated_at = now();
        $inventory->save();

        return response()->json([
            'success' => true,
            'message' => 'Estado del inventario actualizado exitosamente.'
        ]);
    }

}
