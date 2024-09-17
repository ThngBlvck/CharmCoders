<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    // Xác định bảng liên kết với model
    protected $table = 'brands';

    // Các thuộc tính có thể được gán đại trà
    protected $fillable = [
        'name',
        'image',
    ];

    // Nếu bạn muốn sử dụng các thuộc tính khác mà không phải là các thuộc tính mặc định,
    // bạn có thể định nghĩa chúng ở đây.

    // Ví dụ: Định nghĩa các thuộc tính không cần thiết cho gán đại trà
    protected $guarded = []; // Nếu bạn không muốn dùng `$fillable`, bạn có thể sử dụng `$guarded`

    // Các thuộc tính bạn có thể muốn sử dụng
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
