<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class SessionTimeout
{
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            $lastActivity = session('last_activity');
            $timeout = config('session.lifetime') * 60;

            if ($lastActivity && (time() - $lastActivity > $timeout)) {
                Auth::logout();
                session()->flush();
                return redirect('/')->with('error', 'Session expired. Please login again.');
            }
            session(['last_activity' => time()]);
        }
        return $next($request);
    }
}