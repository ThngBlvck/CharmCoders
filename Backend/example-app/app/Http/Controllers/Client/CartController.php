<?php

namespace App\Http\Controllers\Client;


use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\User;
use App\Models\Product;
use Auth;
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

    public function buyNow(Request $request, $productId)
    {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        if (!Auth::check()) {
            return response()->json(['error' => 'Người dùng chưa đăng nhập!'], 401);
        }

        // Nhận thông tin người dùng đã đăng nhập
        $user = Auth::user();

        // Bắt product_id và tìm sản phẩm từ database
        try {
            $product = Product::findOrFail($productId);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Sản phẩm không tồn tại!'], 404);
        }

        // Lấy số lượng từ request body (mặc định là 1 nếu không có)
        $quantity = $request->input('quantity', 1);

        // Kiểm tra số lượng hợp lệ
        if ($quantity < 1) {
            return response()->json(['error' => 'Số lượng phải lớn hơn hoặc bằng 1!'], 400);
        }

        // Tính tổng tiền
        $totalAmount = $product->getPrice() * $quantity;

        // Lưu vào giỏ hàng
        Cart::create([
            'user_id' => $user->id,
            'product_id' => $productId,
            'quantity' => $quantity,
            'price' => $product->getPrice(),
            'total_amount' => $totalAmount,
        ]);

        // Trả về thông tin thanh toán
        return response()->json([
            'success' => 'Đã thêm sản phẩm vào giỏ hàng!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->getPrice(),
            ],
            'quantity' => $quantity,
            'total_amount' => $totalAmount,
        ], 200);
    }


}
