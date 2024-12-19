<?php

namespace App\Http\Controllers\Client;


use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\User;
use App\Models\Product;
use Auth;
use Illuminate\Http\Request;
use App\Models\Order;
class CartController extends Controller
{
    public function getCart($ids) // Nhận IDs từ URL
    {
        // Lấy thông tin người dùng đã đăng nhập
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['error' => 'Không có user_id được cung cấp!'], 400);
        }

        // Chuyển chuỗi IDs thành mảng
        $idArray = explode(',', $ids); // Tách danh sách ID từ đường dẫn

        // Lấy các mục giỏ hàng theo danh sách ID và người dùng
        $carts = Cart::where('user_id', $userId)
            ->whereIn('id', $idArray) // Lọc theo danh sách ID
            ->get();

        if ($carts->isEmpty()) {
            return response()->json(['error' => 'Không tìm thấy sản phẩm nào trong giỏ hàng!'], 404);
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

        $shippingFee = $totalAmount < 500000 ? 30000 : 50000;

        // Trả về thông tin giỏ hàng, tổng tiền và phí ship
        return response()->json([
            'success' => 'Đang tiếp tục thanh toán!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'cart_items' => $carts,
            'total_amount' => $totalAmount,
            'shipping_fee' => $shippingFee,
            'final_amount' => $totalAmount + $shippingFee, // Tổng tiền + phí ship
        ]);
    }

}
