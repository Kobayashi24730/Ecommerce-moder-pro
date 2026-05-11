<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'product';
    protected $fillable = [
        'company_id',
        'name',
        'description',
        'base_price',
        'sku',
        'stock',
        'image'
    ];

    protected $casts = [
        'group_image' => 'array'
    ];

    public function company()
    {
        return $this->belongsTo(Companies::class);
    }

    public function attributes()
    {
        return $this->hasMany(ProductAttributes::class);
    }
}
