<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class MessageController extends Controller
{
    // Gửi tin nhắn
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:255',
            'receiver_id' => 'required|exists:users,id',
        ]);

        $sender = Auth::user();
        $receiver = User::findOrFail($request->receiver_id);
        $messageContent = $request->message;

        // Lưu tin nhắn vào cơ sở dữ liệu
        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'message' => $messageContent,
        ]);

        // Broadcast sự kiện để tin nhắn hiển thị ở phía client
        broadcast(new MessageSent($messageContent, $sender, $receiver));

        return response()->json(['status' => 'Message sent']);
    }

    // Lấy danh sách tin nhắn giữa 2 người
    public function getMessages($receiver_id)
    {
        $sender = Auth::user();
        $messages = Message::where(function ($query) use ($sender, $receiver_id) {
            $query->where('sender_id', $sender->id)
                ->where('receiver_id', $receiver_id);
        })
            ->orWhere(function ($query) use ($sender, $receiver_id) {
                $query->where('sender_id', $receiver_id)
                    ->where('receiver_id', $sender->id);
            })
            ->orderBy('created_at', 'asc') 
            ->get();
    
        return response()->json($messages);
    }
    


public function getUsersWhoSentMessages()
{
    $admin = Auth::user();

    if ($admin->role_id != '2') {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    // Lấy danh sách tin nhắn
    $users = Message::where('receiver_id', $admin->id)
        ->with(['sender:id,name,email,image'])
        ->orderBy('created_at', 'desc')
        ->get()
        ->groupBy('sender_id')
        ->map(function ($messages) {
            return $messages->first();
        })
        ->values()
        ->map(function ($message) use ($admin) {
            // Phát sự kiện MessageSent cho mỗi người gửi
            broadcast(new MessageSent(
                $message->message,
                $message->sender,
                $admin // Admin là người nhận
            ))->toOthers();

            return [
                'sender' => $message->sender,
                'latest_message' => $message->message,
                'sent_at' => $message->created_at,
            ];
        });

    return response()->json($users);
}



}
