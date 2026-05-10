<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
class CartControllers extends Controller
{
    public function index(Request $request){
        try {
            $cart = Cart::with('items')->where('user_id', auth()->id())->first();
            if(!$cart){
                return response()->json(['items' => [], 'total' => 0]);
            }
            $subtotal = $cart->items->sum(function($item) {
                return $item->quantity * $item->price;
            });
            return response()->json([
                'id' => $cart->id,
                'items' => $cart->items,
                'subtotal' => $subtotal
            ]);
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
        try {
            $validate = $request->validate([
                'product_id' => 'required|integer',
                'quantity' => 'required|integer|min:1'
            ]);
            $cart = Cart::firstOrCreate([
                'user_id' => auth()->id()
            ]);
            $cartItem = CartItem::where('cart_id', $cart->id)->where('product_id', $validate['product_id'])->first();
            if($cartItem){
                $cartItem->increment('quantity', $validate['quantity']);
            } else {
                $cartItem = cartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $validate['product_id'],
                    'quantity' => $validate['quantity'],
                    'name' => $request->product ?? 'Produto Desconecido',
                    'price' => $request->product ?? 0,
                    'image' => $request->product ?? ''
                ]);
            }

            return response()->json([
                'message' => 'Produto adicionado ao carrinho',
                'cart_item' => $cartItem
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'debug' => $e->getLine(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function show(Request $request){
    }

    public function update(Request $request){
    }

    public function destroy(Request $request){
    }
}
