<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class review extends Model
{
    protected $fillable = [
        'comment',
        'rating',
        'product_id',
        'user_id'
    ];

}
