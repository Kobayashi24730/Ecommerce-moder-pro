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
        try {
            $notification = \App\Models\Notification::where('user_id', $request->user()->id)->orderBy('created_at', 'desc')->get();
            return response()->json($notification->values());
        } catch (\Exception $e) {
            return response()->json([
                'arquivo' => $e->getFile(),
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ]);
        }
    }
    public function getCoupons (Request $request) {
        try {
            $user = $request->user();
            if(!$user){
                return response()->json(['message' => 'Usuario nao encontrado'], 404);
            }
            $coupons = $user->coupons()->whereDate('start_date', '<=', now()->toDateString())->get();
            return response()->json($coupons);
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
            $user = $request->user();
            $coupon = $user->coupons()->where('coupons.id', $validate['id'])->first();
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
    public function destroy(Request $request,$id){
        try {
            $user = $request->user();
            $Notification = $user->notifications()->where('id', $id)->first();
            if(!$Notification){
                return response()->json(['message' => 'Noticação nao encontrado'], 404);
            }
            $Notification->delete();
            return response()->json(['message' => 'Notificação removido com sucesso']);
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
            $orders = \App\Models\Order::where('user_id', $request->user()->id)->with(['items'])->get();
            //where('user_id', $request->user()->id)
            //   ->with(['items'])
            //    ->orderBy('created_at', 'desc')
            //    ->get();

            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function submit_profile(Request $request){
        try {
            $user = $request->user();
            $validate = $request->validate([
                'name' => 'string|max:255',
                'email' => 'email|unique:users,email,' . $user->id,
                'phone' => 'string',
                'cpf' => 'string',
                'birth_date' => 'string',
                'date_of_user' => 'string',
                'avatar' => 'string',
                'preferences' => 'array',
                'addresses' => 'string',
            ]);
            $user->update([
                'name' => $validate['name'] ?? $user->name,
                'email' => $validate['email'] ?? $user->email,
                'phone' => $validate['phone'] ?? $user->phone,
                'cpf' => $validate['cpf'] ??  $user->cpf,
                'birthdate' => $validate['birthdate'] ?? $user->birthdate,
                'date_of_user' => $validate['date_of_user'] ?? $user->date_of_user,
                'avatar' => $validate['avatar'] ?? $user->avatar,
                'preferences' => $validate['preferences'] ?? $user->preferences,
                'addresses' => $validate['addresses'] ?? $user->addresses,
            ]);
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
        }
    }
}
