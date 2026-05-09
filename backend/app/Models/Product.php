<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'company_id',
        'name',
        'description',
        'base_price',
        'sku',
        'stock'
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
