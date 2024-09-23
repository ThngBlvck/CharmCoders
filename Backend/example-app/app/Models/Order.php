<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /**
     * Tên bảng tương ứng trong cơ sở dữ liệu.
     *
     * @var string
     */
    protected $table = 'orders';

    /**
     * Các thuộc tính có thể được gán hàng loạt.
     *
     * @var array
     */
    protected $fillable = [
        'total_amount',
        'address',
        'status',
        'user_id', // khóa ngoại cho người dùng
    ];

    /**
     * Quan hệ với model `User`.
     * Một đơn hàng thuộc về một người dùng.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
