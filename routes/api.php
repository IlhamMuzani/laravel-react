<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/user/{kode_user}', [\App\Http\Controllers\Api\AuthController::class, 'getUser']);
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [\App\Http\Controllers\Api\AuthController::class, 'user'])->middleware('auth:sanctum');
Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
Route::get('/departemen', [\App\Http\Controllers\Api\DepartemenController::class, 'index']);
Route::post('/departemen/add', [\App\Http\Controllers\Api\DepartemenController::class, 'add']);
Route::delete('/departemen/{id}', [\App\Http\Controllers\Api\DepartemenController::class, 'delete']);
Route::get('/departemen/{id}/edit', [\App\Http\Controllers\Api\DepartemenController::class, 'edit']);
Route::put('/departemen/{id}', [\App\Http\Controllers\Api\DepartemenController::class, 'update']);

Route::get('/karyawan', [\App\Http\Controllers\Api\KaryawanController::class, 'index']);
Route::post('/karyawan/add', [\App\Http\Controllers\Api\KaryawanController::class, 'add']);
Route::delete('/karyawan/{id}', [\App\Http\Controllers\Api\KaryawanController::class, 'delete']);
Route::get('/karyawan/{id}/edit', [\App\Http\Controllers\Api\KaryawanController::class, 'edit']);
Route::put('/karyawan/{id}', [\App\Http\Controllers\Api\KaryawanController::class, 'update']);