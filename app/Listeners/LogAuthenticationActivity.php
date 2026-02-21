<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use App\Helpers\ActivityLogger;

class LogAuthenticationActivity
{
    /**
     * Manejar evento de login
     */
    public function handleLogin(Login $event)
    {
        ActivityLogger::login($event->user->username);
    }

    /**
     * Manejar evento de logout
     */
    public function handleLogout(Logout $event)
    {
        if ($event->user) {
            ActivityLogger::logout($event->user->username);
        }
    }

    /**
     * Registrar los listeners
     */
    public function subscribe($events)
    {
        $events->listen(
            Login::class,
            [LogAuthenticationActivity::class, 'handleLogin']
        );

        $events->listen(
            Logout::class,
            [LogAuthenticationActivity::class, 'handleLogout']
        );
    }
}