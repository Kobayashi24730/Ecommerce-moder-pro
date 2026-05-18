<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;

class AddressControllers extends Controller
{
    public function delAddress(Request $request, $id) {
        try {
            $user = $request->user();
            $address = $user->addresses()->findOrFail($id);
            $address->delete();

            return response()->json([
                'message' => 'Endereço deletado com sucesso!',
                'addresses' => $user->addresses()->get()
            ], 200);
        } catch(\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function setAddressToStandard(Request $request, $id) {
        try {
            $user = $request->user();
            $user->addresses()->update(['isDefault' => false]);
            $address = $user->addresses()->findOrFail($id);
            $address->update(['isDefault' => true]);

            return response()->json([
                'message' => 'Endereço setado como padrão com sucesso!',
                'addresses' => $user->addresses()->get()
            ], 200);
        } catch(\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}
