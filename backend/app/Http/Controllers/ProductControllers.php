<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Company;
use App\Models\ProductAttributes;
use Illuminate\Support\Facades\DB;

class ProductControllers extends Controller
{

    public function index(Request $request){
        try {
            $products = Product::with(['attributes', 'company'])->orderBy('created_at', 'desc')->get();
            return response()->json($products);
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
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'stock' => 'required|integer',
                'category_id' => 'required|exists:categories,id',
                'company_id' => 'required|exists:companies,id',
                'attributes' => 'nullable|array',
                'attributes.*.name' => 'required|string',
                'attributes.*.value' => 'required|string',
            ]);
            $product = \DB::transaction(function () use ($validate) {
                $product = Product::create([
                    'company_id' => $validate['company_id'] ?? null,
                    'name' => $validate['name'],
                    'base_price' => $validate['price'],
                ]);

                if(!empty($validate['attributes'])){
                    foreach ($validate['attributes'] as $attr){
                        $product->attributes()->create([
                            'name' => $attr['name'],
                            'value' => $attr['value']
                        ]);
                    }
                }

                return $product;
            });

            return response()->json([
                'message' => 'Produto criado com sucesso!',
                'data' => $product
            ], 201);
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
