<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\Address;
use App\Models\Order;

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
    public function checkout(Request $request) {
        return DB::transaction(function () use ($request) {
            $user = $request->user();
            $cartItem = $request->items;
            $total = 0;
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'total' => 0,
                'address_id' => $request->address_id,
                'payment_method' => $request->payment_method
            ]);

            foreach ($cartItem as $item) {
                $product = Product::findOrFail($item['product_id']);
                if($product->stock >= $item['quantity']) {
                    throw new \Exception('Quantidade insuficiente em estoque');
                }
                $product->decrement('stock', $item['quantity']);
                $subtotal = $product->base_price * $item['quantity'];
                $total += $subtotal;

                $order->items()->create([
                    'user_id' => $user->id,
                    'total' => $total,
                    'status' => 'pending',
                    'address_id' => $request->address_id,
                    'payment_method' => $request->payment_method
                ]);
            }

            $order->update(['total' => $total]);
            return response()->json([
                'message' => 'Pedido realizado com sucesso',
                'order' => $order
            ], 200);
        });
    }

    public function new_adress(Request $request){
        try {
            $validate = $request->validate([
                'user_id' => 'required|integer|exists:user,id',
                'street' => 'required|string|max:255',
                'number' => 'required|string|max:255',
                'complement' => 'string|max:255',
                'neighborhood' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'state' => 'required|string|max:255',
                'zipCode' => 'required|string|max:255',
                'country' => 'required|string|max:255',
                'isDefault' => 'boolean'
            ]);
            $user = $request()->user();
            if($request->isDefault) {
                $user->adresses()->update([ 'isDefault' => false ]);
            }
            $adress = $user->adresses()->create($validate);
            return response()->json([
                'message' => 'Endereço criado com sucesso',
                'adress' => $adress
            ], 200);
        } catch(\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'debug' => $e->getLine(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
        }
    }
}
