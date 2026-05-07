<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
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
Route::middleware('auth:sanctum')->group(function () {
    Route::post('submit-profile', [UserController::class, 'submit_profile']);
    Route::post('logout', [UserController::class, 'logout']);
    Route::get('user/notifications', function (Request $request) {
        return response()->json($request->user()->notifications);
    });
    Route::get('user/coupons', function (Request $request) {
        return response()->json($request->user()->coupons);
    });
    Route::put('user/notification', function (Request $request) {
        try {
            $validate = $request->validate([
                'id' => 'required|integer',
                'read' => 'required|boolean'
            ]);
            $notification = \App\Models\Notification::where('id', $validate['id'])->where('user_id', request()->user()->id)->first();
            if(!$notification){
                return response()->json(['message' => 'Pedido nao encontrado'], 404);
            }
            $notification->read = $request->read;
            $notification->save();
            return response()->json($notification);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    });
    Route::put('user/coupons', function (Request $request) {
        try{
            $validate = $request->validate([
                'id' => 'required|integer',
                'status_id' => 'required|boolean'
            ]);
            $coupon = \App\Models\Coupon::where('id', $validate['id'])->first();
            if(!$coupon){
                return response()->json(['message' => 'Cupom nao encontrado'], 404);
            }
            $coupon->status_id = $request->status_id;
            $coupon->save();
            return response()->json($coupon);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    });
    Route::get('/user/orders', function (Request $request) {
        try {
            $orders = \App\Models\Order::where('user_id', $request->user()->id)
                ->with(['items']) // Carrega os itens
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    });
});
Route::get('me', [UserController::class, 'me']);
