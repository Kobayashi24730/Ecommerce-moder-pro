<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Models\User;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

//Route::get('/users', function (Request $request) {
//    return User::all();
//});

Route::apiResource('users', UserController::class);
Route::prefix('recuperation')->group(function () {
    Route::post('users', [UserController::class, 'forgot_password']);
    Route::put('users', [UserController::class, 'reset_password']);
});
