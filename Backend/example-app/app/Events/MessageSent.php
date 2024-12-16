<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $sender;
    public $receiver;
    public $channelName; 
    public $product; 

    // Khởi tạo sự kiện
    public function __construct($message, $sender, $receiver,$product)
    {
        $this->message = $message;
        $this->sender = $sender;
        $this->receiver = $receiver;
        $this->product = $product;

        // Tạo tên kênh cố định cho admin và user
        $this->channelName = 'chat.' . min($sender->id, $receiver->id) . '_' . max($sender->id, $receiver->id);
    }

    // Chỉ định channel mà sự kiện này sẽ được broadcast
    public function broadcastOn()
    {
        return new Channel($this->channelName);  // Phát lên kênh cố định
    }

    // Dữ liệu broadcast
    public function broadcastWith()
    {
        return [
            'message' => $this->message,
            'sender' => $this->sender,
            'receiver' => $this->receiver,
            'product' => $this->product,
        ];
    }

    // Lưu tin nhắn vào cơ sở dữ liệu
    public static function storeMessage($message, $sender, $receiver)
    {
        return Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'message' => $message,
        ]);
    }
}
