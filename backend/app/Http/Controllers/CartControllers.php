<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\DB;
class CartControllers extends Controller
{
    public function index(Request $request){
        try {
            $cart = Cart::with('cart_id', $request->user()->id)->where('items')->first();
            if(!$cart){
                return response()->json(['items' => [], 'total' => 0]);
            }
            return response()->json($cart);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'debug' => $e->getLine(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function store(Request $request){
    }

    public function show(Request $request){
    }

    public function update(Request $request){
    }

    public function destroy(Request $request){
    }
}
