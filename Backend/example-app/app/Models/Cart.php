<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    /**
     * Bảng liên kết với model này
     *
     * @var string
     */
    protected $table = 'carts';

    /**
     * Các thuộc tính có thể được gán hàng loạt.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'product_id',
        'price',
        'total_amount',
        'quantity',
    ];

    /**
     * Mối quan hệ với model User.
     * Một giỏ hàng thuộc về một người dùng.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mối quan hệ với model Product.
     * Một giỏ hàng thuộc về một sản phẩm.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
