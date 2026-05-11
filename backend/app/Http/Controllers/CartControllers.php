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
                'product_id' => 'required|integer|exists:product,id',
                'quantity' => 'required|integer|min:1'
            ]);
            $product = \App\Models\Product::find($validate['product_id']);
            if(!$product){
                return response()->json(['message' => 'Produto não encontrado'], 404);
            }
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
                    'name' => $product->name,
                    'price' => $product->base_price,
                    'image' => $product->image
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
        try {
            $validate = $request->validate([
                'product_id' => 'required|integer|exists:product,id',
                'quantity' => 'required|integer|min:1'
            ]);
            $product = \App\Models\Product::find($validate['product_id']);
            if(!$product){
                return response()->json(['message' => 'Produto não encontrado'], 404);
            }
            $cart = Cart::where('user_id', auth()->id())->first();
            if(!$cart){
                return response()->json(['message' => 'Carrinho não encontrado'], 404);
            }
            $cartItem = CartItem::where('cart_id', $cart->id)->where('product_id', $validate['product_id'])->first();
            if($cartItem) {
                $cartItem->update([
                    'quantity' => $validate['quantity'],
                ]);
            } else {
                return response()->json(['message' => 'Produto não encontrado no carrinho'], 404);
            }
            return response()->json([
                'message' => 'Quantidade do produto atualizada',
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

    public function destroy(Request $request){
        try {
            $validate = $request->validate([
                'product_id' => 'required|integer'
            ]);
            $cart = Cart::where('user_id', auth()->id())->first();
            if(!$cart){
                return response()->json([ 'message' => 'Carrinho não encontrado' ], 404);
            }
            $cartItem = CartItem::where('cart_id', $cart->id)->where('product_id', $validate['product_id'])->first();
            if($cartItem){
                $cartItem->delete();
                return response()->json([
                    'message' => 'Produto removido do carrinho'
                ], 200);
            }
            return response()->json([
                'message' => 'Produto não encontrado no carrinho'
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'debug' => $e->getLine(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}
