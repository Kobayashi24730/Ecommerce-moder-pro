<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        return view('profile.index');
    }
    public function show($id)
{
    // Lógica para mostrar um perfil específico
    return response()->json(\App\Models\User::find($id));
}
    public function GetNotifications(Request $request) {
        return response()->json($request->user()->notifications);
    }
    public function getCoupons (Request $request) {
        try {
            $user = \App\Models\User::with(['coupons' => function($query) {
                $query->whereDate('expiry_date', '>=', now()->toDateString());
            }])->find($request->user()->id);

            return response()->json($user->coupons);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }
    public function HandleReadNotification (Request $request) {
        try {
            $request->validate([
                'id' => 'required',
                'read' => 'required'
            ]);
            $id = $request->input('id');
            $read = $request->input('read');
            //$find_id = is_array($validate['id']) ? $validate[0] : $validate['id'];
            $notification = \App\Models\Notification::where('id', $id)->where('user_id', $request->user()->id)->first();
            if(!$notification){
                return response()->json(['message' => 'Notificacao nao encontrada'], 404);
            }
            $notification->read = $read;
            $notification->save();
            return response()->json($notification);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
    public function HandleStatusCoupon (Request $request) {
        try{
            $validate = $request->validate([
                'id' => 'required|integer',
                'status_id' => 'required|boolean'
            ]);
            $coupon = \App\Models\Coupon::where('id', $validate['id'])->where('user_id', $request->user()->id)->first();
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
    }
    public function delCoupon(Request $request){
        try {
            $id = $request->input('id');
            $coupon = \App\Models\Coupon::where('id', $id)->where('user_id', $request->user()->id)->first();
            if(!$coupon){
                return response()->json(['message' => 'Cupom nao encontrado'], 404);
            }
            $coupon->delete();
            return response()->json(['message' => 'Cupom removido com sucesso']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
    public function getOrder (Request $request) {
        try {
            $orders = \App\Models\Order::where('user_id', $request->user()->id)
                ->with(['items'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
