<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Companies extends Model
{
    protected $fillable = [
        'name',
        'cnpj',
        'logo',
        'slug'
    ];

    public function products()
    {
        return $this->hasMany(Products::class);
    }
}
