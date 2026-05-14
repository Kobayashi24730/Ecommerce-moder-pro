<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = 'addresses';
    protected $fillable = [
        'user_id', 'street', 'number', 'complement',
        'neighborhood', 'city', 'state', 'zipCode',
        'country', 'isDefault'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
