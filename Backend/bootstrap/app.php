<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    
    ->withMiddleware(function (Middleware $middleware) {
        
        $middleware->validateCsrfTokens(except: [
        
            'http://localhost:8000/todos',
            'http://127.0.0.1:8000/todos',
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'http://localhost:5173/todos',
            'http://localhost:8000/todos',
            'http://localhost:8000/todos/*',
            'http://127.0.0.1:8000/todos/*',


        ]);
        header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();


    