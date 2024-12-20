<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Product;
use App\Events\NewMessageReceived;

class MessageController extends Controller
{
    // Gửi tin nhắn
    public function sendMessage(Request $request)
    {
        // Kiểm tra các trường hợp bắt buộc
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Kiểm tra ảnh nếu có
        ]);

        // Kiểm tra nếu cả `message`, `product_id` và `image` đều trống
        if (
            !$request->has('message') && // Chỉ kiểm tra sự tồn tại, không bắt buộc phải có nội dung
            !$request->filled('product_id') && // Kiểm tra ID sản phẩm có giá trị
            !$request->hasFile('image') // Kiểm tra file ảnh
        ) {
            return response()->json(['error' => 'Tin nhắn, ID sản phẩm hoặc ảnh là bắt buộc.'], 422);
        }

        $sender = Auth::user();
        $receiver = User::findOrFail($request->receiver_id);
        $product = null;

        // Kiểm tra nếu có `product_id` thì tìm sản phẩm
        if ($request->filled('product_id')) {
            $product = Product::findOrFail($request->product_id);
        }

        // Xử lý ảnh nếu có
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('images/message', 'public');

            // Convert đường dẫn thành URL đầy đủ
            $imagePath = asset('storage/' . $imagePath);
        }

        $messageContent = $request->message;

        // Lưu tin nhắn vào cơ sở dữ liệu
        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'message' => $messageContent, // Lưu nội dung tin nhắn nếu có
            'product_id' => $request->product_id, // Lưu ID sản phẩm nếu có
            'image' => $imagePath, // Lưu đường dẫn ảnh nếu có
        ]);

        // Broadcast sự kiện để client nhận được tin nhắn
        broadcast(new MessageSent($messageContent, $sender, $receiver, $product, $imagePath));
        broadcast(new NewMessageReceived($sender, $messageContent));

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
