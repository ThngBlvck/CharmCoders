<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Product;

class MessageController extends Controller
{
    // Gửi tin nhắn
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
        ]);

        // Kiểm tra nếu cả `message` và `product_id` cùng trống
        if (!$request->filled('message') && !$request->filled('product_id')) {
            return response()->json(['error' => 'Tin nhắn hoặc ID sản phẩm là bắt buộc.'], 422);
        }

        $sender = Auth::user();
        $receiver = User::findOrFail($request->receiver_id);
        if ($request->product_id) {
            $product = Product::findOrFail($request->product_id);
        } else {
            $product = null;
        }
        $messageContent = $request->message;

        // Lưu tin nhắn vào cơ sở dữ liệu
        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'message' => $request->message, // Lưu nội dung tin nhắn nếu có
            'product_id' => $request->product_id, // Lưu ID sản phẩm nếu có
        ]);

        // Broadcast sự kiện để client nhận được tin nhắn
        broadcast(new MessageSent($messageContent, $sender, $receiver, $product));

        return response()->json(['status' => 'Message sent', 'message' => $message]);
    }

    // Lấy danh sách tin nhắn giữa 2 người

    public function getMessages($receiver_id)
    {
        $sender = Auth::user();

        // Lấy tin nhắn giữa hai người
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

        // Thêm thông tin sản phẩm nếu `product_id` tồn tại
        $messages->each(function ($message) {
            if ($message->product_id) {
                $product = Product::find($message->product_id); // Truy vấn sản phẩm theo ID
                if ($product) {
                    $message->product = [
                        'id' => $product->id,
                        'name' => $product->name,
                        'unit_price' => $product->unit_price,
                        'sale_price' => $product->sale_price,
                        'image' => $product->image,
                    ]; // Thêm chi tiết sản phẩm
                }
            }
        });

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

                return [
                    'sender' => $message->sender,
                    'latest_message' => $message->message,
                    'sent_at' => $message->created_at,
                ];
            });

        return response()->json($users);
    }
}
