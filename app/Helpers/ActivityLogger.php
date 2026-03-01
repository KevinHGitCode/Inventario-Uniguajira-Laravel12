<?php

namespace App\Helpers;

use App\Models\ActivityLog;

class ActivityLogger
{
    /**
     * Registrar inicio de sesión
     */
    public static function login(string $username): void
    {
        ActivityLog::record(
            'login',
            "Inició sesión el usuario: {$username}"
        );
    }

    /**
     * Registrar cierre de sesión
     */
    public static function logout(string $username): void
    {
        ActivityLog::record(
            'logout',
            "Cerró sesión el usuario: {$username}"
        );
    }

    /**
     * Registrar creación de registro
     */
    public static function created(string $model, int $id, string $name): void
    {
        $modelName = class_basename($model);

        ActivityLog::record(
            'create',
            "Creó {$modelName}: {$name}",
            [
                'model'    => $modelName,
                'model_id' => $id,
            ]
        );
    }

    /**
     * Registrar actualización de registro
     */
    public static function updated(string $model, int $id, string $name, array $oldValues = [], array $newValues = []): void
    {
        $modelName = class_basename($model);

        ActivityLog::record(
            'update',
            "Actualizó {$modelName}: {$name}",
            [
                'model'      => $modelName,
                'model_id'   => $id,
                'old_values' => $oldValues,
                'new_values' => $newValues,
            ]
        );
    }

    /**
     * Registrar eliminación de registro
     */
    public static function deleted(string $model, int $id, string $name): void
    {
        $modelName = class_basename($model);

        ActivityLog::record(
            'delete',
            "Eliminó {$modelName}: {$name}",
            [
                'model'    => $modelName,
                'model_id' => $id,
            ]
        );
    }

    /**
     * Registrar restauración de registro
     */
    public static function restored(string $model, int $id, string $name): void
    {
        $modelName = class_basename($model);

        ActivityLog::record(
            'restore',
            "Restauró {$modelName}: {$name}",
            [
                'model'    => $modelName,
                'model_id' => $id,
            ]
        );
    }

    /**
     * Registrar visualización de registro
     */
    public static function viewed(string $model, int $id, string $name): void
    {
        $modelName = class_basename($model);

        ActivityLog::record(
            'view',
            "Visualizó {$modelName}: {$name}",
            [
                'model'    => $modelName,
                'model_id' => $id,
            ]
        );
    }

    /**
     * Registrar dar de baja un bien
     */
    public static function removed(string $model, int $id, string $name, string $inventoryName = '', string $reason = ''): void
    {
        $modelName = class_basename($model);

        ActivityLog::record(
            'remove',
            "Dio de baja {$modelName}: {$name}" . ($inventoryName ? " en inventario: {$inventoryName}" : ''),
            [
                'model'      => $modelName,
                'model_id'   => $id,
                'new_values' => array_filter([
                    'inventory' => $inventoryName,
                    'reason'    => $reason,
                ]),
            ]
        );
    }

    /**
     * Registrar acción personalizada
     */
    public static function custom(string $action, string $description, array $data = []): void
    {
        ActivityLog::record($action, $description, $data);
    }
}