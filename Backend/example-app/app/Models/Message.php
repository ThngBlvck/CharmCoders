<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;
    protected $table = 'messages';
    protected $fillable =
    [
        'sender_id',
        'receiver_id',
        'message',
        'product_id'
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
