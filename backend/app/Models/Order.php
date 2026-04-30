<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OrderItem;

class Order extends Model
{
    protected $fillable = ['user_id', 'total', 'status', 'address_snapshot', 'payment_method_snapshot'];
    protected $appends = ['address', 'paymentMethod'];
    protected $casts = [
        'address_snapshot' => 'array',
        'payment_method_snapshot' => 'array',
        'total' => 'float'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function items() {
        return $this->hasMany(OrderItem::class);
    }
    public function getAddressAttribute()
    {
        return $this->address_snapshot;
    }
    public function getPaymentMethodAttribute()
    {
        return $this->payment_method_snapshot;
    }
}
