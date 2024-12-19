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

class NewMessageReceived implements ShouldBroadcastNow // Thêm ShouldBroadcastNow ở đây
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $sender;
    public $message;

    public function __construct($sender, $message)
    {
        $this->sender = $sender;
        $this->message = $message;
    }

    // Định nghĩa kênh mà event sẽ được phát
    public function broadcastOn()
    {
        return new Channel('messages'); // Kênh "messages"
    }


    public function broadcastWith()
    {
        return [
            'sender' => [
                'id' => $this->sender->id,
                'name' => $this->sender->name,
                'image'=> $this->sender->image
            ],
            'message' => $this->message,
        ];
    }
}
