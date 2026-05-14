<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CartControllers;
use App\Http\Controllers\ProductControllers;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use App\Models\Order;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

//Route::get('/users', function (Request $request) {
//    return User::all();
//});

Route::post('login', [UserController::class, 'login']);
Route::apiResource('users', UserController::class);
Route::prefix('recuperation')->group(function () {
    Route::post('users', [UserController::class, 'forgot_password']);
    Route::put('users', [UserController::class, 'reset_password']);
});
Route::apiResource('products', ProductControllers::class);
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('cart', CartControllers::class)->except(['destroy', 'update']);
    Route::put('cart', [CartControllers::class, 'update']);
    Route::delete('cart', [CartControllers::class, 'destroy']);
    Route::post('logout', [UserController::class, 'logout']);
    Route::apiResource('profile', ProfileController::class);
    Route::get('profile-data/notifications', [ProfileController::class, 'GetNotifications']);
    Route::get('profile-data/coupons', [ProfileController::class, 'getCoupons']);
    Route::put('profile-data/notification', [ProfileController::class, 'HandleReadNotification']);
    Route::put('profile-data/coupons', [ProfileController::class, 'handleStatusCoupon']);
    Route::get('profile-data/orders', [ProfileController::class, 'getOrder']);
    Route::post('profile-data/submit-profile', [ProfileController::class, 'submit_profile']);
    Route::post('profile-data/new-adress', [ProfileController::class, 'new_adress']);
    Route::get('profile-data/address', [ProfileController::class, 'getAddress']);

});
Route::get('me', [UserController::class, 'me']);
