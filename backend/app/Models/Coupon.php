<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = ['code', 'description', 'min_value', 'tag', 'start_date', 'expiry_date', 'image'];

    public function users() {
        return $this->belongsToMany(User::class);
    }
}
