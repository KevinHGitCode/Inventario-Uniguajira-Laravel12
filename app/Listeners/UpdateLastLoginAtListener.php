<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;

class UpdateLastLoginAtListener
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        if ($event->user) {
            $event->user->update([
                'last_login_at' => now(),
            ]);
        }
    }
}
