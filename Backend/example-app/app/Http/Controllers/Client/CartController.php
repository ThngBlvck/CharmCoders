<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function getCart(Request $request)
    {
        // Nhận thông tin người dùng đã đăng nhập
        $userId = auth()->id();
        \Log::info('Auth user ID: ' . $userId);

        // Kiểm tra xem `user_id` có tồn tại hay không
        if (!$userId) {
            return response()->json(['error' => 'Không có user_id được cung cấp!'], 400);
        }

        // Lấy toàn bộ giỏ hàng của người dùng
        $carts = Cart::where('user_id', $userId)->get();

        if ($carts->isEmpty()) {
            return response()->json(['error' => 'Giỏ hàng của bạn trống!'], 400);
        }

        // Lấy thông tin người dùng
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'Không tìm thấy người dùng!'], 404);
        }



        // Tính tổng số tiền trong giỏ hàng
        $totalAmount = $carts->sum(function ($cart) {
            return $cart->price * $cart->quantity;
        });

        // Trả về thông tin giỏ hàng, người dùng và địa chỉ
        return response()->json([
            'success' => 'Đang tiếp tục thanh toán!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'cart_items' => $carts,
            'total_amount' => $totalAmount,
        ]);
    }
}
