<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class OrderItem extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'price',
        'quantity',
        'image',
        'order_id'
    ];

    public function order() {
        return $this->belongsTo(Order::class);
    }
}
